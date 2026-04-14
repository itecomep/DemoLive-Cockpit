import { Component, Inject } from '@angular/core';
import { FormControl, Validators, ReactiveFormsModule, FormGroup, AbstractControl, FormBuilder, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Project } from '../../models/project.model';
import { TypeMaster } from 'src/app/shared/models/type-master-dto';
import { TypeMasterService } from 'src/app/shared/services/type-master.service';
import { debounceTime, distinctUntilChanged, firstValueFrom, forkJoin, map, Observable } from 'rxjs';
import { BillStage, ProjectBill, ProjectBillPayment } from 'src/app/project/models/project-bill.model';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { AsyncPipe, CurrencyPipe, DecimalPipe, NgFor, NgIf } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppConfig } from 'src/app/app.config';
import { ProjectBillApiService } from '../../services/project-bill-api.service';
import { ProjectWorkOrder } from '../../models/project-work-order.model';
import { ProjectWorkOrderApiService } from '../../services/project-work-order-api.service';
import { ProjectStageApiService } from '../../services/project-stage-api.service';
import { ProjectStage } from '../../models/project-stage.model';

@Component({
  selector: 'app-project-bill-create',
  templateUrl: './project-bill-create.component.html',
  styleUrls: ['./project-bill-create.component.scss'],
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe,
    DecimalPipe,
    MatAutocompleteModule, MatButtonModule, MatIconModule, MatDialogModule, MatExpansionModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, NgFor, MatOptionModule, MatInputModule, MatDatepickerModule, MatCheckboxModule, NgIf, TextFieldModule]
})
export class ProjectBillCreateComponent {

  bill: ProjectBill = new ProjectBill();
  // client?: Contact;
  project!: Project;
  workOrders: ProjectWorkOrder[] = [];
  bills: ProjectBill[] = [];
  payments: ProjectBillPayment[] = [];
  showTaxDetails: boolean = true;
  typeOptions: TypeMaster[] = [];
  workOrder?: ProjectWorkOrder;
  tdsRate: number = 10;
  igstRate: number = 9;
  cgstRate: number = 9;
  sgstRate: number = 9;
  form!: FormGroup;
  isPreDated: boolean = false;

  get f(): any { return this.form.controls; }
  get isMobileView(): boolean { return this.utilityService.isMobileView; }

  readonly IGSTSHARE = 9;
  readonly CGSTSHARE = 9;
  readonly SGSTSHARE = 9;
  readonly MAHARASHTRA_STATECODE = '27';
  readonly MAHARASHTRA_STATE = 'maharashtra';
  readonly PROJECT_BILL_TYPEFLAG_PROFORMA_INVOICE = this.billApiService.PROJECT_BILL_TYPEFLAG_PROFORMA_INVOICE;
  readonly PROJECT_BILL_TYPEFLAG_TAX_INVOICE = this.billApiService.PROJECT_BILL_TYPEFLAG_TAX_INVOICE;

  get isCountryDifferent() { return this.project?.country?.toLowerCase() != "india" }
  get isStateCodeDifferent() { return this.project?.stateCode != this.project.company?.gstStateCode }
  get PROJECT_STAGE_STATUS_FLAG_PENDING() { return this.config.PROJECT_STAGE_STATUS_FLAG_PENDING; }
  get PROJECT_STAGE_STATUS_FLAG_COMPLETED() { return this.config.PROJECT_STAGE_STATUS_FLAG_COMPLETED; }
  get PROJECT_STAGE_STATUS_FLAG_BILLED() { return this.config.PROJECT_STAGE_STATUS_FLAG_BILLED; }
  get PROJECT_STAGE_STATUS_FLAG_PAYMENT_RECEIVED() { return this.config.PROJECT_STAGE_STATUS_FLAG_PAYMENT_RECEIVED; }

  stagesFG = this.formBuilder.group({
    selected: this.formBuilder.array([]),
  });

  selectedStages: ProjectStage[] = [];

