import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactWorkOrderPayment, ContactWorkOrderPaymentAttachment } from '../../models/contact-work-order-payment.model';
import { McvFileUploadConfig } from 'src/app/mcv-file/models/mcv-file-upload-config.model';
import { debounceTime, distinctUntilChanged, firstValueFrom, forkJoin } from 'rxjs';
import { McvFileUploadComponent, UploadResult } from 'src/app/mcv-file/components/mcv-file-upload/mcv-file-upload.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { McvFileComponent } from 'src/app/mcv-file/components/mcv-file/mcv-file.component';
import { MatButtonModule } from '@angular/material/button';
import { ContactWorkOrderPaymentApiService } from '../../services/contact-work-order-payment-api.service';
import { ContactWorkOrderPaymentAttachmentApiService } from '../../services/contact-work-order-payment-attachment-api.service';
import { ContactWorkOrder } from '../../models/contact-work-order.model';
import { AppConfig } from 'src/app/app.config';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-contact-work-order-payment-create',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    McvFileUploadComponent,
    CommonModule,
    McvFileComponent,
    MatButtonModule,
    MatOptionModule,
    MatSelectModule
  ],
  templateUrl: './contact-work-order-payment-create.component.html',
  styleUrls: ['./contact-work-order-payment-create.component.scss']
})
export class ContactWorkOrderPaymentCreateComponent implements OnInit {

  config = inject(AppConfig);
  formBuilder = inject(FormBuilder);
  utilityService = inject(UtilityService);
  appSettingService = inject(AppSettingMasterApiService);
  contactWorkOrderPaymentApiService = inject(ContactWorkOrderPaymentApiService);
  contactWorkOrderPaymentAttachmentApiService = inject(ContactWorkOrderPaymentAttachmentApiService);

  form!: FormGroup;
  workOrder!: ContactWorkOrder;

  tdsShare: number = 10;
  modeOptions = ['CHEQUE', 'NEFT/RTGS', 'CASH', 'UPI', 'Other'];
  payment: ContactWorkOrderPayment = new ContactWorkOrderPayment();
  blobConfig!: McvFileUploadConfig;

  @Input('formData') set formDateValue(value: { workOrder: ContactWorkOrder, tdsShare: number }) {
    if (value) {
      this.workOrder = value.workOrder;
      this.tdsShare = value.tdsShare;
      if (!this.form) {
        this.buildForm();
      }
    }
  }

  @Output() create = new EventEmitter<ContactWorkOrderPayment>();

  get f(): any { return this.form.controls; }
  get isMobileView(): boolean { return this.utilityService.isMobileView; }

  async ngOnInit() {
    if (!this.form) {
      this.buildForm();
    }
    await this.appSettingService.loadPresets();
    const _setting = this.appSettingService.presets
      .find(x => x.presetKey == this.config.PRESET_BLOB_CONTAINER_ATTACHMENTS);


    if (_setting)
      this.blobConfig = new McvFileUploadConfig(
        _setting.presetValue,
        `${this.config.NAMEOF_ENTITY_CONTACT_WORK_ORDER_PAYMENT}`
      );
  }

  getErrorMessage(control?: AbstractControl) {
    return this.utilityService.getErrorMessage(control);
  }

