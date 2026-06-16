import { describe, it, expect, expectTypeOf } from 'vitest';
import type { UserRole, AuthState } from './user.model';
import type { User } from '@supabase/supabase-js';
import { getUserRole } from './user.model';
import type { UserRole as UserRoleExport } from './index';

describe('User Model Types', () => {
  it('UserRole should be "admin" or "user"', () => {
    expectTypeOf<UserRole>().toEqualTypeOf<'admin' | 'user'>();
  });

  it('AuthState should have correct shape', () => {
    expectTypeOf<AuthState>().toHaveProperty('user');
    expectTypeOf<AuthState>().toHaveProperty('loading');
    expectTypeOf<AuthState>().toHaveProperty('error');

    expectTypeOf<AuthState['user']>().toEqualTypeOf<User | null>();
    expectTypeOf<AuthState['loading']>().toEqualTypeOf<boolean>();
    expectTypeOf<AuthState['error']>().toEqualTypeOf<string | null>();
  });

  it('UserRole should accept valid values', () => {
    const adminRole: UserRole = 'admin';
    const userRole: UserRole = 'user';

    expect(adminRole).toBe('admin');
    expect(userRole).toBe('user');
  });

  it('AuthState should accept valid state objects', () => {
    const loadingState: AuthState = {
      user: null,
      loading: true,
      error: null,
    };

    const errorState: AuthState = {
      user: null,
      loading: false,
      error: 'Invalid credentials',
    };

    const authenticatedState: AuthState = {
      user: null, // Would be User object in real usage
      loading: false,
      error: null,
    };

    expect(loadingState.loading).toBe(true);
    expect(errorState.error).toBe('Invalid credentials');
    expect(authenticatedState.user).toBeNull();
  });

  it('barrel export should work correctly', () => {
    const role: UserRoleExport = 'user';
    expect(role).toBe('user');
  });

  it('getUserRole should return "user" for null', () => {
    expect(getUserRole(null)).toBe('user');
  });

  it('getUserRole should extract role from user metadata', () => {
    const adminUser = {
      user_metadata: { role: 'admin' },
    } as unknown as User;
    expect(getUserRole(adminUser)).toBe('admin');
  });

  it('getUserRole should default to "user" when role not set', () => {
    const userWithoutRole = {
      user_metadata: {},
    } as unknown as User;
    expect(getUserRole(userWithoutRole)).toBe('user');
  });
});
