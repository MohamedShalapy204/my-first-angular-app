import { Injectable } from '@angular/core';
import type { PerformanceMetric } from './log.types';

export type MetricCallback = (metric: PerformanceMetric) => void;

@Injectable({
  providedIn: 'root',
})
export class PerformanceTracker {
  private readonly timers = new Map<string, number>();
  private readonly listeners = new Set<MetricCallback>();

  startTimer(label: string): void {
    if (this.timers.has(label)) {
      console.warn(`[PerformanceTracker] Timer "${label}" overwritten`);
    }
    this.timers.set(label, performance.now());
  }

  endTimer(label: string): number | null {
    const start = this.timers.get(label);
    if (start === undefined) {
      console.warn(`[PerformanceTracker] Unknown timer "${label}"`);
      return null;
    }

    const duration = performance.now() - start;
    this.timers.delete(label);

    this.emit({
      name: label,
      duration,
      timestamp: Date.now(),
    });

    return duration;
  }

  onMetric(callback: MetricCallback): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private emit(metric: PerformanceMetric): void {
    for (const listener of this.listeners) {
      try {
        listener(metric);
      } catch {
        // Guard: listener threw — swallow
      }
    }
  }
}
