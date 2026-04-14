import { Injectable } from "@angular/core";
import { DatePipe } from "@angular/common";

import * as uuid from 'uuid';
import { Observable, Subject } from "rxjs";

import { McvTimeLineCell } from "../model/mcv-time-line-cell";
import { McvTimeLineEvent } from "../model/mcv-time-line-events";
import { McvTimeLineHoliday } from "../model/mcv-time-line-holiday";
import { McvTimeLineEventGroup } from "../model/mcv-time-line-event-group";
import { McvTimeLineDateUtilityService } from "./mcv-time-line-date-utility.service";


@Injectable({
  providedIn: 'root'
})
export class McvTimeLineService {
  readonly DEFAULT_VIEW_MODE = 'Day';
  readonly DEFAULT_SLOT_HOURS_DAY_VIEW = 0.25;
  readonly DEFAULT_SLOT_HOURS_MONTH_VIEW = 1;
  readonly DEFAULT_SLOT_HOURS_WEEK_VIEW = 1;
  readonly DEFAULT_HOUR_WIDTH_DAY_VIEW = 96;
  readonly DEFAULT_HOUR_WIDTH_MONTH_VIEW = 12;
  readonly DEFAULT_HOUR_WIDTH_WEEK_VIEW = 24;
  readonly DEFAULT_START_HOUR = 0;
  readonly DEFAULT_END_HOUR = 24;
  readonly DEFAULT_EVENT_HEIGHT = 46;
  readonly DEFAULT_EVENT_HEIGHT_SLIM = 24;

  private _selectedCells: McvTimeLineCell[] = [];
  get selectedCells(): McvTimeLineCell[] {
    return this._selectedCells;
  }
  get selectedCellGroup(): McvTimeLineCell | null {
    if (this._selectedCells.length === 0) {
      return null;
    }
    const _last = this._selectedCells[this._selectedCells.length - 1];
    return {
      id: this._selectedCells[0].id,
      startHour: this._selectedCells[0].startHour,
      endHour: _last.endHour,
      start: this._selectedCells[0].start,
      end: _last.end,
      groupID: this._selectedCells[0].groupID,
      isHoliday: false,
      width: 0
    };
  }

  private _isCellSelectionActive: boolean = false;
  get isCellSelectionActive(): boolean {
    return this._isCellSelectionActive;
  }

  private clearCellSelectionSubject: Subject<boolean> = new Subject<boolean>();
  public clearCellSelection: Observable<boolean> = this.clearCellSelectionSubject.asObservable();

  // private activeGroupSubject: Subject<McvTimeLineEventGroup> = new Subject<McvTimeLineEventGroup>();
  // public activeGroup: Observable<McvTimeLineEventGroup> = this.activeGroupSubject.asObservable();


  constructor(
    private datePipe: DatePipe,
    private dateUtility: McvTimeLineDateUtilityService
  ) { }

  startCellSelection(cellData: McvTimeLineCell) {
    this._selectedCells = [];
    this._isCellSelectionActive = true;
    this.addSelectionCell(cellData);
  }

  stopCellSelection() {
    this._isCellSelectionActive = false;
    this.clearCellSelectionSubject.next(true);
  }

  addSelectionCell(cellData: McvTimeLineCell) {
    if (!this._selectedCells.find(x => x.id === cellData.id)) {
      this._selectedCells.push(cellData);
      this._selectedCells = this._selectedCells.sort((a, b) => a.id - b.id);
    }
  }

  getSnapWidth(value: number, snap: number = 1) {
    return Math.ceil(value / snap) * snap;
  }

  getTimeLabels(startHour: number, startMinute: number, endHour: number, endMinutes: number): any[] {
    // tslint:disable-next-line: prefer-const
    let result = [];
    let hour = startHour;
    const end = endHour >= 23 && endMinutes > 0 ? 24 : endHour;
    let i = 0;
    while (hour <= end) {
      const obj = {
        index: i,
        label: this.dateUtility.numberToString(hour < 24 ? hour : 0, 2) + ':00',
      };
      result.push(obj);
      i++;
      hour++;
    }
    return result;
  }

