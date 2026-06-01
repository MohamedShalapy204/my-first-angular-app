import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

@Component({
  selector: 'app-sidebar-filter',
  templateUrl: './sidebar-filter.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class SidebarFilter {
  readonly activeCategory = signal('all');

  readonly categories = [
    { id: 'all', label: 'All Products' },
    { id: 'keyboards', label: 'Keyboards' },
    { id: 'hardware', label: 'Hardware' },
    { id: 'audio', label: 'Audio' },
    { id: 'furniture', label: 'Furniture' },
  ];

  setCategory(id: string) {
    this.activeCategory.set(id);
  }
}
