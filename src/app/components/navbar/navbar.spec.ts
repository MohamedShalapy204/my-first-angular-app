import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signal } from '@angular/core';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Navbar } from './navbar';
import { AuthService } from '../../services/auth.service';
import { SettingsService } from '../../services/settings';
import { TranslationService } from '../../services/translation';
import { CartService } from '../../services/cart';

describe('Navbar', () => {
  let fixture: ComponentFixture<Navbar>;
  let authService: {
    user: ReturnType<typeof signal>;
    logout: ReturnType<typeof vi.fn>;
    isAuthenticated: ReturnType<typeof signal>;
  };

  beforeEach(async () => {
    authService = {
      user: signal(null),
      logout: vi.fn(),
      isAuthenticated: signal(false),
    };

    await TestBed.configureTestingModule({
      imports: [Navbar, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authService },
        {
          provide: SettingsService,
          useValue: {
            lang: vi.fn().mockReturnValue('en'),
            theme: vi.fn().mockReturnValue('light'),
            toggleTheme: vi.fn(),
            toggleLang: vi.fn(),
          },
        },
        { provide: TranslationService, useValue: { t: vi.fn().mockReturnValue('translated') } },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: {},
            },
          },
        },
        provideMockStore({ initialState: { sidebar: { isOpen: false } } }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    fixture.detectChanges();
  });

  describe('unauthenticated state', () => {
    beforeEach(() => {
      authService.user.set(null);
      authService.isAuthenticated.set(false);
      fixture.detectChanges();
    });

    it('should show login link', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('a[routerLink="/login"]')).toBeTruthy();
    });

    it('should show register link', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('a[routerLink="/register"]')).toBeTruthy();
    });

    it('should not show logout button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('button[aria-label="Logout"]')).toBeFalsy();
    });
  });

  describe('authenticated state', () => {
    beforeEach(() => {
      authService.user.set({ id: '123', email: 'test@example.com' } as any);
      authService.isAuthenticated.set(true);
      fixture.detectChanges();
    });

    it('should show profile link', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('a[routerLink="/profile"]')).toBeTruthy();
    });

    it('should show logout button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('button[aria-label="Logout"]')).toBeTruthy();
    });

    it('should not show login link', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('a[routerLink="/login"]')).toBeFalsy();
    });

    it('should not show register link', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('a[routerLink="/register"]')).toBeFalsy();
    });

    it('should call AuthService.logout on logout click', async () => {
      authService.logout.mockResolvedValue({ success: true });
      const compiled = fixture.nativeElement as HTMLElement;
      const logoutButton = compiled.querySelector(
        'button[aria-label="Logout"]',
      ) as HTMLButtonElement;

      await logoutButton.click();

      expect(authService.logout).toHaveBeenCalled();
    });
  });

  describe('skip-to-content link', () => {
    it('should have skip link in DOM', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const skipLink = compiled.querySelector('a[href="#main-content"]');
      expect(skipLink).toBeTruthy();
    });

    it('should be hidden by default (sr-only)', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const skipLink = compiled.querySelector('a[href="#main-content"]') as HTMLElement;
      expect(skipLink.classList.contains('sr-only')).toBe(true);
    });

    it('should be visible on focus', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const skipLink = compiled.querySelector('a[href="#main-content"]') as HTMLElement;
      skipLink.focus();
      expect(skipLink.classList.contains('focus:not-sr-only')).toBe(true);
    });
  });

  describe('cart badge', () => {
    it('should hide badge when cart count is 0', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const badge = compiled.querySelector('[data-cart-badge]');
      expect(badge).toBeFalsy();
    });

    it('should show badge when cart count is greater than 0', () => {
      const cartService = TestBed.inject(CartService);
      cartService.addItem();
      cartService.addItem();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const badge = compiled.querySelector('[data-cart-badge]');
      expect(badge).toBeTruthy();
    });

    it('should display correct count in badge', () => {
      const cartService = TestBed.inject(CartService);
      for (let i = 0; i < 5; i++) {
        cartService.addItem();
      }
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const badge = compiled.querySelector('[data-cart-badge]') as HTMLElement;
      expect(badge.textContent?.trim()).toBe('5');
    });
  });
});
