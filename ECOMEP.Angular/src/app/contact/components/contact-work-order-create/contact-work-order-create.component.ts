import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AppConfig } from 'src/app/app.config';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { McvFileUploadConfig } from 'src/app/mcv-file/models/mcv-file-upload-config.model';
import { ContactWorkOrder, ContactWorkOrderAttachment } from '../../models/contact-work-order.model';
import { McvFileUploadComponent, UploadResult } from 'src/app/mcv-file/components/mcv-file-upload/mcv-file-upload.component';
import { firstValueFrom, forkJoin } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { McvFileComponent } from 'src/app/mcv-file/components/mcv-file/mcv-file.component';
import { ContactWorkOrderApiService } from '../../services/contact-work-order-api.service';
import { ContactWorkOrderAttachmentApiService } from '../../services/contact-work-order-attachment-api.service';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { Company } from 'src/app/shared/models/company.model';
import { CompanyApiService } from 'src/app/shared/services/company-api.service';

@Component({
  selector: 'app-contact-work-order-create',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,

    //Components
    McvFileUploadComponent,
    McvFileComponent
  ],
  templateUrl: './contact-work-order-create.component.html',
  styleUrls: ['./contact-work-order-create.component.scss']
})
export class ContactWorkOrderCreateComponent implements OnInit {

  config = inject(AppConfig);
  data = inject(MAT_DIALOG_DATA);
  formBuilder = inject(FormBuilder);
  utilityService = inject(UtilityService);
  companyAccountsService = inject(CompanyApiService);
  appSettingService = inject(AppSettingMasterApiService);
  dialogRef = inject(MatDialogRef<ContactWorkOrderCreateComponent>);
  contactWorkOrderApiService = inject(ContactWorkOrderApiService);
  contactWorkOrderAttachmentApiService = inject(ContactWorkOrderAttachmentApiService);

  form!: FormGroup;
  contactID!: number;
  companyOptions: Company[] = [];
  blobConfig!: McvFileUploadConfig;

  workOrder: ContactWorkOrder = new ContactWorkOrder();

  get f(): any { return this.form.controls; }
  get isMobileView(): boolean { return this.utilityService.isMobileView; }

  async ngOnInit() {
    if (!this.form) {
      this.buildForm();
    }

    if (this.data && this.data.contactID) {
      this.contactID = this.data.contactID;
      this.companyOptions = this.data.companyOptions;
      if (this.companyOptions && this.companyOptions.length !== 0 && this.f.companyID.value === null) {
        this.f['companyID'].setValue(this.companyOptions[0].id, { emitEvent: false });
      }
    }

    this.blobConfig = {
      container: this.appSettingService?.presets?.find(x => x.presetKey == this.config.PRESET_BLOB_CONTAINER_ATTACHMENTS)?.presetValue ?? '',
      folderPath: `${this.config.NAME_OF_ENTITY_PROJECT_WORK_ORDER}`
    };
  }

  private touchForm() {
    Object.keys(this.form.controls).forEach(field => {
      const control = this.form.get(field);
      if (control != null) {
        control.markAsTouched({ onlySelf: true });
      }
    });
  }

  getErrorMessage(control?: AbstractControl) {
    return this.utilityService.getErrorMessage(control);
  }

  buildForm() {
    this.form = this.formBuilder.group({
      companyID: new FormControl<any>(null, [Validators.required]),
      workOrderNo: new FormControl<any>(null),
      workOrderDate: new FormControl<any>(null),
      dueDate: new FormControl<any>(null),
      fees: new FormControl<any>(null),
    })
  }

  uploadQueue: UploadResult[] = [];
  onUpload(uploads: UploadResult[]) {
    //Creating a dummy object
    uploads.forEach(x => {
      let obj = new ContactWorkOrderAttachment();
      obj.filename = x.filename;
      obj.size = x.size;
      obj.contentType = x.contentType;
      obj.guidname = x.blobPath;
      obj.blobPath = x.blobPath;
      obj.contactWorkOrderID = this.workOrder.id;
      obj.container = this.blobConfig.container;
      obj.typeFlag = this.workOrder.typeFlag;
      obj.url = x.url;
      this.workOrder.attachments.push(obj);
      this.uploadQueue.push(x);
    });
    console.log(this.workOrder.attachments, this.uploadQueue);

  }

  private uploadFiles() {
    let _createRequests: any[] = [];
    this.uploadQueue.forEach(x => {
      let obj = new ContactWorkOrderAttachment();
      obj.filename = x.filename;
      obj.size = x.size;
      obj.contentType = x.contentType;
      obj.guidname = x.blobPath;
      obj.blobPath = x.blobPath;
      obj.contactWorkOrderID = this.workOrder.id;
      obj.container = this.blobConfig.container;
      obj.typeFlag = 0;
      obj.url = x.url;
      obj.originalUrl = x.url;
      _createRequests.push(this.contactWorkOrderAttachmentApiService.create(obj));
    });
    this.uploadQueue = [];

    forkJoin(_createRequests).subscribe((results: any) => {
      results.forEach((x: any) => {
        this.workOrder.attachments.push(x as ContactWorkOrderAttachment);
      })
      // this.todoApiService.refreshList();
    });
  }

  onDeleteAttachment(attachment: ContactWorkOrderAttachment) {
    this.uploadQueue = this.uploadQueue.filter(x => x !== attachment);
    this.workOrder.attachments = this.workOrder.attachments.filter(x => x.uid !== attachment.uid);
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.touchForm();
      this.utilityService.showSweetDialog(
        'Incomplete data!',
        'Please fill all required fields with valid data and try again!',
        'warning');
      return
    }

    this.workOrder = Object.assign(this.workOrder, this.form.value);
    this.workOrder.contactID = this.contactID;

    this.workOrder = await firstValueFrom(this.contactWorkOrderApiService.create(this.workOrder));
    this.uploadFiles();
    this.utilityService.showSwalToast('', 'Work Order created successfully', 'success');
    this.dialogRef.close(this.workOrder);
  }

  onClose() {
    this.dialogRef.close();
  }
}
