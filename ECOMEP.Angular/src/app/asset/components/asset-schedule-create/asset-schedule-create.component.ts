import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormsModule, AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { McvFileUploadComponent } from 'src/app/mcv-file/components/mcv-file-upload/mcv-file-upload.component';
import { McvFileComponent } from 'src/app/mcv-file/components/mcv-file/mcv-file.component';
import { Observable, debounceTime, distinctUntilChanged, forkJoin } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { Contact } from 'src/app/contact/models/contact';
import { BlobUploadInfo } from 'src/app/mcv-file/models/mcv-blob-upload-info.model';
import { McvFileUploadConfig } from 'src/app/mcv-file/models/mcv-file-upload-config.model';
import { ApiFilter } from 'src/app/shared/models/api-filters';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Asset, AssetSchedule, AssetScheduleAttachment } from '../../models/asset';
import { AssetApiService } from '../../services/asset-api.service';
import { AssetScheduleApiService } from '../../services/asset-schedule-api.service';
import { AssetScheduleAttachmentApiService } from '../../services/asset-schedule-attachment-api.service';

@Component({
  selector: 'app-asset-schedule-create',
  standalone: true,
  imports: [
      CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatDatepickerModule,

    //Components
    McvFileUploadComponent,
    McvFileComponent
  ],
  templateUrl: './asset-schedule-create.component.html',
  styleUrls: ['./asset-schedule-create.component.scss']
})
export class AssetScheduleCreateComponent {

  asset!: Asset;
  form!: FormGroup;
  selectedContact!: Contact;
  schedulesReview: AssetSchedule[] = [];
  filters: ApiFilter[] = [];
  categoryOptions: any[] = [];
  blobConfig!: McvFileUploadConfig;
  filteredContacts$!: Observable<Contact[]>;
  schedule: AssetSchedule = new AssetSchedule();

  get f(): any { return this.form.controls }
  get isMobileView() { return this.utilityService.isMobileView }

  readonly ISSUE_TYPEFLAG = this.config.ASSET_SCHEDULE_ISSUE_TYPEFLAG;
  readonly nameOfEntity = this.config.NAME_OF_ENTITY_ASSET_SCHEDULE;

  constructor(
    private dialog: MatDialog,
    private config: AppConfig,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: any,
    private utilityService: UtilityService,
    private assetApiService: AssetApiService,
    private assetScheduleService: AssetScheduleApiService,
    private assetScheduleAttachmentService: AssetScheduleAttachmentApiService,
    private appSettingService: AppSettingMasterApiService,
    private dialogRef: MatDialogRef<AssetScheduleCreateComponent>,
  ) {
    if (data) {
      this.asset = data.asset;
      if (!this.form) {
        this.buildForm();
      }
    }
  }

  async ngOnInit() {
    if (!this.form) {
      this.buildForm();
    }

    this.form.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(val => {
      if (val.startDate && val.services > 0 && val.month > 0) {
        console.log(val.startDate);
        this.createScheduleReview();
      }
    });

    const _options = this.appSettingService.presets
      .find(x => x.presetKey == this.config.PRESET_ASSET_CATEGORY_OPTIONS)?.presetValue;
    if (_options) {
      this.categoryOptions = _options.split(',');
      this.filters.push({ key: 'category', value: this.categoryOptions[0] })
    }

    await this.appSettingService.loadPresets();
    const _setting = this.appSettingService.presets
      .find(x => x.presetKey == this.config.PRESET_BLOB_CONTAINER_ATTACHMENTS);

    if (_setting)
      this.blobConfig = new McvFileUploadConfig(
        _setting.presetValue,
        `${this.nameOfEntity}`
      );
  }

  buildForm() {
    this.form = this.formBuilder.group({
      startDate: new FormControl<any>(null, { validators: [Validators.required] }),
      services: new FormControl<any>(null, { validators: [Validators.required] }),
      month: new FormControl<any>(null, { validators: [Validators.required] }),
    });

    this.f['month'].setValue(1, { emitEvent: false });
    this.f['services'].setValue(1, { emitEvent: false });

    const _date = new Date();
    this.f['startDate'].setValue(_date, { emitEvent: false });
    this.createScheduleReview();
  }

