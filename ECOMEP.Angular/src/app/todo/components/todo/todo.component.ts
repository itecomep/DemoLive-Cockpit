import { Component, effect, EventEmitter, inject, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { Validators, FormControl, FormBuilder, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Contact } from 'src/app/contact/models/contact';
import { Observable, firstValueFrom, forkJoin } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, take } from 'rxjs/operators';

import { TodoApiService } from '../../services/todo-api.service';
import { ContactApiService } from 'src/app/contact/services/contact-api.service';
import { ProjectApiService } from 'src/app/project/services/project-api.service';
import { TodoAttachmentApiService } from '../../services/todo-attachment-api.service';
import { McvFileUtilityService } from 'src/app/mcv-file/services/mcv-file-utility.service';


import { TodoAgenda } from '../../models/todo-agendaas';
import { WFTask } from 'src/app/wf-task/models/wf-task.model';
import { Project, ProjectAttachment } from 'src/app/project/models/project.model';
import { Todo, TodoAttachment } from '../../models/todo.model';
import { MeetingAgenda } from 'src/app/meeting/models/meeting-agenda.model';
import { AppConfig } from 'src/app/app.config';
import { AuthService } from 'src/app/auth/services/auth.service';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { WFTaskApiService } from 'src/app/wf-task/services/wf-task-api.service';
import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
import { McvActivityListComponent } from 'src/app/mcv-activity/components/mcv-activity-list/mcv-activity-list.component';
import { McvFileUploadConfig } from 'src/app/mcv-file/models/mcv-file-upload-config.model';
import { McvTimeEntryTimeLineComponent } from 'src/app/mcv-time-entry/components/mcv-time-entry-time-line/mcv-time-entry-time-line.component';
import { McvComponentConfig } from 'src/app/shared/models/mcv-component-config';
import { TimeEntryDto } from 'src/app/shared/models/time-entry-dto';
import { McvTagEditorComponent } from '../../../mcv-tag-editor/components/mcv-tag-editor/mcv-tag-editor.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { WfTaskActionComponent } from '../../../wf-task/components/wf-task-action/wf-task-action.component';
import { McvTimeEntryListComponent } from '../../../mcv-time-entry/components/mcv-time-entry-list/mcv-time-entry-list.component';
import { TodoAgendaComponent } from '../todo-agenda/todo-agenda.component';
import { TodoMeetingAgendaComponent } from '../todo-meeting-agenda/todo-meeting-agenda.component';
import { McvFileComponent } from '../../../mcv-file/components/mcv-file/mcv-file.component';
import { McvFileUploadComponent, UploadResult } from '../../../mcv-file/components/mcv-file-upload/mcv-file-upload.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { WftaskTitleBarComponent } from '../../../wf-task/components/wftask-title-bar/wftask-title-bar.component';
import { AsyncPipe, DatePipe, CommonModule } from '@angular/common';
import { ApiFilter } from 'src/app/shared/models/api-filters';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SubTodoUpdateDialogComponent } from '../sub-todo-update-dialog/sub-todo-update-dialog.component';
import { SubTodoDialogComponent } from '../sub-todo-dialog/sub-todo-dialog.component';
import { TodoAgendaApiService } from '../../services/todo-agenda-api.service';
import { TodoDmsFolderNavigatorComponent } from '../todo-dms-folder-navigator/todo-dms-folder-navigator.component';
import { ProjectAttachmentApiService } from 'src/app/project/services/project-attachment-api.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    MatDatepickerModule,
    NgxMaterialTimepickerModule,
    TextFieldModule,
    MatButtonModule,
    MatTooltipModule,
    AsyncPipe,
    DatePipe,
    
    //Components
    WftaskTitleBarComponent,
    McvFileUploadComponent,
    McvFileComponent,
    TodoMeetingAgendaComponent,
    TodoAgendaComponent,
    McvTimeEntryListComponent,
    WfTaskActionComponent,
    McvActivityListComponent,
    McvTagEditorComponent,
    SubTodoUpdateDialogComponent,
    SubTodoDialogComponent,
    MatCheckboxModule,
  ]
})
export class TodoComponent implements OnInit
{

  entityService = inject(TodoApiService);
  contactService = inject(ContactApiService);
  projectService = inject(ProjectApiService);
  mcvFileUtilityService = inject(McvFileUtilityService);
  attachmentService = inject(TodoAttachmentApiService);
  wfTaskService = inject(WFTaskApiService);
  appSettingService = inject(AppSettingMasterApiService);
  utilityService = inject(UtilityService);
  formBuilder = inject(FormBuilder);
  ngZone = inject(NgZone);
  config = inject(AppConfig);
  authService = inject(AuthService);
  matDialog = inject(MatDialog);
  agendaService = inject(TodoAgendaApiService);
  projectAttachmentService = inject(ProjectAttachmentApiService);

