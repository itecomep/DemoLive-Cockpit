import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ComponentType } from '@angular/cdk/portal';

import { AuthService } from "src/app/auth/services/auth.service";
import { McvBaseApiService } from "src/app/shared/services/mcv-base-api.service";
import { UtilityService } from "src/app/shared/services/utility.service";

import { AppConfig } from "src/app/app.config";
import { WFTask } from "src/app/wf-task/models/wf-task.model";
import { AppPermissions } from "src/app/app.permissions";
import { Contact } from "src/app/contact/models/contact";
import { TodoDialogComponent } from "src/app/todo/components/todo-dialog/todo-dialog.component";
import { McvComponentDialogConfig } from "src/app/shared/models/mcv-component-dialog-config";
import { PagedListConfig } from "src/app/shared/models/paged-list-config.model";
import { MeetingAgendaTaskDialogComponent } from "src/app/meeting/components/meeting-agenda-task-dialog/meeting-agenda-task-dialog.component";
import { MeetingDialogComponent } from "src/app/meeting/components/meeting-dialog/meeting-dialog.component";
import { RequestTicketDialogComponent } from "src/app/request-ticket/components/request-ticket-dialog/request-ticket-dialog.component";
import { CommonModule, NgIf } from "@angular/common";
import { CockpitActivityComponent } from "../cockpit-activity/cockpit-activity.component";
import { MatExpansionModule } from "@angular/material/expansion";
import { FooterComponent } from "../../../shared/components/footer/footer.component";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { WFTaskApiService } from "src/app/wf-task/services/wf-task-api.service";
import { WfTaskPagedListComponent } from "src/app/wf-task/components/wf-task-paged-list/wf-task-paged-list.component";
import { CockpitTaskPagedListComponent } from "../cockpit-task-paged-list/cockpit-task-paged-list.component";
import { CockpitActiveTaskComponent } from "../cockpit-active-task/cockpit-active-task.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { debounceTime, distinctUntilChanged } from "rxjs";
import { MatInputModule } from "@angular/material/input";
import { LeaveDialogComponent } from "src/app/leave/components/leave-dialog/leave-dialog.component";
import { CockpitMyCalendarComponent } from "../cockpit-my-calendar/cockpit-my-calendar.component";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { ApiFilter } from "src/app/shared/models/api-filters";
import { SitevisitDialogComponent } from "src/app/site-visit/component/site-visit-dialog/site-visit-dialog.component";
import { CockpitMeetingAgendasComponent } from "../cockpit-meeting-agendas/cockpit-meeting-agendas.component";

@Component({
  selector: 'app-cockpit',
  templateUrl: './cockpit.component.html',
  styleUrls: ['./cockpit.component.scss'],
  standalone: true,
  imports: [
    FooterComponent,
    MatExpansionModule,
    FormsModule,
    MatTooltipModule,
    NgIf,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule,
    CommonModule,

    //Components
    WfTaskPagedListComponent,
    CockpitActivityComponent,
    CockpitTaskPagedListComponent,
    CockpitActiveTaskComponent,
    LeaveDialogComponent,
    CockpitMyCalendarComponent,
    CockpitMeetingAgendasComponent
  ]

})
export class CockpitComponent implements OnInit, OnDestroy {

  @ViewChild(WfTaskPagedListComponent) wfTaskPagedComponent!: WfTaskPagedListComponent;

  readonly WFTASK_ROUTE = 'wftask/detail';
  readonly WFTASK_PAGE_SIZE = 20;
  readonly WFTASK_FILTERS = [];
  myTaskSearch = new FormControl();
  assignedTaskSearch = new FormControl();
  currentUserId: any = 0;
  myTaskEntityFilter = new FormControl();
  taskAssignedEntityFilter = new FormControl();

  entityFilterKey = 'entity';

  entityOptions:any[]=[
    'Todo','Meeting','Leave','SiteVisit'
  ];

