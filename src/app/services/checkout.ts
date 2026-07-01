import { inject, Injectable } from '@angular/core';
import { SUPABASE_CLIENT } from './cart';
import { NotificationService } from './notification';
import type { CartItemWithProduct } from '../models/frontend/cart';
import { toCheckoutItems } from '../models/frontend/checkout';

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private readonly _supabase = inject(SUPABASE_CLIENT);
  private readonly _notification = inject(NotificationService);

  /**
   * Create a Stripe Checkout Session by invoking the Edge Function.
   *
   * @param cartItems - Current cart items with product data
   * @returns The Stripe Checkout Session URL to redirect to
   */
  async createCheckoutSession(cartItems: CartItemWithProduct[]): Promise<string> {
    const items = toCheckoutItems(cartItems);

    try {
      const { data, error } = await this._supabase.functions.invoke('create-checkout-session', {
        body: { items },
      });

      if (error) {
        this._notification.show('Failed to create checkout session', 'error');
        throw new Error(error.message);
      }

      return data.url;
    } catch (e) {
      if (e instanceof Error && e.message !== 'Failed to create checkout session') {
        this._notification.show('Failed to create checkout session', 'error');
      }
      throw e;
    }
  }
}
