import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlobUploadInfo } from 'src/app/mcv-file/models/mcv-blob-upload-info.model';
import { MeetingVoucherAttachment } from '../../models/meeting-voucher-attachments.model';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MeetingVoucher } from '../../models/meeting-voucher.model';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { MeetingVoucherApiService } from '../../services/meeting-voucher-api.service';
import { MeetingVoucherAttachmentApiService } from '../../services/meeting-voucher-attachment-api.service';
import { AppConfig } from 'src/app/app.config';
import { McvFileUploadConfig } from 'src/app/mcv-file/models/mcv-file-upload-config.model';
import { firstValueFrom, forkJoin, Observable } from 'rxjs';
import { McvFileUploadComponent, UploadResult } from 'src/app/mcv-file/components/mcv-file-upload/mcv-file-upload.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { McvFileComponent } from 'src/app/mcv-file/components/mcv-file/mcv-file.component';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  selector: 'app-meeting-voucher',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,

    //Components
    McvFileComponent,
    McvFileUploadComponent
  ],
  templateUrl: './meeting-voucher.component.html',
  styleUrls: ['./meeting-voucher.component.scss']
})
export class MeetingVoucherComponent implements OnInit {

  private readonly config = inject(AppConfig);
  private readonly formBuilder = inject(FormBuilder);
  private readonly utilityService = inject(UtilityService);
  private readonly appSettingService = inject(AppSettingMasterApiService);
  private readonly meetingVoucherService = inject(MeetingVoucherApiService);
  private readonly attachmentService = inject(MeetingVoucherAttachmentApiService);

  currentEntity!: MeetingVoucher;

  @Input() isCreateMode: boolean = false;
  @Input() meetingID!: number;

  @Input('item') set configValue(value: MeetingVoucher) {
    this.currentEntity = value;

    if (!this.form) {
      this.buildForm();
    }
    if (!this.isCreateMode && this.currentEntity) {
      this.bindForm(this.currentEntity);

    }
  }

  @Output() update = new EventEmitter<MeetingVoucher>();
  @Output() create = new EventEmitter<MeetingVoucher>();
  @Output() delete = new EventEmitter();

  get f(): any {
    return this.form.controls;
  }

  form!: FormGroup;
  blobConfig!: McvFileUploadConfig;
  expenseHeadOptions: string[] = ['Food', 'Travel'];

  async ngOnInit() {
    await this.appSettingService.loadPresets();
    const _setting = this.appSettingService.presets
      .find(x => x.presetKey == this.config.PRESET_BLOB_CONTAINER_ATTACHMENTS);
    if (_setting)
      this.blobConfig = new McvFileUploadConfig(
        _setting.presetValue,
        `${this.config.NAMEOF_ENTITY_MEETING_VOUCHER}`
      );
    if (!this.form) {
      this.buildForm();
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      expenseAmount: new FormControl<any>(null, { nonNullable: true, validators: [Validators.min(1)] }),
      expenseHead: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required] }),
      particulars: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required] }),
    });
    this.f['expenseHead'].setValue(this.expenseHeadOptions[0], { emitEvent: false });

    // if (this.isReadOnly) {
    //   this.form.disable();
    // }
  }

  private bindForm(data: MeetingVoucher) {
    if (data) {
      this.f['expenseAmount'].setValue(data.expenseAmount);
      this.f['expenseHead'].setValue(data.expenseHead);
      this.f['particulars'].setValue(data.particulars);
    }
  }

  getErrorMessage(control: AbstractControl) {
    return this.utilityService.getErrorMessage(control);
  }

  async onDeleteAttachment(item: any) {
    await firstValueFrom(this.attachmentService.delete(item.id))
    this.currentEntity.attachments = this.currentEntity.attachments.filter(x => x.id !== item.id);
  }

  async onDelete() {
    await firstValueFrom(this.meetingVoucherService.delete(this.currentEntity.id));
    this.utilityService.showSwalToast('Success',
      'Expense updated successfully.'
    );
    this.delete.emit(this.currentEntity);
  }

  onSave() {
    this.onSubmit();
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
        let obj = new MeetingVoucherAttachment();
        obj.filename = x.filename;
        obj.size = x.size;
        obj.contentType = x.contentType;
        obj.guidname = x.blobPath;
        obj.blobPath = x.blobPath;
        obj.meetingVoucherID = this.currentEntity.id;
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
    let _createRequests: Observable<MeetingVoucherAttachment>[] = [];
    this.uploadQueue.forEach(x => {
      let obj = new MeetingVoucherAttachment();
      obj.filename = x.filename;
      obj.size = x.size;
      obj.contentType = x.contentType;
      obj.guidname = x.blobPath;
      obj.blobPath = x.blobPath;
      obj.meetingVoucherID = this.currentEntity.id;
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

  async onSubmit() {
    if (this.form.invalid) {
      this.touchForm();
      this.utilityService.showSweetDialog('Invalid Form',
        'Please fill all required fields with valid data and try again.', 'error'
      );
      return;
    }

    this.currentEntity.particulars = this.f['particulars'].value;
    this.currentEntity.expenseHead = this.f['expenseHead'].value;
    this.currentEntity.expenseAmount = this.f['expenseAmount'].value;
    this.currentEntity.meetingID = this.meetingID;
    if (this.isCreateMode) {
      this.currentEntity = await firstValueFrom(this.meetingVoucherService.create(this.currentEntity));
      this.utilityService.showSwalToast('Success', 'Expense saved successfully.');
      this.form.reset();
      if (this.uploadQueue.length > 0) {
        this.uploadFiles();
      } else {
        this.create.emit(this.currentEntity);
      }
    } else {
      this.meetingVoucherService.update(this.currentEntity).subscribe(
        data => {
          this.utilityService.showSwalToast('Success',
            'Expense updated successfully.'
          );
          this.currentEntity = Object.assign({}, data);
          this.update.emit(this.currentEntity);
        }
      );
    }
  }

  protected touchForm() {
    if (this.form) {
      Object.keys(this.form.controls).forEach(field => {
        const control = this.form.get(field);
        if (control)
          control.markAsTouched({ onlySelf: true });
      });
    }
  }
}
