import { DatePipe, NgIf, NgFor, AsyncPipe, DecimalPipe, CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgZone, OnInit, Output, ViewChild, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { CdkDragDrop, transferArrayItem, CdkDropList, CdkDragPlaceholder, CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';

import { MeetingApiService } from '../../services/meeting-api.service';
import { ContactApiService } from 'src/app/contact/services/contact-api.service';
import { Observable, debounceTime, distinctUntilChanged, firstValueFrom, forkJoin, map, of, startWith, switchMap, take } from 'rxjs';
import { MeetingAttendeeApiService } from '../../services/meeting-attendee-api.service';
import { MeetingAgendaApiService } from 'src/app/meeting/services/meeting-agenda-api.service';

import { Meeting, MeetingDocumentsCarried, MeetingGmap } from '../../models/meeting.model';
import { EmailContact } from 'src/app/shared/models/email-contact';
import { MeetingAttendee } from '../../models/meeting-attendee.model';
import { MeetingAgenda } from 'src/app/meeting/models/meeting-agenda.model';
import { ApiFilter } from 'src/app/shared/models/api-filters';
import { MeetingAgendaFormComponent } from '../meeting-agenda-form/meeting-agenda-form.component';
import { McvFileUploadConfig } from 'src/app/mcv-file/models/mcv-file-upload-config.model';
import { WFTask } from 'src/app/wf-task/models/wf-task.model';
import { AppConfig } from 'src/app/app.config';
import { AuthService } from 'src/app/auth/services/auth.service';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { WFTaskApiService } from 'src/app/wf-task/services/wf-task-api.service';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { McvTimeEntryTimeLineComponent } from 'src/app/mcv-time-entry/components/mcv-time-entry-time-line/mcv-time-entry-time-line.component';
import { McvComponentConfig } from 'src/app/shared/models/mcv-component-config';
import { TimeEntryDto } from 'src/app/shared/models/time-entry-dto';
import { MinutesComponent } from '../minutes/minutes.component';
import { MeetingAgendaComponent } from '../meeting-agenda/meeting-agenda.component';
import { MatTabsModule } from '@angular/material/tabs';
import { McvActivityListComponent } from '../../../mcv-activity/components/mcv-activity-list/mcv-activity-list.component';
import { WfTaskActionComponent } from '../../../wf-task/components/wf-task-action/wf-task-action.component';
import { McvTimeEntryListComponent } from '../../../mcv-time-entry/components/mcv-time-entry-list/mcv-time-entry-list.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { WftaskTitleBarComponent } from '../../../wf-task/components/wftask-title-bar/wftask-title-bar.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';
import { Project } from 'src/app/project/models/project.model';
import { MatSelectModule } from '@angular/material/select';
import { McvFileUploadComponent, UploadResult } from 'src/app/mcv-file/components/mcv-file-upload/mcv-file-upload.component';
import { McvFileComponent } from 'src/app/mcv-file/components/mcv-file/mcv-file.component';
import { MeetingAttachment } from '../../models/meeting-attachments.model';
import { MeetingAttachmentApiService } from '../../services/meeting-attachment-api.service';
import { MeetingExternalAttendeesComponent } from '../meeting-external-attendees/meeting-external-attendees.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ProjectApiService } from 'src/app/project/services/project-api.service';
import { MeetingVoucherComponent } from '../meeting-voucher/meeting-voucher.component';
import { MeetingVoucher } from '../../models/meeting-voucher.model';
import { MeetingTimeEntryListComponent } from '../meeting-time-entry-list/meeting-time-entry-list.component';
import { StatusMasterService } from 'src/app/shared/services/status-master.service';
import { ContactPhotoNameDialogComponent } from 'src/app/shared/components/contact-photo-name-dialog/contact-photo-name-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTooltipModule,
    WftaskTitleBarComponent,
    MatExpansionModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    NgxMaterialTimepickerModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatIconModule,
    MatButtonModule,
    CdkDropList,
    CdkDragPlaceholder,
    CdkDrag,
    CdkDragHandle,
    MatTabsModule,
    AsyncPipe,
    DecimalPipe,
    DatePipe,
    MatRadioModule,
    MatSelectModule,
    MatOptionModule,
    MatCheckboxModule,

    //Components
    WfTaskActionComponent,
    McvActivityListComponent,
    MeetingAgendaComponent,
    MinutesComponent,
    McvFileUploadComponent,
    McvFileComponent,
    MeetingExternalAttendeesComponent,
    MeetingVoucherComponent,
    McvTimeEntryListComponent,
    MeetingTimeEntryListComponent
  ]
})
export class MeetingComponent implements OnInit {

