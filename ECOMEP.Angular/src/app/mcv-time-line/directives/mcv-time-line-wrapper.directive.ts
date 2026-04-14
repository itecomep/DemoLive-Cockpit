import { AfterViewInit, Directive, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { McvTimeLineComponent } from '../components/mcv-time-line/mcv-time-line.component';

@Directive({
    selector: '[mcvTimeLineWrapper]',
    standalone: true
})
export class McvTimeLineWrapperDirective implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(McvTimeLineComponent) Timeline!: McvTimeLineComponent;

  timelineHeight = 300;
  update!: Subscription;

  get element(): HTMLElement {
    return this.el.nativeElement;
  }
  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
  ) { }

  ngOnInit() {
    this.renderer.addClass(this.element, '-timeline-wrapper');

  }

  ngAfterViewInit() {
    this.subscribeToUpdate();
    this.getTimelineHeight();
  }

  ngOnDestroy() {
    this.update.unsubscribe();
  }

  getTimelineHeight() {
    if (this.Timeline) {
      if (!this.Timeline.eventPanel) { return; }

      const children = this.Timeline.eventPanel.nativeElement.getElementsByClassName('grid-container');
      if (!children) { return; }

      setTimeout(() => {
        this.timelineHeight = children[0].getBoundingClientRect().height + 0;
      });

    }
  }

  subscribeToUpdate() {
    this.update = this.Timeline.eventGroupHeightChange.subscribe((value: any) => {
      this.getTimelineHeight();
    });
  }

}
