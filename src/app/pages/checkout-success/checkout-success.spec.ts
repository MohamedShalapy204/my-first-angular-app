import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CheckoutSuccess } from './checkout-success';
import { CartService } from '../../services/cart';
import { OrderService } from '../../services/order';
import { provideRouter, ActivatedRoute } from '@angular/router';

describe('CheckoutSuccess', () => {
  let component: CheckoutSuccess;
  let fixture: ComponentFixture<CheckoutSuccess>;
  let mockCartService: { clearCart: ReturnType<typeof vi.fn> };
  let mockOrderService: { getOrderBySessionId: ReturnType<typeof vi.fn> };

  const mockActivatedRoute = {
    snapshot: {
      queryParams: { session_id: 'cs_test_123' },
    },
  };

  beforeEach(() => {
    vi.useFakeTimers();
    mockCartService = { clearCart: vi.fn().mockResolvedValue(undefined) };
    mockOrderService = { getOrderBySessionId: vi.fn().mockResolvedValue(null) };

    TestBed.configureTestingModule({
      imports: [CheckoutSuccess],
      providers: [
        provideRouter([]),
        { provide: CartService, useValue: mockCartService },
        { provide: OrderService, useValue: mockOrderService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    });

    fixture = TestBed.createComponent(CheckoutSuccess);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show confirming state initially', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Confirming');
  });

  it('should show success message when order is found with paid status', async () => {
    mockOrderService.getOrderBySessionId.mockResolvedValue({
      id: 1,
      status: 'paid',
      stripe_session_id: 'cs_test_123',
    });

    fixture.detectChanges();
    vi.advanceTimersByTime(2000);
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Order Confirmed');
  });

  it('should show timeout message when timedOut signal is true', async () => {
    fixture.detectChanges();
    component['timedOut'].set(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('email you');
  });

  it('should clear cart on successful confirmation', async () => {
    mockOrderService.getOrderBySessionId.mockResolvedValue({
      id: 1,
      status: 'paid',
    });

    fixture.detectChanges();
    vi.advanceTimersByTime(2000);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(mockCartService.clearCart).toHaveBeenCalled();
  });

  it('should have links after confirmation', async () => {
    mockOrderService.getOrderBySessionId.mockResolvedValue({
      id: 1,
      status: 'paid',
    });

    fixture.detectChanges();
    vi.advanceTimersByTime(2000);
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const links = compiled.querySelectorAll('a');
    expect(links.length).toBeGreaterThan(0);
  });

  it('should query order by session_id from URL', async () => {
    mockOrderService.getOrderBySessionId.mockResolvedValue({
      id: 1,
      status: 'paid',
    });

    fixture.detectChanges();
    vi.advanceTimersByTime(2000);
    await fixture.whenStable();

    expect(mockOrderService.getOrderBySessionId).toHaveBeenCalledWith('cs_test_123');
  });

  it('should timeout after 30 seconds', async () => {
    mockOrderService.getOrderBySessionId.mockResolvedValue(null);

    fixture.detectChanges();
    vi.advanceTimersByTime(31000);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component['timedOut']()).toBe(true);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('email you');
  });
});
