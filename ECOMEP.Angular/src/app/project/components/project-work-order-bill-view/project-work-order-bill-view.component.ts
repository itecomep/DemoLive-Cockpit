import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../models/project.model';
import { WorkOrderApiService } from 'src/app/work-order/services/work-order-api.service';
import { firstValueFrom } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';
import { ProjectWorkOrderBillComponent } from '../project-work-order-bill/project-work-order-bill.component';
import { WorkOrder } from 'src/app/work-order/models/work-order.model';

@Component({
  selector: 'app-project-work-order-bill-view',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,

    //Components
    ProjectWorkOrderBillComponent
  ],
  templateUrl: './project-work-order-bill-view.component.html',
  styleUrls: ['./project-work-order-bill-view.component.scss']
})
export class ProjectWorkOrderBillViewComponent {

  private readonly workOrderService = inject(WorkOrderApiService);

  project!: Project;
  selectedTabIndex: number = 0;
  workOrders: WorkOrder[] = [];
  selectedWorkOrder: WorkOrder = new WorkOrder();

  @Input('project') set projectValue(value: any) {
    if (value) {
      this.project = value;
      this.getWorkOrders();
    }
  }

  async getWorkOrders() {
    this.workOrders = await firstValueFrom(this.workOrderService.get([{ key: 'projectID', value: this.project.id.toString() }]));
    console.log(this.workOrders);
  }


  onTabChange(index: number) {
    this.selectedTabIndex = index;
    this.selectedWorkOrder = this.workOrders[index];
  }
}
