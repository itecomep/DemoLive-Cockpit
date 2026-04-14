import { Component, inject, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, firstValueFrom, map } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { LeaveApiService } from 'src/app/leave/services/leave-api.service';
import { MeetingApiService } from 'src/app/meeting/services/meeting-api.service';
import { ApiFilter } from 'src/app/shared/models/api-filters';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput, DateSelectArg, EventClickArg, DatesSetArg, EventMountArg } from '@fullcalendar/core';
import tippy from 'tippy.js';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ContactTeam } from 'src/app/contact/models/contact-team.model';
import { ContactTeamApiService } from 'src/app/contact/services/contact-team-api.service';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { SiteVisitApiService } from 'src/app/site-visit/services/site-visit-api.service';
import { TodoApiService } from 'src/app/todo/services/todo-api.service';
import { HolidayMasterService } from 'src/app/leave/services/holiday-master-api.service';
import { Holiday } from 'src/app/leave/models/holiday.model';
@Component({
  selector: 'app-cockpit-team-calendar',
  standalone: true,
  imports: [FullCalendarModule, MatTooltipModule, FooterComponent, CommonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatIconModule, MatButtonModule, MatTooltipModule, MatOptionModule, MatSelectModule],
  templateUrl: './cockpit-team-calendar.component.html',
  styleUrls: ['./cockpit-team-calendar.component.scss']
})
export class CockpitTeamCalendarComponent {
  @ViewChild('calendar', { static: false }) calendarComponent!: FullCalendarComponent; // the #calendar in the template

