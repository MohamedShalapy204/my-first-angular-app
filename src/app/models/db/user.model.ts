import type { User } from '@supabase/supabase-js';

/**
 * User roles in the system.
 * 'admin' has elevated privileges, 'user' is default.
 */
export type UserRole = 'admin' | 'user';

/**
 * Extracts role from Supabase user metadata.
 * Defaults to 'user' if role not set.
 */
export function getUserRole(user: User | null): UserRole {
  if (!user) return 'user';
  return (user.user_metadata?.['role'] as UserRole) || 'user';
}
