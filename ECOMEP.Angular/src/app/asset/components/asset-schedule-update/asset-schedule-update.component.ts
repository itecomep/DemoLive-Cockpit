import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { McvFileUploadComponent, UploadResult } from 'src/app/mcv-file/components/mcv-file-upload/mcv-file-upload.component';
import { McvFileComponent } from 'src/app/mcv-file/components/mcv-file/mcv-file.component';
import { firstValueFrom, forkJoin, Observable } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { AppPermissions } from 'src/app/app.permissions';
import { AuthService } from 'src/app/auth/services/auth.service';
import { BlobUploadInfo } from 'src/app/mcv-file/models/mcv-blob-upload-info.model';
import { McvFileUploadConfig } from 'src/app/mcv-file/models/mcv-file-upload-config.model';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Asset, AssetSchedule, AssetScheduleComponentModel, AssetScheduleAttachment } from '../../models/asset';
import { AssetApiService } from '../../services/asset-api.service';
import { AssetScheduleApiService } from '../../services/asset-schedule-api.service';
import { AssetScheduleAttachmentApiService } from '../../services/asset-schedule-attachment-api.service';
import { AssetScheduleComponentApiService } from '../../services/asset-schedule-component-api.service';

@Component({
  selector: 'app-asset-schedule-update',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatAutocompleteModule,

    //Components
    McvFileComponent,
    McvFileUploadComponent
  ],
  templateUrl: './asset-schedule-update.component.html',
  styleUrls: ['./asset-schedule-update.component.scss']
})
export class AssetScheduleUpdateComponent {

  form!: FormGroup;
  asset!: Asset;
  componentForm!: FormGroup;
  calculatedCostTotal: number = 0;
  categoryOptions: any[] = [];
  titleOptions$!: Observable<any[]>;
  blobConfig!: McvFileUploadConfig;
  statusOptions: any[] = [
    { title: 'PENDING', value: this.config.ASSET_SCHEDULE_ISSUE_PENDING },
    { title: 'APPROVED', value: this.config.ASSET_SCHEDULE_ISSUE_APPROVED },
    { title: 'VERIFIED', value: this.config.ASSET_SCHEDULE_ISSUE_VERIFIED }
  ];
  schedule: AssetSchedule = new AssetSchedule();
  customAttributes: AssetScheduleComponentModel[] = [];

  get f(): any { return this.form.controls }
  get fa(): any { return this.componentForm.controls }
  get compoFA(): FormArray { return this.fa['compo'] as FormArray; }
  get isMobileView() { return this.utilityService.isMobileView }

  // get isPermissionComputerIssue() {
  //   return this.authService.isInAnyRole([
  //     this.permissions.ROLE_MAINTENANCE_EXECUTIVE,
      
  //     this.permissions.ROLE_HR_EXECUTIVE
  //   ])
  // }

  readonly nameOfEntity = this.config.NAME_OF_ENTITY_ASSET_SCHEDULE;
  readonly ISSUE_TYPEFLAG = this.config.ASSET_SCHEDULE_ISSUE_TYPEFLAG;
  readonly ASSET_SCHEDULE_ISSUE_PENDING = this.config.ASSET_SCHEDULE_ISSUE_PENDING;
  readonly ASSET_SCHEDULE_ISSUE_APPROVED = this.config.ASSET_SCHEDULE_ISSUE_APPROVED;
  readonly ASSET_SCHEDULE_ISSUE_VERIFIED = this.config.ASSET_SCHEDULE_ISSUE_VERIFIED;

  constructor(
    private config: AppConfig,
    @Inject(MAT_DIALOG_DATA) data: any,
    private formBuilder: FormBuilder,
    private utilityService: UtilityService,
    private assetApiService: AssetApiService,
    private permissions: AppPermissions,
    private authService: AuthService,
    private appSettingService: AppSettingMasterApiService,
    private assetScheduleService: AssetScheduleApiService,
    private dialog: MatDialogRef<AssetScheduleUpdateComponent>,
    private assetScheduleComponentApi: AssetScheduleComponentApiService,
    private assetScheduleAttachmentService: AssetScheduleAttachmentApiService,
  ) {
    if (data) {
      this.asset = data.data.asset;
      this.schedule = data.data.issue;
      this.schedule.components = this.schedule.components.filter(x => !x.isDeleted);
      console.log('this.schedules>>',this.schedule);
      if (!this.form) {
        this.buildForm();
      }

      this.bindForm();
    }
  }

  async ngOnInit() {
    if (!this.form) {
      this.buildForm();
    }

    await this.appSettingService.loadPresets();
    const _setting = this.appSettingService.presets
      .find(x => x.presetKey == this.config.PRESET_BLOB_CONTAINER_ATTACHMENTS);

    if (_setting)
      this.blobConfig = new McvFileUploadConfig(
        _setting.presetValue,
        `${this.nameOfEntity}`
      );
  }

  buildForm() {
    this.form = this.formBuilder.group({
      resolutionMessage: new FormControl(null),
      nextScheduleDate: new FormControl(null),
    });

    this.componentForm = this.formBuilder.group({
      compo: this.formBuilder.array([])
    });

    if (this.schedule.statusFlag == this.ASSET_SCHEDULE_ISSUE_VERIFIED) {
      this.form.disable();
    }
    this.costTotal();
  }

