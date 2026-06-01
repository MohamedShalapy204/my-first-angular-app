import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { TranslationService } from '../../services/translation';
import { ScrollReveal } from '../home/scroll-reveal';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScrollReveal],
  host: { class: 'block w-full' },
})
export class ProductDetail {
  private readonly t = inject(TranslationService);

  translate(key: Parameters<TranslationService['t']>[0]): string {
    return this.t.t(key);
  }

  readonly specs = [
    { icon: 'desktop_windows', title: 'Display', description: '49" Ultra-wide curved panel, 5K resolution with studio-grade color accuracy and 120Hz refresh.' },
    { icon: 'texture', title: 'Surface', description: '1.5" thickness solid walnut slab with chamfered edges for ergonomic forearm support.' },
    { icon: 'settings_input_component', title: 'Cable Management', description: 'Integrated under-desk routing system with magnetic covers and a hidden power distribution hub.' },
    { icon: 'straighten', title: 'Dimensions', description: 'W: 160cm x D: 80cm x H: 74cm. Optimized for ergonomic reach and deep workstation setups.' },
  ];

  readonly reviews = [
    { name: 'Elena G.', role: 'Senior Designer, Flux Agency', quote: '"The transition to a focused desk was the single best investment I made for my creative output this year. The wood\'s warmth is grounding."' },
    { name: 'Marcus T.', role: 'Architect & Developer', quote: '"Finally, a setup that respects silence. The cable management is a masterpiece of engineering. My mind feels lighter every morning."' },
    { name: 'Sarah K.', role: 'Visual Artist', quote: '"Minimalism without compromise. Every texture feels intentional. Lumina Studio understands the luxury of space and focus."' },
  ];
}
