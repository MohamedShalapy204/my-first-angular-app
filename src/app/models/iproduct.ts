export interface Iproduct {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  created_at: string | null;
  category_id: number | null;
  stock: number;
  rating: number;
  is_active: boolean;
}
