import { RequestTicket, RequestTicketAttachment } from '../../models/request-ticket';
import { Component, EventEmitter, Input, NgZone, OnInit, Output, ViewChild, effect, inject } from '@angular/core';
import { Observable, firstValueFrom, forkJoin } from 'rxjs';
import { ContactApiService } from 'src/app/contact/services/contact-api.service';
import { AbstractControl, FormBuilder, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, take } from 'rxjs/operators';
import { RequestTicketAttachmentApiService } from 'src/app/request-ticket/services/request-ticket-attachment-api.service';
import { RequestTicketApiService } from '../../services/request-ticket-api.service';
import { RequestTicketAssigneeApiService } from '../../services/request-ticket-assignee-api.service';
import { RequestTicketAssignee } from '../../models/request-ticket-assignee';
import { MatAutocompleteSelectedEvent, MatAutocompleteModule } from '@angular/material/autocomplete';
import { Project, ProjectAttachment } from 'src/app/project/models/project.model';
import { EmailContact } from 'src/app/shared/models/email-contact';
import { Contact } from 'src/app/contact/models/contact';
import { WFTask } from 'src/app/wf-task/models/wf-task.model';
import { McvFileUploadConfig } from 'src/app/mcv-file/models/mcv-file-upload-config.model';
import { CdkDragDrop, transferArrayItem, CdkDropList, CdkDragPlaceholder, CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { AppConfig } from 'src/app/app.config';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { WFTaskApiService } from 'src/app/wf-task/services/wf-task-api.service';
import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
import { McvActivityListComponent } from 'src/app/mcv-activity/components/mcv-activity-list/mcv-activity-list.component';
import { McvTimeEntryTimeLineComponent } from 'src/app/mcv-time-entry/components/mcv-time-entry-time-line/mcv-time-entry-time-line.component';
import { McvComponentConfig } from 'src/app/shared/models/mcv-component-config';
import { TimeEntryDto } from 'src/app/shared/models/time-entry-dto';
import { McvFileComponent } from '../../../mcv-file/components/mcv-file/mcv-file.component';
import { McvFileUploadComponent, UploadResult } from '../../../mcv-file/components/mcv-file-upload/mcv-file-upload.component';
import { WfTaskActionComponent } from '../../../wf-task/components/wf-task-action/wf-task-action.component';
import { McvTimeEntryListComponent } from '../../../mcv-time-entry/components/mcv-time-entry-list/mcv-time-entry-list.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { WftaskTitleBarComponent } from '../../../wf-task/components/wftask-title-bar/wftask-title-bar.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AsyncPipe, DecimalPipe, DatePipe, CommonModule } from '@angular/common';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { RequestTicketTaskActionComponent } from '../request-ticket-task-action/request-ticket-task-action.component';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RequestTicketDmsFolderNavigatorComponent } from '../request-ticket-dms-folder-navigator/request-ticket-dms-folder-navigator.component';
import { ProjectAttachmentApiService } from 'src/app/project/services/project-attachment-api.service';
import { ContactPhotoNameDialogComponent } from 'src/app/shared/components/contact-photo-name-dialog/contact-photo-name-dialog.component';
// import {  Editor, NgxEditorModule, Toolbar } from 'ngx-editor';

@Component({
  selector: 'app-request-ticket',
  templateUrl: './request-ticket.component.html',
  styleUrls: ['./request-ticket.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTooltipModule,
    MatIconModule,
    MatExpansionModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatButtonModule,
    CdkDropList,
    CdkDragPlaceholder,
    CdkDrag,
    CdkDragHandle,
    TextFieldModule,
    AsyncPipe,
    DecimalPipe,
    DatePipe,
    MatSelectModule,
    // NgxEditorModule,

    //Components
    McvTimeEntryListComponent,
    WftaskTitleBarComponent,
    WfTaskActionComponent,
    McvFileUploadComponent,
    McvFileComponent,
    McvActivityListComponent,
    RequestTicketTaskActionComponent
  ]
})
export class RequestTicketComponent implements OnInit{