  currentEntity: Todo = new Todo();
  nameOfEntity = this.config.NAMEOF_ENTITY_TODO;
  entityID!: number;
  task: WFTask | any;
  isCreateMode: boolean = false;
  isTaskMode: boolean = false;
  entityTypeFlag: number = 0;
  configData: any;
  isDuplicated: boolean = false;
  blobConfig!: McvFileUploadConfig;
  subTodos: Todo[] = [];
  treeData: ProjectAttachment[] = [];
  filesToUpload: UploadResult[] = [];
  projectFiles: ProjectAttachment[] = [];
  checklistTree: any[] = [];
  expandedStages: Set<number> = new Set();
  expandedCategories: Set<string> = new Set();

  disableArray: any[] = [
    {taskStatusFlag: 1, taskOutcomeFlag: 2},
    {taskStatusFlag: 3, taskOutcomeFlag: 1}
  ];

  @ViewChild(McvTimeEntryTimeLineComponent) protected timeline!: McvTimeEntryTimeLineComponent;
  @ViewChild(McvActivityListComponent) protected activity!: McvActivityListComponent;

  @Input('config') set configValue(value: McvComponentConfig)
  {
    // console.log('McvComponentConfig', value);
    if (value)
    {
      this.configData = value;
      this.entityID = value.entityID;
      this.task = value.task;
      this.isCreateMode = value.isCreateMode;
      this.isTaskMode = value.isTaskMode;
      this.entityTypeFlag = value.entityTypeFlag;
      this.currentEntity = value.currentEntity;
      this.isDuplicated = value.isCreateMode && value.currentEntity;
      this.refresh();
    }
  }

  @Output() create = new EventEmitter<any>();
  @Output() update = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() taskComplete = new EventEmitter<WFTask>();
  @Output() submit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();

  @ViewChild('autosize') protected autosize!: CdkTextareaAutosize;

  form: any;
  get f(): any { return this.form.controls; }

  get isMobileView(): boolean { return this.utilityService.isMobileView; }

  readonly PRIORITY_NORMAL = this.config.TODO_PRIORITY_NORMAL; 
  readonly PRIORITY_HIGH = this.config.TODO_PRIORITY_HIGH; 
  readonly PRIORITY_LOW = this.config.TODO_PRIORITY_LOW; 

  readonly STATUSFLAG_ACTIVE = 0;
  readonly STATUSFLAG_COMPLETED = 1;
  readonly STATUSFLAG_DROPPED = 2;
  readonly TASK_STAGE_TODO_WORK = this.config.TASK_STAGE_TODO_WORK;
  readonly TASK_STAGE_TODO_REVIEW = this.config.TASK_STAGE_TODO_REVIEW;
  readonly TASK_STAGE_TODO_RE_ASSIGN = this.config.TASK_STAGE_TODO_RE_ASSIGN;

  contactOptions: Contact[] = [];
  contactFilter = [{ key: 'UsersOnly', value: 'true' }];
  priorityOptions: string[] = ['HIGH','NORMAL','LOW'];
  filteredContacts$!: Observable<Contact[]>;

  projectOptions: any[] = [];
  projectFilter:ApiFilter[] = [
    { key: 'StatusFlag', value: this.config.PROJECT_STATUS_FLAG_INPROGRESS.toString() },
    { key: 'StatusFlag', value: this.config.PROJECT_STATUS_FLAG_PREPROPOSAL.toString() },
  ];
  filteredProjects$!: Observable<Project[]>;

  subjectOptions: any[] = [];
  subjectFilter = [];
  filteredSubjects$!: Observable<string[]>;

  selectedAssignee: Contact | null = null;
  completeValidationMessage = 'To enable the Pause button, check at least one checklist item and add an attachment. To enable the Complete button, check all checklist items and add at least one attachment. Pause button will atuomatically be disabled after 15 minutes of uploading an attachment.';

  titleTypeOptions: string[] = ['Project', 'Custom'];

  now = new Date();
  minutesGap = 5;
  timePickerMinutesGap = 5;

  isAssigneeReadonly: boolean = false;
  get isPermissionEdit(): boolean
  {
    return this.entityService.isPermissionEdit;
  }
  get isPermissionDelete(): boolean
  {
    return this.entityService.isPermissionDelete;
  }
  get isPermissionTodoSpecialEdit(): boolean
  {
    return this.entityService.isPermissionSpecialEdit;
  }
  get isPermissionTodoSpecialDelete(): boolean
  {
    return this.entityService.isPermissionSpecialDelete;
  }
  get isPermissionTodoMediaUpload(): boolean
  {
    return this.entityService.isPermissionTodoMediaUpload;
  }

