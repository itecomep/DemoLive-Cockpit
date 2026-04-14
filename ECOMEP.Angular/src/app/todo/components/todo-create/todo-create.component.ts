import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';

import { Observable, debounceTime, distinctUntilChanged, map, forkJoin, ObservableInput, switchMap, of } from 'rxjs';

import { TodoAgenda } from '../../models/todo-agendaas';
import { Contact } from 'src/app/contact/models/contact';
import { WFTask } from 'src/app/wf-task/models/wf-task.model';
import { Project } from 'src/app/project/models/project.model';
import { Todo, TodoAttachment } from '../../models/todo.model';

import { TodoApiService } from '../../services/todo-api.service';
import { TodoAgendaApiService } from '../../services/todo-agenda-api.service';
import { ContactApiService } from 'src/app/contact/services/contact-api.service';
import { ProjectApiService } from 'src/app/project/services/project-api.service';
import { TodoAttachmentApiService } from '../../services/todo-attachment-api.service';
import { McvFileUtilityService } from 'src/app/mcv-file/services/mcv-file-utility.service';

import { BlobUploadInfo } from 'src/app/mcv-file/models/mcv-blob-upload-info.model';
import { MatAutocompleteSelectedEvent, MatAutocompleteModule } from '@angular/material/autocomplete';
import { AppConfig } from 'src/app/app.config';
import { AuthService } from 'src/app/auth/services/auth.service';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { WFTaskApiService } from 'src/app/wf-task/services/wf-task-api.service';
import { TextFieldModule } from '@angular/cdk/text-field';
import { McvFileUploadConfig } from 'src/app/mcv-file/models/mcv-file-upload-config.model';
import { McvComponentConfig } from 'src/app/shared/models/mcv-component-config';
import { McvFileComponent } from '../../../mcv-file/components/mcv-file/mcv-file.component';
import { McvFileUploadComponent, UploadResult } from '../../../mcv-file/components/mcv-file-upload/mcv-file-upload.component';
import { TodoAgendaComponent } from '../todo-agenda/todo-agenda.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { ApiFilter } from 'src/app/shared/models/api-filters';

@Component({
  selector: 'app-todo-create',
  templateUrl: './todo-create.component.html',
  styleUrls: ['./todo-create.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
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
    AsyncPipe,

    //Components
    TodoAgendaComponent,
    McvFileUploadComponent,
    McvFileComponent,
  ]
})
export class TodoCreateComponent implements OnInit {
  currentEntity: Todo = new Todo();
  form!: FormGroup;
  entityID!: number;
  task: WFTask | any;
  entityTypeFlag: number = 0;
  isTaskMode: boolean = false;
  isDuplicated: boolean = false;
  isCreateMode: boolean = false;
  nameOfEntity = this.config.NAMEOF_ENTITY_TODO;


  @Input('config') set configValue(value: McvComponentConfig) {
    // console.log('McvComponentConfig', value);
    if (value) {
      this.entityID = value.entityID;
      this.task = value.task;
      this.isCreateMode = value.isCreateMode;
      this.isTaskMode = value.isTaskMode;
      this.entityTypeFlag = value.entityTypeFlag;
      this.currentEntity = value.currentEntity;
      this.currentEntity.agendas = this.currentEntity.agendas.map(x => {
        x.statusFlag = 0;
        return x;
      });
      this.isDuplicated = value.isCreateMode && value.currentEntity;
      this.refresh();
    }
  }


  @Output() create = new EventEmitter<any>();
  @Output() update = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() taskComplete = new EventEmitter<WFTask>();

  readonly STATUSFLAG_ACTIVE = 0;
  readonly STATUSFLAG_COMPLETED = 1;
  readonly STATUSFLAG_DROPPED = 2;
  readonly TASK_STAGE_TODO_WORK = this.config.TASK_STAGE_TODO_WORK;
  readonly TASK_STAGE_TODO_REVIEW = this.config.TASK_STAGE_TODO_REVIEW;
  readonly TASK_STAGE_TODO_RE_ASSIGN = this.config.TASK_STAGE_TODO_RE_ASSIGN;

