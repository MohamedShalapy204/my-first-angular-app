import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { TranslationService } from '../../services/translation';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full',
  },
})
export class Footer {
  private readonly t = inject(TranslationService);

  translate(key: Parameters<TranslationService['t']>[0]): string {
    return this.t.t(key);
  }
}
