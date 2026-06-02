import { Component, ChangeDetectionStrategy, signal, output, input } from '@angular/core';
import { Icategory } from '../../models/icategory';

@Component({
  selector: 'app-sidebar-filter',
  templateUrl: './sidebar-filter.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class SidebarFilter {
  readonly categories = input.required<Icategory[]>();
  readonly activeCategoryId = signal<number | null>(null);
  readonly minPrice = signal<number | null>(null);
  readonly maxPrice = signal<number | null>(null);
  readonly sortBy = signal<string>('newest');

  readonly categoryChange = output<number | null>();
  readonly priceChange = output<{ min: number | null; max: number | null }>();
  readonly sortChange = output<string>();

  setCategory(id: number | null) {
    this.activeCategoryId.set(id);
    this.categoryChange.emit(id);
  }

  onMinPriceChange(value: string) {
    const min = value ? Number(value) : null;
    this.minPrice.set(min);
    this.priceChange.emit({ min: this.minPrice(), max: this.maxPrice() });
  }

  onMaxPriceChange(value: string) {
    const max = value ? Number(value) : null;
    this.maxPrice.set(max);
    this.priceChange.emit({ min: this.minPrice(), max: this.maxPrice() });
  }

  onSortChange(value: string) {
    this.sortBy.set(value);
    this.sortChange.emit(value);
  }
}
