import { Component, signal, Renderer2, inject, effect, ChangeDetectionStrategy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Header } from './Components/header/header';
import { Footer } from './Components/footer/footer';
import { Sidebar } from './Components/sidebar/sidebar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  private readonly renderer = inject(Renderer2);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  
  protected readonly theme = signal<'light' | 'dark'>('light');
  protected readonly lang = signal<'ar' | 'en'>('ar'); // Default to Arabic

  constructor() {
    // Sync Theme
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.renderer.setAttribute(this.document.documentElement, 'data-theme', this.theme());
      }
    });

    // Sync Direction (RTL/LTR)
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        const currentLang = this.lang();
        this.renderer.setAttribute(this.document.documentElement, 'lang', currentLang);
        this.renderer.setAttribute(this.document.documentElement, 'dir', currentLang === 'ar' ? 'rtl' : 'ltr');
      }
    });
  }

  toggleTheme() {
    this.theme.update(t => t === 'light' ? 'dark' : 'light');
  }

  toggleLanguage() {
    this.lang.update(l => l === 'ar' ? 'en' : 'ar');
  }
}
