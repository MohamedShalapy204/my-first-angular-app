import { Component, AfterViewInit, ElementRef, ViewChild, Inject, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslationService } from '../../services/translation';
import { ScrollReveal } from './scroll-reveal';

@Component({
  selector: 'app-collections-section',
  templateUrl: './collections-section.html',
  standalone: true,
  imports: [ScrollReveal],
  host: { class: 'block w-full' },
})
export class CollectionsSection implements AfterViewInit {
  @ViewChild('collections') collectionsRef!: ElementRef<HTMLElement>;

  private readonly t = inject(TranslationService);

  translate(key: Parameters<TranslationService['t']>[0]): string {
    return this.t.t(key);
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const container = this.collectionsRef?.nativeElement;
    if (!container) return;

    const tiltCards = container.querySelectorAll<HTMLElement>('.tilt-card');
    tiltCards.forEach((card) => {
      const inner = card.querySelector<HTMLElement>('.tilt-card-inner');
      if (!inner) return;

      card.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (centerY - y) / 10;
        const rotateY = (x - centerX) / 10;
        inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        inner.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
      });
    });
  }
}
