import { Injectable, isDevMode } from '@angular/core';
import type { LogEntry, LogLevel } from './log.types';

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

@Injectable({
  providedIn: 'root',
})
export class LogWriter {
  private readonly minLevel: LogLevel = isDevMode() ? 'debug' : 'info';

  write(entry: LogEntry): void {
    if (LEVEL_PRIORITY[entry.level] < LEVEL_PRIORITY[this.minLevel]) {
      return;
    }

    try {
      const formatted = this.format(entry);
      const consoleMethod = this.getConsoleMethod(entry.level);
      consoleMethod(formatted);
    } catch {
      // Guard: console method threw — swallow to prevent propagation
    }
  }

  private format(entry: LogEntry): string {
    const tag = `[${entry.level.toUpperCase()}]`;
    const base = `${tag} ${entry.message}`;

    if (!entry.context || Object.keys(entry.context).length === 0) {
      return base;
    }

    const contextParts = Object.entries(entry.context)
      .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
      .join(', ');

    return `${base} | ${contextParts}`;
  }

  private getConsoleMethod(level: LogLevel): (...args: unknown[]) => void {
    switch (level) {
      case 'debug':
        return console.debug.bind(console);
      case 'info':
        return console.info.bind(console);
      case 'warn':
        return console.warn.bind(console);
      case 'error':
        return console.error.bind(console);
    }
  }
}
