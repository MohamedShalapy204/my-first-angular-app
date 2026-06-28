import type { IcartItem } from '../db/icart';

export interface CartItemWithProduct extends IcartItem {
  products: {
    name: string;
    price: number;
    image_url: string;
    stock: number;
  };
}

export interface LocalStorageCartItem {
  product_id: number;
  quantity: number;
  added_at: string;
}

export interface CartMergeDecision {
  decided_at: string;
  choice: 'local' | 'server';
}

/**
 * A single item in the merge comparison.
 * Represents the state of one product across local and server carts.
 */
export interface MergeItem {
  /** Product ID (from cart_items.product_id). */
  product_id: number;
  /** Product name (from Supabase join). */
  product_name: string;
  /** Product image URL (from Supabase join). */
  image_url: string;
  /** Quantity in the guest (localStorage) cart, or 0 if not present. */
  local_quantity: number;
  /** Quantity in the server (Supabase) cart, or 0 if not present. */
  server_quantity: number;
  /** Available stock (from Supabase join). */
  stock: number;
  /**
   * Where this item exists: 'both' = in local AND server,
   * 'local' = only in local, 'server' = only in server.
   */
  source: 'both' | 'local' | 'server';
}

/**
 * Result of comparing guest (localStorage) and server (Supabase) carts.
 * Used by the cart merge page to show a git-style comparison.
 */
export interface MergeData {
  /** True if there are any items to merge (at least one cart is non-empty). */
  has_items: boolean;
  /** True if there are conflicting items (same product in both carts with different quantities). */
  has_conflicts: boolean;
  /** All items across both carts, with local/server quantities and source tag. */
  items: MergeItem[];
  /** Total items that exist in both carts. */
  conflict_count: number;
}

/**
 * User's per-item merge choices.
 * Maps product_id → chosen quantity.
 */
export type MergeChoices = Map<number, number>;
