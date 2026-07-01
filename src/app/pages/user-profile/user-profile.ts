import { Component, ChangeDetectionStrategy, inject, signal, type OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { TranslationService } from '../../services/translation';
import { OrderService } from '../../services/order';
import { AuthService } from '../../services/auth.service';
import type { Iorder } from '../../models/db/iorder';
import { ORDER_STATUS_DISPLAY } from '../../models/frontend/order';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.html',
  imports: [RouterLink, DatePipe, CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class UserProfile implements OnInit {
  private readonly t = inject(TranslationService);
  private readonly _orderService = inject(OrderService);
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);

  translate(key: Parameters<TranslationService['t']>[0]): string {
    return this.t.t(key);
  }

  readonly savedSetups = [
    {
      name: 'Minimalist Studio',
      description: 'A balanced workspace featuring artisanal wood and soft natural light.',
      image:
        'https://lh3.googleusercontent.com/aida/ADBb0ujY943ot04Mn3EiLP5hvKb9cHiu8-sXdFpZM_F2aBKu46xykSJhOBk3JreKUfJu4laGZ-FXWWCBcytJgbxCAyD3AfISycyTSb0bWzNOAhIy-JTTzwPofQSgT4hkbUuP9DaIIgm0RJtIBREnQw4c7h2NBtJP5fI7YRKX7hhWSH06_poOKqvqu9TewIJM8XzT7rRLIDezqTBWhKoS8_G0wLKSd4QiXP2jhX3EX4CFUVAqPoZbyxlyhRUqW9LO',
      tag: 'Curated',
    },
    {
      name: 'Developer Lab',
      description: 'Optimized for immersion with ultrawide optics and tactical feedback.',
      image:
        'https://lh3.googleusercontent.com/aida/ADBb0uibbiefEL8a61JpcVswkMdmbIQerdzy72QLOOxLTYj1iUaKFE0UBJ4v_DSAeAkgU9wHJ2m8fPjzikcmeoy8qoE1B4PPI8UJGEsnknT16JprhwboJpSDhPjMSWCwPOI-vKsj3fyzIcfdwYaD1QeseXSTunAli87Od40DVIUjU6b-R8pYUwbuAyS-1sR_a6yIBXB4cvyKlca9ERIpYEOVkbD4xp9FCxjx4pfD3WGAKcdZ5UuhKzsM4hEpOqY',
    },
  ];

  readonly orders = signal<Iorder[]>([]);
  readonly loading = signal<boolean>(true);

  readonly sidebarLinks = [
    { label: 'Personal Info', active: true },
    { label: 'Shipping Addresses', active: false },
    { label: 'Payment Methods', active: false },
    { label: 'Security & Privacy', active: false },
  ];

  async ngOnInit(): Promise<void> {
    const user = this._authService.user();
    if (user) {
      const orders = await this._orderService.getOrdersByUserId(user.id);
      this.orders.set(orders);
    }
    this.loading.set(false);
  }

  getStatusDisplay(status: string): string {
    return ORDER_STATUS_DISPLAY[status] ?? status;
  }

  viewOrder(orderId: number): void {
    this._router.navigate(['/orders', orderId]);
  }
}
