import { TestBed } from '@angular/core/testing';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { CheckoutService } from './checkout';
import { SUPABASE_CLIENT } from './cart';
import { NotificationService } from './notification';
import type { CartItemWithProduct } from '../models/frontend/cart';

describe('CheckoutService', () => {
  let service: CheckoutService;
  let mockInvoke: ReturnType<typeof vi.fn>;
  let mockNotification: { show: ReturnType<typeof vi.fn> };

  const mockCartItems: CartItemWithProduct[] = [
    {
      id: 1,
      user_id: 'user-123',
      product_id: 1,
      quantity: 2,
      created_at: '2026-01-01',
      products: { name: 'Test Product', price: 25.0, image_url: 'img.jpg', stock: 10 },
    },
  ];

  beforeEach(() => {
    mockInvoke = vi.fn();
    mockNotification = { show: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        CheckoutService,
        { provide: SUPABASE_CLIENT, useValue: { functions: { invoke: mockInvoke } } },
        { provide: NotificationService, useValue: mockNotification },
      ],
    });

    service = TestBed.inject(CheckoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createCheckoutSession', () => {
    it('should invoke create-checkout-session edge function with cart items', async () => {
      mockInvoke.mockResolvedValue({
        data: { url: 'https://checkout.stripe.com/test' },
        error: null,
      });

      const result = await service.createCheckoutSession(mockCartItems);

      expect(mockInvoke).toHaveBeenCalledWith('create-checkout-session', {
        body: {
          items: [{ product_id: 1, quantity: 2, price: 25.0 }],
        },
      });
      expect(result).toBe('https://checkout.stripe.com/test');
    });

    it('should throw error when edge function returns error', async () => {
      mockInvoke.mockResolvedValue({ data: null, error: { message: 'Function error' } });

      await expect(service.createCheckoutSession(mockCartItems)).rejects.toThrow('Function error');
      expect(mockNotification.show).toHaveBeenCalledWith(
        'Failed to create checkout session',
        'error',
      );
    });

    it('should throw error when invoke fails', async () => {
      mockInvoke.mockRejectedValue(new Error('Network error'));

      await expect(service.createCheckoutSession(mockCartItems)).rejects.toThrow('Network error');
      expect(mockNotification.show).toHaveBeenCalledWith(
        'Failed to create checkout session',
        'error',
      );
    });

    it('should map cart items to items format with product_id, quantity, price', async () => {
      mockInvoke.mockResolvedValue({
        data: { url: 'https://checkout.stripe.com/test' },
        error: null,
      });

      await service.createCheckoutSession(mockCartItems);

      const calledBody = mockInvoke.mock.calls[0][1].body;
      expect(calledBody.items).toEqual([{ product_id: 1, quantity: 2, price: 25.0 }]);
    });
  });
});
