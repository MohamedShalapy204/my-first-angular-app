import type { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { auth2Guard } from './guards/auth2-guard';
import { mergeGuard } from './guards/merge.guard';
import { Home } from './pages/home/home';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Lumina Studio',
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./pages/products-gallery/products-gallery').then((m) => m.ProductsGallery),
    title: 'Products',
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./pages/product-detail/product-detail').then((m) => m.ProductDetail),
    title: 'Product Detail',
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/shopping-bag/shopping-bag').then((m) => m.ShoppingBag),
    title: 'Shopping Bag',
  },
  {
    path: 'cart-merge',
    loadComponent: () => import('./pages/cart-merge/cart-merge').then((m) => m.CartMergePage),
    title: 'Merge Carts',
    canActivate: [authGuard],
    canDeactivate: [mergeGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.LoginPage),
    title: 'Login',
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then((m) => m.RegisterPage),
    title: 'Register',
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/user-profile/user-profile').then((m) => m.UserProfile),
    canActivate: [authGuard],
    title: 'Profile',
  },
  {
    path: 'test',
    loadComponent: () => import('./components/test/test').then((m) => m.Test),
    canActivate: [auth2Guard],
    title: 'Test',
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about-us/about-us').then((m) => m.AboutUs),
    title: 'About Us',
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./pages/unauthorized/unauthorized').then((m) => m.Unauthorized),
    title: 'Unauthorized',
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
    title: 'Not Found',
  },
];
