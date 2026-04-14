import { Component, Inject } from '@angular/core';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { TextFieldModule } from '@angular/cdk/text-field';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { McvFileUploadComponent, UploadResult } from 'src/app/mcv-file/components/mcv-file-upload/mcv-file-upload.component';
import { McvFileComponent } from 'src/app/mcv-file/components/mcv-file/mcv-file.component';
import { McvTagEditorComponent } from 'src/app/mcv-tag-editor/components/mcv-tag-editor/mcv-tag-editor.component';
import { McvTimeEntryListComponent } from 'src/app/mcv-time-entry/components/mcv-time-entry-list/mcv-time-entry-list.component';
import { WfTaskActionComponent } from 'src/app/wf-task/components/wf-task-action/wf-task-action.component';
import { WftaskTitleBarComponent } from 'src/app/wf-task/components/wftask-title-bar/wftask-title-bar.component';
import { TodoAgendaComponent } from '../todo-agenda/todo-agenda.component';
import { TodoMeetingAgendaComponent } from '../todo-meeting-agenda/todo-meeting-agenda.component';
import { McvActivityListComponent } from 'src/app/mcv-activity/components/mcv-activity-list/mcv-activity-list.component';
import { Todo, TodoAttachment } from '../../models/todo.model';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AppConfig } from 'src/app/app.config';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { Contact } from 'src/app/contact/models/contact';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { McvFileUploadConfig } from 'src/app/mcv-file/models/mcv-file-upload-config.model';
import { debounceTime, distinctUntilChanged, firstValueFrom, forkJoin, map, Observable } from 'rxjs';
import { ApiFilter } from 'src/app/shared/models/api-filters';
import { Project } from 'src/app/project/models/project.model';
import { ContactApiService } from 'src/app/contact/services/contact-api.service';
import { TodoApiService } from '../../services/todo-api.service';
import { ProjectApiService } from 'src/app/project/services/project-api.service';
import { McvFileUtilityService } from 'src/app/mcv-file/services/mcv-file-utility.service';
import { TodoAttachmentApiService } from '../../services/todo-attachment-api.service';
import { TodoAgenda } from '../../models/todo-agendaas';
import { WFTask } from 'src/app/wf-task/models/wf-task.model';

@Component({
  selector: 'app-sub-todo-update-dialog',
  standalone: true,
  imports: [
    CommonModule,
    WftaskTitleBarComponent,
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
    McvFileUploadComponent,
    McvFileComponent,
    TodoMeetingAgendaComponent,
    TodoAgendaComponent,
    McvTimeEntryListComponent,
    WfTaskActionComponent,
    MatButtonModule,
    MatTooltipModule,
    McvActivityListComponent,
    McvTagEditorComponent,
    AsyncPipe,
    DatePipe,
    MatDialogModule,
  ],
  templateUrl: './sub-todo-update-dialog.component.html',
  styleUrls: ['./sub-todo-update-dialog.component.scss']
})
export class SubTodoUpdateDialogComponent {

  form!: FormGroup;
  now = new Date();
  minutesGap = 5;
  task!: WFTask;
  tagOptions: string[] = [];
  currentEntity!: Todo;
  timePickerMinutesGap = 5;
  projectOptions: any[] = [];
  isCreateMode: boolean = false;
  nameOfEntity = this.config.NAMEOF_ENTITY_TODO;
  contactOptions: Contact[] = [];
  contactFilter = [{ key: 'UsersOnly', value: 'true' }];
  priorityOptions: string[] = ['HIGH', 'NORMAL', 'LOW'];
  filteredContacts$!: Observable<Contact[]>;
  blobConfig!: McvFileUploadConfig;
  projectFilter: ApiFilter[] = [
    { key: 'StatusFlag', value: this.config.PROJECT_STATUS_FLAG_INPROGRESS.toString() },
    { key: 'StatusFlag', value: this.config.PROJECT_STATUS_FLAG_PREPROPOSAL.toString() },
  ];
  filteredProjects$!: Observable<Project[]>;

  subjectFilter = [];
  subjectOptions: any[] = [];
  filteredSubjects$!: Observable<string[]>;

  readonly PRIORITY_NORMAL = this.config.TODO_PRIORITY_NORMAL;
  readonly PRIORITY_HIGH = this.config.TODO_PRIORITY_HIGH;
  readonly PRIORITY_LOW = this.config.TODO_PRIORITY_LOW;