  getDayLabels(startDate: Date, endDate: Date, holidays: McvTimeLineHoliday[] = []): any[] {
    // tslint:disable-next-line: prefer-const
    let result = [];
    // tslint:disable-next-line: prefer-const
    let start = new Date(startDate);
    // tslint:disable-next-line: prefer-const
    let end = new Date(endDate);
    end.setDate(end.getDate() + 1);
    let i = 0;
    while (start <= end) {
      const holiday = holidays.find(x => this.dateUtility.isSameDay(x.date, start));
      const obj = {
        index: i,
        label: start < end ? this.datePipe.transform(start, 'EE, dd') : '',
        isHoliday: start.getDay() === 0 || (holiday ? true : false),
        holidayTitle: holiday?.title
      };
      result.push(obj);
      i++;
      start.setDate(start.getDate() + 1);
    }
    return result;
  }

  getSelectionCells(width: number, start: Date, end: Date, slotHour: number, startHour: number = 0, endHour: number = 24, holidays: McvTimeLineHoliday[] = []): McvTimeLineCell[] {
    // tslint:disable-next-line: prefer-const
    let result: McvTimeLineCell[] = [];
    let i = 0;
    let cellStartHour = startHour;  //start.getHours();
    let cellStartDate = new Date(start);
    cellStartDate.setHours(startHour, 0, 0, 0);
    let cellEndDate = new Date(end);
    cellEndDate.setHours(endHour, 0, 0, 0);
    while (cellStartDate < cellEndDate) {
      const holiday = holidays.find(x => this.dateUtility.isSameDay(x.date, cellStartDate));
      let _cell = {
        startHour: cellStartHour,
        endHour: cellStartHour + slotHour,
        start: cellStartDate,
        end: this.dateUtility.addHoursToDate(cellStartDate, slotHour, true),
        id: i,
        groupID: 0,
        isHoliday: cellStartDate.getDay() === 0 || (holiday ? true : false),
        width: width * slotHour
      };
      result.push(_cell);
      // console.log("cell",_cell);
      if (_cell.endHour < endHour) {
        cellStartHour = cellStartHour + slotHour;
        cellStartDate = this.dateUtility.addHoursToDate(cellStartDate, slotHour, true);
      } else {
        cellStartHour = startHour;
        cellStartDate.setDate(cellStartDate.getDate() + 1);
        cellStartDate.setHours(startHour);
      }
      i++;
    }
    return result;
  }

