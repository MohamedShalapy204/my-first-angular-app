import { TestBed } from '@angular/core/testing';
import { PerformanceTracker } from './performance-tracker';
import type { PerformanceMetric } from './log.types';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('PerformanceTracker', () => {
  let service: PerformanceTracker;
  let metricsReceived: PerformanceMetric[];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerformanceTracker);
    metricsReceived = [];
    service.onMetric((m) => metricsReceived.push(m));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should track start/end timer', () => {
    service.startTimer('api-call');

    // Simulate some time passing
    const start = performance.now();
    while (performance.now() - start < 10) {
      // busy wait
    }

    service.endTimer('api-call');

    expect(metricsReceived.length).toBe(1);
    expect(metricsReceived[0].name).toBe('api-call');
    expect(metricsReceived[0].duration).toBeGreaterThanOrEqual(0);
  });

  it('should return null for unknown timer label', () => {
    const result = service.endTimer('unknown');
    expect(result).toBeNull();
    expect(metricsReceived.length).toBe(0);
  });

  it('should handle duplicate timer labels', () => {
    service.startTimer('dup');
    service.startTimer('dup'); // overwrite

    service.endTimer('dup');

    expect(metricsReceived.length).toBe(1);
    expect(metricsReceived[0].name).toBe('dup');
  });

  it('should track multiple timers independently', () => {
    service.startTimer('timer-a');
    service.startTimer('timer-b');

    service.endTimer('timer-a');
    service.endTimer('timer-b');

    expect(metricsReceived.length).toBe(2);
    expect(metricsReceived[0].name).toBe('timer-a');
    expect(metricsReceived[1].name).toBe('timer-b');
  });

  it('should include timestamp on metrics', () => {
    const before = Date.now();
    service.startTimer('t');
    service.endTimer('t');
    const after = Date.now();

    expect(metricsReceived[0].timestamp).toBeGreaterThanOrEqual(before);
    expect(metricsReceived[0].timestamp).toBeLessThanOrEqual(after);
  });

  it('should remove listener on unsubscribe', () => {
    const unsubscribe = service.onMetric(() =>
      metricsReceived.push({ name: 'extra', duration: 0, timestamp: 0 }),
    );
    unsubscribe();

    service.startTimer('x');
    service.endTimer('x');

    expect(metricsReceived.length).toBe(1); // only original listener
  });
});
