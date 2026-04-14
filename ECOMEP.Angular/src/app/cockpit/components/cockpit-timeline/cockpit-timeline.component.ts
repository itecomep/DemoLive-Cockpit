import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { WFTaskApiService } from 'src/app/wf-task/services/wf-task-api.service';
import { ApiFilter } from 'src/app/shared/models/api-filters';
import { WFTask } from 'src/app/wf-task/models/wf-task.model';
import { Contact } from 'src/app/contact/models/contact';
import { TimeEntryDto } from 'src/app/shared/models/time-entry-dto';
import { McvTimeLineEvent } from 'src/app/mcv-time-line/model/mcv-time-line-events';
import { McvTimeLineEventGroup } from 'src/app/mcv-time-line/model/mcv-time-line-event-group';
import { McvTimeLineComponent } from 'src/app/mcv-time-line/components/mcv-time-line/mcv-time-line.component';
import { TimeEntryApiService } from 'src/app/wf-task/services/time-entry-api.service';
import { McvTimeLineComponent as McvTimeLineComponent_1 } from '../../../mcv-time-line/components/mcv-time-line/mcv-time-line.component';

@Component({
    selector: 'app-cockpit-timeline',
    templateUrl: './cockpit-timeline.component.html',
    styleUrls: ['./cockpit-timeline.component.scss'],
    standalone: true,
    imports: [McvTimeLineComponent_1]
})
export class CockpitTimelineComponent implements OnInit, AfterViewInit, OnDestroy
{
  public readonly TIMELINE_START_TIME = this.config.TIMELINE_START_TIME;
  public readonly TIMELINE_END_TIME = this.config.TIMELINE_END_TIME;

  @ViewChild(McvTimeLineComponent) mcvTimeline!: McvTimeLineComponent;

  contact!: Contact;
  @Input('contact') set contactValue(value: Contact)
  {
    if (value)
    {
      this.contact = value;
      this.resources = [];
      if (this.contact && this.contact.id)
      {
        // tslint:disable-next-line: prefer-const
        let _group = new McvTimeLineEventGroup();
        _group.resourceID = this.contact.id.toString();
        _group.title = this.contact.name;
        _group.avatarUrl = this.contact.photoUrl;
        _group.groupType = "resource";
        this.resources.push(_group);
        this.weekStart = this.utility.getWeekStart(new Date());
        this.weekEnd = this.utility.getWeekEnd(new Date());
        this.refresh();
      }
    }
  }

  @Input() readonly: boolean = false;
  @Input() wfTaskID!: number;
  @Input() eventEditMode: 'pre' | 'post' | 'both' | 'none' = 'both';
  @Input() editMode: 'both' | 'create' | 'update' | 'none' = 'none';

  showActiveOnly: boolean = false;
  isRefreshing: boolean = false;
  timelineHeight = 416;
  weekStart: Date = new Date();
  weekEnd: Date = new Date();
  events: McvTimeLineEvent[] = [];
  cachedEvent: McvTimeLineEvent | any;
  resources: McvTimeLineEventGroup[] = [];
  private timer: any;
  @Output() create = new EventEmitter<McvTimeLineEvent>();
  @Output() update = new EventEmitter<McvTimeLineEvent>();
  @Output() delete = new EventEmitter<McvTimeLineEvent>();

  constructor(
    private config: AppConfig,
    private wfTaskService: WFTaskApiService,
    private timeEntryService: TimeEntryApiService,
    private utility: UtilityService
  ) { }

  ngOnInit(): void
  {
    this.timer = setInterval(() =>
    {
      this.refresh();
    }, 5 * 60 * 1000);
  }
  ngOnDestroy()
  {
    clearInterval(this.timer);
  }
  ngAfterViewInit()
  {
    // this.getTimelineHeight();
  }

