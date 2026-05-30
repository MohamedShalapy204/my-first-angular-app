import { Injectable, signal } from '@angular/core';
import { supabase } from './supabase';
import { Iproduct } from '../models/iproduct';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  products = signal<Iproduct[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  async searchProducts(query: string) {
    const trimmedQuery = query.trim();
    console.log('Searching products with query:', trimmedQuery);
    this.loading.set(true);
    this.error.set(null);

    try {
      let request = supabase.from('products').select('*');

      if (trimmedQuery) {
        request = request.ilike('name', `%${trimmedQuery}%`);
      }

      const { data, error } = await request;
      console.log('Supabase response:', { data, error });

      if (error) throw error;
      this.products.set(data || []);
    } catch (err: any) {
      this.error.set(err.message);
      console.error('Error searching products:', err);
    } finally {
      this.loading.set(false);
    }
  }
}
