import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { CartService } from './cart';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  describe('addItem', () => {
    it('should increment count by 1', () => {
      service.addItem();
      expect(service.cartCount()).toBe(1);
    });

    it('should increment count multiple times', () => {
      service.addItem();
      service.addItem();
      service.addItem();
      expect(service.cartCount()).toBe(3);
    });
  });

  describe('removeItem', () => {
    it('should decrement count by 1', () => {
      service.addItem();
      service.addItem();
      service.removeItem();
      expect(service.cartCount()).toBe(1);
    });

    it('should clamp to 0 when count is already 0', () => {
      service.removeItem();
      service.removeItem();
      expect(service.cartCount()).toBe(0);
    });
  });
});
