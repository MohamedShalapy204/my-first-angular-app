import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  effect,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { form } from '@angular/forms/signals';
import { TranslationService } from '../../services/translation';
import { ProductService } from '../../services/product.service';
import { SettingsService } from '../../services/settings';
import { ProductCard } from './product-card';
import { Skeleton } from '../../shared/skeleton/skeleton';
import type { Icategory } from '../../models/db/icategory';
import type { ProductWithCategory } from '../../models/frontend/product';

@Component({
  selector: 'app-products-gallery',
  templateUrl: './products-gallery.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProductCard, Skeleton],
  host: { class: 'block w-full' },
})
export class ProductsGallery {
  private readonly _t = inject(TranslationService);
  private readonly _productService = inject(ProductService);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _Router = inject(Router);
  private readonly _settings = inject(SettingsService);

  readonly lang = this._settings.lang;

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

  // Form without debounce on search
  readonly filterForm = form(this.filterModel);

  // UI state
  readonly showFilters = signal(false);

  readonly filterSidebarStyle = computed(() => {
    const open = this.showFilters();
    const rtl = this.lang() === 'ar';
    // Opposite side from main sidebar: if main is left (LTR), filter is right
    const translate = open ? 'translateX(0)' : rtl ? 'translateX(-100%)' : 'translateX(100%)';
    const side = rtl ? 'left' : 'right';
    return {
      position: 'fixed' as const,
      top: 0,
      bottom: 0,
      [side]: 0,
      width: '20rem',
      maxWidth: '85vw',
      transform: translate,
      transition: 'transform 300ms ease-out',
    };
  });

  readonly filterTabStyle = computed(() => {
    const rtl = this.lang() === 'ar';
    const side = rtl ? 'left' : 'right';
    // RTL: button on left, rounded on right side; LTR: button on right, rounded on left side
    const borderRadius = rtl ? '0 0.5rem 0.5rem 0' : '0.5rem 0 0 0.5rem';
    return {
      position: 'fixed' as const,
      top: '50%',
      transform: 'translateY(-50%)',
      [side]: 0,
      borderRadius,
    };
  });

  readonly filterIconStyle = computed(() => {
    const rtl = this.lang() === 'ar';
    // RTL: icon points right (into content); LTR: icon points left (into content)
    const rotation = rtl ? 'rotate(90deg)' : 'rotate(270deg)';
    return {
      transform: rotation,
      transition: 'transform 300ms ease-out',
    };
  });

  readonly loading = signal(false);
  readonly categories = signal<Icategory[]>([]);
  readonly categoriesError = signal<string | null>(null);
  readonly products = signal<ProductWithCategory[]>([]);
  readonly totalPages = signal(0);

  readonly paginationRange = computed(() => {
    const total = this.totalPages();
    const current = this.page();
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const pages: (number | '...')[] = [1];
    if (current > 3) pages.push('...');
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (current < total - 2) pages.push('...');
    pages.push(total);
    return pages;
  });

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

  onCategoryChange(value: string) {
    this.filterModel.update((f) => ({ ...f, categoryId: value ? Number(value) : null, page: 1 }));
  }

  onSearchChange(value: string) {
    this.filterModel.update((f) => ({ ...f, search: value, page: 1 }));
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
