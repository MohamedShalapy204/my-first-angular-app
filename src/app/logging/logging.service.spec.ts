import { TestBed } from '@angular/core/testing';
import { LoggingService } from './logging.service';
import { LogWriter } from './log-writer';
import { ActionTracker } from './action-tracker';
import { PerformanceTracker } from './performance-tracker';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('LoggingService', () => {
  let service: LoggingService;
  let logWriterSpy: { write: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    logWriterSpy = { write: vi.fn() };

    TestBed.configureTestingModule({
      providers: [LoggingService, { provide: LogWriter, useValue: logWriterSpy }],
    });

    service = TestBed.inject(LoggingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should delegate debug to LogWriter', () => {
    service.debug('debug msg', { component: 'Test' });

    expect(logWriterSpy.write).toHaveBeenCalledOnce();
    const entry = logWriterSpy.write.mock.calls[0][0];
    expect(entry.level).toBe('debug');
    expect(entry.message).toBe('debug msg');
    expect(entry.context).toEqual({ component: 'Test' });
  });

  test.each([
    ['info', 'info'],
    ['warn', 'warn'],
    ['error', 'error'],
  ])('should delegate %s to LogWriter', (level) => {
    service[level as 'info' | 'warn' | 'error'](`${level} msg`);

    const entry = logWriterSpy.write.mock.calls[0][0];
    expect(entry.level).toBe(level);
    expect(entry.message).toBe(`${level} msg`);
  });

  it('should include timestamp on all log entries', () => {
    const before = Date.now();
    service.info('test');
    const after = Date.now();

    const entry = logWriterSpy.write.mock.calls[0][0];
    expect(entry.timestamp).toBeGreaterThanOrEqual(before);
    expect(entry.timestamp).toBeLessThanOrEqual(after);
  });
});
