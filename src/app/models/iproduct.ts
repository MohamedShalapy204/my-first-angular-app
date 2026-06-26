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

export interface ProductWithCategory extends Iproduct {
  categories: import('./icategory').Icategory | null;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  maxRating?: number;
  search?: string;
  sort?: 'newest' | 'oldest' | 'price-asc' | 'price-desc' | 'rating-asc' | 'rating-desc';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}
