import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Project } from '../../models/project.model';
import { ProjectBillUpdateComponent } from '../project-bill-update/project-bill-update.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ProjectBillCreateComponent } from '../project-bill-create/project-bill-create.component';
import { ProjectBill } from '../../models/project-bill.model';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { AppConfig } from 'src/app/app.config';
import { firstValueFrom } from 'rxjs';
import { ProjectStageApiService } from 'src/app/project/services/project-stage-api.service';
import { ProjectBillApiService } from '../../services/project-bill-api.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DecimalPipe, CurrencyPipe, DatePipe, CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProjectWorkOrderApiService } from '../../services/project-work-order-api.service';
import { ProjectWorkOrder } from '../../models/project-work-order.model';
import { ProjectApiService } from '../../services/project-api.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { Contact } from 'src/app/contact/models/contact';
import { ContactDialogComponent } from 'src/app/contact/components/contact-dialog/contact-dialog.component';
import { ProjectBillDetailsEditComponent } from '../project-bill-details-edit/project-bill-details-edit.component';
import { ProjectBillPaymentsComponent } from '../project-bill-payments/project-bill-payments.component';

@Component({
  selector: 'app-project-bills',
  templateUrl: './project-bills.component.html',
  styleUrls: ['./project-bills.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatMenuModule,
    DecimalPipe,
    CurrencyPipe,
    DatePipe,
    MatExpansionModule,
    ProjectBillDetailsEditComponent
  ]
})
export class ProjectBillsComponent implements OnInit {
 
private readonly utilityService = inject(UtilityService);
 private readonly billService= inject(ProjectBillApiService);
 private readonly appSettingService= inject(AppSettingMasterApiService);
 private readonly config= inject(AppConfig);
 private readonly dialog= inject(MatDialog);
 private readonly projectApiService= inject(ProjectApiService);
 private readonly projectStageService= inject(ProjectStageApiService);
 private readonly workOrderService= inject(ProjectWorkOrderApiService);

 @Output() updated = new EventEmitter<Project>();
 @Output() formChange = new EventEmitter<any>();
 
 onUpdate(event: Project) {
  this.project = Object.assign({}, event);
  this.updated.emit(event);
}

onFormChange(event: FormGroup) {
  this.formChange.emit(event); 
}
  project?: Project;
  workOrders: ProjectWorkOrder[] = [];
  @Input('project') set projectValue(val: Project) {
    if (val) {
      this.project = val;
      this.getWorkOrder();
      this.refresh();
    }
  }

  bills: ProjectBill[] = [];
  
  get PROJECT_BILL_TYPEFLAG_PROFORMA_INVOICE() { return this.billService.PROJECT_BILL_TYPEFLAG_PROFORMA_INVOICE; }
  get PROJECT_BILL_TYPEFLAG_TAX_INVOICE() { return this.billService.PROJECT_BILL_TYPEFLAG_TAX_INVOICE; }
  get PROJECT_STAGE_STATUS_FLAG_COMPLETED() { return this.projectStageService.PROJECT_STAGE_STATUS_FLAG_COMPLETED; }


  get workOrder() {
    if (!this.project) {
      return undefined
    }
    const _workOrder = this.workOrders.sort((a, b) => {
      const dateA = new Date(a.workOrderDate);
      const dateB = new Date(b.workOrderDate);
      return dateB.getTime() - dateA.getTime();
    })[0];
    return _workOrder;
  }

  

  get PROJECT_STAGE_TYPE_FLAG_WORK() { return this.projectStageService.PROJECT_STAGE_TYPE_FLAG_WORK; }
  get workPercentage() {
    if (!this.project) {
      return 0;
    }
    return this.project?.stages.filter(x => x.typeFlag == this.config.PROJECT_STAGE_TYPE_FLAG_WORK).filter(x => x.statusFlag == this.PROJECT_STAGE_STATUS_FLAG_COMPLETED)
      .map(x => x.percentage).reduce((a, b) => a + b, 0);
  }

  get feesDue(){
    return this.project ? this.project.fee * this.workPercentage / 100.0 : 0;
  }

  get totalPendingFees() {
    // return this.workOrder ? this.workOrder?.fees * this.totalPendingPercentage / 100.0 : 0;
    return this.project ? this.project.fee * this.totalPendingPercentage / 100.0 : 0;
  }

