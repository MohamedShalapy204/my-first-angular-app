import type { User } from '@supabase/supabase-js';

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
