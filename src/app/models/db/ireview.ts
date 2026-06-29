export interface Ireview {
  id: number;
  user_id: string;
  product_id: number;
  rating: number;
  comment: string | null;
  created_at: string;
}