  get totalPendingPercentage() {
    return this.workPercentage - this.totalReceivedPercentage;
  }

  get isPermissionView() { return this.projectApiService.isPermissionBillingView; }
  get isPermissionEdit() { return this.projectApiService.isPermissionBillingEdit; }
  get isEditMode(){return this.projectApiService.isEditMode}

  PRESET_TDS_RATE = 10;

  get totalBillPercentage(){
    return this.bills
    .filter(x => x.typeFlag == this.PROJECT_BILL_TYPEFLAG_TAX_INVOICE)
    .sort((a, b) => {
      const dateA = new Date(a.billDate);
      const dateB = new Date(b.billDate);
      return dateA.getTime() - dateB.getTime();
    })[0]?.billPercentage || 0;
  }

  get totalBillAmount(){
    return this.bills
    // .filter(x => x.typeFlag == this.PROJECT_BILL_TYPE_FLAG_INVOICE)
    .reduce((a, b) => a + b.dueAmount, 0);
  }

  get totalGstAmount(){
    return this.bills
    // .filter(x => x.typeFlag == this.PROJECT_BILL_TYPE_FLAG_INVOICE)
    .reduce((a, b) => a + b.cgstAmount + b.igstAmount+ b.sgstAmount, 0);
  }

  get totalPayable(){
    return this.bills
    // .filter(x => x.typeFlag == this.PROJECT_BILL_TYPE_FLAG_INVOICE)
    .reduce((a, b) => a + b.payableAmount, 0);
  }

   get totalTdsAmount(){
    return this.bills
    // .filter(x => x.typeFlag == this.PROJECT_BILL_TYPE_FLAG_INVOICE)
    .reduce((a, b) => a + b.tdsAmount, 0);
  }

  get totalAmountAfterTDS(){
    return this.bills
    // .filter(x => x.typeFlag == this.PROJECT_BILL_TYPE_FLAG_INVOICE)
    .reduce((a, b) => a + b.amountAfterTDS, 0);
  }

  get totalReceivedAmount(){
    return this.bills
    // .filter(x => x.typeFlag == this.PROJECT_BILL_TYPE_FLAG_INVOICE)
    .reduce((a, b) => a + this.getReceivedPayment(b), 0);
  }
  get totalReceivedPercentage() {
    return this.project && this.project?.fee > 0 ? this.totalReceivedAmount / this.project?.fee * 100.0 : 100.0;
  }
  
  isLastBill(bill: ProjectBill) {
     this.bills.sort((a, b) => {
      const dateA = new Date(a.billDate);
      const dateB = new Date(b.billDate);
      return dateB.getTime() - dateA.getTime();
    });
    return this.bills[0].id == bill.id;
  }

  async ngOnInit() {
    await this.appSettingService.loadPresets();
    this.PRESET_TDS_RATE = Number(this.appSettingService.presets
      .find(x => x.presetKey == this.config.PRESET_TDS)?.presetValue);
  }

  private async refresh() {
    if (this.project) { 
      this.getStages();
      this.bills = await firstValueFrom(this.billService.get([{ key: 'projectID', value: this.project?.id.toString() }]));
      this.bills = this.bills.filter(x => x.workOrderID == 0); //This will return us the bills which are created before new workOrder and billing was published(i.e 15 Dec 2025)
        this.bills.sort((a, b) => {
          const dateA = new Date(a.billDate);
          const dateB = new Date(b.billDate);
          return dateA.getTime() - dateB.getTime();
        })
 
    }
  }

  private async getWorkOrder(){
    this.workOrders = await firstValueFrom(this.workOrderService.get([{ key: 'projectId', value: this.project ? this.project.id.toString() : '0' }]));
  }

  private async getStages() {
    if (this.project) {
      this.project.stages = await firstValueFrom(this.projectStageService.get([{ key: 'projectId', value: this.project.id.toString() }]));
      this.project.stages.sort((a, b) => a.orderFlag - b.orderFlag);
    }
  }
  async onDelete(bill: ProjectBill) {
    this.utilityService.showConfirmationDialog(`Do you want to delete bill?`, async () => {
      await firstValueFrom(this.billService.delete(bill.id));
      this.bills = this.bills.filter(x => x.id !== bill.id);
      this.billService.activeBill = undefined;
      this.utilityService.showSwalToast(
        'Success!',
        'Delete successful.',
      );
    })

  }

