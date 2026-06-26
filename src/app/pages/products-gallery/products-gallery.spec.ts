import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of } from 'rxjs';
import { ProductsGallery } from './products-gallery';
import { ProductService } from '../../services/product.service';
import { TranslationService } from '../../services/translation';
import type { ProductWithCategory } from '../../models/iproduct';
import type { Icategory } from '../../models/icategory';

// Mock data
const mockCategories: Icategory[] = [
  { id: 1, name: 'Peripherals', created_at: '2024-01-01T00:00:00Z' },
  { id: 2, name: 'Components', created_at: '2024-01-01T00:00:00Z' },
];

const mockProducts: ProductWithCategory[] = [
  {
    id: 1,
    name: 'Test Keyboard',
    category_id: 1,
    description: 'A test keyboard',
    price: 100,
    image_url: 'https://example.com/image.jpg',
    stock: 10,
    rating: 4.5,
    is_active: true,
    created_at: '2024-01-15T10:30:00Z',
    categories: { id: 1, name: 'Peripherals', created_at: '2024-01-01T00:00:00Z' },
  },
];

// Mock services
const mockProductService = {
  getProducts: vi.fn().mockResolvedValue({ data: mockProducts, totalPages: 1 }),
  getCategories: vi.fn().mockResolvedValue(mockCategories),
};

const mockTranslationService = {
  t: vi.fn().mockReturnValue('Translated text'),
};

describe('ProductsGallery', () => {
  let component: ProductsGallery;
  let fixture: ComponentFixture<ProductsGallery>;

  beforeEach(async () => {
    // Reset mocks
    vi.clearAllMocks();
    mockProductService.getProducts.mockResolvedValue({ data: mockProducts, totalPages: 1 });
    mockProductService.getCategories.mockResolvedValue(mockCategories);

    await TestBed.configureTestingModule({
      imports: [ProductsGallery],
      providers: [
        provideRouter([]),
        { provide: ProductService, useValue: mockProductService },
        { provide: TranslationService, useValue: mockTranslationService },
        {
          provide: ActivatedRoute,
          useValue: { queryParams: of({}) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsGallery);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('initialization', () => {
    it('should load categories on init', () => {
      expect(mockProductService.getCategories).toHaveBeenCalled();
      expect(component.categories()).toEqual(mockCategories);
    });

    it('should load products on init', () => {
      expect(mockProductService.getProducts).toHaveBeenCalled();
      expect(component.products()).toEqual(mockProducts);
    });

    it('should start with loading state false after initial load', () => {
      expect(component.loading()).toBe(false);
    });
  });

  describe('filtering', () => {
    it('should update products when category changes', async () => {
      const filteredProducts = [mockProducts[0]];
      mockProductService.getProducts.mockResolvedValueOnce({
        data: filteredProducts,
        totalPages: 1,
      });

      component.onCategoryClick(1);

      // Wait for effect to process
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(component.filterModel().categoryId).toBe(1);
      expect(component.filterModel().page).toBe(1); // Reset to page 1
    });

    it('should reset to page 1 when filter changes', async () => {
      // Set initial page
      component.onPageChange(2);
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Change filter
      component.onCategoryClick(1);
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(component.filterModel().page).toBe(1);
    });
  });

  describe('pagination', () => {
    it('should update page on page change', async () => {
      // First, set totalPages to 5 so page 3 is valid
      mockProductService.getProducts.mockResolvedValue({
        data: mockProducts,
        totalPages: 5,
      });

      // Trigger effect to update totalPages
      component.onCategoryClick(null);
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Now page 3 should be valid
      component.onPageChange(3);

      expect(component.filterModel().page).toBe(3);
    });

    it('should not go below page 1', () => {
      component.onPageChange(0);

      expect(component.filterModel().page).toBe(1);
    });

    it('should not go above total pages', () => {
      component.onPageChange(100);

      expect(component.filterModel().page).toBe(1);
    });
  });

  describe('clearFilters', () => {
    it('should reset all filters to defaults', () => {
      // Set some filters
      component.onCategoryClick(1);
      component.onMinPriceChange('50');
      component.onMaxPriceChange('200');

      // Clear
      component.clearFilters();

      expect(component.filterModel()).toEqual({
        search: '',
        categoryId: null,
        minPrice: null,
        maxPrice: null,
        minRating: null,
        maxRating: null,
        sort: 'newest',
        page: 1,
      });
    });
  });

  describe('toggleFilters', () => {
    it('should toggle showFilters state', () => {
      expect(component.showFilters()).toBe(false);

      component.toggleFilters();
      expect(component.showFilters()).toBe(true);

      component.toggleFilters();
      expect(component.showFilters()).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should handle category load failure gracefully', async () => {
      mockProductService.getCategories.mockRejectedValueOnce(new Error('Network error'));

      component.loadCategories();

      // Wait for async operation
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(component.categoriesError()).toBe('Failed to load categories');
      expect(component.categories()).toEqual([]);
    });
  });

  describe('isEmpty', () => {
    it('should return true when not loading and no products', async () => {
      // Mock empty result
      mockProductService.getProducts.mockResolvedValueOnce({
        data: [],
        totalPages: 0,
      });

      // Trigger re-fetch by changing filter
      component.onCategoryClick(999);

      // Wait for effect to process
      await new Promise((resolve) => setTimeout(resolve, 100));

      // After effect runs, isEmpty should be true
      expect(component.isEmpty()).toBe(true);
    });
  });
});
