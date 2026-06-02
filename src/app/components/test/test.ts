import { Component, signal } from '@angular/core';
import { TestChild } from '../test-child/test-child';

@Component({
  selector: 'app-test',
  imports: [TestChild],
  templateUrl: './test.html',
})
export class Test {
  totalOrderPrice = signal<number>(0);
  subscripTotalOrderPrice(totalOrderPrice:number){
    this.totalOrderPrice.set(totalOrderPrice)
  }
}
