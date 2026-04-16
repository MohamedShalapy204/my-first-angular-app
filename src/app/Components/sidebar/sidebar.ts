import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { App } from '../../app';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Sidebar {
  private readonly app = inject(App);

  protected readonly content = computed(() => {
    const lang = this.app['lang']();
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