  contactOptions: Contact[] = [];
  blobConfig!: McvFileUploadConfig;
  filteredContacts$!: Observable<Contact[]>;
  contactFilter = [{ key: 'usersOnly', value: 'true' }];


  projectOptions: any[] = [];
  projectFilter = [{ key: 'statusFlag', value: this.projectService.PROJECT_STATUS_FLAG_INPROGRESS.toString() },
    { key: 'statusFlag', value: this.projectService.PROJECT_STATUS_FLAG_PREPROPOSAL.toString() }
  ];

  filteredProjects$!: Observable<Project[]>;

  subjectOptions: any[] = [];
  subjectFilter = [];
  filteredSubjects$!: Observable<string[]>;

  selectedAssignee: Contact | null = null;
  completeValidationMessage = 'Please complete checklist to activate Complete button!';

  titleTypeOptions: string[] = ['Project', 'Custom'];
  priorityOptions: string[] = ['HIGH','NORMAL','LOW'];

  now = new Date();
  minutesGap = 5;
  timePickerMinutesGap = 5;

  isAssigneeReadonly: boolean = false;
  selectedProject!: any;

  get f(): any { return this.form.controls; }
  get isMobileView(): boolean { return this.utilityService.isMobileView; }
  get isPermissionTodoEdit(): boolean {
    return this.entityService.isPermissionEdit;
  }
  get isPermissionTodoDelete(): boolean {
    return this.entityService.isPermissionDelete;
  }
  get isPermissionTodoSpecialEdit(): boolean {
    return this.entityService.isPermissionSpecialEdit;
  }
  get isPermissionTodoSpecialDelete(): boolean {
    return this.entityService.isPermissionSpecialDelete;
  }
  get isPermissionTodoMediaUpload(): boolean {
    return this.entityService.isPermissionTodoMediaUpload;
  }
  allowEdit: boolean = false;
  allowDelete: boolean = false;

  tagOptions: string[] = [];
  checklistInfo = 'Checklist items can only be marked/checked in tasks';

  constructor(
    private config: AppConfig,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private utilityService: UtilityService,
    private entityService: TodoApiService,
    private contactService: ContactApiService,
    private projectService: ProjectApiService,
    private agendaService: TodoAgendaApiService,
    private wfTaskService: WFTaskApiService,
    private appSettingService: AppSettingMasterApiService,
    private mcvFileUtilityService: McvFileUtilityService,
    private attachmentService: TodoAttachmentApiService
  ) {
  }

  async ngOnInit() {
    if (!this.form) {
      this.buildForm();
    }

    if (!this.appSettingService.presets || !this.appSettingService.presets.length) {
      await this.appSettingService.loadPresets();
    }
    const preset = this.appSettingService.presets.find(x => x.presetKey == this.config.PRESET_BLOB_CONTAINER_ATTACHMENTS);
    if (preset) {
      this.blobConfig = new McvFileUploadConfig(preset.presetValue, `${this.nameOfEntity}`);
    }
    this.getContactOptions();
    this.getTitleOptions();
    if (!this.authService.isRoleMaster
      && !this.projectService.isPermissionSpecialShowAll
      && this.authService.currentUserStore?.teams
      && this.authService.currentUserStore?.teams.length > 0) {
      this.projectFilter.push(...this.authService.currentUserStore?.teams.map(x => new ApiFilter({ key: 'teamID', value: x.id.toString() })));
    }
  }

  refresh() {
    if (!this.form) {
      this.buildForm();
    }
    if (!this.currentEntity) this.currentEntity = new Todo();

    this.checkPermissions();
    if (this.isDuplicated) {
      console.log('agenda', this.currentEntity.agendas);
      this.bindForm(this.currentEntity);
    }
    this.setAgendaConfig();
  }

  getErrorMessage(control: AbstractControl) {
    return this.utilityService.getErrorMessage(control);
  }

  dateFilter = (d: Date): boolean => {
    // Prevent Saturday and Sunday from being selected.
    // if (d.getDay() === 0) {
    //   return false;
    // }
    const date = new Date();
    date.setDate(date.getDate() - 1);

    if (d < date) {
      return false;
    }
    return true;
  }

