import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  effect,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { form, debounce, FormField } from '@angular/forms/signals';
import { TranslationService } from '../../services/translation';
import { ProductService } from '../../services/product.service';
import { ProductCard } from './product-card';
import { Skeleton } from '../../shared/skeleton/skeleton';
import type { Icategory } from '../../models/db/icategory';
import type { ProductWithCategory } from '../../models/frontend/product';

@Component({
  selector: 'app-products-gallery',
  templateUrl: './products-gallery.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProductCard, FormField, Skeleton],
  host: { class: 'block w-full' },
})
export class ProductsGallery {
  private readonly _t = inject(TranslationService);
  private readonly _productService = inject(ProductService);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _Router = inject(Router);

  // Filter model
  readonly filterModel = signal({
    search: '',
    categoryId: null as number | null,
    minPrice: null as number | null,
    maxPrice: null as number | null,
    minRating: null as number | null,
    maxRating: null as number | null,
    sort: 'newest' as string,
    page: 1,
  });

  // Form with debounce on search
  readonly filterForm = form(this.filterModel, (schemaPath) => {
    debounce(schemaPath.search, 300);
  });

  // UI state
  readonly showFilters = signal(false);
  readonly loading = signal(false);
  readonly categories = signal<Icategory[]>([]);
  readonly categoriesError = signal<string | null>(null);
  readonly products = signal<ProductWithCategory[]>([]);
  readonly totalPages = signal(0);
  readonly pageNumbers = signal<number[]>([]);

  // Computed
  readonly isEmpty = computed(() => !this.loading() && this.products().length === 0);
  readonly page = computed(() => this.filterModel().page);

  constructor() {
    // Read URL params on init
    this._activatedRoute.queryParams.subscribe((params) => {
      this.filterModel.set({
        search: params['search'] || '',
        categoryId: params['category'] ? Number(params['category']) : null,
        minPrice: params['minPrice'] ? Number(params['minPrice']) : null,
        maxPrice: params['maxPrice'] ? Number(params['maxPrice']) : null,
        minRating: params['minRating'] ? Number(params['minRating']) : null,
        maxRating: params['maxRating'] ? Number(params['maxRating']) : null,
        sort: params['sort'] || 'newest',
        page: params['page'] ? Number(params['page']) : 1,
      });
    });

    // Update URL when filters change
    effect(() => {
      const filters = this.filterModel();
      this._Router.navigate([], {
        queryParams: {
          search: filters.search || null,
          category: filters.categoryId || null,
          minPrice: filters.minPrice || null,
          maxPrice: filters.maxPrice || null,
          minRating: filters.minRating || null,
          maxRating: filters.maxRating || null,
          sort: filters.sort !== 'newest' ? filters.sort : null,
          page: filters.page > 1 ? filters.page : null,
        },
        queryParamsHandling: 'merge',
      });
    });

    // Fetch products when filters change
    effect(async () => {
      const filters = this.filterModel();
      this.loading.set(true);
      try {
        const result = await this._productService.getProducts({
          page: filters.page,
          limit: 12,
          categoryId: filters.categoryId ?? undefined,
          minPrice: filters.minPrice ?? undefined,
          maxPrice: filters.maxPrice ?? undefined,
          minRating: filters.minRating ?? undefined,
          maxRating: filters.maxRating ?? undefined,
          search: filters.search || undefined,
          sort: filters.sort as any,
        });
        this.products.set(result.data);
        this.totalPages.set(result.totalPages);
        this.pageNumbers.set(Array.from({ length: result.totalPages }, (_, i) => i + 1));
      } finally {
        this.loading.set(false);
      }
    });

    // Load categories
    this.loadCategories();
  }

  async loadCategories() {
    try {
      const cats = await this._productService.getCategories();
      this.categories.set(cats);
    } catch (err) {
      this.categoriesError.set('Failed to load categories');
      this.categories.set([]);
    }
  }

  onCategoryClick(categoryId: number | null) {
    this.filterModel.update((f) => ({ ...f, categoryId, page: 1 }));
  }

  onMinPriceChange(value: string) {
    const min = value ? Number(value) : null;
    this.filterModel.update((f) => ({ ...f, minPrice: min, page: 1 }));
  }

  onMaxPriceChange(value: string) {
    const max = value ? Number(value) : null;
    this.filterModel.update((f) => ({ ...f, maxPrice: max, page: 1 }));
  }

  onMinRatingChange(rating: number) {
    this.filterModel.update((f) => ({
      ...f,
      minRating: f.minRating === rating ? null : rating,
      page: 1,
    }));
  }

  onSortChange(value: string) {
    this.filterModel.update((f) => ({ ...f, sort: value, page: 1 }));
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.filterModel.update((f) => ({ ...f, page }));
    }
  }

  clearFilters() {
    this.filterModel.set({
      search: '',
      categoryId: null,
      minPrice: null,
      maxPrice: null,
      minRating: null,
      maxRating: null,
      sort: 'newest',
      page: 1,
    });
  }

  toggleFilters() {
    this.showFilters.update((v) => !v);
  }

  translate(key: Parameters<TranslationService['t']>[0]): string {
    return this._t.t(key);
  }
}
