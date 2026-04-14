import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkOrder } from 'src/app/work-order/models/work-order.model';
import { Project } from '../../models/project.model';
import { MatExpansionModule } from '@angular/material/expansion';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ProjectApiService } from '../../services/project-api.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { firstValueFrom } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProjectBillApiService } from '../../services/project-bill-api.service';
import { ProjectBill } from '../../models/project-bill.model';
import { ProjectStageApiService } from '../../services/project-stage-api.service';
import { WorkOrderStageApiService } from 'src/app/work-order/services/work-order-stage-api.service';
import { MatMenuModule } from '@angular/material/menu';
import { ProjectBillPaymentsComponent } from '../project-bill-payments/project-bill-payments.component';
import { ProjectWorkOrderBillCreateComponent } from '../project-work-order-bill-create/project-work-order-bill-create.component';
import { ProjectWorkOrderBillUpdateComponent } from '../project-work-order-bill-update/project-work-order-bill-update.component';
import { ProjectDefinitionUpdateComponent } from '../project-definition-update/project-definition-update.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@Component({
  selector: 'app-project-work-order-bill',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    NgxMatSelectSearchModule,
  ],
  templateUrl: './project-work-order-bill.component.html',
  styleUrls: ['./project-work-order-bill.component.scss']
})
export class ProjectWorkOrderBillComponent extends ProjectDefinitionUpdateComponent implements OnInit {

  private readonly dialog = inject(MatDialog);
  private readonly billService = inject(ProjectBillApiService);
  private readonly projectApiService = inject(ProjectApiService);
  private readonly projectStageService = inject(ProjectStageApiService);
  private readonly workOrderStageService = inject(WorkOrderStageApiService);

  get PROJECT_BILL_TYPEFLAG_PROFORMA_INVOICE() { return this.billService.PROJECT_BILL_TYPEFLAG_PROFORMA_INVOICE; }
  get PROJECT_BILL_TYPEFLAG_TAX_INVOICE() { return this.billService.PROJECT_BILL_TYPEFLAG_TAX_INVOICE; }
  get PROJECT_STAGE_STATUS_FLAG_COMPLETED() { return this.projectStageService.PROJECT_STAGE_STATUS_FLAG_COMPLETED; }

  project!: Project;
  workOrder!: WorkOrder;
  bills: ProjectBill[] = [];
  PRESET_TDS_RATE = 10;

  @Input('config') set configValue(value: {
    workOrder: WorkOrder,
    project: Project
  }) {
    if (value) {
      this.workOrder = value.workOrder;
      this.project = value.project;
      this.refresh();
    }
  }


  get isPermissionBillingView() { return this.projectApiService.isPermissionBillingView; }

  get workPercentage() {
    if (!this.project) {
      return 0;
    }
    return 0
  }

  get totalBillPercentage() {
    return this.bills
      .filter(x => x.typeFlag == this.PROJECT_BILL_TYPEFLAG_TAX_INVOICE)
      .sort((a, b) => {
        const dateA = new Date(a.billDate);
        const dateB = new Date(b.billDate);
        return dateA.getTime() - dateB.getTime();
      })[0]?.billPercentage || 0;
  }

  get totalBillAmount() {
    return this.bills
      // .filter(x => x.typeFlag == this.PROJECT_BILL_TYPE_FLAG_INVOICE)
      .reduce((a, b) => a + b.dueAmount, 0);
  }

  get totalGstAmount() {
    return this.bills
      // .filter(x => x.typeFlag == this.PROJECT_BILL_TYPE_FLAG_INVOICE)
      .reduce((a, b) => a + b.cgstAmount + b.igstAmount + b.sgstAmount, 0);
  }

  get totalPayable() {
    return this.bills
      // .filter(x => x.typeFlag == this.PROJECT_BILL_TYPE_FLAG_INVOICE)
      .reduce((a, b) => a + b.payableAmount, 0);
  }

  get totalTdsAmount() {
    return this.bills
      // .filter(x => x.typeFlag == this.PROJECT_BILL_TYPE_FLAG_INVOICE)
      .reduce((a, b) => a + b.tdsAmount, 0);
  }

  get totalAmountAfterTDS() {
    return this.bills
      // .filter(x => x.typeFlag == this.PROJECT_BILL_TYPE_FLAG_INVOICE)
      .reduce((a, b) => a + b.amountAfterTDS, 0);
  }

  get totalReceivedAmount() {
    return this.bills
      // .filter(x => x.typeFlag == this.PROJECT_BILL_TYPE_FLAG_INVOICE)
      .reduce((a, b) => a + this.getReceivedPayment(b), 0);
  }
  get totalReceivedPercentage() {
    return this.project && this.project?.fee > 0 ? this.totalReceivedAmount / this.project?.fee * 100.0 : 100.0;
  }

  override async ngOnInit() {
    await super.ngOnInit();
    this.bindForm();
  }

