import { ComponentType } from '@angular/cdk/portal';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { AuthService } from 'src/app/auth/services/auth.service';
import { TimeLineService } from '../../services/time-line.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { McvBaseApiService } from 'src/app/shared/services/mcv-base-api.service';
import { WFTaskApiService } from 'src/app/wf-task/services/wf-task-api.service';
import { ContactApiService } from 'src/app/contact/services/contact-api.service';

import { AppConfig } from 'src/app/app.config';
import { Contact } from 'src/app/contact/models/contact';
import { TimeLineGroup } from '../../model/time-line-group';
import { TimeEntryDto } from 'src/app/shared/models/time-entry-dto';
import { TodoDialogComponent } from 'src/app/todo/components/todo-dialog/todo-dialog.component';
import { ApiFilter } from 'src/app/shared/models/api-filters';
import { WFTask } from 'src/app/wf-task/models/wf-task.model';
import { McvComponentDialogConfig } from 'src/app/shared/models/mcv-component-dialog-config';
import { map } from 'rxjs/operators';
import { McvTimeLineEvent } from 'src/app/mcv-time-line/model/mcv-time-line-events';
import { McvTimeLineEventDialogComponent } from 'src/app/mcv-time-line/components/mcv-time-line-event-dialog/mcv-time-line-event-dialog.component';
import { McvTimeLineEventGroup } from 'src/app/mcv-time-line/model/mcv-time-line-event-group';
import { TimeEntryApiService } from 'src/app/wf-task/services/time-entry-api.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { McvTimeLineComponent } from '../../../mcv-time-line/components/mcv-time-line/mcv-time-line.component';
import { HeaderComponent } from '../../../mcv-header/components/header/header.component';

@Component({
    selector: 'app-time-line',
    templateUrl: './time-line.component.html',
    styleUrls: ['./time-line.component.scss'],
    standalone: true,
    imports: [HeaderComponent, McvTimeLineComponent, FooterComponent, MatButtonModule, MatIconModule]
})
export class TimeLineComponent implements OnInit, OnDestroy
{


  public readonly TIMELINE_START_TIME = this.config.TIMELINE_START_TIME;
  public readonly TIMELINE_END_TIME = this.config.TIMELINE_END_TIME;

  get f(): any { return this.form.controls; }

  get contactOptionsFA(): FormArray
  {
    return this.f.contactOptionsArray as FormArray;
  }

  get selectGroup(): TimeLineGroup[] { return this.timeLineService.timeLineGroupItems }

  timer: any;
  showActiveOnly: boolean = false;
  events: any[] = [];
  weekStart: Date = this.utility.getMonthStart();
  weekEnd: Date = this.utility.getMonthEnd();
  weekDay: Date = new Date();
  contactFilter = [{ key: 'UsersOnly', value: 'true' }];
  resources: McvTimeLineEventGroup[] = [];
  contactOptions: Contact[] = [];
  contactFC = new FormControl();
  searchFC = new FormControl();
  isResizeActive: boolean = false;
  selectedEvent!: McvTimeLineEvent;
  cachedEvent!: McvTimeLineEvent;
  headerTitle: any;
  form!: FormGroup;
  newArrayToFilter: McvTimeLineEventGroup[] = [];
  groupToggle = new FormControl();
  groupOptions: TimeLineGroup[] = [];
  filteredArray: McvTimeLineEventGroup[] = []

  constructor(
    protected config: AppConfig,
    protected utility: UtilityService,
    protected wfTaskService: WFTaskApiService,
    protected timeEntryService: TimeEntryApiService,
    public dialog: MatDialog,
    private entityService: McvBaseApiService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    protected contactService: ContactApiService,
    private timeLineService: TimeLineService
  ) { }

  ngOnInit(): void
  {
    if (!this.form)
    {
      this.buildForm();
    }
    this.getContactOptions();
    this.refresh();
    this.headerTitle = 'TimeLine'

    this.contactFC.valueChanges.subscribe(results =>
    {
      console.log('Results', results);
      if (results)
      {
        localStorage.setItem('team', JSON.stringify(results));
        this.getEventGroups(results);
        this.refresh();
      }
    });

    // this.searchFC.valueChanges.subscribe(value => {
    //   console.log(value);
    //   if (value) {
    //     var filteredArray = [];
    //     filteredArray = this.resources;
    //     var newFilteredArray = [];
    //     // newFilteredArray = filteredArray.filter(x => x.title.toLowerCase() == value.toLowerCase());
    //     newFilteredArray = filteredArray.filter(x => x.title.toLowerCase().includes(value.toLowerCase()));
    //     console.log(newFilteredArray);
    //   }
    // });

    // this.groupToggle.valueChanges.subscribe((value: TimeLineGroup) => {
    //   var contactIDs: any[] = [];
    //   if (value) {
    //     // console.log(value);
    //     value.group.forEach(x => {
    //       contactIDs.push(x.id);
    //       this.getEventGroups(contactIDs);
    //     });
    //     this.refresh();
    //   }
    // });
  }

