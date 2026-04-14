import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CalendarOptions, EventInput, EventMountArg } from '@fullcalendar/core';
import { LeaveApiService } from '../../services/leave-api.service';
import { HolidayMasterService } from '../../services/holiday-master-api.service';
import { map } from 'rxjs';
import { Leave } from '../../models/leave.model';
import { Holiday } from '../../models/holiday.model';
import { UtilityService } from 'src/app/shared/services/utility.service';
import tippy from 'tippy.js';
import { AppConfig } from 'src/app/app.config';

@Component({
  selector: 'app-leave-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FullCalendarModule
  ],
  templateUrl: './leave-calendar.component.html',
  styleUrls: ['./leave-calendar.component.scss']
})
export class LeaveCalendarComponent {

  readonly config = inject(AppConfig);
  readonly leaveService = inject(LeaveApiService);
  readonly holidayService = inject(HolidayMasterService);
  readonly utilityService = inject(UtilityService);

  readonly LEAVE_STATUSFLAG_APPROVED = this.config.LEAVE_STATUSFLAG_APPROVED

  leaves: Leave[] = [];
  calendarVisible = true;
  calendarEvents: EventInput[] = [];

  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    plugins: [ // register FullCalendar plugins
      dayGridPlugin,
      timeGridPlugin,
      listPlugin
    ],
    // initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    // select: this.handleDateSelect.bind(this),
    // eventClick: this.handleEventClick.bind(this),
    // eventsSet: this.handleEvents.bind(this),
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    displayEventTime: true,
    displayEventEnd: true,
    // datesSet: this.handleDatesSet.bind(this),
    eventDidMount: this.handleEventDidMount.bind(this),
    dayCellClassNames: (arg) => {
      const isSunday = arg.date.getDay() === 0;
      const isHoliday = this.calendarEvents.some(event => {
        if (!event.extendedProps?.['isHoliday'] || !event.start) return false;
        const eventDate = event.start instanceof Date ? event.start : new Date(event.start as string);
        return eventDate.toDateString() === arg.date.toDateString();
      });
      return (isSunday || isHoliday) ? 'sunday-cell' : '';
    },
  };

  @Input('contactID') set contactIdValue(value: number) {
    if (value) {
      this.calendarEvents = [];
      this.getContactLeaves(value);
      this.getHolidays();
    }
  }

  async getContactLeaves(contactID: number) {
    this.leaveService.get(
      [
        { key: 'contactID', value: contactID.toString() },
        { key: 'statusFlag', value: this.LEAVE_STATUSFLAG_APPROVED.toString() }
      ]).pipe(
        map((items: any[]) => items.map(x => {
          return this.leaveService.mapToMcvFullCalendarEvent(x, true);
        })),
      ).subscribe(results => {
        this.calendarEvents = this.calendarEvents.concat(results);
        this.calendarOptions.events = this.calendarEvents;
      });
  }

  async getHolidays() {
    this.holidayService.get([]).pipe(
      map((items: Holiday[]) => items.map(x => {
        return {
          id: x.uid,
          title: x.title,
          start: new Date(x.holidayDate),
          allDay: true,
          color: '#de7cc4',
          extendedProps: { isHoliday: true }
        };
      }))
    ).subscribe(results => {
      this.calendarEvents = this.calendarEvents.concat(results);
      this.calendarOptions = { ...this.calendarOptions, events: this.calendarEvents };
    });
  }

  private handleEventDidMount(info: EventMountArg) {
    // console.log('event hover', info.event);
    let tooltip = `<h6>${info.event.title}</h6>`;
    if (info.event.allDay == true) {
      tooltip += `<small>${this.utilityService.formatDate(info.event.start ?? new Date(), 'dd MMM y')}</small>`;

    } else {
      tooltip += `<small>${this.utilityService.formatDate(info.event.start ?? new Date(), 'dd MMM y HH:mm')}-${this.utilityService.formatDate(info.event.end ? info.event.end : new Date(), 'dd MMM y HH:mm')}</small>`;
    }
    tippy(info.el, {
      content: tooltip,
      allowHTML: true
    })
  }

}
