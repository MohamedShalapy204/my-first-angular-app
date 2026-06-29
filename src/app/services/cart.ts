import { Injectable, signal, computed, inject, InjectionToken, effect } from '@angular/core';
import { supabase as defaultSupabase } from './supabase';
import { NotificationService } from './notification';
import { AuthService } from './auth.service';
import type { CartItemWithProduct } from '../models/frontend/cart';
import type { ProductWithCategory } from '../models/frontend/product';
import type { SupabaseClient } from '@supabase/supabase-js';

/** Injection token for Supabase client (allows testing with mock). */
export const SUPABASE_CLIENT = new InjectionToken<SupabaseClient>('SUPABASE_CLIENT', {
  providedIn: 'root',
  factory: () => defaultSupabase,
});

/**
 * Cart service with Supabase sync and stock validation.
 *
 * - Auth-only cart (no guest/localStorage)
 * - Stock validation on add, update, and checkout
 * - Signals for reactive state
 */
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly _notification = inject(NotificationService);
  private readonly _auth = inject(AuthService);
  private readonly _supabase = inject(SUPABASE_CLIENT);

  constructor() {
    // Auto-load cart when user logs in
    effect(() => {
      const user = this._auth.user();
      if (user) {
        this.loadCart(user.id);
      } else {
        this.cartItems.set([]);
      }
    });
  }

  /** Cart items with product data joined from Supabase. */
  readonly cartItems = signal<CartItemWithProduct[]>([]);

  /** Total number of items in cart. */
  readonly cartCount = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0),
  );

  /** Subtotal of all items (price × quantity). */
  readonly subtotal = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.products.price * item.quantity, 0),
  );

  /** Loading state for cart operations. */
  readonly loading = signal<boolean>(false);

  /**
   * Load cart items from Supabase for the given user.
   * Joins with products table for name, price, image, stock.
   */
  async loadCart(userId: string): Promise<void> {
    this.loading.set(true);
    try {
      const { data, error } = await this._supabase
        .from('cart_items')
        .select('*, products(name, price, image_url, stock)')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Failed to load cart:', error);
        this._notification.show('Failed to load cart', 'error');
        this.cartItems.set([]);
        return;
      }

      this.cartItems.set(data as CartItemWithProduct[]);
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Add an item to the cart.
   * If product already exists, replaces quantity (capped at stock).
   *
   * @param productId - Product ID to add
   * @param newQuantity - Quantity to add
   * @param product - Optional product data for stock validation
   */
  async addItem(productId: number, newQuantity: number, product?: ProductWithCategory): Promise<void> {
    const userId = this._getUserId();
    if (!userId) return;

    // Get stock from product param or existing cart item
    const existingCartItem = this.cartItems().find((i) => i.product_id === productId);
    const stock = product?.stock ?? existingCartItem?.products.stock;

    // Reject if out of stock
    if (stock !== undefined && stock <= 0) {
      this._notification.show('Product is out of stock', 'error');
      return;
    }

    // Cap quantity at stock
    if (stock !== undefined && newQuantity > stock) {
      this._notification.show(`Only ${stock} available in stock`, 'warning');
      newQuantity = stock;
    }

    const { error } = await this._supabase
      .from('cart_items')
      .upsert(
        { user_id: userId, product_id: productId, quantity: newQuantity },
        { onConflict: 'user_id,product_id' },
      );

    if (error) {
      console.error('Failed to add item:', error);
      this._notification.show('Failed to add item to cart', 'error');
      return;
    }

    await this.loadCart(userId);
  }

  /**
   * Update quantity for a specific cart item.
   * Caps at available stock.
   *
   * @param productId - Product ID to update
   * @param quantity - New quantity
   */
  async updateQuantity(productId: number, quantity: number): Promise<void> {
    const userId = this._getUserId();
    if (!userId) return;

    // Get current item for stock check
    const item = this.cartItems().find((i) => i.product_id === productId);
    if (!item) return;

    // Cap at stock
    if (quantity > item.products.stock) {
      quantity = item.products.stock;
      this._notification.show(`Stock limited — set to ${quantity}`, 'warning');
    }

    const { error } = await this._supabase
      .from('cart_items')
      .upsert(
        { user_id: userId, product_id: productId, quantity },
        { onConflict: 'user_id,product_id' },
      );

    if (error) {
      console.error('Failed to update quantity:', error);
      this._notification.show('Failed to update quantity', 'error');
      return;
    }

    // Reload cart to get updated state
    await this.loadCart(userId);
  }

  /**
   * Remove an item from the cart.
   *
   * @param productId - Product ID to remove
   */
  async removeItem(productId: number): Promise<void> {
    const userId = this._getUserId();
    if (!userId) return;

    const { error } = await this._supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (error) {
      console.error('Failed to remove item:', error);
      this._notification.show('Failed to remove item', 'error');
      return;
    }

    this._notification.show('Item removed from cart', 'success');

    // Reload cart to get updated state
    await this.loadCart(userId);
  }

  /**
   * Clear all items from the cart.
   */
  async clearCart(): Promise<void> {
    const userId = this._getUserId();
    if (!userId) return;

    const { error } = await this._supabase.from('cart_items').delete().eq('user_id', userId);

    if (error) {
      console.error('Failed to clear cart:', error);
      this._notification.show('Failed to clear cart', 'error');
      return;
    }

    this.cartItems.set([]);
  }

  /**
   * Validate that all cart items have sufficient stock.
   * Use before checkout.
   *
   * @returns Validation result with any stock issues
   */
  async validateStock(): Promise<{
    valid: boolean;
    issues: Array<{ productId: number; available: number }>;
  }> {
    const issues: Array<{ productId: number; available: number }> = [];

    for (const item of this.cartItems()) {
      if (item.quantity > item.products.stock) {
        issues.push({
          productId: item.product_id,
          available: item.products.stock,
        });
      }
    }

    return {
      valid: issues.length === 0,
      issues,
    };
  }

  /**
   * Get current user ID from AuthService.
   * Returns null if not authenticated.
   */
  private _getUserId(): string | null {
    const user = this._auth.user();

    if (!user) {
      this._notification.show('Please log in to manage your cart', 'warning');
      return null;
    }

    return user.id;
  }
}
