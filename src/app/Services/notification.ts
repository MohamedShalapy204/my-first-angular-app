import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  duration: number;
  remaining: number;
  startTime: number;
  timeoutId?: any;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private nextId = 0;
  readonly notifications = signal<Notification[]>([]);

  show(message: string, type: NotificationType = 'info', duration: number = 3000) {
    const id = this.nextId++;
    const notification: Notification = { 
      id, 
      type, 
      message, 
      duration, 
      remaining: duration, 
      startTime: Date.now() 
    };

    this.notifications.update((prev) => [notification, ...prev]);

    if (type !== 'loading') {
      notification.timeoutId = setTimeout(() => this.dismiss(id), duration);
    }

    return id;
  }

  pause(id: number) {
    this.notifications.update((prev) => 
      prev.map((n) => {
        if (n.id === id && n.timeoutId) {
          clearTimeout(n.timeoutId);
          const elapsed = Date.now() - n.startTime;
          return { ...n, remaining: Math.max(0, n.remaining - elapsed), timeoutId: undefined };
        }
        return n;
      })
    );
  }

  resume(id: number) {
    this.notifications.update((prev) => 
      prev.map((n) => {
        if (n.id === id && !n.timeoutId && n.type !== 'loading') {
          const timeoutId = setTimeout(() => this.dismiss(id), n.remaining);
          return { ...n, startTime: Date.now(), timeoutId };
        }
        return n;
      })
    );
  }

  dismiss(id: number) {
    this.notifications.update((prev) => {
      const target = prev.find(n => n.id === id);
      if (target?.timeoutId) clearTimeout(target.timeoutId);
      return prev.filter((n) => n.id !== id);
    });
  }
}
