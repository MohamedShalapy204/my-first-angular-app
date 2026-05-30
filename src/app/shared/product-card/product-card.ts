import { Component, computed, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Iproduct } from '../../models/iproduct';
import { ProductCardLayout, resolveAvailability } from '../../models/product-types';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe],
  templateUrl: './product-card.html',
  host: {
    class: 'block',
  },
})
export class ProductCard {
  product = input.required<Iproduct>();
  layout = input<ProductCardLayout>('grid');

  quickView = output<Iproduct>();
  addToCart = output<Iproduct>();
  toggleWishlist = output<Iproduct>();

  availability = computed(() => resolveAvailability(this.product().count));

  cardClasses = computed(() => {
    const base = [
      'group relative flex overflow-hidden rounded-(--radius-2xl)',
      'border border-(--fg-muted)/10 bg-(--bg-surface)',
      'transition-all duration-300 ease-out',
      'hover:shadow-[0_25px_50px_-12px_oklch(0_0_0/0.12)]',
    ];

    const layoutMap: Record<ProductCardLayout, string> = {
      grid: 'flex-col',
      list: 'flex-row items-center',
      featured: 'flex-col md:flex-row',
    };

    return [...base, layoutMap[this.layout()]].join(' ');
  });

  imageClasses = computed(() => {
    const base = 'overflow-hidden';

    const layoutMap: Record<ProductCardLayout, string> = {
      grid: 'aspect-[4/3] w-full',
      list: 'h-24 w-24 shrink-0 md:h-28 md:w-28',
      featured: 'aspect-[4/3] w-full md:aspect-auto md:h-full md:w-1/2',
    };

    return [base, layoutMap[this.layout()]].join(' ');
  });

  bodyClasses = computed(() => {
    const base = 'flex flex-col justify-between';

    const layoutMap: Record<ProductCardLayout, string> = {
      grid: 'p-[--space-md] gap-[--space-sm]',
      list: 'flex-1 p-[--space-sm] md:p-[--space-base]',
      featured: 'p-[--space-lg] md:p-[--space-xl] gap-[--space-base]',
    };

    return [base, layoutMap[this.layout()]].join(' ');
  });

  stars = computed(() => {
    const rating = this.product().rating ?? 0;
    return Array.from({ length: 5 }, (_, i) => i < Math.round(rating));
  });

  onQuickView(event: Event) {
    event.stopPropagation();
    this.quickView.emit(this.product());
  }

  onAddToCart(event: Event) {
    event.stopPropagation();
    if (this.availability().status !== 'out-of-stock') {
      this.addToCart.emit(this.product());
    }
  }

  onToggleWishlist(event: Event) {
    event.stopPropagation();
    this.toggleWishlist.emit(this.product());
  }
}