  readonly leaveService = inject(LeaveApiService);
  readonly meetingService = inject(MeetingApiService);
  readonly siteVisitService = inject(SiteVisitApiService);
  readonly authService = inject(AuthService);
  readonly holidayService = inject(HolidayMasterService);
  readonly utility = inject(UtilityService);
  readonly contactTeamService = inject(ContactTeamApiService);
  readonly todoService = inject(TodoApiService);

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
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    displayEventTime: true,
    displayEventEnd: true,
    datesSet: this.handleDatesSet.bind(this),
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
    // eventMouseEnter:this.handleEventMouseEnter.bind(this),
    // eventMouseLeave:this.handleEventMouseLeave.bind(this),
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  };

  teamFC = new FormControl();
  teamOptions: ContactTeam[] = [];
  calendarVisible = true;
  calendarEvents: EventInput[] = [];
  filters: ApiFilter[] = [
    { key: 'isReadOnly', value: 'false' }
  ];

  @Input() showAll: boolean = false;
  @Input() startDate!: Date;
  @Input() endDate!: Date;
  // @Input() contactID: number=0;
  // @Input() selectedEntity: any;
  loading = false;

  entityOptions = [
    { title: 'Leaves', value: 'LEAVE', color: '#7D3C98' },
    // { title: 'Tasks', value: 'WFTASK', color: '#16A085 ' },
    // {title:'Meetings',value:'MEETING',color:'#2E4053'}
  ];

  now: Date = new Date();

  get calendarApi(): any { return this.calendarComponent.getApi(); }
  get isTeamLeader(): any { return this.authService.isTeamLeader }
  get isRoleMaster(): any { return this.authService.isRoleMaster }

  searchFilter!: FormControl;
  searchKey!: string;


  ngOnInit() {
    // this.selectedEntity = this.entityOptions[0];
    this.getTeamOptions();
    this.searchFilter = new FormControl();
    this.searchFilter.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe((value) => {
        if (value) {
          this.searchKey = value;
          this.getEvents();
        }
      });

    this.teamFC.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(
        (value) => {
          if (value) {
            this.filters = this.filters.filter(i => i.key !== "teamID");
            this.addFilter('teamID', value.id.toString());
            this.calendarEvents = [];
            this.getLeaveEvents(this.filters);
            this.getMeetingEvents(this.filters);
            this.getSiteVisitEvents(this.filters);
            this.getTodoEvents(this.filters);
          }
        }
      );
  }

  refresh() {
    this.filters = this.filters.filter(x => x.key !== 'teamID');
    this.teamFC.setValue('', { emitEvent: false });
    this.getEvents();
  }

  onEntitySelection(event: any) {
    this.getEvents();
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

  private getEvents() {

    this.calendarEvents = [];
    // tslint:disable-next-line: prefer-const
    let _start = new Date(this.startDate);
    _start.setHours(0, 0, 0, 0);
    // tslint:disable-next-line: prefer-const
    let _end = new Date(this.endDate);
    _end.setHours(0, 0, 0, 0);

    // tslint:disable-next-line: prefer-const
    this.filters = this.filters.filter(x => x.key !== 'rangeStart');
    this.addFilter('rangeStart', this.utility.convertToUTCDate(_start).toISOString());

    this.filters = this.filters.filter(x => x.key !== 'rangeEnd');
    this.addFilter('rangeEnd', this.utility.convertToUTCDate(_end).toISOString());

    if (this.isTeamLeader) {
      const _teams = this.authService.currentUserStore?.teams;
      if (_teams && _teams.length > 0) {
        _teams.forEach(x => {
          this.addFilter('teamID', x.id.toString());
        });
      }
    }

    // this.filters = [
    //   { key: 'rangeStart', value: this.utility.convertToUTCDate(_start).toISOString() },
    //   { key: 'rangeEnd', value: this.utility.convertToUTCDate(_end).toISOString() },
    //   // { key: 'contactID', value: this.authService.user.entity.id }
    // ];
    this.getLeaveEvents(this.filters);
    this.getMeetingEvents(this.filters);
    this.getSiteVisitEvents(this.filters);
    this.getTodoEvents(this.filters);
    this.getHolidays();
  }

  private getLeaveEvents(eventsFilter: ApiFilter[]) {
    this.leaveService.get(eventsFilter.concat([
      { key: 'statusFlag', value: '1' }
    ]), this.searchKey).pipe(
      map((items: any[]) => items.map(x => {
        return this.leaveService.mapToMcvFullCalendarEvent(x, this.showAll);
      })),
    ).subscribe(results => {
      this.calendarEvents = this.calendarEvents.concat(results);
      this.calendarOptions.events = this.calendarEvents;
    });
  }

  private getMeetingEvents(eventsFilter: ApiFilter[]) {
    this.meetingService.get(eventsFilter.concat([
      // { key: 'statusFlag', value: '1' }
    ]), this.searchKey).pipe(
      map((items: any[]) => items.map(x => {
        return this.meetingService.mapToMcvFullCalendarEvent(x, this.showAll);
      })),
    ).subscribe(results => {
      this.calendarEvents = this.calendarEvents.concat(results);
      this.calendarOptions.events = this.calendarEvents;
    });
  }

  private getSiteVisitEvents(eventsFilter: ApiFilter[]) {
    this.siteVisitService.get(eventsFilter.concat([
      // { key: 'statusFlag', value: '1' }
    ]), this.searchKey).pipe(
      map((items: any[]) => items.map(x => {
        return this.siteVisitService.mapToMcvFullCalendarEvent(x, this.showAll);
      })),
    ).subscribe(results => {
      this.calendarEvents = this.calendarEvents.concat(results);
      this.calendarOptions.events = this.calendarEvents;
    });
  }

  private getTodoEvents(eventsFilter: ApiFilter[]) {
    this.todoService.get(eventsFilter.concat([
      { key: 'statusFlag', value: '0' },
      { key: 'statusFlag', value: '1' }
    ]), this.searchKey).pipe(
      map((items: any[]) => items.map(x => {
        return this.todoService.mapToMcvFullCalendarEvent(x, this.showAll);
      })),
    ).subscribe(results => {
      this.calendarEvents = this.calendarEvents.concat(results);
      this.calendarOptions.events = this.calendarEvents;
    });
  }

  private handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  private handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  private addFilter(key: string, value: string) {
    const _filter = this.filters.find(obj => {
      return obj.key === key && obj.value === value;
    });
    if (!_filter) {
      this.filters.push({ key: key, value: value });
    }
  }

  private handleDateSelect(selectInfo: DateSelectArg) {
    // const title = prompt('Please enter a new title for your event');
    // const calendarApi = selectInfo.view.calendar;

    // calendarApi.unselect(); // clear date selection

    // if (title) {
    //   calendarApi.addEvent({
    //     id: createEventId(),
    //     title,
    //     start: selectInfo.startStr,
    //     end: selectInfo.endStr,
    //     allDay: selectInfo.allDay
    //   });
    // }
  }

  private handleEventClick(clickInfo: EventClickArg) {
    // console.log('Click', `${clickInfo.event.title}`, clickInfo.event.extendedProps['start'], clickInfo.event.extendedProps['end']);
    // if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
    //   clickInfo.event.remove();
    // }
  }

  private handleEvents(events: any[]) {
    this.calendarEvents = events;
  }

  private handleDatesSet(args: DatesSetArg) {
    // console.log('handleDatesSet', args);
    this.startDate = args.start;
    this.endDate = args.end;
    this.calendarOptions.events = [];
    this.calendarEvents = [];
    this.getEvents();
  }

  private handleEventDidMount(info: EventMountArg) {
    // console.log('event hover', info.event);
    let tooltip = `<h6>${info.event.title}</h6>`;
    // if (info.event.allDay == true) {
    // tooltip += `<small>${this.utility.formatDate(info.event.end ?? new Date(), 'dd MMM y')}</small>`;

    // } else {
    // tooltip += `<small>${this.utility.formatDate(info.event.start ?? new Date(), 'dd MMM y HH:mm')}-${this.utility.formatDate(info.event.end ? info.event.end : new Date(), 'dd MMM y HH:mm')}</small>`;
    // }
    tippy(info.el, {
      content: tooltip,
      allowHTML: true
    })
  }

  private async getTeamOptions() {
    this.teamOptions = await firstValueFrom(this.contactTeamService.get());
  }
}
