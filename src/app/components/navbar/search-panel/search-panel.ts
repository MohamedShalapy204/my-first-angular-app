import {
  Component,
  ChangeDetectionStrategy,
  inject,
  HostListener,
  type ElementRef,
  viewChild,
  effect,
  input,
  output,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslationService } from '../../../services/translation';

@Component({
  selector: 'app-search-panel',
  imports: [],
  templateUrl: './search-panel.html',
  styleUrl: './search-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block md:hidden',
  },
})
export class SearchPanel {
  private readonly _t = inject(TranslationService);
  private readonly _router = inject(Router);

  readonly isOpen = input(false);
  readonly closed = output<void>();
  readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        const input = this.searchInput();
        if (input) {
          input.nativeElement.focus();
        }
      }
    });
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isOpen()) {
      this.close();
    }
  }

  submitSearch(): void {
    const input = this.searchInput();
    const query = input?.nativeElement.value?.trim() || '';
    this.close();
    this._router.navigate(['/products'], {
      queryParams: query ? { search: query } : {},
      queryParamsHandling: 'merge',
    });
  }

  onSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.submitSearch();
    }
  }

  close(): void {
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  translate(key: Parameters<TranslationService['t']>[0]): string {
    return this._t.t(key);
  }
}
