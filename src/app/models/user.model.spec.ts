import { describe, it, expect, test } from 'vitest';
import type { User } from '@supabase/supabase-js';
import { getUserRole } from './db/user.model';

describe('getUserRole', () => {
  test.each([
    ['null user', null, 'user'],
    ['user without role', { user_metadata: {} }, 'user'],
  ])('returns "user" for %s', (_label, user, expected) => {
    expect(getUserRole(user as User | null)).toBe(expected);
  });

  it('extracts role from user metadata', () => {
    const adminUser = {
      user_metadata: { role: 'admin' },
    } as unknown as User;
    expect(getUserRole(adminUser)).toBe('admin');
  });
});
