import { inject } from '@angular/core';
import type { CanDeactivateFn } from '@angular/router';
import { CartService } from '../services/cart';
import { AuthService } from '../services/auth.service';

export interface MergePageComponent {
  isMergeResolved: () => boolean;
}

export const mergeGuard: CanDeactivateFn<MergePageComponent> = async (component) => {
  // Allow navigation if merge is already resolved
  if (component.isMergeResolved()) {
    return true;
  }

  // Check if merge is still needed
  const cartService = inject(CartService);
  const authService = inject(AuthService);
  const user = authService.user();

  if (!user) return true;

  const mergeNeeded = await cartService.checkMergeNeeded(user.id);
  return !mergeNeeded;
};
