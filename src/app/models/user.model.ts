import type { User } from '@supabase/supabase-js';

/**
 * User roles in the system.
 * 'admin' has elevated privileges, 'user' is default.
 */
export type UserRole = 'admin' | 'user';

/**
 * Authentication state managed by AuthService.
 * Uses Supabase User type directly (no wrapper).
 */
export interface AuthState {
  /** Current authenticated user, null if not authenticated */
  user: User | null;
  /** True while checking initial auth state */
  loading: boolean;
  /** Error message if auth operation failed, null otherwise */
  error: string | null;
}

/**
 * Extracts role from Supabase user metadata.
 * Defaults to 'user' if role not set.
 */
export function getUserRole(user: User | null): UserRole {
  if (!user) return 'user';
  return (user.user_metadata?.['role'] as UserRole) || 'user';
}