  //Common component properties-------------------------
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  currentEntity: RequestTicket = new RequestTicket();
  nameOfEntity = this.config.NAMEOF_ENTITY_REQUEST_TICKET;
  entityID!: number;
  task: WFTask | any;
  isCreateMode: boolean = false;
  isTaskMode: boolean = false;
  entityTypeFlag: number = 0;
  configData: any;
  isDuplicated: boolean = false;
  blobConfig!: McvFileUploadConfig;

  treeData: ProjectAttachment[] = [];
  filesToUpload: UploadResult[] = [];
  projectFiles: ProjectAttachment[] = [];

  stageOptions: string[] = [
    'Approval Stage',
    'Concept Stage',
    'Design Detail Stage',
    'Tender Stage',
    'Construction Stage',
    'Procurement & Installation Stage',
  ];
  authorityOptions: string[] = ['MOEF', 'CFO', 'M&E', 'LOI/IOD/IOA', 'Others'];

  //NGX Editor
  // editor!: Editor;
  // toolbar: Toolbar = [
  //   ['bold', 'italic'],
  //   ['underline', 'strike'],
  //   ['code', 'blockquote'],
  //   ['ordered_list', 'bullet_list'],
  //   [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
  //   // ['link', 'image'],
  //   ['text_color', 'background_color'],
  //   ['align_left', 'align_center', 'align_right', 'align_justify'],
  // ];

  @ViewChild(McvTimeEntryTimeLineComponent) protected timeline!: McvTimeEntryTimeLineComponent;
  @ViewChild(McvActivityListComponent) protected activity!: McvActivityListComponent;