  get totalStageProgress() {
    return this.project.stages.filter(x => x.statusFlag != this.PROJECT_STAGE_STATUS_FLAG_PENDING)
      .reduce((a, b) => a + b.percentage, 0);
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    private config: AppConfig,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ProjectBillCreateComponent>,
    private billApiService: ProjectBillApiService,
    private utilityService: UtilityService,
    private typeMasterService: TypeMasterService,
    private appSettingService: AppSettingMasterApiService,
    private projectStageService: ProjectStageApiService
  ) {
    if (data) {
    
      this.project = data.project;
      this.isPreDated = data.isPreDated;
      if (!this.form) {
        this.buildForm();
      }
      this.getDraft(this.project?.id);

      this.bills = data.bills;
      this.bill.workPercentage = data.stageTotalProgress;
      this.project.stages.sort((a, b) => a.orderFlag - b.orderFlag).forEach(x => {
        const formControl = new FormControl<boolean>(false);
        if (x.statusFlag != this.PROJECT_STAGE_STATUS_FLAG_COMPLETED) {
          formControl.disable();
        }
        (this.stagesFG.get('selected') as FormArray).push(formControl);
      });

      //THIS IS APPLICATBLE ONLY IN CASE OF CUMULATIVE BILLING
      // if (this.bills && this.bills.length > 0) {
      //   this.bills = this.bills.filter(x => x.typeFlag == this.PROJECT_BILL_TYPEFLAG_TAX_INVOICE);

      //   if (this.bills.length != 0) {
      //     // console.log('previous Amount',this.bills[this.bills.length - 1].billAmount);
      //     this.f['previousBillAmount'].setValue(this.bills[this.bills.length - 1].billAmount, { emitEvent: false });
      //   }
      // }
      this.f['billPercentage'].setValue(this.bill.workPercentage);
    }
  }



  ngOnInit() {
    if (!this.form) {
      this.buildForm();
    }
    // this.getLatestWorkOrder();
    this.getTaxRates();

    this.getTypeOptions();

  }

  getErrorMessage(control?: AbstractControl) {
    return this.utilityService.getErrorMessage(control);
  }

  // async getLatestWorkOrder() {
  //   const _filter: ApiFilter[] = [{ key: 'projectID', value: this.project?.id.toString() }];
  //   const _workOrders = await firstValueFrom(this.workOrderService.get(_filter));
  //   if (_workOrders && _workOrders.length > 0) {
  //     this.workOrder = _workOrders[0];
  //   } else {
  //     this.workOrder = undefined;
  //   }
  //   // if (!this.project?.workOrders) {
  //   //   this.workOrder = undefined;
  //   // } else {
  //   //   const workOrders = this.project?.workOrders.sort((a, b) => {
  //   //     if (a.created < b.created) {
  //   //       return 1;
  //   //     }
  //   //     if (a.created > b.created) {
  //   //       return -1;
  //   //     }
  //   //     return 0;
  //   //   });

  //   //   this.workOrder = workOrders[0];
  //   // }
  // }

  async getDraft(projectID: number) {
    try {

      this.bill = await firstValueFrom(this.billApiService.getDraft(projectID, this.PROJECT_BILL_TYPEFLAG_PROFORMA_INVOICE, this.isPreDated)); //await firstValueFrom(this.billApiService.getDraft(projectID,this.PROJECT_BILL_TYPEFLAG_PROFORMAOICE));
      this.form.patchValue(this.bill);
    } catch (error) {
      // console.log(error);
      this.onClose();
    }
  }

  async getTypeOptions() {
    this.typeOptions = await firstValueFrom(this.typeMasterService.get([{ key: 'Entity', value: this.config.NAME_OF_ENTITY_PROJECT_Bill }]));
  }

  getStageFee(percentage: number) {
    return this.project.fee * (percentage / 100);
  }

