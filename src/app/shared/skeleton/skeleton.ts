import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

export type SkeletonVariant = 'text' | 'circle' | 'rectangle' | 'product-card';

@Component({
  selector: 'app-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './skeleton.html',
  styleUrl: './skeleton.css',
})
export class Skeleton {
  readonly variant = input<SkeletonVariant>('text');
  readonly width = input<string>('100%');
  readonly height = input<string>('1rem');
  readonly borderRadius = input<string>('0.25rem');

  readonly isProductCard = computed(() => this.variant() === 'product-card');
  readonly isText = computed(() => this.variant() === 'text');
  readonly isCircle = computed(() => this.variant() === 'circle');
  readonly isRectangle = computed(() => this.variant() === 'rectangle');
}
