import { Injectable, signal } from '@angular/core';
import { supabase } from './supabase';
import type { Icategory } from '../models/db/icategory';
import type { Iproduct, ProductWithCategory, ProductFilters, PaginatedResult } from '../models';

/**
 * Product data service backed by Supabase.
 *
 * Handles all product-related operations: browsing, filtering, pagination,
 * CRUD (admin), stock queries, and category fetching.
 *
 * ## Signals
 *
 * - `products` — last fetched product list (set by `getProducts()`)
 * - `categories` — all categories (set by `getCategories()`)
 * - `loading` — true while any async operation is in flight
 * - `error` — last error message, or null
 *
 * ## Supabase Join
 *
 * All product queries use a join to embed category data:
 * ```
 * select('*, categories(*)')
 * ```
 * This returns `ProductWithCategory` — a product with its full `Icategory` object.
 *
 * ## Filtering
 *
 * `getProducts()` accepts a `ProductFilters` object supporting:
 * - Price range (minPrice, maxPrice)
 * - Rating range (minRating, maxRating)
 * - Category ID
 * - Full-text search (name, description)
 * - Sort order (newest, oldest, price-asc, price-desc, rating-asc, rating-desc)
 * - Pagination (page, limit)
 *
 * @example
 * ```typescript
 * const productService = inject(ProductService);
 *
 * // Browse products with filters
 * const result = await productService.getProducts({
 *   categoryId: 5,
 *   minPrice: 10,
 *   sort: 'price-asc',
 *   page: 1,
 *   limit: 12,
 * });
 *
 * // Get a single product
 * const product = await productService.getProductById(42);
 *
 * // Batch fetch (used by CartService)
 * const products = await productService.getProductsByIds([1, 2, 3]);
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  /**
   * Last fetched product list. Set by `getProducts()`.
   * Components can read this signal reactively for display.
   */
  readonly products = signal<ProductWithCategory[]>([]);

  /**
   * All categories from Supabase. Set by `getCategories()`.
   * Components use this for category filters and navigation.
   */
  readonly categories = signal<Icategory[]>([]);

  /** True while any async Supabase operation is in flight. */
  readonly loading = signal<boolean>(false);

  /** Last error message from Supabase, or null if no error. */
  readonly error = signal<string | null>(null);

  /**
   * Fetch products with filtering, sorting, and pagination.
   *
   * Executes two Supabase queries:
   * 1. **Count query** — `select('*', { count: 'exact', head: true })` to get total items
   * 2. **Data query** — `select('*, categories(*)')` with range for the current page
   *
   * Both queries apply the same filters (category, price, rating, search).
   *
   * Sets `this.products` with the fetched page. Sets `this.error` on failure.
   *
   * @param filters - Filter/sort/pagination options (all optional with defaults)
   * @returns Paginated result with data, total count, page number, and total pages
   *
   * @example
   * ```typescript
   * const result = await this.getProducts({
   *   categoryId: 3,
   *   minPrice: 20,
   *   maxPrice: 100,
   *   sort: 'price-asc',
   *   page: 2,
   *   limit: 8,
   * });
   * // result.data — products for page 2
   * // result.totalPages — total number of pages
   * ```
   */
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
      // ── Count query: get total matching products ──
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

      // ── Data query: fetch products with category join ──
      let dataQuery = supabase.from('products').select('*, categories(*)').eq('is_active', true);

      if (categoryId) dataQuery = dataQuery.eq('category_id', categoryId);
      if (minPrice !== undefined) dataQuery = dataQuery.gte('price', minPrice);
      if (maxPrice !== undefined) dataQuery = dataQuery.lte('price', maxPrice);
      if (minRating !== undefined) dataQuery = dataQuery.gte('rating', minRating);
      if (maxRating !== undefined) dataQuery = dataQuery.lte('rating', maxRating);
      if (search) {
        dataQuery = dataQuery.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
      }

      // ── Sort ──
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

      // ── Pagination ──
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

  /**
   * Fetch a single product by ID with category join.
   *
   * @param id - The product ID
   * @returns The product with category data, or null if not found
   *
   * @example
   * ```typescript
   * const product = await this.getProductById(42);
   * if (product) {
   *   console.log(product.name, product.categories?.name);
   * }
   * ```
   */
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

  /**
   * Fetch related products from the same category (for product detail page).
   *
   * Returns up to 6 active products in the same category, excluding the current product.
   *
   * @param productId - The current product ID (excluded from results)
   * @param categoryId - The category to search within
   * @returns Array of related products (max 6)
   *
   * @example
   * ```typescript
   * const related = await this.getRelatedProducts(42, 5);
   * // Returns up to 6 products in category 5, excluding product 42
   * ```
   */
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

  /**
   * Batch-fetch products by an array of IDs.
   *
   * Uses Supabase `in` filter for efficient single-query fetch.
   * Does NOT set `loading` or `error` signals — designed for silent background use.
   *
   * Used by CartService to hydrate localStorage cart items with product data.
   *
   * @param ids - Array of product IDs to fetch
   * @returns Array of matching products (may be fewer than ids if some don't exist)
   *
   * @example
   * ```typescript
   * const products = await this.getProductsByIds([1, 2, 3]);
   * const priceMap = new Map(products.map(p => [p.id, p.price]));
   * ```
   */
  async getProductsByIds(ids: number[]): Promise<ProductWithCategory[]> {
    if (ids.length === 0) return [];

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(*)')
        .in('id', ids);

      if (error) throw error;

      return (data || []) as ProductWithCategory[];
    } catch {
      return [];
    }
  }

  /**
   * Fetch the 10 most recently created active products.
   * Used for the homepage "New Arrivals" section.
   *
   * @returns Up to 10 products sorted by created_at descending
   */
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

  /**
   * Fetch top-rated active products for the homepage "Featured" section.
   *
   * @param limit - Maximum products to return (default: 6)
   * @returns Products sorted by rating descending
   *
   * @example
   * ```typescript
   * const featured = await this.getFeaturedProducts(8);
   * ```
   */
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

  /**
   * Fetch all categories, sorted alphabetically by name.
   *
   * Sets `this.categories` signal with the results.
   * Used for category filters and navigation menus.
   *
   * @returns Array of categories
   */
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

  /**
   * Directly update a product's stock value.
   *
   * Note: This sets the stock to an absolute value, not a delta.
   * Used by admin operations and cart stock capping.
   *
   * @param productId - The product ID
   * @param quantity - The new stock value
   * @returns `true` on success, `false` on error
   */
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

  /**
   * Create a new product in Supabase.
   *
   * @param product - Partial product data (name, price, stock, etc.)
   * @returns The created product, or null on error
   */
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

  /**
   * Update an existing product by ID.
   *
   * @param id - The product ID to update
   * @param data - Fields to update (partial)
   * @returns The updated product, or null on error
   */
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

  /**
   * Permanently delete a product from Supabase.
   *
   * @param id - The product ID to delete
   */
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

  /**
   * Toggle a product's active status (soft delete / restore).
   *
   * Inactive products are hidden from browsing but not deleted.
   * Cart items referencing inactive products still work (with fallback data).
   *
   * @param id - The product ID
   * @param isActive - `true` to show, `false` to hide
   */
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

  /**
   * Fetch the current stock value for a single product.
   *
   * Lightweight query — only selects the `stock` column.
   * Used by `validateStock()` and cart stock checks.
   *
   * @param productId - The product ID
   * @returns Current stock count, or 0 on error
   */
  async getProductStock(productId: number): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('stock')
        .eq('id', productId)
        .single();

      if (error) throw error;
      return data?.stock ?? 0;
    } catch {
      return 0;
    }
  }

  /**
   * Validate whether a requested quantity is available in stock.
   *
   * Used by CartService before adding items to cart.
   *
   * @param productId - The product ID to check
   * @param requestedQty - The quantity the user wants
   * @returns Object with `available` (boolean) and `maxQty` (actual stock)
   *
   * @example
   * ```typescript
   * const result = await this.validateStock(42, 5);
   * if (!result.available) {
   *   console.log(`Only ${result.maxQty} available`);
   * }
   * ```
   */
  async validateStock(
    productId: number,
    requestedQty: number,
  ): Promise<{ available: boolean; maxQty: number }> {
    const stock = await this.getProductStock(productId);
    return {
      available: stock >= requestedQty,
      maxQty: stock,
    };
  }
}
