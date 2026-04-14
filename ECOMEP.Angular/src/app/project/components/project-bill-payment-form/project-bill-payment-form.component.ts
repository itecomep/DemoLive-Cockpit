import { Component, EventEmitter, Inject, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { ProjectBill, ProjectBillPayment, ProjectBillPaymentAttachment } from 'src/app/project/models/project-bill.model';
import { Subscription, firstValueFrom, forkJoin } from 'rxjs';
import { ProjectBillApiService } from '../../services/project-bill-api.service';
import { ProjectBillPaymentApiService } from '../../services/project-bill-payment-api.service';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { McvFileUploadConfig } from 'src/app/mcv-file/models/mcv-file-upload-config.model';
import { ProjectBillPaymentAttachmentApiService } from '../../services/project-bill-payment-attachment-api.service';
import { BlobUploadInfo } from 'src/app/mcv-file/models/mcv-blob-upload-info.model';
import { MatButtonModule } from '@angular/material/button';
import { McvFileComponent } from '../../../mcv-file/components/mcv-file/mcv-file.component';
import { McvFileUploadComponent, UploadResult } from '../../../mcv-file/components/mcv-file-upload/mcv-file-upload.component';
import { NgIf, NgFor } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppConfig } from 'src/app/app.config';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-project-bill-payment-form',
  templateUrl: './project-bill-payment-form.component.html',
  styleUrls: ['./project-bill-payment-form.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule,    MatIconModule,
    MatDialogModule,MatExpansionModule,
     MatInputModule,MatSelectModule, MatDatepickerModule, NgIf, McvFileUploadComponent, NgFor, McvFileComponent, MatButtonModule]
})
export class ProjectBillPaymentFormComponent implements OnInit {

  bill!: ProjectBill;
  form!: FormGroup;
  billTotal: number = 0;
  payment: ProjectBillPayment = new ProjectBillPayment();
  refreshBill$!: Subscription;
  isCreateMode: boolean = false;
  tdsShare: number = 10;
  modeOptions=['CHEQUE','NEFT/RTGS','CASH','UPI','Other'];


  readonly PROJECT_BILL_TYPEFLAG_PROFORMA_INVOICE = this.billApiService.PROJECT_BILL_TYPEFLAG_PROFORMA_INVOICE;
  readonly PROJECT_BILL_TYPEFLAG_TAX_INVOICE = this.billApiService.PROJECT_BILL_TYPEFLAG_TAX_INVOICE;

