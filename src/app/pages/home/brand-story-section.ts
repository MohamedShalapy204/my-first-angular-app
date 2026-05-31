import { Component, AfterViewInit, ElementRef, ViewChild, Inject, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslationService } from '../../services/translation';
import { ScrollReveal } from './scroll-reveal';

@Component({
  selector: 'app-brand-story-section',
  templateUrl: './brand-story-section.html',
  standalone: true,
  imports: [ScrollReveal],
  host: { class: 'block w-full' },
})
export class BrandStorySection implements AfterViewInit {
  @ViewChild('story') storyRef!: ElementRef<HTMLElement>;

  private readonly t = inject(TranslationService);

  translate(key: Parameters<TranslationService['t']>[0]): string {
    return this.t.t(key);
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
  }
}
