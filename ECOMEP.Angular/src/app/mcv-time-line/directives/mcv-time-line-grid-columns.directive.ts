import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';

@Directive({
    selector: '[mcvTimeLineGridColumns]',
    standalone: true
})
export class McvTimeLineGridColumnsDirective implements OnInit, OnDestroy {

  private width: number = 1;
  @Input('width')
  set widthValue(width: number) {
    if (width > 0) {
      this.width = width;
      this.updateElement();
    }
  }

  get element(): HTMLElement {
    return this.el.nativeElement;
  }

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
  ) { }

  ngOnInit(): void {


    // this.renderer.addClass(div, 'tl-selection-cell-content');

  }

  ngOnDestroy(): void {

  }

  updateElement() {
    this.renderer.removeStyle(this.element, "background-size");
    // console.log('updatecolumns',this.element,"background-size",`${this.width}px auto`);
    this.renderer.setStyle(this.element, "background-size", `${this.width}px auto`);
  }

}
