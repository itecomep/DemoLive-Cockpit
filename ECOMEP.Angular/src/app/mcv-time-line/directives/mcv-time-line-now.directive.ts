import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Observable, Subscription, timer } from 'rxjs';
import { McvTimeLineDateUtilityService } from '../services/mcv-time-line-date-utility.service';

@Directive({
    selector: '[mcvTimeLineNow]',
    standalone: true
})
export class McvTimeLineNowDirective implements OnInit, OnDestroy {
  viewMode: 'Day' | 'Resource' | 'Month' | 'Week' = 'Day';
  viewStart: Date = new Date();
  viewEnd: Date = new Date();
  startHour: number = 0;
  endHour: number = 0;
  hourWidth: number = 0;

  @Input('mcvTimeLineNow') set configValue(value: { viewMode: 'Day', viewStart: Date, viewEnd: Date, startHour: number, endHour: number, hourWidth: number }) {
    if (value) {
      this.viewMode = value.viewMode;
      this.viewStart = value.viewStart;
      this.viewEnd = value.viewEnd;
      this.startHour = value.startHour;
      this.endHour = value.endHour;
      this.hourWidth = value.hourWidth;
      this.update();
    }
  }

  @Input() interval: number = 60;

  private subscription!: Subscription;
  left: number = 0;
  timer: Observable<number> = timer(0, this.interval * 1000);

  get element(): HTMLElement {
    return this.el.nativeElement;
  }

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private dateUtility: McvTimeLineDateUtilityService
  ) { }

  ngOnInit(): void {
    this.renderer.addClass(this.element, 'time-line-now');
    this.subscription = this.timer.subscribe(() => {
      this.update();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  update() {
    const now = new Date();
    if (this.viewMode == 'Day' || this.viewMode == 'Resource') {
      if (now > this.viewStart && now < this.viewEnd) {
        const _hours = this.dateUtility.getHoursBetween(this.viewStart, now);
        this.left = _hours * this.hourWidth;
        this.renderer.setStyle(this.element, 'left', this.left + 'px');
        this.renderer.setStyle(this.element, 'display', 'flex');
      } else {
        this.renderer.setStyle(this.element, 'display', 'none');
      }
    } else if (this.viewMode == 'Week' || this.viewMode == "Month") {
      if (now > this.viewStart && now < this.viewEnd) {
        //Same Logic as getEventPosition
        const _hours = Math.floor(this.dateUtility.getHoursBetween(this.viewStart, now));
        const noOfDays = Math.floor(_hours / 24);
        const endMinusStartHour = this.endHour - this.startHour;
        const daysHour = noOfDays * endMinusStartHour;
        let _setCurrentEventDate = new Date(now);
        _setCurrentEventDate.setHours(this.startHour, 0, 0, 0);
        let hourDifference = this.dateUtility.getHoursBetween(_setCurrentEventDate, now);
        const spaceBetween = daysHour + hourDifference;
        this.left = spaceBetween * this.hourWidth;
        this.renderer.setStyle(this.element, 'left', this.left + 'px');
        this.renderer.setStyle(this.element, 'display', 'flex');
      } else {
        this.renderer.setStyle(this.element, 'display', 'none');
      }
    }

  }
}
