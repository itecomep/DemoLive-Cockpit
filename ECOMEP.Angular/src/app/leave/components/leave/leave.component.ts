import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { McvComponentConfig } from 'src/app/shared/models/mcv-component-config';
import { Leave, LeaveAttachment } from '../../models/leave.model';
import { debounceTime, distinctUntilChanged, firstValueFrom, forkJoin, map, Observable, startWith } from 'rxjs';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LeaveApiService } from '../../services/leave-api.service';
import { McvActivityListComponent } from 'src/app/mcv-activity/components/mcv-activity-list/mcv-activity-list.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AppConfig } from 'src/app/app.config';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Router } from '@angular/router';
import { WfTaskActionComponent } from 'src/app/wf-task/components/wf-task-action/wf-task-action.component';
import { WFTask } from 'src/app/wf-task/models/wf-task.model';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { DateFilterFn, MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { Contact } from 'src/app/contact/models/contact';
import { WftaskTitleBarComponent } from 'src/app/wf-task/components/wftask-title-bar/wftask-title-bar.component';
import { LeaveSummary } from '../../models/leave-summary.model';
import { LeaveSummaryComponent } from '../leave-summary/leave-summary.component';
import { LeaveCalendarComponent } from '../leave-calendar/leave-calendar.component';
import { McvFileUploadComponent, UploadResult } from "src/app/mcv-file/components/mcv-file-upload/mcv-file-upload.component";
import { McvFileComponent } from "src/app/mcv-file/components/mcv-file/mcv-file.component";
import { LeaveAttachmentApiService } from '../../services/leave-attachment-api.service';
import { McvFileUploadConfig } from 'src/app/mcv-file/models/mcv-file-upload-config.model';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';

@Component({
  selector: 'app-leave',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatExpansionModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatSelectModule,
    MatDatepickerModule,
    NgxMaterialTimepickerModule,
    //Components
    McvActivityListComponent,
    WfTaskActionComponent,
    FooterComponent,
    WftaskTitleBarComponent,
    LeaveSummaryComponent,
    LeaveCalendarComponent,
    McvFileUploadComponent,
    McvFileComponent
],
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.scss']
})
export class LeaveComponent {

  router = inject(Router);
  config = inject(AppConfig);
  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  utilityService = inject(UtilityService);
  entityService = inject(LeaveApiService);
  attachmentService = inject(LeaveAttachmentApiService);
  appSettingService = inject(AppSettingMasterApiService);

  task?: WFTask;
  form!: FormGroup;
  entityID!: number;
  isCreateMode: boolean = false;
  isTaskMode: boolean = false;
  configData: any;
  entityTypeFlag: number = 0;
  currentEntity: Leave = new Leave();
  typeOptions: any;
  filteredContacts$!: Observable<any[]>;
  contactOptions: Contact[] = [];

  minutesGap = 15;
  minDate: Date = new Date();
  maxDate: Date = new Date();
  minTime: string = '09:00';
  maxTime: string = '17:30';

  yearlySummary: LeaveSummary[] = [];
  totalSummary!: LeaveSummary;

  summaryConfig: any;
  index: number = 0;
  blobConfig!: McvFileUploadConfig;
  allowEdit: boolean = false;

  get f(): any { return this.form.controls; }
  get nameOfEntity() { return this.entityService.nameOfEntity; }
  get isMobileView(): boolean { return this.utilityService.isMobileView; }

  get isPermissionEdit() { return this.entityService.isPermissionEdit }
  get isPermissionDelete() { return this.entityService.isPermissionDelete }
  get isPermissionSpecialEdit() { return this.entityService.isPermissionSpecialEdit }

  readonly LEAVE_TYPEFLAG_CASUAL = this.config.LEAVE_TYPEFLAG_CASUAL;
  readonly LEAVE_TYPEFLAG_EMERGENCY = this.config.LEAVE_TYPEFLAG_EMERGENCY;
  readonly LEAVE_STATUSFLAG_PENDING = this.config.LEAVE_STATUSFLAG_PENDING;
  readonly LEAVE_STATUSFLAG_APPROVED = this.config.LEAVE_STATUSFLAG_APPROVED;
  readonly LEAVE_STATUSFLAG_REJECTED = this.config.LEAVE_STATUSFLAG_REJECTED;

