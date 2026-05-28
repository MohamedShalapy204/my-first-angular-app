import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./Components/home/home').then(m => m.Home) },
  { path: 'search', loadComponent: () => import('./Components/search/search').then(m => m.SearchComponent) },
  { path: 'test', loadComponent: () => import('./Components/test/test').then(m => m.Test) },
  // Future routes: product details, cart, checkout
];
