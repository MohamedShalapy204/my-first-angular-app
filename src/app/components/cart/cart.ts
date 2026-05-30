import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CartItem {
  id: string;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.html',
})
export class Cart {
  items = signal<CartItem[]>([
    {
      id: '1',
      name: 'Lumina Desk Mat',
      variant: 'Obsidian Mist / Large',
      price: 89.00,
      quantity: 1,
      imageUrl: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&q=80&w=300&h=300'
    },
    {
      id: '2',
      name: 'Ergo Stand',
      variant: 'Brushed Aluminum',
      price: 149.00,
      quantity: 2,
      imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=300&h=300'
    }
  ]);

  subtotal = computed(() =>
    this.items().reduce((sum, item) => sum + (item.price * item.quantity), 0)
  );

  tax = computed(() => this.subtotal() * 0.08);
  total = computed(() => this.subtotal() + this.tax());
  isEmpty = computed(() => this.items().length === 0);

  increment(id: string) {
    this.items.update(items =>
      items.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i)
    );
  }

  decrement(id: string) {
    this.items.update(items =>
      items.map(i => i.id === id && i.quantity > 1 ? { ...i, quantity: i.quantity - 1 } : i)
    );
  }

  remove(id: string) {
    this.items.update(items => items.filter(i => i.id !== id));
  }
}
