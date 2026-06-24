import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormField, FormRoot } from '@angular/forms/signals';
import { Router, ActivatedRoute } from '@angular/router';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginPage } from './login';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let authService: {
    login: ReturnType<typeof vi.fn>;
    isAuthenticated: ReturnType<typeof vi.fn>;
  };
  let router: { navigate: ReturnType<typeof vi.fn> };
  let notificationSpy: { show: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authService = {
      login: vi.fn(),
      isAuthenticated: vi.fn().mockReturnValue(false),
    };
    router = {
      navigate: vi.fn(),
    };
    notificationSpy = {
      show: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [LoginPage, FormField, FormRoot],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
        { provide: NotificationService, useValue: notificationSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: {},
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have email and password fields in model', () => {
    expect(component.loginModel().email).toBeDefined();
    expect(component.loginModel().password).toBeDefined();
  });

  it('should require email', () => {
    component.loginModel.update((m) => ({ ...m, email: '' }));
    fixture.detectChanges();
    const emailState = component.loginForm.email();
    expect(emailState.valid()).toBe(false);
    expect(emailState.errors().some((e) => e.kind === 'required')).toBe(true);
  });

  it('should require valid email format', () => {
    component.loginModel.update((m) => ({ ...m, email: 'invalid-email' }));
    fixture.detectChanges();
    const emailState = component.loginForm.email();
    expect(emailState.valid()).toBe(false);
    expect(emailState.errors().some((e) => e.kind === 'email')).toBe(true);
  });

  it('should accept valid email', () => {
    component.loginModel.update((m) => ({ ...m, email: 'test@example.com' }));
    fixture.detectChanges();
    const emailState = component.loginForm.email();
    expect(emailState.valid()).toBe(true);
  });

  it('should require password', () => {
    component.loginModel.update((m) => ({ ...m, password: '' }));
    fixture.detectChanges();
    const passwordState = component.loginForm.password();
    expect(passwordState.valid()).toBe(false);
    expect(passwordState.errors().some((e) => e.kind === 'required')).toBe(true);
  });

  it('should require min password length', () => {
    component.loginModel.update((m) => ({ ...m, password: '12345' }));
    fixture.detectChanges();
    const passwordState = component.loginForm.password();
    expect(passwordState.valid()).toBe(false);
    expect(passwordState.errors().some((e) => e.kind === 'minLength')).toBe(true);
  });

  it('should accept valid password', () => {
    component.loginModel.update((m) => ({ ...m, password: 'password123' }));
    fixture.detectChanges();
    const passwordState = component.loginForm.password();
    expect(passwordState.valid()).toBe(true);
  });

  it('should call AuthService.login on form submit', async () => {
    authService.login.mockResolvedValue({ success: true });
    component.loginModel.set({
      email: 'test@example.com',
      password: 'password123',
    });

    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));

    await fixture.whenStable();
    expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('should redirect to home on successful login without returnURL', async () => {
    authService.login.mockResolvedValue({ success: true });
    component.loginModel.set({
      email: 'test@example.com',
      password: 'password123',
    });

    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));

    await fixture.whenStable();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should redirect to returnURL on successful login', async () => {
    const route = TestBed.inject(ActivatedRoute);
    (route.snapshot as { queryParams: Record<string, string> }).queryParams = {
      return: '/profile',
    };
    authService.login.mockResolvedValue({ success: true });
    component.loginModel.set({
      email: 'test@example.com',
      password: 'password123',
    });

    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));

    await fixture.whenStable();
    expect(router.navigate).toHaveBeenCalledWith(['/profile']);
  });

  it('should show error message on failed login', async () => {
    authService.login.mockResolvedValue({ success: false, error: 'Invalid email or password' });
    component.loginModel.set({
      email: 'test@example.com',
      password: 'wrongpassword',
    });

    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));

    await fixture.whenStable();
    expect(component.errorMessage()).toBe('Invalid email or password');
  });

  it('should not navigate on failed login', async () => {
    authService.login.mockResolvedValue({ success: false, error: 'Invalid email or password' });
    component.loginModel.set({
      email: 'test@example.com',
      password: 'wrongpassword',
    });

    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));

    await fixture.whenStable();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should render email input', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('input[type="email"]')).toBeTruthy();
  });

  it('should render password input', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('input[type="password"]')).toBeTruthy();
  });

  it('should render submit button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('button[type="submit"]')).toBeTruthy();
  });

  it('should render link to register page', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const link = compiled.querySelector('a[routerLink="/register"]');
    expect(link).toBeTruthy();
  });
});
