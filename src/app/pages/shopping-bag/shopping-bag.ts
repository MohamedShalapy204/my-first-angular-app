import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../services/translation';

interface CartItem {
  id: number;
  name: string;
  variant: string;
  price: number;
  image: string;
  quantity: number;
}

@Component({
  selector: 'app-shopping-bag',
  templateUrl: './shopping-bag.html',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class ShoppingBag {
  private readonly t = inject(TranslationService);

  translate(key: Parameters<TranslationService['t']>[0]): string {
    return this.t.t(key);
  }

  readonly items = signal<CartItem[]>([
    {
      id: 1,
      name: 'Custom Mechanical Keyboard',
      variant: 'Walnut Case • Brass Plate',
      price: 420,
      image: 'https://lh3.googleusercontent.com/aida/ADBb0ujTTNURJeeCcb-IlbYarQBWZYaP-XWhAY8Q-3vXuoysVAwtzaNBDiEbQ44oFJQgJwDfXpzroEkYEZbY03a2cUeiRJRH-ToesbM35BjuMwB2ey1_P_T8nlVu_GtOrt2BNXkYcKFsBxWQro_NxS0ZeIVwvO3K6sGUnOgoK3xWe5ldpfIBKW5xe8sw1fnoAVHDAnDYoreH70KjSS1kFgoIEIlSfCo4xA1VOHK9wwfGrBIHCWKBO0uBOXiS1ALJ',
      quantity: 1,
    },
    {
      id: 2,
      name: 'High-Performance GPU',
      variant: 'Founders Edition • 24GB VRAM',
      price: 1599,
      image: 'https://lh3.googleusercontent.com/aida/ADBb0ujfzIbtbA7H7eJR8_x8NvAf3D9eHYulEQ5Y7OQ-gAXCyIQCjAIaRzu7fI-tOC7YTDkew7QDN6Ex4QI1kbaez380mh5g2YeJqnnoAcnk_X57PiTjChfVbSvYX4ZXDBjuShCShL9B3N7t8mKafe_GLnCcfa_f1SADra5qsVbnDZaI58e6hWj4iueiNAGMjHKSk8odeDi3Q-Gqf6w2Id5KSEDXcQlue9J46bLENdxPYNzRGNUShPS8uvs0-59M',
      quantity: 1,
    },
    {
      id: 3,
      name: 'Studio Microphone',
      variant: 'Matte Black • XLR Cardioid',
      price: 399,
      image: 'https://lh3.googleusercontent.com/aida/ADBb0ugNr-r4ZF9wXYXRdwNJGA-kLA1q_3weT7wEY-M_RFiaEn6yzgdkyKASearc2bYpYK2qE-wTcPHPCKfs3wGNddDy5rI2MjuFzOKU_qlqJvCiWlEQAg4JgrejeEnJ6ss_YzOQW5vXietH8r-HtEZ27m94JydCBlZahdz1W-ksru8lFNGA1h3u6qVRxfrT89blxcE4CynhFLVe-C9lPU1lKPpTe9kH0W58Qoo70BxSCArUi5feu10iipR8Wjz-',
      quantity: 1,
    },
  ]);

  readonly subtotal = computed(() =>
    this.items().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  readonly total = computed(() => this.subtotal());

  updateQuantity(id: number, delta: number) {
    this.items.update((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  }

  removeItem(id: number) {
    this.items.update((items) => items.filter((item) => item.id !== id));
  }
}
