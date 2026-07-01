import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  type OnInit,
  type OnDestroy,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import type { Subscription } from 'rxjs';
import { OrderService } from '../../services/order';
import { AuthService } from '../../services/auth.service';
import { ORDER_STATUS_DISPLAY } from '../../models/frontend/order';
import type { Iorder } from '../../models/db/iorder';
import type { IorderItemWithProduct } from '../../models/frontend/order';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.html',
  imports: [RouterLink, DatePipe, CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class OrderDetail implements OnInit, OnDestroy {
  private readonly _orderService = inject(OrderService);
  private readonly _authService = inject(AuthService);
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);

  readonly order = signal<Iorder | null>(null);
  readonly items = signal<IorderItemWithProduct[]>([]);
  readonly orderIds = signal<number[]>([]);
  readonly currentIndex = signal<number>(-1);
  readonly loading = signal<boolean>(true);

  private _routeSub: Subscription | null = null;
  private _initialized = false;

  async ngOnInit(): Promise<void> {
    this._routeSub = this._route.paramMap.subscribe(async (params) => {
      const id = Number(params.get('id'));
      if (!id) {
        this._router.navigate(['/profile']);
        return;
      }

      const user = this._authService.user();
      if (!user) {
        this._router.navigate(['/login']);
        return;
      }

      if (!this._initialized) {
        const orders = await this._orderService.getOrdersByUserId(user.id);
        this.orderIds.set(orders.map((o) => o.id));
        this._initialized = true;
      }

      this.currentIndex.set(this.orderIds().indexOf(id));
      await this.loadOrder(id);
    });
  }

  ngOnDestroy(): void {
    this._routeSub?.unsubscribe();
  }

  private async loadOrder(id: number): Promise<void> {
    this.loading.set(true);
    this.items.set([]);
    const orderData = await this._orderService.getOrderById(id);
    this.order.set(orderData);

    if (orderData) {
      this.items.set(await this._orderService.getOrderItems(id));
    }

    this.loading.set(false);
  }

  getStatusDisplay(status: string): string {
    return ORDER_STATUS_DISPLAY[status] ?? status;
  }

  get hasPrevious(): boolean {
    return this.currentIndex() > 0;
  }

  get hasNext(): boolean {
    return this.currentIndex() < this.orderIds().length - 1;
  }

  previousOrder(): void {
    if (this.hasPrevious) {
      const prevId = this.orderIds()[this.currentIndex() - 1];
      this._router.navigate(['/orders', prevId]);
    }
  }

  nextOrder(): void {
    if (this.hasNext) {
      const nextId = this.orderIds()[this.currentIndex() + 1];
      this._router.navigate(['/orders', nextId]);
    }
  }

  backToProfile(): void {
    this._router.navigate(['/profile']);
  }
}
