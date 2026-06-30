export interface Iorder {
  id: number;
  user_id: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  created_at: string;
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
