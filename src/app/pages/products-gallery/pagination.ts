import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class Pagination {
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
