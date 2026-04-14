import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { WorkOrderMasterApiService } from '../../services/work-order-master-api.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { WorkOrderMaster } from '../../models/work-order-master.model';
import { firstValueFrom } from 'rxjs';
import { WorkOrderMasterUpdateComponent } from '../work-order-master-update/work-order-master-update.component';
import { WorkOrderStage } from '../../models/work-order-stage.model';

@Component({
  selector: 'app-work-order-master-create',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,

    //Components
    WorkOrderMasterUpdateComponent
  ],
  templateUrl: './work-order-master-create.component.html',
  styleUrls: ['./work-order-master-create.component.scss']
})
export class WorkOrderMasterCreateComponent implements OnInit {

  private readonly dialog = inject(MatDialog);
  private readonly data = inject(MAT_DIALOG_DATA);
  private readonly formBuilder = inject(FormBuilder);
  private readonly utilityService = inject(UtilityService);
  private readonly workOrderMasterApiService = inject(WorkOrderMasterApiService);
  private readonly dialogRef = inject(MatDialogRef<WorkOrderMasterCreateComponent>);

  form!: FormGroup;
  selectedTabIndex = 0;
  workOrderStages: WorkOrderStage[] = [];
  workOrderMaster!: WorkOrderMaster;
  workOrderMasters: WorkOrderMaster[] = [];
  selectedWorkOrderMaster!: WorkOrderMaster;
  typologyTitle: FormControl = new FormControl(null);
  isShowAddButton: boolean = false;

  async ngOnInit() {
    if (this.data) {
      this.workOrderStages = this.data.stages;
      console.log(this.workOrderStages);
    }

    await this.getWorkOrderStageMaster();
  }

  async onWorkOrderMasterCreate() {
    if (this.typologyTitle.value == null || this.typologyTitle.value == '') {
      this.utilityService.showSweetDialog(
        'Incomplete data!',
        'Please fill all required fields with valid data and try again!',
        'warning');
      return;
    }

    const _workOrderMaster = new WorkOrderMaster();
    _workOrderMaster.typologyTitle = this.typologyTitle.value;
    console.log(_workOrderMaster);

    this.workOrderMaster = await firstValueFrom(this.workOrderMasterApiService.create(_workOrderMaster));
    this.workOrderMasters.push(this.workOrderMaster);
    this.dialogRef.close();
  }

  //Send the selected workorder 
  async AddFromMaster() {
    this.dialogRef.close(this.selectedWorkOrderMaster);
  }

  async getWorkOrderStageMaster() {
    this.workOrderMasters = await firstValueFrom(this.workOrderMasterApiService.get());
  }

  onTabChange(index: number) {
    this.selectedTabIndex = index;
    this.selectedWorkOrderMaster = this.workOrderMasters[index];
    this.isShowAddButton = true;
  }

  onHideAddButton() {
    this.isShowAddButton = false;
  }

  onClose() {
    this.dialogRef.close();
  }
}
