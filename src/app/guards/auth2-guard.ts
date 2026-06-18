import { inject } from '@angular/core';
import { type CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const auth2Guard: CanActivateFn = (route, state) => {
  console.log(route);
  console.log(state);
  
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.parseUrl('/login');
  }
  return true;
};
