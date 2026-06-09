import { Injectable, inject, type ErrorHandler } from '@angular/core';
import { LogWriter } from './log-writer';

@Injectable()
export class ErrorCaptureService implements ErrorHandler {
  private readonly logWriter = inject(LogWriter);

  handleError(error: unknown): void {
    try {
      const normalized = this.normalize(error);

      this.logWriter.write({
        timestamp: Date.now(),
        level: 'error',
        message: normalized.message,
        context: {
          component: 'ErrorHandler',
          stack: normalized.stack,
          ...this.extractHttpDetails(error),
        },
      });
    } catch {
      // Recursion guard: logger itself failed — fallback to raw console
      console.error('[ErrorCaptureService] Logger failed, raw error:', error);
    }
  }

  private normalize(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }
    if (typeof error === 'string') {
      return new Error(error);
    }
    return new Error(String(error));
  }

  private extractHttpDetails(error: unknown): Record<string, unknown> {
    if (typeof error === 'object' && error !== null) {
      const obj = error as Record<string, unknown>;
      const details: Record<string, unknown> = {};

      if ('status' in obj) details['status'] = obj['status'];
      if ('url' in obj) details['url'] = obj['url'];

      return details;
    }
    return {};
  }
}
