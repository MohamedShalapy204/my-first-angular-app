import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  type OnInit,
  type OnDestroy,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart';
import { OrderService } from '../../services/order';

const POLL_INTERVAL_MS = 2000;
const POLL_TIMEOUT_MS = 30000;

@Component({
  selector: 'app-checkout-success',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
  templateUrl: './checkout-success.html',
})
export class CheckoutSuccess implements OnInit, OnDestroy {
  private readonly _cartService = inject(CartService);
  private readonly _orderService = inject(OrderService);
  private readonly _route = inject(ActivatedRoute);

  readonly orderConfirmed = signal<boolean>(false);
  readonly timedOut = signal<boolean>(false);

  private _pollTimer: ReturnType<typeof setInterval> | null = null;
  private _startTime = 0;
  private _sessionId = '';

  ngOnInit(): void {
    this._startTime = Date.now();
    this._sessionId = this._route.snapshot.queryParams['session_id'] || '';
    this._startPolling();
  }

  ngOnDestroy(): void {
    this._stopPolling();
  }

  private _startPolling(): void {
    this._pollTimer = setInterval(async () => {
      await this._checkForOrder();
    }, POLL_INTERVAL_MS);

    // Check immediately
    this._checkForOrder();
  }

  private _stopPolling(): void {
    if (this._pollTimer) {
      clearInterval(this._pollTimer);
      this._pollTimer = null;
    }
  }

  private async _checkForOrder(): Promise<void> {
    if (this.orderConfirmed() || this.timedOut()) {
      this._stopPolling();
      return;
    }

    // Check timeout
    if (Date.now() - this._startTime > POLL_TIMEOUT_MS) {
      this.timedOut.set(true);
      this._stopPolling();
      return;
    }

    try {
      // Use session_id from URL to find the specific order
      const order = this._sessionId
        ? await this._orderService.getOrderBySessionId(this._sessionId)
        : null;

      if (order?.status === 'paid') {
        this.orderConfirmed.set(true);
        this._stopPolling();
        await this._cartService.clearCart();
      }
    } catch (e) {
      console.error('Failed to check order:', e);
    }
  }
}
