import { AfterViewInit, Directive, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { McvTimeLineEvent } from '../model/mcv-time-line-events';


@Directive({
    selector: '[mcvTimeLineEventGroup]',
    standalone: true
})
export class McvTimeLineEventGroupDirective implements OnInit, AfterViewInit {
  events: McvTimeLineEvent[] = [];
  @Input('events') set eventsValue(value: McvTimeLineEvent[]) {
    if (value) {
      this.events = value;
      this.update();
    }
  }

  @Output() heightChange = new EventEmitter<any>();

  @Input() overlappingEventHeight: number = 0;

  originalHeight: number = 0;

  get element(): HTMLElement {
    return this.el.nativeElement;
  }

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
  ) { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.renderer.addClass(this.element, 'eventGroup-item');
    this.originalHeight = this.element.getBoundingClientRect().height;
    this.update();
  }

  get rowCount(): number {
    return this.events && this.events.length !== 0 ? Math.max.apply(Math, this.events.map((o) => o.rowIndex)) : 0;
  }

  update() {
    if (this.originalHeight && this.originalHeight > 0) {
      const height = this.overlappingEventHeight * (this.rowCount + 1);
      if (height > this.originalHeight) {
        this.renderer.setStyle(this.element, 'height', height + 'px');
        this.heightChange.emit(height + 10);
      }
    }
  }


}
