import { TestBed } from '@angular/core/testing';
import {
  Router,
  type ActivatedRouteSnapshot,
  type RouterStateSnapshot,
  type UrlTree,
} from '@angular/router';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  let authService: { isAuthenticated: ReturnType<typeof vi.fn>; hasRole: ReturnType<typeof vi.fn> };
  let router: { parseUrl: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    authService = {
      isAuthenticated: vi.fn(),
      hasRole: vi.fn(),
    };

    router = {
      parseUrl: vi.fn().mockReturnValue({} as UrlTree),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    });
  });

  function runGuard(url = '/protected', data: Record<string, unknown> = {}): unknown {
    const route = { data } as unknown as ActivatedRouteSnapshot;
    const state = { url } as RouterStateSnapshot;
    return TestBed.runInInjectionContext(() => authGuard(route, state));
  }

  describe('unauthenticated user', () => {
    beforeEach(() => {
      authService.isAuthenticated.mockReturnValue(false);
    });

    it('should redirect to /login with returnURL', () => {
      const result = runGuard('/protected');
      expect(result).toBeInstanceOf(Object);
      expect(router.parseUrl).toHaveBeenCalledWith('/login?return=%2Fprotected');
    });

    it('should encode special characters in returnURL', () => {
      runGuard('/protected?q=test');
      expect(router.parseUrl).toHaveBeenCalledWith('/login?return=%2Fprotected%3Fq%3Dtest');
    });
  });

  describe('authenticated user', () => {
    beforeEach(() => {
      authService.isAuthenticated.mockReturnValue(true);
    });

    it('should allow access when no role required', () => {
      const result = runGuard();
      expect(result).toBe(true);
    });

    it('should allow access when user has required role', () => {
      authService.hasRole.mockReturnValue(true);
      const result = runGuard('/protected', { roles: ['admin'] });
      expect(result).toBe(true);
      expect(authService.hasRole).toHaveBeenCalledWith('admin');
    });

    it('should redirect to /unauthorized when user lacks required role', () => {
      authService.hasRole.mockReturnValue(false);
      const result = runGuard('/protected', { roles: ['admin'] });
      expect(result).toBeInstanceOf(Object);
      expect(router.parseUrl).toHaveBeenCalledWith('/unauthorized');
    });

    it('should check multiple roles and allow if any match', () => {
      authService.hasRole.mockReturnValueOnce(false).mockReturnValueOnce(true);
      const result = runGuard('/protected', { roles: ['admin', 'editor'] });
      expect(result).toBe(true);
      expect(authService.hasRole).toHaveBeenCalledWith('admin');
      expect(authService.hasRole).toHaveBeenCalledWith('editor');
    });
  });
});