  createScheduleReview() {
    this.schedulesReview = [];
    const _startDate = new Date(this.f['startDate'].value);
    const _services = Number(this.f['services'].value);
    const monthIncrement = this.f['month'].value;

    for (let i = 0; i < _services; i++) {
      const _schedule = new AssetSchedule();
      _schedule.typeFlag = this.config.ASSET_SCHEDULE_MAINTENANCE_TYPEFLAG;
      _schedule.assetID = this.asset.id;

      const nextScheduleDate = new Date(_startDate);
      nextScheduleDate.setMonth(nextScheduleDate.getMonth() + i * monthIncrement);

      _schedule.nextScheduleDate = nextScheduleDate;
      // console.log(_schedule.nextScheduleDate);

      _schedule.title = `${this.asset.code}-${this.asset.title}-${this.asset.subtitle}`;
      _schedule.category = this.asset.category;
      this.schedulesReview.push(_schedule);
    }
  }


  getErrorMessage(control: AbstractControl) {
    return this.utilityService.getErrorMessage(control);
  }

  displayFnContact(option?: Contact): string {
    return option ? option.name : '';
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

  onClose() {
    this.dialogRef.close();
  }

  uploadQueue: BlobUploadInfo[] = [];
  onUpload(uploads: BlobUploadInfo[]) {
    //Creating a dummy object
    uploads.forEach(x => {
      let obj = new AssetScheduleAttachment();
      obj.filename = x.file.name;
      obj.size = x.file.size;
      obj.contentType = x.file.type;
      obj.guidname = x.blobPath;
      obj.blobPath = x.blobPath;
      obj.assetScheduleID = this.schedule.id;
      obj.container = this.blobConfig.container;
      obj.typeFlag = x.typeFlag;
      obj.url = x.url;
      this.schedule.attachments.push(obj);
      this.uploadQueue.push(x);
    });
  }

  async uploadFiles() {
    let _createRequests: any[] = [];
    this.uploadQueue.forEach(x => {
      let obj = new AssetScheduleAttachment();
      obj.filename = x.file.name;
      obj.size = x.file.size;
      obj.contentType = x.file.type;
      obj.guidname = x.blobPath;
      obj.blobPath = x.blobPath;
      obj.assetScheduleID = this.schedule.id;
      obj.container = this.blobConfig.container;
      obj.typeFlag = x.typeFlag;
      obj.url = x.url;
      obj.originalUrl = x.url;
      _createRequests.push(this.assetScheduleAttachmentService.create(obj));
    });
    this.uploadQueue = [];

    // this.currentEntity.attachments = await firstValueFrom(forkJoin(_createRequests));
    forkJoin(_createRequests).subscribe(results => {
      results.forEach(x => {
        this.schedule.attachments.push(x as AssetScheduleAttachment);
      })
    });
  }

  onDeleteAttachment(item: AssetScheduleAttachment) {
    this.schedule.attachments = this.schedule.attachments.filter(x => x.url !== item.url);
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.utilityService.showSweetDialog('Invalid Form',
        'Please fill all required fields with valid data and try again.', 'error'
      );
      this.touchForm();
      return;
    }

    this.utilityService.showConfirmationDialog(`Do you want to create schedules as shown in preview?`, () => {
      let _createRequests: Observable<any>[] = [];
      this.schedulesReview.forEach(async (x) => {
        _createRequests.push(this.assetScheduleService.create(x));
      });

      forkJoin(_createRequests).subscribe((results) => {
        this.dialogRef.close(results);
      });
    });
  }

  getMonthCount(startDate: Date, endDate: Date) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const yearDifference = end.getFullYear() - start.getFullYear();
    const monthDifference = end.getMonth() - start.getMonth();
    const totalMonths = (yearDifference * 12) + monthDifference + 1; //+1 to inlcude start month
    return totalMonths;
  }
}
