import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signal } from '@angular/core';
import { Navbar } from './navbar';
import { AuthService } from '../../services/auth.service';
import { SettingsService } from '../../services/settings';
import { TranslationService } from '../../services/translation';

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;
  let authService: {
    user: ReturnType<typeof signal>;
    logout: ReturnType<typeof vi.fn>;
    isAuthenticated: ReturnType<typeof signal>;
  };
  let router: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authService = {
      user: signal(null),
      logout: vi.fn(),
      isAuthenticated: signal(false),
    };
    router = {
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
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
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
      authService.logout.mockResolvedValue(undefined);
      const compiled = fixture.nativeElement as HTMLElement;
      const logoutButton = compiled.querySelector(
        'button[aria-label="Logout"]',
      ) as HTMLButtonElement;

      await logoutButton.click();

      expect(authService.logout).toHaveBeenCalled();
    });

    it('should navigate to home after logout', async () => {
      authService.logout.mockResolvedValue(undefined);
      const compiled = fixture.nativeElement as HTMLElement;
      const logoutButton = compiled.querySelector(
        'button[aria-label="Logout"]',
      ) as HTMLButtonElement;

      await logoutButton.click();

      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
