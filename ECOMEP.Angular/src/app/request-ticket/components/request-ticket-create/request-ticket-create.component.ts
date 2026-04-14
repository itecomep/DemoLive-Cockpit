import { effect, inject, OnDestroy } from '@angular/core';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { AppConfig } from 'src/app/app.config';
import { Project, ProjectAttachment } from 'src/app/project/models/project.model';
import { RequestTicket, RequestTicketAttachment } from '../../models/request-ticket';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable, debounceTime, distinctUntilChanged, forkJoin, map, of, switchMap, firstValueFrom, catchError } from 'rxjs';
import { ProjectApiService } from 'src/app/project/services/project-api.service';
import { EmailContact } from 'src/app/shared/models/email-contact';
import { RequestTicketAssignee } from '../../models/request-ticket-assignee';
import { ContactApiService } from 'src/app/contact/services/contact-api.service';
import { Contact } from 'src/app/contact/models/contact';
import { McvFileUploadConfig } from 'src/app/mcv-file/models/mcv-file-upload-config.model';
import { RequestTicketAttachmentApiService } from '../../services/request-ticket-attachment-api.service';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { RequestTicketApiService } from '../../services/request-ticket-api.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { RequestTicketAssigneeApiService } from '../../services/request-ticket-assignee-api.service';
import { CdkDragDrop, transferArrayItem, CdkDropList, CdkDragPlaceholder, CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { McvFileComponent } from '../../../mcv-file/components/mcv-file/mcv-file.component';
import { McvFileUploadComponent, UploadResult } from '../../../mcv-file/components/mcv-file-upload/mcv-file-upload.component';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { NgTemplateOutlet, AsyncPipe, DatePipe, CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { ApiFilter } from 'src/app/shared/models/api-filters';
import { ProjectStageApiService } from 'src/app/project/services/project-stage-api.service';
import { ProjectAttachmentApiService } from 'src/app/project/services/project-attachment-api.service';
import { RequestTicketDmsFolderNavigatorComponent } from '../request-ticket-dms-folder-navigator/request-ticket-dms-folder-navigator.component';
// import {  Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
@Component({
  selector: 'app-request-ticket-create',
  templateUrl: './request-ticket-create.component.html',
  styleUrls: ['./request-ticket-create.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatButtonModule,
    NgTemplateOutlet,
    MatIconModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatCheckboxModule,
    MatDatepickerModule,
    CdkDropList,
    CdkDragPlaceholder,
    CdkDrag,
    CdkDragHandle,
    MatTooltipModule,
    TextFieldModule,
    AsyncPipe,
    DatePipe,
    MatSelectModule,
    // NgxEditorModule,

    //Components
    McvFileComponent,
    McvFileUploadComponent,
  ]
})
export class RequestTicketCreateComponent implements OnInit{

  private formBuilder = inject(FormBuilder);
  private readonly config = inject(AppConfig);
  private readonly matDialog = inject(MatDialog);
  private readonly authService = inject(AuthService);
  private readonly utilityService = inject(UtilityService);
  private readonly contactService = inject(ContactApiService);
  private readonly projectApiService = inject(ProjectApiService);
  private readonly projectStageApiService = inject(ProjectStageApiService);
  private readonly requestTicketService = inject(RequestTicketApiService);
  private readonly appSettingService = inject(AppSettingMasterApiService);
  private readonly assigneeService = inject(RequestTicketAssigneeApiService);
  private readonly attachmentService = inject(RequestTicketAttachmentApiService);
  private readonly projectAttachmentService = inject(ProjectAttachmentApiService);

  form!: FormGroup;
  filesToUpload: UploadResult[] = [];
  treeData: ProjectAttachment[] = [];
  projectFiles: ProjectAttachment[] = [];
  alertMessage: string = "";
  isShowAlert: boolean = false;
  isCreateMode: boolean = false;
  selectedProject!: any;
  selectedTicket?: RequestTicket;
  contactFilter = [];
  subjectOptions: string[] = [];
  blobConfig!: McvFileUploadConfig;
  emailContactOptions: EmailContact[] = [];
  allowEdit = false;
  // unSupportedMediaTypes = ['video', 'audio'];
  filteredSubjects$!: Observable<string[]>;
  filteredProjects$!: Observable<Project[]>;
  filteredSubjectOptions$!: Observable<any>;
  filteredContacts$!: Observable<EmailContact[]>;
  currentEntity: RequestTicket = new RequestTicket();
  selectedAssignees: RequestTicketAssignee[] = [];
  assigneeFC = new FormControl();
  requestTickets: RequestTicket[] = [];
  associations: any[] = [];
  projectFilters: ApiFilter[] = [
    { key: 'statusFlag', value: this.config.PROJECT_STATUS_FLAG_INQUIRY.toString() },
    { key: 'statusFlag', value: this.config.PROJECT_STATUS_FLAG_INPROGRESS.toString() },
    { key: 'statusFlag', value: this.config.PROJECT_STATUS_FLAG_PREPROPOSAL.toString() }
  ];

  readonly DEFAULT_REPEAT_INTERVAL = 7;
  subjectTypeOptions: string[] = [this.config.NAMEOF_ENTITY_PROJECT];
  nameOfEntity = this.config.NAMEOF_ENTITY_REQUEST_TICKET;
  purposeOptions: { purpose: string; message: string }[] = [];
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

  get f(): any { return this.form.controls; }
  get isMobileView(): boolean { return this.utilityService.isMobileView; }
  get currentUser() { return this.authService.currentUserStore?.contact }

  get REQUEST_TICKET_STATUSFLAG_ACTIVE() { return this.requestTicketService.REQUEST_TICKET_STATUSFLAG_ACTIVE; }
  get REQUEST_TICKET_STATUSFLAG_CLOSED() { return this.requestTicketService.REQUEST_TICKET_STATUSFLAG_CLOSED; }

  get REQUEST_TICKET_ASSIGNEE_TYPEFLAG_TO() { return this.assigneeService.REQUEST_TICKET_ASSIGNEE_TYPEFLAG_TO; }
  get REQUEST_TICKET_ASSIGNEE_TYPEFLAG_CC() { return this.assigneeService.REQUEST_TICKET_ASSIGNEE_TYPEFLAG_CC; }
  get REQUEST_TICKET_ASSIGNEE_TYPEFLAG_BCC() { return this.assigneeService.REQUEST_TICKET_ASSIGNEE_TYPEFLAG_BCC; }

  get toList() {
    return this.selectedAssignees
      .filter(x => x.typeFlag == this.REQUEST_TICKET_ASSIGNEE_TYPEFLAG_TO);
  }
  get ccList() {
    return this.selectedAssignees
      .filter(x => x.typeFlag == this.REQUEST_TICKET_ASSIGNEE_TYPEFLAG_CC);
  }
  get bccList() {
    return this.selectedAssignees
      .filter(x => x.typeFlag == this.REQUEST_TICKET_ASSIGNEE_TYPEFLAG_BCC);
  }

  constructor(
    private dialog: MatDialogRef<RequestTicketCreateComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    if (!this.form) {
      this.buildForm();
    }

    //Detects if there are any copied files from DMS
    effect(() => {
      if (this.requestTicketService.copied.length > 0) {
        const _newFile: any = this.requestTicketService.copied[this.requestTicketService.copied.length - 1];
        const fileExists = this.filesToUpload.some(file => file.url === _newFile.url);

        if (!fileExists) {
          this.filesToUpload.push(new UploadResult(_newFile.url, _newFile.filename, _newFile.size, _newFile.contentType, _newFile.blobPath));
        }
      }
    });
  }

  onClose(e: any) {
    this.dialog.close();
  }

  dateFilter = (d: Date | null): boolean => {
    const today = (d || new Date());
    const date = new Date();
    date.setDate(date.getDate() - 1);

    if (today < date) {
      return false;
    }
    return true;
  }

  async ngOnInit() {
    // this.editor = new Editor();

    if (!this.form) {
      this.buildForm();
    }
    await this.appSettingService.loadPresets();
    const _setting = this.appSettingService.presets
      .find(x => x.presetKey == this.config.PRESET_BLOB_CONTAINER_ATTACHMENTS);
    if (_setting)
      this.blobConfig = new McvFileUploadConfig(
        _setting.presetValue,
        `${this.nameOfEntity}`
      );
    const purposeOptionSettings = this.appSettingService.presets
      .find(x => x.presetKey == this.config.PRESET_REQUEST_TICKET_PURPOSE_OPTIONS);
    if (purposeOptionSettings) {
      this.purposeOptions = JSON.parse(purposeOptionSettings.presetValue);
    }
    this.getEmailContactOptions();
    // this.loadProjects();
  }

  // async ngOnDestroy() {
  //   this.editor.destroy();
  // }

  buildForm() {
    this.form = this.formBuilder.group({
      subjectType: new FormControl<any>(this.subjectTypeOptions[0], { validators: [Validators.required] }),
      project: new FormControl<any>(null),
      title: new FormControl<any>(null, { validators: [Validators.required] }),
      subtitle: new FormControl<any>(null),
      purpose: new FormControl<any>(null, { validators: [Validators.required] }),
      requestMessage: new FormControl<any>(null, { validators: [Validators.required] }),
      nextReminderDate: new FormControl<any>(new Date(), { validators: [Validators.required] }),
      reminderInterval: new FormControl<any>(this.DEFAULT_REPEAT_INTERVAL, { validators: [Validators.required] }),
      isRepeatRequired: new FormControl<boolean>(false),
      stageTitle: new FormControl<any>(null),
      revision: new FormControl<any>(0),
      authority: new FormControl<any>(null),
    });

    let message = `Dear Sir/Madam,`;

    const _reminderInterval = this.DEFAULT_REPEAT_INTERVAL;
    const _nextDate = new Date();
    _nextDate.setDate(_nextDate.getDate() + _reminderInterval);
    this.f['nextReminderDate'].setValue(_nextDate, { emitEvent: false });
    this.f['reminderInterval'].setValue(_reminderInterval, { emitEvent: false });
    this.f['requestMessage'].setValue(message, { emitEvent: false });
    this.f['purpose'].setValue('Information', { emitEvent: false });

    this.f['subjectType'].setValue(this.subjectTypeOptions[0]);
    this.onSubjectTypeChanged();

    this.f['subjectType'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
    ).subscribe((value: any) => {
      if (value) {
        this.onSubjectTypeChanged();
      }
    });

    this.filteredProjects$ = this.f['project'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
     switchMap(name => name ? this.getProjectOptions(name as string) : of([])),
    );

    this.filteredSubjectOptions$ = this.f['title'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      map(value => typeof value === 'string' ? value : (value != null ? value : null)),
      map(name => name ? this._filterSubject(name as string) : this.subjectOptions.slice()),
    );

    this.filteredContacts$ = this.assigneeFC.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),

      map(value => value ? (typeof value === 'string' ? value : (value as Contact).name) : null),
      map(name => name ? this.filterContacts(name as string) : this.emailContactOptions.slice()),

    );

    this.touchForm();
  }


  onSubjectTypeChanged() {
    if (this.f['subjectType'].value == 'Custom') {
      this.f['title'].reset();
      this.f['project'].reset();
      this.f['title'].setValidators([Validators.required, Validators.minLength(3)]);
      this.f['project'].setValidators();
      // this.f['stage'].setValidators();
    } {
      this.f['title'].reset();
      this.f['project'].reset();
      this.f['title'].setValidators();
      this.f['project'].setValidators([Validators.required, Validators.minLength(3)]);
      // this.f['stage'].setValidators([Validators.required]);
    }
  }

  getErrorMessage(control: AbstractControl) {
    return this.utilityService.getErrorMessage(control);
  }

  private touchForm() {
    if (this.form) {
      Object.keys(this.form.controls).forEach(field => {
        const control = this.form.get(field);
        if (control)
          control.markAsTouched({ onlySelf: true });
      });
    }
  }

 private getProjectOptions(search: string): Observable<string[]> {
    return this.projectApiService.getPages(0, 20, this.projectFilters, search).pipe(map(data => data ? data.list.map((x: Project) => x) : []));
  }

  private getEmailContactOptions() {
    this.contactService.getEmailOptions(this.contactFilter, '', 'fullName').subscribe(data => this.emailContactOptions = data);
  }

  private async getUserPreviousRT() {
    const _filter: ApiFilter[] = [];
    _filter.push(
      { key: 'assignerContactID', value: this.currentUser ? this.currentUser.id.toString() : '0' },
      { key: 'projectID', value: this.selectedProject.id.toString() }
    )
    this.requestTickets = await firstValueFrom(this.requestTicketService.get(_filter));
    this.requestTickets.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
    if (this.requestTickets && this.requestTickets.length > 3) {
      this.requestTickets = this.requestTickets.slice(0, 3);
    }
    // this.requestTickets 
  }

  private _filterSubject(property: string): any[] {
    return this.subjectOptions.filter(option => option ? option.toLowerCase().includes(property.toLowerCase()) : false);
  }

  async onProjectSelected(event: MatAutocompleteSelectedEvent) {
    this.selectedProject = event;
    await this.getUserPreviousRT();
    this.requestTicketService.clearCopied();
    this.buildRTDMS();
    if (this.selectedProject && this.selectedProject.id) {
      await this.loadProjectAssociations(this.selectedProject.id);
    }
  }

  private async loadProjectAssociations(projectId: number)
  {

    const project = await firstValueFrom(this.projectApiService.getById(projectId));
    this.associations = project.associations || [];
    console.log('Project associations:', this.associations);
  }

  addToRecipients(association: any, type: 'TO' | 'CC' | 'BCC') {
    const typeFlag = type === 'TO' ? this.REQUEST_TICKET_ASSIGNEE_TYPEFLAG_TO : (type === 'CC' ? this.REQUEST_TICKET_ASSIGNEE_TYPEFLAG_CC : this.REQUEST_TICKET_ASSIGNEE_TYPEFLAG_BCC);
    console.log('Adding to recipients:', association);
    const exists = this.selectedAssignees.find(x => x.contactID === association.contact?.id);
    console.log('Already exists:', this.selectedAssignees);
    if (exists) {
      this.utilityService.showSwalToast('Already Added', 'This contact is already in the recipients list.', 'info');
      return;
    }

    let _assignee = new RequestTicketAssignee();
    _assignee.contactID = association.contact?.id || 0;
    _assignee.typeFlag = typeFlag;
    _assignee.name = association.contact?.fullName || '';
    _assignee.email = association.contact?.email || '';
    _assignee.company = association.contact?.company || '';

    this.selectedAssignees.push(_assignee);
  }

  getContactTypeFlag(association: any): number | null {
    const assignee = this.selectedAssignees.find(x => x.contactID === association.contact?.id);
    return assignee ? assignee.typeFlag : null;
  }
  isContactAdded(association: any): boolean {
    return this.selectedAssignees.some(x => x.contactID === association.contact?.id);
  }

  displayFnProject(option?: any): string {
    return option ? (option.code + '-' + option.title) : '';
  }

  displayFnSubject(option?: any): string {
    return option ? option : '';
  }

  displayFnContact(option?: EmailContact): string {
    return option ? (`${option.name} | ${option.email}`) : '';
  }



  onSelectContact(typeFlag: number = 0) {

    if (!this.assigneeFC.value || !this.assigneeFC.value.id) {
      this.utilityService.showSwalToast('Invalid Contact!', 'Please select a person and try again!', 'error');
      return;
    }

    let _assignee = new RequestTicketAssignee();
    _assignee.contactID = this.assigneeFC.value.id;
    _assignee.typeFlag = typeFlag;
    _assignee.name = (this.assigneeFC.value as EmailContact).name;
    _assignee.email = (this.assigneeFC.value as EmailContact).email;
    _assignee.company = (this.assigneeFC.value as EmailContact).company;

    this.assigneeFC.reset();
    this.selectedAssignees.push(_assignee);

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

  getFilteredAssignees(assignees: RequestTicketAssignee[], typeFlag: number = 0): RequestTicketAssignee[] {
    if (assignees) {
      return assignees.filter(x => x.typeFlag == typeFlag);
    }
    return [];
  }

  onDeleteAssignee(assignee: RequestTicketAssignee) {
    if (assignee) {
      this.currentEntity.assignees = this.currentEntity.assignees.filter(x => x.contactID !== assignee.contactID);
      this.selectedAssignees = this.selectedAssignees.filter(x => x.contactID !== assignee.contactID);
    }
  }

  uploadQueue: UploadResult[] = [];
  onUpload(uploads: UploadResult[]) {

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

  }

  private async uploadFiles() {
    if (this.uploadQueue.length == 0) {
      return;
    }
    let _createRequests: Observable<RequestTicketAttachment>[] = [];
    this.currentEntity.attachments = [];
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
    const result = await firstValueFrom(forkJoin(_createRequests));
    this.currentEntity.attachments.push(...result);
  }

  onDeleteAttachment(item: RequestTicketAttachment) {
    this.currentEntity.attachments = this.currentEntity.attachments.filter(x => x.uid !== item.uid);
    this.uploadQueue = this.uploadQueue.filter(x => x.filename !== item.filename)
  }

  async uploadAssignee() {
    let _assignees: Observable<RequestTicketAssignee>[] = [];
    this.selectedAssignees.forEach(x => {
      x.requestTicketID = this.currentEntity.id
      _assignees.push(this.assigneeService.create(x));
    })
    // const result = await firstValueFrom(forkJoin(_assignees));
    // this.currentEntity.assignees.push(...result);

    const results = await firstValueFrom(forkJoin(_assignees));
    this.currentEntity.assignees.push(...results);
  }

  async onSubmit(isDraft: boolean = false) {
    if (this.f['subjectType'].value == 'Project') {
      this.currentEntity.title = `${(this.f['project'].value as Project).code}-${(this.f['project'].value as Project).title}`;
      this.currentEntity.projectID = (this.f['project'].value as Project).id;
      if (!this.currentEntity.projectID) {
        {
          this.utilityService.showSwalToast('Incomplete Data',
            'Please select project from the list.', 'error'
          );
          return
        }
      }
    } else {
      this.currentEntity.title = this.f['title'].value;
    }

    const _to = this.selectedAssignees.filter(x => x.typeFlag == this.REQUEST_TICKET_ASSIGNEE_TYPEFLAG_TO);
    if (_to.length == 0) {
      this.utilityService.showSwalToast('Incomplete Data',
        'Please select at least one To contact.', 'error'
      );
      return
    }

    if (this.currentEntity.attachments.length == 0) {
      this.utilityService.showConfirmationDialog('No attachments attached!, Do you still want to send mail?', async () => {
        this.submitForm(isDraft);
      });
    } else {
      this.submitForm(isDraft);
    }
  }

  async submitForm(isDraft:boolean) {
    this.currentEntity.subtitle = this.f['subtitle'].value;
    this.currentEntity.purpose = this.f['purpose'].value;
    this.currentEntity.requestMessage = this.f['requestMessage'].value;
    this.currentEntity.nextReminderDate = this.f['nextReminderDate'].value;
    this.currentEntity.reminderInterval = this.f['reminderInterval'].value;
    this.currentEntity.assignerContactID = this.authService.currentUserStore ? this.authService.currentUserStore.contact.id : 0;
    this.currentEntity.code = 'abc';
    this.currentEntity.attachments = [];
    this.currentEntity.assignees = [];
    this.currentEntity.isDraft = isDraft;
    this.currentEntity.revision = this.f['revision'].value;
    if (this.f['subjectType'].value == 'Project') {
      this.currentEntity.stageTitle = this.f['stageTitle'].value;
    }

    if (this.f['stageTitle'].value == 'Approval Stage') {
      this.currentEntity.authority = this.f['authority'].value;
    }
    console.log(this.currentEntity);
    this.currentEntity = await firstValueFrom(this.requestTicketService.create(this.currentEntity));
    await this.uploadFiles();
    await this.uploadAssignee();
    if (!isDraft) {
      this.currentEntity = await firstValueFrom(this.requestTicketService.send(this.currentEntity.id));
    }
    this.dialog.close(this.currentEntity);
  }

  async drop(event: CdkDragDrop<any>) {
    //Event Container is the updated container where we are pushing the value.
    //Event PreviousContainer is the container where we are removing the value.
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
        //Setting the typeflag value of the dragged element to the container we are realising it
        dragged.typeFlag = event.container.data.typeFlag;
        await firstValueFrom(this.assigneeService.update(dragged, true));
      }
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

  onSelectTicket(ticket: RequestTicket) {
    this.selectedAssignees = [];
    this.selectedTicket = ticket;
    if (this.selectedTicket.assignees && this.selectedTicket.assignees.length > 0) {
      this.selectedTicket.assignees.forEach(x => {
        let _assignee = new RequestTicketAssignee();
        _assignee.contactID = x.contactID;
        _assignee.typeFlag = x.typeFlag;
        _assignee.name = x.name;
        _assignee.email = x.email;
        _assignee.company = x.company;
        this.selectedAssignees.push(_assignee);
      });
    }
  }

  filterAssignee(ticket: RequestTicket, typeFlag: number) {
    const _assignee = ticket.assignees.filter(x => x.typeFlag == typeFlag);
    return _assignee ?? [];
  }

  onPurposeChange(purposeData: MatSelectChange) {
    const _getMessage = this.purposeOptions.find(x => x.purpose == purposeData.value);
    if (_getMessage) {
      this.f['requestMessage'].setValue(_getMessage.message);
    }
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

  async buildRTDMS() {
    this.projectFiles = await firstValueFrom(this.projectAttachmentService.get([{ key: 'projectid', value: this.selectedProject.id.toString() }]))
    this.projectFiles.sort((a, b) => a.filename.localeCompare(b.filename));
    this.treeData = this.getTreeMapFromList(this.projectFiles);
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

    const _dialogRef = this.matDialog.open(RequestTicketDmsFolderNavigatorComponent, _dialogConfig);
    _dialogRef.afterClosed().subscribe(res => {
      if (res == undefined) {
        this.onUpload(this.filesToUpload);
        this.filesToUpload = [];
      }
    });
  }
}
