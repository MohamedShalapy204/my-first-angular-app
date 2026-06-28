import { Injectable, signal } from '@angular/core';
import type { User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { getUserRole } from '../models/db/user.model';
import type { UserRole } from '../models/db/user.model';

/**
 * Result of an authentication operation (login, register, logout).
 */
export interface AuthResult {
  /** `true` if the operation succeeded. */
  success: boolean;
  /** Error message if the operation failed. Undefined on success. */
  error?: string;
}

/**
 * Authentication service using Supabase Auth.
 *
 * Manages user state with Angular signals and provides login, register,
 * logout, and role-checking functionality.
 *
 * ## Session Handling
 *
 * On construction:
 * 1. Reads session synchronously from localStorage (Supabase stores auth tokens
 *    in `sb-*-auth-token` keys) — avoids loading spinner on page refresh
 * 2. Sets up `onAuthStateChange` listener for cross-tab sync
 *
 * ## Security
 *
 * - Error messages are sanitized to prevent email enumeration
 * - Supabase RLS policies enforce data access per user
 * - `hasRole()` uses `getUserRole()` from the user model
 *
 * ## Signals
 *
 * - `user` — current Supabase `User` object, or null if not authenticated
 * - `loading` — `true` while initial session check is in progress
 * - `error` — last error message, or null
 *
 * @example
 * ```typescript
 * const auth = inject(AuthService);
 *
 * // Check if logged in
 * if (auth.isAuthenticated()) {
 *   console.log(auth.user()?.email);
 * }
 *
 * // Login
 * const result = await auth.login('user@example.com', 'password');
 * if (!result.success) console.error(result.error);
 *
 * // Role check
 * if (auth.hasRole('admin')) {
 *   // show admin panel
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /**
   * Current authenticated Supabase user, or null.
   * Updated by `onAuthStateChange` listener and by login/logout methods.
   */
  readonly user = signal<User | null>(null);

  /**
   * `true` while the initial session check is running.
   * Set to `false` after `loadSessionSync()` completes.
   * Components use this to avoid flashing "not logged in" state on page load.
   */
  readonly loading = signal<boolean>(true);

  /**
   * Last authentication error message, or null.
   * Cleared at the start of each login/register attempt.
   */
  readonly error = signal<string | null>(null);

  /**
   * Initialize auth state:
   * 1. Synchronously read session from localStorage (no loading spinner)
   * 2. Set up cross-tab auth state listener
   */
  constructor() {
    this.loadSessionSync();
    this.listenForChanges();
  }

  /**
   * Read the Supabase session synchronously from localStorage.
   *
   * Supabase stores auth tokens in localStorage with keys matching
   * `sb-*-auth-token`. This avoids the async `getSession()` call
   * which would show a loading spinner on every page refresh.
   *
   * Sets `this.user` to the stored user, or null if no session found.
   * Sets `this.loading` to `false` when done.
   */
  private loadSessionSync(): void {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('sb-') && key.endsWith('-auth-token')) {
          const stored = localStorage.getItem(key);
          if (stored) {
            const session = JSON.parse(stored);
            this.user.set(session?.user ?? null);
          }
          break;
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored auth session:', e);
    }
    this.loading.set(false);
  }

  /**
   * Listen for auth state changes across tabs.
   *
   * When the user logs in/out in another tab, Supabase fires
   * `onAuthStateChange` which updates our signal automatically.
   * This keeps all tabs in sync.
   */
  private listenForChanges(): void {
    supabase.auth.onAuthStateChange((_event, session) => {
      this.user.set(session?.user ?? null);
      this.loading.set(false);
    });
  }

  /**
   * Authenticate with email and password.
   *
   * On success, sets `this.user` to the authenticated user.
   * On error, sets `this.error` to a sanitized message and returns `success: false`.
   *
   * @param email - User's email address
   * @param password - User's password
   * @returns `AuthResult` indicating success or failure with error message
   *
   * @example
   * ```typescript
   * const result = await auth.login('user@example.com', 'mypassword');
   * if (result.success) {
   *   router.navigate(['/']);
   * } else {
   *   showError(result.error);
   * }
   * ```
   */
  async login(email: string, password: string): Promise<AuthResult> {
    this.error.set(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const message = this.sanitizeErrorMessage(error.message);
      this.error.set(message);
      return { success: false, error: message };
    }

    this.user.set(data.user);
    return { success: true };
  }

  /**
   * Create a new account with email, password, and optional display name.
   *
   * Handles the Supabase edge case where signing up with an existing
   * email returns a user with empty identities (no error thrown).
   *
   * On success, the user is NOT automatically logged in — they need to
   * confirm their email first (if email confirmation is enabled).
   *
   * @param email - User's email address
   * @param password - User's password
   * @param name - Optional display name (stored in `user_metadata.name`)
   * @returns `AuthResult` indicating success or failure
   *
   * @example
   * ```typescript
   * const result = await auth.register('new@example.com', 'password123', 'John');
   * if (result.success) {
   *   showEmailConfirmationMessage();
   * }
   * ```
   */
  async register(email: string, password: string, name?: string): Promise<AuthResult> {
    this.error.set(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: name ? { name } : undefined,
      },
    });

    if (error) {
      const message = this.sanitizeErrorMessage(error.message);
      this.error.set(message);
      return { success: false, error: message };
    }

    // Supabase returns user with empty identities when email already exists (unconfirmed)
    if (!data.user || (data.user.identities && data.user.identities.length === 0)) {
      const message = 'An account with this email already exists';
      this.error.set(message);
      return { success: false, error: message };
    }

    return { success: true };
  }

  /**
   * Sign out the current user.
   *
   * Clears the `this.user` signal on success.
   *
   * @returns `AuthResult` indicating success or failure
   */
  async logout(): Promise<AuthResult> {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { success: false, error: 'Logout failed. Please try again.' };
    }

    this.user.set(null);
    return { success: true };
  }

  /**
   * Map raw Supabase error messages to generic, user-friendly messages.
   *
   * Prevents email enumeration by returning the same message for
   * "user not found" and "wrong password" (both → "Invalid email or password").
   *
   * @param error - Raw error message from Supabase
   * @returns Sanitized, user-friendly error message
   */
  private sanitizeErrorMessage(error: string): string {
    if (error.includes('Invalid login') || error.includes('invalid credentials')) {
      return 'Invalid email or password';
    }
    if (error.includes('already registered')) {
      return 'An account with this email already exists';
    }
    if (error.includes('rate limit')) {
      return 'Too many attempts. Please try again later.';
    }
    return 'An error occurred. Please try again.';
  }

  /**
   * Check if a user is currently authenticated.
   *
   * @returns `true` if `this.user()` is not null
   */
  isAuthenticated(): boolean {
    return this.user() !== null;
  }

  /**
   * Check if the current user has a specific role.
   *
   * Uses `getUserRole()` from the user model to extract the role
   * from the user's `user_metadata` or `app_metadata`.
   *
   * @param role - The role to check (e.g., 'admin', 'user')
   * @returns `true` if the user has the specified role
   *
   * @example
   * ```typescript
   * if (auth.hasRole('admin')) {
   *   showAdminDashboard();
   * }
   * ```
   */
  hasRole(role: UserRole): boolean {
    const user = this.user();
    if (!user) return false;

    const userRole = getUserRole(user);
    return userRole === role;
  }
}
