import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { McvFileUploadConfig } from "src/app/mcv-file/models/mcv-file-upload-config.model";
import { UtilityService } from "src/app/shared/services/utility.service";
import {
  McvFileUploadComponent,
  UploadResult,
} from "src/app/mcv-file/components/mcv-file-upload/mcv-file-upload.component";
import { McvFileComponent } from "src/app/mcv-file/components/mcv-file/mcv-file.component";
import {
  ProjectWorkOrder,
  ProjectWorkOrderAttachment,
  ProjectWorkOrderServiceAmount,
} from "../../models/project-work-order.model";
import { ProjectWorkOrderAttachmentApiService } from "../../services/project-work-order-attachment-api.service";
import {
  debounceTime,
  distinctUntilChanged,
  firstValueFrom,
  forkJoin,
} from "rxjs";
import { ProjectWorkOrderApiService } from "../../services/project-work-order-api.service";
import { AppSettingMasterApiService } from "src/app/shared/services/app-setting-master-api.service";
import { AppConfig } from "src/app/app.config";
import { ProjectApiService } from "../../services/project-api.service";
import { MatOptionModule } from "@angular/material/core";
import { PresetMaster } from "src/app/shared/models/preset-master";
import { MatSelectModule } from "@angular/material/select";
import { ProjectWorkOrderServiceAmountService } from "../../services/project-work-order-service-amount.service";

@Component({
  selector: "app-project-work-order-update",
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
    MatSelectModule,
    //Components
    McvFileUploadComponent,
    McvFileComponent,
  ],
  templateUrl: "./project-work-order-update.component.html",
  styleUrls: ["./project-work-order-update.component.scss"],
})
export class ProjectWorkOrderUpdateComponent implements OnInit {
  config = inject(AppConfig);
  data = inject(MAT_DIALOG_DATA);
  formBuilder = inject(FormBuilder);
  utilityService = inject(UtilityService);
  appSettingService = inject(AppSettingMasterApiService);
  projectApiService = inject(ProjectApiService);
  projectWorkOrderApiService = inject(ProjectWorkOrderApiService);
  dialogRef = inject(MatDialogRef<ProjectWorkOrderUpdateComponent>);
  projectWorkOrderAttachmentApiService = inject(
    ProjectWorkOrderAttachmentApiService
  );
  projectWorkOrderServiceAmountService = inject(
    ProjectWorkOrderServiceAmountService
  );
  serviceOptions: any[] = [];
  form!: FormGroup;
  typeFlag!: number;
  workOrder!: ProjectWorkOrder;
  blobConfig!: McvFileUploadConfig;
  appSetting!: PresetMaster;
  serviceAmountsArray: ProjectWorkOrderServiceAmount[] = [];

  get f(): any {
    return this.form.controls;
  }

  get isMobileView(): boolean {
    return this.utilityService.isMobileView;
  }
  get isPermissionWorkOrderEdit() {
    return this.projectApiService.isPermissionWorkOrderEdit;
  }