  @Output() create = new EventEmitter<ProjectBillPayment>();
  @Output() update = new EventEmitter<ProjectBillPayment>();
  @Output() delete = new EventEmitter<ProjectBillPayment>();

  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    private dialogRef: MatDialogRef<ProjectBillPaymentFormComponent>,
    private config: AppConfig,
    private formBuilder: FormBuilder,
    private utilityService: UtilityService,
    private billApiService: ProjectBillApiService,
    private billPaymentService: ProjectBillPaymentApiService,
    private appSettingService: AppSettingMasterApiService,
    private billPaymentAttachmentService: ProjectBillPaymentAttachmentApiService,
  ) {
    if(data) {
      this.payment = data.payment ?? new ProjectBillPayment();
      this.bill = data.bill;
      this.tdsShare = data.tdsRate;
      this.isCreateMode = data.isCreateMode;
      if (!this.form) {
        this.buildForm();
      }
      if (this.isCreateMode) {
        this.payment.projectBillID = this.bill.id;
        this.payment.tdsShare = this.tdsShare;
        this.payment.amount = this.bill.payableAmount;
      } 
        this.bindForm();
    }
  }

  get f(): any { return this.form.controls; }
  get isMobileView(): boolean { return this.utilityService.isMobileView; }

  async ngOnInit() {
    if (!this.form) {
      this.buildForm();
    }
    this.getBlobUploadConfig();
    this.refreshBill$ = this.billApiService.triggerBillRefresh.subscribe(val => {
      if (val) {
        this.bill = val;
      }
    });
  }

  ngOnDestroy() {
    this.refreshBill$.unsubscribe();
  }
  onClose() {
    this.dialogRef.close();
  }
  getErrorMessage(control?: AbstractControl) {
    return this.utilityService.getErrorMessage(control);
  }

  buildForm() {
    this.form = this.formBuilder.group({
      amount: new FormControl<any>(0, { validators: [Validators.required, Validators.min(0)] }),
      tdsShare: new FormControl<any>(this.tdsShare, { validators: [Validators.required, Validators.min(0)] }),
      tdsAmount: new FormControl<any>(0, { validators: [Validators.required, Validators.min(0)] }),
      netAmount: new FormControl<any>(0, { validators: [Validators.required,Validators.min(0)] }),
      adjustmentAmount: new FormControl<any>(0, { validators: [Validators.required,Validators.min(0)] }),
      exchangeRate: new FormControl<any>(null),
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


  private bindForm() {
    this.form.patchValue(this.payment);
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

    if (this.isCreateMode) {
      this.payment = await firstValueFrom(this.billPaymentService.create(this.payment));
      this.utilityService.showSwalToast('Payment Created!', 'Payment was successfully created!', 'success');
      if (this.uploadQueue.length > 0) {
        await this.uploadFiles();
      }
      this.create.emit(this.payment);
    } else {
      this.payment = await firstValueFrom(this.billPaymentService.update(this.payment));
      this.utilityService.showSwalToast('Payment Updated!', 'Payment was successfully updated!', 'success');

      this.update.emit(this.payment);
    }

    this.dialogRef.close(this.payment);
  }

  async onDelete() {
    await firstValueFrom(this.billPaymentService.delete(this.payment.id));
    this.utilityService.showSwalToast('', 'Payment Deleted Successfully!!', 'success');
    this.delete.emit(this.payment);
  }

  // ---------UPLOAD--------------//
  blobConfig!: McvFileUploadConfig;

  private async getBlobUploadConfig() {
    await this.appSettingService.loadPresets();
    const _setting = this.appSettingService.presets
      .find(x => x.presetKey == this.config.PRESET_BLOB_CONTAINER_ATTACHMENTS);


    if (_setting)
      this.blobConfig = new McvFileUploadConfig(
        _setting.presetValue,
        `${this.billPaymentService.nameOfEntity}`
      );
  }

  uploadQueue: UploadResult[] = [];
  async onUpload(uploads: UploadResult[]) {
    uploads.forEach(x => {
      let obj = new ProjectBillPaymentAttachment();
      obj.filename = x.filename;
      obj.size = x.size;
      obj.contentType = x.contentType;
      obj.guidname = x.blobPath;
      obj.blobPath = x.blobPath;
      obj.projectBillPaymentID = this.payment.id;
      obj.container = this.blobConfig.container;
      obj.typeFlag = this.payment.typeFlag;
      obj.url = x.url;
      obj.originalUrl = x.url;
      this.payment.attachments.push(obj);
      this.uploadQueue.push(x);
    });

    if (!this.isCreateMode) {
      await this.uploadFiles();
    }
  }

  private async uploadFiles() {
    let _createRequests: any[] = [];
    // console.log(this.workOrderUploadQueue);
    this.uploadQueue.forEach((x, i) => {
      let obj = new ProjectBillPaymentAttachment();
      obj.filename = x.filename;
      obj.size = x.size;
      obj.contentType = x.contentType;
      obj.guidname = x.blobPath;
      obj.blobPath = x.blobPath;
      obj.projectBillPaymentID = this.payment.id;
      obj.container = this.blobConfig.container;
      obj.typeFlag = this.payment.typeFlag;
      obj.orderFlag = i++;
      obj.url = x.url;
      obj.originalUrl = x.url;
      _createRequests.push(this.billPaymentAttachmentService.create(obj));
    });
    this.uploadQueue = [];

    const results = await firstValueFrom(forkJoin(_createRequests));
    this.payment.attachments = [];
    results.forEach(x => {
      this.payment.attachments.push(x as ProjectBillPaymentAttachment);
    });
  }

  async onDeleteAttachment(item: ProjectBillPaymentAttachment) {
    await firstValueFrom(this.billPaymentAttachmentService.delete(item.id));
    this.utilityService.showSwalToast('', 'Attachment Deleted Successfully!!', 'error');
    this.payment.attachments = this.payment.attachments.filter(x => x.uid !== item.uid);
  }
  //=============================//
}
