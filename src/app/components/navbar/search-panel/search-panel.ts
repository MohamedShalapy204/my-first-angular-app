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

  close(): void {
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).hasAttribute('data-backdrop')) {
      this.close();
    }
  }

  translate(key: Parameters<TranslationService['t']>[0]): string {
    return this._t.t(key);
  }
}
