import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Checkout } from './checkout';
import { CartService } from '../../services/cart';
import { CheckoutService } from '../../services/checkout';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification';
import { provideRouter } from '@angular/router';

describe('Checkout', () => {
  let component: Checkout;
  let fixture: ComponentFixture<Checkout>;
  let router: Router;
  let mockCartService: {
    cartItems: ReturnType<typeof vi.fn>;
    subtotal: ReturnType<typeof vi.fn>;
    cartCount: ReturnType<typeof vi.fn>;
    loading: ReturnType<typeof vi.fn>;
  };
  let mockCheckoutService: {
    createCheckoutSession: ReturnType<typeof vi.fn>;
  };
  let mockNotification: {
    show: ReturnType<typeof vi.fn>;
  };

  const mockCartItems = [
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
    mockCartService = {
      cartItems: vi.fn(() => mockCartItems),
      subtotal: vi.fn(() => 50.0),
      cartCount: vi.fn(() => 2),
      loading: vi.fn(() => false),
    };
    mockCheckoutService = {
      createCheckoutSession: vi.fn(),
    };
    mockNotification = {
      show: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [Checkout],
      providers: [
        provideRouter([]),
        { provide: CartService, useValue: mockCartService },
        { provide: CheckoutService, useValue: mockCheckoutService },
        { provide: NotificationService, useValue: mockNotification },
      ],
    });

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(Checkout);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render cart items', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test Product');
  });

  it('should render subtotal', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('50.00');
  });

  it('should have a checkout button', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button');
    expect(button?.textContent?.toLowerCase()).toContain('pay');
  });

  it('should redirect to /cart when cart is empty', () => {
    mockCartService.cartItems = vi.fn(() => []);
    const navigateSpy = vi.spyOn(router, 'navigate');
    fixture = TestBed.createComponent(Checkout);
    fixture.detectChanges();
    expect(navigateSpy).toHaveBeenCalledWith(['/cart']);
  });

  it('should call checkout service and redirect on checkout', async () => {
    mockCheckoutService.createCheckoutSession.mockResolvedValue('https://checkout.stripe.com/test');
    const originalHref = window.location.href;
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    });

    fixture.detectChanges();
    await component.checkout();

    expect(mockCheckoutService.createCheckoutSession).toHaveBeenCalledWith(mockCartItems);
    expect(window.location.href).toBe('https://checkout.stripe.com/test');

    // Restore
    Object.defineProperty(window, 'location', { value: { href: originalHref } });
  });

  it('should set loading to true during checkout', async () => {
    let resolvePromise!: (value: string) => void;
    mockCheckoutService.createCheckoutSession.mockImplementation(
      () =>
        new Promise<string>((resolve) => {
          resolvePromise = resolve;
        }),
    );
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    });

    fixture.detectChanges();
    const checkoutPromise = component.checkout();

    expect(component.loading()).toBe(true);

    resolvePromise('https://checkout.stripe.com/test');
    await checkoutPromise;

    // After redirect, page would reload in real app
  });
});
