import type { CartItemWithProduct } from './cart';

/**
 * Stripe Checkout payload item.
 * Sent to create-checkout-session Edge Function.
 * Matches the JSONB structure expected by confirm_checkout RPC.
 */
export interface CheckoutItem {
  product_id: number;
  quantity: number;
  price: number;
}

/**
 * Transform cart items to Stripe Checkout payload.
 */
export function toCheckoutItems(cartItems: CartItemWithProduct[]): CheckoutItem[] {
  return cartItems.map((item) => ({
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.products.price,
  }));
}
