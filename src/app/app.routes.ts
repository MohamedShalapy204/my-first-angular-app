import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./Components/home/home').then(m => m.Home) },
  // Future routes: product details, cart, checkout
];
