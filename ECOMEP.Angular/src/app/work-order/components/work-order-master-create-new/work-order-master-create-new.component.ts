import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { WorkOrderMasterApiService } from '../../services/work-order-master-api.service';
import { WorkOrderMaster } from '../../models/work-order-master.model';
import { WorkOrderStage } from '../../models/work-order-stage.model';
import { WorkOrderMasterStageApiService } from '../../services/work-order-master-stage-api.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom, forkJoin, lastValueFrom } from 'rxjs';
import { WorkOrderMasterStage } from '../../models/work-order-master-stage.model';

@Component({
  selector: 'app-work-order-master-create-new',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './work-order-master-create-new.component.html',
  styleUrls: ['./work-order-master-create-new.component.scss']
})
export class WorkOrderMasterCreateNewComponent {

  private readonly dialog = inject(MatDialog);
  private readonly data = inject(MAT_DIALOG_DATA);
  private readonly utilityService = inject(UtilityService);
  private readonly workOrderMasterApiService = inject(WorkOrderMasterApiService);
  private readonly dialogRef = inject(MatDialogRef<WorkOrderMasterCreateNewComponent>);
  private readonly workOrderMasterStageApiService = inject(WorkOrderMasterStageApiService);

  percentageTotal: number = 0;
  workOrderStages: WorkOrderStage[] = [];
  workOrderMaster = new WorkOrderMaster();
  typologyTitle: FormControl = new FormControl(null);

  async ngOnInit() {
    if (this.data) {
      this.workOrderStages = this.data.stages;
      this.percentageTotal = this.workOrderStages
        .reduce((acc, curr) => acc + curr.percentage, 0);
    }
  }

  async onSubmit() {
    if (this.typologyTitle.value == null || this.typologyTitle.value == '') {
      this.utilityService.showSweetDialog(
        'Incomplete data!',
        'Please fill all required fields with valid data and try again!',
        'warning');
      return;
    }
    this.workOrderMaster.typologyTitle = this.typologyTitle.value;
    this.workOrderMaster = await firstValueFrom(this.workOrderMasterApiService.create(this.workOrderMaster));
    await this.uploadStage();
  }

  async uploadStage() {
    if (!this.workOrderStages?.length) return;

    const requests = this.workOrderStages.map(s =>
      this.workOrderMasterStageApiService.create({
        workOrderMasterID: this.workOrderMaster.id,
        title: s.title,
        value: s.percentage
      } as WorkOrderMasterStage)
    );

    forkJoin(requests).subscribe(results => {
      this.workOrderMaster.workOrderMasterStages.push(...results);
    });
    this.dialogRef.close();
  }

  onClose() {
    this.dialogRef.close();
  }
}