  get IsPermissionWFTaskShowAll(): boolean { return this.authService.isInAnyRole([this.permissions.WFTASK_SPECIAL_SHOW_ALL]); }
  get isPermissionTeamTasks(): boolean { return this.authService.isInAnyRole([this.permissions.COCKPIT_TEAM_TASKS]); }

  readonly taskConstants = {
    STAGEINDEX: {
      BRAINSTORMING: 1,
      STUDIOWORK: 3,
      PACKAGE: 5,
      FINALREVIEW: 6,
      SUBMISSION: 7
    }
  };

  myTaskPagedListConfig = new PagedListConfig({
    searchKey: null,
    sort: '',
    showAll: false,
    showAssigned: false,
    filters: [
      { key: 'StatusFlag', value: '0' },
      { key: 'StatusFlag', value: '2' },
      { key: 'StatusFlag', value: '3' },
    ],
    route: this.WFTASK_ROUTE,
    pageSize: this.WFTASK_PAGE_SIZE,
    pageIndex: 0,
    groupBy: [], keyPropertyName: 'id',
  });

  myTaskShowToday: boolean = false;

  assignedTaskPagedListConfig = new PagedListConfig({
    searchKey: null,
    sort: '',
    showAll: true,
    showAssigned: true,
    filters: [
      { key: 'StatusFlag', value: '0' },
      { key: 'StatusFlag', value: '2' },
      { key: 'StatusFlag', value: '3' },
      // { key: 'StartDaterangeEnd', value: this.utilityService.tomorrow.toISOString() },
    ],
    route: this.WFTASK_ROUTE,
    pageSize: this.WFTASK_PAGE_SIZE,
    pageIndex: 0,
    groupBy: [], keyPropertyName: 'id'
  });

  assignedTaskShowToday: boolean = false;

  teamTaskPagedListConfig = new PagedListConfig({
    searchKey: null,
    sort: '',
    showAll: true,
    showAssigned: false,
    filters: [
      { key: 'StatusFlag', value: '0' },
      { key: 'StatusFlag', value: '2' },
      { key: 'StatusFlag', value: '3' },
      // { key: 'StartDaterangeEnd', value: this.utilityService.tomorrow.toISOString() },
    ],
    route: this.WFTASK_ROUTE,
    pageSize: this.WFTASK_PAGE_SIZE,
    pageIndex: 0,
    groupBy: [], keyPropertyName: 'id'
  });

  teamTaskShowToday: boolean = false;

  executiveTaskAnalysisPagedListConfig = new PagedListConfig({
    pageSize: 30,
    pageIndex: 0,
    filters: [{ key: 'ContactID', value: this.currentUserId }],
    searchKey: null,
    sort: 'startDate desc',
    route: '',
    showAll: false,
    showAssigned: false,
    groupBy: [], keyPropertyName: ''
  });

  myMeetingAgendasPagedListConfig = new PagedListConfig({
    searchKey: null,
    sort: 'DueDate desc',
    showAll: false,
    showAssigned: false,
    filters: [
      { key: 'isReadOnly', value: 'false' },
      { key: 'StatusFlag', value: this.config.MEETING_AGENDA_STATUSFLAG_PENDING.toString() },
      { key: 'actionByContactID', value: this.authService.currentUserStore ? this.authService.currentUserStore.contact.id.toString() : '0' },
    ],
    route: '',
    pageSize: 30,
    pageIndex: 0,
    groupBy: [], 
    keyPropertyName: 'id',
  });

  myTaskListCount: number = 0;
  teamTaskListCount: number = 0;
  assignedTaskListCount: number = 0;

  employee!: Contact;
  companyVhrCost: number = 1;

  get currentContact(): Contact | null {
    if (this.authService.currentUserStore) {
      return this.authService.currentUserStore.contact;
    } else {
      return null;
    }

  }

  constructor(
    private permissions: AppPermissions,
    private router: Router,
    public authService: AuthService,
    private config: AppConfig,
    public dialog: MatDialog,
    public utilityService: UtilityService,
    private entityService: McvBaseApiService,
    private wftaskService: WFTaskApiService
  ) {
  }

