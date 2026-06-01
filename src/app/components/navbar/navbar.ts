import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SettingsService } from '../../services/settings';
import { TranslationService } from '../../services/translation';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full',
  },
})
export class Navbar {
  private readonly settings = inject(SettingsService);
  private readonly t = inject(TranslationService);

  readonly lang = this.settings.lang;
  readonly theme = this.settings.theme;
  readonly isSearchOpen = signal(false);

  translate(key: Parameters<TranslationService['t']>[0]): string {
    return this.t.t(key);
  }

  toggleSearch() {
    this.isSearchOpen.update((v) => !v);
  }

  toggleTheme() {
    this.settings.toggleTheme();
  }

  toggleLang() {
    this.settings.toggleLang();
  }
}
