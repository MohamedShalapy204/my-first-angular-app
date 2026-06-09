export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  component?: string;
  [key: string]: unknown;
}

export interface LogEntry {
  timestamp: number;
  level: LogLevel;
  message: string;
  context?: LogContext;
}

export interface UserAction {
  timestamp: number;
  type: string;
  data?: Record<string, unknown>;
}

export interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
}

export type ActionType =
  | 'navigation'
  | 'product_view'
  | 'add_to_bag'
  | 'search'
  | 'form_submit'
  | 'custom';
