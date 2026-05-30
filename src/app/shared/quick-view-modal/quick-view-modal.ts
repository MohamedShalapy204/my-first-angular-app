import { Component, computed, effect, input, output, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Iproduct } from '../../models/iproduct';
import { resolveAvailability } from '../../models/product-types';

@Component({
  selector: 'app-quick-view-modal',
  imports: [CurrencyPipe],
  templateUrl: './quick-view-modal.html',
  host: {
    class: 'block',
  },
})
export class QuickViewModal {
  product = input.required<Iproduct>();
  isOpen = input<boolean>(false);

  close = output<void>();
  addToCart = output<Iproduct>();
  toggleWishlist = output<Iproduct>();

  wishlistActive = signal(false);

  availability = computed(() => resolveAvailability(this.product().count));

  stars = computed(() => {
    const rating = this.product().rating ?? 0;
    return Array.from({ length: 5 }, (_, i) => i < Math.round(rating));
  });

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  }

  onClose() {
    this.close.emit();
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.onClose();
    }
  }

  onAddToCart() {
    if (this.availability().status !== 'out-of-stock') {
      this.addToCart.emit(this.product());
    }
  }

  onToggleWishlist() {
    this.wishlistActive.update((v) => !v);
    this.toggleWishlist.emit(this.product());
  }
}