  addInput(value: AssetScheduleComponentModel | null) {
    console.log('addInput called with value:', value);
    const formGroup = this.formBuilder.group({
      component: new FormControl<string | null>(null),
      warrantyDate: new FormControl<Date | null>(null),
      cost: new FormControl<number | null>(null),
    });

    if (value) {
      console.log('Patching form with:', {
        component: value.component || null,
        warrantyDate: value.warrantyDate || null,
        cost: value.cost || null
      });
      formGroup.patchValue({
        component: value.component || null,
        warrantyDate: value.warrantyDate || null,
        cost: value.cost || null
      }, { emitEvent: false });
    }

    this.compoFA.push(formGroup);
  }

  bindForm() {
    this.form.patchValue(this.schedule);
    this.compoFA.clear();
    this.schedule.components.forEach(item => {
      if (item && item.component !== undefined) {
        this.addInput(item);
      }
    });
    this.addInput(null);
  }

  onCellChange(formArray: FormArray, index: number, controlName: string, entity?: AssetScheduleComponentModel) {
    const _control = <FormControl>this.getFormControl(formArray, index, controlName);
    if (_control && _control.invalid) {
      this.utilityService.showSwalToast('Invalid input',
        this.utilityService.getErrorMessage(_control), 'error'
      );
      return;
    }
    if (entity) {
      entity = Object.assign(entity, this.compoFA.controls[index].value);
      if (entity)
        this.updateEntity(entity);
    }
  }

  async updateEntity(entity: AssetScheduleComponentModel) {
    entity = await firstValueFrom(this.assetScheduleComponentApi.update(entity, true));
    this.costTotal();
  }

  getErrorMessage(control: AbstractControl) {
    return this.utilityService.getErrorMessage(control);
  }

  displayFnAsset(option?: Asset): string {
    return option ? `${option.code} - ${option.title}` : '';
  }

  uploadQueue: UploadResult[] = [];
  onUpload(uploads: UploadResult[]) {
    uploads.forEach(x => {
      this.uploadQueue.push(x);
    });
    this.uploadFiles();
  }

  async uploadFiles() {
    let _createRequests: any[] = [];
    this.uploadQueue.forEach(x => {
      let obj = new AssetScheduleAttachment();
      obj.filename = x.filename;
      obj.size = x.size;
      obj.contentType = x.contentType;
      obj.guidname = x.blobPath;
      obj.blobPath = x.blobPath;
      obj.assetScheduleID = this.schedule.id;
      obj.container = this.blobConfig.container;
      // obj.typeFlag = x.typeFlag;
      obj.url = x.url;
      obj.originalUrl = x.url;
      _createRequests.push(this.assetScheduleAttachmentService.create(obj));
    });
    this.uploadQueue = [];

    // this.currentEntity.attachments = await firstValueFrom(forkJoin(_createRequests));
    forkJoin(_createRequests).subscribe(results => {
      results.forEach(x => {
        this.schedule.attachments.push(x as AssetScheduleAttachment);
      })
    });
  }

  getFormControl(formArray: FormArray, index: number, controlName: string): FormControl {
    const _cellFormGroup = <FormGroup>formArray.controls[index];
    if (_cellFormGroup) {
      return <FormControl>_cellFormGroup.controls[controlName];
    }
    return new FormControl();
  }

  async onDeleteAttachment(item: AssetScheduleAttachment) {
    await firstValueFrom(this.assetScheduleAttachmentService.delete(item.id));
    this.schedule.attachments = this.schedule.attachments.filter(x => x.id !== item.id);
  }


  onInput(formArray: FormArray, index: number, controlName: string) {
    const _control = <FormControl>this.getFormControl(formArray, index, controlName);
    if (_control && _control.value && typeof _control.value == 'string') {
      _control.setValue(_control.value);
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

  async onAddComponent() {
    const obj = new AssetScheduleComponentModel((this.compoFA.controls[this.schedule.components.length] as FormGroup).value);
    obj.scheduleID = this.schedule.id;
    obj.orderFlag = this.schedule.components.length + 1;
    let newComponent = await firstValueFrom(this.assetScheduleComponentApi.create(obj));
    this.schedule.components.push(newComponent);
    this.buildForm();
    this.bindForm();
  }

  async onDeleteComponent(component: AssetScheduleComponentModel) {
    await firstValueFrom(this.assetScheduleComponentApi.delete(component.id));
    this.schedule.components = this.schedule.components.filter(x => x.id !== component.id);
    this.buildForm();
    this.bindForm();
    this.utilityService.showSwalToast('Component Delete', `${component.component} deleted!`, 'success');
    this.costTotal()
  }

  onClose() {
    this.dialog.close(this.schedule);
  }

  async onSubmit(statusFlag?: number) {
    if (this.form.invalid) {
      this.utilityService.showSweetDialog('Invalid Form',
        'Please fill all required fields with valid data and try again.', 'error'
      );
      this.touchForm();
      return;
    }

    this.schedule = Object.assign(this.schedule, this.form.getRawValue());
    if (statusFlag) {
      this.schedule.statusFlag = statusFlag;
    }
    this.schedule = await firstValueFrom(this.assetScheduleService.update(this.schedule));
    this.utilityService.showSwalToast('Updated Successfully', `${this.schedule.title} updated successfully!`, 'success');
    this.dialog.close(this.schedule);
  }

  onDelete() {
    this.utilityService.showConfirmationDialog(`Do you want to delete ${this.schedule.title} issue`, async () => {
      await firstValueFrom(this.assetScheduleService.delete(this.schedule.id));
      this.utilityService.showSwalToast('Successfully Deleted', '', 'success');
      this.dialog.close({ schedule: this.schedule, isDeleted: true });
    });
  }

  costTotal() {
    this.calculatedCostTotal = 0;
    this.calculatedCostTotal = this.schedule.components.reduce((pre, curr) => {
      return pre += curr.cost;
    }, 0);
  }
}
