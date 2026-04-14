import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { map } from 'rxjs/operators';
import { AppConfig } from 'src/app/app.config';
import { ApiFilter } from 'src/app/shared/models/api-filters';
import { Contact } from 'src/app/contact/models/contact';
import { WFTask } from 'src/app/wf-task/models/wf-task.model';
import { TimeEntryDto } from 'src/app/shared/models/time-entry-dto';
import { McvTimeLineEvent } from 'src/app/mcv-time-line/model/mcv-time-line-events';
import { McvTimeLineEventGroup } from 'src/app/mcv-time-line/model/mcv-time-line-event-group';
import { McvTimeLineComponent } from 'src/app/mcv-time-line/components/mcv-time-line/mcv-time-line.component';

import { AuthService } from 'src/app/auth/services/auth.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { WFTaskApiService } from 'src/app/wf-task/services/wf-task-api.service';
import { TimeEntryApiService } from 'src/app/wf-task/services/time-entry-api.service';
import { McvTimeLineComponent as McvTimeLineComponent_1 } from '../../../mcv-time-line/components/mcv-time-line/mcv-time-line.component';

@Component({
    selector: 'mcv-time-entry-time-line',
    templateUrl: './mcv-time-entry-time-line.component.html',
    styleUrls: ['./mcv-time-entry-time-line.component.scss'],
    standalone: true,
    imports: [McvTimeLineComponent_1]
})
export class McvTimeEntryTimeLineComponent implements OnInit, AfterViewInit
{
  @ViewChild(McvTimeLineComponent) mcvTimeline!: McvTimeLineComponent;

  public readonly TIMELINE_START_TIME = this.config.TIMELINE_START_TIME;
  public readonly TIMELINE_END_TIME = this.config.TIMELINE_END_TIME;

  wfTask!: WFTask;
  @Input('wfTask') set taskValue(value: WFTask)
  {
    if (value)
    {
      this.wfTask = value;
      let _resources = [];
      if (this.wfTask && this.wfTask.contact)
      {
        let _group = new McvTimeLineEventGroup();
        _group.resourceID = this.wfTask.contact.id.toString();
        _group.title = this.wfTask.contact.name;
        _group.avatarUrl = this.wfTask.contact.photoUrl;
        _resources.push(_group);

        if (this.wfTask.contactID != this.currentContact.id)
        {
          let _userGroup = new McvTimeLineEventGroup();
          _userGroup.resourceID = this.currentContact.id.toString();
          _userGroup.title = this.currentContact.name;
          _userGroup.avatarUrl = this.currentContact.photoUrl;
          _resources.push(_userGroup);

        }
        this.resources = _resources;
        this.weekStart = this.utility.getWeekStart(new Date());
        this.weekEnd = this.utility.getWeekEnd(new Date());
        this.getEvents(this.weekStart, this.weekEnd);
      }
    }
  }

  @Input() readonly: boolean = false;

  DEFAULT_TIMELINE_HEIGHT = 140;
  timelineHeight = this.DEFAULT_TIMELINE_HEIGHT;
  weekStart: Date = new Date();
  weekEnd: Date = new Date();
  events: McvTimeLineEvent[] = [];
  resources: McvTimeLineEventGroup[] = [];
  isRefreshing: boolean = false;
  currentContact!: Contact;

  @Output() created = new EventEmitter<WFTask>();
  @Output() updated = new EventEmitter<WFTask>();
  @Output() deleted = new EventEmitter<WFTask>();

  constructor(
    private authService: AuthService,
    private config: AppConfig,
    private datePipe: DatePipe,
    private wfTaskService: WFTaskApiService,
    private timeEntryService: TimeEntryApiService,
    private utility: UtilityService
  )
  {
    if (this.authService.currentUserStore)
      this.currentContact = this.authService.currentUserStore.contact;
  }

  ngOnInit(): void
  {
  }
  ngAfterViewInit()
  {
    this.getTimelineHeight();
  }

  private getTimelineHeight()
  {
    if (this.mcvTimeline)
    {
      if (!this.mcvTimeline.eventPanel) { return; }

      const children = this.mcvTimeline.eventPanel.nativeElement.getElementsByClassName('grid-container');
      if (!children) { return; }

      setTimeout(() =>
      {
        if (children[0].getBoundingClientRect().height + 48 > this.DEFAULT_TIMELINE_HEIGHT)
        {
          this.timelineHeight = children[0].getBoundingClientRect().height + 48;
        }
      });

    }
  }

  public refresh()
  {
    console.log('getEventsOnRefresh');
    this.getEvents(this.weekStart, this.weekEnd);
  }

  private getEvents(weekStart: Date, weekEnd: Date)
  {
    this.events = [];

    // tslint:disable-next-line: prefer-const
    let _start = new Date(weekStart);
    _start.setHours(0, 0, 0, 0);
    // tslint:disable-next-line: prefer-const
    let _end = new Date(weekEnd);
    _end.setHours(0, 0, 0, 0);
    const eventsFilter = [
      { key: 'RangeStart', value: this.utility.convertToUTCDate(_start).toISOString() },
      { key: 'RangeEnd', value: this.utility.convertToUTCDate(_end).toISOString() },
      { key: 'ContactID', value: this.currentContact.id.toString() },
    ];

    if (this.wfTask && this.wfTask.contactID != this.currentContact.id)
    {
      eventsFilter.push({ key: 'ContactID', value: this.wfTask.contactID.toString() });
    }
    this.getTimeEntryEvents(eventsFilter);
  }

