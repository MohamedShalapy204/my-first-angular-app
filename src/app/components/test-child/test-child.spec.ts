import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestChild } from './test-child';

describe('TestChild', () => {
  let component: TestChild;
  let fixture: ComponentFixture<TestChild>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestChild],
    }).compileComponents();

    fixture = TestBed.createComponent(TestChild);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