  @Input('config') set configValue(value: McvComponentConfig) {
    if (value) {
      this.configData = value;
      this.entityID = value.entityID;
      this.task = value.task;
      this.isCreateMode = value.isCreateMode;
      this.isTaskMode = value.isTaskMode;
      this.entityTypeFlag = value.entityTypeFlag;
      this.currentEntity = value.currentEntity;
      this.refresh();
    }
  }

  @Output() create = new EventEmitter<any>();
  @Output() update = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() taskComplete = new EventEmitter<WFTask>();
  @Output() submit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();

  async ngOnInit() {
    if (!this.form) {
      this.buildForm();
    }
    this.allowEdit = true;
    if (!this.appSettingService.presets || !this.appSettingService.presets.length) {
      await this.appSettingService.loadPresets();
    }
    const preset = this.appSettingService.presets.find(x => x.presetKey == this.config.PRESET_BLOB_CONTAINER_ATTACHMENTS);
    if (preset) {
      this.blobConfig = new McvFileUploadConfig(preset.presetValue, `${this.nameOfEntity}`);
    }
  }

  refresh() {
    if (!this.form) this.buildForm();
    if (!this.currentEntity) this.currentEntity = new Leave();
    this.getCurrent(this.entityID);
  }

  dateFilter: DateFilterFn<Date | null> = (d: Date | null): boolean => {
    if (!d) {
      return true;
    }
    if (d?.getDay() === 0) {
      return false;
    }
    return true;
  };

  protected async getCurrent(id: number) {
    this.currentEntity = await firstValueFrom(this.entityService.getById(id));
    // this.checkPermissions();
    this.summaryConfig = { contactID: this.currentEntity.contactID };
    if (this.currentEntity.statusFlag == this.LEAVE_STATUSFLAG_APPROVED && !this.isPermissionSpecialEdit) {
      this.form.disable();
      this.allowEdit = false;
    } else {
      this.form.enable();
      this.allowEdit = true;
    }
    this.bindForm(this.currentEntity);
  }

  currentUser(contactID: number) {
    return this.authService.isCurrentUser(contactID)
  }

  touchForm() {
    //touch form inputs to show validation messages
    if (this.form) {
      Object.keys(this.form.controls).forEach(field => {
        const control = this.form.get(field);
        if (control) {
          control.markAsTouched({ onlySelf: true });
        }
      });
    }
  }

  getErrorMessage(control: AbstractControl) {
    return this.utilityService.getErrorMessage(control);
  }

  displayFnContact(option?: Contact): string {
    return option ? option.name : '';
  }

  buildForm() {
    this.form = this.formBuilder.group({
      typeFlag: new FormControl(null, { validators: [Validators.required] }),
      contact: new FormControl(null, { validators: [Validators.required] }),
      start: new FormControl(null, { validators: [Validators.required] }),
      end: new FormControl(null, { validators: [Validators.required] }),
      startTime: new FormControl(this.config.TIMELINE_START_TIME),
      endTime: new FormControl(this.config.TIMELINE_END_TIME),
      reason: new FormControl(null, { validators: [Validators.required] }),
    });

    this.filteredContacts$ = this.f['contact'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      startWith<string | any>(''),
      map((value) =>
        value
          ? typeof value === 'string'
            ? value
            : (value as Contact).name
          : null
      ),
      map((name) =>
        name ? this.filterContacts(name as string) : this.contactOptions.slice()
      )
    );


  }

  bindForm(leave: Leave) {
    this.form.patchValue(this.currentEntity);
    this.f['startTime'].setValue(
      this.utilityService.getTimeValue(this.currentEntity.start, this.minutesGap),
      { emitEvent: false }
    );
    this.f['endTime'].setValue(
      this.utilityService.getTimeValue(this.currentEntity.end, this.minutesGap),
      { emitEvent: false }
    );
  }

  private filterContacts(property: string): any[] {
    return this.contactOptions.filter((option) =>
      option
        ? option.name.toLowerCase().includes(property.toLowerCase())
        : false
    );
  }

  onEdit() {

  }

