import type { Iproduct } from '../db/iproduct';
import type { Icategory } from '../db/icategory';

export interface ProductWithCategory extends Iproduct {
  categories: Icategory | null;
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
