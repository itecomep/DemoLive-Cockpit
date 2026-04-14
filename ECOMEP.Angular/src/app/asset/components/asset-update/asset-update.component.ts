import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { McvFileComponent } from 'src/app/mcv-file/components/mcv-file/mcv-file.component';
import { McvFileUploadComponent, UploadResult } from 'src/app/mcv-file/components/mcv-file-upload/mcv-file-upload.component';
import { AssetFileComponent } from '../asset-file/asset-file.component';
import { debounceTime, distinctUntilChanged, firstValueFrom, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { ENTER, SEMICOLON } from '@angular/cdk/keycodes';
import { AppConfig } from 'src/app/app.config';
import { Contact } from 'src/app/contact/models/contact';
import { ContactApiService } from 'src/app/contact/services/contact-api.service';
import { BlobUploadInfo } from 'src/app/mcv-file/models/mcv-blob-upload-info.model';
import { McvFileUploadConfig } from 'src/app/mcv-file/models/mcv-file-upload-config.model';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { StatusMasterService } from 'src/app/shared/services/status-master.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AssetAttribute, Asset, AssetAttachment, AssetVendor, AssetLink } from '../../models/asset';
import { AssetAttributeMaster } from '../../models/asset-master';
import { AssetApiService } from '../../services/asset-api.service';
import { AssetAttachmentApiService } from '../../services/asset-attachment-api.service';
import { AssetAttributeApiService } from '../../services/asset-attribute-api.service';
import { AssetAttributeMasterApiService } from '../../services/asset-attribute-master-api.service';
import { AssetLinkApiService } from '../../services/asset-link-api.service';
import { AssetVendorApiService } from '../../services/asset-vendor-api.service';
import { AssetLinkDialogComponent } from '../asset-link-dialog/asset-link-dialog.component';
import { McvActivityListComponent } from "src/app/mcv-activity/components/mcv-activity-list/mcv-activity-list.component";

@Component({
  selector: 'app-asset-update',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTooltipModule,
    MatSelectModule,
    MatInputModule,
    MatChipsModule,
    MatDialogModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    DragDropModule,
    MatCheckboxModule,
    McvFileComponent,
    McvFileUploadComponent,
    AssetFileComponent,
    McvActivityListComponent
],
  templateUrl: './asset-update.component.html',
  styleUrls: ['./asset-update.component.scss']
})
export class AssetUpdateComponent {

  @ViewChild('activity') activityComponent!: McvActivityListComponent;

  dialogData = inject(MAT_DIALOG_DATA);
  config = inject(AppConfig);
  matDialog = inject(MatDialog);

  formBuilder = inject(FormBuilder);
  utilityService = inject(UtilityService);
  assetApiService = inject(AssetApiService);
  contactService = inject(ContactApiService);
  assetLinkService = inject(AssetLinkApiService);
  statusMasterService = inject(StatusMasterService);
  assetVendorService = inject(AssetVendorApiService);
  appSettingService = inject(AppSettingMasterApiService);
  assetAttachmentService = inject(AssetAttachmentApiService);
  assetAttributeService = inject(AssetAttributeApiService);
  assetAttributeMasterApiService = inject(AssetAttributeMasterApiService);

  attributeMasters: AssetAttributeMaster[] = [];
  currentAttr: AssetAttribute[] = [];
  customAttributes: AssetAttribute[] = [];
  selectCategory!: string;
  categoryOptions: string[] = [];
  contactFilter = [
    // { key: 'category', value: 'Vendor' }
  ];
  dialogTitle: string = '';
  form!: FormGroup;
  attributeForm!: FormGroup;
  customAttributeForm!: FormGroup;
  currentEntity: Asset = new Asset();
  blobConfig!: McvFileUploadConfig;
  isNewVendors: any[] = [];
  attValue: any[] = new Array();
  filteredVendorOptions$!: Observable<any[]>;
  singleChoiceOptions: string[] = ['Yes', 'No', 'Maybe'];
  inputOptions: string[] = ['SINGLE-LINE', 'MULTI-LINE', 'DATE', 'NUMBER', 'CURRENCY'];
  updateInputOptions: string[] = ['SINGLE-LINE', 'MULTI-LINE', 'DATE', 'NUMBER', 'CURRENCY', 'SINGLE-CHOICE', 'MULTI-CHOICE'];

