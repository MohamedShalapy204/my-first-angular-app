import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { SettingsService } from '../../services/settings';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Footer {
  private readonly settings = inject(SettingsService);

  protected readonly content = computed(() => {
    const lang = this.settings.lang();
    return lang === 'ar' ? {
      brand: 'لومينا',
      desc: 'ملاذ لأولئك الذين يقدرون التركيز. نحن نؤمن بأن الأدوات التي نستخدمها يجب أن تكون جسوراً هادئة لعملنا الأكثر انغماساً.',
      products: 'المنتجات',
      support: 'الدعم',
      connect: 'تواصل معنا',
      rights: '© ٢٠٢٤ استوديو لومينا. جميع الحقوق محفوظة.',
      sustain: 'الاستدامة',
      terms: 'شروط العمل'
    } : {
      brand: 'Lumina',
      desc: 'A sanctuary for those who value focus. We believe that the tools we use should be silent bridges to our most immersive work.',
      products: 'Products',
      support: 'Support',
      connect: 'Connect',
      rights: '© 2024 Lumina Studio Architecture. All rights reserved.',
      sustain: 'Sustainability',
      terms: 'Terms of Focus'
    };
  });
}
