import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  readonly cartCount = signal(0);

  addItem(): void {
    this.cartCount.update((count) => count + 1);
  }

  removeItem(): void {
    this.cartCount.update((count) => Math.max(0, count - 1));
  }

  reset(): void {
    this.cartCount.set(0);
  }
}
