import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { ProjectInwardDialogComponent } from "../project-inward-dialog/project-inward-dialog.component";
import {
  ProjectWorkOrder,
  ProjectWorkOrderAttachment,
  ProjectWorkOrderServiceAmount,
} from "../../models/project-work-order.model";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { UtilityService } from "src/app/shared/services/utility.service";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import {
  McvFileUploadComponent,
  UploadResult,
} from "src/app/mcv-file/components/mcv-file-upload/mcv-file-upload.component";
import { McvFileUploadConfig } from "src/app/mcv-file/models/mcv-file-upload-config.model";
import { AppSettingMasterApiService } from "src/app/shared/services/app-setting-master-api.service";
import { AppConfig } from "src/app/app.config";
import {
  debounceTime,
  distinctUntilChanged,
  firstValueFrom,
  forkJoin,
} from "rxjs";
import { ProjectWorkOrderAttachmentApiService } from "../../services/project-work-order-attachment-api.service";
import { McvFileComponent } from "src/app/mcv-file/components/mcv-file/mcv-file.component";
import { ProjectWorkOrderApiService } from "../../services/project-work-order-api.service";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { PresetMaster } from "src/app/shared/models/preset-master";
import { ProjectWorkOrderServiceAmountService } from "../../services/project-work-order-service-amount.service";

@Component({
  selector: "app-project-work-order-create",
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatOptionModule,
    FormsModule,
    MatSelectModule,
    //Components
    McvFileUploadComponent,
    McvFileComponent,
  ],
  templateUrl: "./project-work-order-create.component.html",
  styleUrls: ["./project-work-order-create.component.scss"],
})
export class ProjectWorkOrderCreateComponent implements OnInit {
  config = inject(AppConfig);
  data = inject(MAT_DIALOG_DATA);
  formBuilder = inject(FormBuilder);
  utilityService = inject(UtilityService);
  appSettingService = inject(AppSettingMasterApiService);
  dialogRef = inject(MatDialogRef<ProjectWorkOrderCreateComponent>);
  projectWorkOrderApiService = inject(ProjectWorkOrderApiService);
  projectWorkOrderAttachmentApiService = inject(
    ProjectWorkOrderAttachmentApiService
  );
  projectWorkOrderServiceAmountService = inject(
    ProjectWorkOrderServiceAmountService
  );

  form!: FormGroup;
  projectID!: number;
  typeFlag!: number;
  blobConfig!: McvFileUploadConfig;
  appSetting!: PresetMaster;
  workOrder: ProjectWorkOrder = new ProjectWorkOrder();
  serviceOptions: any[] = [];
  serviceAmountsArray: any[] = [];

  get f(): any {
    return this.form.controls;
  }
  get isMobileView(): boolean {
    return this.utilityService.isMobileView;
  }

  ngOnInit() {
    if (!this.form) {
      this.buildForm();
    }
    this.addServiceAmount();
    if (this.data) {
      this.projectID = this.data.projectID;
      this.typeFlag = this.data.typeFlag;
    }

    this.blobConfig = {
      container:
        this.appSettingService?.presets?.find(
          (x) => x.presetKey == this.config.PRESET_BLOB_CONTAINER_ATTACHMENTS
        )?.presetValue ?? "",
      folderPath: `${this.config.NAME_OF_ENTITY_PROJECT_WORK_ORDER}`,
    };

    const _setting = this.appSettingService.presets.find(
      (x) => x.presetKey == this.config.PROJECT_WORKORDER_SERVICE
    );
    if (_setting) {
      this.appSetting = _setting;
      this.serviceOptions = _setting.presetValue
        .split(",")
        .map((x) => x.toUpperCase());
    }
  }

  get serviceAmounts(): FormArray {
    return this.form.get("serviceAmounts") as FormArray;
  }