  private checkPermissions() {

    this.allowEdit = false;
    this.allowDelete = false;

    if (this.isCreateMode) {
      this.allowEdit = true;
    }
    else if (this.currentEntity
      && this.currentEntity.statusFlag === this.STATUSFLAG_ACTIVE) {

      if (this.authService.currentUserStore != null) {

        this.allowEdit = this.isPermissionTodoSpecialEdit
          || (this.isPermissionTodoEdit
            && Boolean(this.currentEntity.assignerContactID)
            && this.authService.currentUserStore.contact
            && this.currentEntity.assignerContactID === this.authService.currentUserStore.contact.id);

        this.allowDelete = (this.isPermissionTodoSpecialDelete) as boolean
          || (this.isPermissionTodoDelete
            && Boolean(this.currentEntity.assignerContactID) && this.authService.currentUserStore.contact
            && this.currentEntity.assignerContactID === this.authService.currentUserStore.contact.id);
      }

      if (this.isTaskMode) {
        this.isAssigneeReadonly = true;
        this.allowEdit = false;
        this.allowDelete = false;
        if (this.task.wfStageCode === this.TASK_STAGE_TODO_RE_ASSIGN) {
          this.allowEdit = true;
          this.isAssigneeReadonly = false;
        }
      }

    }

    // this.resetForm();
    if (!this.isCreateMode) {
      if (!this.allowEdit) {
        this.form.disable();
      } else {
        this.f['title'].disable();
        this.f['titleType'].disable();
        if (this.isAssigneeReadonly) {
          this.f['assignee'].disable();
        }
      }
    }
  }

  touchForm() {
    if (this.form) {
      Object.keys(this.form.controls).forEach(field => {
        const control = this.form.get(field);
        if (control)
          control.markAsTouched({ onlySelf: true });
      });
    }
  }

