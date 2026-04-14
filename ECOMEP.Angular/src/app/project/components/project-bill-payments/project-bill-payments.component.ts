import { Component, Inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ProjectBill, ProjectBillPayment } from '../../models/project-bill.model';
import { ProjectBillPaymentFormComponent } from '../project-bill-payment-form/project-bill-payment-form.component';
import { AppConfig } from 'src/app/app.config';
import { ProjectBillPaymentApiService } from '../../services/project-bill-payment-api.service';
import { Project } from '../../models/project.model';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-project-bill-payments',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
      DecimalPipe,
        CurrencyPipe
  ],
  templateUrl: './project-bill-payments.component.html',
  styleUrls: ['./project-bill-payments.component.scss']
})
export class ProjectBillPaymentsComponent {

   bill!: ProjectBill;
    project!: Project;
constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    private config: AppConfig,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ProjectBillPaymentsComponent>,
    private billPaymentService: ProjectBillPaymentApiService,
    private appSettingService: AppSettingMasterApiService
  ) {
    if (data) {
      this.bill = data.bill;
      this.project = data.project;
      this.getTaxRates();
      if(this.bill.payments.length==0){
        this.onCreatePayment();
      }
    }
  }

  onClose() {
    this.dialogRef.close(this.bill);
  }

  tdsRate: number = 10;
  private async getTaxRates() {
    await this.appSettingService.loadPresets();
    this.tdsRate = Number(this.appSettingService.presets
      .find(x => x.presetKey == this.config.PRESET_TDS)?.presetValue);
  }
  onCreatePayment() {
    const _dialogConfig = new MatDialogConfig();
    
    _dialogConfig.autoFocus = true;
    // _dialogConfig.panelClass = 'mcv-fullscreen-dialog';
    _dialogConfig.data = {
      isCreateMode:true,
      bill:this.bill,
      tdsRate:this.tdsRate,
      payment:new ProjectBillPayment({projectBillID: this.bill.id,amount: this.bill.payableAmount})
    };

    const _dialogRef = this.dialog.open(ProjectBillPaymentFormComponent, _dialogConfig);
    _dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.bill.payments.push(res);
        this.bill.payments.sort((a, b) => {
          const dateA = a.transactionDate ? new Date(a.transactionDate).getTime() : 0;
          const dateB = b.transactionDate ? new Date(b.transactionDate).getTime() : 0;
          return dateA - dateB;
        });
      }
    })
  }

  onEditPayment(item: ProjectBillPayment) {

    const _dialogConfig = new MatDialogConfig();
    
    _dialogConfig.autoFocus = true;
    // _dialogConfig.panelClass = 'mcv-fullscreen-dialog';
    _dialogConfig.data = {
      isCreateMode:false,
      bill:this.bill,
      tdsRate:this.tdsRate,
      payment:item
    };

    const _dialogRef = this.dialog.open(ProjectBillPaymentFormComponent, _dialogConfig);
    _dialogRef.afterClosed().subscribe(res => {
      if (res) {
        item = Object.assign({}, res);
        this.bill.payments.sort((a, b) => {
          const dateA = a.transactionDate ? new Date(a.transactionDate).getTime() : 0;
          const dateB = b.transactionDate ? new Date(b.transactionDate).getTime() : 0;
          return dateA - dateB;
        });
      }
    })
  }

  async onDeletePayment(obj: ProjectBillPayment) {
    if (obj) {
      await firstValueFrom(this.billPaymentService.delete(obj.id));
      this.bill.payments = this.bill.payments.filter(x => x.id != obj.id);
    }
  }

}