  ngOnDestroy(): void { }

  ngOnInit() {
    if (this.authService.currentUserStore && this.authService.currentUserStore.contact) {
      this.myTaskPagedListConfig.filters.push({
        key: 'ContactID', value: this.authService.currentUserStore.contact.id.toString()
      });

      this.assignedTaskPagedListConfig.filters.push({
        key: 'AssignerContactID', value: this.authService.currentUserStore.contact.id.toString(),
      });
    }

    this.myTaskSearch.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(value => {
        this.myTaskPagedListConfig.searchKey = value;
        this.myTaskPagedListConfig = Object.assign({}, this.myTaskPagedListConfig);
      });

    this.assignedTaskSearch.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(value => {
        this.assignedTaskPagedListConfig.searchKey = value;
        this.assignedTaskPagedListConfig = Object.assign({}, this.assignedTaskPagedListConfig);
      });

    this.myTaskEntityFilter.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(value => {
        this.myTaskPagedListConfig.filters = this.myTaskPagedListConfig.filters.filter(
          (i) => i.key !== this.entityFilterKey
        );
        value.forEach((element: string) => {
          this.addFilter(this.myTaskPagedListConfig, this.entityFilterKey, element);
        });
        this.myTaskPagedListConfig = Object.assign({}, this.myTaskPagedListConfig);
      });

    this.taskAssignedEntityFilter.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(value => {
        this.assignedTaskPagedListConfig.filters = this.assignedTaskPagedListConfig.filters.filter(
          (i) => i.key !== this.entityFilterKey
        );
        value.forEach((element: string) => {
          this.addFilter(this.assignedTaskPagedListConfig, this.entityFilterKey, element);
        });
        this.assignedTaskPagedListConfig = Object.assign({}, this.assignedTaskPagedListConfig);
      });
  }

  openRoute(routeCommand: string) {
    this.router.navigate([routeCommand]);
  }

  addFilter(pagedListConfig:PagedListConfig ,key: string, value: string) {
    const _filter = pagedListConfig.filters.find((obj) => {
      return obj.key === key && obj.value === value;
    });
    if (!_filter) {
      pagedListConfig.filters.push(
        new ApiFilter({ key: key, value: value })
      );
    }
  }

  openTaskDialog(task: WFTask) {
    console.log(task);
    if (task && task.entity?.toLowerCase() === this.config.NAMEOF_ENTITY_TODO.toLowerCase()) {
      this.openEntityDialog(TodoDialogComponent, 'Task', task.entityID ?? 0, 0, false, true, task);
    } else if (task && task.entity?.toLowerCase() === this.config.NAMEOF_ENTITY_MEETING.toLowerCase()) {
      this.openEntityDialog(MeetingDialogComponent, 'Task', task.entityID ?? 0, 0, false, true, task);
    } else if (task && task.entity?.toLowerCase() === this.config.NAMEOF_ENTITY_MEETING_AGENDA.toLowerCase()) {
      this.openEntityDialog(MeetingAgendaTaskDialogComponent, 'Task', task.entityID ?? 0, 0, false, true, task);
    } else if (task && task.entity?.toLowerCase() === this.config.NAMEOF_ENTITY_REQUEST_TICKET.toLowerCase()) {
      this.openEntityDialog(RequestTicketDialogComponent, 'Task', task.entityID ?? 0, 0, false, true, task);
    } else if (task && task.entity?.toLowerCase() === this.config.NAMEOF_ENTITY_LEAVE.toLowerCase()) {
      this.openEntityDialog(LeaveDialogComponent, 'Task', task.entityID ?? 0, 0, false, true, task)
    } else if (task && task.entity?.toLowerCase() === this.config.NAMEOF_ENTITY_SITE_VISIT.toLowerCase()) {
      this.openEntityDialog(SitevisitDialogComponent, 'Task', task.entityID ?? 0, 0, false, true, task)
    }
  }

