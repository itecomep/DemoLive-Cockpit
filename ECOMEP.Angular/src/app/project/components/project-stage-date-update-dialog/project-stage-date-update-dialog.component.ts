import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ProjectStage } from '../../models/project-stage.model';
import { ProjectStageApiService } from '../../services/project-stage-api.service';
import { firstValueFrom } from 'rxjs';
import { ProjectApiService } from '../../services/project-api.service';

@Component({
  selector: 'app-project-stage-date-update-dialog',
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
  templateUrl: './project-stage-date-update-dialog.component.html',
  styleUrls: ['./project-stage-date-update-dialog.component.scss']
})
export class ProjectStageDateUpdateDialogComponent {
  stage!: ProjectStage;
  form!: FormGroup;

  get f(): any { return this.form.controls }
  get isMobileView(): boolean { return this.utilityService.isMobileView; }
  get isPermissionStagesSpecialEdit() { return this.projectService.isPermissionStagesSpecialEdit; }

  constructor(
    @Inject(MAT_DIALOG_DATA) dialogData: any,
    private formBuilder: FormBuilder,
    private utilityService: UtilityService,
    private projectService: ProjectApiService,
    private projectStageService: ProjectStageApiService,
    private dialog: MatDialogRef<ProjectStageDateUpdateDialogComponent>
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
    if(this.form.invalid){
      this.touchForm();
      this.utilityService.showSweetDialog(
        'Incomplete data!',
        'Please fill all required fields with valid data and try again!',
        'warning');
      return;
    }

    if (this.stage.dueDate !== this.f['dueDate'].value) {
      //   console.log('Different Date');
      //     const _newChildStage = new ProjectStage();
      //     _newChildStage.parentID = this.stage.id;
      //     _newChildStage.dueDate = this.stage.dueDate;
      //     _newChildStage.title = this.stage.title;
      //     _newChildStage.percentage = this.stage.percentage;
      //     _newChildStage.billingDate = this.stage.billingDate;
      //     _newChildStage.paymentReceivedDate = this.stage.paymentReceivedDate;
      //     _newChildStage.statusFlag = this.stage.statusFlag;
      //     _newChildStage.projectID = this.stage.projectID;
      //     await firstValueFrom(this.projectStageService.create(_newChildStage));

      //     this.stage.dueDate = this.f['dueDate'].value;
      //     this.stage.description = this.f['description'].value;
      //     this.stage = await firstValueFrom(this.projectStageService.update(this.stage));
      //     this.dialog.close(this.stage);
      // } else {

      
      // const selectedDate = this.f['dueDate'].value;
      // this.stage.dueDate = new Date(Date.UTC(
      //   selectedDate.getFullYear(),
      //   selectedDate.getMonth(),
      //   selectedDate.getDate()
      // ));
      this.stage.dueDate = this.f['dueDate'].value;
      this.stage.description = this.f['description'].value;
      this.stage = await firstValueFrom(this.projectStageService.update(this.stage));
      this.f['description'].reset();
      this.dialog.close(this.stage);
    }
    // this.stage.dueDate = this.f['dueDate'].value;
    // this.stage.description = this.f['description'].value;
    // this.stage = await firstValueFrom(this.projectStageService.update(this.stage));
    // this.dialog.close(this.stage);
  }

  onClose() {
    this.dialog.close();
  }
}
