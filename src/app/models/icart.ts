export interface Icart {
  id: number;
  user_id: string;
  created_at: string;
}

export interface IcartItem {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
}
