export interface Ireview {
  id: number;
  user_id: string | null;
  product_id: number;
  rating: number;
  comment: string | null;
  created_at: string;
}
