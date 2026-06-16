import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { describe, it, expect } from 'vitest';
import { Router } from '@angular/router';
import { routes } from './app.routes';

describe('App Routes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
    });
  });

  it('should have /login route', () => {
    const loginRoute = routes.find((r) => r.path === 'login');
    expect(loginRoute).toBeTruthy();
    expect(loginRoute?.loadComponent).toBeDefined();
  });

  it('should have /register route', () => {
    const registerRoute = routes.find((r) => r.path === 'register');
    expect(registerRoute).toBeTruthy();
    expect(registerRoute?.loadComponent).toBeDefined();
  });

  it('should have /profile route with auth guard', () => {
    const profileRoute = routes.find((r) => r.path === 'profile');
    expect(profileRoute).toBeTruthy();
    expect(profileRoute?.canActivate).toBeDefined();
    expect(profileRoute?.canActivate?.length).toBeGreaterThan(0);
  });

  it('should have / route for home', () => {
    const homeRoute = routes.find((r) => r.path === '');
    expect(homeRoute).toBeTruthy();
  });

  it('should have /products route', () => {
    const productsRoute = routes.find((r) => r.path === 'products');
    expect(productsRoute).toBeTruthy();
  });

  it('should have /cart route', () => {
    const cartRoute = routes.find((r) => r.path === 'cart');
    expect(cartRoute).toBeTruthy();
  });

  it('should have /unauthorized route', () => {
    const unauthorizedRoute = routes.find((r) => r.path === 'unauthorized');
    expect(unauthorizedRoute).toBeTruthy();
  });

  it('should have wildcard route for 404', () => {
    const wildcardRoute = routes.find((r) => r.path === '**');
    expect(wildcardRoute).toBeTruthy();
  });
});
