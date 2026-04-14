import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../models/project.model';
import { ProjectWorkOrder } from '../../models/project-work-order.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProjectWorkOrderCreateComponent } from '../project-work-order-create/project-work-order-create.component';
import { ApiFilter } from 'src/app/shared/models/api-filters';
import { ProjectWorkOrderApiService } from '../../services/project-work-order-api.service';
import { firstValueFrom } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ProjectWorkOrderUpdateComponent } from '../project-work-order-update/project-work-order-update.component';
import { ProjectApiService } from '../../services/project-api.service';
import { ProjectWorkOrderServiceMasterComponent } from '../project-work-order-service-master/project-work-order-service-master.component';

@Component({
  selector: 'app-project-work-order',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ],
  templateUrl: './project-work-order.component.html',
  styleUrls: ['./project-work-order.component.scss']
})
export class ProjectWorkOrderComponent {

  dialog = inject(MatDialog);
  utilityService = inject(UtilityService);
  projectApiService = inject(ProjectApiService);
  projectWorkOrderService = inject(ProjectWorkOrderApiService);

  project!: Project;
  totalFee: number = 0;
  typeFlag: number = 0;
  workOrders: ProjectWorkOrder[] = [];

  get isPermissionWorkOrderView() { return this.projectApiService.isPermissionWorkOrderView; }
  get isPermissionWorkOrderEdit() { return this.projectApiService.isPermissionWorkOrderEdit; }
  get isPermissionWorkOrderDelete() { return this.projectApiService.isPermissionWorkOrderDelete; }
  get isPermissionWorkOrderServiceMaster() { return this.projectApiService.isPermissionWorkOrderServiceMaster; }

  @Input('project') set projectValue(value: {project: Project, typeFlag: number}) {
    if (value) {
      this.project = value.project;
      this.typeFlag = value.typeFlag;
      this.getProjectWorkOrders();
    }
  }

  onNewWorkOrder() {
    const _dialogConfig = new MatDialogConfig();
    _dialogConfig.autoFocus = true;
    _dialogConfig.disableClose = true;
    _dialogConfig.data = {
      projectID: this.project.id,
      typeFlag: this.typeFlag
    }

    const _dialogRef = this.dialog.open(ProjectWorkOrderCreateComponent, _dialogConfig);
    _dialogRef.afterClosed().subscribe(res => {
      if (res) {
        console.log(res);
        this.workOrders.unshift(res);
      }
    })
  }

  async getProjectWorkOrders() {
    const _filter: ApiFilter[] = [
      { key: 'projectID', value: this.project.id.toString() },
      { key: 'typeFlag', value: this.typeFlag.toString() },
    ];
    this.workOrders = await firstValueFrom(this.projectWorkOrderService.get(_filter));
    console.log('this.workOrders',this.workOrders);
    this.totalFee = this.workOrders.reduce((acc, workOrder) => {
      acc += workOrder.fees;
      return acc;
    }, 0);
  }

  onEdit(workOrder: ProjectWorkOrder) {
    const _dialogConfig = new MatDialogConfig();
    _dialogConfig.autoFocus = true;
    _dialogConfig.disableClose = true;
    _dialogConfig.data = {
      workOrder: workOrder,
      typeFlag: this.typeFlag
    }

    const _dialogRef = this.dialog.open(ProjectWorkOrderUpdateComponent, _dialogConfig);
    _dialogRef.afterClosed().subscribe(res => {
      if (res) {
        let _index = this.workOrders.findIndex(wo => wo.id === res.id);

        if (_index !== -1) {
          this.workOrders[_index] = res;
        }
      }
    });
  }

  onDelete(workOrder: ProjectWorkOrder) {
    this.utilityService.showConfirmationDialog('Are you sure you want to delete this work order?', async () => {
      await firstValueFrom(this.projectWorkOrderService.delete(workOrder.id));
      this.workOrders = this.workOrders.filter(x => x.id !== workOrder.id);
      this.utilityService.showSwalToast('', 'Work Order Deleted successfully', 'success');
    });
  }

  openWorkOrderServiceMaster(){
    const _dialogConfig = new MatDialogConfig();
    _dialogConfig.autoFocus = true;
    _dialogConfig.disableClose = true;
    

    const _dialogRef = this.dialog.open(ProjectWorkOrderServiceMasterComponent, _dialogConfig);
    _dialogRef.afterClosed().subscribe(res => {
    
    });
  }
}