  get currentUser(){
    return this.authService.currentUserStore?.contact;
  }
  allowEdit: boolean = false;
  allowDelete: boolean = false;

  tagOptions: string[] = [];

  constructor(
  ) {
    effect(() => {
      console.log("Copied Files Updated:", this.entityService.copied);
      if (this.entityService.copied.length > 0) {
        const _newFile: any = this.entityService.copied[this.entityService.copied.length - 1];
        const fileExists = this.filesToUpload.some(file => file.url === _newFile.url);

        if (!fileExists) {
          this.filesToUpload.push(new UploadResult(_newFile.url, _newFile.filename, _newFile.size, _newFile.contentType, _newFile.blobPath));
        }
      }
    });
  }

  async ngOnInit()
  {
    if (!this.form)
    {
      this.buildForm();
    }

    if (!this.appSettingService.presets || !this.appSettingService.presets.length)
    {
      await this.appSettingService.loadPresets();
    }
    const preset = this.appSettingService.presets.find(x => x.presetKey == this.config.PRESET_BLOB_CONTAINER_ATTACHMENTS);
    if (preset)
    {
      this.blobConfig = new McvFileUploadConfig(preset.presetValue, `${this.nameOfEntity}`);
    }

    if (!this.authService.isRoleMaster
      && !this.entityService.isPermissionSpecialShowAll
      && this.authService.currentUserStore?.teams
      && this.authService.currentUserStore?.teams.length > 0) {
      this.projectFilter.push(...this.authService.currentUserStore?.teams.map(x => new ApiFilter({ key: 'teamID', value: x.id.toString() })));
    }

    if (!this.form) this.buildForm();
    this.getContactOptions();
    this.getProjectOptions();
    this.getTitleOptions();
    await this.loadChecklistTree();
  }

  refresh()
  {
    if (!this.form) this.buildForm();
    if (!this.currentEntity) this.currentEntity = new Todo();

    if (!this.isCreateMode)
    {
      this.getCurrent(this.entityID);
    } else
    {
      this.checkPermissions();
      if (this.isDuplicated)
      {
        this.bindForm(this.currentEntity);
      } else
      {
        // this.getTitleOptions();
      }
    }

  }
  touchForm()
  {
    //touch form inputs to show validation messages
    if (this.form)
    {
      Object.keys(this.form.controls).forEach(field =>
      {
        // {1}
        const control = this.form.get(field); // {2}
        control.markAsTouched({ onlySelf: true }); // {3}
      });
    }
  }

  resetForm()
  {
    if (this.form)
    {
      this.form.reset();
    }
  }

  triggerResize()
  {
    // Wait for changes to be applied, then trigger textarea resize.
    this.ngZone.onStable
      .pipe(take(1))
      .subscribe(() => { if (this.autosize) { this.autosize.resizeToFitContent(true) } });
  }

  getErrorMessage(control: AbstractControl)
  {
    return this.utilityService.getErrorMessage(control);
  }
  dateFilter = (d: Date): boolean =>
  {
    // Prevent Saturday and Sunday from being selected.
    // if (d.getDay() === 0) {
    //   return false;
    // }
    const date = new Date();
    date.setDate(date.getDate() - 1);

    if (d < date)
    {
      return false;
    }
    return true;
  }

  private checkPermissions()
  {

    this.allowEdit = false;
    this.allowDelete = false;

    if (this.isCreateMode)
    {
      this.allowEdit = true;
    }
    else if (this.currentEntity
      && this.currentEntity.statusFlag === this.STATUSFLAG_ACTIVE)
    {

      if (this.authService.currentUserStore != null)
      {

        this.allowEdit = this.isPermissionTodoSpecialEdit
          || (this.isPermissionEdit
            && Boolean(this.currentEntity.assignerContactID)
            && this.authService.currentUserStore.contact
            && this.currentEntity.assignerContactID === this.authService.currentUserStore.contact.id);

        this.allowDelete = (this.isPermissionTodoSpecialDelete) as boolean
          || (this.isPermissionDelete
            && Boolean(this.currentEntity.assignerContactID) && this.authService.currentUserStore.contact
            && this.currentEntity.assignerContactID === this.authService.currentUserStore.contact.id);
      }

      if (this.isTaskMode)
      {
        this.isAssigneeReadonly = true;
        // this.allowEdit = false;
        // this.allowDelete = false;
        if (this.task.wfStageCode === this.TASK_STAGE_TODO_RE_ASSIGN)
        {
          // this.allowEdit = true;
          this.isAssigneeReadonly = false;
        }
      }

    }

    // this.resetForm();
    if (!this.isCreateMode)
    {
      if (!this.allowEdit)
      {
        this.form.disable();
      } else
      {
        this.f['title'].disable();
        this.f['titleType'].disable();
        this.f['assignee'].disable();
        // if (this.isAssigneeReadonly)
        // {
        // }
      }
    }
  }

