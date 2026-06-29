import { TestBed } from '@angular/core/testing';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CartService, SUPABASE_CLIENT } from './cart';
import { NotificationService } from './notification';
import { AuthService } from './auth.service';

describe('CartService', () => {
  let service: CartService;
  let notificationSpy: { show: ReturnType<typeof vi.fn> };
  let mockSupabase: {
    from: ReturnType<typeof vi.fn>;
  };
  let mockAuth: {
    user: ReturnType<typeof vi.fn>;
  };

  const mockUser = { id: 'user-123', email: 'test@example.com' };

  const mockCartItems = [
    {
      id: 1,
      user_id: 'user-123',
      product_id: 1,
      quantity: 2,
      created_at: '2026-01-01T00:00:00Z',
      products: {
        name: 'Test Product',
        price: 99.99,
        image_url: 'https://example.com/image.jpg',
        stock: 10,
      },
    },
    {
      id: 2,
      user_id: 'user-123',
      product_id: 2,
      quantity: 1,
      created_at: '2026-01-01T00:00:00Z',
      products: {
        name: 'Another Product',
        price: 49.99,
        image_url: 'https://example.com/image2.jpg',
        stock: 5,
      },
    },
  ];

  beforeEach(() => {
    notificationSpy = { show: vi.fn() };
    mockSupabase = {
      from: vi.fn(),
    };
    mockAuth = {
      user: vi.fn(() => mockUser),
    };

    TestBed.configureTestingModule({
      providers: [
        CartService,
        { provide: NotificationService, useValue: notificationSpy },
        { provide: SUPABASE_CLIENT, useValue: mockSupabase },
        { provide: AuthService, useValue: mockAuth },
      ],
    });

    service = TestBed.inject(CartService);

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initial state', () => {
    it('should have empty cartItems', () => {
      expect(service.cartItems()).toEqual([]);
    });

    it('should have cartCount of 0', () => {
      expect(service.cartCount()).toBe(0);
    });

    it('should have subtotal of 0', () => {
      expect(service.subtotal()).toBe(0);
    });

    it('should not be loading', () => {
      expect(service.loading()).toBe(false);
    });
  });

  describe('loadCart', () => {
    it('should load cart items from Supabase', async () => {
      const orderMock = vi.fn().mockResolvedValue({ data: mockCartItems, error: null });
      const eqMock = vi.fn().mockReturnValue({ order: orderMock });
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
      mockSupabase.from.mockReturnValue({ select: selectMock });

      await service.loadCart('user-123');

      expect(service.cartItems()).toEqual(mockCartItems);
      expect(service.cartCount()).toBe(3); // 2 + 1
      expect(service.subtotal()).toBeCloseTo(249.97); // (99.99 * 2) + (49.99 * 1)
    });

    it('should handle Supabase error gracefully', async () => {
      const orderMock = vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } });
      const eqMock = vi.fn().mockReturnValue({ order: orderMock });
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
      mockSupabase.from.mockReturnValue({ select: selectMock });

      await service.loadCart('user-123');

      expect(service.cartItems()).toEqual([]);
      expect(notificationSpy.show).toHaveBeenCalledWith('Failed to load cart', 'error');
    });

    it('should set loading to true during fetch', async () => {
      let loadingDuringFetch = false;
      const orderMock = vi.fn().mockImplementation(async () => {
        loadingDuringFetch = service.loading();
        return { data: mockCartItems, error: null };
      });
      const eqMock = vi.fn().mockReturnValue({ order: orderMock });
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
      mockSupabase.from.mockReturnValue({ select: selectMock });

      await service.loadCart('user-123');

      expect(loadingDuringFetch).toBe(true);
      expect(service.loading()).toBe(false);
    });
  });

  describe('addItem', () => {
    it('should add new item to cart', async () => {
      const newItem = {
        id: 3,
        user_id: 'user-123',
        product_id: 3,
        quantity: 1,
        created_at: '2026-01-01T00:00:00Z',
        products: {
          name: 'New Product',
          price: 29.99,
          image_url: 'https://example.com/new.jpg',
          stock: 15,
        },
      };

      const upsertMock = vi.fn().mockResolvedValue({ data: newItem, error: null });
      const orderMock = vi.fn().mockResolvedValue({ data: [newItem], error: null });
      const eqMock = vi.fn().mockReturnValue({ order: orderMock });
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
      mockSupabase.from.mockReturnValue({ upsert: upsertMock, select: selectMock });

      await service.addItem(3, 1, {
        id: 3,
        name: 'New Product',
        price: 29.99,
        image_url: 'https://example.com/new.jpg',
        stock: 15,
        category_id: 1,
        description: 'Test',
        created_at: '2026-01-01T00:00:00Z',
        is_active: true,
        rating: 0,
        categories: { id: 1, name: 'Test Category', created_at: '2026-01-01T00:00:00Z' },
      });

      expect(mockSupabase.from).toHaveBeenCalledWith('cart_items');
      expect(upsertMock).toHaveBeenCalledWith(
        { user_id: 'user-123', product_id: 3, quantity: 1 },
        { onConflict: 'user_id,product_id' },
      );
    });

    it('should cap quantity at stock when adding more than available', async () => {
      // Try to add 15 (stock is 10)
      const upsertMock = vi.fn().mockResolvedValue({ data: null, error: null });
      const orderMock = vi.fn().mockResolvedValue({ data: [], error: null });
      const eqMock = vi.fn().mockReturnValue({ order: orderMock });
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
      mockSupabase.from.mockReturnValue({ upsert: upsertMock, select: selectMock });

      await service.addItem(1, 15, {
        id: 1,
        name: 'Test Product',
        price: 99.99,
        image_url: 'https://example.com/image.jpg',
        stock: 10,
        category_id: 1,
        description: 'Test',
        created_at: '2026-01-01T00:00:00Z',
        is_active: true,
        rating: 0,
        categories: { id: 1, name: 'Test Category', created_at: '2026-01-01T00:00:00Z' },
      });

      // Should be capped at 10 (stock)
      expect(upsertMock).toHaveBeenCalledWith(
        { user_id: 'user-123', product_id: 1, quantity: 10 },
        { onConflict: 'user_id,product_id' },
      );
      expect(notificationSpy.show).toHaveBeenCalledWith(
        expect.stringContaining('available in stock'),
        'warning',
      );
    });

    it('should show notification when stock is zero', async () => {
      const upsertMock = vi.fn().mockResolvedValue({ data: null, error: null });
      mockSupabase.from.mockReturnValue({ upsert: upsertMock });

      await service.addItem(1, 1, {
        id: 1,
        name: 'Out of Stock Product',
        price: 99.99,
        image_url: 'https://example.com/image.jpg',
        stock: 0,
        category_id: 1,
        description: 'Test',
        created_at: '2026-01-01T00:00:00Z',
        is_active: true,
        rating: 0,
        categories: { id: 1, name: 'Test Category', created_at: '2026-01-01T00:00:00Z' },
      });

      expect(notificationSpy.show).toHaveBeenCalledWith('Product is out of stock', 'error');
    });
  });

  describe('updateQuantity', () => {
    it('should update item quantity', async () => {
      // Load cart first
      const initialCart = [...mockCartItems];
      const orderMock = vi.fn().mockResolvedValue({ data: initialCart, error: null });
      const eqMock = vi.fn().mockReturnValue({ order: orderMock });
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
      mockSupabase.from.mockReturnValue({ select: selectMock });

      await service.loadCart('user-123');

      const updatedCart = [{ ...mockCartItems[0], quantity: 3 }, mockCartItems[1]];
      const upsertMock = vi.fn().mockResolvedValue({ data: null, error: null });
      const orderAfterMock = vi.fn().mockResolvedValue({ data: updatedCart, error: null });
      const eqAfterMock = vi.fn().mockReturnValue({ order: orderAfterMock });
      const selectAfterMock = vi.fn().mockReturnValue({ eq: eqAfterMock });
      mockSupabase.from.mockReturnValue({ upsert: upsertMock, select: selectAfterMock });

      await service.updateQuantity(1, 3);

      expect(upsertMock).toHaveBeenCalledWith(
        { user_id: 'user-123', product_id: 1, quantity: 3 },
        { onConflict: 'user_id,product_id' },
      );
    });

    it('should cap quantity at stock', async () => {
      // Load cart first
      const orderMock = vi.fn().mockResolvedValue({ data: mockCartItems, error: null });
      const eqMock = vi.fn().mockReturnValue({ order: orderMock });
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
      mockSupabase.from.mockReturnValue({ select: selectMock });

      await service.loadCart('user-123');

      // Try to set quantity to 20 (stock is 10)
      const upsertMock = vi.fn().mockResolvedValue({ data: null, error: null });
      const orderAfterMock = vi.fn().mockResolvedValue({ data: mockCartItems, error: null });
      const eqAfterMock = vi.fn().mockReturnValue({ order: orderAfterMock });
      const selectAfterMock = vi.fn().mockReturnValue({ eq: eqAfterMock });
      mockSupabase.from.mockReturnValue({ upsert: upsertMock, select: selectAfterMock });

      await service.updateQuantity(1, 20);

      expect(upsertMock).toHaveBeenCalledWith(
        { user_id: 'user-123', product_id: 1, quantity: 10 },
        { onConflict: 'user_id,product_id' },
      );
      expect(notificationSpy.show).toHaveBeenCalledWith(
        expect.stringContaining('Stock limited'),
        'warning',
      );
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', async () => {
      // Load cart first
      const orderMock = vi.fn().mockResolvedValue({ data: mockCartItems, error: null });
      const eqMock = vi.fn().mockReturnValue({ order: orderMock });
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
      mockSupabase.from.mockReturnValue({ select: selectMock });

      await service.loadCart('user-123');

      const remainingCart = [mockCartItems[1]];
      const eq2Mock = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      });
      const deleteMock = vi.fn().mockReturnValue({ eq: eq2Mock });
      const orderAfterMock = vi.fn().mockResolvedValue({ data: remainingCart, error: null });
      const eqAfterMock = vi.fn().mockReturnValue({ order: orderAfterMock });
      const selectAfterMock = vi.fn().mockReturnValue({ eq: eqAfterMock });
      mockSupabase.from.mockReturnValue({ delete: deleteMock, select: selectAfterMock });

      await service.removeItem(1);

      expect(mockSupabase.from).toHaveBeenCalledWith('cart_items');
      expect(notificationSpy.show).toHaveBeenCalledWith('Item removed from cart', 'success');
    });
  });

  describe('clearCart', () => {
    it('should remove all items from cart', async () => {
      const orderMock = vi.fn().mockResolvedValue({ data: [], error: null });
      const eqMock = vi.fn().mockReturnValue({ order: orderMock });
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
      mockSupabase.from.mockReturnValue({ select: selectMock });

      const eq2Mock = vi.fn().mockResolvedValue({ error: null });
      const deleteMock = vi.fn().mockReturnValue({ eq: eq2Mock });
      mockSupabase.from.mockReturnValue({ delete: deleteMock });

      await service.clearCart();

      expect(mockSupabase.from).toHaveBeenCalledWith('cart_items');
      expect(service.cartItems()).toEqual([]);
      expect(service.cartCount()).toBe(0);
      expect(service.subtotal()).toBe(0);
    });
  });

  describe('validateStock', () => {
    it('should return valid when all items have sufficient stock', async () => {
      // Load cart first
      const orderMock = vi.fn().mockResolvedValue({ data: mockCartItems, error: null });
      const eqMock = vi.fn().mockReturnValue({ order: orderMock });
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
      mockSupabase.from.mockReturnValue({ select: selectMock });

      await service.loadCart('user-123');

      const result = await service.validateStock();

      expect(result.valid).toBe(true);
      expect(result.issues).toEqual([]);
    });

    it('should return issues when items exceed stock', async () => {
      const overStockCart = [
        {
          ...mockCartItems[0],
          quantity: 15, // exceeds stock of 10
        },
      ];
      const orderMock = vi.fn().mockResolvedValue({ data: overStockCart, error: null });
      const eqMock = vi.fn().mockReturnValue({ order: orderMock });
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
      mockSupabase.from.mockReturnValue({ select: selectMock });

      await service.loadCart('user-123');

      const result = await service.validateStock();

      expect(result.valid).toBe(false);
      expect(result.issues).toHaveLength(1);
      expect(result.issues[0].productId).toBe(1);
      expect(result.issues[0].available).toBe(10);
    });
  });

  describe('computed signals', () => {
    it('should compute cartCount correctly', async () => {
      const orderMock = vi.fn().mockResolvedValue({ data: mockCartItems, error: null });
      const eqMock = vi.fn().mockReturnValue({ order: orderMock });
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
      mockSupabase.from.mockReturnValue({ select: selectMock });

      await service.loadCart('user-123');

      expect(service.cartCount()).toBe(3); // 2 + 1
    });

    it('should compute subtotal correctly', async () => {
      const orderMock = vi.fn().mockResolvedValue({ data: mockCartItems, error: null });
      const eqMock = vi.fn().mockReturnValue({ order: orderMock });
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
      mockSupabase.from.mockReturnValue({ select: selectMock });

      await service.loadCart('user-123');

      // (99.99 * 2) + (49.99 * 1) = 199.98 + 49.99 = 249.97
      expect(service.subtotal()).toBeCloseTo(249.97);
    });
  });
});
