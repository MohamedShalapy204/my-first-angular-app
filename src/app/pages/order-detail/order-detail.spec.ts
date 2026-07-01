import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Subject } from 'rxjs';
import { OrderDetail } from './order-detail';
import { OrderService } from '../../services/order';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

describe('OrderDetail', () => {
  let component: OrderDetail;
  let fixture: ComponentFixture<OrderDetail>;
  let mockOrderService: {
    getOrderById: ReturnType<typeof vi.fn>;
    getOrderItems: ReturnType<typeof vi.fn>;
    getOrdersByUserId: ReturnType<typeof vi.fn>;
  };
  let mockAuthService: { user: ReturnType<typeof vi.fn> };
  let mockRouter: { navigate: ReturnType<typeof vi.fn> };
  let paramMapSubject: Subject<Map<string, string>>;

  const mockUser = { id: 'user-123' };

  const mockOrder = {
    id: 1,
    user_id: 'user-123',
    status: 'paid',
    total: 149.98,
    stripe_session_id: 'sess_test123',
    created_at: '2026-07-01T10:00:00Z',
    updated_at: '2026-07-01T10:00:00Z',
  };

  const mockOrder2 = {
    id: 2,
    user_id: 'user-123',
    status: 'paid',
    total: 299.99,
    stripe_session_id: 'sess_test456',
    created_at: '2026-07-02T10:00:00Z',
    updated_at: '2026-07-02T10:00:00Z',
  };

  const mockItems = [
    {
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
    },
  ];

  const mockItems2 = [
    {
      id: 2,
      order_id: 2,
      product_id: 2,
      quantity: 1,
      price_at_purchase: 299.99,
      products: {
        id: 2,
        name: 'Second Product',
        image_url: 'https://example.com/image2.jpg',
      },
    },
  ];

  /** Flush microtask queue so async subscribe callback completes */
  const flush = () => new Promise((r) => setTimeout(r, 0));

  function createParamMap(id: string): Map<string, string> {
    return new Map([['id', id]]);
  }

  beforeEach(() => {
    paramMapSubject = new Subject<Map<string, string>>();
    mockOrderService = {
      getOrderById: vi.fn().mockResolvedValue(mockOrder),
      getOrderItems: vi.fn().mockResolvedValue(mockItems),
      getOrdersByUserId: vi.fn().mockResolvedValue([mockOrder, mockOrder2]),
    };
    mockAuthService = {
      user: vi.fn(() => mockUser),
    };
    mockRouter = {
      navigate: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [OrderDetail],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: OrderService, useValue: mockOrderService },
        { provide: AuthService, useValue: mockAuthService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: vi.fn().mockReturnValue('1') } },
            paramMap: paramMapSubject.asObservable(),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(OrderDetail);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load order on init', async () => {
    fixture.detectChanges();
    paramMapSubject.next(createParamMap('1'));
    await flush();
    fixture.detectChanges();

    expect(mockOrderService.getOrdersByUserId).toHaveBeenCalledWith('user-123');
    expect(mockOrderService.getOrderById).toHaveBeenCalledWith(1);
    expect(component.order()).toEqual(mockOrder);
  });

  it('should load items on init', async () => {
    fixture.detectChanges();
    paramMapSubject.next(createParamMap('1'));
    await flush();
    fixture.detectChanges();

    expect(mockOrderService.getOrderItems).toHaveBeenCalledWith(1);
    expect(component.items()).toEqual(mockItems);
  });

  it('should show order header', async () => {
    fixture.detectChanges();
    paramMapSubject.next(createParamMap('1'));
    await flush();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Order #1');
    expect(compiled.textContent).toContain('Paid');
  });

  it('should show order items', async () => {
    fixture.detectChanges();
    paramMapSubject.next(createParamMap('1'));
    await flush();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test Product');
    expect(compiled.textContent).toContain('Qty: 2');
  });

  it('should navigate back to profile', async () => {
    fixture.detectChanges();
    paramMapSubject.next(createParamMap('1'));
    await flush();
    fixture.detectChanges();

    component.backToProfile();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/profile']);
  });

  it('should navigate to next order', async () => {
    fixture.detectChanges();
    paramMapSubject.next(createParamMap('1'));
    await flush();
    fixture.detectChanges();

    expect(component.hasNext).toBe(true);
    component.nextOrder();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/orders', 2]);
  });

  it('should not navigate to previous order when at first', async () => {
    fixture.detectChanges();
    paramMapSubject.next(createParamMap('1'));
    await flush();
    fixture.detectChanges();

    expect(component.hasPrevious).toBe(false);
    component.previousOrder();

    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should reload data when route param changes', async () => {
    fixture.detectChanges();
    paramMapSubject.next(createParamMap('1'));
    await flush();
    fixture.detectChanges();

    expect(component.order()?.id).toBe(1);

    mockOrderService.getOrderById.mockResolvedValue(mockOrder2);
    mockOrderService.getOrderItems.mockResolvedValue(mockItems2);

    paramMapSubject.next(createParamMap('2'));
    await flush();
    fixture.detectChanges();

    expect(component.order()?.id).toBe(2);
    expect(mockOrderService.getOrderById).toHaveBeenCalledWith(2);
    expect(mockOrderService.getOrderItems).toHaveBeenCalledWith(2);
  });

  it('should clear items while loading new order', async () => {
    fixture.detectChanges();
    paramMapSubject.next(createParamMap('1'));
    await flush();
    fixture.detectChanges();

    expect(component.items()).toEqual(mockItems);

    mockOrderService.getOrderById.mockResolvedValue(mockOrder2);
    mockOrderService.getOrderItems.mockResolvedValue(mockItems2);

    paramMapSubject.next(createParamMap('2'));
    // Don't flush yet — check items are cleared
    expect(component.items()).toEqual([]);

    await flush();
    fixture.detectChanges();

    expect(component.items()).toEqual(mockItems2);
  });
});
