import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../services/translation';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.html',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class UserProfile {
  private readonly t = inject(TranslationService);

  translate(key: Parameters<TranslationService['t']>[0]): string {
    return this.t.t(key);
  }

  readonly savedSetups = [
    {
      name: 'Minimalist Studio',
      description: 'A balanced workspace featuring artisanal wood and soft natural light.',
      image: 'https://lh3.googleusercontent.com/aida/ADBb0ujY943ot04Mn3EiLP5hvKb9cHiu8-sXdFpZM_F2aBKu46xykSJhOBk3JreKUfJu4laGZ-FXWWCBcytJgbxCAyD3AfISycyTSb0bWzNOAhIy-JTTzwPofQSgT4hkbUuP9DaIIgm0RJtIBREnQw4c7h2NBtJP5fI7YRKX7hhWSH06_poOKqvqu9TewIJM8XzT7rRLIDezqTBWhKoS8_G0wLKSd4QiXP2jhX3EX4CFUVAqPoZbyxlyhRUqW9LO',
      tag: 'Curated',
    },
    {
      name: 'Developer Lab',
      description: 'Optimized for immersion with ultrawide optics and tactical feedback.',
      image: 'https://lh3.googleusercontent.com/aida/ADBb0uibbiefEL8a61JpcVswkMdmbIQerdzy72QLOOxLTYj1iUaKFE0UBJ4v_DSAeAkgU9wHJ2m8fPjzikcmeoy8qoE1B4PPI8UJGEsnknT16JprhwboJpSDhPjMSWCwPOI-vKsj3fyzIcfdwYaD1QeseXSTunAli87Od40DVIUjU6b-R8pYUwbuAyS-1sR_a6yIBXB4cvyKlca9ERIpYEOVkbD4xp9FCxjx4pfD3WGAKcdZ5UuhKzsM4hEpOqY',
    },
  ];

  readonly orders = [
    {
      name: 'RTX Studio Core',
      icon: 'terminal',
      date: 'Oct 12, 2023',
      status: 'Shipped',
      total: '$3,499.00',
    },
    {
      name: 'Walnut Artisan Keyboard',
      icon: 'keyboard',
      date: 'Sep 28, 2023',
      status: 'Shipped',
      total: '$580.00',
    },
  ];

  readonly sidebarLinks = [
    { label: 'Personal Info', active: true },
    { label: 'Shipping Addresses', active: false },
    { label: 'Payment Methods', active: false },
    { label: 'Security & Privacy', active: false },
  ];
}
