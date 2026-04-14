import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { McvFileUploadComponent, UploadResult } from 'src/app/mcv-file/components/mcv-file-upload/mcv-file-upload.component';
import { McvFileComponent } from 'src/app/mcv-file/components/mcv-file/mcv-file.component';
import { AssetFileComponent } from '../asset-file/asset-file.component';
import { debounceTime, distinctUntilChanged, firstValueFrom, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { Asset, AssetAttachment, AssetAttribute, AssetVendor } from '../../models/asset';
import { ENTER, SEMICOLON } from '@angular/cdk/keycodes';
import { AppConfig } from 'src/app/app.config';
import { Contact } from 'src/app/contact/models/contact';
import { ContactApiService } from 'src/app/contact/services/contact-api.service';
import { BlobUploadInfo } from 'src/app/mcv-file/models/mcv-blob-upload-info.model';
import { McvFileUploadConfig } from 'src/app/mcv-file/models/mcv-file-upload-config.model';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { StatusMasterService } from 'src/app/shared/services/status-master.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AssetAttributeMaster } from '../../models/asset-master';
import { AssetApiService } from '../../services/asset-api.service';
import { AssetAttachmentApiService } from '../../services/asset-attachment-api.service';
import { AssetAttributeApiService } from '../../services/asset-attribute-api.service';
import { AssetAttributeMasterApiService } from '../../services/asset-attribute-master-api.service';
import { AssetVendorApiService } from '../../services/asset-vendor-api.service';

@Component({
  selector: 'app-asset-create',
  standalone: true,
  imports: [
     CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatTooltipModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatCheckboxModule,
    McvFileComponent,
    McvFileUploadComponent,
    AssetFileComponent
  ],
  templateUrl: './asset-create.component.html',
  styleUrls: ['./asset-create.component.scss']
})
export class AssetCreateComponent {

  
  attributeMasters: AssetAttributeMaster[] = [];
  selectCategory!: string;
  categoryOptions: string[] = [];
  contactFilter = [
    // { key: 'category', value: 'Vendor' }
  ];
  dialogTitle: string = '';
  form!: FormGroup;
  attributeForm!: FormGroup;
  currentEntity: Asset = new Asset();
  blobConfig!: McvFileUploadConfig;
  isNewVendors: any[] = [];
  attValue: any[][] = [];
  customAttValue: any[] = new Array();
  filteredVendorOptions$!: Observable<any[]>;
  nextCode!: string;
  codeFlag: number = 0;
  attributes: AssetAttribute[] = [];
  inputOptions: string[] = ['SINGLE-LINE', 'MULTI-LINE', 'DATE', 'NUMBER', 'CURRENCY'];
  updateInputOptions: string[] = ['SINGLE-LINE', 'MULTI-LINE', 'DATE', 'NUMBER', 'CURRENCY', 'SINGLE-CHOICE', 'MULTI-CHOICE'];

  readonly nameOfEntity = this.config.NAME_OF_ENTITY_ASSET;
  readonly separatorKeysCodes: number[] = [ENTER, SEMICOLON];

  get f(): any { return this.form.controls; }
  get fa(): any { return this.attributeForm.controls; }
  get isMobileView(): boolean { return this.utilityService.isMobileView; }
  get statusOptions() { return this.assetApiService.assetStatusOptions }
  get attributeFA(): FormArray { return this.fa['attributes'] as FormArray; }
  get imagesAttachments() { return this.currentEntity.attachments.filter(x => x.typeFlag == this.config.ASSET_ATTACHMENT_TYPEFLAG_IMAGE) || [] }
  get otherAttachments() { return this.currentEntity.attachments.filter(x => x.typeFlag == this.config.ASSET_ATTACHMENT_TYPEFLAG_OTHER) || [] }
  get purchasedVendorlist() { return this.isNewVendors.filter(x => x.title?.toLowerCase() == 'purchased from') }
  get maintenanceVendorlist() { return this.isNewVendors.filter(x => x.title?.toLowerCase() == 'maintenance by') }
  get userVendorlist() { return this.isNewVendors.filter(x => x.title?.toLowerCase() == 'user') }

  constructor(
    @Inject(MAT_DIALOG_DATA) private dialogData: any,
    private config: AppConfig,
    private formBuilder: FormBuilder,
    private utilityService: UtilityService,
    private assetApiService: AssetApiService,
    private contactService: ContactApiService,
    private statusMasterService: StatusMasterService,
    private assetVendorService: AssetVendorApiService,
    private appSettingService: AppSettingMasterApiService,
    private assetAttributeService: AssetAttributeApiService,
    private assetAttachmentService: AssetAttachmentApiService,
    private assetAttributeMasterService: AssetAttributeMasterApiService,
    private dialog: MatDialogRef<AssetCreateComponent>,
  )
  {
    if (this.dialogData)
    {
      this.appSettingService.loadPresets();
      this.assetAttributeMasterService.get().subscribe(res =>
      {
        if (res)
        {
          this.assetAttributeMasterService.assetAttributeMasterList = res;
        }
      })
      this.refresh();
    }
  }

  bindForm()
  {
    this.f['statusFlag'].setValue(this.config.ASSET_STATUS_FLAG_INUSE);
    this.attributeFA.clear();
    this.attributes.forEach(item =>
    {
      this.addInput(item);
    });
    this.addInput(null);
  }

  async refresh()
  {
      if (!this.form)
      {
        this.buildForm();
      }
      this.getNextCode();
      this.dialogTitle = this.dialogData.dialogTitle;
      const _options = this.appSettingService.presets
        .find(x => x.presetKey == this.config.PRESET_ASSET_CATEGORY_OPTIONS)?.presetValue;
      if (_options)
      {
        this.categoryOptions = _options.split(',');
      }
      this.selectCategory = this.categoryOptions[0];
      this.f['category'].setValue(this.categoryOptions[0], { eventEmit: false });
      const _attributes = this.assetAttributeMasterService.assetAttributeMasterList.filter(x => x.category == this.selectCategory);
      _attributes.forEach(x =>
      {
        const _newAtt = new AssetAttribute();
        _newAtt.attributeKey = x.attribute;
        _newAtt.inputType = x.inputType;
        _newAtt.inputOptions = x.inputOptions;
        _newAtt.isRequired = x.isRequired;
        this.attributes.push(_newAtt);
      });

    await this.getStatusOptions();
    await this.appSettingService.loadPresets();
    const _setting = this.appSettingService.presets
      .find(x => x.presetKey == this.config.PRESET_BLOB_CONTAINER_ATTACHMENTS);

    if (_setting)
      this.blobConfig = new McvFileUploadConfig(
        _setting.presetValue,
        `${this.nameOfEntity}`
      );

      this.bindForm();
  }

  getErrorMessage(control: AbstractControl)
  {
    return this.utilityService.getErrorMessage(control);
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

  buildForm()
  {
    this.form = this.formBuilder.group({
      title: new FormControl<any>(null, { validators: [Validators.required] }),
      subtitle: new FormControl<any>(null),
      cost: new FormControl<number>(0),
      quantity: new FormControl<number>(1),
      description: new FormControl<any>(null),
      vendor: new FormControl<any>(null),
      category: new FormControl<any>(null, { validators: [Validators.required] }),
      statusFlag: new FormControl<any>(null),
      purchaseDate: new FormControl<Date | null>(null),
      warrantyDate: new FormControl<Date | null>(null),
      validityDate: new FormControl<Date | null>(null),
    });

    this.attributeForm = this.formBuilder.group({
      attributes: this.formBuilder.array([]),
    });

    this.f['category'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe((res: string) =>
    {
      this.selectCategory = res;
      const _attributes = this.assetAttributeMasterService.assetAttributeMasterList.filter(x => x.category == this.selectCategory);
      this.attributes = [];
      _attributes.forEach(x =>
      {
        const _newAtt = new AssetAttribute();
        _newAtt.attributeKey = x.attribute;
        _newAtt.inputType = x.inputType;
        _newAtt.inputOptions = x.inputOptions;
        _newAtt.isRequired = x.isRequired;
        this.attributes.push(_newAtt);
      });
      this.bindForm();
    });

    this.filteredVendorOptions$ = this.f['vendor'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(name => name ? this.getContactOptions(name as string) : of([])),
    );
  }

  private getContactOptions(search: string): Observable<Contact[]>
  {
    return this.contactService.getPages(0, 20, this.contactFilter, search, 'name')
      .pipe(map(data => data ? data.list : []));
  }

  displayFnContact(option?: Contact): string
  {
    return option ? option.name : '';
  }

  onClose(e: any)
  {
    this.dialog.close();
  }

  //Attachments
  uploadQueue: { upload: UploadResult, typeFlag: number }[] = [];
  onUpload(uploads: UploadResult[], typeFlag: number)
  {
    //Creating a dummy object
    uploads.forEach(x =>
    {
   
      let obj = new AssetAttachment();
      obj.filename = x.filename;
      obj.size = x.size;
      obj.contentType = x.contentType;
      obj.guidname = x.blobPath;
      obj.blobPath = x.blobPath;
      obj.assetID = this.currentEntity.id;
      obj.container = this.blobConfig.container;
      obj.typeFlag = typeFlag;
      obj.url = x.url;
      this.currentEntity.attachments.push(obj);
      this.uploadQueue.push({ upload: x, typeFlag: typeFlag });
    });
  }

  async uploadFiles()
  {
    let _createRequests: any[] = [];
    this.uploadQueue.forEach(item =>
    {
      let obj = new AssetAttachment();
      obj.filename = item.upload.filename;
      obj.size = item.upload.size;
      obj.contentType = item.upload.contentType;
      obj.guidname = item.upload.blobPath;
      obj.blobPath = item.upload.blobPath;
      obj.assetID = this.currentEntity.id;
      obj.container = this.blobConfig.container;
      obj.typeFlag = item.typeFlag;
      obj.url = item.upload.url;
      obj.originalUrl = item.upload.url;
      _createRequests.push(this.assetAttachmentService.create(obj));
    });
    this.uploadQueue = [];

    // this.currentEntity.attachments = await firstValueFrom(forkJoin(_createRequests));
    forkJoin(_createRequests).subscribe(results =>
    {
      results.forEach(x =>
      {
        this.currentEntity.attachments.push(x as AssetAttachment);
      })
    });
  }

  onDeleteAttachment(item: AssetAttachment)
  {
    this.currentEntity.attachments = this.currentEntity.attachments.filter(x => x.url !== item.url);
  }

  onDownloadAttachment(item: any)
  {
    window.open(item.url);
  }
  //Attachments Ends

  //Vendor
  onDeletePurchasedVendor(vendor: AssetVendor)
  {
    this.isNewVendors = this.isNewVendors.filter(x => !(x.uid === vendor.uid && x.title === 'Purchased From'));
  }

  onDeleteMaintenanceVendor(vendor: AssetVendor)
  {
    this.isNewVendors = this.isNewVendors.filter(x => !(x.uid === vendor.uid && x.title === 'Maintenance By'));
  }

  onDeleteUserVendor(vendor: AssetVendor)
  {
    this.isNewVendors = this.isNewVendors.filter(x => !(x.uid === vendor.uid && x.title === 'User'));
  }

  onVendorSelect(selectEvent: MatAutocompleteSelectedEvent, vendorTitle: string)
  {
    let _contact: any = selectEvent.option.value;
    _contact.title = vendorTitle;
    this.isNewVendors.unshift(_contact);
    this.f['vendor'].reset();
  }

  async onAddNewVendors()
  {
    let _createRequests: any[] = [];
    this.isNewVendors.forEach(x =>
    {
      const _vendor = new AssetVendor();
      _vendor.assetID = this.currentEntity.id;
      _vendor.contactID = x.id;
      _vendor.title = x.title;
      _createRequests.push(this.assetVendorService.create(_vendor));
    });
    this.isNewVendors = [];

    this.currentEntity.vendors = await firstValueFrom(forkJoin(_createRequests));
  }
  //Vendors End

  async onSubmit()
  {
    if (this.form.invalid)
    {
      this.touchForm();
      this.utilityService.showSweetDialog('Invalid Form',
        'Please fill all required fields with valid data and try again.', 'error'
      );
      return;
    }
    this.currentEntity = Object.assign(this.currentEntity, this.form.getRawValue());
    this.currentEntity.code = this.nextCode;
    this.currentEntity.attributes = [];
    this.currentEntity = await firstValueFrom(this.assetApiService.create(this.currentEntity));
    await this.createAttributes();
    this.uploadFiles();
    this.onAddNewVendors();
    this.dialog.close();
  }

  private async getNextCode()
  {
    const _nextCode = await firstValueFrom(this.assetApiService.getNextCode(this.currentEntity.typeFlag));
    this.nextCode = _nextCode.code;
    this.codeFlag = _nextCode.codeFlag;
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

  onAddAttribute()
  {
    const formGroup = this.formBuilder.group(
      {
        attributeKey: new FormControl<any>(null, { validators: [Validators.required, Validators.minLength(1), Validators.maxLength(255)] }),
        attributeValue: new FormControl<any>(null, { validators: [Validators.required, Validators.minLength(1), Validators.maxLength(255)] }),
        inputType: new FormControl<any>('SINGLE-LINE', { validators: [Validators.required, Validators.minLength(1), Validators.maxLength(255)] }),
        isRequired: new FormControl()
      }
    );
    this.attributeFA.push(formGroup);
    const obj = new AssetAttribute((this.attributeFA.controls[this.attributes.length] as FormGroup).value);
    obj.isRequired = false;
    obj.inputType = 'SINGLE-LINE';
    console.log(obj);
    this.attributes.push(obj);
  }

  onCellChange(formArray: FormArray, index: number, controlName: string, entity?: AssetAttribute)
  {
    const _control = <FormControl>this.getFormControl(formArray, index, controlName);
    if (_control && _control.invalid)
    {
      this.utilityService.showSwalToast('Invalid input',
        this.utilityService.getErrorMessage(_control), 'error'
      );
      return;
    }
    console.log(entity);
    if (entity)
    {
      if (controlName == 'attributeKey')
      {
        entity.attributeKey = _control.value;
      } else if (controlName == 'attributeValue')
      {
        entity.attributeValue = _control.value;
      } else if (controlName == 'inputType')
      {
        entity.inputType = _control.value;
      } else if (controlName == 'isRequired')
      {
        entity.isRequired = _control.value;
      }
    }
  }

  private addInput(value: AssetAttribute | null)
  {
    const formGroup = this.formBuilder.group(
      {
        attributeKey: new FormControl<any>(null, { validators: [Validators.required, Validators.minLength(1), Validators.maxLength(255)] }),
        attributeValue: new FormControl<any>(null, { validators: [Validators.required, Validators.minLength(1), Validators.maxLength(255)] }),
        inputType: new FormControl(value?.inputType, { validators: [Validators.required, Validators.minLength(1), Validators.maxLength(255)] }),
        isRequired: new FormControl()
      }
    );

    if (value)
    {
      formGroup.patchValue(value, { emitEvent: false });
    }
    this.attributeFA.push(formGroup);
  }

  async onDeleteAssetAttribute(attribute: AssetAttribute)
  {
    this.attributes = this.attributes.filter(x => x.id !== attribute.id);
    // await firstValueFrom(this.assetAttributeService.delete(attribute.id));
    // this.bindForm();
  }

  async createAttributes()
  {
    this.attributeFA.value.forEach((x: any, i: number) =>
    {
      if (x.inputType == 'MULTI-CHOICE')
      {
        this.attributes[i].attributeValue = x.attributeValue.join(',');
      }
    });
    
    let _req: any[] = [];
    this.attributes.forEach(x =>
    {
      x.assetID = this.currentEntity.id;
      _req.push(this.assetAttributeService.create(x));
    });
    if (_req.length > 0) {
      await firstValueFrom(forkJoin(_req));
    }
  }

  multiChoiceOptions(attribute: AssetAttribute)
  {
    if (attribute.inputOptions)
    {
      const _attr = attribute.inputOptions.split(',');
      return _attr;
    } else
    {
      return [];
    }
  }

  async getStatusOptions()
  {
    if (!this.assetApiService.assetStatusOptions || this.assetApiService.assetStatusOptions.length == 0)
    {
      const _assetOptions = await firstValueFrom(this.statusMasterService.get([{ key: 'Entity', value: this.config.NAME_OF_ENTITY_ASSET }]));
      this.assetApiService.assetStatusOptions = _assetOptions;
    }
  }
}
