import { Component, EventEmitter, inject, Inject, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Observable, take, firstValueFrom } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ProjectStageMaster } from '../../models/project-stage-master.model';
import { ProjectStageMasterApiService } from '../../services/project-stage-master-api.service';
import { Project } from '../../models/project.model';
import { ProjectStageApiService } from '../../services/project-stage-api.service';
import { ProjectStage } from '../../models/project-stage.model';

@Component({
  selector: 'app-project-stages-create',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatAutocompleteModule,
    MatDatepickerModule,
  ],
  templateUrl: './project-stages-create.component.html',
  styleUrls: ['./project-stages-create.component.scss']
})
export class ProjectStagesCreateComponent implements OnInit {

  @ViewChild('autosize') protected autosize!: CdkTextareaAutosize;

  private readonly ngZone = inject(NgZone);
  private readonly formBuilder = inject(FormBuilder);
  private readonly stageService = inject(ProjectStageApiService);
  private readonly utilityService = inject(UtilityService);

  form: any;
  get f(): any { return this.form.controls; }

  get isMobileView(): boolean { return this.utilityService.isMobileView; }

  project!: Project;
  orderFlag: number = 0;
  constructor(
    private dialogRef: MatDialogRef<ProjectStagesCreateComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) data: any,
  ) {
    if (data) {
      if (!this.form) {
        this.buildForm();
      }
      this.project = data.project;
      this.orderFlag = data.orderFlag;
    }
  }

  ngOnInit(): void {
    if (!this.form) {
      this.buildForm();
    }
  }

  buildForm() {
    this.form = this.formBuilder.group({
      title: new FormControl<any>(null, [Validators.required]),
      percentage: new FormControl<any>(null, [Validators.required]),
    });
    this.touchForm();
  }

  touchForm() {
    if (this.form) {
      Object.keys(this.form.controls).forEach(field => {
        const control = this.form.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }
  protected triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this.ngZone.onStable
      .pipe(take(1))
      .subscribe(() => { if (this.autosize) { this.autosize.resizeToFitContent(true) } });
  }

  getErrorMessage(control?: AbstractControl) {
    return this.utilityService.getErrorMessage(control);
  }

  async onSubmit() {
    if (this.form.invalid) {
      console.log('Invalid form', this.form.errors);
      this.utilityService.showSweetDialog(
        'Incomplete data!',
        'Please fill all required fields marked with * and try again!',
        'warning');
      return;
    }
    const _stage = new ProjectStage({projectID: this.project.id, orderFlag: this.orderFlag});
    Object.assign(_stage, this.form.getRawValue());
    const _new = await firstValueFrom(this.stageService.create(_stage));
    this.dialogRef.close(_new);
  }

  onClose() {
    this.dialogRef.close();
  }
}
