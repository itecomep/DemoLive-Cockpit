import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { firstValueFrom, forkJoin, Observable } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AssetAttributeMaster } from '../../models/asset-master';
import { AssetAttributeMasterApiService } from '../../services/asset-attribute-master-api.service';
import { AssetNewCategoryComponent } from '../asset-new-category/asset-new-category.component';

@Component({
  selector: 'app-asset-category-master',
  standalone: true,
  imports: [
     CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    DragDropModule
  ],
  templateUrl: './asset-category-master.component.html',
  styleUrls: ['./asset-category-master.component.scss']
})
export class AssetCategoryMasterComponent
{

  dialog = inject(MatDialogRef<AssetCategoryMasterComponent>);
  dialogData = inject(MAT_DIALOG_DATA);
  matDialog = inject(MatDialog);
  config = inject(AppConfig);
  formBuilder = inject(FormBuilder);
  utilityService = inject(UtilityService);
  appSettingService = inject(AppSettingMasterApiService);
  assetAttributeMasterApiService = inject(AssetAttributeMasterApiService);

  form!: FormGroup;
  categoryForm!: FormGroup;
  currentCategory = new FormControl<any>(null, { validators: [Validators.required] });
  selectedTabIndex = 0;
  showNew: boolean = false;
  selectedCategory!: string;
  categoryOptions: string[] = [];
  masterAttributes: AssetAttributeMaster[] = [];

  get f(): any { return this.form.controls };
  get nf(): any { return this.categoryForm.controls };
  get fa(): FormArray { return this.f['items'] as FormArray; }
  get signleInputOptions() { return this.config.ASSET_INPUTTYPE_OPTIONS }
  get isMobileView(): boolean { return this.utilityService.isMobileView; }

  async ngOnInit()
  {
    this.buildForm();
    await this.getCategoryOptions();
    this.bindForm();
  }

  async getCategoryOptions()
  {
    await this.getAttributeMaster();
  }

  onClose(e: any)
  {
    this.dialog.close();
  }

  async getAttributeMaster()
  {
    const _options = this.appSettingService.presets
      .find(x => x.presetKey == this.config.PRESET_ASSET_CATEGORY_OPTIONS)?.presetValue;
    if (_options)
    {
      this.categoryOptions = _options.split(',');
    }
    this.masterAttributes = await firstValueFrom(this.assetAttributeMasterApiService.get());
    this.masterAttributes.sort((a, b) => a.orderFlag - b.orderFlag);
    this.selectedCategory = this.categoryOptions[0];
    this.currentCategory.setValue(this.selectedCategory, { emitEvent: false });
  }

  getErrorMessage(control: AbstractControl)
  {
    return this.utilityService.getErrorMessage(control);
  }

  buildForm()
  {
    this.form = this.formBuilder.group({
      items: this.formBuilder.array([]),
    });

    this.categoryForm = this.formBuilder.group({
      category: new FormControl<any>(null, { validators: [Validators.required] }),
      attribute: new FormControl<any>(null, { validators: [Validators.required] }),
      inputOptions: new FormControl<any>(null),
      isRequired: new FormControl<boolean>(false),
    })
    this.touchForm();
  }

  private bindForm()
  {
    this.fa.clear();
    this.masterAttributes.forEach(item =>
    {
      this.addInput(item);
    });
    this.addInput(null);
  }

  private addInput(value: AssetAttributeMaster | null)
  {
    const formGroup = this.formBuilder.group(
      {
        attribute: new FormControl<any>(null, { validators: [Validators.required, Validators.minLength(1), Validators.maxLength(255)] }),
        inputType: new FormControl('SINGLE-LINE', { validators: [Validators.minLength(1), Validators.maxLength(255)] }),
        inputOptions: new FormControl<any>(null),
        isRequired: new FormControl<boolean>(false),
      }
    );

    if (value)
    {
      formGroup.patchValue(value, { emitEvent: false });
    }
    this.fa.push(formGroup);
  }

  onSelectedTabIndexChange(event: any)
  {
    const _category = this.categoryOptions[event];
    this.selectedCategory = _category;
    this.currentCategory.setValue(this.selectedCategory, { emitEvent: false });
  }

  getFormControl(formArray: FormArray, index: number, controlName: string): FormControl
  {
    const _cellFormGroup = <FormGroup>formArray.controls[index];
    if (_cellFormGroup)
    {
      return <FormControl>_cellFormGroup.controls[controlName];
    }
    return new FormControl();
  }

  onInput(formArray: FormArray, index: number, controlName: string)
  {
    const _control = <FormControl>this.getFormControl(formArray, index, controlName);
    if (_control && _control.value && typeof _control.value == 'string')
    {
      _control.setValue(_control.value.toUpperCase());
    }
  }

  onCellChange(formArray: FormArray, index: number, controlName: string, entity?: AssetAttributeMaster)
  {
    const _control = <FormControl>this.getFormControl(formArray, index, controlName);
    if (_control && _control.invalid)
    {
      this.utilityService.showSwalToast('Invalid input',
        this.utilityService.getErrorMessage(_control), 'error'
      );
      return;
    }
    if (entity)
    {
      if (controlName == 'attribute')
      {
        entity.attribute = _control.value;
      } else if (controlName == 'inputType')
      {
        entity.inputType = _control.value;
      } else if (controlName == 'inputOptions')
      {
        entity.inputOptions = _control.value;
      } else if (controlName == 'isRequired')
      {
        entity.isRequired = _control.value;
      }
      this.updateEntity(entity);
    }
  }

