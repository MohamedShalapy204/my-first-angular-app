import {
  Component,
  type AfterViewInit,
  type ElementRef,
  ViewChild,
  Inject,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../services/translation';

@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.html',
  imports: [RouterLink],
  host: { class: 'block w-full' },
})
export class HeroSection implements AfterViewInit {
  @ViewChild('hero') heroRef!: ElementRef<HTMLElement>;

  private readonly t = inject(TranslationService);

  translate(key: Parameters<TranslationService['t']>[0]): string {
    return this.t.t(key);
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const hero = this.heroRef?.nativeElement;
    if (!hero) return;

    const layers = hero.querySelectorAll<HTMLElement>('.parallax-layer');
    hero.addEventListener('mousemove', (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const moveX = (e.clientX - centerX) / centerX;
      const moveY = (e.clientY - centerY) / centerY;
      layers.forEach((layer) => {
        const speed = parseFloat(layer.getAttribute('data-speed') || '0.02');
        const x = moveX * speed * 400;
        const y = moveY * speed * 400;
        layer.style.transform = `translate(${x}px, ${y}px)`;
      });
    });
  }
}
