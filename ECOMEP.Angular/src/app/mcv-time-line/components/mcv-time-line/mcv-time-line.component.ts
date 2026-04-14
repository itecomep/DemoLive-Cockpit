import { DatePipe, NgIf, NgFor, NgClass } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';

import { McvTimeLineService } from '../../services/mcv-time-line.service';
import { McvTimeLineDateUtilityService } from '../../services/mcv-time-line-date-utility.service';

import { McvElasticEvent } from '../../model/mcv-elastic-event';
import { McvTimeLineCell } from '../../model/mcv-time-line-cell';
import { McvTimeLineEvent } from '../../model/mcv-time-line-events';
import { McvTimeLineHoliday } from '../../model/mcv-time-line-holiday';
import { McvTimeLineEventGroup } from '../../model/mcv-time-line-event-group';
import { McvTimeLineEventDirective } from '../../directives/mcv-time-line-event.directive';
import { McvTimeLineCellDirective } from '../../directives/mcv-time-line-cell.directive';
import { McvTimeLineGridColumnsDirective } from '../../directives/mcv-time-line-grid-columns.directive';
import { McvTimeLineGridColumnHeaderDirective } from '../../directives/mcv-time-line-grid-column-header.directive';
import { McvTimeLineNowDirective } from '../../directives/mcv-time-line-now.directive';
import { McvTimeLineEventPanelDirective } from '../../directives/mcv-time-line-event-panel.directive';
import { McvTimeLineEventGroupDirective } from '../../directives/mcv-time-line-event-group.directive';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'mcv-time-line',
    templateUrl: './mcv-time-line.component.html',
    styleUrls: ['./mcv-time-line.component.scss'],
    standalone: true,
    imports: [NgIf, MatButtonModule, MatTooltipModule, MatIconModule, MatMenuModule, NgFor, McvTimeLineEventGroupDirective, McvTimeLineEventPanelDirective, NgClass, McvTimeLineNowDirective, McvTimeLineGridColumnHeaderDirective, McvTimeLineGridColumnsDirective, McvTimeLineCellDirective, McvTimeLineEventDirective, DatePipe]
})
export class McvTimeLineComponent implements OnInit, AfterViewInit {
  @ViewChild('eventGroupPanel') eventGroupPanel!: ElementRef;
  @ViewChild('eventPanel') eventPanel!: ElementRef;
  @ViewChild('gridHeader') gridHeader!: ElementRef;
  @ViewChild('gridRows') gridRows!: ElementRef;

  viewModeOptions = ['Day', 'Week', 'Month'];
  viewMode: 'Day' | 'Resource' | 'Month' | 'Week' = 'Day';
  currentDate = new Date();
  rangeStartDate = new Date();
  rangeEndDate = new Date();
  eventGroups: McvTimeLineEventGroup[] = [];
  selectedGroup!: McvTimeLineEventGroup | null;
  gridLabels: any[] = [];
  cells: McvTimeLineCell[] = [];
  eventHeightSlim: number = 1;
  eventHeight: number = 1;
  timeLineStartHour = 0;
  timeLineStartMinute = 0;

  @Input('start') set viewStartTime(time: string) {
    if (time) {
      this.timeLineStartHour = this.dateUtility.getHoursFromTimeString(time);
      this.timeLineStartMinute = this.dateUtility.getMinutesFromTimeString(time);
    }
  }

  timeLineEndHour = 24;
  timeLineEndMinute = 0;
  @Input('end') set viewEndTime(time: string) {
    if (time) {
      this.timeLineEndHour = this.dateUtility.getHoursFromTimeString(time);
      this.timeLineEndMinute = this.dateUtility.getMinutesFromTimeString(time);
    }
  }
  isTimeLineReady: boolean = false;
  events: McvTimeLineEvent[] = [];
  sourceEvents: McvTimeLineEvent[] = [];
  @Input('events') set eventSource(value: McvTimeLineEvent[]) {
    if (value) {
      this.sourceEvents = value;
      if (this.viewMode === 'Month' || this.viewMode === 'Week') {
        this.events = this.service.getEventsSplitByMonth(this.viewStart, this.viewEnd, this.sourceEvents);
      }
      else {
        this.events = this.service.getEventsSplitByDay(this.viewStart, this.viewEnd, this.sourceEvents);
      }

      if (this.isTimeLineReady) {
        this.generateEvents();
      } else {
        this.initializeTimeline();
      }
    }
  }

  @Input() holidays: McvTimeLineHoliday[] = [];

