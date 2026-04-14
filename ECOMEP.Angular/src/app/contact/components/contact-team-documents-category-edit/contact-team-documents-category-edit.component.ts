import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { AppConfig } from 'src/app/app.config';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-contact-team-documents-category-edit',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  templateUrl: './contact-team-documents-category-edit.component.html',
  styleUrls: ['./contact-team-documents-category-edit.component.scss']
})
export class ContactTeamDocumentsCategoryEditComponent {

  config = inject(AppConfig);
  formBuilder = inject(FormBuilder);
  utilityService = inject(UtilityService);
  appSettingService = inject(AppSettingMasterApiService);
  dialogRef = inject(MatDialogRef<ContactTeamDocumentsCategoryEditComponent>);

  form!: FormGroup;
  categoryOptions: string[] = [];
  get f(): any { return this.form.controls }
  get fa(): FormArray { return this.f["categoryItems"] as FormArray; }

  async ngOnInit() {
    if (!this.appSettingService.presets || !this.appSettingService.presets.length) {
      await this.appSettingService.loadPresets();
    }

    const categoryOptions = this.appSettingService.presets
      .find(x => x.presetKey == this.config.PRESET_EMPLOYEE_DOCUMENT_CATEGORY_OPTIONS);
    if (categoryOptions) {
      this.categoryOptions = categoryOptions.presetValue.split(',').map(x => x.toUpperCase()).sort((a, b) => a.localeCompare(b));
      // console.log(this.categoryOptions);
    }

    this.buildForm();
    this.bindForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      categoryItems: this.formBuilder.array([]),
    });
  }

  bindForm() {
    this.fa.clear();
    this.categoryOptions.forEach(item => {
      this.addInput(item);
    });
    // this.addInput(null);
  }

  private addInput(value: string | null) {
    const formGroup = this.formBuilder.group(
      {
        category: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
      }
    );

    if (value) {
      formGroup.patchValue({ category: value }, { emitEvent: false });
    }
    this.fa.push(formGroup);
  }

  getFormControl(formArray: FormArray, index: number, controlName: string): FormControl {
    const _cellFormGroup = <FormGroup>formArray.controls[index];
    if (_cellFormGroup) {
      return <FormControl>_cellFormGroup.controls[controlName];
    }
    return new FormControl();
  }

  onInput(formArray: FormArray, index: number) {
    const _control = <FormControl>this.getFormControl(formArray, index, 'category');
    if (_control && _control.value && typeof _control.value == 'string') {
      _control.setValue(_control.value.toUpperCase());
      // _control.setValue(this.validateDecimalValue(_control.value.replace(/[^0-9.]/g, '')));
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  onDeleteCategory(category: string, index: number) {
    this.categoryOptions = this.categoryOptions.filter(x => x !== category);
    this.fa.removeAt(index);
  }

  onAddCategory() {
    this.addInput(null);
    const obj = (this.fa.controls[this.categoryOptions.length] as FormGroup).value;
    this.categoryOptions.push(obj);
  }

  onSubmit() {
    // console.log(this.form);
    const EMPLOYEE_DOCUMENT_CATEGORIES = this.form.value.categoryItems
      .map((item: any) => item.category.trim())
      .filter((category: string) => category !== "")
      .join(",");

    this.utilityService.showConfirmationDialog(`Do you want to update document category master?`, async () => {
      //Gets the PresetValue Object
      let categoryOptions = this.appSettingService.presets
        .find(x => x.presetKey == this.config.PRESET_EMPLOYEE_DOCUMENT_CATEGORY_OPTIONS);

      //Updates the object
      if (categoryOptions) {
        categoryOptions.presetValue = EMPLOYEE_DOCUMENT_CATEGORIES;
        const _updatedValue = await firstValueFrom(this.appSettingService.update(categoryOptions));
        this.utilityService.showSwalToast('Updated Successfully!!', '', 'success');
        if (_updatedValue) {
          this.categoryOptions = _updatedValue.presetValue;
          this.dialogRef.close();
        }
      }
    });
  }
}
