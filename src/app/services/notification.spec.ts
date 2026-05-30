import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NotificationService } from './notification';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a notification', () => {
    service.show('Test message');
    expect(service.notifications().length).toBe(1);
    expect(service.notifications()[0].message).toBe('Test message');
  });

  it('should dismiss a notification manually', () => {
    const id = service.show('Dismiss me');
    service.dismiss(id);
    expect(service.notifications().length).toBe(0);
  });

  it('should auto-dismiss after duration', fakeAsync(() => {
    service.show('Wait for me', 'info', 1000);
    expect(service.notifications().length).toBe(1);
    tick(1001);
    expect(service.notifications().length).toBe(0);
  }));

  it('should not auto-dismiss loading notifications', fakeAsync(() => {
    service.show('Loading...', 'loading', 1000);
    tick(2000);
    expect(service.notifications().length).toBe(1);
  }));
});