  private getTaskEvents(eventsFilter: ApiFilter[])
  {
    let filters = eventsFilter.map(x => Object.assign({}, x));

    filters = filters.concat([
      // { key: 'isPreAssignedTimeTask', value: 'true' },
      // { key: 'statusFlag', value: '1' },
      { key: 'StatusFlag', value: '0' },
      { key: 'StatusFlag', value: '2' },
      { key: 'StatusFlag', value: '3' }
    ]);
    this.events = this.events.filter(x => x.entity != this.config.NAMEOF_ENTITY_WFTASK);
    this.wfTaskService.get(filters)
      .pipe(
        map((items: WFTask[]) => items.map(x =>
        {
          // tslint:disable-next-line: prefer-const
          let _event = this.wfTaskService.mapToMcvTimelineEvent(x);
          _event.editMode = 'none';
          _event.moveDirection = 'horizontal';
          _event.resizeDirection = 'both';
          return _event;
        })),
        // tap(mappedItems => console.log('mapped', mappedItems))
      ).subscribe(results => this.events = this.events.concat(results));
  }

  private getTimeEntryEvents(eventsFilter: ApiFilter[])
  {
    let filters = eventsFilter.map(x => Object.assign({}, x));
    this.events = this.events.filter(x => x.entity != this.config.NAMEOF_ENTITY_TIMEENTRY);
    this.timeEntryService.get(filters).pipe(
      map((items: TimeEntryDto[]) => items.map(x =>
      {
        // tslint:disable-next-line: prefer-const
        let _event = this.timeEntryService.mapToMcvTimelineEvent(x);
        if (x.contactID === this.currentContact.id && x.wfTaskID === this.wfTask.id)
        {
          _event.editMode = 'pre';
        } else
        {
          _event.editMode = 'none';
        }
        return _event;
      })),
      // tap(mappedItems => console.log('mapped', mappedItems))
    )
      .subscribe(results => this.events = this.events.concat(results));
  }

  onUpdateHeight(e: any)
  {
    this.getTimelineHeight();
  }

  onRangeChange(e: any)
  {
    this.weekStart = new Date(e.weekStart);
    this.weekEnd = new Date(e.weekEnd);
    if (this.currentContact)
    {
      console.log('getEventsOnrangeChange');
      this.getEvents(this.weekStart, this.weekEnd);
    }

  }

  onSlotSelection(e: McvTimeLineEvent)
  {
    if (e.start > e.end)
    {
      console.log('Invalid Event', e, e.start, e.end);
      this.utility.showSwalToast("Invalid slot selected.", "Please try again!", 'error');
      return;
    }
    // tslint:disable-next-line: prefer-const
    let _event = new McvTimeLineEvent();
    _event.id = '0';
    _event.title = 'New Time Entry';
    _event.start = new Date(e.start);
    _event.end = new Date(e.end);
    _event.resourceID = e.resourceID;
    _event.resourceTitle = e.resourceTitle;
    _event.resourceSubTitle = e.resourceSubTitle;
    _event.avatarUrl = e.avatarUrl;
    _event.colorClass = 'blue';
    _event.editMode = 'pre';
    _event.subTitle = this.datePipe.transform(e.start, 'HH:mm') + '-' + this.datePipe.transform(e.end, 'HH:mm');

    if (!this.readonly)
    {
      this.createTimeEntry(_event);
    }
  }

  onEventUpdate(event: any)
  {
    if (!this.readonly)
    {
      this.updateTimeEntry(event);
    }
  }

  private createTimeEntry(event: McvTimeLineEvent)
  {
    this.timeEntryService.create({
      contactID: this.currentContact.id,
      // contactID:this.contact.id,
      startDate: event.start,
      endDate: event.end,
      wfTaskID: this.wfTask.id
    }).subscribe((result) =>
    {
      if (result)
      {
        this.wfTask.timeEntries.push(result);
        // tslint:disable-next-line: prefer-const
        let mcvEvent = this.timeEntryService.mapToMcvTimelineEvent(result);
        mcvEvent.editMode = 'pre';
        this.events.push(mcvEvent);
        this.events = this.events.map(x => Object.assign({}, x));
        this.created.emit(this.wfTask);
        // this.refresh();
      }
    });

  }

  private updateTimeEntry(event: McvTimeLineEvent)
  {
    // tslint:disable-next-line: prefer-const
    let _timeEntry: any = this.wfTask.timeEntries.find(x => x.id.toString() === event.id.toString());
    if (_timeEntry)
    {
      // tslint:disable-next-line: prefer-const
      let _entry = Object.assign({}, _timeEntry);
      _entry.startDate = new Date(event.start);
      _entry.endDate = new Date(event.end);
      this.timeEntryService.update(_entry).subscribe((result) =>
      {
        if (result)
        {
          this.wfTask.timeEntries[this.wfTask.timeEntries.indexOf(_timeEntry)] = Object.assign({}, result);

          this.updated.emit(this.wfTask);
          this.updateEventWithData(event, result);

        }
      }, (err) =>
      {
        this.updateEventWithData(event, _timeEntry);
      });
    }
  }

  private updateEventWithData(event: McvTimeLineEvent, timeEntry: TimeEntryDto)
  {
    this.events = this.events.filter(x => x.guid !== event.guid);
    // tslint:disable-next-line: prefer-const
    let _mcvEvent = this.timeEntryService.mapToMcvTimelineEvent(timeEntry);
    _mcvEvent.editMode = 'pre';
    this.events.push(_mcvEvent);
    this.events = this.events.map(x => Object.assign({}, x));
  }
}

