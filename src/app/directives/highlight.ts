import { Directive, ElementRef, HostListener, inject, input } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  host: {
    '(mouseover)':'over()',
    '(mouseout)':'out()'
  },
})
export class Highlight {
  private element = inject(ElementRef)
  appHighlight = input('red');
  hoverColor = input('pink')

  ngOnInit(){
    this.out()
  }

  over(){
    this.element.nativeElement.style.backgroundColor = this.hoverColor();
  }
  out(){
    this.element.nativeElement.style.backgroundColor = this.appHighlight()
  }

}
