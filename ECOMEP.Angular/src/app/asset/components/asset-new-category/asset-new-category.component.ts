import { CommonModule } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { AppConfig } from "src/app/app.config";
import { AppSettingMasterApiService } from "src/app/shared/services/app-setting-master-api.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { AssetAttributeMasterApiService } from "../../services/asset-attribute-master-api.service";
import { firstValueFrom } from "rxjs";


@Component({
  selector: 'app-asset-new-category',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './asset-new-category.component.html',
  styleUrls: ['./asset-new-category.component.scss']
})
export class AssetNewCategoryComponent {

   constructor(
      private formBuilder: FormBuilder,
      private dialog: MatDialogRef<AssetNewCategoryComponent>,
      public utilityService: UtilityService,
      private config: AppConfig,
      private appSettingService: AppSettingMasterApiService,
      private assetAttributeMasterApiService: AssetAttributeMasterApiService,
    
      @Inject(MAT_DIALOG_DATA) private dialogData: any
    )
    {
    
    }
 



 
  disableSave: boolean = false;

  form!: FormGroup;
  categoryOptions: string[] = [];

  get f(): any { return this.form.controls }

  ngOnInit()
  {
    // this.appSettingService.loadPresets()
    if (!this.form)
    {
      this.buildForm();
    }

    const _options = this.appSettingService.presets
      .find(x => x.presetKey == this.config.PRESET_ASSET_CATEGORY_OPTIONS)?.presetValue;
    if (_options)
    {
      this.categoryOptions = _options.split(',');
    }
  }

  onClose(e: any)
  {
    this.dialog.close();
  }

  getErrorMessage(control: AbstractControl)
  {
    return this.utilityService.getErrorMessage(control);
  }

  buildForm()
  {
    this.form = this.formBuilder.group({
      category: new FormControl<any>(null, [Validators.required]),
    });

    // this.f['category'].valueChanges.pipe(
    //   debounceTime(400),
    //   distinctUntilChanged()
    // ).subscribe((res: string) => {
    //   this.categoryOptions.forEach(x => {
    //     if (res === x) {
    //       this.disableSave = true;
    //     } else {
    //       this.disableSave = false;
    //     }
    //   });
    // });
  }

  async onSubmit()
  {


  
    if (this.f['category'].value == '')
    {
      this.utilityService.showSwalToast('Incomplete Date', 'Please fill category and attribute correctly', 'error');
      return;
    } else
    {
      const _options = this.appSettingService.presets
      .find(x => x.presetKey == this.config.PRESET_ASSET_CATEGORY_OPTIONS);
      if (_options)
        {
          console.log('>>>>>>>>',);
          const _presetValue = _options.presetValue ? _options.presetValue.split(',') : [];
        _presetValue.push(this.f['category'].value);
        const updatedString = _presetValue.join(',');
        _options.presetValue = updatedString;
        const result = await firstValueFrom(this.appSettingService.update(_options));
        this.dialog.close(result);
      }
    }
  }

  onInput(controlName: string)
  {
    const _control = this.form.get(controlName);
    if (_control && _control.value && typeof _control.value == 'string')
    {
      _control.setValue(_control.value.toUpperCase());
      const _exist = this.categoryOptions.find(x => x == _control.value);
      if (_exist)
      {
        this.disableSave = true;
        this.utilityService.showSwalToast('Category Exist', `${_control.value} already exist`, 'error');
      } else
      {
        this.disableSave = false;
      }
    }
  }
}
