import { AfterViewInit, Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { fromEvent, merge } from 'rxjs';
import { concatMap, first, map, takeUntil } from 'rxjs/operators';

import { McvElasticService } from '../services/mcv-elastic.service';
import { McvElasticEvent } from '../model/mcv-elastic-event';

@Directive({
    selector: '[mcvElasticResizeRight]',
    standalone: true
})
export class McvElasticResizeRightDirective implements AfterViewInit {

  startX: number = 0;
  startY: number = 0;
  resizeid: any;

  constructor(private el: ElementRef, private renderer: Renderer2, private service: McvElasticService) { }

  @Input('id')
  set resizeId(resizeId: any) {
    this.resizeid = resizeId;
  }

  ngAfterViewInit() {
    this.renderer.addClass(this.el.nativeElement, 'resize-handle');
    this.renderer.addClass(this.el.nativeElement, 'right');

    const observables = this.getObservables(this.el.nativeElement);

    observables.drags.forEach(event => {
      const obj = new McvElasticEvent();
      obj.id = this.resizeid;
      obj.action = 'right';
      obj.type = 'drags';
      obj.x = event.x;
      if (!this.service.isMoving) {
        this.service.isResizing = true;
        this.service.resize(obj);
      }
    });

    observables.drops.forEach(event => {
      const obj = new McvElasticEvent();
      obj.id = this.resizeid;
      obj.action = 'right';
      obj.type = 'drops';
      obj.x = event.x;
      if (!this.service.isMoving && this.service.isResizing) {
        this.service.resize(obj);
      }
    });

  }

  getObservables(domItem: any) {

    const mouseEventToCoordinate = (mouseEvent: any) => {
      mouseEvent.preventDefault();
      return {
        x: mouseEvent.clientX,
        y: mouseEvent.clientY
      };
    };

    const touchEventToCoordinate = (touchEvent: any) => {
      touchEvent.preventDefault();
      return {
        x: touchEvent.changedTouches[0].clientX,
        y: touchEvent.changedTouches[0].clientY
      };
    };


    const mouseDowns = fromEvent(domItem, 'mousedown').pipe(map(mouseEventToCoordinate));
    const mouseMoves = fromEvent(window, 'mousemove').pipe(map(mouseEventToCoordinate));
    const mouseUps = fromEvent(window, 'mouseup').pipe(map(mouseEventToCoordinate));

    const touchStarts = fromEvent(domItem, 'touchstart').pipe(map(touchEventToCoordinate));
    const touchMoves = fromEvent(domItem, 'touchmove').pipe(map(touchEventToCoordinate));
    const touchEnds = fromEvent(window, 'touchend').pipe(map(touchEventToCoordinate));

    const starts = merge(mouseDowns, touchStarts);
    const moves = merge(mouseMoves, touchMoves);
    const ends = merge(mouseUps, touchEnds);

    const drags = starts.pipe(concatMap(dragStartEvent =>
      moves.pipe(
        takeUntil(ends),
        map(dragEvent => {
          const x = dragEvent.x - dragStartEvent.x;
          const y = dragEvent.y - dragStartEvent.y;
          return { x, y };
        })
      )
    ));

    const drops = starts.pipe(concatMap(dragStartEvent =>
      ends.pipe(
        first(),
        map(dragEndEvent => {
          const x = dragEndEvent.x - dragStartEvent.x;
          const y = dragEndEvent.y - dragStartEvent.y;
          return { x, y };
        })
      )
    ));


    return { drags, drops };
  }

}

