import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { SettingsService } from '../../services/settings';
import { TranslationService } from '../../services/translation';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification';

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
  private readonly _settings = inject(SettingsService);
  private readonly _t = inject(TranslationService);
  private readonly _authService = inject(AuthService);
  private readonly _notification = inject(NotificationService);
  private readonly _router = inject(Router);

  readonly lang = this._settings.lang;
  readonly theme = this._settings.theme;
  readonly isSearchOpen = signal(false);

  // Expose auth state for template
  readonly user = this._authService.user;
  readonly isAuthenticated = this._authService.isAuthenticated;

  translate(key: Parameters<TranslationService['t']>[0]): string {
    return this._t.t(key);
  }

  toggleSearch() {
    this.isSearchOpen.update((v) => !v);
  }

  toggleTheme() {
    this._settings.toggleTheme();
  }

  toggleLang() {
    this._settings.toggleLang();
  }

  async logout(): Promise<void> {
    const result = await this._authService.logout();
    if (result.success) {
      this._notification.show('Successfully logged out', 'success');
      this._router.navigate(['/']);
    } else {
      this._notification.show(result.error || 'Logout failed', 'error');
    }
  }
}
