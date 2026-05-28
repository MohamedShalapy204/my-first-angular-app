import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../Services/notification';
import { SettingsService } from '../../Services/settings';

@Component({
  selector: 'app-notification-container',
  standalone: true,
  templateUrl: './notification-container.html',
  styles: [`
    :host {
      position: fixed;
      top: 1.5rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      pointer-events: none;
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    :host-context([dir="rtl"]) { left: 1.5rem; right: auto; }
    :host-context([dir="ltr"]) { right: 1.5rem; left: auto; }

    .notification-card {
      pointer-events: auto;
      overflow: hidden;
      /* Spring-ish entry */
      animation: springIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }

    @keyframes springIn {
      from { transform: translateX(120%) scale(0.9); opacity: 0; }
      to { transform: translateX(0) scale(1); opacity: 1; }
    }

    /* Progress Bar Animation */
    .timer-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      width: 100%;
      background: currentColor;
      opacity: 0.3;
      transform-origin: left;
      animation: shrink linear forwards;
    }

    /* Pause timer on hover */
    .notification-card:hover .timer-bar {
      animation-play-state: paused;
    }

    @keyframes shrink {
      from { transform: scaleX(1); }
      to { transform: scaleX(0); }
    }

    :host-context([dir="rtl"]) .timer-bar {
      transform-origin: right;
    }
  `]
})
export class NotificationContainer {
  protected readonly notificationService = inject(NotificationService);
  protected readonly settingsService = inject(SettingsService);

  getTypeClass(type: string) {
    switch (type) {
      case 'success': return 'border-[var(--success)] text-[var(--success)]';
      case 'error': return 'border-[var(--error)] text-[var(--error)]';
      case 'warning': return 'border-[var(--warning)] text-[var(--warning)]';
      case 'loading': return 'border-[var(--info)] text-[var(--info)] animate-pulse';
      default: return 'border-[var(--info)] text-[var(--info)]';
    }
  }
}
