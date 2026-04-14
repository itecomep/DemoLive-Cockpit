import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { AppConfig } from 'src/app/app.config';
import { Leave, LeaveAttachment } from '../../models/leave.model';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DateFilterFn, MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { Contact } from 'src/app/contact/models/contact';
import { debounceTime, distinctUntilChanged, firstValueFrom, forkJoin, map, Observable, startWith } from 'rxjs';
import { ContactApiService } from 'src/app/contact/services/contact-api.service';
import { ApiFilter } from 'src/app/shared/models/api-filters';
import { LeaveApiService } from '../../services/leave-api.service';
import { TypeMasterService } from 'src/app/shared/services/type-master.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { AppPermissions } from 'src/app/app.permissions';
import { TypeMaster } from 'src/app/shared/models/type-master-dto';
import { MaterialImportModule } from "src/app/material-import/material-import.module";
import { McvFileUploadComponent, UploadResult } from "src/app/mcv-file/components/mcv-file-upload/mcv-file-upload.component";
import { LeaveAttachmentApiService } from '../../services/leave-attachment-api.service';
import { McvFileComponent } from "src/app/mcv-file/components/mcv-file/mcv-file.component";
import { McvFileUploadConfig } from 'src/app/mcv-file/models/mcv-file-upload-config.model';

@Component({
  selector: 'app-leave-create',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    NgxMaterialTimepickerModule,
    MaterialImportModule,
    McvFileUploadComponent,
    McvFileComponent
],
  templateUrl: './leave-create.component.html',
  styleUrls: ['./leave-create.component.scss']
})
export class LeaveCreateComponent implements OnInit {

  config = inject(AppConfig);
  formBuilder = inject(FormBuilder);
  leaveService = inject(LeaveApiService);
  authService = inject(AuthService);
  permissions = inject(AppPermissions);
  utilityService = inject(UtilityService);
  contactService = inject(ContactApiService);
  typeMasterService = inject(TypeMasterService);
  dialogRef = inject(MatDialogRef<LeaveCreateComponent>);
  appSettingService = inject(AppSettingMasterApiService);
  attachmentService = inject(LeaveAttachmentApiService);

  form!: FormGroup;
  typeOptions: TypeMaster[] = [];
  contactOptions: Contact[] = [];
  contactFilter: ApiFilter[] = [
    { key: "IsAppointed", value: "true" },
    { key: "AppointmentStatusFlag", value: "0" }
  ];
  filteredContacts$!: Observable<any[]>;
  currentEntity: Leave = new Leave();
  typeOptionsByPermission: any[] = [];

  isValidationError: boolean = false;
  disableSave: boolean = false;
  validationErrorMessage!: string;
  leaveViolationError: string = '';
  nameOfEntity: string = this.config.NAMEOF_ENTITY_LEAVE;

  minutesGap = 15;
  minDate: Date = new Date();
  maxDate: Date = new Date();
  minTime: string = '09:00';
  maxTime: string = '17:30';

  @Output() create = new EventEmitter<any>();
  @Output() update = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  readonly LEAVE_TYPEFLAG_CASUAL = this.config.LEAVE_TYPEFLAG_CASUAL;
  readonly LEAVE_TYPEFLAG_SICK = this.config.LEAVE_TYPEFLAG_SICK;
  readonly LEAVE_TYPEFLAG_EMERGENCY = this.config.LEAVE_TYPEFLAG_EMERGENCY;
  readonly LEAVE_TYPEFLAG_CASUAL_FIRST_HALF = this.config.LEAVE_TYPEFLAG_CASUAL_FIRST_HALF;
  readonly LEAVE_TYPEFLAG_CASUAL_SECOND_HALF = this.config.LEAVE_TYPEFLAG_CASUAL_SECOND_HALF;
  readonly LEAVE_TYPEFLAG_EMERGENCY_FIRST_HALF = this.config.LEAVE_TYPEFLAG_EMERGENCY_FIRST_HALF;
  readonly LEAVE_TYPEFLAG_EMERGENCY_SECOND_HALF = this.config.LEAVE_TYPEFLAG_EMERGENCY_SECOND_HALF;
  
  readonly VIOLATION_MESSAGE = 'The same category of leave has already been availed this month.';
  blobConfig!: McvFileUploadConfig;

  get isPermissionSpecialEdit() { return this.leaveService.isPermissionSpecialEdit }
  get isMaster() { return this.authService.currentUserStore ? this.authService.currentUserStore.roles.includes('MASTER') : false }
  get isLeaveMaster(): boolean { return this.authService.isInAnyRole([this.permissions.LEAVE_MASTER]); }
  get currentUser() { return this.authService.currentUserStore }

