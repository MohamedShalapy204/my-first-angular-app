import { inject } from '@angular/core';
import {
  type CanActivateFn,
  Router,
  type ActivatedRouteSnapshot,
  type RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import type { UserRole } from '../models/db/user.model';

/**
 * Functional auth guard for route protection.
 * Checks authentication and optional role requirements.
 *
 * @example
 * // Basic auth guard
 * { path: 'profile', component: Profile, canActivate: [authGuard] }
 *
 * @example
 * // Role-based guard
 * { path: 'admin', component: Admin, canActivate: [authGuard], data: { roles: ['admin'] } }
 */
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is authenticated
  if (!authService.isAuthenticated()) {
    // Preserve the attempted URL for redirecting after login
    return router.parseUrl(`/login?return=${encodeURIComponent(state.url)}`);
  }

  // Check role requirements if specified
  const requiredRoles = route.data?.['roles'] as UserRole[] | undefined;

  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some((role) => authService.hasRole(role));

    if (!hasRequiredRole) {
      return router.parseUrl('/unauthorized');
    }
  }

  // User is authenticated and has required role (or no role required)
  return true;
};
