import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationContainer } from './notification-container';
import { NotificationService } from '../../services/notification';
import { SettingsService } from '../../services/settings';

describe('NotificationContainer', () => {
  let component: NotificationContainer;
  let fixture: ComponentFixture<NotificationContainer>;
  let service: NotificationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationContainer],
      providers: [NotificationService, SettingsService]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationContainer);
    component = fixture.componentInstance;
    service = TestBed.inject(NotificationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render notifications from the service', () => {
    service.show('Hello World');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Hello World');
  });

  it('should display multiple notifications', () => {
    service.show('Msg 1');
    service.show('Msg 2');
    fixture.detectChanges();
    const cards = fixture.nativeElement.querySelectorAll('.notification-card');
    expect(cards.length).toBe(2);
  });

  it('should call dismiss when close button is clicked', () => {
    const spy = vi.spyOn(service, 'dismiss');
    service.show('Close me');
    fixture.detectChanges();
    
    const closeBtn = fixture.nativeElement.querySelector('button');
    closeBtn.click();
    
    expect(spy).toHaveBeenCalled();
  });
});