  readonly STATUSFLAG_ACTIVE = 0;
  readonly STATUSFLAG_COMPLETED = 1;
  readonly STATUSFLAG_DROPPED = 2;
  readonly TASK_STAGE_TODO_WORK = this.config.TASK_STAGE_TODO_WORK;
  readonly TASK_STAGE_TODO_REVIEW = this.config.TASK_STAGE_TODO_REVIEW;
  readonly TASK_STAGE_TODO_RE_ASSIGN = this.config.TASK_STAGE_TODO_RE_ASSIGN;

  selectedAssignee: Contact | null = null;
  completeValidationMessage = 'Please complete checklist to activate Complete button!';

  titleTypeOptions: string[] = ['Project', 'Custom'];


  get f(): any { return this.form.controls; }
  get isMobileView(): boolean { return this.utilityService.isMobileView; }

  get isPermissionEdit(): boolean {
    return this.entityService.isPermissionEdit;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    private config: AppConfig,
    private formBuilder: FormBuilder,
    private entityService: TodoApiService,
    private utilityService: UtilityService,
    private contactService: ContactApiService,
    private projectService: ProjectApiService,
    private attachmentService: TodoAttachmentApiService,
    private appSettingService: AppSettingMasterApiService,
    private mcvFileUtilityService: McvFileUtilityService,
    private dialog: MatDialogRef<SubTodoUpdateDialogComponent>,
  ) {
    if (data) {
      this.entityService.getById(data.todo.id).subscribe((value)=>{
        this.currentEntity = value;
      });
      if (!this.form) {
        this.buildForm();
      }
    }
  }

  async ngOnInit() {
    await this.getContactOptions();
    await this.getProjectOptions();
    await this.getTitleOptions();

    this.bindForm(this.currentEntity);
    this.setAgendaConfig();

    if (!this.appSettingService.presets || !this.appSettingService.presets.length) {
      await this.appSettingService.loadPresets();
    }
    const preset = this.appSettingService.presets.find(x => x.presetKey == this.config.PRESET_BLOB_CONTAINER_ATTACHMENTS);
    if (preset) {
      this.blobConfig = new McvFileUploadConfig(preset.presetValue, `${this.nameOfEntity}`);
    }
  }

  buildForm() {
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
    this.f['assignee'].disable();

    // this.f['mHrAssigned'].setValue(1);
    this.f['dueDate'].setValue(new Date(), { emitEvent: false });
    this.f['dueTime'].setValue(this.utilityService.getTimeValue(new Date(), this.minutesGap), { emitEvent: false });
    this.f['subTitle'].setValidators([]);


    this.f['assignee'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
    ).subscribe((value: any) => {
      if (value) {
        this.onAssigneeSelect(value);
      }
    });

    // this.filteredContacts$ = this.f['assignee'].valueChanges.pipe(
    //   debounceTime(400),
    //   distinctUntilChanged(),

    //   map(value => value ? (typeof value === 'string' ? value : (value as Contact).name) : null),
    //   map(name => name ? this.filterContacts(name as string) : this.contactOptions.slice()),
    // );

    // this.f['titleType'].valueChanges
    //   .pipe(debounceTime(400))
    //   .subscribe(
    //     (value: any) => {
    //       if (value) {
    //         this.f['title'].reset();
    //       }
    //     }
    //   );

    // this.filteredProjects$ = this.f['title'].valueChanges.pipe(
    //   debounceTime(400),
    //   distinctUntilChanged(),

    //   map(value => typeof value === 'string' ? value : (value != null ? (value as Project).code + ' ' + (value as Project).title : null)),
    //   map(value => value ? this.filterProjectOptions(value as string) : this.projectOptions.slice()),
    // );

    // this.filteredSubjects$ = this.f['title'].valueChanges.pipe(
    //   debounceTime(400),
    //   distinctUntilChanged(),
    //   map(value => value ? this.filterTitleOptions(value as string) : this.subjectOptions.slice()),
    // );

    // this.f['title'].valueChanges
    //   .pipe(debounceTime(400))
    //   .subscribe(
    //     (value: any) => {
    //       if (value && this.isCreateMode) {

    //         if (typeof value === 'string') {
    //           this.currentEntity.title = value;
    //           this.currentEntity.entity = '';
    //           this.currentEntity.entityID = 0;
    //         } else {
    //           this.currentEntity.title = value.code + '-' + value.title;
    //           this.currentEntity.entity = this.config.NAMEOF_ENTITY_PROJECT;
    //           this.currentEntity.entityID = value.id;
    //           this.currentEntity.projectID = value.id;
    //         }
    //       }
    //     }
    //   );

    this.touchForm();
  }

