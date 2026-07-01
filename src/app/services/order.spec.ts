import { TestBed } from '@angular/core/testing';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { OrderService } from './order';
import { SUPABASE_CLIENT } from './cart';
import type { Iorder } from '../models/db/iorder';
import type { IorderItemWithProduct } from '../models/frontend/order';

describe('OrderService', () => {
  let service: OrderService;
  let mockSupabase: {
    from: ReturnType<typeof vi.fn>;
  };

  const mockOrder: Iorder = {
    id: 1,
    user_id: 'user-123',
    status: 'paid',
    total: 149.98,
    stripe_session_id: 'sess_test123',
    stripe_event_id: undefined,
    created_at: '2026-07-01T10:00:00Z',
    updated_at: '2026-07-01T10:00:00Z',
  };

  const mockOrderItem: IorderItemWithProduct = {
    id: 1,
    order_id: 1,
    product_id: 1,
    quantity: 2,
    price_at_purchase: 99.99,
    products: {
      id: 1,
      name: 'Test Product',
      image_url: 'https://example.com/image.jpg',
    },
  };

  beforeEach(() => {
    mockSupabase = {
      from: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [OrderService, { provide: SUPABASE_CLIENT, useValue: mockSupabase }],
    });

    service = TestBed.inject(OrderService);

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getOrdersByUserId', () => {
    it('should return orders sorted newest first', async () => {
      const orders = [mockOrder];
      const orderMock = vi.fn().mockResolvedValue({ data: orders, error: null });
      const eqMock = vi.fn().mockReturnValue({ order: orderMock });
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
      mockSupabase.from.mockReturnValue({ select: selectMock });

      const result = await service.getOrdersByUserId('user-123');

      expect(result).toEqual(orders);
      expect(mockSupabase.from).toHaveBeenCalledWith('orders');
      expect(selectMock).toHaveBeenCalledWith('*');
      expect(eqMock).toHaveBeenCalledWith('user_id', 'user-123');
      expect(orderMock).toHaveBeenCalledWith('created_at', { ascending: false });
    });

    it('should return empty array on error', async () => {
      const errorMock = vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } });
      const orderMock = vi.fn().mockReturnValue({ order: errorMock });
      const eqMock = vi.fn().mockReturnValue({ order: orderMock });
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
      mockSupabase.from.mockReturnValue({ select: selectMock });

      const result = await service.getOrdersByUserId('user-123');

      expect(result).toEqual([]);
    });
  });

  describe('getOrderItems', () => {
    it('should return items with product data', async () => {
      const items = [mockOrderItem];
      const eqMock = vi.fn().mockResolvedValue({ data: items, error: null });
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
      mockSupabase.from.mockReturnValue({ select: selectMock });

      const result = await service.getOrderItems(1);

      expect(result).toEqual(items);
      expect(mockSupabase.from).toHaveBeenCalledWith('order_items');
      expect(selectMock).toHaveBeenCalledWith('*, products(name, image_url, id)');
      expect(eqMock).toHaveBeenCalledWith('order_id', 1);
    });

    it('should return empty array on error', async () => {
      const eqMock = vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } });
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
      mockSupabase.from.mockReturnValue({ select: selectMock });

      const result = await service.getOrderItems(1);

      expect(result).toEqual([]);
    });
  });

  describe('getOrderBySessionId', () => {
    it('should return order by session ID', async () => {
      const maybeSingleMock = vi.fn().mockResolvedValue({ data: mockOrder, error: null });
      const eqMock = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock });
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
      mockSupabase.from.mockReturnValue({ select: selectMock });

      const result = await service.getOrderBySessionId('sess_test123');

      expect(result).toEqual(mockOrder);
      expect(mockSupabase.from).toHaveBeenCalledWith('orders');
      expect(selectMock).toHaveBeenCalledWith('*');
      expect(eqMock).toHaveBeenCalledWith('stripe_session_id', 'sess_test123');
    });

    it('should return null on error', async () => {
      const maybeSingleMock = vi
        .fn()
        .mockResolvedValue({ data: null, error: { message: 'DB error' } });
      const eqMock = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock });
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
      mockSupabase.from.mockReturnValue({ select: selectMock });

      const result = await service.getOrderBySessionId('sess_test123');

      expect(result).toBeNull();
    });
  });

  describe('getOrderById', () => {
    it('should return order by ID', async () => {
      const maybeSingleMock = vi.fn().mockResolvedValue({ data: mockOrder, error: null });
      const eqMock = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock });
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
      mockSupabase.from.mockReturnValue({ select: selectMock });

      const result = await service.getOrderById(1);

      expect(result).toEqual(mockOrder);
      expect(mockSupabase.from).toHaveBeenCalledWith('orders');
      expect(selectMock).toHaveBeenCalledWith('*');
      expect(eqMock).toHaveBeenCalledWith('id', 1);
    });

    it('should return null on error', async () => {
      const maybeSingleMock = vi
        .fn()
        .mockResolvedValue({ data: null, error: { message: 'DB error' } });
      const eqMock = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock });
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
      mockSupabase.from.mockReturnValue({ select: selectMock });

      const result = await service.getOrderById(1);

      expect(result).toBeNull();
    });
  });
});
