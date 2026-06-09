import { Injectable, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { UserAction, ActionType } from './log.types';

export type ActionCallback = (action: UserAction) => void;

@Injectable({
  providedIn: 'root',
})
export class ActionTracker {
  private readonly router = inject(Router);
  private readonly listeners = new Set<ActionCallback>();

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.emit({
          timestamp: Date.now(),
          type: 'navigation',
          data: {
            url: event.url,
            urlAfterRedirects: event.urlAfterRedirects,
          },
        });
      }
    });
  }

  track(type: ActionType, data?: Record<string, unknown>): void {
    this.emit({ timestamp: Date.now(), type, data });
  }

  onAction(callback: ActionCallback): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private emit(action: UserAction): void {
    for (const listener of this.listeners) {
      try {
        listener(action);
      } catch {
        // Guard: listener threw — swallow
      }
    }
  }
}
