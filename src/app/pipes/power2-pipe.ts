import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'power2',
})
export class Power2Pipe implements PipeTransform {
  transform(value: number, ...args: unknown[]): number {
    return Math.pow(value, 2);
  }
}
