import { TestBed } from '@angular/core/testing';
import { LogWriter } from './log-writer';
import type { LogEntry } from './log.types';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('LogWriter', () => {
  let service: LogWriter;
  let consoleSpy: {
    debug: ReturnType<typeof vi.spyOn>;
    info: ReturnType<typeof vi.spyOn>;
    warn: ReturnType<typeof vi.spyOn>;
    error: ReturnType<typeof vi.spyOn>;
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogWriter);

    consoleSpy = {
      debug: vi.spyOn(console, 'debug').mockImplementation(() => {}),
      info: vi.spyOn(console, 'info').mockImplementation(() => {}),
      warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
      error: vi.spyOn(console, 'error').mockImplementation(() => {}),
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  test.each([
    ['debug', 'debug', '[DEBUG]'],
    ['info', 'info', '[INFO]'],
    ['warn', 'warn', '[WARN]'],
    ['error', 'error', '[ERROR]'],
  ])('should route %s level to console.%s', (level, method, tag) => {
    const entry: LogEntry = {
      timestamp: Date.now(),
      level: level as LogEntry['level'],
      message: 'Level test',
    };

    service.write(entry);

    expect(consoleSpy[method as keyof typeof consoleSpy]).toHaveBeenCalledOnce();
    expect(consoleSpy[method as keyof typeof consoleSpy].mock.calls[0][0]).toContain(tag);
  });

  it('should include context in formatted output', () => {
    const entry: LogEntry = {
      timestamp: Date.now(),
      level: 'info',
      message: 'Context test',
      context: { component: 'ProductCard', productId: 123 },
    };

    service.write(entry);

    const output = consoleSpy.info.mock.calls[0][0] as string;
    expect(output).toContain('ProductCard');
    expect(output).toContain('productId: 123');
  });

  it('should handle console method errors without propagating', () => {
    consoleSpy.info.mockImplementation(() => {
      throw new Error('Console unavailable');
    });

    const entry: LogEntry = {
      timestamp: Date.now(),
      level: 'info',
      message: 'Should not throw',
    };

    expect(() => service.write(entry)).not.toThrow();
  });
});
