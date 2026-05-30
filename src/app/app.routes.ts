import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./components/home/home').then(m => m.Home) },
  { path: 'search', loadComponent: () => import('./components/search/search').then(m => m.SearchComponent) },
  { path: 'test', loadComponent: () => import('./components/test/test').then(m => m.Test) },
  { path: 'cart', loadComponent: () => import('./components/cart/cart').then(m => m.Cart) },
  // Future routes: product details, checkout
];
