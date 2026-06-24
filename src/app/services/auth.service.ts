import { Injectable, signal } from '@angular/core';
import type { User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { getUserRole } from '../models/user.model';
import type { UserRole } from '../models/user.model';

export interface AuthResult {
  success: boolean;
  error?: string;
}

/**
 * Authentication service using Supabase.
 * Manages user state with signals.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
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

  async logout(): Promise<AuthResult> {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { success: false, error: 'Logout failed. Please try again.' };
    }

    this.user.set(null);
    return { success: true };
  }

  // Map Supabase errors to generic messages (prevents email enumeration)
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