  currentEntity: Meeting = new Meeting();
  nameOfEntity = this.config.NAMEOF_ENTITY_MEETING;
  entityID!: number;
  task: WFTask | any;
  isCreateMode: boolean = false;
  isTaskMode: boolean = false;
  entityTypeFlag: number = 0;
  configData: any;
  isDuplicated: boolean = false;
  blobConfig!: McvFileUploadConfig;
  meetingPurposeOptions: string[] = [
    'Meeting',
    'Site Visit',
    'Slab Checking'
  ];
  selectedProject!: Project;
  filteredProjects$!: Observable<Project[]>;
  filteredSubjectOptions$!: Observable<any>;
  filteredContactsForContactPerson$!: Observable<EmailContact[]>;
  contactPersonForm!: FormGroup;
  voucherForm!: FormGroup;
  subjectTypeOptions: string[] = [this.config.NAMEOF_ENTITY_PROJECT];
  newVoucher = new MeetingVoucher();

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
  get cpf(): any { return this.contactPersonForm?.controls; }
  get isMobileView(): boolean { return this.utilityService.isMobileView; }

  private readonly meetingAgendaApiService = inject(MeetingAgendaApiService);
  private readonly meetingAttendeeApiService = inject(MeetingAttendeeApiService);

  taskform!: FormGroup;
  // agendaform!: FormGroup;
  minDate: Date = new Date();
  statusOptions: any[] = [];
  emailContactOptions: EmailContact[] = [];
  selectedAgendaType: any = { text: "Custom", value: 0 };
  isShowDateMismatchError: boolean = false;
  meetingEditDuration = 3;
  filteredEntityOptions$!: Observable<any[]>;
  filteredAttendeeOptions$!: Observable<EmailContact[]>;
  filteredActionByOptions$!: Observable<any[]>;
  filteredScriptOptions$!: Observable<any[]>;
  filteredSubmissionOptions$!: Observable<any[]>;
  filteredCustomAgendaOptions$!: Observable<any[]>;
  assigneeFC = new FormControl();
  filteredContacts$!: Observable<EmailContact[]>;
  // convenience getter for easy access to form fields
  get tf(): any { return this.taskform.controls; }

  get minutesGap(): number { return this.config.MEETING_MINUTES_GAP; }
  get minTime() { return this.config.MEETING_MIN_TIME; }
  get maxTime() { return this.config.MEETING_MAX_TIME; }

  get MEETING_TYPEFLAG_MEETING() { return this.config.MEETING_TYPEFLAG_MEETING; }
  get MEETING_TYPEFLAG_INSPECTION() { return this.config.MEETING_TYPEFLAG_INSPECTION; }
  get MEETING_TYPEFLAG_CNOTE() { return this.config.MEETING_TYPEFLAG_CNOTE; }

  get MEETING_STATUSFLAG_CANCELLED() { return this.config.MEETING_STATUSFLAG_CANCELLED }
  get MEETING_STATUSFLAG_PENDING() { return this.config.MEETING_STATUSFLAG_PENDING }
  get MEETING_STATUSFLAG_SENT() { return this.config.MEETING_STATUSFLAG_SENT }
  get MEETING_STATUSFLAG_POSTPONED() { return this.config.MEETING_STATUSFLAG_POSTPONED }
  get MEETING_STATUSFLAG_HOLD() { return this.config.MEETING_STATUSFLAG_HOLD }
  get MEETING_STATUSFLAG_FOLLOWUP() { return this.config.MEETING_STATUSFLAG_FOLLOWUP }

  get MEETING_ATTENDEE_TYPEFLAG_TO() { return this.meetingAttendeeApiService.MEETING_ATTENDEE_TYPEFLAG_TO; }
  get MEETING_ATTENDEE_TYPEFLAG_CC() { return this.meetingAttendeeApiService.MEETING_ATTENDEE_TYPEFLAG_CC; }

  get isPermissionSpecialEdit() { return this.entityService.isPermissionSpecialEdit; }
  get isPermissionSpecialDelete() { return this.entityService.isPermissionSpecialDelete; }

  public readonly MEETING_ATTENDEE_INTERNAL = this.config.MEETING_ATTENDEE_INTERNAL;
  public readonly MEETING_ATTENDEE_EXTERNAL = this.config.MEETING_ATTENDEE_EXTERNAL;
  public readonly MEETING_ATTENDEE_CONTACT_PERSON = this.config.MEETING_ATTENDEE_CONTACT_PERSON;

  // get attendeeTo() { return this.currentEntity && this.currentEntity.attendees ? this.currentEntity.attendees.filter(x => x.typeFlag == this.MEETING_ATTENDEE_TYPEFLAG_TO) : []; }
  // get attendeeCC() { return this.currentEntity && this.currentEntity.attendees ? this.currentEntity.attendees.filter(x => x.typeFlag == this.MEETING_ATTENDEE_TYPEFLAG_CC) : []; }

  get toList() {
    return this.currentEntity.attendees
      .filter(x => x.typeFlag == this.MEETING_ATTENDEE_TYPEFLAG_TO);
  }
  get ccList() {
    return this.currentEntity.attendees
      .filter(x => x.typeFlag == this.MEETING_ATTENDEE_TYPEFLAG_CC);
  }