  readonly nameOfEntity = this.config.NAME_OF_ENTITY_ASSET;
  readonly separatorKeysCodes: number[] = [ENTER, SEMICOLON];

  get f(): any { return this.form.controls; }
  get fa(): any { return this.attributeForm.controls; }
  get cfa(): any { return this.customAttributeForm.controls; }
  get statusOptions() { return this.assetApiService.assetStatusOptions }
  get isMobileView(): boolean { return this.utilityService.isMobileView; }
  get attributeFA(): FormArray { return this.fa['attributes'] as FormArray; }
  get customAttributeFA(): FormArray { return this.cfa['customAttrs'] as FormArray; }
  get imagesAttachments() { return this.currentEntity.attachments.filter(x => x.typeFlag == this.config.ASSET_ATTACHMENT_TYPEFLAG_IMAGE) || [] }
  get otherAttachments() { return this.currentEntity.attachments.filter(x => x.typeFlag == this.config.ASSET_ATTACHMENT_TYPEFLAG_OTHER) || [] }

  get purchasedVendorlist() { return this.currentEntity.vendors.filter(x => x.title?.toLowerCase() == 'purchased from') }
  get maintenanceVendorlist() { return this.currentEntity.vendors.filter(x => x.title?.toLowerCase() == 'maintenance by') }
  get userVendorlist() { return this.currentEntity.vendors.filter(x => x.title?.toLowerCase() == 'user') }

  constructor(
    private dialog: MatDialogRef<AssetUpdateComponent>,
  )
  {
    if (this.dialogData)
    {
      this.currentEntity = this.dialogData.entity;
      this.currentEntity.attributes = this.currentEntity.attributes.sort((x, y) => x.orderFlag - y.orderFlag);
      this.selectCategory = this.currentEntity.category;
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
      this.dialogTitle = this.dialogData.dialogTitle;
      this.bindForm();
    }
  }

