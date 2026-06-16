import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegisterPage } from './register';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification';

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;
  let authService: { register: ReturnType<typeof vi.fn> };
  let router: { navigate: ReturnType<typeof vi.fn> };
  let notificationSpy: { show: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authService = {
      register: vi.fn(),
    };
    router = {
      navigate: vi.fn(),
    };
    notificationSpy = {
      show: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [RegisterPage, ReactiveFormsModule],
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

    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have name, email, and password form controls', () => {
    expect(component.registerForm.get('name')).toBeTruthy();
    expect(component.registerForm.get('email')).toBeTruthy();
    expect(component.registerForm.get('password')).toBeTruthy();
  });

  it('should require name', () => {
    const nameControl = component.registerForm.get('name');
    nameControl?.setValue('');
    expect(nameControl?.valid).toBe(false);
    expect(nameControl?.errors?.['required']).toBeTruthy();
  });

  it('should require email', () => {
    const emailControl = component.registerForm.get('email');
    emailControl?.setValue('');
    expect(emailControl?.valid).toBe(false);
    expect(emailControl?.errors?.['required']).toBeTruthy();
  });

  it('should require valid email format', () => {
    const emailControl = component.registerForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBe(false);
    expect(emailControl?.errors?.['email']).toBeTruthy();
  });

  it('should accept valid email', () => {
    const emailControl = component.registerForm.get('email');
    emailControl?.setValue('test@example.com');
    expect(emailControl?.valid).toBe(true);
  });

  it('should require password', () => {
    const passwordControl = component.registerForm.get('password');
    passwordControl?.setValue('');
    expect(passwordControl?.valid).toBe(false);
    expect(passwordControl?.errors?.['required']).toBeTruthy();
  });

  it('should require minimum password length', () => {
    const passwordControl = component.registerForm.get('password');
    passwordControl?.setValue('12345');
    expect(passwordControl?.valid).toBe(false);
    expect(passwordControl?.errors?.['minlength']).toBeTruthy();
  });

  it('should accept valid password', () => {
    const passwordControl = component.registerForm.get('password');
    passwordControl?.setValue('password123');
    expect(passwordControl?.valid).toBe(true);
  });

  it('should call AuthService.register on form submit', async () => {
    authService.register.mockResolvedValue(undefined);

    component.registerForm.setValue({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    await component.onSubmit();

    expect(authService.register).toHaveBeenCalledWith(
      'test@example.com',
      'password123',
      'Test User',
    );
  });

  it('should redirect to login on successful registration', async () => {
    authService.register.mockResolvedValue(undefined);

    component.registerForm.setValue({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    await component.onSubmit();

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should show error message on failed registration', async () => {
    authService.register.mockRejectedValue(new Error('Email already registered'));

    component.registerForm.setValue({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    await component.onSubmit();

    expect(component.errorMessage()).toBe('Email already registered');
  });

  it('should set loading state during registration', async () => {
    let resolveRegister: () => void;
    const registerPromise = new Promise<void>((resolve) => {
      resolveRegister = resolve;
    });
    authService.register.mockReturnValue(registerPromise);

    component.registerForm.setValue({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    const onSubmitPromise = component.onSubmit();
    expect(component.loading()).toBe(true);

    resolveRegister!();
    await onSubmitPromise;

    expect(component.loading()).toBe(false);
  });

  it('should render name input', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('input[formControlName="name"]')).toBeTruthy();
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

  it('should render link to login page', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('a[routerLink="/login"]')).toBeTruthy();
  });
});
