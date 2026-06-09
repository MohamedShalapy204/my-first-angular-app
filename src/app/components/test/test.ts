import { Component, type ElementRef, signal, viewChild } from '@angular/core';
import { TestChild } from '../test-child/test-child';

@Component({
  selector: 'app-test',
  imports: [TestChild],
  templateUrl: './test.html',
})
export class Test {
  totalOrderPrice = signal<number>(0);
  myInp = viewChild<ElementRef>('userNameInp');
  testChild = viewChild<TestChild>('testChild');

  constructor() {
    console.log('constructor: ', this.myInp());
  }
  ngAfterViewInit() {
    this.myInp()!.nativeElement.value = 'hi';
    this.myInp()!.nativeElement.focus();
    console.log('ngAfterViewInit: ', this.myInp()?.nativeElement);
    console.log('ngAfterViewInit: ', this.testChild());
  }

  subscripTotalOrderPrice(totalOrderPrice: number) {
    this.totalOrderPrice.set(totalOrderPrice);
  }
}
