import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Contact } from 'src/app/contact/models/contact';
import { ContactApiService } from 'src/app/contact/services/contact-api.service';
import { firstValueFrom, forkJoin, lastValueFrom, map, Observable } from 'rxjs';
import { CompanyApiService } from 'src/app/shared/services/company-api.service';
import { Company } from 'src/app/shared/models/company.model';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { McvFileUploadComponent, UploadResult } from 'src/app/mcv-file/components/mcv-file-upload/mcv-file-upload.component';
import { McvFileComponent } from 'src/app/mcv-file/components/mcv-file/mcv-file.component';
import { McvFileUploadConfig } from 'src/app/mcv-file/models/mcv-file-upload-config.model';
import { WorkOrder } from '../../models/work-order.model';
import { WorkOrderAttachment } from '../../models/work-order-attachment.model';
import { WorkOrderAttachmentApiService } from '../../services/work-order-attachment-api.service';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { AppConfig } from 'src/app/app.config';
import { WorkOrderMasterCreateComponent } from '../work-order-master-create/work-order-master-create.component';
import { WorkOrderMasterApiService } from '../../services/work-order-master-api.service';
import { WorkOrderApiService } from '../../services/work-order-api.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Project } from 'src/app/project/models/project.model';
import { WorkOrderStageCreateComponent } from '../work-order-stage-create/work-order-stage-create.component';
import { WorkOrderStage } from '../../models/work-order-stage.model';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from "@angular/cdk/drag-drop";
import { MatTooltipModule } from '@angular/material/tooltip';
import { WorkOrderStageApiService } from '../../services/work-order-stage-api.service';
import { WorkOrderMaster } from '../../models/work-order-master.model';

@Component({
  selector: 'app-work-order-create',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    FormsModule,
    DragDropModule,
    ReactiveFormsModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatTooltipModule,

    //Components
    McvFileUploadComponent,
    McvFileComponent,
  ],
  templateUrl: './work-order-create.component.html',
  styleUrls: ['./work-order-create.component.scss']
})
export class WorkOrderCreateComponent implements OnInit {

  private readonly dialog = inject(MatDialog);
  private readonly config = inject(AppConfig);
  private readonly data = inject(MAT_DIALOG_DATA);
  private readonly formBuilder = inject(FormBuilder);
  private readonly utilityService = inject(UtilityService);
  private readonly contactService = inject(ContactApiService);
  private readonly workOrderService = inject(WorkOrderApiService);
  private readonly workOrderStageService = inject(WorkOrderStageApiService);
  private readonly companyAccountsService = inject(CompanyApiService);
  private readonly appSettingService = inject(AppSettingMasterApiService);
  private readonly workOrderMasterService = inject(WorkOrderMasterApiService);
  private readonly dialogRef = inject(MatDialogRef<WorkOrderCreateComponent>);
  private readonly workOrderAttachmentApiService = inject(WorkOrderAttachmentApiService);

  form!: FormGroup;
  stageForm!: FormGroup;
  contact!: Contact;
  project!: Project;
  companyOptions: Company[] = [];
  typologyOptions: string[] = [];
  workOrderStages: WorkOrderStage[] = [];
  blobConfig!: McvFileUploadConfig;
  workOrder: WorkOrder = new WorkOrder();
  get f(): any { return this.form.controls; }
  get stagef(): any { return this.stageForm.controls; }
  get isMobileView(): boolean { return this.utilityService.isMobileView; }


  async ngOnInit() {
    await this.getCompanyAccounts();
    await this.getTypologyOptions();
    if (!this.appSettingService.presets || !this.appSettingService.presets.length) {
      await this.appSettingService.loadPresets();
    }

    if (this.appSettingService.presets) {
      const _presetValue = this.appSettingService.presets.find(x => x.presetKey == this.config.PRESET_BLOB_CONTAINER_ATTACHMENTS);
      if (_presetValue)
        this.blobConfig = new McvFileUploadConfig(
          _presetValue.presetValue,
          `${this.config.NAMEOF_ENTITY_WORKORDER}`
        );
    }
  }

