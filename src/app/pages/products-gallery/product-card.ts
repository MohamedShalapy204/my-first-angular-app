import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import type { Iproduct } from '../../models/db/iproduct';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.html',
  imports: [RouterLink, CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class ProductCard {
  product = input.required<Iproduct>();
  wide = input(false);
}