  openEntityDialog(componentOrTemplateRef: ComponentType<unknown> | TemplateRef<unknown>, dialogTitle: string, entityID: number, entityTypeFlag: number, isCreateMode: boolean = false, isTaskmode: boolean = false, wfTask?: WFTask) {
    let _dialogData = new McvComponentDialogConfig();
    _dialogData.dialogTitle = dialogTitle;
    _dialogData.entityID = entityID;
    _dialogData.entityTypeFlag = entityTypeFlag;
    _dialogData.isCreateMode = isCreateMode;
    _dialogData.isTaskMode = isTaskmode;
    _dialogData.task = wfTask;
    const dialogRef = this.entityService.openDialog(componentOrTemplateRef, _dialogData, true);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        console.log('onClose', res);
      }
    });
  }

  onMyTasksListLoad(obj: any) {
    this.myTaskListCount = 0;
    if (obj && obj.totalRecordsCount) {
      this.myTaskListCount = obj.totalRecordsCount;
    }
  }

  onTeamTasksListLoad(obj: any) {
    this.teamTaskListCount = 0;
    if (obj && obj.totalRecordsCount) {
      this.teamTaskListCount = obj.totalRecordsCount;
    }
  }

  onAssignedTasksListLoad(obj: any) {
    this.assignedTaskListCount = 0;
    if (obj && obj.totalRecordsCount) {
      this.assignedTaskListCount = obj.totalRecordsCount;
    }
  }

  // searchMyTaskPagedList() {
  //   this.myTaskPagedListConfig = Object.assign({}, this.myTaskPagedListConfig);
  // }

  // searchAssignedTaskPagedList() {
  //   this.assignedTaskPagedListConfig = Object.assign({}, this.assignedTaskPagedListConfig);
  // }

  searchTeamTaskPagedList() {
    this.teamTaskPagedListConfig = Object.assign({}, this.teamTaskPagedListConfig);
  }

  onToggleTeamTaskShowToday() {
    this.teamTaskShowToday = !this.teamTaskShowToday;
    this.teamTaskPagedListConfig.filters = this.teamTaskPagedListConfig.filters.filter(x => x.key !== 'DueDate');
    if (this.teamTaskShowToday) {
      this.teamTaskPagedListConfig.filters = this.teamTaskPagedListConfig.filters.concat([{ key: 'DueDate', value: (new Date).toISOString() }]);
    }
    this.teamTaskPagedListConfig = Object.assign({}, this.teamTaskPagedListConfig);
  }

  onToggleAssignedTaskShowToday() {
    this.assignedTaskShowToday = !this.assignedTaskShowToday;
    this.assignedTaskPagedListConfig.filters = this.assignedTaskPagedListConfig.filters.filter(x => x.key !== 'DueDate');
    if (this.assignedTaskShowToday) {
      this.assignedTaskPagedListConfig.filters = this.assignedTaskPagedListConfig.filters.concat([{ key: 'DueDate', value: (new Date).toISOString() }]);
    }
    this.assignedTaskPagedListConfig = Object.assign({}, this.assignedTaskPagedListConfig);
  }

  onToggleMyTaskShowToday() {
    this.myTaskShowToday = !this.myTaskShowToday;
    this.myTaskPagedListConfig.filters = this.myTaskPagedListConfig.filters.filter(x => x.key !== 'DueDate');
    if (this.myTaskShowToday) {
      this.myTaskPagedListConfig.filters = this.myTaskPagedListConfig.filters.concat([{ key: 'DueDate', value: (new Date).toISOString() }]);
    }
    this.myTaskPagedListConfig = Object.assign({}, this.myTaskPagedListConfig);
  }

  clearMyTaskSearch(): void {
    this.myTaskSearch.setValue(null); // Clear input field
  }

  clearAssignedTaskSearch(): void {
    this.assignedTaskSearch.setValue(null); // Clear input field
  }
}
