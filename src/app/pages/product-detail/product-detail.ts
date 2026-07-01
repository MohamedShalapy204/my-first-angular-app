import { Component, ChangeDetectionStrategy, inject, input, signal, effect } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../services/translation';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart';
import type { ProductWithCategory } from '../../models/frontend/product';
import { Skeleton } from '../../shared/skeleton/skeleton';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, Skeleton, RouterLink],
  host: { class: 'block w-full' },
})
export class ProductDetail {
  readonly id = input.required<string>();

  private readonly _t = inject(TranslationService);
  private readonly _productService = inject(ProductService);
  private readonly _cartService = inject(CartService);

  readonly product = signal<ProductWithCategory | null>(null);
  readonly loading = signal<boolean>(true);
  readonly quantity = signal<number>(1);
  readonly addingToCart = signal<boolean>(false);
  readonly lightboxOpen = signal<boolean>(false);

  constructor() {
    effect(async () => {
      const productId = Number(this.id());
      if (isNaN(productId)) {
        this.product.set(null);
        this.loading.set(false);
        return;
      }

      this.loading.set(true);
      try {
        const productData = await this._productService.getProductById(productId);
        this.product.set(productData);
      } finally {
        this.loading.set(false);
      }
    });
  }

  translate(key: Parameters<TranslationService['t']>[0]): string {
    return this._t.t(key);
  }

  readonly specs = [
    {
      icon: 'desktop_windows',
      title: 'Display',
      description:
        '49" Ultra-wide curved panel, 5K resolution with studio-grade color accuracy and 120Hz refresh.',
    },
    {
      icon: 'texture',
      title: 'Surface',
      description:
        '1.5" thickness solid walnut slab with chamfered edges for ergonomic forearm support.',
    },
    {
      icon: 'settings_input_component',
      title: 'Cable Management',
      description:
        'Integrated under-desk routing system with magnetic covers and a hidden power distribution hub.',
    },
    {
      icon: 'straighten',
      title: 'Dimensions',
      description:
        'W: 160cm x D: 80cm x H: 74cm. Optimized for ergonomic reach and deep workstation setups.',
    },
  ];

  readonly reviews = [
    {
      name: 'Elena G.',
      role: 'Senior Designer, Flux Agency',
      quote:
        '"The transition to a focused desk was the single best investment I made for my creative output this year. The wood\'s warmth is grounding."',
    },
    {
      name: 'Marcus T.',
      role: 'Architect & Developer',
      quote:
        '"Finally, a setup that respects silence. The cable management is a masterpiece of engineering. My mind feels lighter every morning."',
    },
    {
      name: 'Sarah K.',
      role: 'Visual Artist',
      quote:
        '"Minimalism without compromise. Every texture feels intentional. Lumina Studio understands the luxury of space and focus."',
    },
  ];

  updateQuantity(delta: number): void {
    this.quantity.update((q) => Math.max(1, Math.min(q + delta, this.product()?.stock || 99)));
  }

  async addToCart(): Promise<void> {
    const prod = this.product();
    if (!prod) return;

    this.addingToCart.set(true);
    try {
      await this._cartService.addItem(prod.id, this.quantity(), prod);
    } finally {
      this.addingToCart.set(false);
    }
  }

  openLightbox(): void {
    this.lightboxOpen.set(true);
  }

  closeLightbox(): void {
    this.lightboxOpen.set(false);
  }
}
