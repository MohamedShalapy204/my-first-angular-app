import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./pages/products-gallery/products-gallery').then((m) => m.ProductsGallery),
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./pages/product-detail/product-detail').then((m) => m.ProductDetail),
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./pages/shopping-bag/shopping-bag').then((m) => m.ShoppingBag),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/user-profile/user-profile').then((m) => m.UserProfile),
  },
];
