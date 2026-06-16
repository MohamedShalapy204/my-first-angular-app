import { Injectable, signal, inject } from '@angular/core';
import type { User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { NotificationService } from './notification';
import { getUserRole } from '../models/user.model';
import type { UserRole } from '../models/user.model';

/**
 * Authentication service using Supabase.
 * Manages user state with signals.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private notificationService = inject(NotificationService);

  /** Current authenticated user */
  readonly user = signal<User | null>(null);

  /** True while checking initial auth state */
  readonly loading = signal<boolean>(true);

  /** Error message if auth operation failed */
  readonly error = signal<string | null>(null);

  constructor() {
    this.initializeAuthListener();
  }

  private initializeAuthListener(): void {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      this.user.set(session?.user ?? null);
      this.loading.set(false);
    });

    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      this.user.set(session?.user ?? null);
      this.loading.set(false);
    });
  }

  /**
   * Sign in with email and password.
   * Shows success/error toast notifications.
   */
  async login(email: string, password: string): Promise<void> {
    this.error.set(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const message = this.sanitizeErrorMessage(error.message);
      this.error.set(message);
      this.notificationService.show(message, 'error');
      return;
    }

    this.user.set(data.user);
    this.notificationService.show('Successfully logged in', 'success');
  }

  /**
   * Register a new user.
   * Shows success/error toast notifications.
   */
  async register(email: string, password: string, name?: string): Promise<void> {
    this.error.set(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: name ? { name } : undefined,
      },
    });

    if (error) {
      const message = this.sanitizeErrorMessage(error.message);
      this.error.set(message);
      this.notificationService.show(message, 'error');
      return;
    }

    // Note: Supabase may require email confirmation
    this.notificationService.show('Registration successful! Please check your email.', 'success');
  }

  /**
   * Sign out the current user.
   * Shows success toast notification.
   */
  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();

    if (error) {
      this.notificationService.show('Logout failed. Please try again.', 'error');
      return;
    }

    this.user.set(null);
    this.notificationService.show('Successfully logged out', 'success');
  }

  /**
   * Sanitize error messages to avoid leaking internal details.
   */
  private sanitizeErrorMessage(error: string): string {
    if (error.includes('Invalid login') || error.includes('invalid credentials')) {
      return 'Invalid email or password';
    }
    if (error.includes('already registered')) {
      return 'An account with this email already exists';
    }
    return 'An error occurred. Please try again.';
  }

  /**
   * Check if user is authenticated.
   */
  isAuthenticated(): boolean {
    return this.user() !== null;
  }

  /**
   * Check if user has the specified role.
   * Defaults to 'user' role if not set.
   */
  hasRole(role: UserRole): boolean {
    const user = this.user();
    if (!user) return false;

    const userRole = getUserRole(user);
    return userRole === role;
  }
}
