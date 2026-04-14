import { Component, inject, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { WorkOrder } from '../../models/work-order.model';
import { Project } from 'src/app/project/models/project.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { WorkOrderCreateComponent } from '../work-order-create/work-order-create.component';
import { WorkOrderApiService } from '../../services/work-order-api.service';
import { firstValueFrom } from 'rxjs';
import { WorkOrderDetailsComponent } from '../work-order-details/work-order-details.component';
import { WorkOrderMasterApiService } from '../../services/work-order-master-api.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ProjectApiService } from 'src/app/project/services/project-api.service';
import { ProjectWorkOrderServiceMasterComponent } from 'src/app/project/components/project-work-order-service-master/project-work-order-service-master.component';

@Component({
  selector: 'app-work-order',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,

    //Components
    WorkOrderDetailsComponent
  ],
  templateUrl: './work-order.component.html',
  styleUrls: ['./work-order.component.scss']
})
export class WorkOrderComponent implements OnInit, OnChanges {
  dialog = inject(MatDialog);
  projectService = inject(ProjectApiService);
  workOrderService = inject(WorkOrderApiService);
  workOrderMasterService = inject(WorkOrderMasterApiService);

  workOrders: WorkOrder[] = [];
  selectedTabIndex: number = 0;


  get isPermissionWorkOrderEdit() { return this.projectService.isPermissionWorkOrderEdit; }
  get isPermissionWorkOrderServiceMaster() { return this.projectService.isPermissionWorkOrderServiceMaster; }

  @Input('project') project!: Project;

  async ngOnInit() {
    await this.getWorkOrders();
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['project'] && !changes['project'].firstChange) {
      this.selectedTabIndex = 0;
      await this.getWorkOrders();
    }
  }

  async getWorkOrders() {
    this.workOrders = await firstValueFrom(this.workOrderService.get([{ key: 'projectID', value: this.project.id.toString() }]));
  }

  onCreateNewWorkOrder() {
    const _dialogConfig = new MatDialogConfig();
    _dialogConfig.disableClose = true;
    _dialogConfig.autoFocus = true;
    _dialogConfig.data = {
      project: this.project
    }

    const _dialogRef = this.dialog.open(WorkOrderCreateComponent, _dialogConfig);
    _dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.workOrders.push(res);
      }
    });
  }

  openWorkOrderServiceMaster() {
    const _dialogConfig = new MatDialogConfig();
    _dialogConfig.autoFocus = true;
    _dialogConfig.disableClose = true;


    const _dialogRef = this.dialog.open(ProjectWorkOrderServiceMasterComponent, _dialogConfig);
    _dialogRef.afterClosed().subscribe(res => {
    });
  }
}
