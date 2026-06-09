import { TestBed } from '@angular/core/testing';
import { ErrorCaptureService } from './error-capture.service';
import { LogWriter } from './log-writer';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('ErrorCaptureService', () => {
  let service: ErrorCaptureService;
  let logWriterSpy: { write: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    logWriterSpy = { write: vi.fn() };

    TestBed.configureTestingModule({
      providers: [ErrorCaptureService, { provide: LogWriter, useValue: logWriterSpy }],
    });

    service = TestBed.inject(ErrorCaptureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log Error objects with message and stack', () => {
    const error = new Error('Something broke');
    service.handleError(error);

    expect(logWriterSpy.write).toHaveBeenCalledOnce();
    const entry = logWriterSpy.write.mock.calls[0][0];
    expect(entry.level).toBe('error');
    expect(entry.message).toContain('Something broke');
    expect(entry.context).toHaveProperty('stack');
  });

  it('should normalize string errors to Error objects', () => {
    service.handleError('string error');

    expect(logWriterSpy.write).toHaveBeenCalledOnce();
    const entry = logWriterSpy.write.mock.calls[0][0];
    expect(entry.level).toBe('error');
    expect(entry.message).toContain('string error');
  });

  it('should handle HttpErrorResponse-like objects', () => {
    const httpError = {
      message: 'HTTP error',
      status: 404,
      url: '/api/products',
      name: 'HttpErrorResponse',
    };
    service.handleError(httpError);

    expect(logWriterSpy.write).toHaveBeenCalledOnce();
    const entry = logWriterSpy.write.mock.calls[0][0];
    expect(entry.context).toHaveProperty('status', 404);
    expect(entry.context).toHaveProperty('url', '/api/products');
  });

  it('should not throw if logger itself fails (recursion guard)', () => {
    logWriterSpy.write.mockImplementation(() => {
      throw new Error('Logger broken');
    });

    const error = new Error('Original error');
    expect(() => service.handleError(error)).not.toThrow();
  });
});
