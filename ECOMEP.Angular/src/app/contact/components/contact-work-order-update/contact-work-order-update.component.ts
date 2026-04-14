import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppConfig } from 'src/app/app.config';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { ContactWorkOrder, ContactWorkOrderAttachment } from '../../models/contact-work-order.model';
import { McvFileUploadConfig } from 'src/app/mcv-file/models/mcv-file-upload-config.model';
import { McvFileUploadComponent, UploadResult } from 'src/app/mcv-file/components/mcv-file-upload/mcv-file-upload.component';
import { firstValueFrom, forkJoin } from 'rxjs';
import { ContactApiService } from '../../services/contact-api.service';
import { ContactWorkOrderApiService } from '../../services/contact-work-order-api.service';
import { ContactWorkOrderAttachmentApiService } from '../../services/contact-work-order-attachment-api.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { McvFileComponent } from 'src/app/mcv-file/components/mcv-file/mcv-file.component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { Company } from 'src/app/shared/models/company.model';
import { MatExpansionModule } from '@angular/material/expansion';
import { ContactWorkOrderPaymentCreateComponent } from '../contact-work-order-payment-create/contact-work-order-payment-create.component';
import { ContactWorkOrderPaymentUpdateComponent } from '../contact-work-order-payment-update/contact-work-order-payment-update.component';
import { ContactWorkOrderPayment } from '../../models/contact-work-order-payment.model';

@Component({
  selector: 'app-contact-work-order-update',
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
    MatOptionModule,
    MatSelectModule,
    MatExpansionModule,

    //Components
    McvFileUploadComponent,
    McvFileComponent,
    ContactWorkOrderPaymentCreateComponent,
    ContactWorkOrderPaymentUpdateComponent
  ],
  templateUrl: './contact-work-order-update.component.html',
  styleUrls: ['./contact-work-order-update.component.scss']
})
export class ContactWorkOrderUpdateComponent implements OnInit {

  config = inject(AppConfig);
  data = inject(MAT_DIALOG_DATA);
  formBuilder = inject(FormBuilder);
  utilityService = inject(UtilityService);
  appSettingService = inject(AppSettingMasterApiService);
  contactApiService = inject(ContactApiService);
  contactWorkOrderApiService = inject(ContactWorkOrderApiService);
  dialogRef = inject(MatDialogRef<ContactWorkOrderUpdateComponent>);
  contactWorkOrderAttachmentApiService = inject(ContactWorkOrderAttachmentApiService);

  form!: FormGroup;
  tdsShare: number = 10;
  workOrder!: ContactWorkOrder;
  companyOptions: Company[] = [];
  blobConfig!: McvFileUploadConfig;

  get f(): any { return this.form.controls; }
  get isMobileView(): boolean { return this.utilityService.isMobileView; }
  // get isPermissionWorkOrderEdit() { return this.projectApiService.isPermissionWorkOrderEdit; }

  async ngOnInit() {
    if (!this.form) {
      this.buildForm();
    }
    console.log(this.data.workOrder);
    await this.appSettingService.loadPresets();
    this.tdsShare = Number(this.appSettingService.presets
      .find(x => x.presetKey == this.config.PRESET_TDS)?.presetValue);

    if (this.data) {
      this.workOrder = this.data.workOrder;
      this.companyOptions = this.data.companyOptions;
    }


    this.bindForm();

    this.blobConfig = {
      container: this.appSettingService?.presets?.find(x => x.presetKey == this.config.PRESET_BLOB_CONTAINER_ATTACHMENTS)?.presetValue ?? '',
      folderPath: `${this.config.NAME_OF_ENTITY_PROJECT_WORK_ORDER}`
    };
  }

  buildForm() {
    this.form = this.formBuilder.group({
      workOrderNo: new FormControl<any>(null),
      workOrderDate: new FormControl<any>(null),
      dueDate: new FormControl<any>(null),
      fees: new FormControl<any>(null),
      companyID: new FormControl<any>(null, [Validators.required]),
    });
  }

  bindForm() {
    this.form.patchValue(this.workOrder);
  }

  getErrorMessage(control?: AbstractControl) {
    return this.utilityService.getErrorMessage(control);
  }

  onUpload(uploads: UploadResult[]) {
    let _createRequests: any[] = [];
    uploads.forEach(x => {
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

    forkJoin(_createRequests).subscribe(results => {
      console.log('createdAttachments', results);
      results.forEach(x => {
        this.workOrder.attachments.push(x as ContactWorkOrderAttachment);
      })
    });
  }

  private touchForm() {
    Object.keys(this.form.controls).forEach(field => {
      const control = this.form.get(field);
      if (control != null) {
        control.markAsTouched({ onlySelf: true });
      }
    });
  }

  onClose() {
    this.dialogRef.close(this.workOrder);
  }

  async onDeleteAttachment(workOrderAttachment: ContactWorkOrderAttachment) {
    this.utilityService.showConfirmationDialog('Are you sure you want to delete this attachment', async () => {
      await firstValueFrom(this.contactWorkOrderAttachmentApiService.delete(workOrderAttachment.id));
      this.workOrder.attachments = this.workOrder.attachments.filter(x => x.id != workOrderAttachment.id);
    });
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
    this.workOrder = await firstValueFrom(this.contactWorkOrderApiService.update(this.workOrder));
    this.utilityService.showSwalToast('', 'Work Order updated successfully', 'success');
    this.dialogRef.close(this.workOrder);
  }

  onUpdatePayment(obj: ContactWorkOrderPayment) {
    if (obj) {
      let payment = this.workOrder.payments.find(x => x.id == obj.id);
      if (payment) {
        payment = obj;
        this.utilityService.showSwalToast('', 'Payment Updated Successfully!!', 'success');
      }
    }
  }

  onDeletePayment(obj: ContactWorkOrderPayment) {
    if (obj) {
      this.workOrder.payments = this.workOrder.payments.filter(x => x.id != obj.id);
      this.utilityService.showSwalToast('', 'Payment Deleted Successfully!!', 'success');
    }
  }

  onCreatePayment(obj: ContactWorkOrderPayment) {
    if (obj) {
      this.workOrder.payments.push(obj);
      this.utilityService.showSwalToast('', 'Payment Created Successfully!!', 'success');
    }
  }
}