  get isAllowedToUpdate() {
    return this.isPermissionSpecialEdit || this.currentEntity.statusFlag !== this.MEETING_STATUSFLAG_SENT;
  }
  get isAllowedToSendUpdate() {
    return this.currentEntity.statusFlag == this.MEETING_STATUSFLAG_SENT
      && (this.isPermissionSpecialEdit || this.currentEntity?.isEditable);
  }
  get isAllowedToDelete() {
    return (this.isPermissionSpecialDelete
      || this.currentEntity?.statusFlag != this.MEETING_STATUSFLAG_SENT);
  }

  get internalAttendeeList() {
    return this.currentEntity.attendees
      .filter(x => x.typeFlag == this.config.MEETING_ATTENDEE_INTERNAL);
  }

  get externalAttendeeList() {
    return this.currentEntity.attendees
      .filter(x => x.typeFlag == this.config.MEETING_ATTENDEE_EXTERNAL);
  }

  get contactPersonList() {
    return this.currentEntity.attendees
      .filter(x => x.typeFlag == this.config.MEETING_ATTENDEE_CONTACT_PERSON);
  }

  TASK_STAGE_MEETING_PREPARE_MINUTES = this.config.TASK_STAGE_MEETING_PREPARE_MINUTES;

  dateFilter = (d: Date | null): boolean => {
    // Prevent Saturday and Sunday from being selected.
    // if (d.getDay() === 0) {
    //   return false;
    // }
    const day = (d || new Date());
    const date = new Date();
    date.setDate(date.getDate() - 1);

    if (day < date) {
      return false;
    }
    return true;
  }

  constructor(
    private datePipe: DatePipe,
    private entityService: MeetingApiService,
    private contactService: ContactApiService,
    private agendaService: MeetingAgendaApiService,
    private attendeeService: MeetingAttendeeApiService,
    private wfTaskService: WFTaskApiService,
    private appSettingService: AppSettingMasterApiService,
    private utilityService: UtilityService,
    private formBuilder: FormBuilder,
    private ngZone: NgZone,
    private config: AppConfig,
    private authService: AuthService,
    private meetingAttachmentService: MeetingAttachmentApiService,
    private projectApiService: ProjectApiService,
    private statusMasterService: StatusMasterService,
    private dialog: MatDialog,
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
    this.minDate = new Date(this.minDate.setMinutes(0));
    this.getAttendeeOptions();
    this.getStatusOptions();
    if (!this.form)
      this.buildForm();
    if (!this.appSettingService.presets || !this.appSettingService.presets.length) {
      await this.appSettingService.loadPresets();
    }
    const _setting = this.appSettingService.presets
      .find(x => x.presetKey == this.config.PRESET_BLOB_CONTAINER_ATTACHMENTS);
    if (_setting) {
      this.blobConfig = new McvFileUploadConfig(
        _setting.presetValue,
        `${this.config.NAMEOF_ENTITY_MEETING_AGENDA}`
      );
    }

    this.meetingEditDuration = Number(this.appSettingService.presets
      .find(x => x.presetKey == this.config.PRESET_MEETING_UPDATE_ALLOW_DURATION));

  }

  async refresh() {
    this.currentEntity = new Meeting();
    this.buildForm();
    await this.getStatusOptions();

    if (this.entityID && this.entityID !== -1) {

      this.getCurrent(this.entityID);
    } else {
      this.getSubjectOptions();

      this.f.fromDate.setValue(this.minDate);
      this.f.toDate.setValue(this.minDate);
      this.f.fromTime.setValue(this.utilityService.getTimeValue(this.minDate, this.minutesGap));
      this.f.toTime.setValue(this.utilityService.getTimeValue(this.minDate, this.minutesGap));
    }
  }
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

