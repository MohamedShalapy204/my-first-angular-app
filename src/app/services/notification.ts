import { Injectable, signal } from '@angular/core';

/** The type of notification to display. Controls icon and color. */
export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'loading';

/**
 * A single notification entry.
 *
 * Tracks the message, type, auto-dismiss timing, and remaining time
 * (for pause/resume on hover).
 */
export interface Notification {
  /** Unique identifier for this notification. */
  id: number;
  /** Visual style: success (green), error (red), warning (yellow), info (blue), loading (spinner). */
  type: NotificationType;
  /** The message text to display. */
  message: string;
  /** Original duration in ms before auto-dismiss. */
  duration: number;
  /** Remaining ms before auto-dismiss (decreases when paused on hover). */
  remaining: number;
  /** Timestamp when the notification was shown or last resumed. */
  startTime: number;
  /** setTimeout ID for auto-dismiss. `undefined` for 'loading' type or when paused. */
  timeoutId?: any;
}

/**
 * Global notification service with auto-dismiss, pause-on-hover, and stacking.
 *
 * Notifications are displayed as a stack at the top-right of the screen.
 * Each notification auto-dismisses after `duration` ms (default: 3000ms).
 * 'loading' type notifications persist until manually dismissed.
 *
 * ## Usage
 *
 * ```typescript
 * const notify = inject(NotificationService);
 *
 * // Basic usage
 * notify.show('Item saved', 'success');
 * notify.show('Something went wrong', 'error');
 *
 * // Custom duration
 * notify.show('Processing...', 'loading'); // persists until dismissed
 * const id = notify.show('Saved', 'success', 5000); // 5 seconds
 *
 * // Pause on hover
 * notify.pause(id); // stops the countdown
 * notify.resume(id); // restarts the countdown with remaining time
 *
 * // Manual dismiss
 * notify.dismiss(id); // immediately removes the notification
 * ```
 *
 * ## Pause/Resume (for hover interaction)
 *
 * When the user hovers over a notification:
 * 1. Call `pause(id)` — clears the timeout, calculates remaining time
 * 2. When they move away, call `resume(id)` — restarts with remaining time
 *
 * This keeps the notification visible while the user is reading it.
 *
 * @example
 * ```typescript
 * // In a component template:
 * @for (n of notificationService.notifications(); track n.id) {
 *   <div (mouseenter)="notificationService.pause(n.id)"
 *        (mouseleave)="notificationService.resume(n.id)">
 *     {{ n.message }}
 *   </div>
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  /** Auto-incrementing ID counter for unique notification IDs. */
  private nextId = 0;

  /**
   * Active notifications stack. New notifications are prepended (shown at top).
   * Read by components for rendering the notification toast UI.
   */
  readonly notifications = signal<Notification[]>([]);

  /**
   * Show a new notification.
   *
   * @param message - The text to display
   * @param type - Visual style (default: 'info')
   * @param duration - Auto-dismiss delay in ms (default: 3000). Ignored for 'loading' type.
   * @returns The notification ID (for pause/resume/dismiss)
   *
   * @example
   * ```typescript
   * const id = notify.show('Added to cart', 'success');
   * notify.show('Uploading...', 'loading'); // no auto-dismiss
   * notify.show('Check your input', 'warning', 5000);
   * ```
   */
  show(message: string, type: NotificationType = 'info', duration: number = 3000) {
    const id = this.nextId++;
    const notification: Notification = {
      id,
      type,
      message,
      duration,
      remaining: duration,
      startTime: Date.now(),
    };

    // Prepend so newest notification appears at top
    this.notifications.update((prev) => [notification, ...prev]);

    // Auto-dismiss (except 'loading' which persists until manually dismissed)
    if (type !== 'loading') {
      notification.timeoutId = setTimeout(() => this.dismiss(id), duration);
    }

    return id;
  }

  /**
   * Pause a notification's auto-dismiss countdown.
   *
   * Called when the user hovers over a notification to read it.
   * Clears the timeout and calculates remaining time based on elapsed time.
   *
   * @param id - The notification ID to pause
   */
  pause(id: number) {
    this.notifications.update((prev) =>
      prev.map((n) => {
        if (n.id === id && n.timeoutId) {
          clearTimeout(n.timeoutId);
          const elapsed = Date.now() - n.startTime;
          return { ...n, remaining: Math.max(0, n.remaining - elapsed), timeoutId: undefined };
        }
        return n;
      }),
    );
  }

  /**
   * Resume a paused notification's auto-dismiss countdown.
   *
   * Called when the user stops hovering over a notification.
   * Restarts the timeout with the remaining time.
   *
   * @param id - The notification ID to resume
   */
  resume(id: number) {
    this.notifications.update((prev) =>
      prev.map((n) => {
        if (n.id === id && !n.timeoutId && n.type !== 'loading') {
          const timeoutId = setTimeout(() => this.dismiss(id), n.remaining);
          return { ...n, startTime: Date.now(), timeoutId };
        }
        return n;
      }),
    );
  }

  /**
   * Immediately dismiss a notification.
   *
   * Clears the auto-dismiss timeout and removes the notification from the stack.
   *
   * @param id - The notification ID to dismiss
   */
  dismiss(id: number) {
    this.notifications.update((prev) => {
      const target = prev.find((n) => n.id === id);
      if (target?.timeoutId) clearTimeout(target.timeoutId);
      return prev.filter((n) => n.id !== id);
    });
  }
}