  ngOnDestroy()
  {
    clearInterval(this.timer);
  }

  protected refresh()
  {
    console.log('refreshed');
    if (!this.form)
    {
      this.buildForm();
    }
    this.getEvents(this.weekStart, this.weekEnd);
  }

  protected getEvents(weekStart: Date, weekEnd: Date)
  {
    this.events = [];
    // tslint:disable-next-line: prefer-const
    let _start = new Date(weekStart);
    _start.setHours(0, 0, 0, 0);
    // tslint:disable-next-line: prefer-const
    let _end = new Date(weekEnd);
    _end.setHours(0, 0, 0, 0);

    // tslint:disable-next-line: prefer-const
    let eventsFilter = [
      { key: 'RangeStart', value: this.utility.convertToUTCDate(_start).toISOString() },
      { key: 'RangeEnd', value: this.utility.convertToUTCDate(_end).toISOString() },
      // { key: 'ContactID', value: '720' }
    ];

    // console.log('range', this.utility.convertToUTCDate(_start).toISOString(), this.utility.convertToUTCDate(_end).toISOString());
    this.getTaskEvents(eventsFilter);
    this.getTimeEntryEvents(eventsFilter);
  }

  protected getTaskEvents(eventsFilter: ApiFilter[])
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
        map((items: WFTask[]) => items
          .filter(x => this.resources.length == 0 || this.resources.find(r => r.resourceID == x.contactID.toString()))
          .map(x =>
          {
            // tslint:disable-next-line: prefer-const
            let _event = this.wfTaskService.mapToMcvTimelineEvent(x);
            _event.editMode = 'none';
            _event.moveDirection = 'horizontal';
            _event.resizeDirection = 'both';
            return _event;
          })),
        // tap(mappedItems => console.log('mapped', mappedItems))
      ).subscribe((results: any) =>
      {
        this.events = this.events.concat(results);

      });
  }

  protected getTimeEntryEvents(eventsFilter: ApiFilter[])
  {
    let filters = eventsFilter.map(x => Object.assign({}, x));
    if (this.showActiveOnly)
    {
      filters = filters.concat([
        { key: 'StatusFlag', value: '0' },
      ]);
    }

    this.timeEntryService.get(filters).pipe(
      map((items: TimeEntryDto[]) => items
        .filter(x => this.resources.length == 0 || this.resources.find(r => r.resourceID == x.contactID.toString()))
        .map(x =>
        {
          // tslint:disable-next-line: prefer-const
          let _event = this.timeEntryService.mapToMcvTimelineEvent(x);

          _event.editMode = 'none';
          return _event;
        })),
      // tap(mappedItems => console.log('mapped', mappedItems))
    )
      .subscribe((results: any) => this.events = this.events.concat(results));
  }

  protected getContactOptions()
  {
    this.contactService.get(this.contactFilter, '', 'fullName').subscribe((data) =>
    {
      this.contactOptions = data;
      const teamMembers = localStorage.getItem('team');
      if (teamMembers)
      {
        const _teamMembers = JSON.parse(teamMembers);
        console.log('_teamMembers', _teamMembers);
        this.contactFC.setValue(_teamMembers, { emitEvent: false });
        this.getEventGroups(_teamMembers);
      } else
      {
        this.getEventGroups(data.map(x => x.id));
      }
    });
  }

  onRangeChange(e: any)
  {
    this.weekDay = new Date(e.current);
    this.weekStart = new Date(e.weekStart);
    this.weekEnd = new Date(e.weekEnd);
    this.refresh();
  }

  onSlotSelection(e: McvTimeLineEvent)
  {
    // console.log('New Event', e, e.start, e.end);
    this.createEvent(e);
  }

  createEvent(e: McvTimeLineEvent)
  {
    console.log('CreateEvent', e);

    e.colorClass = 'yellow';
    e.editMode = 'post';
    // e.resourceID = this.contact.id.toString();
    // e.resourceTitle = this.contact.name;
    if (this.cachedEvent)
    {
      this.events = this.events.filter(x => x.guid !== this.cachedEvent.guid);
    }
    this.events.push(e);
    this.events = this.events.map(x => Object.assign({}, x));
    this.cachedEvent = e;
    // if (!this.readonly) {
    //   this.create.emit(e);
    // }
    console.log('CreateEvent', e);

  }

  toggleActive()
  {
    this.showActiveOnly = !this.showActiveOnly;
    this.refresh();
  }

  private getEventGroups(contactIDs: any[])
  {
    this.resources = [];
    this.contactOptions.filter(x => contactIDs.includes(x.id)).forEach(x =>
    {
      const _group = new McvTimeLineEventGroup();
      _group.resourceID = x.id.toString();
      _group.title = x.name;
      _group.avatarUrl = x.photoUrl;
      this.resources.push(_group);
    });
  }

  onEventClick(event: McvTimeLineEvent)
  {
    if (this.authService.currentUserStore != null)
    {
      if (event.entity && event.entity.toLowerCase() == this.config.NAMEOF_ENTITY_WFTASK.toLowerCase()
        && event.eventData.contactID == this.authService.currentUserStore.contact.id)
      {
        let task = event.eventData;
        if (task && task.entity.toLowerCase() === this.config.NAMEOF_ENTITY_TODO.toLowerCase())
        {
          console.log('openEntityDialog', event.entity, task);
          this.openEntityDialog(TodoDialogComponent, 'Task', task.entityID, 0, false, true, task);
        } else
        {
          if (!this.isResizeActive)
          {
            const dialogConfig = new MatDialogConfig();
             dialogConfig.autoFocus = true;
            dialogConfig.panelClass = 'mcv-fullscreen-dialog';
            // dialogConfig.height = '80%';
            // dialogConfig.width = '80%';
            dialogConfig.data = {
              dialogTitle: event.title,
              event
            };
            const dialogRef = this.dialog.open(
              McvTimeLineEventDialogComponent,
              dialogConfig
            );
            dialogRef.afterClosed().subscribe(res =>
            {
              if (res)
              {
                this.selectedEvent = res;
              }
            });
          }
        }
      }
    }
  }

  openEntityDialog(componentOrTemplateRef: ComponentType<unknown> | TemplateRef<unknown>, dialogTitle: string, entityID: number, entityTypeFlag: number, isCreateMode: boolean = false, isTaskmode: boolean = false, wfTask?: WFTask)
  {
    let _dialogData = new McvComponentDialogConfig();
    _dialogData.dialogTitle = dialogTitle;
    _dialogData.entityID = entityID;
    _dialogData.entityTypeFlag = entityTypeFlag;
    _dialogData.isCreateMode = isCreateMode;
    _dialogData.isTaskMode = isTaskmode;
    _dialogData.task = wfTask;
    const dialogRef = this.entityService.openDialog(componentOrTemplateRef, _dialogData, false);
    dialogRef.afterClosed().subscribe(res =>
    {
      if (res)
      {
        console.log('onClose', res);
      }
    });
  }

  onClickRefresh()
  {
    this.refresh();
  }

  buildForm()
  {
    this.form = this.formBuilder.group({
      contactOptionsArray: this.formBuilder.array([])
    });
    this.addNewFormControl();
  }

  addNewFormControl()
  {
    // const _contactControl = this.formBuilder.group(
    //   {
    //     groupIndex: new FormControl<number | null>(null),
    //     contactOptionsFC: new FormControl<any>(null)
    //   }
    // );
    // this.contactOptionsFA.push(_contactControl);
    // const formArraysValue = <FormArray>this.form.get('contactOptionsArray');
    // _contactControl.get('groupIndex')?.setValue(formArraysValue.length - 1);

    // _contactControl.valueChanges.pipe(
    //   debounceTime(400),
    //   distinctUntilChanged()
    // ).subscribe(formValue => {
    //   this.formValueChanged(formValue);
    // });
    // console.log(this.resources);
  }

  formValueChanged(value: any)
  {
    // var formValueArray = [];
    // if (!value || value == '') {
    //   this.newArrayToFilter = this.resources;
    // } else {
    //   formValueArray.push(this.contactOptionsFA.value);
    //   localStorage.setItem('formArrayValues', JSON.stringify(formValueArray));
    //   const groupIndex = value['groupIndex'];
    //   const changedGroup = <FormArray>this.form.get("contactOptionsArray")?.value[groupIndex];
    //   this.newArrayToFilter = this.resources.filter(x => JSON.stringify(changedGroup['contactOptionsFC']).includes(x.resourceID));
    //   // console.log(this.newArrayToFilter);
    // }
  }
}
