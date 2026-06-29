import { Component, ChangeDetectionStrategy, inject, signal, type OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart';
import { TranslationService } from '../../services/translation';

@Component({
  selector: 'app-shopping-bag',
  templateUrl: './shopping-bag.html',
  imports: [RouterLink, CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class ShoppingBag implements OnInit {
  private readonly _cartService = inject(CartService);
  private readonly _t = inject(TranslationService);

  readonly cartItems = this._cartService.cartItems;
  readonly cartCount = this._cartService.cartCount;
  readonly subtotal = this._cartService.subtotal;
  readonly loading = this._cartService.loading;

  readonly isCheckingMerge = signal<boolean>(true);

  translate(key: Parameters<TranslationService['t']>[0]): string {
    return this._t.t(key);
  }

  ngOnInit(): void {
    this.isCheckingMerge.set(false);
  }

  async updateQuantity(productId: number, delta: number): Promise<void> {
    const item = this.cartItems().find((i) => i.product_id === productId);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + delta);
      await this._cartService.updateQuantity(productId, newQuantity);
    }
  }

  async removeItem(productId: number): Promise<void> {
    await this._cartService.removeItem(productId);
  }
}