  onEdit(bill: ProjectBill) {
    this.billService.activeBill = bill;
 
    const _dialogConfig = new MatDialogConfig();
    
    _dialogConfig.autoFocus = true;
    // _dialogConfig.panelClass = 'mcv-fullscreen-dialog';
    _dialogConfig.data = {
      bill,
      project: this.project
    }

    const _dialogRef = this.dialog.open(ProjectBillUpdateComponent, _dialogConfig);
    _dialogRef.afterClosed().subscribe(res => {
      if (res) {
        bill = Object.assign({}, res);
        this.billService.activeBill = undefined;
        this.refresh();
      }
    })
  }



  onCreate(isPreDated: boolean) {
    this.billService.activeBill = undefined;
    const _dialogConfig = new MatDialogConfig();
  
    _dialogConfig.autoFocus = true;
    // _dialogConfig.panelClass = 'mcv-fullscreen-dialog';
    _dialogConfig.data = {
      project: this.project,
      bills: this.bills,
      stageTotalProgress: this.workPercentage,
      isPreDated: isPreDated
    }

    const _dialogRef = this.dialog.open(ProjectBillCreateComponent, _dialogConfig);
    _dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.bills.push(res);
        this.bills.sort((a, b) => {
          const dateA = new Date(a.billDate);
          const dateB = new Date(b.billDate);
          return dateA.getTime() - dateB.getTime();
        });
        this.getStages();
      }
    })
  }

  onEditPayments(bill: ProjectBill) {
    this.billService.activeBill = bill;
 
    const _dialogConfig = new MatDialogConfig();

    _dialogConfig.autoFocus = true;
    // _dialogConfig.panelClass = 'mcv-fullscreen-dialog';
    _dialogConfig.data = {
      bill,
      project: this.project
    }

    const _dialogRef = this.dialog.open(ProjectBillPaymentsComponent, _dialogConfig);
    _dialogRef.afterClosed().subscribe(res => {
      if (res) {
        bill = Object.assign({}, res);
        this.billService.activeBill = undefined;
        this.refresh();
      }
    })
  }

  onDownloadPdf(url?: string) {
    if(url){
      window.open(url, '_blank');
    }
  }

  getReceivedPayment(bill: ProjectBill) {
    return bill.payments.reduce((a, b) => a + b.amount, 0)
  }

  getPendingPayment(bill: ProjectBill) {
    return bill.payableAmount - bill.payments.reduce((a, b) => a + b.amount, 0);
  }

  getPaymentWithoutTDS(bill: ProjectBill) {

    let paymentReceived = bill.payments.reduce((a, b) => a + b.amount, 0);
    let tdsAmount = (bill.billAmount * this.PRESET_TDS_RATE / 100.0);
    let gstAmount = bill.payableAmount - bill.dueAmount;
    return paymentReceived > 0 ? paymentReceived : bill.dueAmount - tdsAmount + gstAmount;
  }

  getPaymentMode(bill: ProjectBill) {
    return bill.payments.length > 0 ? bill.payments[0].mode : '';
  }
  getGSTPercentage(bill: ProjectBill) {
    let value=0;
    if(bill.cgstAmount > 0){
      value+=bill.cgstShare;
    }
    if(bill.sgstAmount > 0){
      value+=bill.sgstShare;
    }
    if(bill.igstAmount > 0){
      value+=bill.igstShare;
    }
    return value;
  }

  openContactDialog(contact?:Contact){
    if(contact){
    const dialogConfig = new MatDialogConfig();
      // dialogConfig.panelClass = 'mcv-fullscreen-dialog';
    // 
    dialogConfig.autoFocus = true;
    dialogConfig.data = contact;

    const _dialogRef= this.dialog.open(ContactDialogComponent, dialogConfig);
    }
  }

  async onConvert(bill: ProjectBill) {

    this.utilityService.showConfirmationDialog('Do you want to convert this Proforma Invoice to Tax Invoice?. This action is not reversible.', async () => {
      bill.typeFlag=this.PROJECT_BILL_TYPEFLAG_TAX_INVOICE;
    bill = await firstValueFrom(this.billService.update(bill))
    this.utilityService.showSwalToast('Bill Updated!', 'Bill was successfully updated!', 'success');
  });
  }
}
