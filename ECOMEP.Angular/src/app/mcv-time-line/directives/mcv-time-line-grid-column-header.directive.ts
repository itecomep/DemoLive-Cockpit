import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';

@Directive({
    selector: '[mcvTimeLineGridColumnHeader]',
    standalone: true
})
export class McvTimeLineGridColumnHeaderDirective implements OnInit, OnDestroy {


  private width: number=1;
  private index: number = 0;
  private length: number = 0;
  @Input('config')
  set configValue(value: any) {
    if (value) {
      // console.log('Value',value);
      this.width = value.width;
      this.index = value.index;
      this.length=value.length;
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
    // console.log('GridHeader',this.index, this.length);
    if (this.index < (this.length-1)) {
      this.renderer.removeStyle(this.element, "width");
      this.renderer.setStyle(this.element, "width", `${this.width}px`);
    }
  }

}
