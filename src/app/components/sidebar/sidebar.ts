import {
  Component,
  ChangeDetectionStrategy,
  inject,
  computed,
  HostListener,
  effect,
  ElementRef,
} from '@angular/core';
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
  private readonly _elementRef = inject(ElementRef);

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
      top: '5rem',
      bottom: '4rem',
      [side]: 0,
      width: '20rem',
      maxWidth: '85vw',
      transform: translate,
      transition: 'transform 300ms ease-out',
    };
  });

  constructor() {
    // Trap focus when sidebar is open
    effect(() => {
      const open = this.isOpen();
      if (open) {
        const aside = this._elementRef.nativeElement.querySelector('aside');
        if (aside) {
          aside.focus();
        }
      }
    });
  }

  @HostListener('window:resize')
  onResize(): void {
    if (this.isOpen()) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isOpen()) {
      this.close();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.isOpen()) {
      return;
    }

    if (event.key === 'Tab') {
      this.trapFocus(event);
    }
  }

  private trapFocus(event: KeyboardEvent): void {
    const aside = this._elementRef.nativeElement.querySelector('aside');
    if (!aside) {
      return;
    }

    const focusableElements = aside.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ) as NodeListOf<HTMLElement>;
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      // Shift + Tab: go backwards
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      }
    } else {
      // Tab: go forwards
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }
  }

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