  get f(): any { return this.form.controls; }
  get isMobileView(): boolean { return this.utilityService.isMobileView; }
  allowEdit: boolean = false;

  async ngOnInit() {
    this.getTypeOptions();
    this.getContactOptions();
    this.buildForm();
    this.allowEdit = true;
    if (!this.appSettingService.presets || !this.appSettingService.presets.length) {
      await this.appSettingService.loadPresets();
    }
    const preset = this.appSettingService.presets.find(x => x.presetKey == this.config.PRESET_BLOB_CONTAINER_ATTACHMENTS);
    if (preset) {
      this.blobConfig = new McvFileUploadConfig(preset.presetValue, `${this.nameOfEntity}`);
    }
  }

  dateFilter: DateFilterFn<Date | null> = (d: Date | null): boolean => {
    if (!d) return true;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time for accurate date comparison

    const isSunday = d.getDay() === 0;
    const isBackdated = d < today;

    if (isSunday) return false;

    if (isBackdated && !this.isMaster && !this.isLeaveMaster) {
      return false;
    }

    return true;
  };

  getErrorMessage(control: AbstractControl) {
    return this.utilityService.getErrorMessage(control);
  }

  displayFnContact(option?: Contact): string {
    return option ? option.name : '';
  }

  private getContactOptions() {
    this.contactService
      .get(this.contactFilter, '', 'fullName')
      .subscribe((data) => {
        this.contactOptions = data;
      });
  }

  private async getTypeOptions() {
    this.typeOptions = await firstValueFrom(this.typeMasterService.get([{ key: 'Entity', value: this.config.NAMEOF_ENTITY_LEAVE }]));
    this.typeOptions.sort((a, b) => a.value - b.value);
  }

  private filterContacts(property: string): any[] {
    return this.contactOptions.filter((option) =>
      option
        ? option.name.toLowerCase().includes(property.toLowerCase())
        : false
    );
  }

