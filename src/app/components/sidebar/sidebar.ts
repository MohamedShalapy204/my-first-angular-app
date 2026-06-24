import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectSidebarIsOpen } from '../../store/sidebar/sidebar.selectors';
import { closeSidebar } from '../../store/sidebar/sidebar.actions';
import { SettingsService } from '../../services/settings';
import { TranslationService } from '../../services/translation';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  private readonly _store = inject(Store);
  private readonly _settings = inject(SettingsService);
  private readonly _t = inject(TranslationService);
  private readonly _authService = inject(AuthService);
  private readonly _notification = inject(NotificationService);

  readonly isOpen = toSignal(this._store.select(selectSidebarIsOpen), { initialValue: false });
  readonly lang = this._settings.lang;
  readonly theme = this._settings.theme;
  readonly user = this._authService.user;
  readonly isAuthenticated = this._authService.isAuthenticated;
  readonly cartCount = inject(CartService).cartCount;

  readonly sidebarStyle = computed(() => {
    const open = this.isOpen();
    const rtl = this.lang() === 'ar';
    const translate = open ? 'translateX(0)' : rtl ? 'translateX(100%)' : 'translateX(-100%)';
    const side = rtl ? 'right' : 'left';
    return {
      position: 'fixed' as const,
      top: 0,
      [side]: 0,
      height: '100%',
      width: '20rem',
      maxWidth: '85vw',
      transform: translate,
      transition: 'transform 300ms ease-out',
    };
  });

  close(): void {
    this._store.dispatch(closeSidebar());
  }

  translate(key: Parameters<TranslationService['t']>[0]): string {
    return this._t.t(key);
  }

  toggleTheme(): void {
    this._settings.toggleTheme();
  }

  toggleLang(): void {
    this._settings.toggleLang();
  }

  async logout(): Promise<void> {
    const result = await this._authService.logout();
    if (result.success) {
      this._notification.show('Successfully logged out', 'success');
      this.close();
    } else {
      this._notification.show(result.error || 'Logout failed', 'error');
    }
  }
}