  async ngOnInit()
  {
    if (!this.form)
    {
      this.buildForm();
    }

    await this.getStatusOptions();
    await this.appSettingService.loadPresets();
    const _setting = this.appSettingService.presets
      .find(x => x.presetKey == this.config.PRESET_BLOB_CONTAINER_ATTACHMENTS);

    if (_setting)
      this.blobConfig = new McvFileUploadConfig(
        _setting.presetValue,
        `${this.nameOfEntity}`
      );

    this.assetAttributeMasterApiService.assetAttributeMasterList = await firstValueFrom(this.assetAttributeMasterApiService.get());
    this.attributeMasters = this.assetAttributeMasterApiService.assetAttributeMasterList;
    this.getCustomAttributes();
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
      quantity: new FormControl<number>(0),
      description: new FormControl<any>(null),
      vendor: new FormControl<any>(null),
      category: new FormControl<any>(null, { validators: [Validators.required] }),
      statusFlag: new FormControl<any>(null),
      purchaseDate: new FormControl<Date | null>(null),
      warrantyDate: new FormControl<Date | null>(null),
      validityDate: new FormControl<Date | null>(null),
    });

    this.attributeForm = this.formBuilder.group({
      attributes: this.formBuilder.array([])
    });

    this.customAttributeForm = this.formBuilder.group({
      customAttrs: this.formBuilder.array([])
    });

    this.filteredVendorOptions$ = this.f['vendor'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(name => name ? this.getContactOptions(name as string) : of([])),
    );

    this.f['category'].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe((res: string) =>
    {
      this.selectCategory = res;
      const _attributes = this.assetAttributeMasterApiService.assetAttributeMasterList.filter(x => x.category == this.selectCategory);
      this.currentEntity.attributes = this.currentEntity.attributes.filter(x => x.assetID);
      _attributes.forEach(x =>
      {
        const _newAtt = new AssetAttribute();
        _newAtt.attributeKey = x.attribute;
        _newAtt.inputType = x.inputType;
        _newAtt.inputOptions = x.inputOptions;
        _newAtt.isRequired = x.isRequired;
        this.currentEntity.attributes.push(_newAtt);
        this.getCustomAttributes();
      });
      this.bindForm();
    });
  }

  async bindForm()
  {
   
    this.form.patchValue(this.currentEntity, { emitEvent: false });
    this.attributeFA.clear();
    this.customAttributeFA.clear();
    this.currentAttr.forEach(item =>
    {
      this.addInput(item);
    });
    this.customAttributes.forEach(item =>
    {
      this.addCustomInput(item);
    })

    this.addInput(null);
    this.addCustomInput(null);
  }

  private addCustomInput(value: AssetAttribute | null)
  {
    const formGroup = this.formBuilder.group(
      {
        attributeKey: new FormControl<any>(null, { validators: [Validators.required, Validators.minLength(1), Validators.maxLength(255)] }),
        attributeValue: new FormControl<any>(null),
        inputType: new FormControl<any>(value?.inputType, { validators: [Validators.required, Validators.minLength(1), Validators.maxLength(255)] }),
        isRequired: new FormControl()
      }
    );

    formGroup.controls['attributeKey'].setValue(value ? value?.attributeKey : null);
    formGroup.controls['inputType'].setValue(value ? value?.inputType : null);
    formGroup.controls['isRequired'].setValue(value ? value?.isRequired : false);
    if (value && value.inputType == 'MULTI-CHOICE')
    {
      formGroup.controls['attributeValue'].setValue(value ? value.attributeValue?.split(',') : null);
    }
    else
    {
      formGroup.controls['attributeValue'].setValue(value ? value.attributeValue : null);
    }
    this.customAttributeFA.push(formGroup);
  }

  private addInput(value: AssetAttribute | null)
  {
    const formGroup = this.formBuilder.group(
      {
        attributeKey: new FormControl<any>(null, { validators: [Validators.required, Validators.minLength(1), Validators.maxLength(255)] }),
        attributeValue: new FormControl<any>(null),
        inputType: new FormControl<any>(value?.inputType, { validators: [Validators.required, Validators.minLength(1), Validators.maxLength(255)] }),
        isRequired: new FormControl()
      }
    );

    formGroup.controls['attributeKey'].setValue(value ? value?.attributeKey : null);
    formGroup.controls['inputType'].setValue(value ? value?.inputType : null);
    formGroup.controls['isRequired'].setValue(value ? value?.isRequired : false);
    if (value && value.inputType == 'MULTI-CHOICE')
    {
      formGroup.controls['attributeValue'].setValue(value ? value.attributeValue?.split(',') : null);
    }
    else
    {
      formGroup.controls['attributeValue'].setValue(value ? value.attributeValue : null);
    }
    this.attributeFA.push(formGroup);
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
  uploadQueue: UploadResult[] = [];
  onUpload(uploads: UploadResult[], typeFlag: number)
  {
    uploads.forEach(x =>
    {
      // x.typeFlag = typeFlag;
      this.uploadQueue.push(x);
    });
    this.uploadFiles(typeFlag);
  }

  async uploadFiles(typeFlag:number)
  {
    let _createRequests: any[] = [];
    this.uploadQueue.forEach(x =>
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
      obj.originalUrl = x.url;
      _createRequests.push(this.assetAttachmentService.create(obj));
    });
    this.uploadQueue = [];
    const results = await firstValueFrom(forkJoin(_createRequests));

    results.forEach((result: AssetAttachment) =>
    {
      this.currentEntity.attachments.push(result);
    });
  }

  onDeleteAttachment(item: AssetAttachment)
  {
    this.currentEntity.attachments = this.currentEntity.attachments.filter(x => x.id !== item.id);
    this.assetAttachmentService.delete(item.id).subscribe(value =>
    {
      // this.delete.emit(item);
    });
  }

  onDownloadAttachment(item: any)
  {
    window.open(item.url);
  }
  //Attachments Ends

  //Vendor
  async onDeleteVendor(vendor: AssetVendor)
  {
    await firstValueFrom(this.assetVendorService.delete(vendor.id));
    this.currentEntity.vendors = this.currentEntity.vendors.filter(x => x.id !== vendor.id);
  }

  onVendorSelect(selectEvent: MatAutocompleteSelectedEvent, vendorTitle: string)
  {
    let _contact: any = selectEvent.option.value;
    const _vendor = new AssetVendor();
    _vendor.assetID = this.currentEntity.id;
    _vendor.contactID = _contact.id;
    _vendor.title = vendorTitle;
    _vendor.contact = _contact;
    this.assetVendorService.create(_vendor).subscribe(res =>
    {
      res.contact = _contact;
      this.currentEntity.vendors.unshift(res);
    });
    this.f['vendor'].reset();
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
    this.attributeFA.value.forEach((x: any, i: number) =>
    {
      if (x.inputType == 'MULTI-CHOICE')
      {
        this.currentAttr[i].attributeValue = x.attributeValue.join(',');
      }
    });

    this.customAttributeFA.value.forEach((x: any, i: number) =>
    {
      if (x.inputType == 'MULTI-CHOICE')
      {
        this.customAttributes[i].attributeValue = x.attributeValue.join(',');
      }
    });

    // this.currentEntity.attributes = this.currentAttr;
    // this.customAttributes.forEach(x =>{
    //   this.currentEntity.attributes.push(x);
    // });
    const _response = await firstValueFrom(this.assetApiService.update(this.currentEntity))
   this.currentEntity = Object.assign(this.currentEntity, _response);
   this.dialog.close(this.currentEntity);
   
  }

  onAddAttribute()
  {
    // if (attributeType == 'custom') {
    const obj = new AssetAttribute((this.customAttributeFA.controls[this.customAttributes.length] as FormGroup).value);
    obj.assetID = this.currentEntity.id;
    obj.orderFlag = this.currentEntity.attributes.length + 1;
    obj.isRequired = false;
    obj.inputType = 'SINGLE-LINE';
    this.assetAttributeService.create(obj).subscribe(data =>
    {
      this.currentEntity.attributes.push(data);
      this.customAttributes.push(data);
      this.bindForm();
      this.refreshActivity();
    });
    // } 
    // else {
    //   const obj = new AssetAttribute((this.attributeFA.controls[this.currentAttr.length] as FormGroup).value);
    //   obj.assetID = this.currentEntity.id;
    //   obj.orderFlag = this.currentEntity.attributes.length + 1;
    //   obj.isRequired = false;
    //   this.assetAttributeService.create(obj).subscribe(data => {
    //     this.currentEntity.attributes.push(data);
    //     this.currentAttr.push(data);
    //     this.bindForm();
    //   });
    // }
  }

  async onDeleteAssetAttribute(attribute: AssetAttribute, index: number)
  {
    if (attribute.assetID)
    {
      this.currentAttr = this.currentAttr.filter(x => x.id !== attribute.id);
      this.currentEntity.attributes = this.currentEntity.attributes.filter(x => x.id !== attribute.id);
      await firstValueFrom(this.assetAttributeService.delete(attribute.id));
      this.refreshActivity();
      // this.bindForm();
    } else
    {
      this.currentAttr = this.currentAttr.filter(x => x.uid !== attribute.uid);
      if (index > -1 && index < this.customAttributeFA.length)
      {
        this.customAttributeFA.removeAt(index);
        this.bindForm();
      }
    }
  }

  async onDeletCustomAttribute(attribute: AssetAttribute, index: number)
  {
    this.customAttributes = this.customAttributes.filter(x => x.id !== attribute.id);
    this.currentEntity.attributes = this.currentEntity.attributes.filter(x => x.id !== attribute.id);
    await firstValueFrom(this.assetAttributeService.delete(attribute.id));
    this.bindForm();
    this.refreshActivity();
  }

  onOpenLinkDialog()
  {
    const _dialogConfig = new MatDialogConfig();
    _dialogConfig.disableClose = true;
    _dialogConfig.autoFocus = true;
    _dialogConfig.panelClass = 'mcv-fullscreen-dialog';
    _dialogConfig.data = {
      currentAsset: this.currentEntity
    }

    const _dialogRef = this.matDialog.open(AssetLinkDialogComponent, _dialogConfig);
    _dialogRef.afterClosed().subscribe(res =>
    {
      if (res && res.length > 0)
        {
          this.currentEntity.secondaryAssets.push(...res);
          console.log('res',res,this.currentEntity.secondaryAssets);
      }
    });
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

  async onCellChange(formArray: FormArray, index: number, controlName: string, entity?: AssetAttribute)
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
      if (entity.inputType == 'MULTI-CHOICE')
      {
        let _val: string[] = _control.value;
        entity.attributeValue = _val.join(',');
      }
      //Input Type
      if (controlName == 'attributeValue' && entity.inputType == 'SINGLE-LINE')
      {
        entity.attributeValue = _control.value;
      }
      if (controlName == 'attributeValue' && entity.inputType == 'NUMBER')
      {
        entity.attributeValue = _control.value;
      }
      if (controlName == 'attributeValue' && entity.inputType == 'CURRENCY')
      {
        entity.attributeValue = _control.value;
      }
      if (controlName == 'attributeValue' && entity.inputType == 'MULTI-LINE')
      {
        entity.attributeValue = _control.value;
      }
      if (controlName == 'attributeValue' && entity.inputType == 'DATE')
      {
        entity.attributeValue = _control.value;
      }
      if (controlName == 'attributeValue' && entity.inputType == 'SINGLE-CHOICE')
      {
        entity.attributeValue = _control.value;
      }


      if (controlName == 'attributeKey')
      {
        entity.attributeKey = _control.value
      }
      if (controlName == 'inputType')
      {
        entity.inputType = _control.value;
      }
      if (controlName == 'isRequired')
      {
        entity.isRequired = _control.value;
      }
      if (entity.assetID)
      {
        this.updateEntity(entity);
      } else
      {
        entity.assetID = this.currentEntity.id;
        const _updated = await firstValueFrom(this.assetAttributeService.create(entity));
        entity = Object.assign(entity, _updated);
      }
      this.refreshActivity();
    }
  }

  private async updateEntity(entity: AssetAttribute)
  {
    entity = await firstValueFrom(this.assetAttributeService.update(entity, true));
  }

  async onUnlink(assetLink: AssetLink)
  {
    this.utilityService.showConfirmationDialog('Do you want to unlink this asset?', async () =>
    {
      this.currentEntity.secondaryAssets = this.currentEntity.secondaryAssets.filter(x => x.id !== assetLink.id);
      await firstValueFrom(this.assetLinkService.delete(assetLink.id));
    });
  }

  async onDrop(event: CdkDragDrop<AssetAttribute[]>)
  {
    if (event.previousContainer === event.container)
    {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      if (event.previousIndex != event.currentIndex)
      {
        let _requests: Observable<any>[] = [];
        event.container.data.forEach((x, i) =>
        {
          x.orderFlag = i + 1;
          _requests.push(this.assetAttributeService.update(x, false));
        });
        const _results = await firstValueFrom(forkJoin(_requests));
        
        // Update the arrays and sort by orderFlag
        this.currentEntity.attributes = this.currentEntity.attributes.sort((x, y) => x.orderFlag - y.orderFlag);
        this.getCustomAttributes();
        this.bindForm();
      }
    }
  }

  optionsArray(options: string): string[]
  {
    return options ? options.split(',') : [];
  }

  async getStatusOptions()
  {
    if (!this.assetApiService.assetStatusOptions || this.assetApiService.assetStatusOptions.length == 0)
    {
      const _assetOptions = await firstValueFrom(this.statusMasterService.get([{ key: 'Entity', value: this.config.NAME_OF_ENTITY_ASSET }]));
      this.assetApiService.assetStatusOptions = _assetOptions;
    }
  }

  getCustomAttributes()
  {
    const _attCategory = this.attributeMasters.filter(x => x.category == this.currentEntity.category);
    // console.log(_attCategory);
    const _attr = this.currentEntity.attributes.filter(x => _attCategory.some(y => y.attribute === x.attributeKey));
    // console.log(_attr);
    this.currentAttr = _attr.sort((x, y) => x.orderFlag - y.orderFlag);

    const _custom = this.currentEntity.attributes.filter(x => !_attCategory.some(y => y.attribute === x.attributeKey));
    if (_custom && _custom.length > 0)
    {
      this.customAttributes = _custom.sort((x, y) => x.orderFlag - y.orderFlag);
      // console.log(this.customAttributes);
    }

  }

  private refreshActivity()
  {
    if (this.activityComponent)
    {
      setTimeout(() => this.activityComponent.refresh(), 500);
    }
  }
}
