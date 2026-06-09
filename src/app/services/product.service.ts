import { Injectable, inject, signal } from '@angular/core';
import { supabase } from './supabase';
import type { Iproduct } from '../models/iproduct';
import { LoggingService } from '../logging';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly logger = inject(LoggingService);

  products = signal<Iproduct[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  async searchProducts(query: string) {
    const trimmedQuery = query.trim();
    this.logger.info('Searching products with query:', {
      component: 'ProductService',
      query: trimmedQuery,
    });
    this.loading.set(true);
    this.error.set(null);

    try {
      let request = supabase.from('products').select('*');

      if (trimmedQuery) {
        request = request.ilike('name', `%${trimmedQuery}%`);
      }

      const { data, error } = await request;
      this.logger.info('Supabase response:', {
        component: 'ProductService',
        dataCount: data?.length,
        hasError: !!error,
      });

      if (error) throw error;
      this.products.set(data || []);
    } catch (err: any) {
      this.error.set(err.message);
      this.logger.error('Error searching products:', {
        component: 'ProductService',
        error: err.message,
      });
    } finally {
      this.loading.set(false);
    }
  }
}