  override bindForm() {
    this.form.patchValue(this.project);
    this.f['comment'].reset();
    this.f['segments'].setValue(this.project.segment?.split(','), { emitEvent: false });
    this.f['typologies'].setValue(this.project.typology?.split(','), { emitEvent: false });
    const _clientContact = this.contactOptions.filter(x => x.fullName.toLowerCase() == this.project.clientContact?.fullName.toLowerCase());
    if (_clientContact) {
      this.f['clientContact'].setValue(_clientContact[0], { emitEvent: false });
    }

    const _groupContact = this.contactOptions.filter(x => x.id == this.project.groupContact?.id);
    if (_groupContact) {
      this.f['groupContact'].setValue(_groupContact[0], { emitEvent: false });
    }
  }

  onSaveProject(event: MouseEvent) {
    event.stopPropagation();
    this.currentEntity = Object.assign(this.project, this.form.getRawValue());
    this.currentEntity.segment = this.f['segments'].value?.join(',');
    this.currentEntity.typology = this.f['typologies'].value?.join(',');
    this.currentEntity.clientContactID = this.f['clientContact'].value ? this.f['clientContact'].value.id : null;
    this.currentEntity.groupContactID = this.f['groupContact'].value ? this.f['groupContact'].value.id : null;
    this.currentEntity.referredByContactID = this.f['referredByContact'].value ? this.f['referredByContact'].value.id : null;
    this.currentEntity.groupCompanyContactID = this.f['groupCompanyContact'].value ? this.f['groupCompanyContact'].value.id : null;
    const _messageText = `Update | ${this.nameOfEntity}: ${this.currentEntity.title}`;

    this.utilityService.showConfirmationDialog(_messageText,
      async () => {

        // await this.contactAssociationService.updateItems();

        this.currentEntity = await firstValueFrom(this.projectApiService.update(this.currentEntity));
        Object.assign(this.project, this.currentEntity);
        this.f['comment'].reset();
        this.projectApiService.activeEntity = this.currentEntity;
        this.utilityService.showSwalToast('Success!', 'Save successful.');

        this.projectApiService.refreshList();
        this.updated.emit(this.currentEntity);
      }
    );
  }
  async getWorkOrderStages() {
    this.workOrder.stages = await firstValueFrom(this.workOrderStageService.get([{ key: 'workOrderID', value: this.workOrder.id.toString() }]));
    this.workOrder.stages.sort((a, b) => a.orderFlag - b.orderFlag);
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
    let value = 0;
    if (bill.cgstAmount > 0) {
      value += bill.cgstShare;
    }
    if (bill.sgstAmount > 0) {
      value += bill.sgstShare;
    }
    if (bill.igstAmount > 0) {
      value += bill.igstShare;
    }
    return value;
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
      isPreDated: isPreDated,
      stages: this.workOrder.stages,
      workOrder: this.workOrder
    }

    const _dialogRef = this.dialog.open(ProjectWorkOrderBillCreateComponent, _dialogConfig);
    _dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.bills.push(res);
        this.bills.sort((a, b) => {
          const dateA = new Date(a.billDate);
          const dateB = new Date(b.billDate);
          return dateA.getTime() - dateB.getTime();
        });
        this.getWorkOrderStages();
      }
    })
  }

  onDownloadPdf(url?: string) {
    if (url) {
      window.open(url, '_blank');
    }
  }

  onEdit(bill: ProjectBill) {
    this.billService.activeBill = bill;
    const _dialogConfig = new MatDialogConfig();
    _dialogConfig.autoFocus = true;
    // _dialogConfig.panelClass = 'mcv-fullscreen-dialog';
    _dialogConfig.data = {
      bill,
      project: this.project,
      workOrder: this.workOrder,
      stages: this.workOrder.stages
    }

    const _dialogRef = this.dialog.open(ProjectWorkOrderBillUpdateComponent, _dialogConfig);
    _dialogRef.afterClosed().subscribe(res => {
      if (res) {
        bill = Object.assign({}, res);
        this.billService.activeBill = undefined;
        this.refresh();
      }
    })
  }

  async onConvert(bill: ProjectBill) {

    this.utilityService.showConfirmationDialog('Do you want to convert this Proforma Invoice to Tax Invoice?. This action is not reversible.', async () => {
      bill.typeFlag = this.PROJECT_BILL_TYPEFLAG_TAX_INVOICE;
      bill = await firstValueFrom(this.billService.update(bill))
      this.utilityService.showSwalToast('Bill Updated!', 'Bill was successfully updated!', 'success');
    });
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

  private async refresh() {
    if (this.project) {
      this.getWorkOrderStages();
      this.bills = await firstValueFrom(this.billService.get([{ key: 'workOrderID', value: this.workOrder.id.toString() }]));
      this.bills.sort((a, b) => {
        const dateA = new Date(a.billDate);
        const dateB = new Date(b.billDate);
        return dateA.getTime() - dateB.getTime();
      })
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
}