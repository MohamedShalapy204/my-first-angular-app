import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SettingsService } from '../../services/settings';
import { TranslationService } from '../../services/translation';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification';
import { CartService } from '../../services/cart';
import { toggleSidebar } from '../../store/sidebar/sidebar.actions';
import { BottomTabs } from './bottom-tabs/bottom-tabs';
import { SearchPanel } from './search-panel/search-panel';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  imports: [RouterLink, BottomTabs, SearchPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sticky top-0 block w-full z-50',
  },
})
export class Navbar {
  private readonly _store = inject(Store);
  private readonly _settings = inject(SettingsService);
  private readonly _t = inject(TranslationService);
  private readonly _authService = inject(AuthService);
  private readonly _notification = inject(NotificationService);
  private readonly _router = inject(Router);
  private readonly _cartService = inject(CartService);

  readonly lang = this._settings.lang;
  readonly theme = this._settings.theme;
  readonly cartCount = this._cartService.cartCount;
  readonly isSearchOpen = signal(false);
  readonly user = this._authService.user;
  readonly isAuthenticated = this._authService.isAuthenticated;

  translate(key: Parameters<TranslationService['t']>[0]): string {
    return this._t.t(key);
  }

  toggleSidebar() {
    this._store.dispatch(toggleSidebar());
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
