import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkOrder } from '../../models/work-order.model';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { McvFileComponent } from 'src/app/mcv-file/components/mcv-file/mcv-file.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { McvFileUploadComponent, UploadResult } from 'src/app/mcv-file/components/mcv-file-upload/mcv-file-upload.component';
import { McvFileUploadConfig } from 'src/app/mcv-file/models/mcv-file-upload-config.model';
import { WorkOrderAttachment } from '../../models/work-order-attachment.model';
import { firstValueFrom, forkJoin, Observable } from 'rxjs';
import { WorkOrderAttachmentApiService } from '../../services/work-order-attachment-api.service';
import { Company } from 'src/app/shared/models/company.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { WorkOrderMasterApiService } from '../../services/work-order-master-api.service';
import { CompanyApiService } from 'src/app/shared/services/company-api.service';
import { WorkOrderStage } from '../../models/work-order-stage.model';
import { WorkOrderStageCreateComponent } from '../work-order-stage-create/work-order-stage-create.component';
import { WorkOrderStageApiService } from '../../services/work-order-stage-api.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { WorkOrderApiService } from '../../services/work-order-api.service';
import { ProjectApiService } from 'src/app/project/services/project-api.service';
import { AppConfig } from 'src/app/app.config';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ProjectStageApiService } from 'src/app/project/services/project-stage-api.service';
import { WorkOrderStageDateUpdateDialogComponent } from '../work-order-stage-date-update-dialog/work-order-stage-date-update-dialog.component';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from "@angular/cdk/drag-drop";
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';

@Component({
  selector: 'app-work-order-update',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatOptionModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatTooltipModule,
    DragDropModule,
    //Components
    McvFileComponent,
    McvFileUploadComponent
  ],
  templateUrl: './work-order-update.component.html',
  styleUrls: ['./work-order-update.component.scss']
})
export class WorkOrderUpdateComponent implements OnInit {

  private readonly dialog = inject(MatDialog);
  private readonly config = inject(AppConfig);
  private readonly data = inject(MAT_DIALOG_DATA);
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly utilityService = inject(UtilityService);
  private readonly projectService = inject(ProjectApiService);
  private readonly workOrderService = inject(WorkOrderApiService);
  private readonly companyAccountsService = inject(CompanyApiService);
  private readonly projectStageService = inject(ProjectStageApiService);
  private readonly appSettingService = inject(AppSettingMasterApiService);
  private readonly workOrderStageService = inject(WorkOrderStageApiService);
  private readonly dialogRef = inject(MatDialogRef<WorkOrderUpdateComponent>);
  private readonly workOrderMasterService = inject(WorkOrderMasterApiService);
  private readonly workOrderAttachmentApiService = inject(WorkOrderAttachmentApiService);

  form!: FormGroup;
  workOrder!: WorkOrder;
  projectID!: number;
  blobConfig!: McvFileUploadConfig;
  companyOptions: Company[] = [];
  typologyOptions: string[] = [];
  workOrderStages: WorkOrderStage[] = [];
  isCreateMode: boolean = false;
  stageForm!: FormGroup;
  percentageTotal: number = 0;
  amountTotal: number = 0;
  newStages: WorkOrderStage[] = [];
  filteredProjectStageStatus: any[] = [];
  hasChanges: boolean = false;
  projectStageStatus: any[] = [
    {
      title: "WORK PENDING",
      value: this.config.PROJECT_STAGE_STATUS_FLAG_PENDING,
    },
    {
      title: "WORK COMPLETED",
      value: this.config.PROJECT_STAGE_STATUS_FLAG_COMPLETED,
    },
    { title: "BILLED", value: this.config.PROJECT_STAGE_STATUS_FLAG_BILLED },
    {
      title: "PAYMENT RECEIVED",
      value: this.config.PROJECT_STAGE_STATUS_FLAG_PAYMENT_RECEIVED,
    },
    {
      title: "UNDER BILLING",
      value: this.config.PROJECT_STAGE_STATUS_FLAG_UNDER_BILLING,
    },
  ];

  get PROJECT_STAGE_TYPE_FLAG_WORK() {
    return this.projectStageService.PROJECT_STAGE_TYPE_FLAG_WORK;
  }

  //Permissions
  get isPermissionStagesStatusEdit() {
    return this.projectService.isPermissionStagesStatusEdit;
  }

  get isTeamLead() {
    return this.authService.isTeamLeader;
  }
  get isPermissionMaster() {
    return this.projectService.isPermissionMaster;
  }

  get isPermissionStagesTargetDate() {
    return this.projectService.isPermissionStagesTargetDate;
  }

  get isPermissionStagesEdit() {
    return this.projectService.isPermissionStagesEdit;
  }

  get f(): any { return this.form.controls; }
  get stagef(): any { return this.stageForm.controls; }
  get isMobileView(): boolean { return this.utilityService.isMobileView; }