  private touchForm(group: FormGroup | FormArray = this.form) {
    Object.keys(group.controls).forEach((key) => {
      const control = group.get(key);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        this.touchForm(control);
      }
    });
  }

  getErrorMessage(control?: AbstractControl) {
    return this.utilityService.getErrorMessage(control);
  }

  buildForm() {
    this.form = this.formBuilder.group({
      workOrderNo: new FormControl<any>(null),
      workOrderDate: new FormControl<any>(null, Validators.required),
      dueDate: new FormControl<any>(null, Validators.required),
      // fees: new FormControl<any>(null),
      serviceAmounts: this.formBuilder.array([]),
    });
   this.serviceAmounts.valueChanges
  .pipe(
    debounceTime(400),
    distinctUntilChanged()
  )
  .subscribe((value) => {
    if (value) {
      this.serviceAmountsArray = value.filter(
        (x:any) => x.service != null || x.amount != null
      );
    }
  });
  }

  addServiceAmount() {
    this.serviceAmounts.push(
      this.formBuilder.group({
        service: new FormControl<any>(null),
        amount: new FormControl<any>(
          null,
          Validators.pattern(/^\d+$/) // Number only validation
        ),
      })
    );
  }

  onRemoveServiceAmount(index: number) {
    this.serviceAmounts.removeAt(index);
  }

  uploadQueue: UploadResult[] = [];
  onUpload(uploads: UploadResult[]) {
    //Creating a dummy object
    uploads.forEach((x) => {
      let obj = new ProjectWorkOrderAttachment();
      obj.filename = x.filename;
      obj.size = x.size;
      obj.contentType = x.contentType;
      obj.guidname = x.blobPath;
      obj.blobPath = x.blobPath;
      obj.projectWorkOrderID = this.workOrder.id;
      obj.container = this.blobConfig.container;
      obj.typeFlag = this.workOrder.typeFlag;
      obj.url = x.url;
      this.workOrder.attachments.push(obj);
      this.uploadQueue.push(x);
    });
    console.log(this.workOrder.attachments, this.uploadQueue);
  }

  private uploadFiles() {
    let _createRequests: any[] = [];
    this.uploadQueue.forEach((x) => {
      let obj = new ProjectWorkOrderAttachment();
      obj.filename = x.filename;
      obj.size = x.size;
      obj.contentType = x.contentType;
      obj.guidname = x.blobPath;
      obj.blobPath = x.blobPath;
      obj.projectWorkOrderID = this.workOrder.id;
      obj.container = this.blobConfig.container;
      obj.typeFlag = 0;
      obj.url = x.url;
      obj.originalUrl = x.url;
      _createRequests.push(
        this.projectWorkOrderAttachmentApiService.create(obj)
      );
    });
    this.uploadQueue = [];

    forkJoin(_createRequests).subscribe((results: any) => {
      results.forEach((x: any) => {
        this.workOrder.attachments.push(x as ProjectWorkOrderAttachment);
      });
      // this.todoApiService.refreshList();
    });
  }



uploadServiceAmount() { 
  const _createRequests: any[] = [];

  console.log('this.serviceAmountsArray', this.serviceAmountsArray);

  this.serviceAmountsArray
    .filter(x => x.service != null || x.amount != null) // ✅ Skip fully empty entries
    .forEach((x) => {
      const obj = new ProjectWorkOrderServiceAmount();
      obj.projectWorkOrderID = this.workOrder.id;
      obj.service = x.service;
      obj.amount = x.amount;
      _createRequests.push(
        this.projectWorkOrderServiceAmountService.create(obj)
      );
    });

  if (_createRequests.length === 0) {
    console.warn("No valid service amounts to upload.");
    return;
  }

  forkJoin(_createRequests).subscribe((results: any) => {
    results.forEach((x: any) => {
      this.workOrder.serviceAmounts.push(x as ProjectWorkOrderServiceAmount);
    });
    // this.todoApiService.refreshList();
  });
}


  onDeleteAttachment(attachment: ProjectWorkOrderAttachment) {
    this.uploadQueue = this.uploadQueue.filter((x) => x !== attachment);
    this.workOrder.attachments = this.workOrder.attachments.filter(
      (x) => x.uid !== attachment.uid
    );
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.touchForm();
      this.utilityService.showSweetDialog(
        "Incomplete data!",
        "Please fill all required fields with valid data and try again!",
        "warning"
      );
      return;
    }

    // this.workOrder = Object.assign(this.workOrder, this.form.value);
    this.workOrder.projectID = this.projectID;
    this.workOrder.typeFlag = this.typeFlag;
    // this.workOrder.fees = this.f['fees'].value;
    this.workOrder.dueDate = this.f["dueDate"].value;
    this.workOrder.workOrderDate = this.f["workOrderDate"].value;
    this.workOrder.workOrderNo = this.f["workOrderNo"].value;
    this.workOrder.typeFlag = this.typeFlag;

    console.log("_serviceAmounts", this.workOrder);

    this.workOrder = await firstValueFrom(
      this.projectWorkOrderApiService.create(this.workOrder)
    );
    this.uploadFiles();
    this.uploadServiceAmount();
    this.utilityService.showSwalToast(
      "",
      "Work Order created successfully",
      "success"
    );
    this.dialogRef.close(this.workOrder);
  }

  onClose() {
    this.dialogRef.close();
  }
}
