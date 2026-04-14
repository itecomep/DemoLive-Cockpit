import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { debounceTime, distinctUntilChanged, firstValueFrom, Observable } from 'rxjs';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectBill } from '../../models/project-bill.model';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AppConfig } from 'src/app/app.config';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ProjectBillApiService } from '../../services/project-bill-api.service';
import { TypeMasterService } from 'src/app/shared/services/type-master.service';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { ProjectStageApiService } from '../../services/project-stage-api.service';
import { Project } from '../../models/project.model';
import { Contact } from 'src/app/contact/models/contact';
import { TypeMaster } from 'src/app/shared/models/type-master-dto';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatMenuModule } from '@angular/material/menu';
import { WorkOrderStage } from 'src/app/work-order/models/work-order-stage.model';
import { WorkOrder } from 'src/app/work-order/models/work-order.model';

@Component({
  selector: 'app-project-work-order-bill-update',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatExpansionModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    TextFieldModule,
    CommonModule,
    MatMenuModule,
    DecimalPipe,
    CurrencyPipe,
  ],
  templateUrl: './project-work-order-bill-update.component.html',
  styleUrls: ['./project-work-order-bill-update.component.scss']
})
export class ProjectWorkOrderBillUpdateComponent implements OnInit {

  bill: ProjectBill = new ProjectBill();
  workOrder!: WorkOrder;
  workOrderStages: WorkOrderStage[] = [];
  project!: Project;
  form!: FormGroup;
  filteredContacts!: Observable<Contact[]>;
  showTaxDetails!: boolean;
  typeOptions: TypeMaster[] = [];
  billTotal: number = 0;
  tdsRate: number = 10;
  igstRate: number = 18;
  cgstRate: number = 9;
  sgstRate: number = 9;
  readonly MAHARASHTRA_STATECODE = '27';
  readonly MAHARASHTRA_STATE = 'maharashtra';
  readonly PROJECT_BILL_TYPEFLAG_PROFORMA_INVOICE = this.billApiService.PROJECT_BILL_TYPEFLAG_PROFORMA_INVOICE;
  readonly PROJECT_BILL_TYPEFLAG_TAX_INVOICE = this.billApiService.PROJECT_BILL_TYPEFLAG_TAX_INVOICE;
  get PROJECT_STAGE_STATUS_FLAG_PENDING() { return this.config.PROJECT_STAGE_STATUS_FLAG_PENDING; }
  get PROJECT_STAGE_STATUS_FLAG_COMPLETED() { return this.config.PROJECT_STAGE_STATUS_FLAG_COMPLETED; }
  get PROJECT_STAGE_STATUS_FLAG_BILLED() { return this.config.PROJECT_STAGE_STATUS_FLAG_BILLED; }
  get PROJECT_STAGE_STATUS_FLAG_PAYMENT_RECEIVED() { return this.config.PROJECT_STAGE_STATUS_FLAG_PAYMENT_RECEIVED; }

  stagesFG = this.formBuilder.group({
    selected: this.formBuilder.array([]),
  });

  selectedStages: WorkOrderStage[] = [];