  async ngOnInit() {
    if (this.appSettingService.presets) {
      const _presetValue = this.appSettingService.presets.find(x => x.presetKey == this.config.PRESET_BLOB_CONTAINER_ATTACHMENTS);
      if (_presetValue)
        this.blobConfig = new McvFileUploadConfig(
          _presetValue.presetValue,
          `${this.config.NAMEOF_ENTITY_WORKORDER}`
        );
    }
    await this.getCompanyOptions();
    await this.getTypologyOptions();

    if (!this.form) {
      this.buildForm();
    }
    if (!this.stageForm) {
      this.buildStageForm();
    }
    this.bindForm();
    this.filteredProjectStageStatus = [...this.projectStageStatus];
  }

  constructor() {
    if (this.data) {
      this.workOrder = this.data.workOrder;
      this.workOrderStages = this.workOrder.stages;
      this.projectID = this.data.projectID;
    }

    if (!this.form) {
      this.buildForm();
    }

    if (!this.stageForm) {
      this.buildStageForm();
    }

    this.bindStageForm();
    this.createStageTree();
    this.getPercentageTotal();
    this.getAmountTotal();
  }

  getErrorMessage(control: any) {
    return this.utilityService.getErrorMessage(control);
  }

  buildForm() {
    this.form = this.formBuilder.group({
      typology: new FormControl(null, [Validators.required]),
      workOrderNo: new FormControl(null),
      workOrderDate: new FormControl(null),
      company: new FormControl(null),
      dueDate: new FormControl(null),
      area: new FormControl(null),
      rate: new FormControl(null),
      amount: new FormControl(null),
      isLumpSum: new FormControl(false),
    });

    this.f['company'].disable();
    this.f['typology'].disable();
  }

  bindForm() {
    this.form.patchValue(this.workOrder);
    const _company = this.companyOptions.find(x => x.id == this.workOrder.companyID)
    if (_company) {
      this.f['company'].setValue(_company);
    }
  }

  async getCompanyOptions() {
    this.companyOptions = await firstValueFrom(this.companyAccountsService.get())
  }

  private async getTypologyOptions() {
    this.typologyOptions = await firstValueFrom(this.workOrderMasterService.getFieldOptions('TypologyTitle'));
  }

