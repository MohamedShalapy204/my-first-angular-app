import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SearchPanel } from './search-panel';
import { TranslationService } from '../../../services/translation';

describe('SearchPanel', () => {
  let component: SearchPanel;
  let fixture: ComponentFixture<SearchPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchPanel],
      providers: [
        { provide: TranslationService, useValue: { t: vi.fn().mockReturnValue('translated') } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('close method', () => {
    it('should emit closed event', () => {
      const closedSpy = vi.spyOn(component.closed, 'emit');
      component.close();
      expect(closedSpy).toHaveBeenCalled();
    });
  });

  describe('escape key', () => {
    it('should emit closed event on escape key when open', () => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();

      const closedSpy = vi.spyOn(component.closed, 'emit');
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);
      expect(closedSpy).toHaveBeenCalled();
    });
  });

  describe('template', () => {
    it('should have search input', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const input = compiled.querySelector('input[type="search"]');
      expect(input).toBeTruthy();
    });

    it('should have placeholder', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const input = compiled.querySelector('input[type="search"]') as HTMLInputElement;
      expect(input.placeholder).toBeTruthy();
    });

    it('should have close button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const button = compiled.querySelector('button[aria-label="Close search"]');
      expect(button).toBeTruthy();
    });
  });
});
