import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { Unauthorized } from './unauthorized';
import { TranslationService } from '../../services/translation';

describe('Unauthorized', () => {
  let component: Unauthorized;
  let fixture: ComponentFixture<Unauthorized>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Unauthorized, RouterTestingModule],
      providers: [
        {
          provide: TranslationService,
          useValue: { t: vi.fn().mockImplementation((key: string) => key) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Unauthorized);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render "Access Denied" heading', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const heading = compiled.querySelector('h1');
    expect(heading).toBeTruthy();
    expect(heading?.textContent).toContain('unauthorized.title');
  });

  it('should render lock icon', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const icon = compiled.querySelector('.material-symbols-outlined');
    expect(icon).toBeTruthy();
    expect(icon?.textContent?.trim()).toBe('lock');
  });

  it('should render description text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const description = compiled.querySelector('p');
    expect(description).toBeTruthy();
  });

  it('should render link to home page', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const homeLink = compiled.querySelector('a[routerLink="/"]');
    expect(homeLink).toBeTruthy();
  });

  it('should render link to login page', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const loginLink = compiled.querySelector('a[routerLink="/login"]');
    expect(loginLink).toBeTruthy();
  });
});