  @Input('config') set configValue(value: McvComponentConfig) {
    // console.log('McvComponentConfig', value);
    if (value) {
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

  unSupportedMediaTypes = ['video', 'audio'];

  alertMessage: string = "";
  isShowAlert: boolean = false;
  selectedProject!: any;
  contactFilter = [];
  subjectOptions: string[] = [];
  emailContactOptions: EmailContact[] = [];
  allowEdit = false;
  filteredSubjects$!: Observable<string[]>;
  filteredProjects$!: Observable<Project[]>;
  filteredSubjectOptions$!: Observable<any>;
  filteredContacts$!: Observable<EmailContact[]>;
  assigneeFC = new FormControl();
  historyList: RequestTicket[] = [];

  // private  formBuilder = inject(FormBuilder);
  // private  readonly config = inject(AppConfig);
  // private  readonly authService = inject(AuthService);
  // private  readonly utilityService = inject(UtilityService);
  private readonly contactService = inject(ContactApiService);
  // private  readonly appSettingService = inject(AppSettingMasterApiService);
  private readonly assigneeService = inject(RequestTicketAssigneeApiService);
  private readonly attachmentService = inject(RequestTicketAttachmentApiService);

  readonly DEFAULT_REPEAT_INTERVAL = 7;
  subjectTypeOptions: string[] = [this.config.NAMEOF_ENTITY_PROJECT];

  purposeOptions = ['Information', 'Meeting', 'Approval', 'Sign-Off', 'Payment'];

  get REQUEST_TICKET_STATUSFLAG_ACTIVE() { return this.entityService.REQUEST_TICKET_STATUSFLAG_ACTIVE; }
  get REQUEST_TICKET_STATUSFLAG_CLOSED() { return this.entityService.REQUEST_TICKET_STATUSFLAG_CLOSED; }

  get REQUEST_TICKET_ASSIGNEE_TYPEFLAG_TO() { return this.assigneeService.REQUEST_TICKET_ASSIGNEE_TYPEFLAG_TO; }
  get REQUEST_TICKET_ASSIGNEE_TYPEFLAG_CC() { return this.assigneeService.REQUEST_TICKET_ASSIGNEE_TYPEFLAG_CC; }
  get REQUEST_TICKET_ASSIGNEE_TYPEFLAG_BCC() { return this.assigneeService.REQUEST_TICKET_ASSIGNEE_TYPEFLAG_BCC; }

  get toList() {
    return this.currentEntity.assignees
      .filter(x => x.typeFlag == this.REQUEST_TICKET_ASSIGNEE_TYPEFLAG_TO);
  }
  get ccList() {
    return this.currentEntity.assignees
      .filter(x => x.typeFlag == this.REQUEST_TICKET_ASSIGNEE_TYPEFLAG_CC);
  }
  get bccList() {
    return this.currentEntity.assignees
      .filter(x => x.typeFlag == this.REQUEST_TICKET_ASSIGNEE_TYPEFLAG_BCC);
  }
  get isPermissionEdit() { return this.entityService.isPermissionEdit; }
  get isPermissionDelete() { return this.entityService.isPermissionDelete; }
  get isPermissionSpecialEdit() { return this.entityService.isPermissionSpecialEdit; }
  get isPermissionSpecialDelete() { return this.entityService.isPermissionSpecialDelete; }

  get isAllowedToUpdate() {
    return this.currentEntity?.statusFlag != this.REQUEST_TICKET_STATUSFLAG_CLOSED && this.isPermissionEdit;
  }
  get isAllowedToDelete() {
    return this.currentEntity?.statusFlag != this.REQUEST_TICKET_STATUSFLAG_CLOSED && this.isPermissionDelete;
  }

  constructor(
    private entityService: RequestTicketApiService,
    private wfTaskService: WFTaskApiService,
    private appSettingService: AppSettingMasterApiService,
    private utilityService: UtilityService,
    private formBuilder: FormBuilder,
    private ngZone: NgZone,
    private config: AppConfig,
    private dialog: MatDialog,
    private projectAttachmentService : ProjectAttachmentApiService
  ) {
    //Detects if there are any copied files from DMS
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

  async ngOnInit() {
    // this.editor = new Editor();
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
    if (!this.form) {
      this.buildForm();
    }
    this.getEmailContactOptions();
  }

  // async ngOnDestroy() {
  //   this.editor.destroy();
  // }

  touchForm() {
    //touch form inputs to show validation messages
    if (this.form) {
      Object.keys(this.form.controls).forEach(field => {
        // {1}
        const control = this.form.get(field); // {2}
        control.markAsTouched({ onlySelf: true }); // {3}
      });
    }
  }

  resetForm() {
    if (this.form) {
      this.form.reset();
    }
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this.ngZone.onStable
      .pipe(take(1))
      .subscribe(() => { if (this.autosize) { this.autosize.resizeToFitContent(true) } });
  }

  getErrorMessage(control: AbstractControl) {
    return this.utilityService.getErrorMessage(control);
  }

  async refresh() {
    this.currentEntity = new RequestTicket();
    this.buildForm();

    if (this.entityID && this.entityID !== -1) {
      await this.getCurrent(this.entityID);
      await this.getCurrentHistory(this.nameOfEntity, this.entityID);
    }
  }

  dateFilter = (d: Date | null): boolean => {
    // Prevent Saturday and Sunday from being selected.
    // if (d.getDay() === 0) {
    //   return false;
    // }
    const today = (d || new Date());
    const date = new Date();
    date.setDate(date.getDate() - 1);

    if (today < date) {
      return false;
    }
    return true;
  }


  buildForm() {


    this.form = this.formBuilder.group({
      titleType: new FormControl<any>(null),
      project: new FormControl<any>(null),
      title: new FormControl<any>(null),
      subtitle: new FormControl<any>(null),
      purpose: new FormControl<any>(null, { validators: [Validators.required] }),
      requestMessage: new FormControl<any>(null, { validators: [Validators.required] }),
      nextReminderDate: new FormControl<any>(new Date(), { validators: [Validators.required] }),
      isRepeatRequired: new FormControl<boolean>(false),
      reminderInterval: new FormControl<any>(this.DEFAULT_REPEAT_INTERVAL, { validators: [Validators.required] }),
      stageTitle: new FormControl<any>(null),
      revision: new FormControl<any>(0),
      authority: new FormControl<any>(null),
    });

    const _reminderInterval = this.DEFAULT_REPEAT_INTERVAL;
    const _nextDate = new Date();
    _nextDate.setDate(_nextDate.getDate() + _reminderInterval);
    this.f['nextReminderDate'].setValue(_nextDate, { emitEvent: false });
    this.f['reminderInterval'].setValue(_reminderInterval, { emitEvent: false });
    this.f['requestMessage'].setValue('Dear Sir/Madam,', { emitEvent: false });
    this.f['purpose'].setValue('Information', { emitEvent: false });

    this.f['titleType'].setValue('Project');


    this.filteredContacts$ = this.assigneeFC.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),

      map(value => value ? (typeof value === 'string' ? value : (value as Contact).name) : null),
      map(name => name ? this.filterContacts(name as string) : this.emailContactOptions.slice()),

    );

    // this.filteredProjects$ = this.f['project'].valueChanges.pipe(
    //   debounceTime(400),
    //   distinctUntilChanged(),
    //   map(value => typeof value === 'string' ? value : (value != null ? (value as Project).code + ' ' + (value as Project).title : null)),
    //   map(value => value ? this.filterProjectOptions(value as string) : this.projectOptions.slice()),
    // );

    this.filteredSubjects$ = this.f['title'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      map(value => value ? this.filterTitleOptions(value as string) : this.subjectOptions.slice()),
    );

    this.f['titleType'].valueChanges
      .pipe(debounceTime(400))
      .subscribe(
        (value: string) => {
          if (value && !this.isDuplicated) {
            // this.f.title.reset();
            if (this.f.titleType.value == 'Project') {
              // this.getProjectOptions();
            } else {
              this.getTitleOptions();
              this.selectedProject = undefined;
              this.f['title'].setValue('');
            }
          }
        }
      );


    this.f['title'].valueChanges
      .pipe(debounceTime(400))
      .subscribe(
        (value: any) => {
          if (value && this.isCreateMode) {

            if (typeof value === 'string') {
              this.currentEntity.title = value;
              this.currentEntity.entity = undefined;
              this.currentEntity.entityID = undefined;
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

  private bindForm(entity: RequestTicket) {

    if (entity) {
      this.f.titleType.setValue(entity.projectID ? 'Project' : 'Custom');
      this.f.purpose.setValue(entity.purpose);
      this.f.title.setValue(entity.title);
      if (entity.projectID) {
        this.f.title.disable();
      } else {
        this.f.title.enable();
      }
      this.f['subtitle'].setValue(entity.subtitle, { emitEvent: false });
      this.f['nextReminderDate'].setValue(entity.nextReminderDate, { emitEvent: false });
      this.f['isRepeatRequired'].setValue(entity.isRepeatRequired, { emitEvent: false });
      this.f['requestMessage'].setValue(entity.requestMessage, { emitEvent: false });
      this.f['reminderInterval'].setValue(entity.reminderInterval, { emitEvent: false });
      this.f['revision'].setValue(entity.revision, { emitEvent: false });
      this.f['authority'].setValue(entity.authority, { emitEvent: false });
      this.f['stageTitle'].setValue(entity.stageTitle, { emitEvent: false });
      // this.f['requestMessage'].setValue(entity.requestMessage, { emitEvent: false });
    }
  }

  private getEmailContactOptions() {
    this.contactService.getEmailOptions(this.contactFilter, undefined, 'fullName').subscribe(data => this.emailContactOptions = data);
  }

  private filterContacts(property: string): any[] {
    return this.emailContactOptions.filter(option => {
      return option ?
        (option.name.toLowerCase().includes(property.toLowerCase())
          || option.email.toLowerCase().includes(property.toLowerCase())
        )
        : false;
    });
  }

  displayFnContact(option?: EmailContact): string {
    return option ? (`${option.name} | ${option.email} | ${option.company}`) : '';
  }

  private async getTitleOptions() {
    this.subjectOptions = await firstValueFrom(this.entityService.getFieldOptions('title'));
  }

  private filterTitleOptions(property: string): any[] {
    return this.subjectOptions.filter(option => option ? option.toLowerCase().includes(property.toLowerCase()) : false);
  }

  displayFnTitle(option?: any): string {
    return option ? option : '';
  }

  // private async getProjectOptions()
  // {
  //   // this.f.title.reset();
  //   this.projectOptions = await firstValueFrom(this.projectService.get(
  //     [
  //       // { key: 'statusFlag', value: '1' },
  //       // { key: 'statusFlag', value: '2' }
  //     ]
  //   ));
  // }

  // private filterProjectOptions(property: string): any[]
  // {

  //   return this.projectOptions.filter(option => option ? (option.code + '-' + option.title).toLowerCase().includes(property.toLowerCase()) : false);
  // }

  // displayFnProject(option?: any): string
  // {
  //   return option ? (option.code + '-' + option.title) : '';
  // }


  // onTitleTypeChanged()
  // {
  //   this.f.title.reset();
  //   if (this.f.titleType.value)
  //   {
  //     if (this.f.titleType.value == 'Project')
  //     {
  //       this.getProjectOptions();
  //     } else
  //     {
  //       this.getTitleOptions();
  //     }
  //   }
  // }

  protected async getCurrent(id: number) {
    this.currentEntity = await firstValueFrom(this.entityService.getById(id));
    this.afterEntityLoaded();
    this.buildRTDMS();
  }

  protected afterEntityLoaded() {
    this.resetForm();
    this.bindForm(this.currentEntity);
    if (!this.isAllowedToUpdate) {
      this.form.disable();
    }
  }

  async onSelectContact(typeFlag: number = 0) {

    if (!this.assigneeFC.value || !this.assigneeFC.value.id) {
      this.utilityService.showSwalToast('Invalid Contact!', 'Please select a person and try again!', 'error');
      return;
    }

    let _assignee = new RequestTicketAssignee();
    _assignee.requestTicketID = this.currentEntity.id;
    _assignee.contactID = this.assigneeFC.value.id;
    _assignee.typeFlag = typeFlag;
    _assignee.name = (this.assigneeFC.value as EmailContact).name;
    _assignee.email = (this.assigneeFC.value as EmailContact).email;
    _assignee.company = (this.assigneeFC.value as EmailContact).company;

    this.assigneeFC.reset();
    _assignee = await firstValueFrom(this.assigneeService.create(_assignee));
    this.currentEntity.assignees.push(_assignee);

  }

  async onSubmit(task?: WFTask) {
    // stop here if form is invalid
    if (this.form.invalid) {
      this.touchForm();
      console.log('invalid form', this.form);
      this.utilityService.showSweetDialog('Invalid Form',
        'Please fill all required fields with valid data and try again.', 'error'
      );
      return;
    }

    this.currentEntity.purpose = this.f.purpose.value;
    if (this.selectedProject) {
      this.currentEntity.title = `${this.selectedProject.code}-${this.selectedProject.title}`;
    } 
    // else {
    //   this.currentEntity.title = this.f.title.value;
    // }
    this.currentEntity.subtitle = this.f.subtitle.value;
    // this.currentEntity.assigneeContactID = this.f.assignee.value ? (this.f.assignee.value as ContactDto).id : null;
    this.currentEntity.nextReminderDate = this.utilityService.getLocalDate(this.f.nextReminderDate.value);
    this.currentEntity.requestMessage = this.f.requestMessage.value;
    this.currentEntity.stageTitle = this.f.stageTitle.value;
    if (this.currentEntity.stageTitle === 'Approval Stage') {
      this.currentEntity.authority = this.f.authority.value;
    }
    this.currentEntity.reminderInterval = this.f.reminderInterval.value;
    if (!this.currentEntity.title || this.currentEntity.title == '') {
      this.utilityService.showSweetDialog('title is blank!',
        'Please enter a valid title and try again!', 'error'
      );
      return;
    }


    if (this.getFilteredAssignees(this.currentEntity.assignees, this.REQUEST_TICKET_ASSIGNEE_TYPEFLAG_TO).length == 0) {
      this.utilityService.showSweetDialog('Assignee not selected!',
        'Please add atleast 1 assignee contact and try again!', 'error'
      );
      return;
    }
    
    this.currentEntity = await firstValueFrom(this.entityService.update(this.currentEntity));
    this.utilityService.showSwalToast(
      'Success!',
      'Save successful.',
    );
    this.update.emit(this.currentEntity);
    this.entityService.refreshList();
    this.activity.refresh();

    if (task) {
      console.log('Trigger Task complete');
      this.wfTaskService.completeTask(task);
    }

  }

  async onSend() {
    this.currentEntity.isDraft = false;
    this.currentEntity = await firstValueFrom(this.entityService.update(this.currentEntity));
    this.currentEntity = await firstValueFrom(this.entityService.send(this.currentEntity.id));
    this.update.emit(this.currentEntity);
    this.entityService.refreshList();
    this.activity.refresh();
  }

  async onDelete() {
    const _messageText = `Delete ${this.nameOfEntity}: ` + this.currentEntity.title;
    this.utilityService.showConfirmationDialog(_messageText,
      async () => {
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

  getFilteredAssignees(assignees: RequestTicketAssignee[], typeFlag: number = 0): RequestTicketAssignee[] {
    if (assignees) {
      return assignees.filter(x => x.typeFlag == typeFlag);
    }
    return [];
  }

  async onDeleteAssignee(assignee: RequestTicketAssignee) {
    if (assignee) {
      this.currentEntity.assignees = this.currentEntity.assignees.filter(x => x.contactID !== assignee.contactID);
      await firstValueFrom(this.assigneeService.delete(assignee.id));
    }
  }

  private async getCurrentHistory(entity: string, entityID: number) {
    this.historyList = await firstValueFrom(this.entityService.get([{ key: 'parentID', value: entityID.toString() }, { key: 'isreadonly', value: 'true' }]));
  }

  async onDeleteAttachment(item: RequestTicketAttachment) {
    await firstValueFrom(this.attachmentService.delete(item.id));
    this.delete.emit(item);
    this.currentEntity.attachments = this.currentEntity.attachments.filter(x => x.id !== item.id);
  }

  uploadQueue: UploadResult[] = [];
  onUpload(uploads: UploadResult[]) {
    if (!this.isCreateMode) {
      uploads.forEach(x => {
        this.uploadQueue.push(x);
      });
      // console.log(this.uploadQueue);
      this.uploadFiles();
    } else {
      //Creating a dummy object
      uploads.forEach(x => {
        let obj = new RequestTicketAttachment();
        obj.filename = x.filename;
        obj.size = x.size;
        obj.contentType = x.contentType;
        obj.guidname = x.blobPath;
        obj.blobPath = x.blobPath;
        obj.requestTicketID = this.currentEntity.id;
        obj.container = this.blobConfig.container;
        obj.typeFlag = this.currentEntity.typeFlag;
        obj.url = x.url;
        this.currentEntity.attachments.push(obj);
        this.uploadQueue.push(x);
      });
      // console.log(this.currentEntity.attachments,this.uploadQueue);
    }
  }

  private async uploadFiles() {
    let _createRequests: Observable<RequestTicketAttachment>[] = [];
    this.uploadQueue.forEach(x => {
      let obj = new RequestTicketAttachment();
      obj.filename = x.filename;
      obj.size = x.size;
      obj.contentType = x.contentType;
      obj.guidname = x.blobPath;
      obj.blobPath = x.blobPath;
      obj.requestTicketID = this.currentEntity.id;
      obj.container = this.blobConfig.container;
      obj.typeFlag = 0;
      obj.url = x.url;
      obj.originalUrl = x.url;
      _createRequests.push(this.attachmentService.create(obj));
    });
    this.uploadQueue = [];

    var results = await firstValueFrom(forkJoin(_createRequests))

    this.currentEntity.attachments.push(...results);

  }

  onProjectSelected(event: MatAutocompleteSelectedEvent) {
    this.selectedProject = event.option.value;
  }

  async drop(event: CdkDragDrop<any>) {
    if (!this.isAllowedToUpdate) {
      return;
    }
    //Event Container is the updated container where we are pushing the value.
    //Event PreviousContainer is the container where we are removing the value.
    // console.log('previous', event.previousContainer);
    // console.log('current', event.container);
    if (event.previousContainer !== event.container) {
      transferArrayItem(
        event.previousContainer.data.list,
        event.container.data.list,
        event.previousIndex,
        event.currentIndex,
      );

      //Getting the element we are dragging
      let dragged = event.container.data.list[event.currentIndex];
      if (dragged) {
        // console.log('dragged', dragged);
        //Setting the typeflag value of the dragged element to the container we are realising it
        dragged.typeFlag = event.container.data.typeFlag;
        await firstValueFrom(this.assigneeService.update(dragged, true));
        // console.log('Attendee Tranfer SuccessFully');
      }
    }
  }

  getfilteredAssignees(list: RequestTicketAssignee[], typeFlag: number = 0): RequestTicketAssignee[] {
    if (list) {
      return list.filter(x => x.typeFlag == typeFlag);
    }
    return [];
  }


  onCancel() {
    this.cancel.emit();
  }



  onTaskCompleted(e: any) {
    this.taskComplete.emit(e);
  }

  onTaskUpdated(e: any) {
    this.task = Object.assign({}, e);
    if (this.timeline) {
      this.timeline.refresh();
    }
  }

  onRefresh(event: any) {
    this.currentEntity = event;
  }

  onCreate(event: any) {
    this.create.emit(event);
  }

  onUpdate(event: any) {

    this.update.emit(event);
  }


  onRemoveTimeEntry(obj: TimeEntryDto) {
    if (this.task) {
      this.task.timeEntries = this.task.timeEntries.filter((x: any) => x.id !== obj.id);
    }
    if (this.timeline) {
      this.timeline.refresh();
    }
  }

  onUpdateTimeEntries(task: WFTask) {
    if (this.task) {
      this.task = Object.assign({}, task);
    }
  }

  onCheckboxValue(cbValue: MatCheckboxChange) {
    this.currentEntity.isRepeatRequired = cbValue.checked;
    if (cbValue.checked) {
      this.f['nextReminderDate'].enable();
      this.f['reminderInterval'].enable();
      this.f['nextReminderDate'].setValidators([Validators.required]);
      this.f['reminderInterval'].setValidators([Validators.required, Validators.min(0)]);
    } else {
      this.f['nextReminderDate'].clearValidators();
      this.f['reminderInterval'].clearValidators();
      this.f['nextReminderDate'].disable();
      this.f['reminderInterval'].disable();
      this.f['reminderInterval'].setValue(7, { emitEvent: false });
    }
  }

  async buildRTDMS() {
    this.projectFiles = await firstValueFrom(this.projectAttachmentService.get([{ key: 'projectid', value: this.currentEntity.projectID?.toString() ?? '0' }]))
    this.projectFiles.sort((a, b) => a.filename.localeCompare(b.filename));
    this.treeData = this.getTreeMapFromList(this.projectFiles);
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

  onOpenRTDMS() {
    const _dialogConfig = new MatDialogConfig();
    _dialogConfig.autoFocus = true;
    _dialogConfig.disableClose = true;
    _dialogConfig.panelClass = 'mcv-fullscreen-dialog';
    _dialogConfig.data = {
      treeData: this.treeData,
      projectID: this.selectedProject
    }

    const _dialogRef = this.dialog.open(RequestTicketDmsFolderNavigatorComponent, _dialogConfig);
    _dialogRef.afterClosed().subscribe(res => {
      if (res == undefined) {
        this.onUpload(this.filesToUpload);
        this.filesToUpload = [];
      }
    });
  }

  openPhotoDialog(member: any ) {
          this.dialog.open(ContactPhotoNameDialogComponent, {
            data: member
          });
        }
}

