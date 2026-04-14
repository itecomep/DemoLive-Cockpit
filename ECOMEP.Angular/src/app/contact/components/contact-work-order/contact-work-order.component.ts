import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ApiFilter } from 'src/app/shared/models/api-filters';
import { firstValueFrom } from 'rxjs';
import { ContactWorkOrderCreateComponent } from '../contact-work-order-create/contact-work-order-create.component';
import { ContactWorkOrderApiService } from '../../services/contact-work-order-api.service';
import { ContactApiService } from '../../services/contact-api.service';
import { ContactWorkOrderUpdateComponent } from '../contact-work-order-update/contact-work-order-update.component';
import { Contact } from '../../models/contact';
import { ContactWorkOrder } from '../../models/contact-work-order.model';
import { Company } from 'src/app/shared/models/company.model';
import { CompanyApiService } from 'src/app/shared/services/company-api.service';
import { ContactWorkOrderPayment } from '../../models/contact-work-order-payment.model';
import { ContactWorkOrderPaymentUpdateDialogComponent } from '../contact-work-order-payment-update-dialog/contact-work-order-payment-update-dialog.component';
import { AppConfig } from 'src/app/app.config';

@Component({
  selector: 'app-contact-work-order',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,

    //COmponents
    ContactWorkOrderPaymentUpdateDialogComponent
  ],
  templateUrl: './contact-work-order.component.html',
  styleUrls: ['./contact-work-order.component.scss']
})
export class ContactWorkOrderComponent {
  dialog = inject(MatDialog);
  config = inject(AppConfig);
  utilityService = inject(UtilityService);
  contactApiService = inject(ContactApiService);
  companyAccountsService = inject(CompanyApiService);
  contactWorkOrderService = inject(ContactWorkOrderApiService);

  contact!: Contact;
  totalFee: number = 0;
  isExpanded: boolean[] = [];
  companyOptions: Company[] = [];
  workOrders: ContactWorkOrder[] = [];

  get isPermissionWorkOrderEdit() { return this.contactApiService.isPermissionWorkOrderEdit }
  get isPermissionWorkOrderDelete() { return this.contactApiService.isPermissionWorkOrderDelete }
  get isActiveAppointment() { return this.contact.appointments.filter(x => x.statusFlag == this.config.TEAM_APPOINTMENT_STATUS_APPOINTED).length > 0; }

  @Input('contact') set contactValue(value: Contact) {
    if (value) {
      this.contact = value;
      this.getContactWorkOrders();
      this.getCompanyOptions();
    }
  }

  onNewWorkOrder() {
    const _dialogConfig = new MatDialogConfig();
    _dialogConfig.autoFocus = true;
    _dialogConfig.disableClose = true;
    _dialogConfig.data = {
      contactID: this.contact.id,
      companyOptions: this.companyOptions
    }

    const _dialogRef = this.dialog.open(ContactWorkOrderCreateComponent, _dialogConfig);
    _dialogRef.afterClosed().subscribe(res => {
      if (res) {
        console.log(res);
        this.workOrders.unshift(res);
      }
    })
  }

  async getContactWorkOrders() {
    const _filter: ApiFilter[] = [
      { key: 'contactID', value: this.contact.id.toString() }
    ];
    this.workOrders = await firstValueFrom(this.contactWorkOrderService.get(_filter));
    this.totalFee = this.workOrders.reduce((acc, workOrder) => {
      acc += workOrder.fees;
      return acc;
    }, 0);
  }

  onEdit(workOrder: ContactWorkOrder) {
    const _dialogConfig = new MatDialogConfig();
    _dialogConfig.autoFocus = true;
    _dialogConfig.disableClose = true;
    _dialogConfig.panelClass = 'mcv-fullscreen-dialog';
    _dialogConfig.data = {
      workOrder: workOrder,
      companyOptions: this.companyOptions
    }

    const _dialogRef = this.dialog.open(ContactWorkOrderUpdateComponent, _dialogConfig);
    _dialogRef.afterClosed().subscribe(res => {
      if (res) {
        let _index = this.workOrders.findIndex(wo => wo.id === res.id);

        if (_index !== -1) {
          this.workOrders[_index] = res;
        }
      }
    });
  }

  onDelete(workOrder: ContactWorkOrder) {
    this.utilityService.showConfirmationDialog('Are you sure you want to delete this work order?', async () => {
      await firstValueFrom(this.contactWorkOrderService.delete(workOrder.id));
      this.workOrders = this.workOrders.filter(x => x.id !== workOrder.id);
      this.utilityService.showSwalToast('', 'Work Order Deleted successfully', 'success');
    });
  }

  async getCompanyOptions() {
    this.companyOptions = await firstValueFrom(this.companyAccountsService.get())
  }

  toggleExpand(i: number) {
    this.isExpanded[i] = !this.isExpanded[i];
  }

  onEditPayment(payment: ContactWorkOrderPayment) {
    const _dialogConfig = new MatDialogConfig();
    _dialogConfig.disableClose = true;
    _dialogConfig.autoFocus = true;
    _dialogConfig.data = {

    }

    const _dialogRef = this.dialog.open(ContactWorkOrderPaymentUpdateDialogComponent, _dialogConfig);
    _dialogRef.afterClosed().subscribe(res => {

    });
  }
}