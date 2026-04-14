import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { WorkOrderAttachmentApiService } from '../../services/work-order-attachment-api.service';
import { WorkOrder } from '../../models/work-order.model';
import { McvFileUploadConfig } from 'src/app/mcv-file/models/mcv-file-upload-config.model';
import { Company } from 'src/app/shared/models/company.model';
import { UploadResult } from 'src/app/mcv-file/components/mcv-file-upload/mcv-file-upload.component';
import { WorkOrderAttachment } from '../../models/work-order-attachment.model';
import { firstValueFrom, forkJoin } from 'rxjs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { McvFileComponent } from 'src/app/mcv-file/components/mcv-file/mcv-file.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { WorkOrderUpdateComponent } from '../work-order-update/work-order-update.component';
import { WorkOrderStageApiService } from '../../services/work-order-stage-api.service';
import { WorkOrderMasterCreateComponent } from '../work-order-master-create/work-order-master-create.component';
import { WorkOrderMasterCreateNewComponent } from '../work-order-master-create-new/work-order-master-create-new.component';
import { ProjectStageApiService } from 'src/app/project/services/project-stage-api.service';
import { AppConfig } from 'src/app/app.config';
import { ProjectApiService } from 'src/app/project/services/project-api.service';
import { WorkOrderStage } from '../../models/work-order-stage.model';

@Component({
  selector: 'app-work-order-details',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,

    //Components
    McvFileComponent
  ],
  templateUrl: './work-order-details.component.html',
  styleUrls: ['./work-order-details.component.scss']
})
export class WorkOrderDetailsComponent {
  private readonly config = inject(AppConfig);
  private readonly dialog = inject(MatDialog);
  private readonly formBuilder = inject(FormBuilder);
  private readonly utilityService = inject(UtilityService);
  private readonly projectApiService = inject(ProjectApiService);
  private readonly projectStageService = inject(ProjectStageApiService);
  private readonly workOrderStageService = inject(WorkOrderStageApiService);
  private readonly workOrderAttachmentApiService = inject(WorkOrderAttachmentApiService);

  form!: FormGroup;
  workOrder!: WorkOrder;
  workOrderStages: WorkOrderStage[] = [];
  projectID!: number;
  blobConfig!: McvFileUploadConfig;
  companyOptions: Company[] = [];
  typologyOptions: string[] = [];
  filteredProjectStageStatus: any[] = [];
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

  get f(): any { return this.form.controls; }
  get isMobileView(): boolean { return this.utilityService.isMobileView; }

  get isPermissionWorkOrderEdit() { return this.projectApiService.isPermissionWorkOrderEdit; }
  get PROJECT_STAGE_STATUS_FLAG_PENDING() {
    return this.config.PROJECT_STAGE_STATUS_FLAG_PENDING;
  }
  get PROJECT_STAGE_STATUS_FLAG_COMPLETED() {
    return this.config.PROJECT_STAGE_STATUS_FLAG_COMPLETED;
  }
  get PROJECT_STAGE_STATUS_FLAG_BILLED() {
    return this.config.PROJECT_STAGE_STATUS_FLAG_BILLED;
  }
  get PROJECT_STAGE_STATUS_FLAG_PAYMENT_RECEIVED() {
    return this.config.PROJECT_STAGE_STATUS_FLAG_PAYMENT_RECEIVED;
  }

  get PROJECT_STAGE_TYPE_FLAG_WORK() {
    return this.projectStageService.PROJECT_STAGE_TYPE_FLAG_WORK;
  }
  get PROJECT_STAGE_TYPE_FLAG_PAYMENT() {
    return this.projectStageService.PROJECT_STAGE_TYPE_FLAG_PAYMENT;
  }

  get stageTotal() {
    return this.workOrderStages
      .filter((x) => x.typeFlag == this.PROJECT_STAGE_TYPE_FLAG_WORK && !x.isReadOnly)
      .map((x) => x.percentage)
      .reduce((a, b) => a + b, 0);
  }