  buildForm()
  {

    this.form = this.formBuilder.group({
      assignee: new FormControl<any>(new Contact, { nonNullable: true, validators: [Validators.required] }),
      titleType: new FormControl<any>(null),
      title: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
      subTitle: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
      priority: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required] }),
      dueDate: new FormControl<any>(new Date, { nonNullable: true, validators: [Validators.required] }),
      dueTime: new FormControl<any>(null),
      comment: new FormControl<any>(null),
      mHrAssigned: new FormControl<any>(0.5, { nonNullable: true, validators: [Validators.required, Validators.min(0.5)] })
    });

    this.f['titleType'].setValue('Custom');
    this.f['titleType'].disable();
    this.getProjectOptions();

    // this.f['mHrAssigned'].setValue(1);
    this.f['dueDate'].setValue(new Date(), { emitEvent: false });
    this.f['dueTime'].setValue(this.utilityService.getTimeValue(new Date(), this.minutesGap), { emitEvent: false });

    if (this.isCreateMode)
    {
      if (this.isDuplicated)
      {
        this.f['titleType'].disable();
        this.f['title'].disable();
      }
    } else
    {
      this.f['subTitle'].setValidators([]);
    }


    this.f['assignee'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
    ).subscribe((value: any) =>
    {
      if (value)
      {
        this.onAssigneeSelect(value);
      }
    });

    this.filteredContacts$ = this.f['assignee'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),

      map(value => value ? (typeof value === 'string' ? value : (value as Contact).name) : null),
      map(name => name ? this.filterContacts(name as string) : this.contactOptions.slice()),

    );

    this.f['titleType'].valueChanges
      .pipe(debounceTime(400))
      .subscribe(
        (value: any) =>
        {
          if (value && !this.isDuplicated)
          {
            this.f['title'].reset();
          }
        }
      );

    this.filteredProjects$ = this.f['title'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),

      map(value => typeof value === 'string' ? value : (value != null ? (value as Project).code + ' ' + (value as Project).title : null)),
      map(value => value ? this.filterProjectOptions(value as string) : this.projectOptions.slice()),
    );

    this.filteredSubjects$ = this.f['title'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      map(value => value ? this.filterTitleOptions(value as string) : this.subjectOptions.slice()),
    );

    this.f['title'].valueChanges
      .pipe(debounceTime(400))
      .subscribe(
        (value: any) =>
        {
          if (value && this.isCreateMode && !this.isDuplicated)
          {

            if (typeof value === 'string')
            {
              this.currentEntity.title = value;
              this.currentEntity.entity = '';
              this.currentEntity.entityID = 0;
            } else
            {
              this.currentEntity.title = value.code + '-' + value.title;
              this.currentEntity.entity = this.config.NAMEOF_ENTITY_PROJECT;
              this.currentEntity.entityID = value.id;
              this.currentEntity.projectID = value.id;
            }
          }
        }
      );

    this.touchForm();
  }

  private bindForm(entity: Todo)
  {
    if (entity)
    {
      if (entity.assignee)
      {
        this.f['assignee'].setValue(entity.assignee);
      }

      this.f['titleType'].setValue(entity.projectID ? 'Project' : 'Custom');
      if (entity.projectID)
      {
        const _project = this.projectOptions.find(x => x.id == entity.projectID);
        if (!_project)
        {

          this.projectService.getById(entity.projectID).subscribe((data: Project) =>
          {

            this.projectOptions.push(data);
            // console.log('get project', data, this.projectOptions);
            this.f['title'].setValue(data);
          });
        } else
        {
          // console.log('from options', _project);
          this.f['title'].setValue(_project);
        }
      } else
      {
        this.f['title'].setValue(entity.title, { emitEvent: false });
      }

      this.f['subTitle'].setValue(entity.subTitle);
      this.f['dueDate'].setValue(entity.dueDate);
      this.f['priority'].setValue(entity.priority);
      this.f['dueTime'].setValue(this.utilityService.getTimeValue(entity.dueDate, this.timePickerMinutesGap));

      if (entity.comment)
      {
        this.f['comment'].setValue(entity.comment);
      }
      this.f['mHrAssigned'].setValue(entity.mHrAssigned);
    }

  }

  async getContactOptions()
  {
    this.contactOptions = await firstValueFrom(this.contactService.get(this.contactFilter, '', 'fullName'));
  }

  filterContacts(property: string): any[]
  {
    return this.contactOptions.filter(option => option ? option.name.toLowerCase().includes(property.toLowerCase()) : false);
  }

  displayFnContact(option?: Contact): string
  {
    return option ? option.name : '';
  }
  private getTitleOptions()
  {
    this.entityService.getFieldOptions('Title').subscribe(
      data =>
      {
        this.subjectOptions = data;
      });
  }

  private filterTitleOptions(property: string): any[]
  {
    return this.subjectOptions.filter(option => option ? option.toLowerCase().includes(property.toLowerCase()) : false);
  }

  displayFnTitle(option?: any): string
  {
    return option ? option : '';
  }

  private getProjectOptions()
  {
    this.projectService.get(this.projectFilter).subscribe((data: any) => this.projectOptions = data);
  }

  private filterProjectOptions(property: string): any[]
  {

    return this.projectOptions.filter(option => option ? (option.code + '-' + option.title).toLowerCase().includes(property.toLowerCase()) : false);
  }

  displayFnProject(option?: any): string
  {
    return option ? (option.code + '-' + option.title) : '';
  }

  meetingAgendaList: MeetingAgenda[] = [];
  protected async getCurrent(id: number)
  {
    this.currentEntity = await firstValueFrom(this.entityService.getById(id));
    if(this.currentEntity.projectID){
      this.buildTodoDMS();
    }
    if(this.currentEntity.assignerContactID == this.currentUser?.id){
      await this.getTodoChildren();
    }
    this.checkPermissions();
    this.bindForm(this.currentEntity);
    this.setAgendaConfig();
    // this.meetingAgendaList = await firstValueFrom(this.meetingAgendaService.get([{ key: 'TodoID', value: this.currentEntity.id.toString() }]));
  }

  onAssigneeBlur(e: any)
  {
    if (!this.selectedAssignee || this.selectedAssignee !== this.f['assignee'].value)
    {
      this.f['assignee'].setValue(null);
      this.selectedAssignee = null;
    }
  }
  onAssigneeSelect(item: Contact)
  {
    if (item && item.id)
    {
      this.selectedAssignee = item;
    }
  }


  onSubmit(task?: WFTask)
  {
    if (this.form.invalid)
    {
      this.touchForm();
      this.utilityService.showSweetDialog('Invalid Form',
        'Please fill all required fields with valid data and try again.', 'error'
      );
      return;
    }

    // this.currentEntity.title = this.f['title'].value; Set via valuchanges

    if (!this.currentEntity.title || this.currentEntity.title.length === 0)
    {
      this.utilityService.showSweetDialog('title is blank!',
        'Please enter a valid title and try again!', 'error'
      );
      return;
    }


    if (!this.f['assignee'].value)
    {
      this.utilityService.showSweetDialog('Assignee not selected!',
        'Please select a contact from the list as assignee and try again!', 'error'
      );
      return;
    }

    if (this.isCreateMode && this.authService.currentUserStore)
    {
      this.currentEntity.assignerContactID = this.authService.currentUserStore.contact.id;
    }
    this.currentEntity.subTitle = this.f['subTitle'].value;
    this.currentEntity.assigneeContactID = this.f['assignee'].value ? (this.f['assignee'].value as Contact).id : 0;
    this.currentEntity.dueDate = this.utilityService.setTimeValue(this.f['dueDate'].value, this.f['dueTime'].value);
    this.currentEntity.comment = this.f['comment'].value;
    this.currentEntity.priority = this.f['priority'].value;
    this.currentEntity.mHrAssigned = this.f['mHrAssigned'].value;

    if (this.isCreateMode)
    {
      this.entityService.create(this.currentEntity).subscribe(
        (data: any) =>
        {
          this.currentEntity = Object.assign({}, data);
          this.utilityService.showSwalToast(
            'Success!',
            'Save successful.',
          );


          this.create.emit(data);
          this.entityService.refreshList();
          this.uploadFiles();
        }
      );

    } else
    {
      this.entityService.update(this.currentEntity).subscribe(
        (data) =>
        {
          this.utilityService.showSwalToast(
            'Success!',
            'Save successful.',
          );
          this.currentEntity = data;
          this.update.emit(data);
          this.entityService.refreshList();
          if (task)
          {
            console.log('Trigger Task complete');
            this.wfTaskService.completeTask(task);
          }
        }
      );
    }
    //   }
    // );

  }

  onDelete()
  {
    const _messageText = `Delete ${this.nameOfEntity}: ` + this.currentEntity.title;
    this.utilityService.showConfirmationDialog(_messageText,
      async () =>
      {
        await firstValueFrom(this.entityService.delete(this.currentEntity.id))
        this.utilityService.showSwalToast(
          'Success!',
          'Delete successful.',
        );

        this.delete.emit(this.currentEntity);
        this.entityService.refreshList();

      }
    );
  }

  onStartFlow()
  {
    const _messageText = 'You want restart flow for '
      + this.currentEntity.title
      + '. All previously pending tasks will be deleted!.';
    this.utilityService.showConfirmationDialog(_messageText,
      () =>
      {
        this.entityService.startFlow(this.currentEntity.id).subscribe(
          () =>
          {
            this.utilityService.showSwalToast(
              'Success!',
              'Save successful.',
            );
            this.update.emit(this.currentEntity);
          }
        );
      }
    );
  }

  get isAgendasLength(){
    const _agendas = this.currentEntity.agendas.length;
    return _agendas;
  }

  get isCheckedAgenda() {
    // StatusFlag 1 means which are ticked
    const _pendingAgenda = this.currentEntity.agendas.filter(x => x.statusFlag === 1);
    return _pendingAgenda.length;
  }

  get isAttachmentPending() {
    const _attachments = this.task.attachments;
    return _attachments.length;
  }

  // get isAgendaPending(): boolean
  // {
  //   const _pendingAgenda = this.currentEntity.agendas.filter(x => x.statusFlag === 0);
  //   if (_pendingAgenda.length !== 0)
  //   {
  //     return true;
  //   }
  //   return false;
  // }

  // get isAttachmentPending(): boolean
  // {
  //   const _attachments = this.task.attachments.filter((x :any)=> x.statusFlag === 0);
  //   if (_attachments.length == 0)
  //   {
  //     return true;
  //   }
  //   return false;
  // }

  onTagsUpdate(tags: string[])
  {
    if (tags)
    {
      this.currentEntity.searchTags = tags;
      this.entityService.update(this.currentEntity).subscribe(
        (data) =>
        {
        }
      );
    }
  }

  onDuplicate()
  {
    var _todo = new Todo(this.currentEntity);
    _todo.id = 0;
    _todo.projectID = this.currentEntity.projectID;
    _todo.agendas = this.currentEntity.agendas.map(x =>
    {
      x.todoID = 0;
      x.id = 0;
      return x;
    });
    // console.log('duplicate', _todo, this.currentEntity.agendas);
    const dialogRef = this.entityService.openCreateDialog(_todo);
    dialogRef.afterClosed().subscribe(res =>
    {
      if (res)
      {
        // console.log('onClose', res);
      }
    });
  }


  onDeleteAttachment(item: any)
  {
    this.attachmentService.delete(item.id).subscribe(value =>
    {
      this.delete.emit(item);
    });
    this.currentEntity.attachments = this.currentEntity.attachments.filter(x => x.id !== item.id);
  }

  onDownloadAttachment(item: any)
  {
    window.open(item.url);
  }

  uploadQueue: UploadResult[] = [];
  onUpload(uploads: UploadResult[])
  {
    if (!this.isCreateMode)
    {
      uploads.forEach(x =>
      {
        this.uploadQueue.push(x);
      });
      // console.log(this.uploadQueue);
      this.uploadFiles();
    } else
    {
      //Creating a dummy object
      uploads.forEach(x =>
      {
        let obj = new TodoAttachment();
        obj.filename = x.filename;
        obj.size = x.size;
        obj.contentType = x.contentType;
        obj.guidname = x.blobPath;
        obj.blobPath = x.blobPath;
        obj.todoID = this.currentEntity.id;
        obj.container = this.blobConfig.container;
        obj.typeFlag = this.currentEntity.typeFlag;
        obj.url = x.url;
        this.currentEntity.attachments.push(obj);
        this.uploadQueue.push(x);
      });
      // console.log(this.currentEntity.attachments,this.uploadQueue);
    }
  }

  private async uploadFiles()
  {
    let _createRequests: Observable<any>[] = [];
    this.uploadQueue.forEach(x =>
    {
      let obj = new TodoAttachment();
      obj.filename = x.filename;
      obj.size = x.size;
      obj.contentType = x.contentType;
      obj.guidname = x.blobPath;
      obj.blobPath = x.blobPath;
      obj.todoID = this.currentEntity.id;
      obj.container = this.blobConfig.container;
      obj.typeFlag = 0;
      obj.url = x.url;
      obj.originalUrl = x.url;
      _createRequests.push(this.attachmentService.create(obj));
    });
    this.uploadQueue = [];

    const results = await firstValueFrom(forkJoin(_createRequests))
    this.currentEntity.attachments.push(...results);

    if (this.isCreateMode)
    {
      this.create.emit(this.currentEntity);
    }
  }

  getFilteredAttachments(attachments: TodoAttachment[], typeFlag: number, isMedia: boolean)
  {
    return isMedia ?
      attachments.filter(x => x.typeFlag == typeFlag
        && (this.mcvFileUtilityService.isImage(x.filename) || this.mcvFileUtilityService.isVideo(x.filename) || this.mcvFileUtilityService.isAudio(x.filename))
      ) :
      attachments.filter(x => x.typeFlag == typeFlag
        && !(this.mcvFileUtilityService.isImage(x.filename) || this.mcvFileUtilityService.isVideo(x.filename) || this.mcvFileUtilityService.isAudio(x.filename))
      );
  }

  onAddAttachmentTag(tags: string[], file: TodoAttachment)
  {
    file.searchTags = tags;
    this.attachmentService.update(file).subscribe(data =>
    {
      file = Object.assign({}, file);
    });
  }

  agendaConfig: any;
  private setAgendaConfig()
  {
    this.agendaConfig = {
      isReadOnly: !this.isPermissionEdit || this.currentEntity.statusFlag != this.config.TODO_STATUS_FLAG_ACTIVE,
      todo: this.currentEntity,
      agenda: this.currentEntity.agendas,
      updateDatabase: true,
      isCheckboxMode: (this.isTaskMode && this.task.wfStageCode == this.TASK_STAGE_TODO_WORK)
    };
  }

  onAgendaUpdate(event: TodoAgenda[]) {
    this.currentEntity.agendas = event;
    this.setAgendaConfig();
  }

  onCancel()
  {
    this.cancel.emit();
  }



  onTaskCompleted(e: any)
  {
    this.wfTaskService.activeTask = undefined;
    this.taskComplete.emit(e);
    this.cancel.emit(e);
  }

  onTaskUpdated(e: any)
  {
    this.task = Object.assign({}, e);
    if (this.timeline)
    {
      this.timeline.refresh();
    }
  }

  onRefresh(event: any)
  {
    this.currentEntity = event;
  }

  onCreate(event: any)
  {
    this.create.emit(event);
  }

  onUpdate(event: any)
  {

    this.update.emit(event);
  }


  onRemoveTimeEntry(obj: TimeEntryDto)
  {
    if (this.task)
    {
      this.task.timeEntries = this.task.timeEntries.filter((x: any) => x.id !== obj.id);
    }
    if (this.timeline)
    {
      this.timeline.refresh();
    }
  }

  onUpdateTimeEntries(task: WFTask)
  {
    if (this.task)
    {
      this.task = Object.assign({}, task);
    }
  }

  //Below code is for sub-todos
  async getTodoChildren() {
    const _filter: ApiFilter[] = [{ key: 'ParentID', value: this.currentEntity.id.toString() }];
    const _todos = await firstValueFrom(this.entityService.get(_filter));
    // console.log(_todos);
    this.subTodos = _todos;
  }

  async onAddSubTodo() {
    const _dialogConfig = new MatDialogConfig();
    _dialogConfig.disableClose = true;
    _dialogConfig.autoFocus = true;

    const dialogRef = this.matDialog.open(SubTodoDialogComponent, _dialogConfig);
    dialogRef.afterClosed().subscribe(async (result: Todo) => {
      if (result) {
        result.parentID = this.currentEntity.id;
        const _attachment = result.attachments;
        const _agenda = result.agendas;
        const _todo = await firstValueFrom(this.entityService.create(result));

        if (_todo && _attachment.length > 0) {
          const attachmentObservables = _attachment.map(attachment => {
            attachment.todoID = _todo.id;
            return this.attachmentService.create(attachment);
          });
          _todo.attachments = await firstValueFrom(forkJoin(attachmentObservables));
        }

        if (_todo && _agenda.length > 0) {
          const agendaObservables = _agenda.map(agenda => {
            agenda.todoID = _todo.id;
            return this.agendaService.create(agenda);
          });
          _todo.agendas = await firstValueFrom(forkJoin(agendaObservables));
        }
        this.subTodos.push(_todo);
      }
    });
  }

  onEditSubTodo(todo: Todo, index: number) {
    if (index > -1) {
      let _todo = this.subTodos[index];
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = {
        todo: _todo
      };

      const _dialogRef = this.matDialog.open(SubTodoUpdateDialogComponent, dialogConfig);
      _dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          if (result.isUpdate === true) {
            let _index = this.subTodos.findIndex(x => x.id == result.todo.id);
            if (_index > -1) {
              this.subTodos[_index] = result.todo;
              this.utilityService.showSwalToast('Success!', 'Update successful.');
            }
          } else {
            this.subTodos.push(result);
          }
        }
      });
    }
  }

  onDeleteSubTodo(todo: Todo, index: number) {
    this.utilityService.showConfirmationDialog('Are you sure you want to delete this sub-todo?', async () => {
      if (index > - 1) {
        await firstValueFrom(this.entityService.delete(todo.id));
        this.subTodos.splice(index, 1);
      }
    });
  }

  async onDeleteSubTodoAttachment(index: number, file: TodoAttachment) {
    await firstValueFrom(this.attachmentService.delete(file.id));
    this.subTodos[index].attachments = this.subTodos[index].attachments.filter(x => x.id !== file.id);
  }

  getTreeMapFromList(data: ProjectAttachment[]): ProjectAttachment[] {
    // Create a map to store references to each item by ID
    const idMapping = data.reduce((acc: Record<number, number>, el, i) => {
      acc[el.id] = i;
      return acc;
    }, {});

    // Clone the data to avoid mutating the original array
    const _list = data.map(item => ({ ...item, children: [] as ProjectAttachment[], level: 0 }));

    const roots: ProjectAttachment[] = [];

    _list.forEach(el => {
      // Check if it's a root element
      if (el.parentID === null || el.parentID === undefined) {
        el.level = 0; // Root level
        roots.push(new ProjectAttachment(el));
        return;
      }

      // Locate the parent element
      const parentIndex = idMapping[el.parentID];
      if (parentIndex !== undefined) {
        const parentEl = _list[parentIndex];
        el.level = parentEl.level + 1; // Increment level based on parent
        parentEl.children!.push(new ProjectAttachment(el));
      }
    });

    return roots;
  }

  async buildTodoDMS() {
    if(this.currentEntity.projectID){
      this.projectFiles = await firstValueFrom(this.projectAttachmentService.get([{ key: 'projectid', value: this.currentEntity.projectID.toString() }]))
      this.projectFiles.sort((a, b) => a.filename.localeCompare(b.filename));
      this.treeData = this.getTreeMapFromList(this.projectFiles);
    }
  }

  onOpenTodoDMS() {
    const _dialogConfig = new MatDialogConfig();
    _dialogConfig.autoFocus = true;
    _dialogConfig.disableClose = true;
    _dialogConfig.panelClass = 'mcv-fullscreen-dialog';
    _dialogConfig.data = {
      treeData: this.treeData,
      projectID: this.currentEntity.projectID
    }

    const _dialogRef = this.matDialog.open(TodoDmsFolderNavigatorComponent, _dialogConfig);
    _dialogRef.afterClosed().subscribe(res => { 
      this.onUpload(this.filesToUpload);
      this.filesToUpload = [];
      this.entityService.clearCopied();
    });
  }

  async loadChecklistTree() {
    this.checklistTree = await firstValueFrom(
      this.entityService.getStageTree()
    );
    console.log('Checklist Tree:', this.checklistTree);
  }

  async onTreeChecklistToggle(item: any, stage: any, category: any) {
    const fullTitle = `${stage.title} -> ${category.title}: ${item.title}`;
    if (!this.currentEntity.agendas) {
      this.currentEntity.agendas = [];
    }
    const index = this.currentEntity.agendas.findIndex(x => x.title === fullTitle);

    if (index > -1) {
      const agendaToDelete = this.currentEntity.agendas[index];
      if (agendaToDelete.id) {
        await firstValueFrom(this.agendaService.delete(agendaToDelete.id));
      }
      this.currentEntity.agendas.splice(index, 1);
    } else {
      let newAgenda = new TodoAgenda();
      newAgenda.title = fullTitle;
      newAgenda.statusFlag = 0;
      newAgenda.todoID = this.currentEntity.id;
      const saved = await firstValueFrom(this.agendaService.create(newAgenda));
      this.currentEntity.agendas.push(saved);
    }
    this.onAgendaUpdate(this.currentEntity.agendas);
  }

  isChecklistSelected(stage: any, category: any, item: any): boolean {
    if (!this.currentEntity.agendas) return false;
    const fullTitle = `${stage.title} -> ${category.title}: ${item.title}`;
    return this.currentEntity.agendas.some(x => x.title === fullTitle);
  }

  toggleStage(stage: any, index: number) {
    if (this.expandedStages.has(index)) {
      this.expandedStages.delete(index);
    } else {
      this.expandedStages.add(index);
    }
  }

  toggleCategory(stageIndex: number, categoryIndex: number) {
    const key = `${stageIndex}-${categoryIndex}`;
    if (this.expandedCategories.has(key)) {
      this.expandedCategories.delete(key);
    } else {
      this.expandedCategories.add(key);
    }
  }
}
