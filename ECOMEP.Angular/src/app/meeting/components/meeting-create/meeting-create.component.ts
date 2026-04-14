import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDragPlaceholder, CdkDropList, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { DatePipe, NgTemplateOutlet, NgIf, NgFor, AsyncPipe, CommonModule } from '@angular/common';
import { Component, Inject, NgZone, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, FormControl, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { take, Observable, debounceTime, distinctUntilChanged, switchMap, of, map, firstValueFrom, forkJoin } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Project } from 'src/app/project/models/project.model';
import { ProjectApiService } from 'src/app/project/services/project-api.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Meeting, MeetingDocumentsCarried, MeetingGmap } from '../../models/meeting.model';
import { MeetingApiService } from '../../services/meeting-api.service';
import { MeetingAgendaApiService } from '../../services/meeting-agenda-api.service';
import { MeetingAgendaAttachmentApiService } from '../../services/meeting-agenda-attachment-api.service';
import { WFTaskApiService } from 'src/app/wf-task/services/wf-task-api.service';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MeetingAgendaComponent } from '../meeting-agenda/meeting-agenda.component';
import { McvFileUploadConfig } from 'src/app/mcv-file/models/mcv-file-upload-config.model';
import { StatusMasterService } from 'src/app/shared/services/status-master.service';
import { McvFileUploadComponent, UploadResult } from 'src/app/mcv-file/components/mcv-file-upload/mcv-file-upload.component';
import { McvFileComponent } from 'src/app/mcv-file/components/mcv-file/mcv-file.component';
import { MeetingAttachment } from '../../models/meeting-attachments.model';
import { MeetingAttachmentApiService } from '../../services/meeting-attachment-api.service';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { MeetingAgendaCreateDialogComponent } from '../meeting-agenda-create-dialog/meeting-agenda-create-dialog.component';
import { MeetingAgendaFormComponent } from '../meeting-agenda-form/meeting-agenda-form.component';
import { MeetingAgenda, MeetingAgendaAttachment } from '../../models/meeting-agenda.model';
import { EmailContact } from 'src/app/shared/models/email-contact';
import { MeetingAttendee } from '../../models/meeting-attendee.model';
import { MeetingAttendeeApiService } from '../../services/meeting-attendee-api.service';
import { ContactApiService } from 'src/app/contact/services/contact-api.service';
import { MeetingExternalAttendeesComponent } from '../meeting-external-attendees/meeting-external-attendees.component';
import { ApiFilter } from 'src/app/shared/models/api-filters';
import { Contact } from 'src/app/contact/models/contact';

@Component({
  selector: 'app-meeting-create',
  templateUrl: './meeting-create.component.html',
  styleUrls: ['./meeting-create.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatButtonModule,
    NgTemplateOutlet,
    MatIconModule,
    MatDialogModule,
    NgIf,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    NgxMaterialTimepickerModule,
    MatAutocompleteModule,
    NgFor,
    MatOptionModule,
    AsyncPipe,
    MatSelectModule,
    MatOptionModule,
    MatTabsModule,
    MatCheckboxModule,
    CdkDropList,
    CdkDragPlaceholder,
    CdkDrag,
    CdkDragHandle,

    //Components
    MeetingAgendaComponent,
    McvFileUploadComponent,
    McvFileComponent,
    MeetingAgendaCreateDialogComponent,
    MeetingExternalAttendeesComponent
  ]
})
export class MeetingCreateComponent implements OnInit {
  //--------FORM RELATED----------------//
  private readonly config = inject(AppConfig);
  private readonly dialog = inject(MatDialog);
  private readonly datePipe = inject(DatePipe);
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly contactService = inject(ContactApiService);
  private readonly attendeeService = inject(MeetingAttendeeApiService);
  private readonly utilityService = inject(UtilityService);
  private readonly entityService = inject(MeetingApiService);
  private readonly meetingAgendaApiService = inject(MeetingAgendaApiService);
  private readonly meetingAgendaAttachmentService = inject(MeetingAgendaAttachmentApiService);
  private readonly wfTaskService = inject(WFTaskApiService);
  private readonly projectApiService = inject(ProjectApiService);
  private readonly statusMasterService = inject(StatusMasterService);
  private readonly appSettingService = inject(AppSettingMasterApiService);
  private readonly attachmentService = inject(MeetingAttachmentApiService);

