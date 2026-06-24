import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Sidebar } from './sidebar';
import { AuthService } from '../../services/auth.service';
import { SettingsService } from '../../services/settings';
import { TranslationService } from '../../services/translation';
import { RouterTestingModule } from '@angular/router/testing';

describe('Sidebar', () => {
  let component: Sidebar;
  let fixture: ComponentFixture<Sidebar>;
  let store: MockStore;
  let authService: {
    user: ReturnType<typeof vi.fn>;
    logout: ReturnType<typeof vi.fn>;
    isAuthenticated: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    authService = {
      user: vi.fn().mockReturnValue(null),
      logout: vi.fn().mockResolvedValue({ success: true }),
      isAuthenticated: vi.fn().mockReturnValue(false),
    };

    await TestBed.configureTestingModule({
      imports: [Sidebar, RouterTestingModule],
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
        provideMockStore({ initialState: { sidebar: { isOpen: false } } }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Sidebar);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  describe('close method', () => {
    it('should dispatch closeSidebar action', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');
      component.close();
      expect(dispatchSpy).toHaveBeenCalled();
    });
  });

  describe('template', () => {
    it('should have shop link', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const link = compiled.querySelector('a[routerLink="/products"]');
      expect(link).toBeTruthy();
    });

    it('should have cart link', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const link = compiled.querySelector('a[routerLink="/cart"]');
      expect(link).toBeTruthy();
    });
  });
});
