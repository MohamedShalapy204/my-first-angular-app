import { inject, Injectable } from '@angular/core';
import { SUPABASE_CLIENT } from './cart';
import type { Iorder } from '../models/db/iorder';
import type { IorderItemWithProduct } from '../models/frontend/order';

/**
 * Read-only order service for querying order history.
 *
 * - Get orders by user ID
 * - Get order items with product data
 * - Get order by Stripe session ID
 * - Get order by numeric ID
 */
@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly _supabase = inject(SUPABASE_CLIENT);

  /**
   * Get all orders for a user, sorted newest first.
   *
   * @param userId - The user's UUID
   * @returns Array of orders with item count
   */
  async getOrdersByUserId(userId: string): Promise<Iorder[]> {
    const { data, error } = await this._supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }

    return data ?? [];
  }

  /**
   * Get items for a specific order with product data.
   *
   * @param orderId - The order ID
   * @returns Array of order items with product name and image
   */
  async getOrderItems(orderId: number): Promise<IorderItemWithProduct[]> {
    const { data, error } = await this._supabase
      .from('order_items')
      .select('*, products(name, image_url, id)')
      .eq('order_id', orderId);

    if (error) {
      console.error('Error fetching order items:', error);
      return [];
    }

    return data ?? [];
  }

  /**
   * Get order by Stripe session ID.
   * Used by checkout-success page to find the specific order being paid for.
   *
   * @param sessionId - The Stripe session ID
   * @returns The order or null if not found
   */
  async getOrderBySessionId(sessionId: string): Promise<Iorder | null> {
    const { data, error } = await this._supabase
      .from('orders')
      .select('*')
      .eq('stripe_session_id', sessionId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching order by session:', error);
      return null;
    }

    return data;
  }

  /**
   * Get order by numeric ID.
   * Used by order detail page to display specific order.
   *
   * @param id - The order ID
   * @returns The order or null if not found
   */
  async getOrderById(id: number): Promise<Iorder | null> {
    const { data, error } = await this._supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching order by ID:', error);
      return null;
    }

    return data;
  }
}
