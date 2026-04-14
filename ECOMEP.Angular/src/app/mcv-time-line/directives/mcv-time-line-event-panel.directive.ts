import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { McvTimeLineDateUtilityService } from '../services/mcv-time-line-date-utility.service';
import { McvTimeLineService } from '../services/mcv-time-line.service';

@Directive({
    selector: '[mcvTimeLineEventPanel]',
    standalone: true
})
export class McvTimeLineEventPanelDirective implements OnInit, OnDestroy, AfterViewInit {
  viewMode: 'Day' | 'Resource' | 'Month' | 'Week' = 'Day';
  viewStart: Date = new Date();
  viewEnd: Date = new Date();
  startHour: number = 0;
  endHour: number = 0;
  hourWidth: number = 0;


  @Input('config') set configValue(value: any) {
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

  get element(): HTMLElement {
    return this.el.nativeElement;
  }

  constructor(
    private el: ElementRef,
    private service: McvTimeLineService,
    private dateUtility: McvTimeLineDateUtilityService
  ) { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.update();
  }

  ngOnDestroy() {
  }

  update() {
    setTimeout(() => {
      const now = new Date();
      if (now > this.viewStart && now < this.viewEnd) {
        const _hours = Math.floor(this.dateUtility.getHoursBetween(this.viewStart, now));
        const noOfDays = Math.floor(_hours / 24);
        const hourDifference = this.endHour - this.startHour;
        const ourTimeHour = noOfDays * hourDifference;
        let otTimesHourWidth = ourTimeHour * this.hourWidth;
        if (this.viewMode == 'Week' || this.viewMode == 'Month') {
          this.element.scrollLeft = otTimesHourWidth > 100 ? otTimesHourWidth - 100 : otTimesHourWidth;
        }
        // otTimesHourWidth = this.viewMode == 'Month' || this.viewMode =='Week' ? otTimesHourWidth /24 : otTimesHourWidth;
        // this.element.scrollLeft = otTimesHourWidth > 100 ? otTimesHourWidth - 100 : otTimesHourWidth;
      }
    }, 5000);
  }
}
