import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { Button } from '../../shared/button/button';
import { SettingsService } from '../../services/settings';

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
      gridSub: 'أدوات للمهندس المتأمل.',
      browseCollection: 'تصفح المجموعة',
      item1Title: 'منصة مكتبية مستدامة',
      item1Sub: 'خشب البلوط المستدام والفولاذ',
      item2Title: 'لوحة مفاتيح أوريجن',
      item2Sub: 'ملمس صخري ناعم',
      item3Tag: 'حصري للأعضاء',
      item3Title: 'عدسة لومينا ٣٥ ملم<br />مجموعة برايم',
      item3Desc: 'التقط ما تراه بدقة مع بصرياتنا المصممة خصيصاً للمبسطين الباحثين عن الوضوح.',
      details: 'التفاصيل'
    } : {
      badge: 'The 2024 Ergonomic Collection',
      title: 'Intentional design for <span class="italic text-(--accent)">deeper</span> focus.',
      desc: 'We curate essentials that bridge the gap between technical prowess and human well-being.',
      cta1: 'Explore Shop',
      cta2: 'Our Story',
      gridTitle: 'Silent Essentials',
      gridSub: 'Tools for the thoughtful architect.',
      browseCollection: 'Browse Collection',
      item1Title: 'Studio Desk Console',
      item1Sub: 'Sustainable Oak & Steel',
      item2Title: 'Origin Keyboard',
      item2Sub: 'Tactile Slate Finish',
      item3Tag: 'Member Exclusive',
      item3Title: 'Lumina Lens 35mm<br />Prime Collection',
      item3Desc: 'Capture precisely what you see with our custom-engineered optics, designed for the minimalists who seek clarity.',
      details: 'Details'
    };
  });
}
