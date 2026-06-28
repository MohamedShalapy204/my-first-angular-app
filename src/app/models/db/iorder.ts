export interface Iorder {
  id: number;
  user_id: string;
  status: string;
  total: number;
  created_at: string;
}

export interface IorderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price_at_purchase: number;
}
