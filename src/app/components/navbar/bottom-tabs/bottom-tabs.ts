import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../services/cart';

@Component({
  selector: 'app-bottom-tabs',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './bottom-tabs.html',
  styleUrl: './bottom-tabs.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'block md:hidden fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur-md border-t border-outline/10 safe-area-inset-bottom',
  },
})
export class BottomTabs {
  private readonly _cartService = inject(CartService);
  readonly cartCount = this._cartService.cartCount;
}
