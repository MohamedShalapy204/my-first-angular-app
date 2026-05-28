import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { SettingsService } from '../../Services/settings';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Sidebar {
  private readonly settings = inject(SettingsService);

  protected readonly content = computed(() => {
    const lang = this.settings.lang();
    return lang === 'ar' ? {
      collections: 'المجموعات',
      audio: 'الصوتيات الأساسية',
      workspace: 'تدفق العمل',
      ergo: 'علم الهندسة البشرية',
      discovery: 'اكتشف',
      latest: 'أحدث الإضافات',
      product: 'ماوس اللمس الانسيابي',
      quote: '"البساطة هي قمة الفخامة."',
      cta: 'قصص الأعضاء'
    } : {
      collections: 'Collections',
      audio: 'Essential Audio',
      workspace: 'Workspace flow',
      ergo: 'Ergonomics',
      discovery: 'Discovery',
      latest: 'Latest',
      product: 'Haptic Flow Mouse',
      quote: '"Silence is the ultimate luxury."',
      cta: 'Member Stories'
    };
  });
}
