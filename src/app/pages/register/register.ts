import { Component, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, required, email, minLength } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification';
import { LoadingSpinner } from '../../shared/components/loading-spinner';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormField, FormRoot, RouterLink, LoadingSpinner],
  templateUrl: './register.html',
})
export class RegisterPage {
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _notification = inject(NotificationService);

  readonly registerModel = signal({
    name: '',
    email: '',
    password: '',
  });

  readonly errorMessage = signal<string | null>(null);

  readonly registerForm = form(
    this.registerModel,
    (schemaPath) => {
      required(schemaPath.name, { message: 'Name is required' });
      required(schemaPath.email, { message: 'Email is required' });
      email(schemaPath.email, { message: 'Please enter a valid email' });
      required(schemaPath.password, { message: 'Password is required' });
      minLength(schemaPath.password, 6, { message: 'Password must be at least 6 characters' });
    },
    {
      submission: {
        action: async () => {
          this.errorMessage.set(null);
          const { name, email, password } = this.registerModel();
          const result = await this._authService.register(email, password, name);

          if (!result.success) {
            this.errorMessage.set(result.error || 'Registration failed');
            return;
          }

          this._notification.show('Registration successful! Please check your email.', 'success');
          this._router.navigate(['/login']);
        },
      },
    },
  );
}
