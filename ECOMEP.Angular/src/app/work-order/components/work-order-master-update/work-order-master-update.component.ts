import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { WorkOrderMasterStage } from '../../models/work-order-master-stage.model';
import { WorkOrderMaster } from '../../models/work-order-master.model';
import { MatIconModule } from '@angular/material/icon';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { WorkOrderMasterStageApiService } from '../../services/work-order-master-stage-api.service';
import { MatButtonModule } from '@angular/material/button';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-work-order-master-update',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './work-order-master-update.component.html',
  styleUrls: ['./work-order-master-update.component.scss']
})
export class WorkOrderMasterUpdateComponent {

  private readonly formBuilder = inject(FormBuilder);
  private readonly utilityService = inject(UtilityService);
  private readonly workOrderMasterStageService = inject(WorkOrderMasterStageApiService);

  form!: FormGroup;
  percentageTotal: number = 0;
  workOrderMaster!: WorkOrderMaster;
  workOrderMasterStages: WorkOrderMasterStage[] = [];

  @Input('workOrderMaster') set OrderMaster(value: WorkOrderMaster) {
    if (value) {
      this.workOrderMaster = value;
      this.workOrderMasterStages = this.workOrderMaster.workOrderMasterStages;
      this.getPercentageTotal();
      if (!this.form) {
        this.buildForm();
      }
      this.bindForm();
    }
  }

  get fa(): FormArray {
    return this.f["workOrderMasterStages"] as FormArray;
  }

  get f(): any {
    return this.form.controls;
  }

  buildForm() {
    this.form = this.formBuilder.group({
      workOrderMasterStages: this.formBuilder.array([])
    });
  }

  getFormControl(
    formArray: FormArray,
    index: number,
    controlName: string
  ): FormControl {
    const _cellFormGroup = <FormGroup>formArray.controls[index];
    if (_cellFormGroup && _cellFormGroup.controls[controlName]) {
      return <FormControl>_cellFormGroup.controls[controlName];
    }
    return new FormControl();
  }

  bindForm() {
    this.fa.clear();
    this.workOrderMasterStages.forEach(x => {
      this.addInput(x);
    });
    this.addInput(null);
  }

  addInput(stage: WorkOrderMasterStage | null) {
    const _formGroup = this.formBuilder.group({
      title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      value: new FormControl(0, { nonNullable: true, validators: [Validators.required] }),
    });
    if (stage) {
      _formGroup.patchValue(stage, { emitEvent: false });
    }

    this.fa.push(_formGroup);
  }

  getPercentageTotal() {
    this.percentageTotal = this.workOrderMasterStages
      .reduce((acc, curr) => acc + curr.value, 0);
  }

  async onDelete(item: WorkOrderMasterStage) {
    await firstValueFrom(this.workOrderMasterStageService.delete(item.id));
    this.workOrderMasterStages = this.workOrderMasterStages.filter(x => x.id !== item.id);
    this.bindForm();
  }

  onInput(formArray: FormArray, index: number, controlName: string) {
    const _control = <FormControl>this.getFormControl(formArray, index, controlName);
    if (_control && _control.value && typeof _control.value == 'string') {
      _control.setValue(_control.value);
    }
  }

  onCellChange(formArray: FormArray, index: number, controlName: string, entity?: WorkOrderMasterStage) {
    const _control = <FormControl>this.getFormControl(formArray, index, controlName);
    const _cellFormGroup = <FormGroup>formArray.controls[index];
    if (_control && _control.invalid) {
      this.utilityService.showSwalToast('Invalid input',
        this.utilityService.getErrorMessage(_control), 'error'
      );
      return;
    }

    if (entity) {
      entity.title = _cellFormGroup.value.title;
      entity.value = _cellFormGroup.value.value;
      this.updateEntity(entity);
    }
  }

  private async updateEntity(entity: WorkOrderMasterStage) {
    // entity = await this.holidayService.update(entity, true).toPromise();
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.utilityService.showSweetDialog('Invalid Form',
        'Please fill all required fields with valid data and try again.', 'error'
      );
      this.touchForm();
      return;
    }

    const obj = new WorkOrderMasterStage((this.fa.controls[this.workOrderMasterStages.length] as FormGroup).value);
    obj.value = Number(obj.value);
    obj.workOrderMasterID = this.workOrderMaster.id;
    const _workOrderMasterStage = await firstValueFrom(this.workOrderMasterStageService.create(obj));
    if (_workOrderMasterStage) {
      this.workOrderMasterStages.push(_workOrderMasterStage);
      this.bindForm();
      this.getPercentageTotal();
    }
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

}