  private async updateEntity(entity: AssetAttributeMaster)
  {
    entity = await firstValueFrom(this.assetAttributeMasterApiService.update(entity, true));
  }

  protected touchForm()
  {
    if (this.form)
    {
      Object.keys(this.form.controls).forEach(field =>
      {
        const control = this.form.get(field);
        if (control)
          control.markAsTouched({ onlySelf: true });
      });
    }
  }

  onDelete(item: AssetAttributeMaster)
  {
    this.assetAttributeMasterApiService.delete(item.id).subscribe(data =>
    {
      this.masterAttributes = this.masterAttributes.filter(x => x.id !== item.id);
      this.bindForm();
    });
  }

  onSubmit()
  {
    if (this.form.invalid)
    {
      this.utilityService.showSweetDialog('Invalid Form',
        'Please fill all required fields with valid data and try again.', 'error'
      );
      this.touchForm();
      return;
    }

    const formValue = (this.fa.controls[this.masterAttributes.length] as FormGroup).value;
    const obj = new AssetAttributeMaster(formValue);
    obj.category = this.selectedCategory;
    obj.isRequired = formValue.isRequired === true;
    this.assetAttributeMasterApiService.create(obj).subscribe(data =>
    {
      this.masterAttributes.push(data);
      this.bindForm();
    });
  }

  onAddCategory()
  {
    const dialogRef = this.matDialog.open(AssetNewCategoryComponent);
    dialogRef.afterClosed().subscribe(async res =>
    {
      if (res)
      {
        await this.getCategoryOptions();
        const newCategoryIndex = this.categoryOptions.findIndex(cat => cat === res);
        if (newCategoryIndex !== -1) {
          this.onSelectedTabIndexChange(newCategoryIndex);
        }
      }
    });
  }

  async onUpdateCategory()
  {
    if (!this.categoryForm.value || this.categoryForm.value == '')
    {
      this.utilityService.showSwalToast('Incompleted Date', 'Please fill data', 'error');
      return;
    } else
    {
      const _options = this.appSettingService.presets
        .find(x => x.presetKey == this.config.PRESET_ASSET_CATEGORY_OPTIONS);
      if (_options?.presetValue)
      {
        const categories = _options.presetValue.split(',');
        for (let i = 0; i < categories.length; i++)
        {
          if (categories[i].trim() === this.selectedCategory)
          {
            if (this.currentCategory.value)
            {
              categories[i] = this.currentCategory.value;
            }
            break;
          }
        }

        let updatedString = categories.join(",");
        _options.presetValue = updatedString;
        await firstValueFrom(this.appSettingService.update(_options));
        const _updateForAttributes = this.masterAttributes.filter(x => x.category == this.selectedCategory);
        let _request: any[] = [];
        if (_updateForAttributes)
        {
          _updateForAttributes.forEach(y =>
          {
            if (this.currentCategory.value)
            {
              y.category = this.currentCategory.value;
              _request.push(this.assetAttributeMasterApiService.update(y));
            }
          });

          const result = await firstValueFrom(forkJoin(_request));
          if (result)
          {
            this.appSettingService.loadPresets();
            this.getCategoryOptions();
            this.buildForm();
            this.bindForm();
            this.dialog.close({ categoryUpdated: true });
          }
        }
      }
    }
  }

  async onDeleteCategory()
  {
    this.utilityService.showConfirmationDialog(`Do you want to delete ${this.selectedCategory} category?`, async () =>
    {
      const _options = this.appSettingService.presets
        .find(x => x.presetKey == this.config.PRESET_ASSET_CATEGORY_OPTIONS);
      if (_options?.presetValue)
      {
        const categories = _options.presetValue.split(',');
        const _updatedString = categories.filter(x => x !== this.selectedCategory);
        let updatedString = _updatedString.join(",");
        _options.presetValue = updatedString;
        await firstValueFrom(this.appSettingService.update(_options));

        const _deleteAttributes = this.masterAttributes.filter(x => x.category == this.selectedCategory);
        _deleteAttributes.forEach(x =>
        {
          firstValueFrom(this.assetAttributeMasterApiService.delete(x.id));
        });
        this.appSettingService.loadPresets();
        this.getCategoryOptions();
        this.buildForm();
        this.bindForm();
      }
    });
  }

  async onDrop(event: CdkDragDrop<AssetAttributeMaster[]>)
  {
    if (event.previousContainer === event.container && event.previousIndex !== event.currentIndex)
    {
      // Get only current category items
      const categoryItems = this.masterAttributes.filter(x => x.category === this.selectedCategory);
      
      // Move item in category array
      moveItemInArray(categoryItems, event.previousIndex, event.currentIndex);
      
      // Update orderFlag for category items only
      categoryItems.forEach((item, index) => {
        item.orderFlag = index + 1;
      });
      
      // Update only the moved category items
      let _requests: Observable<any>[] = [];
      categoryItems.forEach((x) =>
      {
        _requests.push(this.assetAttributeMasterApiService.update(x, false));
      });
      
      const updatedAttributes = await firstValueFrom(forkJoin(_requests));
      
      // Update masterAttributes with the updated category items
      updatedAttributes.forEach(updated => {
        const index = this.masterAttributes.findIndex(x => x.id === updated.id);
        if (index !== -1) {
          this.masterAttributes[index] = updated;
        }
      });
      
      // Sort masterAttributes to reflect new order
      this.masterAttributes.sort((a, b) => {
        if (a.category === b.category) {
          return a.orderFlag - b.orderFlag;
        }
        return a.category.localeCompare(b.category);
      });
      
      this.bindForm();
    }
  }
}