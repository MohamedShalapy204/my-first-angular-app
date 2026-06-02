import { Component, EventEmitter, output, Output } from '@angular/core';

@Component({
  selector: 'app-test-child',
  imports: [],
  templateUrl: './test-child.html',
  styleUrl: './test-child.css',
})
export class TestChild {
  totalOrderPrice = 100;

  onTotalOrderChange = output<number>();

  buy(){
    this.totalOrderPrice +=10
    this.onTotalOrderChange.emit(this.totalOrderPrice);
  }
}