  private groupBy(array: any, key: any) {
    // Return the end result
    return array.reduce((result: any, currentValue: any) => {
      // If an array already present for key, push it to the array. Else create an array and push the object
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      );
      // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
      return result;
    }, {}); // empty object is the initial value for result object
  }

  getEventsSplitByDay(viewStart: Date, viewEnd: Date, events: McvTimeLineEvent[]): McvTimeLineEvent[] {
    const viewStartHours = viewStart.getHours();
    const viewEndHours = viewEnd.getHours();
    // tslint:disable-next-line: prefer-const
    let result: McvTimeLineEvent[] = [];
    events.forEach(x => {
      result.push(...this.getEventSplitByDay(viewStart, viewEnd, x));
    });
    // console.log('dailyevents',dailyEvents.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()));
    return result.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  }

  getEventSplitByDay(viewStart: Date, viewEnd: Date, event: McvTimeLineEvent) {
    const viewStartHours = viewStart.getHours();
    const viewEndHours = viewEnd.getHours();
    // tslint:disable-next-line: prefer-const
    let result: McvTimeLineEvent[] = [];

    // tslint:disable-next-line: prefer-const
    let start = new Date(event.start);
    start.setHours(0, 0, 0, 0);
    // tslint:disable-next-line: prefer-const
    let end = new Date(event.end);
    end.setHours(0, 0, 0, 0);
    // console.log('end',end,new Date(x.end));
    if (end.getTime() == (new Date(event.end)).getTime()) {
      end.setDate(end.getDate() - 1);
      end.setHours(0, 0, 0, 0);
    }

    if (start.getTime() < end.getTime()) {
      // tslint:disable-next-line: prefer-const
      let firstEvent = Object.assign({}, event);
      firstEvent.guid = this.generateGUID();
      firstEvent.start = new Date(event.start);
      // tslint:disable-next-line: prefer-const
      let firstEnd = new Date(start);
      if (viewEndHours === 0) {
        // firstEnd.setDate(firstEnd.getDate() + 1);
        firstEnd.setHours(23, 59, 0, 0);
      } else {
        firstEnd.setHours(viewEndHours);
      }
      firstEvent.end = new Date(firstEnd);
      firstEvent.moveDirection = 'horizontal';
      firstEvent.resizeDirection = 'both';
      result.push(firstEvent);
      start.setDate(start.getDate() + 1);

      while (start.getTime() < end.getTime()) {
        // tslint:disable-next-line: prefer-const
        let midEvent = Object.assign({}, event);
        midEvent.guid = this.generateGUID();
        midEvent.editMode = 'none';
        // tslint:disable-next-line: prefer-const
        let midStart = new Date(start);
        midStart.setHours(viewStartHours);
        midEvent.start = new Date(midStart);

        // tslint:disable-next-line: prefer-const
        let midEnd = new Date(start);
        if (viewEndHours === 0) {
          //midEnd.setDate(midEnd.getDate() + 1);
          midEnd.setHours(23, 59, 0, 0);
        } else {
          midEnd.setHours(viewEndHours);
        }
        midEvent.end = new Date(midEnd);
        midEvent.moveDirection = 'horizontal';
        midEvent.resizeDirection = 'both';
        result.push(midEvent);
        start.setDate(start.getDate() + 1);
      }

      // tslint:disable-next-line: prefer-const
      let lastEvent = Object.assign({}, event);
      lastEvent.guid = this.generateGUID();
      // tslint:disable-next-line: prefer-const
      let lastStart = new Date(start);
      lastStart.setHours(viewStartHours);
      lastEvent.start = new Date(lastStart);
      lastEvent.end = new Date(event.end);
      lastEvent.moveDirection = 'horizontal';
      lastEvent.resizeDirection = 'both';
      if (lastEvent.start < lastEvent.end) {
        result.push(lastEvent);
      }
    }
    else {
      result.push(event);
    }

    // console.log('dailyevents',dailyEvents.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()));
    return result.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  }

  getEventsSplitByMonth(viewStart: Date, viewEnd: Date, events: McvTimeLineEvent[]): McvTimeLineEvent[] {
    const viewStartHours = viewStart.getHours();
    const viewEndHours = viewEnd.getHours();
    // tslint:disable-next-line: prefer-const
    let result: McvTimeLineEvent[] = [];
    events.forEach(x => {
      // tslint:disable-next-line: prefer-const
      let start = new Date(x.start);
      start.setHours(0, 0, 0, 0);
      // tslint:disable-next-line: prefer-const
      let end = new Date(x.end);
      end.setHours(0, 0, 0, 0);

      if (start.getMonth() < end.getMonth()) {
        // console.log('monthCheck',new Date(start),new Date(end));
        // tslint:disable-next-line: prefer-const
        let firstEvent = Object.assign({}, x);
        firstEvent.guid = this.generateGUID();
        firstEvent.start = new Date(x.start);
        // tslint:disable-next-line: prefer-const
        let firstEnd = this.dateUtility.getMonthEnd(start);
        firstEnd.setDate(firstEnd.getDate() + 1);// to set 00:00 for nextday as endtime
        firstEnd.setHours(0, 0, 0, 0);
        firstEvent.end = new Date(firstEnd);
        firstEvent.moveDirection = 'horizontal';
        firstEvent.resizeDirection = 'both';
        result.push(firstEvent);
        // console.log('firstEvent',new Date(firstEvent.start),new Date(firstEvent.end));
        start.setMonth(start.getMonth() + 1, 1);

        while (start.getMonth() < end.getMonth()) {
          // tslint:disable-next-line: prefer-const
          let midEvent = Object.assign({}, x);
          midEvent.guid = this.generateGUID();
          midEvent.editMode = 'none';
          // tslint:disable-next-line: prefer-const
          let midStart = this.dateUtility.getMonthStart(start);
          midStart.setHours(0, 0, 0, 0);
          midEvent.start = new Date(midStart);

          // tslint:disable-next-line: prefer-const
          let midEnd = this.dateUtility.getMonthEnd(start);
          midEnd.setDate(midEnd.getDate() + 1);// to set 00:00 for nextday as endtime
          midEnd.setHours(0, 0, 0, 0);
          midEvent.end = new Date(midEnd);
          midEvent.moveDirection = 'horizontal';
          midEvent.resizeDirection = 'both';
          result.push(midEvent);
          // console.log('midEvent',new Date(midEvent.start),new Date(midEvent.end));
          start.setMonth(start.getMonth() + 1, 1);
        }

        // tslint:disable-next-line: prefer-const
        let lastEvent = Object.assign({}, x);
        lastEvent.guid = this.generateGUID();
        // tslint:disable-next-line: prefer-const
        let lastStart = this.dateUtility.getMonthStart(start);
        lastStart.setHours(0, 0, 0, 0);
        lastEvent.start = new Date(lastStart);
        lastEvent.end = new Date(x.end);
        lastEvent.moveDirection = 'horizontal';
        lastEvent.resizeDirection = 'both';
        if (lastEvent.start < lastEvent.end) {

          const _splitsByday = this.getEventsSplitByDay(viewStart, viewEnd, [lastEvent]);
          lastEvent.start = _splitsByday[0].start;
          lastEvent.end = _splitsByday[_splitsByday.length - 1].end;
          result.push(lastEvent);

        }
      }
      else {
        const _splitsByday = this.getEventsSplitByDay(viewStart, viewEnd, [x]);
        x.start = _splitsByday[0].start;
        x.end = _splitsByday[_splitsByday.length - 1].end;
        result.push(x);
      }

    });
    return result.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  }

  generateGUID() {
    return uuid.v4();
  }



  getGroupsByWeek(viewDate: Date, events: McvTimeLineEvent[], resourceID: any): McvTimeLineEventGroup[] {
    // tslint:disable-next-line: prefer-const
    let filteredEvents = events.filter(x =>
      x.resourceID.toString() === resourceID.toString()
      && this.dateUtility.isSameDay(x.end, x.start)
    )
      .map(x => {
        return Object.assign({}, x);
      });

    let children: McvTimeLineEvent[] = [];
    filteredEvents.forEach(x => children = children.concat(x.children));
    filteredEvents = filteredEvents.filter(x => !children.find(c => c.entity === x.entity && c.id === x.id));

    const dates = this.dateUtility.getWeekDates(viewDate);
    // tslint:disable-next-line: prefer-const
    let eventGroups: McvTimeLineEventGroup[] = [];
    const dateFormat = new Intl.DateTimeFormat('en-IN', { weekday: 'long' });
    dates.forEach((value: any) => {
      // tslint:disable-next-line: prefer-const
      let d = new Date(value);
      d.setHours(viewDate.getHours(), viewDate.getMinutes(), 0, 0);
      let r = eventGroups.find(x => x.viewDate === d);
      if (!r) {
        r = new McvTimeLineEventGroup();
        r.groupType = 'week';
        r.title = dateFormat.format(d);
        r.subTitle = this.datePipe.transform(d, 'dd MMM y') as string;
        r.avatarUrl = '';
        r.resourceID = resourceID;
        r.events = filteredEvents.filter(x => this.dateUtility.isSameDay(x.start, d));
        r.viewDate = d;
        eventGroups.push(r);
      }
    });
    return eventGroups.sort((a, b) => a.viewDate.getTime() - a.viewDate.getTime());
  }


  getGroupsByResources(
    viewMode: 'Day' | 'Resource' | 'Month' | 'Week',
    viewDate: Date, events: McvTimeLineEvent[],
    resources?: McvTimeLineEventGroup[]): McvTimeLineEventGroup[] {

    // tslint:disable-next-line: prefer-const
    let filteredEvents: any[] = [];
    if (viewMode === 'Month') {
      filteredEvents = events.filter(x => this.dateUtility.isSameMonth(viewDate, x.start))
        .map(x => {
          x.children = x.children.filter(c => this.dateUtility.isSameMonth(viewDate, c.start));
          return Object.assign({}, x);
        });
    } else if (viewMode === 'Week') {
      filteredEvents = events.filter(x => this.dateUtility.isSameMonth(viewDate, x.start))
        .map(x => {
          x.children = x.children.filter(c => this.dateUtility.isSameMonth(viewDate, c.start));
          return Object.assign({}, x);
        });
    } else if (viewMode === 'Day') {
      filteredEvents = events.filter(x => this.dateUtility.isSameDay(viewDate, x.start))
        .map(x => {
          x.children = x.children.filter(c => this.dateUtility.isSameDay(viewDate, c.start));
          return Object.assign({}, x);
        });
    } else {
      filteredEvents = events.filter(x => this.dateUtility.isSameDay(viewDate, x.start))
        .map(x => {
          x.children = x.children.filter(c => this.dateUtility.isSameDay(viewDate, c.start));
          return Object.assign({}, x);
        });
    }
    let children: McvTimeLineEvent[] = [];
    filteredEvents.forEach(x => children = children.concat(x.children));
    filteredEvents = filteredEvents.filter(x => !children.find(c => c.entity === x.entity && c.id === x.id));

    // tslint:disable-next-line: prefer-const
    let eventGroups: McvTimeLineEventGroup[] = resources ? resources : [];

    // initialize groups per resource
    eventGroups.forEach(x => {
      x.groupType = 'resource';
      x.viewDate = viewDate;
      x.events = filteredEvents.filter(e => e.resourceID.toString() === x.resourceID.toString());
    });

    // console.log('groups',eventGroups);
    // filteredEvents.forEach(e => {
    //   let group = eventGroups.find(x => x.resourceID.toString() === e.resourceID.toString());
    //   if (!group) {
    //     group = new McvTimeLineEventGroup();
    //     group.groupType = 'resource';
    //     group.viewDate = viewDate;
    //     group.events = filteredEvents.filter(x => x.resourceID.toString() === e.resourceID.toString());
    //     group.resourceID = e.resourceID;
    //     group.title = e.resourceTitle;
    //     group.subTitle = e.resourceSubTitle;
    //     group.avatarUrl = e.avatarUrl;
    //     eventGroups.push(group);
    //   }
    // });

    return eventGroups.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ? 1 : -1);

  }

  get testEvents() {
    const resources = [
      {
        id: '1', title: 'Professor', subtitle: 'Master'
      },
      {
        id: '2', title: 'Berlin', subtitle: 'Leader'
      },
      {
        id: '3', title: 'Denver', subtitle: 'Controller'
      },
      {
        id: '4', title: 'Moscov', subtitle: 'Miner'
      },
      {
        id: '5', title: 'Oslo', subtitle: 'Defender'
      },
      {
        id: '6', title: 'Helsinki', subtitle: 'Defender'
      },
      {
        id: '7', title: 'Nairobi', subtitle: 'Manager'
      },
      {
        id: '8', title: 'Tokyo', subtitle: 'Member'
      }
    ];
    // tslint:disable-next-line: prefer-const
    let events: any[] = [];
    resources.forEach(resource => {
      let index = 1;
      while (index <= 40) {
        // tslint:disable-next-line: prefer-const
        let event = new McvTimeLineEvent();
        event.id = index.toString();
        event.title = 'Task ' + this.dateUtility.numberToString(index, 2);
        event.subTitle = 'Time is what we need';
        event.resourceID = resource.id;
        event.resourceTitle = resource.title;
        event.resourceSubTitle = resource.subtitle;
        event.avatarUrl = 'assets/images/dali-avatar.png';
        // tslint:disable-next-line: prefer-const
        let date = new Date();
        date.setDate(date.getDate() + this.dateUtility.getRandomInt(-7, 7));
        // tslint:disable-next-line: prefer-const
        let start = this.dateUtility.setTimeFromString(date, this.dateUtility.getRandomInt(9, 14) + ':' + this.dateUtility.getRandomInt(0, 60));
        event.start = new Date(start);
        start.setHours(start.getHours() + this.dateUtility.getRandomInt(1, 4));
        event.end = new Date(start);
        event.actualStart = event.start;
        event.actualEnd = event.end;
        event.editMode = 'both';
        events.push(event);
        index++;
      }
    });
    return events;
  }

  updateEvents(
    timeLineStartHour: number,
    timeLineEndHour: number,
    viewMode: 'Day' | 'Resource' | 'Month' | 'Week',
    viewDate: Date,
    events: McvTimeLineEvent[],
    hourWidth: number
  ): McvTimeLineEvent[] {
    let result = this.setEventPositions(timeLineStartHour, timeLineEndHour, viewMode, viewDate, events, hourWidth);
    result = this.setEventOverlap(result);
    return result.map(c => Object.assign({}, c));
  }

  private setEventPositions(
    timeLineStartHour: number,
    timeLineEndHour: number,
    viewMode: 'Day' | 'Resource' | 'Month' | 'Week',
    viewDate: Date,
    events: McvTimeLineEvent[],
    hourWidth: number
  ): McvTimeLineEvent[] {
    events.forEach(x => {
      x.position = this.getEventPosition(timeLineStartHour, timeLineEndHour, viewMode, viewDate, x, hourWidth);
      x.width = this.getEventWidth(x.position, timeLineStartHour, timeLineEndHour, viewMode, viewDate, x, hourWidth) as number;
      x.children = this.setEventPositions(timeLineStartHour, timeLineEndHour, viewMode, viewDate, x.children, hourWidth).map(c => Object.assign({}, c));
      // console.log('eventPosition', x.position, x.width, x);
    });
    return events.map(c => Object.assign({}, c));
  }


  private getEventPosition(
    timeLineStartHour: number,
    timeLineEndHour: number,
    viewMode: 'Day' | 'Resource' | 'Month' | 'Week',
    viewDate: Date,
    event: McvTimeLineEvent,
    hourWidth: number
  ) {


    if (viewMode === "Day" || viewMode == 'Resource') {
      let _viewStart = new Date(viewDate);
      _viewStart.setHours(timeLineStartHour, 0, 0, 0);
      if (this.dateUtility.isSameDay(event.start, _viewStart)) { //if event starts on same day
        let _hourDifference = this.dateUtility.getHoursBetween(_viewStart, event.start);
        return (_hourDifference * hourWidth);
      }
    }
    else if (viewMode === 'Week' || viewMode === 'Month') {
      let _viewStart = new Date(viewDate);
      _viewStart.setHours(timeLineStartHour, 0, 0, 0);

      if (this.dateUtility.isSameMonth(event.start, _viewStart)) {


        let _eventStart = new Date(event.start);
        let _dayStart = new Date(event.start);
        _dayStart.setHours(timeLineStartHour, 0, 0, 0);

        let _dayEnd = new Date(_eventStart);
        _dayEnd.setHours(timeLineEndHour, 0, 0, 0);

        if (_eventStart.getTime() > _dayEnd.getTime()) {
          _eventStart.setDate(_eventStart.getDate() + 1);
          _eventStart.setHours(timeLineStartHour, 0, 0, 0);
        } else if (_eventStart.getTime() < _dayStart.getTime()) {
          _eventStart = new Date(_dayStart);
        }

        let _differenceInDays = 0;
        if (_eventStart.getTime() > new Date(_viewStart).getTime()) {
          _differenceInDays = Math.floor((_eventStart.getTime() - new Date(_viewStart).getTime()) / (1000 * 60 * 60 * 24));
        }

        let _differenceInHours = _differenceInDays * (timeLineEndHour - timeLineStartHour);
        let _eventDayStart = new Date(_eventStart);
        _eventDayStart.setHours(timeLineStartHour, 0, 0, 0);

        _differenceInHours += this.dateUtility.getHoursBetween(_eventDayStart, _eventStart);
        return viewMode === 'Week' ? _differenceInHours * hourWidth : _differenceInHours * hourWidth;
      }
    }

    return 0;
  }

  private getEventWidth(position: number, timeLineStartHour: number, timeLineEndHour: number, viewMode: 'Day' | 'Resource' | 'Month' | 'Week', viewDate: Date, event: McvTimeLineEvent, hourWidth: number) {
    let _viewStart = new Date(viewDate);
    _viewStart.setHours(timeLineStartHour, 0, 0, 0);
    let _viewEnd = new Date(viewDate);
    _viewEnd.setHours(timeLineEndHour, 0, 0, 0);

    if (viewMode === "Day" || viewMode == 'Resource') {
      if (event && this.dateUtility.isSameDay(event.start, _viewStart)) {
        let _clipStart = new Date(event.start);
        let _clipEnd = new Date(event.end);
        let _newClipEnd = new Date(event.end);
        // let _dayClipEnd = new Date(_clipEnd.setHours(endHour, 0, 0, 0));
        let _dayClipStart = new Date(_clipStart);
        _dayClipStart.setHours(timeLineStartHour, 0, 0, 0);
        let _dayClipEnd = new Date(_clipEnd);
        _dayClipEnd.setHours(timeLineEndHour, 0, 0, 0);
        if (_clipStart.getDate() == _clipEnd.getDate()) {
          if (_newClipEnd.getTime() > _dayClipEnd.getTime()) {
            _newClipEnd.setHours(timeLineEndHour, 0, 0, 0);
          }
          if (_clipStart.getTime() < _dayClipStart.getTime()) {
            _clipStart.setHours(timeLineStartHour, 0, 0, 0);
          }
        }
        const width = this.dateUtility.getHoursBetween(_clipStart, _newClipEnd) * hourWidth;
        return width;
        // const width = this.dateUtility.getHoursBetween(event.start, event.end) * this.DEFAULT_HOUR_WIDTH_DAY_VIEW;
      }
      return 0;
    }
    else if (viewMode === 'Week' || viewMode === 'Month') {
      let _viewStart = new Date(viewDate);
      _viewStart.setHours(timeLineStartHour, 0, 0, 0);

      if (this.dateUtility.isSameMonth(event.start, _viewStart) || this.dateUtility.isSameMonth(event.end, _viewStart)) {

        var _startPosition = this.getEventPosition(timeLineStartHour, timeLineEndHour, viewMode, viewDate, event, hourWidth);

        let _eventStart = new Date(event.start);
        let _startDayEnd = new Date(_eventStart);
        _startDayEnd.setHours(timeLineEndHour, 0, 0, 0);

        if (_eventStart.getTime() > _startDayEnd.getTime()) {
          _eventStart.setDate(_eventStart.getDate() + 1);
          _eventStart.setHours(timeLineStartHour, 0, 0, 0);
        }

        // console.log('eventStart', _eventStart);

        let _eventEnd = new Date(event.end);

        let _endDayStart = new Date(event.end);
        _endDayStart.setHours(timeLineStartHour, 0, 0, 0);

        let _endDayEnd = new Date(event.end);
        _endDayEnd.setHours(timeLineEndHour, 0, 0, 0);

        if (_eventEnd.getTime() < _endDayStart.getTime()) {

          _eventEnd.setDate(_eventEnd.getDate() - 1);
          _eventEnd.setHours(timeLineEndHour, 0, 0, 0);
          // console.log('earlyStart', _eventEnd);
        } else if (_eventEnd.getTime() > _endDayEnd.getTime()) {

          _eventEnd = new Date(_endDayEnd);
          // console.log('lateStart', _eventEnd, event.end);
        }



        let _differenceInDays = 0;
        if (_eventEnd.getTime() > new Date(_viewStart).getTime()) {
          _differenceInDays = Math.floor((_eventEnd.getTime() - new Date(_viewStart).getTime()) / (1000 * 60 * 60 * 24));
        }

        let _differenceInHours = _differenceInDays * (timeLineEndHour - timeLineStartHour);
        _differenceInHours += this.dateUtility.getHoursBetween(_endDayStart, _eventEnd);
        // console.log('_differenceInDays', _differenceInDays, _differenceInHours);
        return viewMode === 'Week' ? (_differenceInHours * hourWidth) - _startPosition :
          (_differenceInHours * hourWidth) - _startPosition;
      }
    }
    return 0;
  }


  //Position of the arrow
  isEarlyStart(startHour: number,
    viewMode: 'Day' | 'Resource' | 'Month' | 'Week',
    viewDate: Date,
    event: McvTimeLineEvent
  ): boolean {
    let _viewStart = new Date(viewDate);
    _viewStart.setHours(startHour, 0, 0, 0);

    if (viewMode === 'Month') {
      if (event && this.dateUtility.isSameMonth(event.start, _viewStart)) {
        let _clipStart = new Date(event.start);
        let _setCurrentEventTime = new Date(_clipStart);
        _setCurrentEventTime.setHours(startHour, 0, 0, 0);
        if (_clipStart >= _setCurrentEventTime) {
          return true;
        }
      }
    } else if (viewMode === 'Week') {
      if (event && this.dateUtility.isSameMonth(event.start, _viewStart)) {
        let _clipStart = new Date(event.start);
        let _setCurrentEventTime = new Date(_clipStart);
        _setCurrentEventTime.setHours(startHour, 0, 0, 0);
        if (_clipStart >= _setCurrentEventTime) {
          return true;
        }
      }
    } else if (viewMode === "Day" || viewMode == 'Resource') {
      if (event && this.dateUtility.isSameDay(event.start, _viewStart)) {
        let _clipStart = new Date(event.start);
        let _setCurrentEventDate = new Date(_clipStart);
        _setCurrentEventDate.setHours(startHour, 0, 0, 0);
        if (_clipStart >= _setCurrentEventDate) {
          return true;
        }
      }
    }
    return false;
  }

  isLateEnd(endHour: number, viewMode: 'Day' | 'Resource' | 'Month' | 'Week', viewDate: Date, event: McvTimeLineEvent): boolean {
    let _viewEnd = new Date(viewDate);
    _viewEnd.setHours(endHour, 0, 0, 0);

    if (viewMode === 'Month') {
      if (event && this.dateUtility.isSameMonth(event.end, _viewEnd)) {
        let _clipEnd = new Date(event.end);
        let _setCurrentEventTime = new Date(_clipEnd);
        _setCurrentEventTime.setHours(endHour, 0, 0, 0);
        if (_clipEnd <= _setCurrentEventTime) {
          return true;
        }
      }
    } else if (viewMode === 'Week') {
      if (event && this.dateUtility.isSameMonth(event.end, _viewEnd)) {
        let _clipEnd = new Date(event.end);
        let _setCurrentEventTime = new Date(_clipEnd);
        _setCurrentEventTime.setHours(endHour, 0, 0, 0);
        if (_clipEnd <= _setCurrentEventTime) {
          return true;
        }
      }
    } else if (viewMode === "Day" || viewMode == 'Resource') {
      if (event && this.dateUtility.isSameDay(event.end, _viewEnd)) {
        let _clipEnd = new Date(event.end);
        let _setCurrentEventDate = new Date(_clipEnd);
        _setCurrentEventDate.setHours(endHour, 0, 0, 0);
        if (_clipEnd <= _setCurrentEventDate) {
          return true;
        }
      }
    }
    return false;
  }

  setEventOverlap(events: McvTimeLineEvent[]): McvTimeLineEvent[] {
    events.forEach((e) => {
      e.isOverlapped = false;
      e.rowIndex = 0;
    });
    // events=events.sort((a, b) => a.start.getTime() - b.start.getTime());
    let overlappingEvents = this.getOverlappingEvents(events);
    let index = 0;
    while (overlappingEvents.length > 0) {
      index++;
      overlappingEvents.forEach((x) => {
        x.isOverlapped = true;
        x.rowIndex = index;
      });
      overlappingEvents = this.getOverlappingEvents(overlappingEvents);
    }

    return events;
  }

  private getOverlappingEvents(events: McvTimeLineEvent[]): McvTimeLineEvent[] {
    // tslint:disable-next-line: prefer-const
    let result: McvTimeLineEvent[] = [];
    events.forEach((event) => {
      if (!result.find((r) => r.guid === event.guid)) {
        const overlapped = events.filter(
          (x) =>
            x.guid !== event.guid &&
            !result.find((r) => r.guid === x.guid) &&
            ((x.position === event.position) // same same
              || (x.position + x.width === event.position + event.width) // same end
              || (x.position < event.position && x.position + x.width > event.position + event.width)  // inside
              || (x.position > event.position && x.position + x.width < event.position + event.width)  // outside
              || (x.position < event.position && x.position + x.width > event.position) // start overlapp
              || (x.position > event.position && x.position < event.position + event.width) // end overlapp
            )
        );
        if (overlapped && overlapped.length !== 0) {
          overlapped.forEach((over) => {
            if (!result.find((x) => x.guid === over.guid)) {
              result.push(over);
            }
          });
        }
      }
    });
    return result;
  }
}
