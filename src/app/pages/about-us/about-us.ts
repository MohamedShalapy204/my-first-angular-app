import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../services/translation';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.html',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class AboutUs {
  private readonly t = inject(TranslationService);

  translate(key: Parameters<TranslationService['t']>[0]): string {
    return this.t.t(key);
  }

  readonly values = [
    {
      icon: 'precision_manufacturing',
      titleKey: 'about.values.craft.title' as const,
      descriptionKey: 'about.values.craft.description' as const,
    },
    {
      icon: 'eco',
      titleKey: 'about.values.sustainability.title' as const,
      descriptionKey: 'about.values.sustainability.description' as const,
    },
    {
      icon: 'groups',
      titleKey: 'about.values.community.title' as const,
      descriptionKey: 'about.values.community.description' as const,
    },
  ];

  readonly stats = [
    { value: '2024', labelKey: 'about.stats.founded' as const },
    { value: '12K+', labelKey: 'about.stats.craftsmen' as const },
    { value: '50+', labelKey: 'about.stats.products' as const },
    { value: '98%', labelKey: 'about.stats.satisfaction' as const },
  ];
}
