import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginPage } from './login';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let authService: { login: ReturnType<typeof vi.fn>; isAuthenticated: ReturnType<typeof vi.fn> };
  let router: { navigate: ReturnType<typeof vi.fn> };
  let notificationSpy: { show: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authService = {
      login: vi.fn(),
      isAuthenticated: vi.fn(),
    };
    router = {
      navigate: vi.fn(),
    };
    notificationSpy = {
      show: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [LoginPage, ReactiveFormsModule],
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

  it('should have email and password form controls', () => {
    expect(component.loginForm.get('email')).toBeTruthy();
    expect(component.loginForm.get('password')).toBeTruthy();
  });

  it('should require email', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('');
    expect(emailControl?.valid).toBe(false);
    expect(emailControl?.errors?.['required']).toBeTruthy();
  });

  it('should require valid email format', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBe(false);
    expect(emailControl?.errors?.['email']).toBeTruthy();
  });

  it('should accept valid email', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('test@example.com');
    expect(emailControl?.valid).toBe(true);
  });

  it('should require password', () => {
    const passwordControl = component.loginForm.get('password');
    passwordControl?.setValue('');
    expect(passwordControl?.valid).toBe(false);
    expect(passwordControl?.errors?.['required']).toBeTruthy();
  });

  it('should require minimum password length', () => {
    const passwordControl = component.loginForm.get('password');
    passwordControl?.setValue('12345');
    expect(passwordControl?.valid).toBe(false);
    expect(passwordControl?.errors?.['minlength']).toBeTruthy();
  });

  it('should accept valid password', () => {
    const passwordControl = component.loginForm.get('password');
    passwordControl?.setValue('password123');
    expect(passwordControl?.valid).toBe(true);
  });

  it('should call AuthService.login on form submit', async () => {
    authService.login.mockResolvedValue(undefined);

    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password123',
    });

    await component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('should redirect to home on successful login without returnURL', async () => {
    authService.login.mockResolvedValue(undefined);

    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password123',
    });

    await component.onSubmit();

    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should redirect to returnURL on successful login', async () => {
    // Setup with returnURL
    const route = TestBed.inject(ActivatedRoute);
    (route.snapshot as { queryParams: Record<string, string> }).queryParams = {
      return: '/profile',
    };

    authService.login.mockResolvedValue(undefined);

    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password123',
    });

    await component.onSubmit();

    expect(router.navigate).toHaveBeenCalledWith(['/profile']);
  });

  it('should show error message on failed login', async () => {
    authService.login.mockRejectedValue(new Error('Invalid credentials'));

    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'wrongpassword',
    });

    await component.onSubmit();

    expect(component.errorMessage()).toBe('Invalid credentials');
  });

  it('should set loading state during login', async () => {
    let resolveLogin: () => void;
    const loginPromise = new Promise<void>((resolve) => {
      resolveLogin = resolve;
    });
    authService.login.mockReturnValue(loginPromise);

    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password123',
    });

    const onSubmitPromise = component.onSubmit();
    expect(component.loading()).toBe(true);

    resolveLogin!();
    await onSubmitPromise;

    expect(component.loading()).toBe(false);
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
