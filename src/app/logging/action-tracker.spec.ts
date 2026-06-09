import { TestBed } from '@angular/core/testing';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { ActionTracker } from './action-tracker';
import type { UserAction } from './log.types';
import { describe, it, expect, beforeEach } from 'vitest';

describe('ActionTracker', () => {
  let service: ActionTracker;
  let routerMock: { events: Subject<unknown> };
  let receivedActions: UserAction[];

  beforeEach(() => {
    routerMock = { events: new Subject() };
    receivedActions = [];

    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: routerMock }],
    });

    service = TestBed.inject(ActionTracker);
    service.onAction((action) => receivedActions.push(action));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should track navigation events', () => {
    routerMock.events.next(new NavigationEnd(1, '/products', '/products'));

    expect(receivedActions.length).toBe(1);
    expect(receivedActions[0].type).toBe('navigation');
    expect(receivedActions[0].data).toEqual({
      url: '/products',
      urlAfterRedirects: '/products',
    });
  });

  it('should track custom actions', () => {
    service.track('product_view', { productId: 123 });

    expect(receivedActions.length).toBe(1);
    expect(receivedActions[0].type).toBe('product_view');
    expect(receivedActions[0].data).toEqual({ productId: 123 });
  });

  it('should track multiple actions', () => {
    routerMock.events.next(new NavigationEnd(1, '/home', '/home'));
    service.track('search', { query: 'mic' });
    service.track('add_to_bag', { productId: 456 });

    expect(receivedActions.length).toBe(3);
  });

  it('should include timestamp on actions', () => {
    const before = Date.now();
    service.track('custom');
    const after = Date.now();

    expect(receivedActions[0].timestamp).toBeGreaterThanOrEqual(before);
    expect(receivedActions[0].timestamp).toBeLessThanOrEqual(after);
  });

  it('should remove listener on unsubscribe', () => {
    const unsubscribe = service.onAction(() => receivedActions.push({} as UserAction));
    unsubscribe();

    service.track('custom');
    expect(receivedActions.length).toBe(1); // Only the original listener
  });
});