  get stageTotalProgress() {
    return this.workOrderStages
      .filter((x) => x.typeFlag == this.PROJECT_STAGE_TYPE_FLAG_WORK)
      .filter((x) => x.statusFlag == this.PROJECT_STAGE_STATUS_FLAG_COMPLETED)
      .map((x) => x.percentage)
      .reduce((a, b) => a + b, 0);
  }

  get stagePendingProgress() {
    return this.workOrderStages
      .filter((x) => x.typeFlag == this.PROJECT_STAGE_TYPE_FLAG_WORK)
      .filter((x) => x.statusFlag != this.PROJECT_STAGE_STATUS_FLAG_COMPLETED)
      .map((x) => x.percentage)
      .reduce((a, b) => a + b, 0);
  }

  @Input('config') set configValue(value: {
    workOrder: WorkOrder,
    projectID: number
  }) {
    if (value) {
      this.workOrder = value.workOrder;
      this.projectID = value.projectID;
      this.getWorkOrderStages();
      if (!this.form) {
        this.buildForm();
      }
      this.bindForm();

      this.filteredProjectStageStatus = [...this.projectStageStatus];
    }
  }

  getErrorMessage(control: any) {
    return this.utilityService.getErrorMessage(control);
  }

  buildForm() {
    this.form = this.formBuilder.group({
      typology: new FormControl(null, [Validators.required]),
      workOrderNumber: new FormControl(null),
      workOrderDate: new FormControl(null),
      company: new FormControl(null),
      dueDate: new FormControl(null),
      area: new FormControl(null),
      rate: new FormControl(null),
      amount: new FormControl(null),
      isLumpSum: new FormControl(false),
    });
  }

  bindForm() {
    this.form.patchValue(this.workOrder);
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

  onAddToMaster(event: MouseEvent) {
    event.stopPropagation();
    const _dialogConfig = new MatDialogConfig();
    _dialogConfig.disableClose = true;
    _dialogConfig.autoFocus = true;
    _dialogConfig.data = {
      stages: this.workOrderStages
    }

    const _dialogRef = this.dialog.open(WorkOrderMasterCreateNewComponent, _dialogConfig);
    _dialogRef.afterClosed().subscribe(res => {
      console.log(res);
    });
  }

  onEditWorkOrder(event: MouseEvent) {
    event.stopPropagation();
    const _dialogConfig = new MatDialogConfig();
    _dialogConfig.disableClose = true;
    _dialogConfig.autoFocus = true;
    _dialogConfig.data = {
      workOrder: this.workOrder,
      projectID: this.projectID
    }

    const _dialogRef = this.dialog.open(WorkOrderUpdateComponent, _dialogConfig);
    _dialogRef.afterClosed().subscribe(res => {
      if (res) {
        if (res.workOrder) {
          this.workOrder = res.workOrder;
        }
        if (res.stages) {
          this.workOrder.stages = res.stages;
          this.workOrderStages = res.stages.filter((x: WorkOrderStage) => x.typeFlag == this.PROJECT_STAGE_TYPE_FLAG_WORK && !x.isReadOnly).sort((a: WorkOrderStage, b: WorkOrderStage) => a.orderFlag - b.orderFlag);
        }
      }
    });
  }

  getStatusTitle(statusFlag: number): string {
    const status = this.filteredProjectStageStatus.find(
      (item) => item.value === statusFlag
    );
    return status ? status.title : "";
  }

  async getWorkOrderStages() {
    this.workOrder.stages = await firstValueFrom(this.workOrderStageService.get([{ key: 'workOrderID', value: this.workOrder.id.toString() }]));
    this.workOrder.stages = this.workOrder.stages.filter(x => x.typeFlag == this.PROJECT_STAGE_TYPE_FLAG_WORK).sort((a, b) => a.orderFlag - b.orderFlag);
    this.workOrderStages = this.workOrder.stages.filter(x => x.typeFlag == this.PROJECT_STAGE_TYPE_FLAG_WORK && !x.isReadOnly).sort((a, b) => a.orderFlag - b.orderFlag);
  }
}

