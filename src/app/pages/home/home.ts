import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ParticleCanvas } from './particle-canvas';
import { HeroSection } from './hero-section';
import { BrandStorySection } from './brand-story-section';
import { CollectionsSection } from './collections-section';
import { FeaturedProductSection } from './featured-product-section';
import { NewsletterSection } from './newsletter-section';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ParticleCanvas,
    HeroSection,
    BrandStorySection,
    CollectionsSection,
    FeaturedProductSection,
    NewsletterSection,
  ],
  host: { class: 'block w-full' },
})
export class Home {}