  buildForm() {
    this.form = this.formBuilder.group({
      proformaInvoiceNo: new FormControl<any>(null),
      taxInvoiceNo: new FormControl<any>(null),
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
      amountAfterTds: new FormControl<any>(0, { validators: [Validators.min(0)] }),
      // client: new FormControl<any>(null),
      // reverseTaxCharges: new FormControl<any>(null)
      workOrderNo: new FormControl<any>(null),
      workOrderDate: new FormControl<any>(null),
    });

    this.f['typeFlag'].setValue(this.PROJECT_BILL_TYPEFLAG_PROFORMA_INVOICE, { emitEvent: false });
    this.f['typeFlag'].disable();
    if (!this.isPreDated) {
      this.f['billDate'].disable();
    }

    this.f['tdsAmount'].disable();
    this.f['amountAfterTds'].disable();
    // this.f['payableAmount'].disable();
    // this.f['cgstAmount'].disable();
    // this.f['sgstAmount'].disable();
    // this.f['igstAmount'].disable();

    this.f['billPercentage'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe((val: any) => {
      const billAmount: number = (this.project.fee * (val / 100));
      this.f['billAmount'].setValue(Math.round((billAmount + Number.EPSILON) * 100) / 100, { emitEvent: false });

      const dueAmount: number = (billAmount - this.f['previousBillAmount'].value);
      this.f['dueAmount'].setValue(Math.round((dueAmount + Number.EPSILON) * 100) / 100, { emitEvent: false });

      this.calculateTotal(dueAmount);
    });

    this.f['billAmount'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe((val: any) => {
      const billPercentage: number = ((val / this.project.fee) * 100);
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
      const billPercentage: number = ((billAmount / this.project.fee) * 100);
      this.f['billPercentage'].setValue(Math.round((billPercentage + Number.EPSILON) * 100) / 100, { emitEvent: false });

      this.calculateTotal(val);
    });


    this.stagesFG.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        map(() => this.stagesFG.getRawValue()) // Include disabled controls
      )
      .subscribe(
        (value) => {
          if (value) {
            const selected = value.selected;
            if (selected) {
              this.selectedStages = [];
              for (let i = 0; i < selected.length; i++) {
                if (selected[i]) {
                  console.log('selected', this.project.stages[i]);
                  this.selectedStages.push(this.project.stages[i]);
                }
              }
              this.bill.workPercentage = this.selectedStages.reduce((a, b) => a + b.percentage, 0);
              this.f['billPercentage'].setValue(this.bill.workPercentage);
            }
          }
        }
      )

  }


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
    this.f['amountAfterTds'].setValue(Math.round((amountAfterTds + Number.EPSILON) * 100) / 100, { emitEvent: false });

  }


  onClose() {
    this.dialogRef.close();
  }

  async onSubmit() {
    if (this.form.invalid) {
      console.log('Invalid form', this.form.errors);
      this.utilityService.showSweetDialog(
        'Incomplete data!',
        'Please fill all required fields marked with * and try again!',
        'warning');
      return;
    }


    if (this.project) {
      this.bill = Object.assign(this.bill, this.form.getRawValue());
      this.bill.cgstShare = this.cgstRate;
      this.bill.sgstShare = this.sgstRate;
      this.bill.igstShare = this.igstRate;
      this.bill.projectID = this.project?.id;
      this.bill.isPreDated = this.isPreDated;
      this.selectedStages.forEach(x => {
        x.statusFlag = this.PROJECT_STAGE_STATUS_FLAG_BILLED;
      });
      this.bill.stages = this.project.stages.filter(x => this.selectedStages.find(y => y.id == x.id)).map(x => new BillStage({
        id: x.id,
        title: x.title,
        abbreviation: x.abbreviation,
        percentage: x.percentage,
        amount: Math.round(((this.project.fee * (x.percentage / 100)) + Number.EPSILON) * 100) / 100,
        statusFlag: x.statusFlag,
        orderFlag: x.orderFlag
      }));

      this.bill = await firstValueFrom(this.billApiService.create(this.bill));

      this.utilityService.showSwalToast('Bill Created!', 'Bill was successfully created!', 'success');

      this.dialogRef.close(this.bill);

    }
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

}
