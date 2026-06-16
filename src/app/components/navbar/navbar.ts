import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { SettingsService } from '../../services/settings';
import { TranslationService } from '../../services/translation';
import { AuthService } from '../../services/auth.service';

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
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly lang = this.settings.lang;
  readonly theme = this.settings.theme;
  readonly isSearchOpen = signal(false);

  // Expose auth state for template
  readonly user = this.authService.user;
  readonly isAuthenticated = this.authService.isAuthenticated;

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

  async logout(): Promise<void> {
    await this.authService.logout();
    this.router.navigate(['/']);
  }
}
