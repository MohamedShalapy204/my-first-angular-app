import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { Button } from '../../Shared/button/button';
import { SettingsService } from '../../Services/settings';

@Component({
  selector: 'app-home',
  imports: [Button],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home {
  private readonly settings = inject(SettingsService);

  // Simple reactive translation map
  protected readonly content = computed(() => {
    const lang = this.settings.lang(); // Quick access to signal
    return lang === 'ar' ? {
      badge: 'مجموعة الأثاث المكتبي ٢٠٢٤',
      title: 'تصميم مُلهم لتركيز <span class="italic text-(--accent)">أعمق</span>.',
      desc: 'نحن ننتقي الأساسيات التي تجمع بين البراعة التقنية والرفاهية الإنسانية.',
      cta1: 'تسوق المجموعة',
      cta2: 'قصتنا',
      gridTitle: 'أساسيات هادئة',
      gridSub: 'أدوات للمهندس المتأمل.'
    } : {
      badge: 'The 2024 Ergonomic Collection',
      title: 'Intentional design for <span class="italic text-(--accent)">deeper</span> focus.',
      desc: 'We curate essentials that bridge the gap between technical prowess and human well-being.',
      cta1: 'Explore Shop',
      cta2: 'Our Story',
      gridTitle: 'Silent Essentials',
      gridSub: 'Tools for the thoughtful architect.'
    };
  });
}
