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

  readonly user = signal<User | null>(null);
  readonly loading = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  constructor() {
    this.loadSessionSync();
    this.listenForChanges();
  }

  // Read session synchronously from localStorage (Supabase stores in 'sb-*-auth-token')
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

  // Sync across tabs when user logs in/out elsewhere
  private listenForChanges(): void {
    supabase.auth.onAuthStateChange((_event, session) => {
      this.user.set(session?.user ?? null);
      this.loading.set(false);
    });
  }

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

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();

    if (error) {
      this.notificationService.show('Logout failed. Please try again.', 'error');
      return;
    }

    this.user.set(null);
    this.notificationService.show('Successfully logged out', 'success');
  }

  // Map Supabase errors to generic messages (prevents email enumeration)
  private sanitizeErrorMessage(error: string): string {
    if (error.includes('Invalid login') || error.includes('invalid credentials')) {
      return 'Invalid email or password';
    }
    if (error.includes('already registered')) {
      return 'An account with this email already exists';
    }
    return 'An error occurred. Please try again.';
  }

  isAuthenticated(): boolean {
    return this.user() !== null;
  }

  hasRole(role: UserRole): boolean {
    const user = this.user();
    if (!user) return false;

    const userRole = getUserRole(user);
    return userRole === role;
  }
}
