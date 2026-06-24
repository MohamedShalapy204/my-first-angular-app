import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { RouterTestingModule } from '@angular/router/testing';
import { BottomTabs } from './bottom-tabs';

describe('BottomTabs', () => {
  let fixture: ComponentFixture<BottomTabs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BottomTabs, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(BottomTabs);
    fixture.detectChanges();
  });

  describe('tabs', () => {
    it.each([
      ['Home', '/'],
      ['Shop', '/products'],
      ['Cart', '/cart'],
    ])('should have %s tab linking to %s', (_label, route) => {
      const compiled = fixture.nativeElement as HTMLElement;
      const tab = compiled.querySelector(`a[routerLink="${route}"]`);
      expect(tab).toBeTruthy();
    });
  });

  describe('visibility', () => {
    it('should be hidden on desktop', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.classList.contains('md:hidden')).toBe(true);
    });

    it('should be fixed at bottom', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.classList.contains('fixed')).toBe(true);
      expect(compiled.classList.contains('bottom-0')).toBe(true);
    });
  });
});
