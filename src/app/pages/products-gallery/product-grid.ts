import { Component, ChangeDetectionStrategy, signal, input } from '@angular/core';
import { ProductCard } from './product-card';
import { Iproduct } from '../../models/iproduct';

@Component({
  selector: 'app-product-grid',
  templateUrl: './product-grid.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProductCard],
  host: { class: 'block w-full' },
})
export class ProductGrid {
  readonly products = input.required<Iproduct[]>();

  readonly currentPage = signal(1);
  readonly totalPages = 8;

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage.set(page);
    }
  }

  prevPage() {
    this.goToPage(this.currentPage() - 1);
  }

  nextPage() {
    this.goToPage(this.currentPage() + 1);
  }
}