  protected buildForm() {

    this.form = this.formBuilder.group({
      assignee: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required] }),
      titleType: new FormControl<any>(null),
      title: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
      subTitle: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
      dueDate: new FormControl<any>(new Date, { nonNullable: true, validators: [Validators.required] }),
      priority: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required] }),
      dueTime: new FormControl<any>(null),
      comment: new FormControl<any>(null),
      mHrAssigned: new FormControl<any>(1, { nonNullable: true, validators: [Validators.required, Validators.min(0.5)] })
    });

    this.f['titleType'].setValue('Custom');
    // this.f['titleType'].disable();
    // this.getProjectOptions();

    this.f['mHrAssigned'].setValue(1);
    this.f['dueDate'].setValue(new Date(), { emitEvent: false });
    this.f['dueTime'].setValue(this.utilityService.getTimeValue(new Date(), this.minutesGap), { emitEvent: false });

    if (this.isCreateMode) {
      if (this.isDuplicated) {
        this.f['titleType'].disable();
        this.f['title'].disable();
      }
    } else {
      this.f['subTitle'].setValidators([]);
    }


    this.f['assignee'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
    ).subscribe((value: any) => {
      if (value) {
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
        (value: any) => {
          if (value && !this.isDuplicated) {
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

    this.filteredProjects$ = this.f['title'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(name => name ? this.getProjectOptions(name as string) : of([])),
    );

    this.filteredSubjects$ = this.f['title'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      map(value => value ? this.filterTitleOptions(value as string) : this.subjectOptions.slice()),
    );

    this.f['title'].valueChanges
      .pipe(debounceTime(400))
      .subscribe(
        (value: any) => {
          if (value && this.isCreateMode && !this.isDuplicated) {

            if (typeof value === 'string') {
              this.currentEntity.title = value;
              this.currentEntity.entity = '';
              this.currentEntity.entityID = 0;
            } else {
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

  private bindForm(entity: Todo) {
    if (entity) {
      if (entity.assignee) {
        this.f['assignee'].setValue(entity.assignee);
      }

      this.f['titleType'].setValue(entity.projectID ? 'Project' : 'Custom');
      if (entity.projectID) {
        const _project = this.projectOptions.find(x => x.id == entity.projectID);
        if (!_project) {

          this.projectService.getById(entity.projectID).subscribe((data: Project) => {

            this.projectOptions.push(data);
            this.selectedProject = data;
            // console.log('get project', data, this.projectOptions);
            this.f['title'].setValue(data);
          });
        } else {
          // console.log('from options', _project);
          this.f['title'].setValue(_project);
          this.selectedProject = _project;
        }
      } else {
        this.f['title'].setValue(entity.title, { emitEvent: false });
      }

      this.f['subTitle'].setValue(entity.subTitle);
      this.f['dueDate'].setValue(entity.dueDate);
      this.f['dueTime'].setValue(this.utilityService.getTimeValue(entity.dueDate, this.timePickerMinutesGap));

      if (entity.comment) {
        this.f['comment'].setValue(entity.comment);
      }
      this.f['mHrAssigned'].setValue(entity.mHrAssigned);
    }

  }

  getContactOptions() {
    if (!this.authService.isRoleMaster
      && !this.contactService.isPermissionSpecialShowAll
      && this.authService.currentUserStore?.teams
      && this.authService.currentUserStore?.teams.length > 0) {
      this.contactFilter.push(...this.authService.currentUserStore?.teams.map(x => new ApiFilter({ key: 'teamID', value: x.id.toString() })));
    }
    this.contactService.get(this.contactFilter, '', 'fullName').subscribe(data => this.contactOptions = data);
  }

  filterContacts(property: string): any[] {
    return this.contactOptions.filter(option => option ? option.name.toLowerCase().includes(property.toLowerCase()) : false);
  }

  displayFnContact(option?: Contact): string {
    return option ? option.name : '';
  }
  private getTitleOptions() {
    this.entityService.getFieldOptions('Title').subscribe(
      data => {
        this.subjectOptions = data;
      });
  }

  private filterTitleOptions(property: string): any[] {
    return this.subjectOptions.filter(option => option ? option.toLowerCase().includes(property.toLowerCase()) : false);
  }

  displayFnTitle(option?: any): string {
    return option ? option : '';
  }

  // private getProjectOptions()
  // {
  //   this.projectService.get(this.projectFilter).subscribe((data: any) => this.projectOptions = data);
  // }

  private filterProjectOptions(property: string): any[] {

    return this.projectOptions.filter(option => option ? (option.code + '-' + option.title).toLowerCase().includes(property.toLowerCase()) : false);
  }

  private getProjectOptions(search: string): Observable<string[]> {

    return this.projectService.getPages(0, 20, this.projectFilter, search).pipe(map(data => data ? data.list.map((x: Project) => x) : []));
  }

  displayFnProject(option?: any): string {
    return option ? (option.code + '-' + option.title) : '';
  }


  protected getCurrent(id: number) {
    this.entityService.getById(id).subscribe(
      data => {
        this.currentEntity = data;
        this.checkPermissions();
        this.bindForm(this.currentEntity);
      }

    );
  }

  onAssigneeBlur(e: any) {
    if (!this.selectedAssignee || this.selectedAssignee !== this.f['assignee'].value) {
      this.f['assignee'].setValue(null);
      this.selectedAssignee = null;
    }
  }
  onAssigneeSelect(item: Contact) {
    if (item && item.id) {
      this.selectedAssignee = item;
    }
  }

  onSubmit(task?: WFTask) {
    if (!this.currentEntity.title || this.currentEntity.title.length === 0) {
      this.utilityService.showSweetDialog('title is blank!',
        'Please enter a valid title and try again!', 'error'
      );
      return;
    }

    if (this.f['titleType'].value == 'Project' && !this.selectedProject) {
      {
        this.utilityService.showSwalToast('Incomplete Data',
          'Please select project from the list.', 'error'
        );
        return
      }
    }

    if (!this.f['assignee'].value) {
      this.utilityService.showSweetDialog('Assignee not selected!',
        'Please select a contact from the list as assignee and try again!', 'error'
      );
      return;
    }

    if (this.isCreateMode && this.authService.currentUserStore) {
      this.currentEntity.assignerContactID = this.authService.currentUserStore.contact.id;
    }
    this.currentEntity.statusFlag = this.STATUSFLAG_ACTIVE;
    this.currentEntity.subTitle = this.f['subTitle'].value;
    this.currentEntity.assigneeContactID = this.f['assignee'].value ? (this.f['assignee'].value as Contact).id : 0;
    this.currentEntity.dueDate = this.utilityService.setTimeValue(this.f['dueDate'].value, this.f['dueTime'].value);
    this.currentEntity.comment = this.f['comment'].value;
    this.currentEntity.priority = this.f['priority'].value;
    this.currentEntity.mHrAssigned = this.f['mHrAssigned'].value;

    this.entityService.create(this.currentEntity).subscribe(
      (data: any) => {

        this.utilityService.showSwalToast(
          'Success!',
          'Save successful.',
        );
        this.wfTaskService.refreshList();
        if (this.currentEntity.agendas.length) {
          const requests: ObservableInput<any>[] = [];
          this.currentEntity.agendas.forEach(agenda => {

            agenda.todoID = data.id;

            requests.push(this.agendaService.create(agenda))
          });
          forkJoin(requests).subscribe(console.log);
        }

        if (this.uploadQueue.length) {
          this.uploadFiles();
        } else {
          this.create.emit(data);
          this.entityService.refreshList();

        }

      }
    );


  }


  onTagsUpdate(tags: string[]) {
    if (tags) {
      this.currentEntity.searchTags = tags;
      this.entityService.update(this.currentEntity).subscribe(
        (data) => {
        }
      );
    }
  }

  onDeleteAttachment(item: any) {
    this.attachmentService.delete(item.id).subscribe(value => {
      this.delete.emit(item);
    });
    this.currentEntity.attachments = this.currentEntity.attachments.filter(x => x.id !== item.id);
  }

  onDownloadAttachment(item: any) {
    window.open(item.url);
  }

  uploadQueue: UploadResult[] = [];
  onUpload(uploads: UploadResult[]) {

    //Creating a dummy object
    uploads.forEach(x => {
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
    console.log(this.currentEntity.attachments, this.uploadQueue);

  }

  private uploadFiles() {
    let _createRequests: any[] = [];
    this.uploadQueue.forEach(x => {
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

    forkJoin(_createRequests).subscribe((results: any) => {
      results.forEach((x: any) => {
        this.currentEntity.attachments.push(x as TodoAttachment);
      })
      if (this.isCreateMode) {
        this.create.emit(this.currentEntity);
        this.entityService.refreshList();
      }
    });
  }

  getFilteredAttachments(attachments: TodoAttachment[], typeFlag: number, isMedia: boolean) {
    // console.log('filtered', attachments, typeFlag, isMedia, attachments.filter(x => x.typeFlag == typeFlag));
    return isMedia ?
      attachments.filter(x => x.typeFlag == typeFlag
        && (this.mcvFileUtilityService.isImage(x.filename) || this.mcvFileUtilityService.isVideo(x.filename) || this.mcvFileUtilityService.isAudio(x.filename))
      ) :
      attachments.filter(x => x.typeFlag == typeFlag
        && !(this.mcvFileUtilityService.isImage(x.filename) || this.mcvFileUtilityService.isVideo(x.filename) || this.mcvFileUtilityService.isAudio(x.filename))
      );
  }

  onAddAttachmentTag(tags: string[], file: TodoAttachment) {
    file.searchTags = tags;
    this.attachmentService.update(file).subscribe(data => {
      file = Object.assign({}, file);
    });
  }

  agendaConfig: any;
  private setAgendaConfig() {
    this.agendaConfig = {
      isReadOnly: false,
      todo: this.currentEntity,
      agenda: this.currentEntity.agendas,
      updateDatabase: false,
      isCheckboxMode: false
    };
  }

  onAgendaUpdate(event: TodoAgenda[]) {
    this.currentEntity.agendas = event;
  }

  onProjectSelected(event: MatAutocompleteSelectedEvent) {
    this.selectedProject = event;
  }
}

