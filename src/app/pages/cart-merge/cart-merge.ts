import { Component, ChangeDetectionStrategy, inject, signal, type OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification';
import { TranslationService } from '../../services/translation';
import type { MergeData, MergeChoices } from '../../models';
import type { MergePageComponent } from '../../guards/merge.guard';

@Component({
  selector: 'app-cart-merge',
  templateUrl: './cart-merge.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full min-h-screen' },
})
export class CartMergePage implements OnInit, MergePageComponent {
  private readonly _cartService = inject(CartService);
  private readonly _authService = inject(AuthService);
  private readonly _notification = inject(NotificationService);
  private readonly _t = inject(TranslationService);
  private readonly _router = inject(Router);

  /** Merge data loaded from CartStore. */
  readonly mergeData = signal<MergeData | null>(null);

  /** Per-item choices: product_id → chosen quantity. */
  readonly choices = signal<MergeChoices>(new Map());

  /** Loading state while fetching merge data. */
  readonly loading = signal<boolean>(true);

  /** True while applying the merge. */
  readonly applying = signal<boolean>(false);

  /** Whether the merge has been resolved. */
  private _mergeResolved = false;

  /** Check if merge is resolved (for CanDeactivate guard). */
  isMergeResolved(): boolean {
    return this._mergeResolved;
  }

  translate(key: Parameters<TranslationService['t']>[0]): string {
    return this._t.t(key);
  }

  async ngOnInit(): Promise<void> {
    const user = this._authService.user();
    if (!user) {
      this._router.navigate(['/login']);
      return;
    }

    try {
      const data = await this._cartService.getMergeData(user.id);
      if (!data) {
        this._notification.show('Failed to load merge data', 'error');
        this._router.navigate(['/cart']);
        return;
      }
      this.mergeData.set(data);

      // Initialize choices: default to local quantity if exists, else server
      const initialChoices = new Map<number, number>();
      for (const item of data.items) {
        if (item.source === 'local') {
          initialChoices.set(item.product_id, item.local_quantity);
        } else if (item.source === 'server') {
          initialChoices.set(item.product_id, item.server_quantity);
        } else {
          // 'both' — default to local quantity
          initialChoices.set(item.product_id, item.local_quantity);
        }
      }
      this.choices.set(initialChoices);
    } catch {
      this._notification.show('Failed to load merge data', 'error');
      this._router.navigate(['/cart']);
    } finally {
      this.loading.set(false);
    }
  }

  /** Get the current choice for a product. */
  getChoice(productId: number): number {
    return this.choices().get(productId) ?? 0;
  }

  /** Update the choice for a product. */
  setChoice(productId: number, quantity: number): void {
    const newChoices = new Map(this.choices());
    newChoices.set(productId, quantity);
    this.choices.set(newChoices);
  }

  /** Keep all items from local cart. */
  keepAllLocal(): void {
    const data = this.mergeData();
    if (!data) return;

    const newChoices = new Map<number, number>();
    for (const item of data.items) {
      newChoices.set(item.product_id, item.local_quantity);
    }
    this.choices.set(newChoices);
  }

  /** Keep all items from server cart. */
  keepAllServer(): void {
    const data = this.mergeData();
    if (!data) return;

    const newChoices = new Map<number, number>();
    for (const item of data.items) {
      newChoices.set(item.product_id, item.server_quantity);
    }
    this.choices.set(newChoices);
  }

  /** Apply the merge and redirect to cart. */
  async confirmMerge(): Promise<void> {
    const user = this._authService.user();
    if (!user) return;

    this.applying.set(true);
    try {
      const warnings = await this._cartService.applyMerge(this.choices(), user.id);
      if (warnings.length > 0) {
        for (const w of warnings) {
          this._notification.show(w, 'warning');
        }
      }
      this._mergeResolved = true;
      this._notification.show('Cart merged successfully', 'success');
      this._router.navigate(['/cart']);
    } catch {
      this._notification.show('Merge failed', 'error');
    } finally {
      this.applying.set(false);
    }
  }

  /** Discard local cart and keep server only. */
  async discardLocal(): Promise<void> {
    const user = this._authService.user();
    if (!user) return;

    this.applying.set(true);
    try {
      await this._cartService.loadCart(user.id);
      this._mergeResolved = true;
      this._notification.show('Kept server cart', 'success');
      this._router.navigate(['/cart']);
    } catch {
      this._notification.show('Failed to load server cart', 'error');
    } finally {
      this.applying.set(false);
    }
  }

  /** Discard server cart and keep local only. */
  async discardServer(): Promise<void> {
    const user = this._authService.user();
    if (!user) return;

    this.applying.set(true);
    try {
      // Build choices with only local items
      const data = this.mergeData();
      if (data) {
        const localOnlyChoices = new Map<number, number>();
        for (const item of data.items) {
          if (item.local_quantity > 0) {
            localOnlyChoices.set(item.product_id, item.local_quantity);
          }
        }
        await this._cartService.applyMerge(localOnlyChoices, user.id);
      }
      this._mergeResolved = true;
      this._notification.show('Kept local cart', 'success');
      this._router.navigate(['/cart']);
    } catch {
      this._notification.show('Failed to keep local cart', 'error');
    } finally {
      this.applying.set(false);
    }
  }
}