  form!: FormGroup;
  statusOptions: any[] = [];
  blobConfig!: McvFileUploadConfig;
  meetingPurposeOptions: string[] = [
    'Meeting',
    'Site Visit',
    'Slab Checking'
  ];

  get f(): any { return this.form.controls; }
  get cpf(): any { return this.contactPersonForm?.controls; }
  get isMobileView(): boolean { return this.utilityService.isMobileView; }
  contactFilter: ApiFilter[] = [
    { key: "IsAppointed", value: "true" },
    { key: "AppointmentStatusFlag", value: "0" }
  ];
  private readonly ngZone = inject(NgZone);
  @ViewChild('autosize') protected autosize!: CdkTextareaAutosize;
  private triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this.ngZone.onStable.pipe(take(1)).subscribe(() => { if (this.autosize) { this.autosize.resizeToFitContent(true) } });
  }
  private touchForm() {
    //touch form inputs to show validation messages
    if (this.form) {
      Object.keys(this.form.controls).forEach(field => {
        // {1}
        const control = this.form.get(field); // {2}
        if (control)
          control.markAsTouched({ onlySelf: true }); // {3}
      });
    }
  }

  getErrorMessage(control?: AbstractControl) {
    return this.utilityService.getErrorMessage(control);
  }
  //-----------------------------------//

  emailContactOptions: EmailContact[] = [];
  contactOptions: Contact[] = [];
  filteredContacts$!: Observable<Contact[]>;
  filteredContactsForContactPerson$!: Observable<EmailContact[]>;
  currentEntity: Meeting = new Meeting();
  alertMessage: string = "";
  isShowAlert: boolean = false;
  selectedProject!: Project;
  filteredProjects$!: Observable<Project[]>;
  filteredSubjectOptions$!: Observable<any>;
  subjectOptions: string[] = [];
  isShowDateMismatchError: boolean = false;
  subjectTypeOptions: string[] = [this.config.NAMEOF_ENTITY_PROJECT];

  assigneeFC = new FormControl();
  contactPersonForm!: FormGroup;
  attendees: MeetingAttendee[] = [];
  agendas: MeetingAgenda[] = [];

  get minutesGap(): number { return this.config.MEETING_MINUTES_GAP; }
  get minTime() { return this.config.MEETING_MIN_TIME; }
  get maxTime() { return this.config.MEETING_MAX_TIME; }

  get dialogTitle() { return `New ${this.nameOfEntity}`; }
  get nameOfEntity() { return this.entityService.nameOfEntity; }
  get isPermissionCreateEvent() { return this.entityService.isPermissionCreateEvent; }
  // get isPermissionSpecialEdit() { return this.entityService.isPermissionSpecialEdit; }
  // get isPermissionSpecialDelete() { return this.entityService.isPermissionSpecialDelete; }


  get internalAttendeeList() {
    return this.currentEntity.attendees
      .filter(x => x.typeFlag == this.config.MEETING_ATTENDEE_INTERNAL)
      .sort((a, b) => (a.orderFlag || 0) - (b.orderFlag || 0));
  }

  get externalAttendeeList() {
    return this.currentEntity.attendees
      .filter(x => x.typeFlag == this.config.MEETING_ATTENDEE_EXTERNAL);
  }

  get contactPersonList() {
    return this.currentEntity.attendees
      .filter(x => x.typeFlag == this.config.MEETING_ATTENDEE_CONTACT_PERSON);
  }

  public readonly MEETING_ATTENDEE_INTERNAL = this.config.MEETING_ATTENDEE_INTERNAL;
  public readonly MEETING_ATTENDEE_EXTERNAL = this.config.MEETING_ATTENDEE_EXTERNAL;
  public readonly MEETING_ATTENDEE_CONTACT_PERSON = this.config.MEETING_ATTENDEE_CONTACT_PERSON;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<MeetingCreateComponent>,
  ) { }

  async ngOnInit() {
    if (!this.appSettingService.presets || !this.appSettingService.presets.length) {
      await this.appSettingService.loadPresets();
    }

    if (this.appSettingService.presets) {
      const _presetValue = this.appSettingService.presets.find(x => x.presetKey == this.config.PRESET_BLOB_CONTAINER_ATTACHMENTS);
      if (_presetValue)
        this.blobConfig = new McvFileUploadConfig(
          _presetValue.presetValue,
          `${this.config.NAMEOF_ENTITY_MEETING}`
        );
    }
    this.getAttendeeOptions();

    if (!this.form) {
      this.buildForm();
    }
    this.onAddGmap();
    // this.onAddDocumentsCarried();
    if (this.isPermissionCreateEvent) {
      this.subjectTypeOptions.push("Event")
    }

    this.refresh();
    await this.getStatusOptions();
  }

  onClose(e: any) {
    this.dialogRef.close();
  }

  refresh() {
    if (!this.form) {
      this.buildForm();
    } else {
      // this.resetForm();
    }

    if (this.subjectOptions.length == 0) {
      this.getSubjectOptions();
    }
  }

  private async getStatusOptions() {
    this.statusOptions = await firstValueFrom(this.statusMasterService.get([{ key: 'Entity', value: this.nameOfEntity }]));
    const pendingStatus = this.statusOptions.find(
      x => x.title.toLowerCase() === 'pending'
    );

    if (pendingStatus) {
      this.f['statusFlag'].setValue(pendingStatus.value);
    }
  }

  buildForm() {
    this.form = this.formBuilder.group({
      title: new FormControl<any>(null, { validators: [Validators.required] }),
      subjectType: new FormControl<any>(this.subjectTypeOptions[0], { validators: [Validators.required] }),
      project: new FormControl<any>(null),
      startDate: new FormControl<any>(new Date(), { validators: [Validators.required] }),
      startTime: new FormControl<any>(new Date(), { validators: [Validators.required] }),
      endDate: new FormControl<any>(null, { validators: [Validators.required] }),
      endTime: new FormControl<any>(null, { validators: [Validators.required] }),
      location: new FormControl<any>(null, { validators: [Validators.required] }),
      purpose: new FormControl<any>(null, { validators: [Validators.required] }),
      statusFlag: new FormControl<any>(0, { validators: [Validators.required] }),
      remark: new FormControl<any>(null),

      gmaps: this.formBuilder.array([]),
      // documentsCarried: this.formBuilder.array([]),
    });

    this.contactPersonForm = this.formBuilder.group({
      name: new FormControl<any>(null, { validators: [Validators.required] }),
      phone: new FormControl<any>(null),
      email: new FormControl<any>(null),
    });

    this.f['subjectType'].setValue(this.subjectTypeOptions[0]);
    this.onSubjectTypeChanged();
    this.f['startDate'].setValue(new Date());

    this.f['startTime'].setValue(this.utilityService.getTimeValue(new Date(), this.minutesGap));
    let _end = new Date()
    _end.setHours(_end.getHours() + 1);
    this.f['endDate'].setValue(_end);
    this.f['endTime'].setValue(this.utilityService.getTimeValue(_end, this.minutesGap));

    this.f['subjectType'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
    ).subscribe((value: any) => {
      if (value) {
        this.onSubjectTypeChanged();
      }
    });

    this.f['startDate'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
    ).subscribe((value: any) => {
      if (value) {
        this.f['endDate'].setValue(this.f['startDate'].value);
        // this.validateDates();
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

    this.filteredContacts$ = this.assigneeFC.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      map(value => value ? (typeof value === 'string' ? value : value.name) : null),
      map(name => name ? this.filterContacts(name as string) : this.contactOptions.slice()),
    );

    this.filteredContactsForContactPerson$ = this.contactPersonForm.get('name')!.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      map(value => value ? (typeof value === 'string' ? value : (value as EmailContact).name) : null),
      map(name => name ? this.filterEmailContacts(name as string) : this.emailContactOptions.slice()),
    );

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

    // Sync attendees with currentEntity immediately
    this.attendees = this.currentEntity.attendees;
    this.agendas = this.currentEntity.agendas;

    this.touchForm();
  }

  private getProjectOptions(search: string): Observable<string[]> {
    return this.projectApiService.getPages(0, 20, [
    ], search).pipe(map(data => data ? data.list.map((x: Project) => x) : []));
  }

  private _filterSubject(property: string): any[] {
    return this.subjectOptions.filter(option => option ? option.toLowerCase().includes(property.toLowerCase()) : false);
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

  private async getSubjectOptions() {
    this.subjectOptions = await firstValueFrom(this.entityService.getFieldOptions('title'));
  }


  onSubjectTypeChanged() {

    if (this.f['subjectType'].value == 'Event') {
      this.f['title'].reset();
      this.f['project'].reset();
      this.f['title'].setValidators([Validators.required, Validators.minLength(3)]);
      this.f['project'].setValidators();
    } {
      this.f['title'].reset();
      this.f['project'].reset();
      this.f['title'].setValidators();
      this.f['project'].setValidators([Validators.required, Validators.minLength(3)]);
    }
  }

  private validateDates(): boolean {
    if (this.f['startDate'].value && this.f['endDate'].value
      && this.f['startTime'].value && this.f['endTime'].value) {
      let startDate = this.utilityService.setTimeValue(this.f['startDate'].value, this.f['startTime'].value);
      let endDate = this.utilityService.setTimeValue(this.f['endDate'].value, this.f['endTime'].value);
      if (startDate > endDate) {
        let _end = new Date(startDate);
        _end.setHours(_end.getHours() + 1);
        this.f['endDate'].setValue(_end);
        this.f['endTime'].setValue(this.utilityService.getTimeValue(_end, this.minutesGap));
        return true;
      }
    }

    if (this.f['endDate'] && this.f['startDate']) {
      const start = (new Date(this.f['startDate'].value)).getDate();
      const end = (new Date(this.f['endDate'].value)).getDate();

      this.isShowAlert = false;
      if (end > start) {

        this.alertMessage = `It seems that the chosen duration ${this.datePipe.transform(this.f['startDate'].value, 'dd MMM yyyy')} - ${this.datePipe.transform(this.f['endDate'].value, 'dd-MMM-yyyy')} exceeds 24 hours. Kindly double-check and make any required adjustments.`;
        this.isShowAlert = true;
        // this.utilityService.showSweetDialog('Duplicate Name', this.firstNameHint, 'warning');

      }
    }
    return false;
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.touchForm();
      console.log(this.form);
      this.utilityService.showSweetDialog('Invalid Form',
        'Please fill all required fields with valid data and try again.', 'error'
      );
      return;
    }

    if (this.internalAttendeeList.length === 0) {
      this.utilityService.showSweetDialog('Missing Internal Attendee',
        'Please add at least one internal attendee before submitting.', 'error'
      );
      return;
    }
    this.currentEntity = Object.assign(this.currentEntity, this.form.getRawValue());
    this.currentEntity.projectID = this.selectedProject ? this.selectedProject.id : undefined;
    this.currentEntity.typeFlag = this.config.MEETING_TYPEFLAG_MEETING;
    const startTime = this.f['startTime'].value;
    const endTime = this.f['endTime'].value;
    this.currentEntity.startDate = this.utilityService.setTimeValue(this.f['startDate'].value, startTime || new Date());
    this.currentEntity.endDate = this.utilityService.setTimeValue(this.f['endDate'].value, endTime || new Date());
    this.currentEntity.contactID = this.authService.currentUserStore ? this.authService.currentUserStore.contact.id : 0;
    if (this.f['subjectType'].value == 'Project' && !this.selectedProject) {
      {
        this.utilityService.showSwalToast('Incomplete Data',
          'Please select project from the list.', 'error'
        );
        return
      }
    }

    this.currentEntity.title = this.f['subjectType'].value == 'Event' ?
      this.f['title'].value
      : `${this.selectedProject.code}-${this.selectedProject.title}`;

    this.currentEntity.gmaps = this.currentEntity.gmaps.filter(x => x.url && x.url.trim() !== '');

    const _messageText = `Create New ${this.nameOfEntity}: ${this.currentEntity.title} | ${this.datePipe.transform(this.currentEntity.startDate, 'dd MMM yyyy HH:mm')} - ${this.datePipe.transform(this.currentEntity.endDate, 'dd MMM yyyy HH:mm')}`;
    this.utilityService.showConfirmationDialog(_messageText,
      async () => {

        const _response = await firstValueFrom(this.entityService.create(this.currentEntity));
        await this.uploadFiles(_response);
        await this.saveAttendees(_response);
        await this.saveAgendas(_response);
        this.entityService.refreshList();
        this.wfTaskService.refreshList();
        this.utilityService.showSwalToast(
          'Success!',
          'Save successful.',
        );
        this.dialogRef.close(this.currentEntity);
      });
  }


  //Attachments
  getFilteredAttachments(attachments: MeetingAttachment[], typeFlag: number) {
    return attachments.filter(x => x.typeFlag == typeFlag);
  }

  uploadQueue: UploadResult[] = [];
  onUpload(uploads: UploadResult[], typeFlag: number) {
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
    console.log(this.currentEntity.attachments, this.uploadQueue);

  }

  private async uploadFiles(meeting: Meeting) {
    let _createRequests: any[] = [];
    this.uploadQueue.forEach(x => {
      let obj = new MeetingAttachment();
      obj.filename = x.filename;
      obj.size = x.size;
      obj.contentType = x.contentType;
      obj.guidname = x.blobPath;
      obj.blobPath = x.blobPath;
      obj.meetingID = meeting.id;
      obj.container = this.blobConfig.container;
      obj.typeFlag = 0;
      obj.url = x.url;
      obj.originalUrl = x.url;
      _createRequests.push(this.attachmentService.create(obj));
    });
    this.uploadQueue = [];

    forkJoin(_createRequests).subscribe((results: any) => {
      results.forEach((x: any) => {
        this.currentEntity.attachments.push(x as MeetingAttachment);
      })
      this.entityService.refreshList();
    });
  }

  onDeleteAttachment(item: any, index: number) {
    this.currentEntity.attachments = this.currentEntity.attachments.filter(x => x.uid !== item.uid);
    this.uploadQueue.splice(index, 1);
  }



  // Gmaps
  gmaps(): FormArray {
    return this.form.get('gmaps') as FormArray;
  }

  onAddGmap() {
    console.log('this.gmaps()', this.gmaps());
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
    this.gmaps().removeAt(index);
  }

  onOpenUrl(url: string) {
    if (url && url.startsWith('http')) {
      window.open(url, '_blank');
    }
  }

  // Documents Carried
  // documentsCarried(): FormArray {
  //   return this.form.get('documentsCarried') as FormArray;
  // }

  // onAddDocumentsCarried() {
  //   console.log('this.documentsCarried()', this.documentsCarried());
  //   this.addDocumentCarried(new MeetingDocumentsCarried({ title: '' }));
  // }

  // addDocumentCarried(value: MeetingDocumentsCarried) {
  //   this.documentsCarried().push(this.formBuilder.group({
  //     title: new FormControl<any>(value.title, { validators: [Validators.required] }),
  //   }));
  // }

  // onRemoveDocumentCarried(index: number) {
  //   this.documentsCarried().removeAt(index);
  // }

  //Contact Person
  onContactPersonSelected(contact: EmailContact) {
    if (contact) {
      console.log('Selected contact:', contact);

      this.contactPersonForm.get('email')?.setValue(contact.email);
    }
  }

  onCreateContactPerson() {
    const nameValue = this.contactPersonForm.get('name')?.value;
    if (!nameValue) {
      return;
    }

    let _attendee = new MeetingAttendee();
    _attendee.meetingID = this.currentEntity.id;
    _attendee.typeFlag = this.MEETING_ATTENDEE_CONTACT_PERSON;

    if (typeof nameValue === 'object' && nameValue.id) {
      // Selected from autocomplete
      _attendee.contactID = nameValue.id;
      _attendee.name = nameValue.name;
      _attendee.email = nameValue.email;
      _attendee.company = nameValue.company;
    } else {
      // Custom name entered
      _attendee.name = nameValue;
      _attendee.email = this.contactPersonForm.get('email')?.value;
    }

    _attendee.phone = this.contactPersonForm.get('phone')?.value;

    this.contactPersonForm.reset();
    this.currentEntity.attendees.push(_attendee);
    this.attendees = this.currentEntity.attendees;
  }

  onDeleteContactPerson(item: MeetingAttendee) {
    this.currentEntity.attendees = this.currentEntity.attendees.filter(x => {
      return x.uid !== item.uid;
    });
    this.attendees = this.currentEntity.attendees;
  }

  //Agenda
  onNewAgenda(typeFlag: number) {
    const dialogRef = this.entityService.openDialog(MeetingAgendaFormComponent, { autoUpdate: false, isCreateMode: true, meeting: this.currentEntity, blobConfig: this.blobConfig, typeFlag: typeFlag }, false);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        console.log('OnClose', res);
        res.typeFlag = typeFlag;
        this.currentEntity.agendas.push(res);
        this.agendas = this.currentEntity.agendas;
      }
    });
  }

  getFilteredAgendas(agendas: MeetingAgenda[], typeFlag: number) {
    if (!agendas) return [];
    return agendas.filter(x => (x.typeFlag || 0) === typeFlag);
  }

  onAgendaChange(agenda: MeetingAgenda) {
    if (agenda) {
      let exist = this.currentEntity.agendas.find(x => x.title == agenda.title && x.subtitle == agenda.subtitle);
      if (!exist) {
        this.currentEntity.agendas.push(agenda);
      } else {
        exist = Object.assign({}, agenda);
      }
      this.agendas = this.currentEntity.agendas;
      // this.currentEntity.agendas = this.meetingAgendaApiService.getSortAgendas(this.currentEntity.agendas, this.sortKey);
      // this.showNewAgenda = this.currentEntity.agendas.length == 0;
    }
  }

  onDeleteAgenda(obj: MeetingAgenda) {
    this.currentEntity.agendas = this.currentEntity.agendas.filter(x => x !== obj);
    this.agendas = this.currentEntity.agendas;
    // this.currentEntity.agendas = this.meetingAgendaApiService.getSortAgendas(this.currentEntity.agendas, this.sortKey);
  }

  private async saveAgendas(meeting: Meeting) {
    for (const agenda of this.agendas) {
      agenda.meetingID = meeting.id;
      const savedAgenda = await firstValueFrom(this.meetingAgendaApiService.create(agenda));

      // Save attachments for this agenda
      if (agenda.attachments && agenda.attachments.length > 0) {
        let _attachmentRequests: any[] = [];
        agenda.attachments.forEach((attachment: any) => {
          attachment.meetingAgendaID = savedAgenda.id;
          _attachmentRequests.push(this.meetingAgendaAttachmentService.create(attachment));
        });

        if (_attachmentRequests.length > 0) {
          await firstValueFrom(forkJoin(_attachmentRequests));
        }
      }
    }

    this.entityService.refreshList();
  }

  private async saveAttendees(meeting: Meeting) {
    console.log('this.attendees', this.attendees);
    if (!this.attendees || this.attendees.length === 0) {
      return;
    }

    let _createRequests: any[] = [];

    // Save all attendees from tempAttendees (internal, external, and contact persons)
    this.attendees.forEach(attendee => {
      attendee.meetingID = meeting.id;
      _createRequests.push(this.attendeeService.create(attendee));
    });

    if (_createRequests.length > 0) {
      const savedAttendees = await firstValueFrom(forkJoin(_createRequests));
      this.currentEntity.attendees = savedAttendees;
    }
  }

  //Internal Attendee
  displayFnContact(option?: any): string {
    return option ? (`${option.name} | ${option.email || option.company}`) : '';
  }

  displayFnContactName(option?: EmailContact): string {
    return option ? option.name : '';
  }

  private filterContacts(property: string): any[] {
    return this.contactOptions.filter(option => {
      return option ?
        (option.name.toLowerCase().includes(property.toLowerCase())
        )
        : false;
    });
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

  async onDeleteAttendee(item: MeetingAttendee) {
    this.currentEntity.attendees = this.currentEntity.attendees.filter(x => {
      return x.uid !== item.uid;
    });
    this.attendees = this.currentEntity.attendees;
  }

  async getAttendeeOptions() {
    this.emailContactOptions = await firstValueFrom(this.contactService.getEmailOptions());
    this.contactOptions = await firstValueFrom(this.contactService.get(this.contactFilter));
  }

  onSelectContact(typeFlag: number = 0) {

    if (!this.assigneeFC.value || !this.assigneeFC.value.id) {
      this.utilityService.showSwalToast('Invalid Contact!', 'Please select a person and try again!', 'error');
      return;
    }

    let _assignee = new MeetingAttendee();
    _assignee.meetingID = this.currentEntity.id;
    _assignee.contactID = this.assigneeFC.value.id;
    _assignee.typeFlag = typeFlag;
    _assignee.name = this.assigneeFC.value.name;
    _assignee.email = this.assigneeFC.value.email;
    _assignee.company = this.assigneeFC.value.company;

    // Set orderFlag based on current internal attendees count
    const internalAttendees = this.currentEntity.attendees.filter(a => a.typeFlag === this.MEETING_ATTENDEE_INTERNAL);
    _assignee.orderFlag = internalAttendees.length;

    this.assigneeFC.reset();
    this.currentEntity.attendees.push(_assignee);
    this.attendees = this.currentEntity.attendees;

    // this.createAttendee(_assignee);
  }

  onDropAttendee(event: CdkDragDrop<MeetingAttendee[]>) {
    const internalAttendees = this.currentEntity.attendees.filter(a => a.typeFlag === this.MEETING_ATTENDEE_INTERNAL);
    const movedAttendee = internalAttendees[event.previousIndex];

    // Remove from old position
    internalAttendees.splice(event.previousIndex, 1);
    // Insert at new position
    internalAttendees.splice(event.currentIndex, 0, movedAttendee);

    // Update orderFlag for all internal attendees
    internalAttendees.forEach((attendee, index) => {
      attendee.orderFlag = index;
    });

    // Update the main attendees array
    this.attendees = this.currentEntity.attendees;
  }


  //External Attendee
  onCreate(event: any) {
    this.currentEntity.attendees.push(event);
    this.attendees = this.currentEntity.attendees;
  }

  async onDeleteExternalAttendee(item: MeetingAttendee) {
    this.currentEntity.attendees = this.currentEntity.attendees.filter(x => {
      return x.uid !== item.uid;
    });
    this.attendees = this.currentEntity.attendees;
  }

  onToggleRecipient(item: MeetingAttendee) {
    item.isRecipient = !item.isRecipient;
  }

  onUpdate(event: any) { }
  onDelete(event: any) { }
}

