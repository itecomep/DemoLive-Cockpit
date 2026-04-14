import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, EventEmitter, inject, Inject, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, Validators, FormControl, FormGroup, FormBuilder, AbstractControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { firstValueFrom, take } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { AuthService } from 'src/app/auth/services/auth.service';
import { PresetMaster } from 'src/app/shared/models/preset-master';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { NgTemplateOutlet, NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-contact-category-master',
  templateUrl: './contact-category-master.component.html',
  styleUrls: ['./contact-category-master.component.scss'],
  standalone: true,
  imports: [MatButtonModule, NgTemplateOutlet, MatIconModule, MatDialogModule, NgFor, NgIf, MatTooltipModule, ReactiveFormsModule, FormsModule, MatInputModule]
})
export class ContactCategoryMasterComponent implements OnInit {
  dialogTitle: string = "Contact Category Master";
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  private readonly utilityService = inject(UtilityService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly ngZone = inject(NgZone);
  private readonly config = inject(AppConfig);
  private readonly authService = inject(AuthService);

  form: any;
  get f(): any { return this.form.controls; }

  get isMobileView(): boolean { return this.utilityService.isMobileView; }

  @Output() submit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();
  items: string[] = [];
  appSetting!: PresetMaster;

  get fa(): FormArray { return this.f["items"] as FormArray; }

  constructor(
    private dialogRef: MatDialogRef<ContactCategoryMasterComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private appSettingService: AppSettingMasterApiService
  ) {

  }

  async ngOnInit() {
    this.buildForm();
    if (!this.appSettingService.presets || !this.appSettingService.presets.length) {
      await this.appSettingService.loadPresets();
    }
    const _setting = this.appSettingService.presets
      .find(x => x.presetKey == this.config.PRESET_CONTACT_CATEGORY_OPTIONS);
    if (_setting) {
      this.appSetting = _setting;
      this.items = _setting.presetValue.split(',').map(x => x.toUpperCase());
    }
    this.bindForm();
  }

  onClose() {
    this.dialogRef.close();
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


  resetForm() {
    if (this.form) {
      this.form.reset();
    }
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this.ngZone.onStable
      .pipe(take(1))
      .subscribe(() => { if (this.autosize) { this.autosize.resizeToFitContent(true) } });
  }

  getErrorMessage(control?: AbstractControl) {
    return this.utilityService.getErrorMessage(control);
  }


  buildForm() {
    this.form = this.formBuilder.group({
      items: this.formBuilder.array([]),
    });
    this.touchForm();
  }


  bindForm() {
    this.fa.clear();
    this.items.forEach(item => {
      this.addInput(item);
    });
    // this.addInput(null);
  }

  private addInput(value: any) {
    this.fa.push(new FormControl<any>(value, [Validators.required, Validators.minLength(1), Validators.maxLength(255)]));
  }

  getFormControl(formArray: FormArray, index: number): FormControl {
    const _cellForm = <FormControl>formArray.controls[index];
    if (_cellForm) {
      return _cellForm;
    }
    return new FormControl();
  }
  onInput(formArray: FormArray, index: number) {
    // console.log('_index', index, controlName);
    const _control = <FormControl>this.getFormControl(formArray, index);
    if (_control && _control.value && typeof _control.value == 'string') {
      _control.setValue(_control.value.toUpperCase());
      // _control.setValue(this.validateDecimalValue(_control.value.replace(/[^0-9.]/g, '')));
    }
  }

  onCellChange(formArray: FormArray, index: number) {
    const _control = <FormControl>this.getFormControl(formArray, index);
    if (_control && _control.invalid) {
      this.utilityService.showSwalToast('Invalid input',
        this.utilityService.getErrorMessage(_control), 'error'
      );
      return;
    }
  }


  async onSubmit() {
    // if (this.form.invalid)
    // {
    //   this.utilityService.showSweetDialog('Invalid Form',
    //     'Please fill all required fields with valid data and try again.', 'error'
    //   );
    //   this.touchForm();
    //   return;
    // }

    this.items = this.fa.value.filter((item: any) => item !== null || item !== '');
    // console.log(this.items); 
    const csv = this.items.join(',');
    if (this.appSetting) {
      this.appSetting.presetValue = csv;
      await firstValueFrom(this.appSettingService.update(this.appSetting));
      this.utilityService.showSweetDialog('Success', 'Saved Successfully', 'success');
      this.dialogRef.close(csv);
    }
  }

  onAddCategory() {
    this.addInput(null);
    const obj = (this.fa.controls[this.items.length] as FormGroup).value;
    this.items.push(obj);
  }

  onDelete(item: string, formControl: FormControl) {
    this.items = this.items.filter(x => x !== item);
    this.fa.removeAt(this.fa.controls.indexOf(formControl));
  }
}

