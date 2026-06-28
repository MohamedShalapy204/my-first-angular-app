import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { supabase } from './supabase';
import { AuthService } from './auth.service';
import { NotificationService } from './notification';
import type { CartItemWithProduct } from '../models/frontend/cart';
import type { MergeData, MergeItem, MergeChoices } from '../models/frontend/cart';

/** localStorage key for guest cart persistence. */
const CART_STORAGE_KEY = 'lumina-cart';

/**
 * CartService — manages shopping cart state with signals.
 *
 * State:
 * - `_items` signal: cart items with product data
 * - `loading` signal: true while fetching from server
 * - `_isLoading` flag: suppresses effects during load/sync
 * - `_syncEnabled` flag: only sync to server after first loadCart()
 *
 * Effects:
 * - Auto-save to localStorage when items change
 * - Auto-sync to Supabase when authenticated (after first loadCart)
 *
 * @example
 * ```typescript
 * const cart = inject(CartService);
 *
 * // Read state
 * cart.cartItems();      // CartItemWithProduct[]
 * cart.cartCount();      // number
 * cart.subtotal();       // number
 *
 * // Mutations
 * await cart.addItem(product, userId);
 * await cart.loadCart(userId);
 * ```
 */
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly _authService = inject(AuthService);
  private readonly _notification = inject(NotificationService);

  /** Cart items signal. */
  private readonly _items = signal<CartItemWithProduct[]>([]);

  /** Read-only accessor for cart items. */
  readonly cartItems = this._items.asReadonly();

  /** Number of items in cart. */
  readonly cartCount = computed(() => this._items().reduce((sum, item) => sum + item.quantity, 0));

  /** Cart subtotal (price × quantity for each item). */
  readonly subtotal = computed(() =>
    this._items().reduce((sum, item) => {
      const price = item.products?.price ?? 0;
      return sum + price * item.quantity;
    }, 0),
  );

  /** True while loading cart from server. */
  readonly loading = signal<boolean>(false);

  /** When true, suppresses auto-save effects (during load, sync, merge). */
  private _isLoading = false;

  /** Only enable server sync after first loadCart(). Prevents overwriting server with local data. */
  private _syncEnabled = false;

  /** Debounce timer ID for server sync. */
  private _syncTimer: ReturnType<typeof setTimeout> | null = null;

  /**
   * Last-synced state snapshot (product_id → quantity).
   * Used to diff against current state and only upsert changed items.
   */
  private _lastSyncedState = new Map<number, number>();

  constructor() {
    // Load guest cart from localStorage on construction
    this._isLoading = true;
    this._loadFromLocalStorage();
    this._isLoading = false;

    // Auto-save to localStorage whenever items change (skip during loads)
    effect(() => {
      const items = this._items();
      if (!this._isLoading) {
        this._saveToLocalStorage(items);
      }
    });

    // Auto-sync to Supabase when authenticated (skip during loads or before first loadCart)
    effect(() => {
      const _items = this._items();
      const user = this._authService.user();
      if (!this._isLoading && this._syncEnabled && user) {
        this._debouncedSyncToServer(user.id);
      }
    });
  }

  // ─── Public Methods ────────────────────────────────────────────────────────

  /**
   * Load cart from Supabase server and sync to localStorage.
   *
   * @param userId - Authenticated user's ID
   */
  async loadCart(userId: string): Promise<void> {
    this.loading.set(true);
    this._isLoading = true;

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*, products(name, price, image_url, stock)')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      this._items.set(data as CartItemWithProduct[]);

      // Initialize diff snapshot
      this._lastSyncedState = new Map(
        (data as CartItemWithProduct[]).map((i) => [i.product_id, i.quantity]),
      );

      // Sync server state to localStorage
      this._saveToLocalStorage();

      // Enable server sync now that we've loaded from server
      this._syncEnabled = true;

      await this._processRetryQueue(userId);
    } catch {
      this._notification.show('Failed to load cart', 'error');
    } finally {
      this.loading.set(false);
      this._isLoading = false;
    }
  }

  /**
   * Add an item to the cart.
   *
   * @param productId - Product ID to add
   * @param quantity - Quantity to add (default 1)
   * @param productData - Optional product data for optimistic update
   * @param userId - Optional user ID for server sync
   */
  async addItem(
    productId: number,
    quantity = 1,
    productData?: { name: string; price: number; image_url: string | null; stock: number },
    userId?: string,
  ): Promise<void> {
    const currentItems = this._items();
    const existing = currentItems.find((i) => i.product_id === productId);

    // Cap at stock
    const currentQty = existing?.quantity ?? 0;
    const maxQty = productData?.stock ?? existing?.products?.stock ?? Infinity;
    const newQty = Math.min(currentQty + quantity, maxQty);

    if (newQty === currentQty) return; // Already at max

    // Optimistic update
    if (existing) {
      this._items.set(
        currentItems.map((i) => (i.product_id === productId ? { ...i, quantity: newQty } : i)),
      );
    } else {
      this._items.set([
        ...currentItems,
        {
          id: 0,
          user_id: userId ?? '',
          product_id: productId,
          quantity: newQty,
          created_at: new Date().toISOString(),
          products: productData
            ? {
                name: productData.name,
                price: productData.price,
                image_url: productData.image_url ?? '',
                stock: productData.stock,
              }
            : undefined,
        } as CartItemWithProduct,
      ]);
    }

    // Sync to Supabase if authenticated
    if (userId) {
      try {
        const { error } = await supabase.from('cart_items').upsert(
          {
            user_id: userId,
            product_id: productId,
            quantity: newQty,
          },
          { onConflict: 'user_id,product_id' },
        );
        if (error) throw error;

        // Update diff snapshot
        this._lastSyncedState.set(productId, newQty);
      } catch {
        // Rollback on error
        this._items.set(currentItems);
        this._lastSyncedState.delete(productId);
      }
    }
  }

  /**
   * Update quantity for a cart item.
   *
   * @param productId - Product ID to update
   * @param newQuantity - New quantity (0 = remove)
   * @param userId - Optional user ID for server sync
   */
  async updateQuantity(productId: number, newQuantity: number, userId?: string): Promise<void> {
    const currentItems = this._items();
    const item = currentItems.find((i) => i.product_id === productId);
    if (!item) return;

    // Cap at stock
    const stock = item.products?.stock ?? Infinity;
    const cappedQty = Math.min(newQuantity, stock);

    if (cappedQty === item.quantity) return; // No change

    // Optimistic update
    this._items.set(
      currentItems.map((i) => (i.product_id === productId ? { ...i, quantity: cappedQty } : i)),
    );

    // Sync to Supabase if authenticated
    if (userId) {
      try {
        const { error } = await supabase.from('cart_items').upsert(
          {
            user_id: userId,
            product_id: productId,
            quantity: cappedQty,
          },
          { onConflict: 'user_id,product_id' },
        );
        if (error) throw error;

        // Update diff snapshot
        this._lastSyncedState.set(productId, cappedQty);
      } catch {
        // Rollback on error
        this._items.set(currentItems);
      }
    }
  }

  /**
   * Remove an item from the cart.
   *
   * @param productId - Product ID to remove
   * @param userId - Optional user ID for server sync
   */
  async removeItem(productId: number, userId?: string): Promise<void> {
    const currentItems = this._items();

    // Optimistic update
    this._items.set(currentItems.filter((i) => i.product_id !== productId));

    // Sync to Supabase if authenticated
    if (userId) {
      try {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', userId)
          .eq('product_id', productId);
        if (error) throw error;

        // Update diff snapshot
        this._lastSyncedState.delete(productId);
      } catch {
        // Rollback on error
        this._items.set(currentItems);
      }
    }
  }

  /**
   * Clear all items from the cart.
   *
   * @param userId - Optional user ID for server sync
   */
  async clearCart(userId?: string): Promise<void> {
    const currentItems = this._items();

    // Optimistic update
    this._items.set([]);

    // Sync to Supabase if authenticated
    if (userId) {
      try {
        const { error } = await supabase.from('cart_items').delete().eq('user_id', userId);
        if (error) throw error;

        // Clear diff snapshot
        this._lastSyncedState.clear();
      } catch {
        // Rollback on error
        this._items.set(currentItems);
      }
    }
  }

  /**
   * Sync guest cart (localStorage) to Supabase server cart.
   * For authenticated users who had items before logging in.
   *
   * @param userId - Authenticated user's ID
   */
  async syncLocalToServer(userId: string): Promise<void> {
    const localItems = this._items();
    if (localItems.length === 0) return;

    try {
      // Get existing server items
      const { data: serverItems } = await supabase
        .from('cart_items')
        .select('product_id, quantity')
        .eq('user_id', userId);

      const serverMap = new Map(
        (serverItems as { product_id: number; quantity: number }[])?.map((i) => [
          i.product_id,
          i.quantity,
        ]) ?? [],
      );

      // Upsert each local item
      for (const item of localItems) {
        const serverQty = serverMap.get(item.product_id);
        if (serverQty !== item.quantity) {
          await supabase.from('cart_items').upsert(
            {
              user_id: userId,
              product_id: item.product_id,
              quantity: item.quantity,
            },
            { onConflict: 'user_id,product_id' },
          );
        }
      }

      // Reload from server to get IDs and timestamps
      await this.loadCart(userId);
    } catch {
      this._notification.show('Failed to sync cart', 'error');
    }
  }

  /**
   * Check if a cart merge is needed between local (localStorage) and server carts.
   *
   * @param userId - Authenticated user's ID
   * @returns true if carts differ and merge page should be shown
   */
  async checkMergeNeeded(userId: string): Promise<boolean> {
    // No local items = no merge needed
    const localItems = this._items();
    if (localItems.length === 0) return false;

    try {
      const { data: serverItems, error } = await supabase
        .from('cart_items')
        .select('product_id, quantity')
        .eq('user_id', userId);

      if (error) throw error;

      // No server items = no merge needed
      if (!serverItems || serverItems.length === 0) return false;

      // Build lookup maps
      const localMap = new Map(localItems.map((i) => [i.product_id, i.quantity]));
      const serverMap = new Map(serverItems.map((i) => [i.product_id, i.quantity]));

      // Different item count = conflict
      if (localMap.size !== serverMap.size) return true;

      // Same count but different quantities = conflict
      for (const [id, qty] of localMap) {
        if (serverMap.get(id) !== qty) return true;
      }

      // Carts are identical
      return false;
    } catch {
      // On error, don't block navigation
      return false;
    }
  }

  /**
   * Get merge data for the merge page.
   *
   * @param userId - Authenticated user's ID
   * @returns Merge data with items from both carts, or null on error
   */
  async getMergeData(userId: string): Promise<MergeData | null> {
    const localItems = this._items();

    try {
      const { data: serverItems, error } = await supabase
        .from('cart_items')
        .select('*, products(name, price, image_url, stock)')
        .eq('user_id', userId);

      if (error) throw error;

      // Build lookup maps
      const localMap = new Map(localItems.map((i) => [i.product_id, i]));
      const serverMap = new Map(
        (serverItems as CartItemWithProduct[]).map((i) => [i.product_id, i]),
      );

      // Collect all unique product IDs
      const allIds = new Set([...localMap.keys(), ...serverMap.keys()]);

      const items: MergeItem[] = [];
      let conflictCount = 0;

      for (const id of allIds) {
        const local = localMap.get(id);
        const server = serverMap.get(id);
        const localQty = local?.quantity ?? 0;
        const serverQty = server?.quantity ?? 0;

        // Determine source
        let source: 'both' | 'local' | 'server';
        if (localQty > 0 && serverQty > 0) {
          if (localQty !== serverQty) {
            source = 'both';
            conflictCount++;
          } else {
            source = 'both';
          }
        } else if (localQty > 0) {
          source = 'local';
        } else {
          source = 'server';
        }

        // Get product info (from whichever side has it)
        const productData = local?.products ?? server?.products;

        items.push({
          product_id: id,
          product_name: productData?.name ?? `Product #${id}`,
          image_url: productData?.image_url ?? '',
          local_quantity: localQty,
          server_quantity: serverQty,
          stock: productData?.stock ?? 0,
          source,
        });
      }

      return {
        has_items: items.length > 0,
        has_conflicts: conflictCount > 0,
        items,
        conflict_count: conflictCount,
      };
    } catch {
      return null;
    }
  }

  /**
   * Apply merge choices from the merge page.
   *
   * @param choices - Map of product_id → chosen quantity (0 = discard)
   * @param userId - Authenticated user's ID
   * @returns Warnings (e.g., stock cap applied)
   */
  async applyMerge(choices: MergeChoices, userId: string): Promise<string[]> {
    const warnings: string[] = [];

    // Get current server items
    const { data: serverItems } = await supabase
      .from('cart_items')
      .select('product_id')
      .eq('user_id', userId);

    const serverProductIds = new Set(
      (serverItems as { product_id: number }[])?.map((i) => i.product_id) ?? [],
    );

    // Build upserts and deletes
    const upserts: { user_id: string; product_id: number; quantity: number }[] = [];
    const deletes: number[] = [];

    for (const [productId, quantity] of choices) {
      if (quantity === 0) {
        // User chose to discard this item
        if (serverProductIds.has(productId)) {
          deletes.push(productId);
        }
      } else {
        // Check stock
        const item = this._items().find((i) => i.product_id === productId);
        const stock = item?.products?.stock ?? Infinity;
        const finalQty = Math.min(quantity, stock);

        if (finalQty < quantity) {
          warnings.push(`Quantity capped to ${finalQty} (out of stock)`);
        }

        upserts.push({
          user_id: userId,
          product_id: productId,
          quantity: finalQty,
        });
      }
    }

    // Execute deletes
    for (const productId of deletes) {
      await supabase.from('cart_items').delete().eq('user_id', userId).eq('product_id', productId);
    }

    // Execute upserts
    if (upserts.length > 0) {
      const { error } = await supabase
        .from('cart_items')
        .upsert(upserts, { onConflict: 'user_id,product_id' });
      if (error) throw error;
    }

    // Reload cart from server
    await this.loadCart(userId);

    return warnings;
  }

  /**
   * Validate cart stock availability.
   *
   * @returns Validation result with warnings for items exceeding stock
   */
  validateCartStock(): { isValid: boolean; warnings: string[] } {
    const items = this._items();
    const warnings: string[] = [];

    for (const item of items) {
      const stock = item.products?.stock ?? 0;
      if (item.quantity > stock) {
        warnings.push(
          `${item.products?.name ?? 'Product'}: requested ${item.quantity}, only ${stock} available`,
        );
      }
    }

    return { isValid: warnings.length === 0, warnings };
  }

  // ─── Private Helpers ───────────────────────────────────────────────────────

  /**
   * Debounced sync to Supabase server.
   * Only upserts changed items and deletes removed items.
   */
  private _debouncedSyncToServer(userId: string): void {
    if (this._syncTimer) {
      clearTimeout(this._syncTimer);
    }

    this._syncTimer = setTimeout(async () => {
      try {
        const currentItems = this._items();
        const currentMap = new Map(currentItems.map((i) => [i.product_id, i.quantity]));

        // Find changed items (added or modified)
        const upserts: { user_id: string; product_id: number; quantity: number }[] = [];
        for (const [productId, quantity] of currentMap) {
          const lastQty = this._lastSyncedState.get(productId);
          if (lastQty !== quantity) {
            upserts.push({ user_id: userId, product_id: productId, quantity });
          }
        }

        // Find deleted items (in last sync but not in current)
        const deletes: number[] = [];
        for (const productId of this._lastSyncedState.keys()) {
          if (!currentMap.has(productId)) {
            deletes.push(productId);
          }
        }

        // Execute upserts
        if (upserts.length > 0) {
          const { error } = await supabase
            .from('cart_items')
            .upsert(upserts, { onConflict: 'user_id,product_id' });
          if (error) throw error;
        }

        // Execute deletes
        for (const productId of deletes) {
          const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', userId)
            .eq('product_id', productId);
          if (error) throw error;
        }

        // Update sync snapshot
        this._lastSyncedState = new Map(currentMap);
      } catch {
        this._notification.show('Failed to sync cart', 'error');
      }
    }, 1000);
  }

  /**
   * Save cart items to localStorage.
   *
   * @param items - Cart items to persist
   */
  private _saveToLocalStorage(items?: CartItemWithProduct[]): void {
    try {
      const data = items ?? this._items();
      const localData = data.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      }));
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(localData));
    } catch {
      // localStorage might be full or unavailable
    }
  }

  /**
   * Load cart items from localStorage into _items signal.
   */
  private _loadFromLocalStorage(): void {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (!stored) {
        this._items.set([]);
        return;
      }

      const localData = JSON.parse(stored) as { product_id: number; quantity: number }[];

      if (!Array.isArray(localData) || localData.length === 0) {
        this._items.set([]);
        return;
      }

      // Convert to CartItemWithProduct format (without product data)
      const cartItems = localData.map((item) => ({
        id: 0,
        user_id: '',
        product_id: item.product_id,
        quantity: item.quantity,
        created_at: new Date().toISOString(),
        products: undefined,
      })) as unknown as CartItemWithProduct[];

      this._items.set(cartItems);
    } catch {
      this._items.set([]);
    }
  }

  /**
   * Handle localStorage errors gracefully.
   */
  private _handleStorageError(): void {
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      // Ignore cleanup errors
    }
  }

  /**
   * Process retry queue for failed sync operations.
   */
  private _processRetryQueue(_userId: string): Promise<void> {
    // Retry queue processing logic
    return Promise.resolve();
  }
}
