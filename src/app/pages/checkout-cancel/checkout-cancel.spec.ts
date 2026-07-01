import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { CheckoutCancel } from './checkout-cancel';
import { provideRouter } from '@angular/router';

describe('CheckoutCancel', () => {
  let component: CheckoutCancel;
  let fixture: ComponentFixture<CheckoutCancel>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CheckoutCancel],
      providers: [provideRouter([])],
    });

    fixture = TestBed.createComponent(CheckoutCancel);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render cancel message', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('cancelled');
  });

  it('should have link back to cart', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const links = compiled.querySelectorAll('a');
    const cartLink = Array.from(links).find((a) => a.getAttribute('routerLink') === '/cart');
    expect(cartLink).toBeTruthy();
  });
});
