import {
  Injectable,
  inject,
  signal,
  effect,
  PLATFORM_ID,
  RendererFactory2,
} from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

export type Theme = 'light' | 'dark';
export type Lang = 'en' | 'ar';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly renderer = inject(RendererFactory2).createRenderer(null, null);

  // Source of truth
  readonly theme = signal<Theme>('light');
  readonly lang = signal<Lang>('ar');

  constructor() {
    this.initializeFromStorage();

    // Sync Theme to DOM and Storage
    effect(() => {
      const currentTheme = this.theme();
      if (isPlatformBrowser(this.platformId)) {
        this.renderer.setAttribute(this.document.documentElement, 'data-theme', currentTheme);
        localStorage.setItem('theme', currentTheme);
      }
    });

    // Sync Lang to DOM and Storage
    effect(() => {
      const currentLang = this.lang();
      if (isPlatformBrowser(this.platformId)) {
        this.renderer.setAttribute(this.document.documentElement, 'lang', currentLang);
        this.renderer.setAttribute(this.document.documentElement, 'dir', currentLang === 'ar' ? 'rtl' : 'ltr');
        localStorage.setItem('lang', currentLang);
      }
    });
  }

  toggleTheme() {
    this.theme.update((t) => (t === 'light' ? 'dark' : 'light'));
  }

  toggleLang() {
    this.lang.update((l) => (l === 'en' ? 'ar' : 'en'));
  }

  private initializeFromStorage() {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme') as Theme;
      const savedLang = localStorage.getItem('lang') as Lang;

      if (savedTheme) this.theme.set(savedTheme);
      if (savedLang) this.lang.set(savedLang);
    }
  }
}
