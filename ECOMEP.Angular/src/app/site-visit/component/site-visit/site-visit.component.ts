import { DatePipe, NgIf, NgFor, AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, NgZone, OnInit, Output, ViewChild, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CdkDragDrop, transferArrayItem, CdkDropList, CdkDragPlaceholder, CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';

import { ContactApiService } from 'src/app/contact/services/contact-api.service';
import { Observable, debounceTime, distinctUntilChanged, firstValueFrom, map, startWith, take } from 'rxjs';

import { SiteVisit } from '../../models/site-visit.model';
import { EmailContact } from 'src/app/shared/models/email-contact';

import { ApiFilter } from 'src/app/shared/models/api-filters';
import { McvFileUploadConfig } from 'src/app/mcv-file/models/mcv-file-upload-config.model';
import { WFTask } from 'src/app/wf-task/models/wf-task.model';
import { AppConfig } from 'src/app/app.config';
import { AuthService } from 'src/app/auth/services/auth.service';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { WFTaskApiService } from 'src/app/wf-task/services/wf-task-api.service';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { McvActivityListComponent } from 'src/app/mcv-activity/components/mcv-activity-list/mcv-activity-list.component';
import { McvTimeEntryTimeLineComponent } from 'src/app/mcv-time-entry/components/mcv-time-entry-time-line/mcv-time-entry-time-line.component';
import { McvComponentConfig } from 'src/app/shared/models/mcv-component-config';
import { TimeEntryDto } from 'src/app/shared/models/time-entry-dto';

import { MatTabsModule } from '@angular/material/tabs';
import { McvActivityListComponent as McvActivityListComponent_1 } from '../../../mcv-activity/components/mcv-activity-list/mcv-activity-list.component';
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
import { SiteVisitAgendaApiService } from '../../services/site-visit-agenda-api.service';
import { SiteVisitAttendeeApiService } from '../../services/site-visit-attendee-api.service';
import { SitevisitAgendaComponent } from '../site-visit-agenda/site-visit-agenda.component';
import { SitevisitMinutesComponent } from '../site-visit-minutes/site-visit-minutes.component';
import { SiteVisitAttendee } from '../../models/site-visit-attendee.model';
import { SitevisitAgendaFormComponent } from '../site-visit-agenda-form/site-visit-agenda-form.component';
import { SitevisitAgenda } from '../../models/site-visit-agenda.model';
import { SiteVisitApiService } from '../../services/site-visit-api.service';


@Component({
  selector: 'app-site-visit',
  templateUrl: './site-visit.component.html',
  styleUrls: ['./site-visit.component.scss'],
  standalone: true,
  imports: [NgIf, MatTooltipModule, WftaskTitleBarComponent, MatExpansionModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, NgxMaterialTimepickerModule, MatAutocompleteModule, NgFor, MatOptionModule, MatIconModule, MatButtonModule, CdkDropList, CdkDragPlaceholder, CdkDrag, CdkDragHandle, McvTimeEntryListComponent, WfTaskActionComponent, McvActivityListComponent_1, MatTabsModule, SitevisitAgendaComponent, SitevisitMinutesComponent, AsyncPipe, DecimalPipe, DatePipe]
})
export class SiteVisitComponent implements OnInit {

  currentEntity: SiteVisit = new SiteVisit();
  nameOfEntity = this.config.NAMEOF_ENTITY_SITE_VISIT;
  entityID!: number;
  task: WFTask | any;
  isCreateMode: boolean = false;
  isTaskMode: boolean = false;
  entityTypeFlag: number = 0;
  configData: any;
  isDuplicated: boolean = false;
  blobConfig!: McvFileUploadConfig;

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

  private readonly sitevistAgendaApiService = inject(SiteVisitAgendaApiService);
  private readonly sitevisitAttendeeApiService = inject(SiteVisitAttendeeApiService);

  taskform!: FormGroup;
  attendeeform!: FormGroup;
  // agendaform!: FormGroup;
  minDate: Date = new Date();

  statusOptions: any[] = [];
  emailContactOptions: EmailContact[] = [];

  selectedAgendaType: any = { text: "Custom", value: 0 };


  isShowDateMismatchError: boolean = false;
  sitevisitEditDuration = 3;
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
  get af(): any { return this.attendeeform.controls; }

  get minutesGap(): number { return this.config.SITE_VISIT_MINUTES_GAP; }
  get minTime() { return this.config.SITE_VISIT_MIN_TIME; }
  get maxTime() { return this.config.SITE_VISIT_MAX_TIME; }

  get SITE_VISIT_TYPEFLAG_SITE_VISIT() { return this.config.SITE_VISIT_TYPEFLAG_SITE_VISIT; }
  get SITE_VISIT_TYPEFLAG_INSPECTION() { return this.config.SITE_VISIT_TYPEFLAG_INSPECTION; }
  get SITE_VISIT_TYPEFLAG_CNOTE() { return this.config.SITE_VISIT_TYPEFLAG_CNOTE; }

  get SITE_VISIT_STATUSFLAG_SCHEDULED() { return this.config.SITE_VISIT_STATUSFLAG_SCHEDULED; }
  get SITE_VISIT_STATUSFLAG_ATTENDED() { return this.config.SITE_VISIT_STATUSFLAG_ATTENDED; }
  get SITE_VISIT_STATUSFLAG_SENT() { return this.config.SITE_VISIT_STATUSFLAG_SENT; }

  get SITE_VISIT_ATTENDEE_TYPEFLAG_TO() { return this.sitevisitAttendeeApiService.SITE_VISIT_ATTENDEE_TYPEFLAG_TO; }
  get SITE_VISIT_ATTENDEE_TYPEFLAG_CC() { return this.sitevisitAttendeeApiService.SITE_VISIT_ATTENDEE_TYPEFLAG_CC; }

  get isPermissionSpecialEdit() { return this.entityService.isPermissionSpecialEdit; }
  get isPermissionSpecialDelete() { return this.entityService.isPermissionSpecialDelete; }

  get attendeeTo() { return this.currentEntity && this.currentEntity.attendees ? this.currentEntity.attendees.filter(x => x.typeFlag == this.SITE_VISIT_ATTENDEE_TYPEFLAG_TO) : []; }
  get attendeeCC() { return this.currentEntity && this.currentEntity.attendees ? this.currentEntity.attendees.filter(x => x.typeFlag == this.SITE_VISIT_ATTENDEE_TYPEFLAG_CC) : []; }

  get toList() {
    return this.currentEntity.attendees
      .filter(x => x.typeFlag == this.SITE_VISIT_ATTENDEE_TYPEFLAG_TO);
  }
  get ccList() {
    return this.currentEntity.attendees
      .filter(x => x.typeFlag == this.SITE_VISIT_ATTENDEE_TYPEFLAG_CC);
  }

  get isAllowedToUpdate() {
    return (this.isPermissionSpecialEdit || this.currentEntity?.isEditable)
      && (this.isPermissionSpecialEdit || this.currentEntity.statusFlag < this.SITE_VISIT_STATUSFLAG_SENT);
  }
  get isAllowedToSendUpdate() {
    return this.currentEntity.statusFlag == this.SITE_VISIT_STATUSFLAG_SENT 
    && (this.isPermissionSpecialEdit || this.currentEntity?.isEditable);
  }
  get isAllowedToDelete() {
    return (this.isPermissionSpecialDelete
      || this.currentEntity?.statusFlag != this.SITE_VISIT_STATUSFLAG_SENT);
  }

  TASK_STAGE_SITE_VISIT_TRAVEL_TIME = this.config.TASK_STAGE_SITE_VISIT_TRAVEL_TIME;
  TASK_STAGE_SITE_VISIT_CLOSE = this.config.TASK_STAGE_SITE_VISIT_CLOSE;

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
    private entityService: SiteVisitApiService,
    private contactService: ContactApiService,
    private agendaService: SiteVisitAgendaApiService,
    private attendeeService: SiteVisitAttendeeApiService,
    private wfTaskService: WFTaskApiService,
    private appSettingService: AppSettingMasterApiService,
    private utilityService: UtilityService,
    private formBuilder: FormBuilder,
    private ngZone: NgZone,
    private config: AppConfig,
    private authService: AuthService,
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
        `${this.config.NAMEOF_ENTITY_SITE_VISIT_AGENDA}`
      );
    }

     this.sitevisitEditDuration = Number(this.appSettingService.presets
      .find(x => x.presetKey == this.config.PRESET_SITE_VISIT_UPDATE_ALLOW_DURATION));
    
  }

  refresh() {
    this.currentEntity = new SiteVisit();
      this.buildForm();
    // this.voucherListConfig = null;


    this.getAttendeeOptions();
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
      title: new FormControl<any>('', { nonNullable: true, validators: [Validators.required] }),
      startDate: new FormControl<any>('', { nonNullable: true, validators: [Validators.required] }),
      endDate: new FormControl<any>('', { nonNullable: true, validators: [Validators.required] }),
      startTime: new FormControl<any>('', { nonNullable: true, validators: [Validators.required] }),
      endTime: new FormControl<any>('', { nonNullable: true, validators: [Validators.required] }),
      location: new FormControl<any>('', { nonNullable: true, validators: [Validators.required] }),
      comment: new FormControl<any>('')
    });


    this.attendeeform = this.formBuilder.group({
      name: new FormControl<any>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
      email: new FormControl<any>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
      company: new FormControl<any>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    });

    this.attendeeform.controls['email'].disable();
    this.attendeeform.controls['company'].disable();

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

    this.filteredAttendeeOptions$ = this.af['name'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      startWith<string | any>(""),
      map(value => value ? (typeof value === "string" ? value : (value as EmailContact).fullName) : null),
      map(name => name ? this._filterAttendee(name as string) : this.emailContactOptions.slice()),
    );

    this.filteredContacts$ = this.assigneeFC.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),

      map(value => value ? (typeof value === 'string' ? value : (value as EmailContact).name) : null),
      map(name => name ? this.filterContacts(name as string) : this.emailContactOptions.slice()),

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

  // displayFnAttendee(option?: EmailContact): string
  // {
  //   return option ? option.name + " | " + option.email + " | " + option.company : '';
  // }

  displayFnActionBy(option?: any): string {
    return option ? option.name + " | " + option.company : '';
  }

  private validateDates(): boolean {

    if (this.f['startDate'].value && this.f['endDate'].value) {
      if (this.f['startTime'].value && this.f['endTime'].value) {
        let startDate = this.utilityService.setTimeValue(this.f['startDate'].value, this.f['startTime'].value);
        let endDate = this.utilityService.setTimeValue(this.f['endDate'].value, this.f['endTime'].value);
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

      this.currentEntity.startDate = this.utilityService.setTimeValue(this.f['startDate'].value, this.f['startTime'].value);
      this.currentEntity.endDate = this.utilityService.setTimeValue(this.f['endDate'].value, this.f['endTime'].value);
    }
    return false;
  }


  bindForm() {
    if (this.currentEntity) {
      this.f['title'].setValue(this.currentEntity.title);
      this.f['startDate'].setValue(this.currentEntity.startDate);
      this.f['startTime'].setValue(this.utilityService.getTimeValue(this.currentEntity.startDate, this.minutesGap));
      this.f['endDate'].setValue(this.currentEntity.endDate);
      this.f['endTime'].setValue(this.utilityService.getTimeValue(this.currentEntity.endDate, this.minutesGap));
      this.f['location'].setValue(this.currentEntity.location);

      if (!this.currentEntity.isEditable) {
        this.form.disable();
        this.attendeeform.disable();
        // this.agendaform.disable();
        this.assigneeFC.disable();

      }
    }
  }


  onClickSaveAndSend() {
    let _messageText = `Send minutes: ${this.currentEntity.code}`;
    if (this.currentEntity.statusFlag === this.SITE_VISIT_STATUSFLAG_SENT) {
      _messageText = `Resend minutes: ${this.currentEntity.code}`;
    }
    this.utilityService.showConfirmationDialog(_messageText,
      async () => {
        this.currentEntity.location = this.f['location'].value
        this.currentEntity.startDate = this.utilityService.setTimeValue(this.f['startDate'].value, this.f['startTime'].value);
        this.currentEntity.endDate = this.utilityService.setTimeValue(this.f['endDate'].value, this.f['endTime'].value);

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

  private getStatusOptions() {
    this.statusOptions = [
      { value: 0, title: 'PENDING', class: 'primary' },
      { value: 1, title: 'RESOLVED', class: 'dark' },
      { value: -1, title: 'REJECTED', class: 'danger' },
    ];
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

  private getAttendeeOptions() {
    this.contactService.getEmailOptions().subscribe((data) => { this.emailContactOptions = data; });
  }

  onSelectContact(typeFlag: number = 0) {

    if (!this.assigneeFC.value || !this.assigneeFC.value.id) {
      this.utilityService.showSwalToast('Invalid Contact!', 'Please select a person and try again!', 'error');
      return;
    }

    let _assignee = new SiteVisitAttendee();
    _assignee.sitevisitID = this.currentEntity.id,
      _assignee.contactID = this.assigneeFC.value.id;
    _assignee.typeFlag = typeFlag;
    _assignee.name = (this.assigneeFC.value as EmailContact).name;
    _assignee.email = (this.assigneeFC.value as EmailContact).email;
    _assignee.company = (this.assigneeFC.value as EmailContact).company;

    this.assigneeFC.reset();

    this.createAttendee(_assignee);
  }

  onDeleteAssignee(assignee: SiteVisitAttendee) {
    if (assignee) {

      this.currentEntity.attendees = this.currentEntity.attendees.filter(x => x.contactID !== assignee.contactID);

    }
  }


  async onDeleteAttendee(item: SiteVisitAttendee) {
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
    if (!this.task) {
      const tasks = await firstValueFrom(this.wfTaskService.get([
        { key: 'entity', value: this.config.NAMEOF_ENTITY_SITE_VISIT.toString() },
        { key: 'entityID', value: this.currentEntity.id.toString() },
        { key: 'statusflag', value: this.config.WFTASK_STATUS_FLAG_PENDING.toString() },
        { key: 'statusflag', value: this.config.WFTASK_STATUS_FLAG_STARTED.toString() },
        { key: 'statusflag', value: this.config.WFTASK_STATUS_FLAG_PAUSED.toString() },
        // { key: 'contactID', value: this.authService.currentUserStore?.contact?.id.toString() ?? '' },
      ]));

      this.task = tasks.length > 0 ? (tasks as WFTask[]).find(x => x.contactID == this.authService.currentUserStore?.contact?.id) : null;
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
        { key: 'sitevisitID', value: this.currentEntity.id.toString() }
      ];
      this.attendeeService.get(filter).subscribe((res: SiteVisitAttendee[]) => {
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
        { key: 'sitevisitID', value: this.currentEntity.id.toString() },
      ];
      this.agendaService.get(filter).subscribe((res) => {
        if (res) {
          this.currentEntity.agendas.push(...res);
          this.currentEntity.agendas.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime());
        }
      });
    }
  }



  // Address //
  sortKey: string = 'Due Date';

  onNewAgenda() {
    const dialogRef = this.entityService.openDialog(SitevisitAgendaFormComponent, { autoUpdate: true, isCreateMode: true, sitevisit: this.currentEntity, blobConfig: this.blobConfig }, false);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        console.log('OnClose', res);
        this.currentEntity.agendas.push(res);
        this.currentEntity.agendas = this.sitevistAgendaApiService.getSortAgendas(this.currentEntity.agendas, this.sortKey);
      }
    });

  }
  showNewAgenda: boolean = true;
  addAgenda() {
    this.showNewAgenda = true;
  }
  onAgendaChange(agenda: SitevisitAgenda) {
    if (agenda) {
      let exist = this.currentEntity.agendas.find(x => x.title == agenda.title && x.subtitle == agenda.subtitle);
      if (!exist) {
        this.currentEntity.agendas.push(agenda);
      } else {
        exist = Object.assign({}, agenda);
      }
      this.currentEntity.agendas = this.sitevistAgendaApiService.getSortAgendas(this.currentEntity.agendas, this.sortKey);
      this.showNewAgenda = this.currentEntity.agendas.length == 0;
    }
  }

  onDeleteAgenda(obj: SitevisitAgenda) {
    this.currentEntity.agendas = this.currentEntity.agendas.filter(x => x !== obj);
    this.currentEntity.agendas = this.sitevistAgendaApiService.getSortAgendas(this.currentEntity.agendas, this.sortKey);
  }
  // -------------------- //

  onPreviewLink(uid: string) {
    this.entityService.openHtmlView(uid);
  }


  versions: SiteVisit[] = [];
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
}

