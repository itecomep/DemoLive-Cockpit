import { Component, EventEmitter, Inject, inject, NgZone, Output, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AbstractControl, FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { debounceTime, distinctUntilChanged, firstValueFrom, map, Observable, take } from 'rxjs';
import { ProjectStageMaster } from '../../models/project-stage-master.model';
import { ProjectStageMasterApiService } from '../../services/project-stage-master-api.service';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-project-stage-master-form',
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
  templateUrl: './project-stage-master-form.component.html',
  styleUrls: ['./project-stage-master-form.component.scss']
})
export class ProjectStageMasterFormComponent {

  @ViewChild('autosize') protected autosize!: CdkTextareaAutosize;

  private readonly ngZone = inject(NgZone);
  private readonly formBuilder = inject(FormBuilder);
  private readonly StageService = inject(ProjectStageMasterApiService);
  private readonly utilityService = inject(UtilityService);

  form: any;
  get f(): any { return this.form.controls; }

  get isMobileView(): boolean { return this.utilityService.isMobileView; }

  @Output() submit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();

  maxDate?: string | null;
  title: any;
  check: any;
  arr_param: any;
  isCreateMode: boolean = false;
  loaderFlag = false;
  submitted = false;
  loading = false;
  checked: boolean = true;
  options: string[] = [];
  Inquiry!: string;
  Interior!: string;
  checkdata?: any[] = [];
  Architecture!: string;
  project_name!: string;
  da: any;
  ca: any;
  con: any;
  type_val: any;
  checkbox?: any[] = [];
  typeOptions = ['BIM', 'DATA CENTER', 'MEP', 'MOEF', 'AI', 'DIGITAL TWIN'];
  selectedType = 'MEP';
  workStageOrderOptions: string[] = [];
  filteredStage$!: Observable<string[]>;
  data: any;
  entity!: ProjectStageMaster;

  constructor(
    private dialogRef: MatDialogRef<ProjectStageMasterFormComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) data: any,
    private datePipe: DatePipe
  ) {
    this.maxDate = this.datePipe.transform(this.maxDate, 'yyyy-MM-dd') || this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.data = data;
    this.refresh();
  }
  refresh() {
    this.workStageOrderOptions = this.data.workStageOrderOptions;
    this.entity = this.data.entity;
    this.isCreateMode = this.data.isCreateMode;
    this.buildForm();
    console.log(this.isCreateMode);
    if (!this.isCreateMode) {
      this.form.patchValue(this.entity);
      const _typology = this.entity.typology.split(',');
      console.log(_typology);
      this.f['typology'].setValue(_typology);
    }
  }

  buildForm() {
    this.form = this.formBuilder.group({
      title: new FormControl<any>(null, [Validators.required]),
      percentage: new FormControl<any>(null, [Validators.required]),
      workOrderStageTitle: new FormControl<any>(null),
      workOrderStageValue: new FormControl<any>(null),
      typology: new FormControl<any>(null, [Validators.required]),
    });

    this.form.get('projectType')?.setValue(this.selectedType);
    this.form.get('percentage')?.setValue(0);
    this.form.get('workOrderStageValue')?.setValue(0);

    this.filteredStage$ = this.f.workOrderStageTitle.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      map((value: string) => value ?
        this.workStageOrderOptions.filter(option => option.toLowerCase().includes(value.toLowerCase())) :
        this.workStageOrderOptions.slice()),
    );

    this.touchForm();

  }
  touchForm() {
    //touch form inputs to show validation messages
    if (this.form) {
      Object.keys(this.form.controls).forEach(field => {
        // {1}
        const control = this.form.get(field); // {2}
        control.markAsTouched({ onlySelf: true }); // {3}
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

  onSave() {
    //console.log('dgd');
    this.submitted = true;

    // reset alerts on submit
    // this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    //this.loaderFlag = true;

    if (this.isCreateMode) {
      this.createstage();
    } else {
      this.updatestage();
    }
  }

  private async createstage() {
    let data = this.form.getRawValue();
    const _typology = this.f['typology'].value;
    const _string = _typology.join(',');
    data.typology = _string;
    console.log(data);
    const _new = await firstValueFrom(this.StageService.create(data));
    this.dialogRef.close(_new);
  }

  private async updatestage() {
    this.entity.percentage = this.form.controls['percentage'].value;
    this.entity.title = this.form.controls['title'].value;
    this.entity.typology = this.form.controls['typology'].value;
    const data = await firstValueFrom(this.StageService.update(this.entity));
    this.dialogRef.close(data);
  }

  onClose() {
    this.dialogRef.close();
  }
}

