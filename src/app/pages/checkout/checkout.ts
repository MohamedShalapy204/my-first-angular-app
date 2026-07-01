import { Component, ChangeDetectionStrategy, inject, signal, type OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart';
import { CheckoutService } from '../../services/checkout';

@Component({
  selector: 'app-checkout',
  imports: [RouterLink, CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
  templateUrl: './checkout.html',
})
export class Checkout implements OnInit {
  private readonly _cartService = inject(CartService);
  private readonly _checkoutService = inject(CheckoutService);
  private readonly _router = inject(Router);

  readonly cartItems = this._cartService.cartItems;
  readonly cartCount = this._cartService.cartCount;
  readonly subtotal = this._cartService.subtotal;
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    // Redirect to cart if empty
    if (this.cartItems().length === 0) {
      this._router.navigate(['/cart']);
    }
  }

  async checkout(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const url = await this._checkoutService.createCheckoutSession(this.cartItems());
      window.location.href = url;
    } catch (e) {
      this.loading.set(false);
      this.error.set(e instanceof Error ? e.message : 'Checkout failed');
    }
  }
}
