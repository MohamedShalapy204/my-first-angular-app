export interface Iorder {
  id: number;
  user_id: string | null;
  status: 'pending' | 'paid' | 'cancelled' | 'refunded';
  total: number;
  created_at: string;
  updated_at: string | null;
  stripe_session_id?: string;
  stripe_event_id?: string;
}

export interface IorderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price_at_purchase: number;
}
