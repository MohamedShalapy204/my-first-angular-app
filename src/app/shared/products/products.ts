import { Component, inject, signal } from '@angular/core';
import { ProductCard } from '../product-card/product-card';
import { QuickViewModal } from '../quick-view-modal/quick-view-modal';
import { ProductService } from '../../services/product.service';
import { Iproduct } from '../../models/iproduct';
import { ProductCardLayout } from '../../models/product-types';

@Component({
  selector: 'app-products',
  imports: [ProductCard, QuickViewModal],
  templateUrl: './products.html',
})
export class Products {
  productService = inject(ProductService);

  products = this.productService.products;
  loading = this.productService.loading;
  error = this.productService.error;

  layout = signal<ProductCardLayout>('grid');
  selectedProduct = signal<Iproduct | null>(null);
  modalOpen = signal(false);

  onQuickView(product: Iproduct) {
    this.selectedProduct.set(product);
    this.modalOpen.set(true);
  }

  onCloseModal() {
    this.modalOpen.set(false);
    this.selectedProduct.set(null);
  }

  onAddToCart(product: Iproduct) {
    console.log('Add to cart:', product);
    // TODO: wire to cart service
  }

  onToggleWishlist(product: Iproduct) {
    console.log('Toggle wishlist:', product);
    // TODO: wire to wishlist service
  }

  setLayout(layout: ProductCardLayout) {
    this.layout.set(layout);
  }
}
