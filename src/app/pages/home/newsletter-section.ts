import { Component, AfterViewInit, ElementRef, ViewChild, Inject, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslationService } from '../../services/translation';
import { ScrollReveal } from './scroll-reveal';

@Component({
  selector: 'app-newsletter-section',
  templateUrl: './newsletter-section.html',
  standalone: true,
  imports: [ScrollReveal],
  host: { class: 'block w-full' },
})
export class NewsletterSection implements AfterViewInit {
  @ViewChild('newsletter') newsletterRef!: ElementRef<HTMLElement>;

  private readonly t = inject(TranslationService);

  translate(key: Parameters<TranslationService['t']>[0]): string {
    return this.t.t(key);
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const container = this.newsletterRef?.nativeElement;
    if (!container) return;

    const magneticBtns = container.querySelectorAll<HTMLElement>('.magnetic-btn');
    magneticBtns.forEach((btn) => {
      btn.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }
}