  buildForm() {
    this.form = this.formBuilder.group({
      title: new FormControl<any>(null, { validators: [Validators.required] }),
      subjectType: new FormControl<any>(this.subjectTypeOptions[0], { validators: [Validators.required] }),
      project: new FormControl<any>(null),
      startDate: new FormControl<any>(null, { validators: [Validators.required] }),
      startTime: new FormControl<any>(null, { validators: [Validators.required] }),
      endDate: new FormControl<any>(null, { validators: [Validators.required] }),
      endTime: new FormControl<any>(null, { validators: [Validators.required] }),
      location: new FormControl<any>(null, { validators: [Validators.required] }),
      purpose: new FormControl<any>(null, { validators: [Validators.required] }),
      statusFlag: new FormControl<any>(null),
      remark: new FormControl<any>(null),
      isFollowUp: new FormControl<any>(null),
      followUpRemark: new FormControl<any>(null),

      gmaps: this.formBuilder.array([]),
      documentsCarried: this.formBuilder.array([]),
      vouchers: this.formBuilder.array([]),
    });

    this.contactPersonForm = this.formBuilder.group({
      name: new FormControl<any>(null, { validators: [Validators.required] }),
      phone: new FormControl<any>(null),
      email: new FormControl<any>(null, { validators: [Validators.required] }),
    });

    this.voucherForm = this.formBuilder.group({
      expenseHead: new FormControl<any>(null, { validators: [Validators.required] }),
      amount: new FormControl<any>(null),
      particulars: new FormControl<any>(null, { validators: [Validators.required] }),
    });

    this.f['startDate'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
    ).subscribe((value: any) => {
      if (value) {
        this.validateDates();
      }
    });

    this.f['endDate'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
    ).subscribe((value: any) => {
      if (value) {
        this.validateDates();
      }
    });

    this.f['startTime'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
    ).subscribe((value: any) => {
      if (value) {
        this.validateDates();
      }
    });

    this.f['endTime'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
    ).subscribe((value: any) => {
      if (value) {
        this.validateDates();
      }
    });
    this.filteredProjects$ = this.f['project'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(name => name ? this.getProjectOptions(name as string) : of([])),
    );

    this.filteredContacts$ = this.assigneeFC.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      map(value => value ? (typeof value === 'string' ? value : (value as EmailContact).name) : null),
      map(name => name ? this.filterContacts(name as string) : this.emailContactOptions.slice()),
    );


