import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkOrderStage } from '../../models/work-order-stage.model';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ProjectApiService } from 'src/app/project/services/project-api.service';
import { WorkOrderStageApiService } from '../../services/work-order-stage-api.service';
import { firstValueFrom } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-work-order-stage-date-update-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatDatepickerModule
  ],
  templateUrl: './work-order-stage-date-update-dialog.component.html',
  styleUrls: ['./work-order-stage-date-update-dialog.component.scss']
})
export class WorkOrderStageDateUpdateDialogComponent {
  stage!: WorkOrderStage;
  form!: FormGroup;

  get f(): any { return this.form.controls }
  get isMobileView(): boolean { return this.utilityService.isMobileView; }
  get isPermissionStagesSpecialEdit() { return this.projectService.isPermissionStagesSpecialEdit; }

  constructor(
    @Inject(MAT_DIALOG_DATA) dialogData: any,
    private formBuilder: FormBuilder,
    private utilityService: UtilityService,
    private projectService: ProjectApiService,
    private workOrderStageService: WorkOrderStageApiService,
    private dialog: MatDialogRef<WorkOrderStageDateUpdateDialogComponent>
  ) {
    this.stage = dialogData.stage;

    if (!this.form) {
      this.buildForm();
    }

    this.bindForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      dueDate: new FormControl<any>(new Date()),
      description: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required] }),
    });
  }

  bindForm() {
    this.f['dueDate'].setValue(this.stage.dueDate ?? new Date());
    this.f['description'].setValue(this.stage.description);
  }

  private touchForm() {
    Object.keys(this.form.controls).forEach(field => {
      const control = this.form.get(field);
      if (control != null) {
        control.markAsTouched({ onlySelf: true });
      }
    });
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.touchForm();
      this.utilityService.showSweetDialog(
        'Incomplete data!',
        'Please fill all required fields with valid data and try again!',
        'warning');
      return;
    }

    if (this.stage.dueDate !== this.f['dueDate'].value) {
      this.stage.dueDate = this.f['dueDate'].value;
      this.stage.description = this.f['description'].value;
      this.stage = await firstValueFrom(this.workOrderStageService.update(this.stage));
      this.f['description'].reset();
      this.dialog.close(this.stage);
    }
  }

  onClose() {
    this.dialog.close();
  }
}
