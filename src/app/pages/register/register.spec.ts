import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormField, FormRoot } from '@angular/forms/signals';
import { Router, ActivatedRoute } from '@angular/router';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegisterPage } from './register';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification';

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;
  let authService: {
    register: ReturnType<typeof vi.fn>;
  };
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
      imports: [RegisterPage, FormField, FormRoot],
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

  it('should have name, email, and password fields in model', () => {
    expect(component.registerModel().name).toBeDefined();
    expect(component.registerModel().email).toBeDefined();
    expect(component.registerModel().password).toBeDefined();
  });

  it('should require name', () => {
    component.registerModel.update((m) => ({ ...m, name: '' }));
    fixture.detectChanges();
    const nameState = component.registerForm.name();
    expect(nameState.valid()).toBe(false);
    expect(nameState.errors().some((e) => e.kind === 'required')).toBe(true);
  });

  it('should require email', () => {
    component.registerModel.update((m) => ({ ...m, email: '' }));
    fixture.detectChanges();
    const emailState = component.registerForm.email();
    expect(emailState.valid()).toBe(false);
    expect(emailState.errors().some((e) => e.kind === 'required')).toBe(true);
  });

  it('should require valid email format', () => {
    component.registerModel.update((m) => ({ ...m, email: 'invalid-email' }));
    fixture.detectChanges();
    const emailState = component.registerForm.email();
    expect(emailState.valid()).toBe(false);
    expect(emailState.errors().some((e) => e.kind === 'email')).toBe(true);
  });

  it('should accept valid email', () => {
    component.registerModel.update((m) => ({ ...m, email: 'test@example.com' }));
    fixture.detectChanges();
    const emailState = component.registerForm.email();
    expect(emailState.valid()).toBe(true);
  });

  it('should require password', () => {
    component.registerModel.update((m) => ({ ...m, password: '' }));
    fixture.detectChanges();
    const passwordState = component.registerForm.password();
    expect(passwordState.valid()).toBe(false);
    expect(passwordState.errors().some((e) => e.kind === 'required')).toBe(true);
  });

  it('should require min password length', () => {
    component.registerModel.update((m) => ({ ...m, password: '12345' }));
    fixture.detectChanges();
    const passwordState = component.registerForm.password();
    expect(passwordState.valid()).toBe(false);
    expect(passwordState.errors().some((e) => e.kind === 'minLength')).toBe(true);
  });

  it('should accept valid password', () => {
    component.registerModel.update((m) => ({ ...m, password: 'password123' }));
    fixture.detectChanges();
    const passwordState = component.registerForm.password();
    expect(passwordState.valid()).toBe(true);
  });

  it('should call AuthService.register on form submit', async () => {
    authService.register.mockResolvedValue({ success: true });
    component.registerModel.set({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));

    await fixture.whenStable();
    expect(authService.register).toHaveBeenCalledWith(
      'test@example.com',
      'password123',
      'Test User',
    );
  });

  it('should redirect to login on successful registration', async () => {
    authService.register.mockResolvedValue({ success: true });
    component.registerModel.set({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));

    await fixture.whenStable();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should show error message on failed registration', async () => {
    authService.register.mockResolvedValue({
      success: false,
      error: 'An account with this email already exists',
    });
    component.registerModel.set({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));

    await fixture.whenStable();
    expect(component.errorMessage()).toBe('An account with this email already exists');
  });

  it('should not navigate on failed registration', async () => {
    authService.register.mockResolvedValue({
      success: false,
      error: 'An account with this email already exists',
    });
    component.registerModel.set({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));

    await fixture.whenStable();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should render name input', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('input[type="text"]')).toBeTruthy();
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