    this.filteredContactsForContactPerson$ = this.contactPersonForm.get('name')!.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      map(value => value ? (typeof value === 'string' ? value : (value as EmailContact).name) : null),
      map(name => name ? this.filterEmailContacts(name as string) : this.emailContactOptions.slice()),
    );
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
    return option ? (`${option.name} | ${option.email}`) : '';
  }

  displayFnContactName(option?: EmailContact): string {
    return option ? option.name : '';
  }

  displayFnActionBy(option?: any): string {
    return option ? option.name + " | " + option.company : '';
  }

  private getProjectOptions(search: string): Observable<string[]> {
    return this.projectApiService.getPages(0, 20, [
    ], search).pipe(map(data => data ? data.list.map((x: Project) => x) : []));
  }

  private async setProjectById(projectId: number) {
    const _project = await firstValueFrom(this.projectApiService.getById(projectId));
    if (_project) {
      this.f['project'].setValue(_project);
      this.selectedProject = _project;
    }
  }

  private filterEmailContacts(property: string): any[] {
    return this.emailContactOptions.filter(option => {
      return option ?
        (option.name.toLowerCase().includes(property.toLowerCase())
          || option.email.toLowerCase().includes(property.toLowerCase())
        )
        : false;
    });
  }

  private validateDates(): boolean {

    if (this.f['startDate'].value && this.f['endDate'].value) {
      const startTime = this.f['startTime'].value;
      const endTime = this.f['endTime'].value;
      if (startTime && endTime) {
        let startDate = this.utilityService.setTimeValue(this.f['startDate'].value, startTime);
        let endDate = this.utilityService.setTimeValue(this.f['endDate'].value, endTime);
        if (startDate > endDate) {

          let _end = startDate;
          _end.setHours(_end.getHours() + 1);
          this.f['endDate'].setValue(_end);
          this.f['endTime'].setValue(this.utilityService.getTimeValue(_end, this.minutesGap));
          return true;
        }
      }
    }

    if (this.f['endDate'] && this.f['startDate']) {
      const start = (new Date(this.f['endDate'].value)).getDate();
      const end = (new Date(this.f['startDate'].value)).getDate();
      // const startTime = (new Date(this.f.startDate.value)).getTime();
      // const endTime = (new Date(this.f.endDate.value)).getTime();

      if (start > end) {
        this.isShowDateMismatchError = true;
      } else {
        this.isShowDateMismatchError = false;
      }

      if (start < end) {
        this.utilityService.showSweetDialog('Invalid Form',
          `To Date ${this.datePipe.transform(this.f['endDate'].value, 'dd MMM y')} can't be lesser than from date ${this.datePipe.transform(this.f['startDate'].value, 'dd MMM y')}.`, 'error'
        );
      }

      // if (endTime < startTime) {
      //   this.utilityService.showSweetDialog('Invalid Form',
      //     "To t can't be lesser than from date.", 'error'
      //   );
      // }

      const startTimeVal = this.f['startTime'].value;
      const endTimeVal = this.f['endTime'].value;
      if (startTimeVal && this.f['startDate'].value) {
        this.currentEntity.startDate = this.utilityService.setTimeValue(this.f['startDate'].value, startTimeVal);
      }
      if (endTimeVal && this.f['endDate'].value) {
        this.currentEntity.endDate = this.utilityService.setTimeValue(this.f['endDate'].value, endTimeVal);
      }
    }
    return false;
  }


  bindForm() {
    if (this.currentEntity) {
      this.f['title'].setValue(this.currentEntity.title);
      this.f['startDate'].setValue(this.currentEntity.startDate);
      // this.f['startTime'].setValue(this.utilityService.getTimeValue(this.currentEntity.startDate, this.minutesGap));
      this.f['startTime'].setValue(
        this.utilityService.getTimeValue(this.currentEntity.startDate, this.minutesGap),
        { emitEvent: false }
      );
      this.f['endTime'].setValue(
        this.utilityService.getTimeValue(this.currentEntity.endDate, this.minutesGap),
        { emitEvent: false }
      );
      this.f['endDate'].setValue(this.currentEntity.endDate);
      // this.f['endTime'].setValue(this.utilityService.getTimeValue(this.currentEntity.endDate, this.minutesGap));
      this.f['location'].setValue(this.currentEntity.location);
      this.f['purpose'].setValue(this.currentEntity.purpose);
      this.f['remark'].setValue(this.currentEntity.remark);
      if (this.currentEntity.projectID) {
        this.setProjectById(this.currentEntity.projectID);
      }

      const _status = this.statusOptions.find(x => x.value == this.currentEntity.statusFlag);
      if (_status) {
        this.f['statusFlag'].setValue(_status.value);
      }

      this.currentEntity.gmaps.forEach((gmap: MeetingGmap) => {
        this.addGmap(gmap);
      });

      this.currentEntity.documentsCarried.forEach((documentCarried: MeetingDocumentsCarried) => {
        this.addDocumentCarried(documentCarried);
      });
      this.onAddDocumentsCarried();
      this.onAddGmap();
      // this.onAddExpense();

      // if (!this.currentEntity.isEditable) {
      //   this.form.disable();
      //   this.assigneeFC.disable();

      // }
    }
  }


  onClickSaveAndSend() {
    let _messageText = `Send minutes: ${this.currentEntity.code}`;
    if (this.currentEntity.statusFlag === this.MEETING_STATUSFLAG_SENT) {
      _messageText = `Resend minutes: ${this.currentEntity.code}`;
    }
    this.utilityService.showConfirmationDialog(_messageText,
      async () => {
        this.currentEntity.location = this.f['location'].value
        const startTimeVal = this.f['startTime'].value;
        const endTimeVal = this.f['endTime'].value;
        if (startTimeVal && this.f['startDate'].value) {
          this.currentEntity.startDate = this.utilityService.setTimeValue(this.f['startDate'].value, startTimeVal);
        }
        if (endTimeVal && this.f['endDate'].value) {
          this.currentEntity.endDate = this.utilityService.setTimeValue(this.f['endDate'].value, endTimeVal);
        }

        this.currentEntity = await firstValueFrom(this.entityService.update(this.currentEntity));
        this.f['comment'].reset();

        this.currentEntity = await firstValueFrom(this.entityService.send(this.currentEntity.id));
        this.getVersions();
        this.utilityService.showSwalToast(
          'Success!',
          'Send successful.',
        );
        this.update.emit(this.currentEntity);
        this.entityService.refreshList();
        this.activity.refresh();

      }
    );
  }

  onDelete() {
    const _messageText = `Delete ${this.nameOfEntity}: ${this.currentEntity.title}`;
    this.utilityService.showConfirmationDialog(_messageText,
      async () => {
        await firstValueFrom(this.entityService.delete(this.currentEntity.id));
        this.utilityService.showSwalToast(
          'Success!',
          'Delete successful.',
        );

        this.delete.emit(this.currentEntity);
        this.entityService.deleteFromList();

      }
    );
  }

  async drop(event: CdkDragDrop<any>) {
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
        await firstValueFrom(this.attendeeService.update(dragged, true));
        // console.log('Attendee Tranfer SuccessFully');
      }
    }
  }

  private async getStatusOptions() {
    this.statusOptions = await firstValueFrom(this.statusMasterService.get([{ key: 'Entity', value: this.nameOfEntity }]));
  }

  //Attendee
  private _filterAttendee(property: string): any[] {
    const filtervalue = property ? property.toLowerCase() : '';
    return this.emailContactOptions.filter(option => option.name.toLowerCase().includes(filtervalue));
  }

  private _filterActionBy(property: string): any[] {
    const filterValue = property ? property.toLowerCase() : '';
    return this.currentEntity.attendees.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  private async getAttendeeOptions() {
    this.emailContactOptions = await firstValueFrom(this.contactService.getEmailOptions());
  }

  onSelectContact(typeFlag: number = 0) {
    if (!this.assigneeFC.value || !this.assigneeFC.value.id) {
      this.utilityService.showSwalToast('Invalid Contact!', 'Please select a person and try again!', 'error');
      return;
    }

    let _assignee = new MeetingAttendee();
    _assignee.meetingID = this.currentEntity.id,
      _assignee.contactID = this.assigneeFC.value.id;
    _assignee.typeFlag = typeFlag;
    _assignee.name = (this.assigneeFC.value as EmailContact).name;
    _assignee.email = (this.assigneeFC.value as EmailContact).email;
    _assignee.company = (this.assigneeFC.value as EmailContact).company;

    this.assigneeFC.reset();
    this.createAttendee(_assignee);
  }

  onDeleteAssignee(assignee: MeetingAttendee) {
    if (assignee) {

      this.currentEntity.attendees = this.currentEntity.attendees.filter(x => x.contactID !== assignee.contactID);

    }
  }


  async onDeleteAttendee(item: MeetingAttendee) {
    await firstValueFrom(this.attendeeService.delete(item.id))
    this.currentEntity.attendees = this.currentEntity.attendees.filter(x => {
      return x.id !== item.id;
    });
    this.utilityService.showSwalToast(
      'Success!',
      'Save successful.',
    );
    this.activity.refresh();

  }

  createAttendee(obj: any) {
    this.attendeeService.create(obj).subscribe(
      (data) => {
        this.utilityService.showSwalToast(
          'Success!',
          'Save successful.',
        );

        this.currentEntity.attendees.push(data);
        this.activity.refresh();
      });
  }

  private async getCurrent(id: number) {
    this.currentEntity = await firstValueFrom(this.entityService.getById(id));
    this.getVersions();
    if (this.currentEntity.agendas.length == 0) {
      this.getAgendas();
    }

    if (this.currentEntity.attendees.length == 0) {
      this.getAttendees();
    }
    this.bindForm();
    if (this.isTaskMode) {
      const tasks = await firstValueFrom(this.wfTaskService.get([
        { key: 'entity', value: this.config.NAMEOF_ENTITY_MEETING.toString() },
        { key: 'entityID', value: this.currentEntity.id.toString() },
        { key: 'statusflag', value: this.config.WFTASK_STATUS_FLAG_PENDING.toString() },
        { key: 'statusflag', value: this.config.WFTASK_STATUS_FLAG_STARTED.toString() },
        { key: 'statusflag', value: this.config.WFTASK_STATUS_FLAG_PAUSED.toString() },
        // { key: 'contactID', value: this.authService.currentUserStore?.contact?.id.toString() ?? '' },
      ]));

      this.task = tasks.length > 0 ? (tasks as WFTask[]).find(x => x.contactID == this.authService.currentUserStore?.contact?.id) : null;
      // console.log('this.task', this.task);
    }
  }

  private getSubjectOptions() {
    this.f['title'].reset();
    // this.entityOptions = [];
    // this.entityOptions = [];
    // this.entityService.getSubjects()
    //   .subscribe(
    //     data => {
    //       data.forEach(element => {
    //         if (!this.entityOptions.find(x => x.entityTitle === element)) {
    //           this.entityOptions.push({
    //             entityTitle: element
    //           });
    //         }
    //       });
    //     });
  }

  async onSubmit(task?: WFTask) {
    if (this.form.invalid) {
      this.touchForm();
      console.log(this.form);
      this.utilityService.showSweetDialog('Invalid Form',
        'Please fill all required fields with valid data and try again.', 'error'
      );
      return;
    }

    this.currentEntity.typeFlag = this.entityTypeFlag;
    this.currentEntity.location = this.f['location'].value
    this.currentEntity.startDate = this.utilityService.setTimeValue(this.f['startDate'].value, this.f['startTime'].value);
    this.currentEntity.endDate = this.utilityService.setTimeValue(this.f['endDate'].value, this.f['endTime'].value);
    this.currentEntity.gmaps = this.currentEntity.gmaps.filter(x => x.url && x.url.trim() !== '');
    this.currentEntity.documentsCarried = this.currentEntity.documentsCarried.filter(x => x.title && x.title.trim() !== '');

    if (this.currentEntity.endDate < this.currentEntity.startDate) {
      this.form.invalid;
      this.touchForm();
      this.utilityService.showSweetDialog('Invalid Form',
        'Invalid Data.', 'error'
      );
      return;
    }
    this.currentEntity = await firstValueFrom(this.entityService.update(this.currentEntity))
    this.getVersions();
    this.utilityService.showSwalToast(
      'Success!',
      'Save successful.',
    );
    this.f.comment.reset();
    this.update.emit(this.currentEntity);
    this.entityService.refreshList();
    this.activity.refresh();
    if (task) {
      console.log('Trigger Task complete');
      this.wfTaskService.completeTask(task);
    }
  }



  private async getAttendees() {
    if (this.currentEntity.attendees.length == 0) {
      let filter: ApiFilter[] = [
        { key: 'meetingID', value: this.currentEntity.id.toString() }
      ];
      this.attendeeService.get(filter).subscribe((res: MeetingAttendee[]) => {
        if (res) {
          this.currentEntity.attendees.push(...res);
          this.currentEntity.attendees.sort((a, b) => a.orderFlag - b.orderFlag);
        }
      });
    }
  }

  private async getAgendas() {
    if (this.currentEntity.agendas.length == 0) {
      let filter: ApiFilter[] = [
        { key: 'meetingID', value: this.currentEntity.id.toString() },
      ];
      this.agendaService.get(filter).subscribe((res) => {
        if (res) {
          this.currentEntity.agendas.push(...res);
          this.currentEntity.agendas.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime());
        }
      });
    }
  }

  displayFnProject(option?: any): string {
    return option ? option.code + "-" + option.title : '';
  }

  displayFnSubject(option?: any): string {
    return option ? option : '';
  }

  onProjectSelected(project: Project) {
    if (project) {
      this.selectedProject = project;
      this.f['location'].setValue(this.selectedProject.location);
    }
  }



  // Address //
  sortKey: string = 'Due Date';

  onNewAgenda(typeFlag: number = 0) {
    const dialogRef = this.entityService.openDialog(MeetingAgendaFormComponent, { autoUpdate: true, isCreateMode: true, meeting: this.currentEntity, blobConfig: this.blobConfig, typeFlag: typeFlag }, false);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        console.log('OnClose', res);
        res.typeFlag = typeFlag;
        this.currentEntity.agendas.push(res);
        this.currentEntity.agendas = this.meetingAgendaApiService.getSortAgendas(this.currentEntity.agendas, this.sortKey);
      }
    });
  }

  getFilteredAgendas(typeFlag: number): MeetingAgenda[] {
    return this.currentEntity.agendas.filter(x => x.typeFlag == typeFlag);
  }
  showNewAgenda: boolean = true;
  addAgenda() {
    this.showNewAgenda = true;
  }
  onAgendaChange(agenda: MeetingAgenda) {
    if (agenda) {
      let exist = this.currentEntity.agendas.find(x => x.title == agenda.title && x.subtitle == agenda.subtitle);
      if (!exist) {
        this.currentEntity.agendas.push(agenda);
      } else {
        exist = Object.assign({}, agenda);
      }
      this.currentEntity.agendas = this.meetingAgendaApiService.getSortAgendas(this.currentEntity.agendas, this.sortKey);
      this.showNewAgenda = this.currentEntity.agendas.length == 0;
    }
  }

  onDeleteAgenda(obj: MeetingAgenda) {
    this.currentEntity.agendas = this.currentEntity.agendas.filter(x => x !== obj);
    this.currentEntity.agendas = this.meetingAgendaApiService.getSortAgendas(this.currentEntity.agendas, this.sortKey);
  }
  // -------------------- //

  onPreviewLink(event: MouseEvent, uid: string) {
    event.stopPropagation();
    this.entityService.openHtmlView(uid);
  }


  versions: Meeting[] = [];
  private async getVersions() {
    this.versions = await firstValueFrom(this.entityService.get([{ key: 'isReadOnly', value: 'true' }, { key: 'parentid', value: this.currentEntity.id.toString() }]));
    this.versions.sort((a, b) => (new Date(b.created)).getTime() - (new Date(a.created)).getTime());
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

  //Attachments
  getFilteredAttachments(attachments: MeetingAttachment[], typeFlag: number) {
    return attachments.filter(x => x.typeFlag == typeFlag);
  }

  uploadQueue: UploadResult[] = [];
  onUpload(uploads: UploadResult[], typeFlag: number) {
    if (!this.isCreateMode) {
      uploads.forEach(x => {
        this.uploadQueue.push(x);
      });
      // console.log(this.uploadQueue);
      this.uploadFiles(typeFlag);
    } else {
      //Creating a dummy object
      uploads.forEach(x => {
        let obj = new MeetingAttachment();
        obj.filename = x.filename;
        obj.size = x.size;
        obj.contentType = x.contentType;
        obj.guidname = x.blobPath;
        obj.blobPath = x.blobPath;
        obj.meetingID = this.currentEntity.id;
        obj.container = this.blobConfig.container;
        obj.typeFlag = typeFlag;
        obj.url = x.url;
        this.currentEntity.attachments.push(obj);
        this.uploadQueue.push(x);
      });
      // console.log(this.currentEntity.attachments,this.uploadQueue);
    }
  }

  private async uploadFiles(typeFlag: number) {
    let _createRequests: Observable<any>[] = [];
    this.uploadQueue.forEach(x => {
      let obj = new MeetingAttachment();
      obj.filename = x.filename;
      obj.size = x.size;
      obj.contentType = x.contentType;
      obj.guidname = x.blobPath;
      obj.blobPath = x.blobPath;
      obj.meetingID = this.currentEntity.id;
      obj.container = this.blobConfig.container;
      obj.typeFlag = typeFlag;
      obj.url = x.url;
      obj.originalUrl = x.url;
      _createRequests.push(this.meetingAttachmentService.create(obj));
    });
    this.uploadQueue = [];

    const results = await firstValueFrom(forkJoin(_createRequests))
    this.currentEntity.attachments.push(...results);

    if (this.isCreateMode) {
      this.create.emit(this.currentEntity);
    }
  }

  async onDeleteAttachment(item: MeetingAttachment) {
    await firstValueFrom(this.meetingAttachmentService.delete(item.id));
    this.delete.emit(item);
    this.currentEntity.attachments = this.currentEntity.attachments.filter(x => x.id !== item.id);
  }

  // Gmaps
  gmaps(): FormArray {
    return this.form.get('gmaps') as FormArray;
  }

  onAddGmap() {
    this.addGmap(new MeetingGmap({ title: '', url: '' }));
  }

  addGmap(value: MeetingGmap) {
    const gmapGroup = this.formBuilder.group({
      title: new FormControl<any>(value.title),
      url: new FormControl<any>(value.url),
    });

    // Add conditional validation for URL based on title
    gmapGroup.get('title')?.valueChanges.subscribe(titleValue => {
      const urlControl = gmapGroup.get('url');
      if (titleValue && titleValue.trim()) {
        urlControl?.setValidators([Validators.required]);
      } else {
        urlControl?.clearValidators();
      }
      urlControl?.updateValueAndValidity();
    });

    this.gmaps().push(gmapGroup);
  }

  onRemoveGmap(index: number) {
    if (!this.currentEntity.gmaps || index < 0 || index >= this.currentEntity.gmaps.length) {
      return;
    }

    this.gmaps().removeAt(index);
    this.currentEntity.gmaps.splice(index, 1);

    console.log('Updated Gmaps:', this.currentEntity.gmaps);
  }

  onOpenUrl(url: string) {
    if (url && url.startsWith('http')) {
      window.open(url, '_blank');
    }
  }

  // Documents Carried
  documentsCarried(): FormArray {
    return this.form.get('documentsCarried') as FormArray;
  }

  onAddDocumentsCarried() {
    // console.log('this.documentsCarried()', this.documentsCarried());
    this.addDocumentCarried(new MeetingDocumentsCarried({ title: '' }));
  }

  addDocumentCarried(value: MeetingDocumentsCarried) {
    this.documentsCarried().push(this.formBuilder.group({
      title: new FormControl<any>(value.title),
    }));
  }

  onRemoveDocumentCarried(index: number) {
    this.documentsCarried().removeAt(index);
  }

  // Expenses
  // expenses(): FormArray {
  //   return this.form.get('expenses') as FormArray;
  // }

  // onAddExpense() {
  //   this.addExpense({ title: '', amount: null });
  // }

  // addExpense(value: { title: string, amount: number | null }) {
  //   this.expenses().push(this.formBuilder.group({
  //     title: new FormControl<any>(value.title),
  //     amount: new FormControl<any>(value.amount),
  //   }));
  // }

  // onRemoveExpense(index: number) {
  //   this.expenses().removeAt(index);
  // }



  //External Attendee
  async onCreate(event: any) {
    event.meetingID = this.currentEntity.id;
    const _external = await firstValueFrom(this.attendeeService.create(event));
    if (_external) {
      this.currentEntity.attendees.push(_external);
    }
  }

  async onDeleteExternalAttendee(item: MeetingAttendee) {
    await firstValueFrom(this.attendeeService.delete(item.id));
    this.currentEntity.attendees = this.currentEntity.attendees.filter(x => {
      return x.uid !== item.uid;
    });
  }

  async onToggleRecipient(item: MeetingAttendee) {
    item.isRecipient = !item.isRecipient;
    const update = this.currentEntity.attendees.find(x => x.id == item.id);
    if (update) {
      await firstValueFrom(this.attendeeService.update(update));
    }
  }

  //Contact Person
  async onCreateContactPerson() {
    if (!this.contactPersonForm.get('name')?.value) {
      return;
    }

    const selectedContact = this.contactPersonForm.get('name')?.value;
    let _attendee = new MeetingAttendee();
    _attendee.meetingID = this.currentEntity.id;
    _attendee.typeFlag = this.MEETING_ATTENDEE_CONTACT_PERSON;
    _attendee.name = selectedContact.name;
    _attendee.phone = selectedContact.phone || this.contactPersonForm.get('phone')?.value;
    _attendee.email = selectedContact.email || this.contactPersonForm.get('email')?.value;
    this.contactPersonForm.reset();
    const _contactAtt = await firstValueFrom(this.attendeeService.create(_attendee));
    if (_contactAtt) {
      this.currentEntity.attendees.push(_contactAtt);
    }
  }

  onContactPersonSelected(contact: EmailContact) {
    if (contact) {
      this.contactPersonForm.get('email')?.setValue(contact.email);
    }
  }

  onDeleteContactPerson(item: MeetingAttendee) {
    this.currentEntity.attendees = this.currentEntity.attendees.filter(x => x.uid !== item.uid);
  }

  onUpdateVoucher(event: any) {

  }

  onDeleteVoucher(event: MeetingVoucher) {
    this.currentEntity.vouchers = this.currentEntity.vouchers.filter(x => x.id !== event.id);
  }

  openPhotoDialog(member: any ) {
            this.dialog.open(ContactPhotoNameDialogComponent, {
              data: member
            });
          }
}

