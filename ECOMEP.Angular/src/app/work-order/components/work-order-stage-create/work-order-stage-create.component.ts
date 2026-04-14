import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { WorkOrderStage } from '../../models/work-order-stage.model';

@Component({
  selector: 'app-work-order-stage-create',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  templateUrl: './work-order-stage-create.component.html',
  styleUrls: ['./work-order-stage-create.component.scss']
})
export class WorkOrderStageCreateComponent implements OnInit {

  private readonly dialog = inject(MatDialog);
  private readonly data = inject(MAT_DIALOG_DATA);
  private readonly formBuilder = inject(FormBuilder);
  private readonly utilityService = inject(UtilityService);
  private readonly dialogRef = inject(MatDialogRef<WorkOrderStageCreateComponent>);

  form!: FormGroup;
  workOrderStage: WorkOrderStage = new WorkOrderStage();
  get f(): any { return this.form.controls; }
  get isMobileView(): boolean { return this.utilityService.isMobileView; }

  ngOnInit(): void {
    if (!this.form) {
      this.buildForm();
    }
  }


  getErrorMessage(control: any) {
    return this.utilityService.getErrorMessage(control);
  }

  buildForm() {
    this.form = this.formBuilder.group({
      title: new FormControl(null, [Validators.required]),
      percentage: new FormControl(null),
    });
  }

  touchForm() {
    if (this.form) {
      Object.keys(this.form.controls).forEach(field => {
        const control = this.form.get(field);
        if (control)
          control.markAsTouched({ onlySelf: true });
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.touchForm();
      this.utilityService.showSweetDialog('Invalid Form',
        'Please fill all required fields with valid data and try again.', 'error'
      );
      return;
    }

    Object.assign(this.workOrderStage, this.form.getRawValue());
    this.dialogRef.close(this.workOrderStage);
  }

  onClose() {
    this.dialogRef.close();
  }
}