  //Attachments
  uploadQueue: UploadResult[] = [];
  onUpload(uploads: UploadResult[]) {
    if (!this.isCreateMode) {
      uploads.forEach(x => {
        this.uploadQueue.push(x);
      });
      // console.log(this.uploadQueue);
      this.uploadFiles();
    } else {
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
        obj.typeFlag = 0;
        obj.url = x.url;
        this.workOrder.attachments.push(obj);
        this.uploadQueue.push(x);
      });
      // console.log(this.currentEntity.attachments,this.uploadQueue);
    }
  }

  private uploadFiles() {
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

  async onDeleteAttachment(attachment: WorkOrderAttachment) {
    await firstValueFrom(this.workOrderAttachmentApiService.delete(attachment.id));
    this.workOrder.attachments = this.workOrder.attachments.filter(x => x.uid !== attachment.uid);
  }

  onClose() {
    if (this.hasChanges) {
      this.dialogRef.close({ stages: this.workOrderStages });
    } else {
      this.dialogRef.close();
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

  async onSubmit() {
    if (this.form.invalid) {
      this.touchForm();
      this.utilityService.showSweetDialog('Invalid Form',
        'Please fill all required fields with valid data and try again.', 'error'
      );
      return;
    }

    Object.assign(this.workOrder, this.form.getRawValue());
    this.workOrder = await firstValueFrom(this.workOrderService.update(this.workOrder));
    this.dialogRef.close({ workOrder: this.workOrder, stages: this.workOrderStages });
  }

  async onDelete() {
    await firstValueFrom(this.workOrderService.delete(this.workOrder.id));
    this.utilityService.showSwalToast('', 'WorkOrder Deleted Successfully!!', 'error');
    // this.dialogRef.close(this.workOrder);
  }

  //Stages
  get fa() {
    return this.stagef["stagesFA"] as FormArray;
  }

  createStageTree() {
    const stageMap = new Map<number, WorkOrderStage>(
      this.workOrderStages.map((stage) => [stage.id, { ...stage, children: [] }])
    );

    let tree: WorkOrderStage[] = [];

    this.workOrderStages.forEach((stage) => {
      if (stage.parentID && stageMap.has(stage.parentID)) {
        // Push the stage into its parent's children array
        stageMap.get(stage.parentID)!.children.push(stageMap.get(stage.id)!);
      } else {
        // If no parent, it's a root stage
        tree.push(stageMap.get(stage.id)!);
      }
    });

    // Assign the structured tree to the project stages
    this.workOrderStages = tree;
    // console.log(this.workOrderStages);

    this.newStages = this.workOrderStages
      .filter((x) => x.typeFlag == this.PROJECT_STAGE_TYPE_FLAG_WORK && !x.isReadOnly)
      .sort((a, b) => a.orderFlag - b.orderFlag);

    // console.log(this.newStages);
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
        console.log(res);
        // this.workOrderStages.push(res);
        this.createStage(res);
      }
    });
  }

  buildStageForm() {
    this.stageForm = this.formBuilder.group({
      stagesFA: this.formBuilder.array([]),
    });
    this.touchForm();
  }

  async createStage(stage: WorkOrderStage) {
    stage.workOrderID = this.workOrder.id;
    stage.projectID = this.projectID;
    stage.parentID = undefined;
    stage.orderFlag = this.workOrderStages.length > 0
      ? this.workOrderStages[this.workOrderStages.length - 1].orderFlag + 1
      : 0;
    const _stage = await firstValueFrom(this.workOrderStageService.create(stage));
    this.workOrderStages.push(_stage);
    // this.workOrder.stages.push(_stage);
    this.buildStageForm();
    this.bindStageForm();
    this.createStageTree();
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
      } else if (controlName == "amount") {
        entity.amount = _control.value;
      } else if (controlName == "paymentReceivedDate") {
        entity.paymentReceivedDate = _control.value;
      }
      // console.log(entity);
      entity = await firstValueFrom(
        this.workOrderStageService.update(entity, true)
      );
      this.utilityService.showSwalToast(
        "Success",
        "Stage updated successfully",
        "success"
      );

      // this.update.emit(this.project);
      this.getPercentageTotal();
      this.getAmountTotal();
    }
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

  onDeleteStage(stage: WorkOrderStage) {
    this.utilityService.showConfirmationDialog(
      `Do you want to delete ${stage.title} stage?`,
      async () => {
        await firstValueFrom(this.workOrderStageService.delete(stage.id));
        this.workOrderStages = this.workOrder.stages.filter(
          (x) => x.id != stage.id
        );
        // this.update.emit(this.project);
        this.buildStageForm();
        this.bindStageForm();
      }
    );
  }

  bindStageForm() {
    this.fa.clear();
    this.workOrderStages
      .filter((x) => x.typeFlag == this.PROJECT_STAGE_TYPE_FLAG_WORK && !x.isReadOnly)
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
      amount: new FormControl<any>(0, [Validators.required]),
      dueDate: new FormControl<any>(null),
      billingDate: new FormControl<any>(null),
      paymentReceivedDate: new FormControl<any>(null),
      description: new FormControl<any>(null),
    });

    if (value) {
      formGroup.patchValue(value, { emitEvent: false });
    }
    this.fa.push(formGroup);
  }

  getPercentageTotal() {
    this.percentageTotal = this.workOrderStages
      .reduce((acc, curr) => acc + curr.percentage, 0);
  }

  getAmountTotal() {
    this.amountTotal = this.workOrderStages
      .reduce((acc, curr) => acc + Number(curr.amount), 0);
  }


  disabledByPermission(status: any): boolean {
    if (this.isTeamLead && !this.isPermissionMaster) {
      return !(
        status.value === this.config.PROJECT_STAGE_STATUS_FLAG_PENDING ||
        status.value === this.config.PROJECT_STAGE_STATUS_FLAG_COMPLETED
      );
    }

    // For everyone else, enable all options
    return false;
  }

  getStatusTitle(statusFlag: number): string {
    const status = this.filteredProjectStageStatus.find(
      (item) => item.value === statusFlag
    );
    return status ? status.title : "";
  }

  onEditTargetDate(stage: WorkOrderStage) {
    const _dialogConfig = new MatDialogConfig();
    _dialogConfig.disableClose = true;
    _dialogConfig.autoFocus = true;
    _dialogConfig.data = {
      stage: stage,
    };

    const _dialogRef = this.dialog.open(
      WorkOrderStageDateUpdateDialogComponent,
      _dialogConfig
    );
    _dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.getWorkOrderStages();
        this.createStageTree();
      }
    });
  }

  async getWorkOrderStages() {
    this.workOrder.stages = await firstValueFrom(this.workOrderStageService.get([{ key: 'workOrderID', value: this.workOrder.id.toString() }]));
    this.workOrder.stages = this.workOrder.stages.filter(x => x.typeFlag == this.PROJECT_STAGE_TYPE_FLAG_WORK).sort((a, b) => a.orderFlag - b.orderFlag);
  }

  async onDrop(event: CdkDragDrop<WorkOrderStage[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      if (event.previousIndex !== event.currentIndex) {
        const requests: Observable<WorkOrderStage>[] = [];

        event.container.data.forEach((x, i) => {
          x.orderFlag = i + 1;
          requests.push(this.workOrderStageService.update(x, true));
        });

        const results = await firstValueFrom(forkJoin(requests));
        this.newStages = results.sort((a, b) => a.orderFlag - b.orderFlag);

        this.workOrderStages = [
          ...this.workOrderStages.filter(
            s => s.typeFlag !== this.PROJECT_STAGE_TYPE_FLAG_WORK || s.isReadOnly
          ),
          ...this.newStages
        ].sort((a, b) => a.orderFlag - b.orderFlag);

        this.buildStageForm();
        this.bindStageForm();
        this.hasChanges = true;
      }
    }
  }
}
