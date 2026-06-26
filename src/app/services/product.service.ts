import { Injectable, signal } from '@angular/core';
import { supabase } from './supabase';
import type { Icategory } from '../models/icategory';
import type { Iproduct, ProductWithCategory, ProductFilters, PaginatedResult } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  readonly products = signal<ProductWithCategory[]>([]);
  readonly categories = signal<Icategory[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  async getProducts(filters: ProductFilters = {}): Promise<PaginatedResult<ProductWithCategory>> {
    const {
      page = 1,
      limit = 12,
      categoryId,
      minPrice,
      maxPrice,
      minRating,
      maxRating,
      search,
      sort = 'newest',
    } = filters;

    this.loading.set(true);
    this.error.set(null);

    try {
      // Count total
      let countQuery = supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      if (categoryId) countQuery = countQuery.eq('category_id', categoryId);
      if (minPrice !== undefined) countQuery = countQuery.gte('price', minPrice);
      if (maxPrice !== undefined) countQuery = countQuery.lte('price', maxPrice);
      if (minRating !== undefined) countQuery = countQuery.gte('rating', minRating);
      if (maxRating !== undefined) countQuery = countQuery.lte('rating', maxRating);
      if (search) {
        countQuery = countQuery.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
      }

      const { count, error: countError } = await countQuery;

      if (countError) throw countError;

      const total = count || 0;
      const totalPages = Math.ceil(total / limit);

      // Fetch data
      let dataQuery = supabase.from('products').select('*, categories(*)').eq('is_active', true);

      if (categoryId) dataQuery = dataQuery.eq('category_id', categoryId);
      if (minPrice !== undefined) dataQuery = dataQuery.gte('price', minPrice);
      if (maxPrice !== undefined) dataQuery = dataQuery.lte('price', maxPrice);
      if (minRating !== undefined) dataQuery = dataQuery.gte('rating', minRating);
      if (maxRating !== undefined) dataQuery = dataQuery.lte('rating', maxRating);
      if (search) {
        dataQuery = dataQuery.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
      }

      // Sort
      switch (sort) {
        case 'newest':
          dataQuery = dataQuery.order('created_at', { ascending: false });
          break;
        case 'oldest':
          dataQuery = dataQuery.order('created_at', { ascending: true });
          break;
        case 'price-asc':
          dataQuery = dataQuery.order('price', { ascending: true });
          break;
        case 'price-desc':
          dataQuery = dataQuery.order('price', { ascending: false });
          break;
        case 'rating-asc':
          dataQuery = dataQuery.order('rating', { ascending: true });
          break;
        case 'rating-desc':
          dataQuery = dataQuery.order('rating', { ascending: false });
          break;
      }

      // Pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      dataQuery = dataQuery.range(from, to);

      const { data, error } = await dataQuery;

      if (error) throw error;

      const products = (data || []) as ProductWithCategory[];
      this.products.set(products);

      return {
        data: products,
        total,
        page,
        totalPages,
      };
    } catch (err: any) {
      this.error.set(err.message);
      return { data: [], total: 0, page, totalPages: 0 };
    } finally {
      this.loading.set(false);
    }
  }

  async getProductById(id: number): Promise<ProductWithCategory | null> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(*)')
        .eq('id', id)
        .single();

      if (error) throw error;

      return data as ProductWithCategory;
    } catch (err: any) {
      this.error.set(err.message);
      return null;
    } finally {
      this.loading.set(false);
    }
  }

  async getRelatedProducts(productId: number, categoryId: number): Promise<ProductWithCategory[]> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(*)')
        .eq('category_id', categoryId)
        .eq('is_active', true)
        .neq('id', productId)
        .limit(6);

      if (error) throw error;

      return (data || []) as ProductWithCategory[];
    } catch (err: any) {
      this.error.set(err.message);
      return [];
    } finally {
      this.loading.set(false);
    }
  }

  async getNewArrivals(): Promise<ProductWithCategory[]> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(*)')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      return (data || []) as ProductWithCategory[];
    } catch (err: any) {
      this.error.set(err.message);
      return [];
    } finally {
      this.loading.set(false);
    }
  }

  async getFeaturedProducts(limit: number = 6): Promise<ProductWithCategory[]> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(*)')
        .eq('is_active', true)
        .order('rating', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []) as ProductWithCategory[];
    } catch (err: any) {
      this.error.set(err.message);
      return [];
    } finally {
      this.loading.set(false);
    }
  }

  async getCategories(): Promise<Icategory[]> {
    try {
      const { data, error } = await supabase.from('categories').select('*').order('name');

      if (error) throw error;

      const categories = (data || []) as Icategory[];
      this.categories.set(categories);
      return categories;
    } catch (err: any) {
      this.error.set(err.message);
      return [];
    }
  }

  async updateStock(productId: number, quantity: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('products')
        .update({ stock: quantity })
        .eq('id', productId);

      if (error) throw error;
      return true;
    } catch (err: any) {
      this.error.set(err.message);
      return false;
    }
  }

  async createProduct(product: Partial<Iproduct>): Promise<Iproduct | null> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const { data, error } = await supabase.from('products').insert(product).select().single();

      if (error) throw error;

      return data as Iproduct;
    } catch (err: any) {
      this.error.set(err.message);
      return null;
    } finally {
      this.loading.set(false);
    }
  }

  async updateProduct(id: number, data: Partial<Iproduct>): Promise<Iproduct | null> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const { data: updated, error } = await supabase
        .from('products')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return updated as Iproduct;
    } catch (err: any) {
      this.error.set(err.message);
      return null;
    } finally {
      this.loading.set(false);
    }
  }

  async deleteProduct(id: number): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const { error } = await supabase.from('products').delete().eq('id', id);

      if (error) throw error;
    } catch (err: any) {
      this.error.set(err.message);
    } finally {
      this.loading.set(false);
    }
  }

  async toggleProductActive(id: number, isActive: boolean): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) throw error;
    } catch (err: any) {
      this.error.set(err.message);
    } finally {
      this.loading.set(false);
    }
  }
}
