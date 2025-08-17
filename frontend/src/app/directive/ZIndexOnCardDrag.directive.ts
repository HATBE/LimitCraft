import { Directive, ElementRef } from '@angular/core';

// This directive sets the z-index of a card that is beeing cuirrently dragged, to 999,
// so that means, the card is on top of every other card,
// it does not matter in which sequence the card is rendered, it is always on top
// it resets to auto when beeing dropped, to not mess with later dragging

@Directive({
  standalone: true,
  selector: '[appZIndexOnCardDrag]',
  host: {
    '(cdkDragStarted)': 'onStart()',
    '(cdkDragEnded)': 'onEnd()',
  },
})
export default class ZIndexOnCardDragDirective {
  constructor(private htmlElementRef: ElementRef<HTMLElement>) {}

  public onStart() {
    this.htmlElementRef.nativeElement.style.zIndex = '999';
  }

  public onEnd() {
    this.htmlElementRef.nativeElement.style.zIndex = 'auto';
  }
}