  ngOnInit() {
    console.log("this.data", this.data);
    if (this.data) {
      this.workOrder = this.data.workOrder;
      Object.assign(
        this.serviceAmountsArray,
        this.data.workOrder.serviceAmounts
      );
      console.log("this.serviceAmountsArray", this.serviceAmountsArray);
      this.typeFlag = this.data.typeFlag;
    }

    if (!this.form) {
      this.buildForm();
    }

    this.bindForm();

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

  buildForm() {
    this.form = this.formBuilder.group({
      workOrderNo: new FormControl<any>(null),
      workOrderDate: new FormControl<any>(null),
      dueDate: new FormControl<any>(null),
      fees: new FormControl<any>(null),
      serviceAmounts: this.formBuilder.array([]),
    });
    this.serviceAmounts.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        if (value) {
          this.serviceAmountsArray = value.filter(
            (x: any) => x.service != null || x.amount != null
          );
        }
      });
  }
  get serviceAmounts(): FormArray {
    return this.form.get("serviceAmounts") as FormArray;
  }

  bindForm() {
    this.form.patchValue(this.workOrder);
    this.serviceAmounts.clear();
    if (this.workOrder.serviceAmounts.length == 0) {
      this.onAddServiceAmounts();
    } else {
      this.workOrder.serviceAmounts.forEach((element) => {
        this.bindserviceAmounts(element);
      });
      this.addserviceAmounts();
    }
  }

  getErrorMessage(control?: AbstractControl) {
    return this.utilityService.getErrorMessage(control);
  }

  onUpload(uploads: UploadResult[]) {
    let _createRequests: any[] = [];
    uploads.forEach((x) => {
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

    forkJoin(_createRequests).subscribe((results) => {
      console.log("createdAttachments", results);
      results.forEach((x) => {
        this.workOrder.attachments.push(x as ProjectWorkOrderAttachment);
      });
    });
  }

  private touchForm() {
    Object.keys(this.form.controls).forEach((field) => {
      const control = this.form.get(field);
      if (control != null) {
        control.markAsTouched({ onlySelf: true });
      }
    });
  }

  onClose() {
    this.dialogRef.close(this.workOrder);
  }

  async onDeleteAttachment(workOrderAttachment: ProjectWorkOrderAttachment) {
    this.utilityService.showConfirmationDialog(
      "Are you sure you want to delete this attachment",
      async () => {
        await firstValueFrom(
          this.projectWorkOrderAttachmentApiService.delete(
            workOrderAttachment.id
          )
        );
        this.workOrder.attachments = this.workOrder.attachments.filter(
          (x) => x.id != workOrderAttachment.id
        );
      }
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

    this.workOrder = Object.assign(this.workOrder, this.form.value);
    this.workOrder.serviceAmounts = [];

    this.workOrder = await firstValueFrom(
      this.projectWorkOrderApiService.update(this.workOrder)
    );
    console.log("this.workOrder", this.workOrder.id);
    // this.addServiceAmount();

    this.utilityService.showSwalToast(
      "",
      "Work Order updated successfully",
      "success"
    );
    this.dialogRef.close(this.workOrder);
  }

  addServiceAmount(): void {
    const _requests: any[] = [];
    console.log("this.workOrder.id", this.workOrder.id);

    const serviceData = this.serviceAmountsArray;

    if (serviceData.length === 0) {
      console.warn("No service data to process.");
      return;
    }

    serviceData
      .filter((x: any) => (x.service != null || x.amount != null) && !x.id) // Only new ones without ID
      .forEach((x: any) => {
        const obj = new ProjectWorkOrderServiceAmount();
        obj.projectWorkOrderID = this.workOrder.id;
        obj.service = x.service;
        obj.amount = x.amount;

        _requests.push(this.projectWorkOrderServiceAmountService.create(obj));
      });

    if (_requests.length === 0) {
      console.warn("No new service amounts to create.");
      return;
    }

    forkJoin(_requests).subscribe(
      (results: ProjectWorkOrderServiceAmount[]) => {
        // 1. Add created entries to workOrder.serviceAmounts
        this.workOrder.serviceAmounts = this.workOrder.serviceAmounts || [];
        this.workOrder.serviceAmounts.push(...results);

        // 2. Patch the FormArray with the returned IDs
        results.forEach((createdItem) => {
          const formIndex = this.serviceAmountsArray.findIndex(
            (item: any) =>
              item.service === createdItem.service &&
              item.amount === createdItem.amount &&
              !item.id
          );
          if (formIndex !== -1) {
            this.serviceAmounts
              .at(formIndex)
              .patchValue({ id: createdItem.id });
          }
        });

        console.log(
          "Service amounts created and updated in workOrder:",
          results
        );
      }
    );
  }

  updateServiceAmountAt(index: number): void {
    const control = this.serviceAmounts.at(index);
    if (!control) return;

    const value = control.value;

    if (!value.id || (!value.service && !value.amount)) return;

    const obj = new ProjectWorkOrderServiceAmount();
    obj.id = value.id;
    obj.projectWorkOrderID = this.workOrder.id;
    obj.service = value.service;
    obj.amount = value.amount;

    this.projectWorkOrderServiceAmountService.update(obj).subscribe((res) => {
      console.log(`Updated service amount at index ${index}:`, res);

      // Optional: update that FormGroup with any new values
      this.serviceAmounts.at(index).patchValue(res);

      const workOrderIndex = this.workOrder.serviceAmounts?.findIndex(
        (item: any) => item.id === res.id
      );

      if (workOrderIndex !== undefined && workOrderIndex !== -1) {
        this.workOrder.serviceAmounts[workOrderIndex] = res;
      } else {
        // Optionally push it if not present
        this.workOrder.serviceAmounts = this.workOrder.serviceAmounts || [];
        this.workOrder.serviceAmounts.push(res);
      }
    });
  }

  onAddServiceAmounts() {
    this.addServiceAmount();
    this.addserviceAmounts();
  }

  addserviceAmounts() {
    this.serviceAmounts.push(
      this.formBuilder.group({
        id: new FormControl<any>(null), // ✅ Preserve ID
        projectWorkOrderID: new FormControl<any>(this.workOrder.id),
        service: new FormControl<any>(null),
        amount: new FormControl<any>(null, {
          validators: [
            Validators.pattern(/^\d+$/), // Number only validation
          ],
        }),
      })
    );
  }

  bindserviceAmounts(item: ProjectWorkOrderServiceAmount) {
    this.serviceAmounts.push(
      this.formBuilder.group({
        id: new FormControl<any>(item.id), // ✅ Preserve ID
        projectWorkOrderID: new FormControl<any>(item.projectWorkOrderID),
        service: new FormControl<any>(item.service),
        amount: new FormControl<any>(item.amount, {
          validators: [
            Validators.pattern(/^\d+$/), // Number only validation
          ],
        }),
      })
    );
  }

  async onRemoveserviceAmounts(index: number) {
    this.utilityService.showConfirmationDialog(
      "Delete this Service & Amount",
      async () => {
        this.serviceAmounts.removeAt(index);

        const removedObj = this.serviceAmountsArray[index];
        this.workOrder.serviceAmounts = this.workOrder.serviceAmounts.filter(
          (x) => x.id !== removedObj.id
        );
        await firstValueFrom(
          this.projectWorkOrderServiceAmountService.delete(removedObj.id)
        );
      }
    );
  }

  // onFormArrayFieldChange(index: number, fieldName: string): void {
  //   const formGroup = this.serviceAmounts.at(index);
  //   if (!formGroup) return;

  //   const value = formGroup.value;
  //   // only pass the changed item
  // }
}
