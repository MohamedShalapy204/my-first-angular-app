import type { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { auth2Guard } from './guards/auth2-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
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
    loadComponent: () => import('./pages/shopping-bag/shopping-bag').then((m) => m.ShoppingBag),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then((m) => m.RegisterPage),
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/user-profile/user-profile').then((m) => m.UserProfile),
    canActivate: [authGuard],
  },
  {
    path: 'test',
    loadComponent: () => import('./components/test/test').then((m) => m.Test),
    canActivate: [auth2Guard],
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about-us/about-us').then((m) => m.AboutUs),
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./pages/unauthorized/unauthorized').then((m) => m.Unauthorized),
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
