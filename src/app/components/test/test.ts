import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { TestChild } from "../test-child/test-child";

@Component({
  selector: 'app-test',
  templateUrl: 'test.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TestChild],
})
export class Test {

}