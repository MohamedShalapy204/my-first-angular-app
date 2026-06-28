import { Component, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, required, email, minLength } from '@angular/forms/signals';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart';
import { NotificationService } from '../../services/notification';
import { LoadingSpinner } from '../../shared/components/loading-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormField, FormRoot, RouterLink, LoadingSpinner],
  templateUrl: './login.html',
})
export class LoginPage {
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);
  private _notification = inject(NotificationService);
  private _cartService = inject(CartService);

  readonly loginModel = signal({
    email: '',
    password: '',
  });

  readonly errorMessage = signal<string | null>(null);
  readonly showPassword = signal(false);

  readonly loginForm = form(
    this.loginModel,
    (s) => {
      required(s.email, { message: 'Email is required' });
      email(s.email, { message: 'Please enter a valid email' });
      required(s.password, { message: 'Password is required' });
      minLength(s.password, 6, { message: 'Password must be at least 6 characters' });
    },
    {
      submission: {
        action: async () => {
          this.errorMessage.set(null);
          const { email, password } = this.loginModel();
          const result = await this._authService.login(email, password);

          if (!result.success) {
            this.errorMessage.set(result.error || 'Login failed');
            return;
          }

          this._notification.show('Successfully logged in', 'success');

          // Check if cart merge is needed after login
          const user = this._authService.user();
          if (user) {
            const mergeNeeded = await this._cartService.checkMergeNeeded(user.id);
            if (mergeNeeded) {
              this._router.navigate(['/cart-merge']);
              return;
            }
          }

          const returnUrl = this._activatedRoute.snapshot.queryParams['return'] || '/';
          const safeUrl =
            returnUrl.startsWith('/') && !returnUrl.startsWith('//') ? returnUrl : '/';
          this._router.navigate([safeUrl]);
        },
      },
    },
  );

  togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }
}