  constructor() {
    if (this.data) {
      this.project = this.data.project;
    }

    if (!this.form) {
      this.buildForm();
    }
    if (!this.stageForm) {
      this.buildStageForm();
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

  buildForm() {
    this.form = this.formBuilder.group({
      typology: new FormControl(null, [Validators.required]),
      workOrderNo: new FormControl(null),
      workOrderDate: new FormControl(null, [Validators.required]),
      company: new FormControl(null),
      dueDate: new FormControl(null),
      area: new FormControl(null),
      rate: new FormControl(null),
      amount: new FormControl(null, [Validators.required]),
      isLumpSum: new FormControl(false),
    });
  }

  getErrorMessage(control: any) {
    return this.utilityService.getErrorMessage(control);
  }

  displayFnContact(option?: Contact): string {
    return option ? option.name : '';
  }

  private async getCompanyAccounts() {
    this.companyOptions = await firstValueFrom(this.companyAccountsService.get());
  }

  private async getTypologyOptions() {
    this.typologyOptions = await firstValueFrom(this.workOrderMasterService.getFieldOptions('TypologyTitle'));
  }

  private getFilteredContacts(search: string): Observable<Contact[]> {
    return this.contactService.getOptions([
      { key: 'IsCompany', value: !this.contact?.isCompany ? 'true' : 'false' },
    ], search).pipe(map(data => data ? data.map((x: Contact) => x) : []));
  }

  onAddFromMaster() {
    const _dialogConfig = new MatDialogConfig();
    _dialogConfig.disableClose = true;
    _dialogConfig.autoFocus = true;

    const _dialogRef = this.dialog.open(WorkOrderMasterCreateComponent, _dialogConfig);
    _dialogRef.afterClosed().subscribe((res?: WorkOrderMaster) => {
      if (res) {
        res.workOrderMasterStages.forEach((x, index) => {
          const _workOrder = new WorkOrderStage();
          _workOrder.title = x.title;
          _workOrder.percentage = x.value;
          _workOrder.orderFlag = this.workOrderStages.length + index + 1;
          this.workOrderStages.push(_workOrder);
          this.addInput(_workOrder);
        });
      }
    });
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.touchForm();
      this.utilityService.showSweetDialog('Invalid Form',
        'Please fill all required fields with valid data and try again.', 'error'
      );
      return;
    }

    Object.assign(this.workOrder, this.form.getRawValue());
    this.workOrder.companyID = (this.f['company'].value as Company).id;
    this.workOrder.projectID = this.project.id;

    this.workOrder = await firstValueFrom(this.workOrderService.create(this.workOrder));
    this.workOrder.company = this.f['company'].value;
    this.utilityService.showSwalToast('', 'WorkOrder Created Successfully!', 'success');
    await this.uploadFiles();
    await this.uploadStage();
    // this.createStages();
    this.dialogRef.close(this.workOrder);
  }

  onAddStage() {
    const _dialogConfig = new MatDialogConfig();
    _dialogConfig.disableClose = true;
    _dialogConfig.autoFocus = true;
    _dialogConfig.data = {
      isCreateMode: true
    }

    const _dialogRef = this.dialog.open(WorkOrderStageCreateComponent, _dialogConfig);
    _dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        res.orderFlag = this.workOrderStages.length + 1;
        this.workOrderStages.push(res);
        this.buildStageForm();
        this.bindForm();
      }
    });
  }

  //Attachments
  uploadQueue: UploadResult[] = [];
  onUpload(uploads: UploadResult[]) {
    //Creating a dummy object
    uploads.forEach(x => {
      let obj = new WorkOrderAttachment();
      obj.filename = x.filename;
      obj.size = x.size;
      obj.contentType = x.contentType;
      obj.guidname = x.blobPath;
      obj.blobPath = x.blobPath;
      obj.workOrderID = this.workOrder.id;
      obj.container = this.blobConfig.container;
      obj.typeFlag = this.workOrder.typeFlag;
      obj.url = x.url;
      this.workOrder.attachments.push(obj);
      this.uploadQueue.push(x);
    });
    // console.log(this.workOrder.attachments, this.uploadQueue);

  }

  private async uploadFiles() {
    let _createRequests: any[] = [];
    this.uploadQueue.forEach(x => {
      let obj = new WorkOrderAttachment();
      obj.filename = x.filename;
      obj.size = x.size;
      obj.contentType = x.contentType;
      obj.guidname = x.blobPath;
      obj.blobPath = x.blobPath;
      obj.workOrderID = this.workOrder.id;
      obj.container = this.blobConfig.container;
      obj.typeFlag = 0;
      obj.url = x.url;
      obj.originalUrl = x.url;
      _createRequests.push(this.workOrderAttachmentApiService.create(obj));
    });
    this.uploadQueue = [];

    forkJoin(_createRequests).subscribe((results: any) => {
      results.forEach((x: any) => {
        this.workOrder.attachments.push(x as WorkOrderAttachment);
      })
    });
  }

  onDeleteAttachment(attachment: WorkOrderAttachment) {
    this.uploadQueue = this.uploadQueue.filter(x => x.url !== attachment.url);
    this.workOrder.attachments = this.workOrder.attachments.filter(x => x.uid !== attachment.uid);
  }

  //Stages
  get fa() {
    return this.stagef["stagesFA"] as FormArray;
  }

  buildStageForm() {
    this.stageForm = this.formBuilder.group({
      stagesFA: this.formBuilder.array([]),
    });
    this.touchForm();
  }

  bindForm() {
    this.fa.clear();
    this.workOrderStages
      .forEach((item: WorkOrderStage) => {
        this.addInput(item);
      });
    this.addInput(null);
  }

  private addInput(value: WorkOrderStage | null) {
    const formGroup = this.formBuilder.group({
      percentage: new FormControl<any>(0, [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
      ]),
      title: new FormControl<any>(0, [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
      ]),
      statusFlag: new FormControl<any>(0, [Validators.required]),
      amount: new FormControl<any>(null)
    });

    if (value) {
      formGroup.patchValue(value, { emitEvent: false });
    }
    this.fa.push(formGroup);
  }

  createStages() {

  }

  getFormControl(
    formArray: FormArray,
    index: number,
    controlName: string
  ): FormControl {
    const _cellFormGroup = <FormGroup>formArray.controls[index];
    if (_cellFormGroup) {
      return <FormControl>_cellFormGroup.controls[controlName];
    }
    return new FormControl();
  }

  onDeleteStage(index: number) {
    this.workOrderStages.splice(index, 1);
    this.fa.removeAt(index);
  }

  async onCellChange(
    formArray: FormArray,
    index: number,
    controlName: string,
    entity?: WorkOrderStage
  ) {
    const _control = <FormControl>(
      this.getFormControl(formArray, index, controlName)
    );
    if (_control && _control.invalid) {
      this.utilityService.showSwalToast(
        "Invalid input",
        this.utilityService.getErrorMessage(_control),
        "error"
      );
      return;
    }
    if (entity) {
      if (controlName == "percentage") {
        entity.percentage = Number(_control.value);
      } else if (controlName == "title") {
        entity.title = _control.value;
      } else if (controlName == "statusFlag") {
        entity.statusFlag = _control.value;
      } else if (controlName == "dueDate") {
        // entity.dueDate = _control.value
      } else if (controlName == "billingDate") {
        entity.billingDate = _control.value;
      } else if (controlName == "paymentReceivedDate") {
        entity.paymentReceivedDate = _control.value;
      }
    }
  }

  async uploadStage() {
    if (!this.workOrderStages?.length) return;

    const stageRequests = this.workOrderStages.map((stage, index) =>
      this.workOrderStageService.create({
        ...stage,
        workOrderID: this.workOrder.id,
        projectID: this.project.id,
        orderFlag: index + 1
      })
    );

    const results = await lastValueFrom(forkJoin(stageRequests));
    this.workOrder.stages.push(...results);
  }

  keyPressNumbers(event: KeyboardEvent) {
    const key = event.key;
    // Only allow numeric keys (0-9) and specific control keys
    if (
      !/^[0-9.]$|^Backspace$|^Delete$|^Arrow(Left|Right|Up|Down)?$/.test(key)
    ) {
      event.preventDefault();
    }
  }

  onDrop(event: CdkDragDrop<WorkOrderStage[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.workOrderStages, event.previousIndex, event.currentIndex);
      this.workOrderStages.forEach((stage, index) => {
        stage.orderFlag = index + 1;
      });
      this.bindForm();
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}