  buildForm() {
    this.form = this.formBuilder.group({
      typeFlag: new FormControl(this.LEAVE_TYPEFLAG_CASUAL, { validators: [Validators.required] }),
      contact: new FormControl(null, { validators: [Validators.required] }),
      start: new FormControl(null, { validators: [Validators.required] }),
      end: new FormControl(null, { validators: [Validators.required] }),
      startTime: new FormControl(this.config.TIMELINE_START_TIME),
      endTime: new FormControl(this.config.TIMELINE_END_TIME),
      reason: new FormControl('', { validators: [Validators.required] }),
    });

    // this.f['startTime'].valueChanges
    //   .pipe(debounceTime(400), distinctUntilChanged())
    //   .subscribe((value: any) => {
    //     if (value) {
    //       this.validateDates();
    //     }
    //   });

    // this.f['endTime'].valueChanges
    //   .pipe(debounceTime(400), distinctUntilChanged())
    //   .subscribe((value: any) => {
    //     if (value) {
    //       this.validateDates();
    //     }
    //   });

    this.f['start'].valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value: any) => {
        if (value) {
          this.f['end'].setValue(value);
          this.checkLeaveViolation();
        }
      });

    this.f['end'].valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value: any) => {
        if (value) {
          // this.validateDates();
        }
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

    this.f['typeFlag'].valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value: any) => {
        this.currentEntity.typeFlag = value;
        if (this.currentEntity.typeFlag == this.LEAVE_TYPEFLAG_CASUAL_FIRST_HALF ||
          this.currentEntity.typeFlag == this.LEAVE_TYPEFLAG_CASUAL_SECOND_HALF ||
          this.currentEntity.typeFlag == this.LEAVE_TYPEFLAG_EMERGENCY_FIRST_HALF ||
          this.currentEntity.typeFlag == this.LEAVE_TYPEFLAG_EMERGENCY_SECOND_HALF) {
          this.f['end'].setValue(this.f['start'].value);
        }
        this.checkLeaveViolation();
      });
  }

  async checkLeaveViolation() {
    if (!this.f['start'].value || this.f['typeFlag'].value == null) {
      this.leaveViolationError = '';
      return;
    }
    const contactId = this.isPermissionSpecialEdit ? this.f['contact'].value?.id : this.currentUser?.contact.id;
    
    if (!contactId) {
      this.leaveViolationError = '';
      return;
    }

    const startDate = new Date(this.f['start'].value);
    const typeFlag = this.f['typeFlag'].value;

      const leaves = await firstValueFrom(this.leaveService.get([
        { key: 'ContactID', value: contactId.toString() }
      ]));

      const earlierLeavesInMonth = leaves.filter((leave: Leave) => {
        const leaveDate = new Date(leave.start);
        return leaveDate.getMonth() === startDate.getMonth() && 
               leaveDate.getFullYear() === startDate.getFullYear() && 
               leave.typeFlag === typeFlag && 
               leaveDate < startDate &&
               (leave.statusFlag === this.config.LEAVE_STATUSFLAG_APPROVED || leave.statusFlag === this.config.LEAVE_STATUSFLAG_PENDING);
      }).length;

      // this.leaveViolationError = earlierLeavesInMonth > 0 ? this.VIOLATION_MESSAGE : '';
    
  }

  onClose() {
    this.dialogRef.close();
  }

  async onSubmit() {
    // Don't create new Leave object to preserve attachments
    this.currentEntity.typeFlag = this.f['typeFlag'].value;
    if (this.isPermissionSpecialEdit) {
      this.currentEntity.contact = this.f['contact'].value;
      this.currentEntity.contactID = (this.f['contact'].value as Contact).id;
    } else {
      const _currentUser = this.authService.currentUserStore;
      if (_currentUser) {
        this.currentEntity.contactID = _currentUser.contact.id;
        this.currentEntity.contact = _currentUser.contact;
      }
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
    // console.log(this.currentEntity);
    this.currentEntity.title = undefined;
    this.currentEntity.createdByContactID = this.currentUser?.contact.id;
    this.utilityService.showConfirmationDialog('Do you want to create leave?', async () => {
      this.currentEntity = await firstValueFrom(this.leaveService.create(this.currentEntity));
      if (this.uploadQueue.length > 0) {
        this.uploadFiles();
      }
      this.utilityService.showSwalToast('', 'Leave Created Successfully!', 'success');
      this.dialogRef.close();
    });
  }

  validationMessage: any;
  private validate() {
    // this.currentEntity.contactID = this.authService.currentUserStore && this.authService.currentUserStore.entity ? this.authService.currentUserStore.entity.id : null;
    this.currentEntity.start = this.utilityService.setTimeValue(
      this.f['start'].value,
      this.f['startTime'].value
    );
    this.currentEntity.end = this.utilityService.setTimeValue(
      this.f['start'].value,
      this.f['endTime'].value
    );
    this.currentEntity.typeFlag = this.f['typeFlag'].value;
    this.currentEntity.reason = this.f['reason'].value;
    if (this.isPermissionSpecialEdit) {
      this.currentEntity.contact = this.f['contact'].value;
      this.currentEntity.contactID = (this.f['contact'].value as Contact).id;
    } else {
      const _currentUser = this.authService.currentUserStore;
      if (_currentUser) {
        this.currentEntity.contactID = _currentUser.contact.id;
        this.currentEntity.contact = _currentUser.contact;
      }
    }
    this.leaveService.validate(this.currentEntity).subscribe((data) => {
      this.validationMessage = data;
    });
  }

  private validateDates() {
    this.isValidationError = false;
    this.validationErrorMessage = '';
    if (this.f['start'].value) {
      if (this.f['end'].value < this.f['start'].value) {
        let _end = new Date(this.f['start'].value);
        this.f['end'].setValue(_end, { emitEvent: false });
      }
      // console.log('Validating on dates change');
      this.validate();
    }
  }

  onDeleteAttachment(item: any) {
    // this.attachmentService.delete(item.id).subscribe(value => {
    //   this.delete.emit(item);
    // });
    this.currentEntity.attachments = this.currentEntity.attachments.filter(x => x.blobPath !== item.blobPath);
    this.uploadQueue =  this.uploadQueue.filter(x => x.blobPath !== item.blobPath);
  }

  onDownloadAttachment(item: any) {
    window.open(item.url);
  }

  uploadQueue: UploadResult[] = [];
    onUpload(uploads: UploadResult[]) {
  
      //Creating a dummy object
      uploads.forEach(x => {
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
    private uploadFiles() {
        let _createRequests: any[] = [];
        this.uploadQueue.forEach(x => {
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
    
        forkJoin(_createRequests).subscribe((results: any) => {
          results.forEach((x: any) => {
            this.currentEntity.attachments.push(x as LeaveAttachment);
          })
           {
            this.create.emit(this.currentEntity);
          }
        });
      }
}
