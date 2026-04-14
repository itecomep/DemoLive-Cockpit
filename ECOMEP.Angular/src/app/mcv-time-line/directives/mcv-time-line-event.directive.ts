import { AfterViewInit, Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { fromEvent, merge, Subscription } from 'rxjs';
import { concatMap, first, map, takeUntil } from 'rxjs/operators';
import { McvElasticService } from '../services/mcv-elastic.service';
import { McvElasticEvent } from '../model/mcv-elastic-event';

@Directive({
    selector: '[mcvTimeLineEvent]',
    standalone: true
})
export class McvTimeLineEventDirective implements OnInit, AfterViewInit, OnDestroy {

  private eventID: any;
  @Input('mcvTimeLineEvent')
  set EventID(id: any) {
    if (id) {
      this.eventID = id;
    }
  }
  @Input() overlappingEventHeight: number = 0;
  @Input() rowIndex: number = 0;

  @Input() minWidth = 1;
  @Input() minHeight = 1;
  @Input() moveDirection: 'vertical' | 'horizontal' | 'both' | 'none' = 'both';
  @Input() verticalResizeDirection: 'top' | 'bottom' | 'both' | 'none' = 'both';
  @Input() horizontalResizeDirection: 'left' | 'right' | 'both' | 'none' = 'both';
  @Input() snapToGrid: 'none' | 'vertical' | 'horizontal' | 'both' = 'none';


  private isActive = false;
  @Input('allowResize')
  set activate(value: boolean) {
    this.isActive = value;
    this.updateElement();
  }

  private originalLeft = 0;
  @Input('left')
  set left(left: number) {
    this.originalLeft = left;
    this.setLeft(this.originalLeft);
  }

  private originalWidth = 0;
  @Input('width')
  set width(width: number) {
    this.originalWidth = width;
    this.setWidth(this.originalWidth);
  }

  private originalTop = 0;
  @Input('top')
  set top(top: number) {
    this.originalTop = top;
    this.setTop(this.originalTop);
  }


  private originalHeight = 0;
  @Input('height')
  set height(height: number) {
    this.originalHeight = height;
    this.setHeight(this.originalHeight);
  }

  @Output() resizeStart = new EventEmitter<any>();
  @Output() resizeEnd = new EventEmitter<McvElasticEvent>();
  @Output() eventClick = new EventEmitter<any>();


  // private resizeid: any;
  private events!: Subscription;

  get elasticElement(): HTMLElement {
    return this.el.nativeElement;
  }

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private service: McvElasticService
  ) { }

  ngOnInit() {
    this.subscribeToResize();
    this.updateElement();
    this.renderer.addClass(this.elasticElement, 'timeline-event');
    // this.originalHeight = this.elasticElement.getBoundingClientRect().height;
    // this.updatePosition();
  }

  ngOnDestroy(): void {
    this.events.unsubscribe();
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   // this.updatePosition();
  // }
  // updatePosition() {
  //   let top = 0;
  //   if (this.originalHeight > 0 && this.rowIndex > 0) {
  //     top = Math.floor((this.overlappingEventHeight * this.rowIndex) / this.overlappingEventHeight) * this.overlappingEventHeight;
  //   }
  //   this.renderer.setStyle(this.elasticElement, 'top', top + 'px');
  // }

  ngAfterViewInit() {
    const observables = this.getObservables(this.el.nativeElement);

    observables.drags.forEach((event) => {
      const obj = new McvElasticEvent();
      obj.id = this.EventID;
      obj.action = 'move';
      obj.type = 'drags';
      obj.x =
        this.moveDirection === 'both' ||
          this.moveDirection === 'horizontal'
          ? event.x
          : 0;
      obj.y =
        this.moveDirection === 'both' || this.moveDirection === 'vertical'
          ? event.y
          : 0;
      if (this.isActive && !this.service.isResizing) {
        this.service.isMoving = true;
        this.renderer.addClass(this.elasticElement, 'moving');
        this.setTop(this.originalTop - obj.y, this.snapToGrid);
        this.setLeft(this.originalLeft - obj.x, this.snapToGrid);
      }
    });



    observables.drops.forEach((event) => {
      const obj = new McvElasticEvent();
      obj.id = this.EventID;
      obj.action = 'move';
      obj.type = 'drops';
      obj.x =
        this.moveDirection === 'both' ||
          this.moveDirection === 'horizontal'
          ? event.x
          : 0;
      obj.y =
        this.moveDirection === 'both' || this.moveDirection === 'vertical'
          ? event.y
          : 0;
      if (this.isActive && !this.service.isResizing && this.service.isMoving) {
        this.originalTop -= obj.y;
        this.originalLeft -= obj.x;
        this.resizingEnd('move', obj);
      }
    });
  }

  getObservables(domItem: any) {
    const mouseEventToCoordinate = (mouseEvent: any) => {
      mouseEvent.preventDefault();
      return {
        x: mouseEvent.clientX,
        y: mouseEvent.clientY,
      };
    };

    const touchEventToCoordinate = (touchEvent: any) => {
      touchEvent.preventDefault();
      return {
        x: touchEvent.changedTouches[0].clientX,
        y: touchEvent.changedTouches[0].clientY,
      };
    };

    const mouseDowns = fromEvent(domItem, 'mousedown').pipe(
      map(mouseEventToCoordinate)
    );
    const mouseMoves = fromEvent(window, 'mousemove').pipe(
      map(mouseEventToCoordinate)
    );
    const mouseUps = fromEvent(window, 'mouseup').pipe(
      map(mouseEventToCoordinate)
    );

    const touchStarts = fromEvent(domItem, 'touchstart').pipe(
      map(touchEventToCoordinate)
    );
    const touchMoves = fromEvent(domItem, 'touchmove').pipe(
      map(touchEventToCoordinate)
    );
    const touchEnds = fromEvent(window, 'touchend').pipe(
      map(touchEventToCoordinate)
    );

    const starts = merge(mouseDowns, touchStarts);
    const moves = merge(mouseMoves, touchMoves);
    const ends = merge(mouseUps, touchEnds);

    const drags = starts.pipe(
      concatMap((dragStartEvent) =>
        moves.pipe(
          takeUntil(ends),
          map((dragEvent) => {
            const x = dragStartEvent.x - dragEvent.x;
            const y = dragStartEvent.y - dragEvent.y;
            return { x, y };
          })
        )
      )
    );

    const drops = starts.pipe(
      concatMap((dragStartEvent) =>
        ends.pipe(
          first(),
          map((dragEndEvent) => {
            const x = dragStartEvent.x - dragEndEvent.x;
            const y = dragStartEvent.y - dragEndEvent.y;
            return { x, y };
          })
        )
      )
    );

    return { drags, drops };
  }

  updateElement() {
    if (!this.isActive) {
      this.renderer.removeClass(this.elasticElement, '-elastic');
    } else {
      this.renderer.addClass(this.elasticElement, '-elastic');
    }
  }

  subscribeToResize() {
    this.events = this.service.events.subscribe(
      (event: McvElasticEvent) => {
        if (this.isActive) {

          if (event.id === this.eventID) {
            if (event.action === 'left' && event.type === 'drags' && this.originalWidth + event.x >= this.minWidth) {
              if (this.horizontalResizeDirection === 'both' || this.horizontalResizeDirection === 'left') {
                this.resizeStart.emit(event);
                this.setLeft(this.originalLeft - event.x, this.snapToGrid);
                this.setWidth(this.originalWidth + event.x, this.snapToGrid, event.action);
              }

            }

            if (event.action === 'left' && event.type === 'drops' && this.originalWidth + event.x >= this.minWidth) {
              if (this.horizontalResizeDirection === 'both' || this.horizontalResizeDirection === 'left') {
                this.originalWidth += event.x;
                this.originalLeft -= event.x;
                this.resizingEnd('left', event);
              }
            } else if (event.action === 'left' && event.type === 'drops' && this.originalWidth + event.x <= this.minWidth) {
              if (this.horizontalResizeDirection === 'both' || this.horizontalResizeDirection === 'left') {
                this.originalWidth = this.elasticElement.offsetWidth;
                this.originalLeft = this.elasticElement.offsetLeft;
                this.resizingEnd('left', event);
              }
            }

            if (event.action === 'top' && event.type === 'drags' && this.originalHeight + event.y >= this.minHeight) {
              if (this.verticalResizeDirection === 'both' || this.verticalResizeDirection === 'top') {
                this.resizeStart.emit(event);
                this.setHeight(this.originalHeight + event.y, this.snapToGrid);
                this.setTop(this.originalTop - event.y, this.snapToGrid);
              }
            }

            if (event.action === 'top' && event.type === 'drops' && this.originalHeight + event.y >= this.minHeight) {
              if (this.verticalResizeDirection === 'both' || this.verticalResizeDirection === 'top') {
                this.originalHeight += event.y;
                this.originalTop -= event.y;
                this.resizingEnd('top', event);
              }
            } else if (event.action === 'top' && event.type === 'drops' && this.originalHeight + event.y <= this.minHeight) {
              if (this.verticalResizeDirection === 'both' || this.verticalResizeDirection === 'top') {
                this.originalHeight = this.elasticElement.offsetHeight;
                this.originalTop = this.elasticElement.offsetTop;
                this.resizingEnd('top', event);
              }
            }

            if (event.action === 'right' && event.type === 'drags' && this.originalWidth + event.x > this.minWidth) {
              if (this.horizontalResizeDirection === 'both' || this.horizontalResizeDirection === 'right') {
                this.setWidth(this.originalWidth + event.x, this.snapToGrid, event.action);

                this.resizeStart.emit(event);

              }
            }

            if (event.action === 'right' && event.type === 'drops' && this.originalWidth + event.x > this.minWidth) {
              if (this.horizontalResizeDirection === 'both' || this.horizontalResizeDirection === 'right') {
                this.originalWidth += event.x;
                this.resizingEnd('right', event);

              }
            }

            if (event.action === 'bottom' && event.type === 'drags' && this.originalHeight + event.y > this.minHeight) {
              if (this.verticalResizeDirection === 'both' || this.verticalResizeDirection === 'bottom') {
                this.setHeight(this.originalHeight + event.y, this.snapToGrid);
                this.resizeStart.emit(event);
              }
            }

            if (event.action === 'bottom' && event.type === 'drops' && this.originalHeight + event.y > this.minHeight) {
              if (this.verticalResizeDirection === 'both' || this.verticalResizeDirection === 'bottom') {
                this.originalHeight += event.y;
                this.resizingEnd('bottom', event);
              }
            }
          }
        }
      }
    );
  }

  resizingEnd(
    direction: 'move' | 'left' | 'right' | 'top' | 'bottom',
    event: McvElasticEvent
  ) {
    event.direction = direction;
    event.left = this.elasticElement.offsetLeft;
    event.width = this.elasticElement.offsetWidth;
    event.top = this.elasticElement.offsetTop;
    event.height = this.elasticElement.offsetHeight;
    this.service.isMoving = false;
    this.renderer.removeClass(this.elasticElement, 'moving');
    this.service.isResizing = false;
    this.resizeEnd.emit(event);
  }

  setWidth(width: number, snapToGrid: 'none' | 'vertical' | 'horizontal' | 'both' = 'none', direction: 'left' | 'right' = 'left') {
    const snapWidth =
      snapToGrid === 'both' || snapToGrid === 'horizontal'
        ? (direction === 'left' ? Math.floor(width / this.minWidth) : Math.ceil(width / this.minWidth)) * this.minWidth
        : width;
    this.renderer.setStyle(this.elasticElement, 'width', snapWidth + 'px');

  }

  setHeight(height: number, snapToGrid: 'none' | 'vertical' | 'horizontal' | 'both' = 'none') {
    const snapHeight =
      snapToGrid === 'both' || snapToGrid === 'vertical'
        ? Math.ceil(height / this.minHeight) * this.minHeight
        : height;
    this.renderer.setStyle(this.elasticElement, 'height', snapHeight + 'px');
  }

  setTop(top: number, snapToGrid: 'none' | 'vertical' | 'horizontal' | 'both' = 'none') {
    const snapTop =
      snapToGrid === 'both' || snapToGrid === 'vertical'
        ? Math.ceil(top / this.minHeight) * this.minHeight
        : top;
    this.renderer.setStyle(this.elasticElement, 'top', snapTop + 'px');
  }

  setLeft(left: number, snapToGrid: 'none' | 'vertical' | 'horizontal' | 'both' = 'none') {
    const snapLeft =
      snapToGrid === 'both' || snapToGrid === 'horizontal'
        ? Math.ceil(left / this.minWidth) * this.minWidth
        : left;
    this.renderer.setStyle(this.elasticElement, 'left', snapLeft + 'px');
  }

}