  getTimelineHeight()
  {
    // console.log('getTimelineHeight',this.mcvTimeline);
    if (this.mcvTimeline)
    {
      if (!this.mcvTimeline.eventPanel) { return; }

      const children = this.mcvTimeline.eventPanel.nativeElement.getElementsByClassName('grid-container');
      if (!children) { return; }

      setTimeout(() =>
      {
        // console.log('new Height',children[0].getBoundingClientRect().height);
        this.timelineHeight = children[0].getBoundingClientRect().height + 65;
      });

    }
  }
  refresh()
  {
    this.cachedEvent = null;
    if (!this.isRefreshing && this.contact)
    {
      this.isRefreshing = true;
      // console.log('refreshing', this.weekStart, this.weekEnd);
      this.getEvents(this.weekStart, this.weekEnd);
    }
  }



  getEvents(weekStart: Date, weekEnd: Date)
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
      { key: 'ContactID', value: this.contact.id.toString() },
    ];

    this.getTaskEvents(eventsFilter);

    this.getTimeEntryEvents(eventsFilter);
  }

  getTaskEvents(eventsFilter: ApiFilter[])
  {
    let filters = eventsFilter.map(x => Object.assign({}, x));
    if (this.showActiveOnly)
    {
      filters = filters.concat([
        { key: 'StatusFlag', value: '2' },
      ]);
    } else
    {
      filters = filters.concat([
        // { key: 'isPreAssignedTimeTask', value: 'true' },
        // { key: 'entity', value: 'Todo' },
        // { key: 'entity', value: 'Package' },
        // { key: 'statusFlag', value: '1' },
        { key: 'StatusFlag', value: '0' },
        { key: 'StatusFlag', value: '2' },
        { key: 'StatusFlag', value: '3' }
      ]);
    }
    this.wfTaskService.get(filters)
      .pipe(
        map((items: WFTask[]) => items.map(x =>
        {
          // tslint:disable-next-line: prefer-const
          let _event = this.wfTaskService.mapToMcvTimelineEvent(x);
          if (this.wfTaskID && this.wfTaskID === x.id)
          {
            _event.editMode = 'post';
          } else
          {
            _event.editMode = 'none';
          }
          _event.moveDirection = 'horizontal';
          _event.resizeDirection = 'both';
          return _event;
        })),
        // tap(mappedItems => console.log('mapped', mappedItems))
      ).subscribe(results => this.events = this.events.concat(results));
  }

  getTimeEntryEvents(eventsFilter: ApiFilter[])
  {
    let filters = eventsFilter.map(x => Object.assign({}, x));
    if (this.showActiveOnly)
    {
      filters = filters.concat([
        { key: 'StatusFlag', value: '0' },
      ]);
    }

    this.timeEntryService.get(filters).pipe(
      map((items: TimeEntryDto[]) => items.map(x =>
      {
        // tslint:disable-next-line: prefer-const
        let _event = this.timeEntryService.mapToMcvTimelineEvent(x);

        _event.editMode = 'none';
        return _event;
      })),
      // tap(mappedItems => console.log('mapped', mappedItems))
    )
      .subscribe(results => this.events = this.events.concat(results));
  }

  onRangeChange(e: any)
  {
    this.weekStart = new Date(e.weekStart);
    this.weekEnd = new Date(e.weekEnd);
    this.refresh();
  }

  updateHeight(e: any)
  {
    this.getTimelineHeight();
  }

  onEventCreate(e: McvTimeLineEvent)
  {
    if (this.editMode === 'both' || this.editMode === 'create')
    {
      e.colorClass = 'yellow';
      e.editMode = this.eventEditMode;
      e.resourceID = this.contact.id.toString();
      e.resourceTitle = this.contact.name;
      if (this.cachedEvent)
      {
        this.events = this.events.filter(x => x.guid !== this.cachedEvent.guid);
      }
      this.events.push(e);
      this.events = this.events.map(x => Object.assign({}, x));
      this.cachedEvent = e;
      if (!this.readonly)
      {
        this.create.emit(e);
      }
    }
  }

  onEventUpdate(event: any)
  {
    if (this.editMode === 'both' || this.editMode === 'update')
    {
      if (!this.readonly)
      {
        this.update.emit(event);
      }
    }
  }
}