  get totalStageProgress() {
    return this.workOrderStages.filter(x => x.statusFlag != this.PROJECT_STAGE_STATUS_FLAG_PENDING)
      .reduce((a, b) => a + b.percentage, 0);
  }
  getStageFee(percentage: number) {
    return this.workOrder.amount * (percentage / 100);
  }
  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    private formBuilder: FormBuilder,
    private config: AppConfig,
    private utilityService: UtilityService,
    private dialogRef: MatDialogRef<ProjectWorkOrderBillUpdateComponent>,
    private billApiService: ProjectBillApiService,
    private typeMasterService: TypeMasterService,
    private appSettingService: AppSettingMasterApiService,
    private projectStageService: ProjectStageApiService
  ) {
    if (data) {
      this.bill = data.bill;
      this.project = data.project;
      this.workOrder = data.workOrder;
      this.workOrderStages = data.stages;

      if (!this.form) {
        this.buildForm();
      }
      this.workOrderStages.sort((a, b) => a.orderFlag - b.orderFlag).forEach(x => {
        const formControl = new FormControl<boolean>(false);
        if (this.bill.stages?.find(y => y.id == x.id)) {
          formControl.setValue(true);
        };
        // if (x.statusFlag != this.PROJECT_STAGE_STATUS_FLAG_COMPLETED) {
        formControl.disable();
        // }
        (this.stagesFG.get('selected') as FormArray).push(formControl);
      });
      if (this.bill.typeFlag == this.PROJECT_BILL_TYPEFLAG_PROFORMA_INVOICE) {
        this.getDraft(this.project?.id);
      }
      if (this.bill.isPreDated) {
        this.f['billDate'].enable();
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
    this.getTypeOptions();
    this.getTaxRates();
  }

  getErrorMessage(control?: AbstractControl) {
    return this.utilityService.getErrorMessage(control);
  }
  async getTypeOptions() {
    this.typeOptions = await firstValueFrom(this.typeMasterService.get([{ key: 'Entity', value: this.config.NAME_OF_ENTITY_PROJECT_Bill }]));
  }

  draftBill: ProjectBill = new ProjectBill();
  async getDraft(projectID: number) {
    this.draftBill = await firstValueFrom(this.billApiService.getDraft(projectID, this.PROJECT_BILL_TYPEFLAG_TAX_INVOICE, this.bill.isPreDated));
  }

  buildForm() {
    this.form = this.formBuilder.group({
      proformaInvoiceNo: new FormControl<any>(null),
      taxInvoiceNo: new FormControl<any>(null, { validators: this.bill.isPreDated ? [Validators.required] : [] }),
      typeFlag: new FormControl<any>(0, { validators: [Validators.required] }),
      billDate: new FormControl<any>(new Date(), { validators: [Validators.required] }),
      billPercentage: new FormControl<any>(0, { validators: [Validators.required, Validators.min(0), Validators.max(100)] }),
      billAmount: new FormControl<any>(0, { validators: [Validators.required, Validators.min(0)] }),
      previousBillAmount: new FormControl<any>(0, { validators: [Validators.required, Validators.min(0)] }),
      dueAmount: new FormControl<any>(0, { validators: [Validators.required, Validators.min(0)] }),
      cgstAmount: new FormControl<any>(0, { validators: [Validators.required, Validators.min(0)] }),
      cgstShare: new FormControl<any>(this.cgstRate, { validators: [Validators.required, Validators.min(0)] }),
      sgstAmount: new FormControl<any>(0, { validators: [Validators.required, Validators.min(0)] }),
      sgstShare: new FormControl<any>(this.sgstRate, { validators: [Validators.required, Validators.min(0)] }),
      igstAmount: new FormControl<any>(0, { validators: [Validators.required, Validators.min(0)] }),
      igstShare: new FormControl<any>(this.igstRate, { validators: [Validators.required, Validators.min(0)] }),
      payableAmount: new FormControl<any>(0, { validators: [Validators.min(0)] }),
      tdsAmount: new FormControl<any>(0, { validators: [Validators.min(0)] }),
      amountAfterTDS: new FormControl<any>(0, { validators: [Validators.min(0)] }),
      // client: new FormControl<any>(null),
      // reverseTaxCharges: new FormControl<any>(null)
      workOrderNo: new FormControl<any>(null),
      workOrderDate: new FormControl<any>(null),
    });
    this.f['billDate'].disable();
    this.f['tdsAmount'].disable();
    this.f['amountAfterTDS'].disable();

    this.f['billPercentage'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe((val: any) => {
      const billAmount: number = (this.workOrder.amount * (val / 100));
      this.f['billAmount'].setValue(Math.round((billAmount + Number.EPSILON) * 100) / 100, { emitEvent: false });

      const dueAmount: number = (billAmount - this.f['previousBillAmount'].value);
      this.f['dueAmount'].setValue(Math.round((dueAmount + Number.EPSILON) * 100) / 100, { emitEvent: false });

      this.calculateTotal(dueAmount);
    });

    this.f['billAmount'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe((val: any) => {
      const billPercentage: number = ((val / this.workOrder.amount) * 100);
      this.f['billPercentage'].setValue(Math.round((billPercentage + Number.EPSILON) * 100) / 100, { emitEvent: false });

      const dueAmount: number = (val - this.f['previousBillAmount'].value);
      this.f['dueAmount'].setValue(Math.round((dueAmount + Number.EPSILON) * 100) / 100, { emitEvent: false });

      this.calculateTotal(dueAmount);
    });

    this.f['previousBillAmount'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe((val: any) => {
      const dueAmount: number = (this.f['billAmount'].value - val);
      this.f['dueAmount'].setValue(Math.round((dueAmount + Number.EPSILON) * 100) / 100, { emitEvent: false });

      this.calculateTotal(dueAmount);
    });

    this.f['dueAmount'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe((val: any) => {
      const billAmount: number = (this.f['previousBillAmount'].value + val);
      this.f['billAmount'].setValue(Math.round((billAmount + Number.EPSILON) * 100) / 100, { emitEvent: false });

      // const billPercentage: number = this.workOrder ? ((billAmount / this.workOrder.fees) * 100) : 100;
      const billPercentage: number = ((billAmount / this.workOrder.amount) * 100);
      this.f['billPercentage'].setValue(Math.round((billPercentage + Number.EPSILON) * 100) / 100, { emitEvent: false });

      this.calculateTotal(val);
    });

    // this.stagesFG.valueChanges
    // .pipe(
    //   debounceTime(400),
    //   distinctUntilChanged()
    // )
    // .subscribe(
    //   (value) => {
    //     if (value) {
    //       const selected = value.selected;
    //       if (selected) {
    //         this.selectedStages = [];
    //         for (let i = 0; i < selected.length; i++) {
    //           if (selected[i]) {
    //             this.selectedStages.push(this.project.stages[i]);
    //           }
    //         }
    //         this.bill.workPercentage = this.selectedStages.reduce((a, b) => a + b.percentage, 0);
    //         this.f['billPercentage'].setValue(this.bill.workPercentage);
    //       }
    //     }
    //   }
    // )
  }

  get isCountryDifferent() { return this.project?.country?.toLowerCase() != "india" }
  get isStateCodeDifferent() { return this.project?.stateCode != this.project.company?.gstStateCode }

  private calculateTotal(dueAmount: number) {

    if (this.isStateCodeDifferent) {
      const gst: number = (dueAmount * (this.igstRate / 100));
      this.f['igstAmount'].setValue(Math.round((gst + Number.EPSILON) * 100) / 100, { emitEvent: false });
    }
    else {

      const cgst: number = (dueAmount * (this.cgstRate / 100));
      this.f['cgstAmount'].setValue(Math.round((cgst + Number.EPSILON) * 100) / 100, { emitEvent: false });

      const sgst: number = (dueAmount * (this.sgstRate / 100));
      this.f['sgstAmount'].setValue(Math.round((sgst + Number.EPSILON) * 100) / 100, { emitEvent: false });
    }

    const payableAmount: number = (dueAmount + this.f['igstAmount'].value + this.f['cgstAmount'].value + this.f['sgstAmount'].value);
    this.f['payableAmount'].setValue(Math.round((payableAmount + Number.EPSILON) * 100) / 100, { emitEvent: false });

    const tdsAmount: number = (this.f['billAmount'].value * (this.tdsRate / 100));
    this.f['tdsAmount'].setValue(Math.round((tdsAmount + Number.EPSILON) * 100) / 100, { emitEvent: false });

    const amountAfterTds: number = (payableAmount - tdsAmount);
    this.f['amountAfterTDS'].setValue(Math.round((amountAfterTds + Number.EPSILON) * 100) / 100, { emitEvent: false });
  }


  onClose() {
    this.dialogRef.close();
  }

  private async getTaxRates() {
    await this.appSettingService.loadPresets();
    this.tdsRate = Number(this.appSettingService.presets
      .find(x => x.presetKey == this.config.PRESET_TDS)?.presetValue);

    this.igstRate = Number(this.appSettingService.presets
      .find(x => x.presetKey == this.config.PRESET_IGST)?.presetValue);

    this.cgstRate = Number(this.appSettingService.presets
      .find(x => x.presetKey == this.config.PRESET_CGST)?.presetValue);

    this.sgstRate = Number(this.appSettingService.presets
      .find(x => x.presetKey == this.config.PRESET_SGST)?.presetValue);
  }
  bindForm() {
    this.form.patchValue(this.bill);
    //  this.project.stages.forEach(x => {
    //         const formControl = new FormControl<any>(false);
    //         if (x.statusFlag != this.PROJECT_STAGE_STATUS_FLAG_COMPLETED) {
    //           formControl.disable();
    //         }
    //         if(this.bill.stages?.find(y=>y.title==x.title)){
    //           formControl.setValue(true);
    //           }
    //         (this.stagesFG.get('selected') as FormArray).push(formControl);
    //       });
  }
  async onConvert() {
    if (this.form.invalid) {
      this.utilityService.showSweetDialog(
        'Incomplete data!',
        'Please fill all required fields with valid data and try again!',
        'warning');
      this.touchForm();
      return;
    }

    this.utilityService.showConfirmationDialog('Do you want to convert this Proforma Invoice to Tax Invoice?. This action is not reversible.', async () => {
      this.bill = Object.assign(this.bill, this.form.getRawValue());
      if (!this.bill.isPreDated) {
        this.bill.taxInvoiceNo = this.draftBill.taxInvoiceNo
      }
      this.bill.typeFlag = this.PROJECT_BILL_TYPEFLAG_TAX_INVOICE;
      this.bill = await firstValueFrom(this.billApiService.update(this.bill))
      this.utilityService.showSwalToast('Bill Updated!', 'Bill was successfully updated!', 'success');
      this.dialogRef.close(this.bill);
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

  async onSubmit() {
    if (this.form.invalid) {
      this.utilityService.showSweetDialog(
        'Incomplete data!',
        'Please fill all required fields with valid data and try again!',
        'warning');
      return;
    }

    this.bill = Object.assign(this.bill, this.form.getRawValue());
    if (!this.bill.isPreDated) {
      this.bill.taxInvoiceNo = this.draftBill.taxInvoiceNo
    }

    this.bill.cgstShare = this.cgstRate;
    this.bill.sgstShare = this.sgstRate;
    this.bill.igstShare = this.igstRate;

    this.bill = await firstValueFrom(this.billApiService.update(this.bill));
    this.utilityService.showSwalToast('Bill Updated!', 'Bill was successfully updated!', 'success');
    this.dialogRef.close(this.bill);
  }
}


