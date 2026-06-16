import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from './auth.service';
import { NotificationService } from './notification';

describe('AuthService', () => {
  let service: AuthService;
  let notificationSpy: { show: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    notificationSpy = { show: vi.fn() };

    TestBed.configureTestingModule({
      providers: [AuthService, { provide: NotificationService, useValue: notificationSpy }],
    });

    service = TestBed.inject(AuthService);
  });

  it('should initialize with correct default state', () => {
    expect(service.user()).toBeNull();
    expect(service.loading()).toBe(true);
    expect(service.error()).toBeNull();
  });

  describe('isAuthenticated', () => {
    it('should return false when user is null', () => {
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('hasRole', () => {
    it('should return false when user is null', () => {
      expect(service.hasRole('admin')).toBe(false);
      expect(service.hasRole('user')).toBe(false);
    });
  });
});
