import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Holiday } from '../../models/holiday.model';
import { TypeMaster } from 'src/app/shared/models/type-master-dto';
import { HolidayMasterService } from '../../services/holiday-master-api.service';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-holiday-master',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatOptionModule,
    MatSelectModule
  ],
  templateUrl: './holiday-master.component.html',
  styleUrls: ['./holiday-master.component.scss']
})
export class HolidayMasterComponent implements OnInit {

  form!: FormGroup;
  holidaysMasterArr: Holiday[] = [];
  holidayTypeMaster: TypeMaster[] = [];

  get f(): any { return this.form.controls; }
  get isMobileView() { return this.utilityService.isMobileView }
  get fa(): FormArray { return this.f['holidays'] as FormArray; }

  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    private formBuilder: FormBuilder,
    private utilityService: UtilityService,
    private holidayService: HolidayMasterService,
    private dialog: MatDialogRef<HolidayMasterComponent>,
  ) {
    if (data) {
      this.holidayTypeMaster = data.data.holidayMaster;
    }
    if (!this.form) {
      this.buildForm();
    }
    this.getHolidayData();
  }

  async getHolidayData() {
    const _holidayMaster = await firstValueFrom(this.holidayService.get());
    if (_holidayMaster && _holidayMaster.length) {
      this.holidaysMasterArr = _holidayMaster;
      this.holidaysMasterArr.sort((a,b) => new Date(b.holidayDate).getTime() - new Date(a.holidayDate).getTime());
    }
    this.buildForm();
    this.bindForm();
  }

  ngOnInit(): void {

  }

  onClose(e: any) {
    this.dialog.close();
  }

  protected touchForm() {
    if (this.form) {
      Object.keys(this.form.controls).forEach(field => {
        const control = this.form.get(field);
        if (control)
          control.markAsTouched({ onlySelf: true });
      });
    }
  }

  buildForm() {
    this.form = this.formBuilder.group({
      holidays: this.formBuilder.array([])
    });
    this.touchForm();
  }

  bindForm() {
    this.fa.clear();
    this.holidaysMasterArr.forEach(x => {
      this.addInput(x);
    });
    this.addInput(null);
  }

  addInput(value: Holiday | null) {
    const _formGroup = this.formBuilder.group({
      // typeFlag: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required] }),
      holidayDate: new FormControl<Date>(new Date(), { nonNullable: true, validators: [Validators.required] }),
      title: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
      // description: new FormControl<string>('')
    });
    if (value) {
      _formGroup.patchValue(value, { emitEvent: false });
      // _formGroup.controls['typeFlag'].setValue(value.typeFlag, { emitEvent: false });
    }

    this.fa.push(_formGroup);
  }

  getFormControl(formArray: FormArray, index: number, controlName: string): FormControl {
    const _cellFormGroup = <FormGroup>formArray.controls[index];
    if (_cellFormGroup) {
      return <FormControl>_cellFormGroup.controls[controlName];
    }
    return new FormControl();
  }

  onInput(formArray: FormArray, index: number, controlName: string) {
    const _control = <FormControl>this.getFormControl(formArray, index, controlName);
    if (_control && _control.value && typeof _control.value == 'string') {
      _control.setValue(_control.value);
    }
  }

  onSelectionChange(eventValue: any, formArray: FormArray, index: number, controlName: string, entity?: Holiday) {
    const _control = <FormControl>this.getFormControl(formArray, index, controlName);
    if (_control && _control.value && typeof _control.value == 'string') {
      _control.setValue(_control.value);
    }
    if (entity) {
      entity.typeFlag = eventValue;
      this.updateEntity(entity);
    }
  }

  onCellChange(formArray: FormArray, index: number, controlName: string, entity?: Holiday) {
    const _control = <FormControl>this.getFormControl(formArray, index, controlName);
    const _cellFormGroup = <FormGroup>formArray.controls[index];
    if (_control && _control.invalid) {
      this.utilityService.showSwalToast('Invalid input',
        this.utilityService.getErrorMessage(_control), 'error'
      );
      return;
    }

    if (entity) {
      entity.description = _cellFormGroup.value.description;
      entity.holidayDate = _cellFormGroup.value.holidayDate;
      entity.title = _cellFormGroup.value.title;
      entity.typeFlag = _cellFormGroup.value.typeFlag;
      this.updateEntity(entity);
    }
  }

  private async updateEntity(entity: Holiday) {
    entity = await this.holidayService.update(entity, true).toPromise();
  }

  onDelete(item: Holiday) {
    this.holidayService.delete(item.id).subscribe(data => {
      this.holidaysMasterArr = this.holidaysMasterArr.filter(x => x.id !== item.id);
      this.bindForm();
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.utilityService.showSweetDialog('Invalid Form',
        'Please fill all required fields with valid data and try again.', 'error'
      );
      this.touchForm();
      return;
    }

    const obj = new Holiday((this.fa.controls[this.holidaysMasterArr.length] as FormGroup).value);

    this.holidayService.create(obj).subscribe(data => {
      this.holidaysMasterArr.push(data);
      this.bindForm();
    });
  }
}