  eventGroup: McvTimeLineEventGroup[] = [];
  @Input('resources') set resourceValue(value: McvTimeLineEventGroup[]) {
    if (value) {
      this.eventGroup = value;
    }
  }

  // @Output() dayChange = new EventEmitter<any>();
  @Output() rangeChange = new EventEmitter<any>();
  @Output() eventUpdate = new EventEmitter<any>();
  @Output() slotSelection = new EventEmitter<any>();
  @Output() eventGroupHeightChange = new EventEmitter<any>();
  @Output() gridHeightChange = new EventEmitter<any>();
  @Output() eventClick = new EventEmitter<any>();


  get viewStart(): Date {
    if (this.viewMode === 'Month') {
      let viewStartDate = new Date(this.rangeStartDate);
      viewStartDate.setHours(0, 0, 0, 0);
      return viewStartDate;
    } else if (this.viewMode === 'Week') {
      let viewStartDate = new Date(this.rangeStartDate);
      viewStartDate.setHours(0, 0, 0, 0);
      return viewStartDate;
    } else {
      // tslint:disable-next-line: prefer-const
      let viewStartDate = new Date(this.currentDate);
      viewStartDate.setHours(this.timeLineStartHour, this.timeLineStartMinute, 0, 0);
      return viewStartDate;
    }
  }

  get viewEnd(): Date {
    if (this.viewMode === 'Month') {
      let viewEndDate = new Date(this.rangeEndDate);
      viewEndDate.setDate(viewEndDate.getDate() + 1);
      viewEndDate.setHours(0, 0, 0, 0);
      return viewEndDate;
    } else if (this.viewMode === 'Week') {
      let viewEndDate = new Date(this.rangeEndDate);
      viewEndDate.setDate(viewEndDate.getDate() + 1);
      viewEndDate.setHours(0, 0, 0, 0);
      return viewEndDate;
    } else {
      // tslint:disable-next-line: prefer-const
      let viewEndDate = new Date(this.currentDate);
      viewEndDate.setHours(this.timeLineEndHour, this.timeLineEndMinute, 0, 0);
      return viewEndDate;
    }
  }

  get showNext(): boolean {
    return true;
  }

  get showPrevious(): boolean {
    return true;
  }

  get element(): HTMLElement {
    return this.el.nativeElement;
  }

  constructor(
    private el: ElementRef,
    private service: McvTimeLineService,
    private datePipe: DatePipe,
    private dateUtility: McvTimeLineDateUtilityService,
  ) { }