  private bindForm(entity: Todo) {
    if (entity) {
      if (entity.assignee) {
        this.f['assignee'].setValue(entity.assignee);
      }
      this.f['titleType'].setValue(entity.projectID ? 'Project' : 'Custom');
      this.f['title'].setValue(entity.title);
      this.f['subTitle'].setValue(entity.subTitle);
      this.f['dueDate'].setValue(entity.dueDate);
      this.f['priority'].setValue(entity.priority);
      this.f['dueTime'].setValue(this.utilityService.getTimeValue(entity.dueDate, this.timePickerMinutesGap));

      if (entity.comment) {
        this.f['comment'].setValue(entity.comment);
      }
      this.f['mHrAssigned'].setValue(entity.mHrAssigned);
    }

  }

  uploadQueue: UploadResult[] = [];
  onUpload(uploads: UploadResult[]) {
    if (!this.isCreateMode) {
      uploads.forEach(x => {
        this.uploadQueue.push(x);
      });
      this.uploadFiles();
    } else {
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
    }
  }

  private async uploadFiles() {
    let _createRequests: Observable<any>[] = [];
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

    const results = await firstValueFrom(forkJoin(_createRequests))
    this.currentEntity.attachments.push(...results);
  }

  agendaConfig: any;
  private setAgendaConfig() {
    this.agendaConfig = {
      isReadOnly: !this.isPermissionEdit || this.currentEntity.statusFlag != this.config.TODO_STATUS_FLAG_ACTIVE,
      todo: this.currentEntity,
      agenda: this.currentEntity.agendas,
      updateDatabase: true,
      isCheckboxMode: true
    };
  }

  onAgendaUpdate(event: TodoAgenda[]) {
    // console.log(event);
    this.currentEntity.agendas = event;
  }

  getFilteredAttachments(attachments: TodoAttachment[], typeFlag: number, isMedia: boolean) {
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

  onDeleteAttachment(item: any) {
    this.attachmentService.delete(item.id).subscribe(value => {
    });
    this.currentEntity.attachments = this.currentEntity.attachments.filter(x => x.id !== item.id);
  }

  onAssigneeSelect(item: Contact) {
    if (item && item.id) {
      this.selectedAssignee = item;
    }
  }

  getErrorMessage(control: AbstractControl) {
    return this.utilityService.getErrorMessage(control);
  }

  async getContactOptions() {
    this.contactOptions = await firstValueFrom(this.contactService.get(this.contactFilter, '', 'fullName'));
  }

  filterContacts(property: string): any[] {
    return this.contactOptions.filter(option => option ? option.name.toLowerCase().includes(property.toLowerCase()) : false);
  }

  displayFnContact(option?: Contact): string {
    return option ? option.name : '';
  }

  private async getTitleOptions() {
    this.subjectOptions = await firstValueFrom(this.entityService.getFieldOptions('Title'));
  }

  private filterTitleOptions(property: string): any[] {
    return this.subjectOptions.filter(option => option ? option.toLowerCase().includes(property.toLowerCase()) : false);
  }

  displayFnTitle(option?: any): string {
    return option ? option : '';
  }

  private async getProjectOptions() {
    this.projectOptions = await firstValueFrom(this.projectService.get(this.projectFilter));
  }

  private filterProjectOptions(property: string): any[] {

    return this.projectOptions.filter(option => option ? (option.code + '-' + option.title).toLowerCase().includes(property.toLowerCase()) : false);
  }

  displayFnProject(option?: any): string {
    return option ? (option.code + '-' + option.title) : '';
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

  onTagsUpdate(tags: string[]) {
    if (tags) {
      this.currentEntity.searchTags = tags;
      this.entityService.update(this.currentEntity).subscribe(
        (data) => {
        }
      );
    }
  }

  async onSubmit() {
    // console.log(this.form);
    if (this.form.invalid) {
      this.touchForm();
      this.utilityService.showSweetDialog('Invalid Form',
        'Please fill all required fields with valid data and try again.', 'error'
      );
      return;
    }
    this.currentEntity.subTitle = this.f['subTitle'].value;
    this.currentEntity.assigneeContactID = this.f['assignee'].value ? (this.f['assignee'].value as Contact).id : 0;
    this.currentEntity.dueDate = this.utilityService.setTimeValue(this.f['dueDate'].value, this.f['dueTime'].value);
    this.currentEntity.comment = this.f['comment'].value;
    this.currentEntity.priority = this.f['priority'].value;
    this.currentEntity.mHrAssigned = this.f['mHrAssigned'].value;
    // console.log(this.currentEntity);

    this.currentEntity = await firstValueFrom(this.entityService.update(this.currentEntity));
    this.dialog.close({ todo: this.currentEntity, isUpdate: true });
  }

  onClose() {
    this.dialog.close();
  }
}
