import { Injectable, inject } from '@angular/core';
import { LogWriter } from './log-writer';
import { ActionTracker } from './action-tracker';
import { PerformanceTracker } from './performance-tracker';
import type { LogContext, ActionType } from './log.types';

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  private readonly logWriter = inject(LogWriter);
  private readonly actionTracker = inject(ActionTracker);
  private readonly perfTracker = inject(PerformanceTracker);

  debug(message: string, context?: LogContext): void {
    this.write('debug', message, context);
  }

  info(message: string, context?: LogContext): void {
    this.write('info', message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.write('warn', message, context);
  }

  error(message: string, context?: LogContext): void {
    this.write('error', message, context);
  }

  trackAction(type: ActionType, data?: Record<string, unknown>): void {
    this.actionTracker.track(type, data);
  }

  startTimer(label: string): void {
    this.perfTracker.startTimer(label);
  }

  endTimer(label: string): number | null {
    return this.perfTracker.endTimer(label);
  }

  private write(
    level: 'debug' | 'info' | 'warn' | 'error',
    message: string,
    context?: LogContext,
  ): void {
    this.logWriter.write({
      timestamp: Date.now(),
      level,
      message,
      context,
    });
  }
}
