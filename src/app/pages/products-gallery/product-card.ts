import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.html',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class ProductCard {
  product = input.required<{ id: number; name: string; description: string; price: string; image: string }>();
  wide = input(false);
}
