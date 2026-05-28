import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../Services/product.service';
import { SettingsService } from '../../Services/settings';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-4xl mx-auto p-6 animate-in fade-in duration-700">
      <div class="flex items-center gap-4 mb-8">
        <button 
          routerLink="/" 
          class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          [attr.aria-label]="settings.lang() === 'ar' ? 'رجوع' : 'Back'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="settings.lang() === 'ar' ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'" />
          </svg>
        </button>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          {{ settings.lang() === 'ar' ? 'بحث عن المنتجات' : 'Search Products' }}
        </h1>
      </div>

      <div class="relative mb-8">
        <input
          type="text"
          [(ngModel)]="searchQuery"
          (ngModelChange)="onSearchChange($event)"
          [placeholder]="settings.lang() === 'ar' ? 'ابحث عن منتج...' : 'Search products...'"
          class="w-full px-6 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-lg"
        />
        <div class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
          @if (productService.loading()) {
            <div 
              id="search-loading-spinner"
              class="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"
            ></div>
          } @else {
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
        </div>
      </div>

      @if (productService.error()) {
        <div class="p-4 mb-6 bg-red-50 text-red-600 rounded-xl border border-red-100">
          {{ productService.error() }}
        </div>
      }

      <div id="search-results-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (product of productService.products(); track product.id) {
          <div class="product-card group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 flex flex-col h-full" [attr.data-product-id]="product.id">
            <div class="aspect-square overflow-hidden bg-gray-100 relative">
              <img 
                [src]="product.image_url" 
                [alt]="product.name"
                (error)="onImageError($event)"
                class="product-image w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute inset-0 flex items-center justify-center text-gray-400 opacity-0 bg-gray-50 transition-opacity" id="image-placeholder-{{product.id}}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div class="p-5 flex flex-col flex-grow">
              <div class="flex justify-between items-start mb-2">
                <h3 class="product-name font-bold text-xl text-gray-900 dark:text-white">{{ product.name }}</h3>
                <span class="product-price text-blue-600 font-bold">\${{ product.price }}</span>
              </div>
              <p class="product-description text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">{{ product.description }}</p>
              <button class="w-full py-3 bg-gray-900 dark:bg-blue-600 text-white rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-blue-700 transition-colors">
                View Details
              </button>
            </div>
          </div>
        } @empty {
          @if (!productService.loading()) {
            <div class="col-span-full text-center py-20 text-gray-500">
              <div class="mb-4 text-6xl">🔍</div>
              <p class="text-xl">
                {{ settings.lang() === 'ar' ? 'لم يتم العثور على منتجات لـ' : 'No products found for' }} 
                "{{ searchQuery() }}"
              </p>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class SearchComponent {
  productService = inject(ProductService);
  settings = inject(SettingsService);
  searchQuery = signal('');

  constructor() {
    // Initial fetch
    this.productService.searchProducts('');
  }

  private searchTimeout: any;

  onSearchChange(query: string) {
    this.searchQuery.set(query);

    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      this.productService.searchProducts(query);
    }, 400); // 400ms debounce
  }

  onImageError(event: any) {
    const img = event.target;
    img.style.display = 'none';
    const placeholder = img.nextElementSibling;
    if (placeholder) {
      placeholder.style.opacity = '1';
    }
  }
}