  async onSubmit(task?: WFTask) {
    if (this.form.invalid) {
      this.touchForm();
      this.utilityService.showSweetDialog('Invalid Form',
        'Please fill all required fields with valid data and try again.', 'error'
      );
      return;
    }

    this.currentEntity.reason = this.f['reason'].value;
    this.currentEntity.start = this.utilityService.setTimeValue(
      this.f['start'].value,
      this.f['startTime'].value
    );
    this.currentEntity.end = this.utilityService.setTimeValue(
      this.f['end'].value,
      this.f['endTime'].value
    );
    this.utilityService.showConfirmationDialog('Do you want to update leave?', async () => {
      this.currentEntity = await firstValueFrom(this.entityService.update(this.currentEntity));
      if (this.uploadQueue.length > 0) {
        this.uploadFiles();
      }
      this.utilityService.showSwalToast('', 'Leave Updated Successfully!', 'success');
    });
  }

  onTaskCompleted(e: any) {
    // this.wfTaskService.activeTask = undefined;
    this.taskComplete.emit(e);
    this.cancel.emit(e);
  }

  onTaskUpdated(e: any) {
    this.task = Object.assign({}, e);
  }

  async onDelete() {
    const _messageText =
      'Delete Leave for: ' +
      this.utilityService.formatDate(
        this.currentEntity.start,
        this.config.DATE_FORMAT
      );

    this.utilityService.showConfirmationDialog(`${_messageText}`, async () => {
      await firstValueFrom(this.entityService.delete(this.currentEntity.id));
      this.utilityService.showSwalToast('Leave Deleted Successfully!', '', 'success');
      this.delete.emit(this.currentEntity);
      this.entityService.refreshList();
      this.router.navigate([this.config.ROUTE_LEAVE_LIST]);
    });
  }

  private async getSummary(contactID: number, index: number) {
    if (contactID) {
      this.yearlySummary = [];
      this.totalSummary = new LeaveSummary();
      this.yearlySummary = await firstValueFrom(this.entityService.getPerMonthSummary(contactID, index));
      this.totalSummary = await firstValueFrom(this.entityService.getTotalSummary(contactID, index));
      // console.log('this.yearlySummary',this.yearlySummary);
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
  onUpload(uploads: UploadResult[])
  {
    if (!this.isCreateMode)
    {
      uploads.forEach(x =>
      {
        this.uploadQueue.push(x);
      });
      this.uploadFiles();
    } else
    {
      //Creating a dummy object
      uploads.forEach(x =>
      {
        let obj = new LeaveAttachment();
        obj.filename = x.filename;
        obj.size = x.size;
        obj.contentType = x.contentType;
        obj.guidname = x.blobPath;
        obj.blobPath = x.blobPath;
        obj.leaveID = this.currentEntity.id;
        obj.container = this.blobConfig.container;
        obj.typeFlag = this.currentEntity.typeFlag;
        obj.url = x.url;
        this.currentEntity.attachments.push(obj);
        this.uploadQueue.push(x);
      });
    }
  }
  private async uploadFiles()
  {
    if (this.uploadQueue.length === 0) return;
    
    let _createRequests: Observable<any>[] = [];
    const processedUrls = new Set();
    
    this.uploadQueue.forEach(x =>
    {
      // Skip if already processed in this batch
      if (processedUrls.has(x.url)) return;
      
      // Skip if already exists in saved attachments
      const existsInSaved = this.currentEntity.attachments.some(att => att.id && att.url === x.url);
      if (existsInSaved) return;
      
      processedUrls.add(x.url);
      let obj = new LeaveAttachment();
      obj.filename = x.filename;
      obj.size = x.size;
      obj.contentType = x.contentType;
      obj.guidname = x.blobPath;
      obj.blobPath = x.blobPath;
      obj.leaveID = this.currentEntity.id;
      obj.container = this.blobConfig.container;
      obj.typeFlag = 0;
      obj.url = x.url;
      obj.originalUrl = x.url;
      _createRequests.push(this.attachmentService.create(obj));
    });
    
    this.uploadQueue = [];

    if (_createRequests.length > 0) {
      const results = await firstValueFrom(forkJoin(_createRequests));
      this.currentEntity.attachments.push(...results);
    }

    if (this.isCreateMode)
    {
      this.create.emit(this.currentEntity);
    }
  }
}
