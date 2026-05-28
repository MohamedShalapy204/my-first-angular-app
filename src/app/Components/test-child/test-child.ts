import { CurrencyPipe, UpperCasePipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Power2Pipe } from '../../Pipes/power2-pipe';

@Component({
  selector: 'app-test-child',
  imports: [TitleCasePipe, CurrencyPipe, DatePipe, UpperCasePipe, Power2Pipe],
  templateUrl: './test-child.html',
  styles: ``,
  host: {
    "class": "block outline"
  }
})
export class TestChild {
  date = new Date();
}