  ngOnInit(): void {
    this.viewMode = this.service.DEFAULT_VIEW_MODE;
    this.eventHeight = this.service.DEFAULT_EVENT_HEIGHT;
    this.eventHeightSlim = this.service.DEFAULT_EVENT_HEIGHT_SLIM;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeTimeline();
    });
  }

  hourWidth: number = 0;
  slotWidth: number = 0;
  dayWidth: number = 0;

  private initializeTimeline(emitEvent: boolean = true) {
    this.setHourWidth();
    if (this.viewMode === 'Month') {

      this.rangeStartDate = this.dateUtility.getMonthStart(this.currentDate);
      this.rangeEndDate = this.dateUtility.getMonthEnd(this.currentDate);
      // console.log('init Month', this.rangeStartDate, this.rangeEndDate);
      this.gridLabels = this.service.getDayLabels(this.rangeStartDate, this.rangeEndDate, this.holidays);
      this.cells = this.service.getSelectionCells(this.hourWidth, this.viewStart, this.viewEnd, this.service.DEFAULT_SLOT_HOURS_MONTH_VIEW, this.timeLineStartHour, this.timeLineEndHour, this.holidays);
    } else if (this.viewMode === 'Week') {

      this.rangeStartDate = this.dateUtility.getMonthStart(this.currentDate);
      this.rangeEndDate = this.dateUtility.getMonthEnd(this.currentDate);
      // console.log('init Week', this.rangeStartDate, this.rangeEndDate);
      this.gridLabels = this.service.getDayLabels(this.rangeStartDate, this.rangeEndDate, this.holidays);
      this.cells = this.service.getSelectionCells(this.hourWidth, this.viewStart, this.viewEnd, this.service.DEFAULT_SLOT_HOURS_WEEK_VIEW, this.timeLineStartHour, this.timeLineEndHour, this.holidays);

    } else if (this.viewMode === 'Day' || this.viewMode === 'Resource') {

      this.rangeStartDate = this.dateUtility.getWeekStart(this.currentDate);
      this.rangeEndDate = this.dateUtility.getWeekEnd(this.currentDate);

      this.gridLabels = this.service.getTimeLabels(this.timeLineStartHour,
        this.timeLineStartMinute,
        this.timeLineEndHour,
        this.timeLineEndMinute);
      this.cells = this.service.getSelectionCells(this.hourWidth, this.viewStart, this.viewEnd, this.service.DEFAULT_SLOT_HOURS_DAY_VIEW, this.timeLineStartHour, this.timeLineEndHour, this.holidays);
    }
    // if (emitEvent) {
    // this.rangeChange.emit({ index: 0, current: this.currentDate, weekStart: this.rangeStartDate, weekEnd: this.rangeEndDate });
    // }
    this.setEventPanelConfig();
    this.isTimeLineReady = true;
    if (this.sourceEvents.length != 0) {
      this.generateEvents();
    }
  }

  timeLineNowConfig: any;
  eventPanelConfig: any;
  private setEventPanelConfig() {
    this.eventPanelConfig = {
      viewMode: this.viewMode,
      viewStart: this.viewStart,
      viewEnd: this.viewEnd,
      startHour: this.timeLineStartHour,
      endHour: this.timeLineEndHour,
      hourWidth: this.hourWidth
    };
    this.timeLineNowConfig = {
      viewMode: this.viewMode,
      viewStart: this.viewStart,
      viewEnd: this.viewEnd,
      timeLineStartHour: this.timeLineStartHour,
      timeLineEndHour: this.timeLineEndHour,
      hourWidth: this.hourWidth
    };
  }

  generateEvents() {

    if (this.viewMode == 'Resource' && this.selectedGroup) {
      this.eventGroups = this.service.getGroupsByWeek(
        this.viewStart,
        this.events,
        this.selectedGroup.resourceID
      );

      this.eventGroups.forEach((r) => {
        r.events = this.service.updateEvents(
          this.timeLineStartHour,
          this.timeLineEndHour,
          this.viewMode,
          r.viewDate,
          r.events,
          this.hourWidth
        );
      });

    } else {
      this.eventGroups = this.service.getGroupsByResources(
        this.viewMode,
        this.viewStart,
        this.events,
        this.eventGroup
      );

      this.eventGroups.forEach((r) => {
        r.events = this.service.updateEvents(this.timeLineStartHour,
          this.timeLineEndHour,
          this.viewMode,
          this.viewStart,
          r.events,
          this.hourWidth
        );
      });
    }
  }

  updateScroll(triger: HTMLElement) {
    const scrollOne = this.eventGroupPanel.nativeElement as HTMLElement;
    const scrollTwo = this.eventPanel.nativeElement as HTMLElement;
    if (triger === scrollOne) {
      scrollTwo.scrollTop = scrollOne.scrollTop;
    } else {
      scrollOne.scrollTop = scrollTwo.scrollTop;
    }
  }

  earlyStart(event: any) {
    return this.service.isEarlyStart(this.timeLineStartHour, this.viewMode, this.viewStart, event);
  }

  lateEnd(event: any) {
    return this.service.isLateEnd(this.timeLineEndHour, this.viewMode, this.viewStart, event);
  }

  viewModeChange(mode: any) {
    this.viewMode = mode;
    this.initializeTimeline();
    this.getGridHeight();
  }

  getDateString(date: Date) {
    return this.datePipe.transform(date, 'dd MMM y HH:mm') || '';
  }

  toggleView(index: number = 1) {
    this.currentDate.setHours(0, 0, 0, 0);
    if (this.viewMode === 'Month') {
      this.currentDate.setMonth(this.currentDate.getMonth() + index, 1);
      this.initializeTimeline();
    } else if (this.viewMode === 'Week') {
      this.currentDate.setMonth(this.currentDate.getMonth() + index, 1);
      this.initializeTimeline();
    } else if (this.viewMode === 'Day') {
      this.currentDate.setDate(this.currentDate.getDate() + index);
      if ((index > 0 && this.currentDate.getDay() === 0)
        || (index < 0 && this.currentDate.getDay() === 6)) {
        //Change Week
        this.rangeStartDate = this.dateUtility.getWeekStart(this.currentDate);
        this.rangeEndDate = this.dateUtility.getWeekEnd(this.currentDate);
        this.rangeChange.emit({ index, current: this.currentDate, weekStart: this.rangeStartDate, weekEnd: this.rangeEndDate });
      } else {
        //Change Day
        this.rangeChange.emit({ index, current: this.currentDate, weekStart: this.rangeStartDate, weekEnd: this.rangeEndDate });
      }
      this.cells = this.service.getSelectionCells(
        this.hourWidth,
        this.viewStart,
        this.viewEnd,
        this.service.DEFAULT_SLOT_HOURS_DAY_VIEW,
        this.timeLineStartHour,
        this.timeLineEndHour,
        this.holidays
      );
      this.initializeTimeline();

    } else if (this.viewMode === 'Resource') {
      this.currentDate.setDate(this.currentDate.getDate() + (index * 7));
      this.rangeStartDate = this.dateUtility.getWeekStart(this.currentDate);
      this.rangeEndDate = this.dateUtility.getWeekEnd(this.currentDate);
      this.rangeChange.emit({ index, current: this.currentDate, weekStart: this.rangeStartDate, weekEnd: this.rangeEndDate });
      this.initializeTimeline();
    }
  }

  onClickResource(value: McvTimeLineEventGroup) {

    // console.log('onClickResource', value);
    if (value && value.groupType === 'resource') {
      this.selectedGroup = value;
      this.viewMode = 'Resource';
      // if (this.previousViewMode !== 'Month' && this.previousViewMode !== 'Week') {
      this.initializeTimeline();
      // }
    }

  }

  clearResourceGroup() {
    this.selectedGroup = null;
    // this.initializeTimeline(this.previousViewMode === 'Month' || !this.dateUtility.isSameDay(this.previousRangeStartDate, this.rangeStartDate));
    // if (this.previousViewMode !== 'Month' && this.dateUtility.isSameDay(this.previousRangeStartDate, this.rangeStartDate)) {
    this.initializeTimeline();
    // }
  }

  onCellSelectionEnd(e: any) {
    // tslint:disable-next-line: prefer-const
    const _group = this.eventGroups.find((x) => x.guid === e.groupID);
    if (_group && e.group) {
      // tslint:disable-next-line: prefer-const
      let _event = new McvTimeLineEvent();
      _event.title = 'NEW EVENT';
      e.subTitle = this.datePipe.transform(e.start, 'HH:mm') + '-' + this.datePipe.transform(e.end, 'HH:mm');
      _event.start = this.dateUtility.addHoursToDate(
        _group.viewDate,
        e.group.startHour
      );
      _event.end = this.dateUtility.addHoursToDate(
        _group.viewDate,
        e.group.endHour
      );
      _event.resourceID = _group.resourceID;
      const _resource = this.eventGroup.find(
        (x) => x.resourceID === _group.resourceID
      );
      if (_resource) {
        _event.resourceTitle = _resource.title;
        _event.resourceSubTitle = _resource.subTitle;
        _event.avatarUrl = _resource.avatarUrl;
      }
      this.slotSelection.emit(_event);
    }
  }

  isResizeActive: boolean = false;
  onResizeStart(e: any, event: McvTimeLineEvent) {
    this.isResizeActive = true;
  }

  onResizeEnd(e: McvElasticEvent, event: McvTimeLineEvent) {
    this.isResizeActive = false;
    // this.selectedEvent = null;

    if (event) {
      event.position = e.left;
      event.width = e.width;
      const group = this.selectedGroup
        ? this.eventGroups.find((x) =>
          this.dateUtility.isSameDay(x.viewDate, event.start)
        )
        : this.eventGroups.find(
          (x) => x.resourceID.toString() === event.resourceID.toString()
        );
      if (group) {
        // tslint:disable-next-line: prefer-const
        let start = new Date(event.start);
        start.setTime(
          group.viewDate.getTime() +
          (e.left / this.hourWidth) * 60 * 60 * 1000
        );
        event.start = start;

        // tslint:disable-next-line: prefer-const
        let end = new Date(event.end);
        end.setTime(
          group.viewDate.getTime() +
          ((e.left + e.width) / this.hourWidth) *
          60 *
          60 *
          1000
        );
        event.end = end;

        this.service.setEventOverlap(group.events);
      }
      this.updateEvent(event);
    }
  }

  onEventClick(e: Event, event: McvTimeLineEvent) {
    e.stopPropagation();
    this.eventClick.emit(event);
  }

  onDrag(group: McvTimeLineEventGroup, event: McvTimeLineEvent) {
  }

  onDrop(dropGroup: McvTimeLineEventGroup, event: McvTimeLineEvent) {
    // Week view
    if (this.selectedGroup) {
      const group = this.eventGroups.find((x) =>
        this.dateUtility.isSameDay(x.viewDate, event.start)
      );
      if (group) {
        group.events = group.events.filter((x) => x.guid !== event.guid);
        this.service.setEventOverlap(group.events);
      }

      // tslint:disable-next-line: prefer-const
      let start = new Date(dropGroup.viewDate);
      start.setHours(
        new Date(event.start).getHours(),
        new Date(event.start).getMinutes(),
        0,
        0
      );
      // tslint:disable-next-line: prefer-const
      let end = new Date(dropGroup.viewDate);
      end.setHours(
        new Date(event.end).getHours(),
        new Date(event.end).getMinutes(),
        0,
        0
      );

      event.start = start;
      event.end = end;
    } else {
      const group = this.eventGroups.find(
        (x) => x.resourceID.toString() === event.resourceID.toString()
      );
      if (group) {
        group.events = group.events.filter((x) => x.guid !== event.guid);
        this.service.setEventOverlap(group.events);
      }

      event.resourceID = dropGroup.resourceID;
      event.resourceTitle = dropGroup.title;
      event.resourceSubTitle = dropGroup.subTitle;
      event.avatarUrl = dropGroup.avatarUrl;
    }

    dropGroup.events.push(event);
    this.service.setEventOverlap(dropGroup.events);

    this.updateEvent(event);
  }

  updateEvent(event: McvTimeLineEvent) {
    this.eventUpdate.emit(event);
  }

  onGroupHeightChange(e: any) {
    this.eventGroupHeightChange.emit(e);
    this.getGridHeight();
  }

  private getGridHeight() {
    if (this.gridRows) {
      const gridHeight = this.gridHeader ?
        this.gridHeader.nativeElement.getBoundingClientRect().height + this.gridRows.nativeElement.getBoundingClientRect().height + 54 :
        this.gridRows.nativeElement.getBoundingClientRect().height + 54;
      this.gridHeightChange.emit(gridHeight);
    }
  }

  allowEventResize(event: McvTimeLineEvent): boolean {
    return event.editMode !== 'none';
    // && this.selectedEvent && this.selectedEvent.guid === event.guid;
  }

  getEventHeight(event: McvTimeLineEvent, events: McvTimeLineEvent[]): number {
    if (events && events.length !== 0 && Math.max.apply(Math, events.map((o) => o.rowIndex)) !== 0) {
      return this.eventHeightSlim;
    }
    return this.eventHeight;
  }

  getEventTop(event: McvTimeLineEvent, events: McvTimeLineEvent[]) {
    return event.rowIndex * this.getEventHeight(event, events);
  }

  getChildPosition(event: McvTimeLineEvent, child: McvTimeLineEvent) {
    return child.position - event.position;
  }

  getChildEventTop(event: McvTimeLineEvent, events: McvTimeLineEvent[]) {
    return 0 + 3;
    // return this.getEventHeight(event,events)-(this.eventHeightSlim/2);
  }

  getChildEventHeight(event: McvTimeLineEvent, events: McvTimeLineEvent[]): number {
    return this.getEventHeight(event, events) - 6;
    // return this.eventHeightSlim/2;
  }

  onClickToday() {
    this.setEventPanelConfig();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.initializeTimeline();
  }

  private setHourWidth() {
    let _defaultHourWidth = 1;
    if (this.viewMode == 'Day' || this.viewMode == 'Resource') {
      _defaultHourWidth = this.service.DEFAULT_HOUR_WIDTH_DAY_VIEW;
    } else if (this.viewMode == 'Week') {
      _defaultHourWidth = this.service.DEFAULT_HOUR_WIDTH_WEEK_VIEW;
    } else if (this.viewMode == 'Month') {
      _defaultHourWidth = this.service.DEFAULT_HOUR_WIDTH_MONTH_VIEW
    }

    if (this.eventPanel) {
      const _panelWidth = (this.eventPanel.nativeElement as HTMLElement).offsetWidth;
      const _totalHours = this.timeLineEndHour - this.timeLineStartHour;
      const _hourWidth = Math.floor(_panelWidth / _totalHours);
      if (this.viewMode == 'Day' || this.viewMode == 'Resource') {
        if (_defaultHourWidth < _hourWidth) {
          _defaultHourWidth = _hourWidth;
        }
      }
    }

    this.hourWidth = _defaultHourWidth;
    this.dayWidth = _defaultHourWidth * (this.timeLineEndHour - this.timeLineStartHour);
    if (this.viewMode == 'Day' || this.viewMode == 'Resource') {
      this.slotWidth = _defaultHourWidth * this.service.DEFAULT_SLOT_HOURS_DAY_VIEW;
    } else if (this.viewMode == 'Week') {
      this.slotWidth = _defaultHourWidth * this.service.DEFAULT_SLOT_HOURS_WEEK_VIEW;
    } else if (this.viewMode == 'Month') {
      this.slotWidth = _defaultHourWidth * this.service.DEFAULT_SLOT_HOURS_MONTH_VIEW;
    }
  }
}

