import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { TranslationService } from '../../services/translation';
import { SidebarFilter } from './sidebar-filter';
import { ProductGrid } from './product-grid';

@Component({
  selector: 'app-products-gallery',
  templateUrl: './products-gallery.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SidebarFilter, ProductGrid],
  host: { class: 'block w-full' },
})
export class ProductsGallery {
  private readonly t = inject(TranslationService);

  translate(key: Parameters<TranslationService['t']>[0]): string {
    return this.t.t(key);
  }
}
