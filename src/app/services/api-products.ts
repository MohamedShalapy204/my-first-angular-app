import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { Iproduct } from '../models/iproduct';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiProducts {
  private httpClient = inject(HttpClient);
  private baseUrl = environment.jsonServerUrl;

  getProducts(): Observable<Iproduct[]> {
    return this.httpClient.get<Iproduct[]>(`${this.baseUrl}/products`);
  }

  getProductById(id: number): Observable<Iproduct> {
    return this.httpClient.get<Iproduct>(`${this.baseUrl}/products/${id}`);
  }

  getProductByCategory(category: string): Observable<Iproduct[]> {
    return this.httpClient.get<Iproduct[]>(`${this.baseUrl}/products?categoryId=${category}`);
  }

  addProduct(product: Iproduct): Observable<Iproduct> {
    return this.httpClient.post<Iproduct>(`${this.baseUrl}/products`, product);
  }

  updateProduct(product: Iproduct): Observable<Iproduct> {
    return this.httpClient.put<Iproduct>(`${this.baseUrl}/products/${product.id}`, product);
  }

  deleteProduct(id: number): Observable<Iproduct> {
    return this.httpClient.delete<Iproduct>(`${this.baseUrl}/products/${id}`);
  }
}