  buildForm() {
    this.form = this.formBuilder.group({
      amount: new FormControl<any>(0, { validators: [Validators.required, Validators.min(0)] }),
      tdsShare: new FormControl<any>(this.tdsShare, { validators: [Validators.required, Validators.min(0)] }),
      tdsAmount: new FormControl<any>(0, { validators: [Validators.required, Validators.min(0)] }),
      netAmount: new FormControl<any>(0, { validators: [Validators.required, Validators.min(0)] }),
      adjustmentAmount: new FormControl<any>(0, { validators: [Validators.required, Validators.min(0)] }),
      exchangeRate: new FormControl<any>(0),
      currency: new FormControl<any>('INR'),
      transactionDate: new FormControl<any>(new Date(), { validators: [Validators.required] }),
      mode: new FormControl<any>(this.modeOptions[0]),
      transactionNo: new FormControl<any>(null),
      bankDetail: new FormControl<any>(null),
      comment: new FormControl<any>(null),
    });

    this.f['tdsShare'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe((val: any) => {
      if (val) {
        const _tdsShare = Number(val);
        const tdsAmount = (_tdsShare / 100) * this.f['amount'].value;

        // Round TDS amount to two decimal places
        this.f['tdsAmount'].setValue(Math.round((tdsAmount + Number.EPSILON) * 100) / 100, { emitEvent: false });

        const netAmount = Number(this.f['amount'].value) - tdsAmount;

        // Round Net Amount to two decimal places
        this.f['netAmount'].setValue(Math.round((netAmount + Number.EPSILON) * 100) / 100, { emitEvent: false });

      }
    });

    this.f['amount'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe((val: any) => {
      const _tdsShare = Number(this.f['tdsShare'].value);
      const tdsAmount = (_tdsShare / 100) * this.f['amount'].value;

      // Round TDS amount to two decimal places
      this.f['tdsAmount'].setValue(Math.round((tdsAmount + Number.EPSILON) * 100) / 100, { emitEvent: false });

      const netAmount = Number(this.f['amount'].value) - this.f['tdsAmount'].value;

      // Round Net Amount to two decimal places
      this.f['netAmount'].setValue(Math.round((netAmount + Number.EPSILON) * 100) / 100, { emitEvent: false });
    });
  }

  uploadQueue: UploadResult[] = [];
  async onUpload(uploads: UploadResult[]) {
    uploads.forEach(x => {
      let obj = new ContactWorkOrderPaymentAttachment();
      obj.filename = x.filename;
      obj.size = x.size;
      obj.contentType = x.contentType;
      obj.guidname = x.blobPath;
      obj.blobPath = x.blobPath;
      obj.contactWorkOrderPaymentID = this.payment.id;
      obj.container = this.blobConfig.container;
      obj.typeFlag = this.payment.typeFlag;
      obj.url = x.url;
      obj.originalUrl = x.url;
      this.payment.attachments.push(obj);
      this.uploadQueue.push(x);
    });
  }

  private async uploadFiles() {
    let _createRequests: any[] = [];
    // console.log(this.workOrderUploadQueue);
    this.uploadQueue.forEach((x, i) => {
      let obj = new ContactWorkOrderPaymentAttachment();
      obj.filename = x.filename;
      obj.size = x.size;
      obj.contentType = x.contentType;
      obj.guidname = x.blobPath;
      obj.blobPath = x.blobPath;
      obj.contactWorkOrderPaymentID = this.payment.id;
      obj.container = this.blobConfig.container;
      obj.typeFlag = this.payment.typeFlag;
      obj.orderFlag = i++;
      obj.url = x.url;
      obj.originalUrl = x.url;
      _createRequests.push(this.contactWorkOrderPaymentAttachmentApiService.create(obj));
    });
    this.uploadQueue = [];

    const results = await firstValueFrom(forkJoin(_createRequests));
    this.payment.attachments = [];
    results.forEach(x => {
      this.payment.attachments.push(x as ContactWorkOrderPaymentAttachment);
    });
  }

  onDeleteAttachment(item: ContactWorkOrderPaymentAttachment) {
    this.payment.attachments = this.payment.attachments.filter(x => x.uid !== item.uid);
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.utilityService.showSweetDialog(
        'Incomplete data!',
        'Please fill all required fields with valid data and try again!',
        'warning');
      return;
    }
    this.payment = Object.assign(this.payment, this.form.getRawValue());
    this.payment.contactWorkOrderID = this.workOrder.id;
    console.log(this.payment);
    this.payment = await firstValueFrom(this.contactWorkOrderPaymentApiService.create(this.payment));
    if (this.uploadQueue.length > 0) {
      await this.uploadFiles();
    }
    this.create.emit(this.payment);

    //Resetting the value
    this.form.reset();
    this.uploadQueue = [];
    this.payment = new ContactWorkOrderPayment();
    this.buildForm();
  }
}
