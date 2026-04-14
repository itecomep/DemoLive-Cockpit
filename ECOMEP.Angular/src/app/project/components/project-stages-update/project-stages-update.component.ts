import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormGroup,
  FormArray,
  FormBuilder,
  FormControl,
  Validators,
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Router } from "@angular/router";
import { firstValueFrom, forkJoin, Observable } from "rxjs";
import { AppConfig } from "src/app/app.config";
import { UtilityService } from "src/app/shared/services/utility.service";
import { ProjectStage } from "../../models/project-stage.model";
import { Project } from "../../models/project.model";
import { ProjectStageApiService } from "../../services/project-stage-api.service";
import { ProjectStageMasterApiService } from "../../services/project-stage-master-api.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ProjectStageMasterComponent } from "../project-stage-master/project-stage-master.component";
import { ProjectStagesCreateComponent } from "../project-stages-create/project-stages-create.component";
import { ProjectApiService } from "../../services/project-api.service";
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from "@angular/cdk/drag-drop";
import { MatMenuModule } from "@angular/material/menu";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { ProjectStageDateUpdateDialogComponent } from "../project-stage-date-update-dialog/project-stage-date-update-dialog.component";
import { AuthService } from "src/app/auth/services/auth.service";
import { AppPermissions } from "src/app/app.permissions";

@Component({
  selector: "app-project-stages-update",
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    MatMenuModule,
    MatOptionModule,
    MatSelectModule,
    MatDatepickerModule,
    MatIconModule,
  ],
  templateUrl: "./project-stages-update.component.html",
  styleUrls: ["./project-stages-update.component.scss"],
})
export class ProjectStagesUpdateComponent {
  form!: FormGroup;
  project!: Project;
  isExpanded: boolean[] = [];
  scopeOfWork = new FormControl();
  readonly PROJECT_STAGE_UPDATE_LIMIT = this.config.PROJECT_STAGE_UPDATE_LIMIT;

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
  filteredProjectStageStatus: any[] = [];
  newStages: ProjectStage[] = [];

  @Input("project") set projectValue(val: Project) {
    if (val) {
      this.project = val;
      this.scopeOfWork.setValue(this.project.scopeOfWork);
      this.createStageTree();

      if (!this.form) {
        this.buildForm();
      }
      if (this.project.stages.length == 0) {
        this.getStages();
      } else {
        this.bindForm();
      }
    }
  }

  projectProgress: number = 0;
  get f(): any {
    return this.form.controls;
  }
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

  //   get stages() {
  //     return this.project?.stages?.filter(x =>
  //         x.typeFlag === this.PROJECT_STAGE_TYPE_FLAG_WORK
  //     ) || [];
  // }

  get stages() {
    return this.project.stages
      .filter((x) => x.typeFlag == this.PROJECT_STAGE_TYPE_FLAG_WORK && !x.isReadOnly)
      .sort((a, b) => a.orderFlag - b.orderFlag);
  }

  get viewStages() {
    return this.project.stages
      .filter((x) => x.typeFlag == this.PROJECT_STAGE_TYPE_FLAG_WORK)
      .sort((a, b) => a.orderFlag - b.orderFlag);
  }
  get isMobileView(): boolean {
    return this.utilityService.isMobileView;
  }

  get stageTotal() {
    return this.project.stages
      .filter((x) => x.typeFlag == this.PROJECT_STAGE_TYPE_FLAG_WORK && !x.isReadOnly)
      .map((x) => x.percentage)
      .reduce((a, b) => a + b, 0);
  }

  get stageTotalProgress() {
    return this.project.stages
      .filter((x) => x.typeFlag == this.PROJECT_STAGE_TYPE_FLAG_WORK)
      .filter((x) => x.statusFlag == this.PROJECT_STAGE_STATUS_FLAG_COMPLETED)
      .map((x) => x.percentage)
      .reduce((a, b) => a + b, 0);
  }
  // get stageManualProgress() {
  //   return this.project.stages.filter(x => x.typeFlag == this.PROJECT_STAGE_TYPE_FLAG_WORK)
  //     .filter(x => x.statusFlag == this.PROJECT_STAGE_STATUS_FLAG_COMPLETED)
  //     .filter(x => x.entity == undefined)
  //     .map(x => x.percentage).reduce((a, b) => a + b, 0);
  // }
  // get stageJobProgress() {
  //   return this.project.stages.filter(x => x.typeFlag == this.PROJECT_STAGE_TYPE_FLAG_WORK)
  //     .filter(x => x.statusFlag == this.PROJECT_STAGE_STATUS_FLAG_COMPLETED)
  //     .filter(x => x.entity == this.config.NAMEOF_ENTITY_JOB)
  //     .map(x => x.percentage).reduce((a, b) => a + b, 0);
  // }
  get stageMeetingProgress() {
    return this.project.stages
      .filter((x) => x.typeFlag == this.PROJECT_STAGE_TYPE_FLAG_WORK)
      .filter((x) => x.statusFlag == this.PROJECT_STAGE_STATUS_FLAG_COMPLETED)
      .filter((x) => x.entity == this.config.NAMEOF_ENTITY_MEETING)
      .map((x) => x.percentage)
      .reduce((a, b) => a + b, 0);
  }

  get stagePendingProgress() {
    return this.project.stages
      .filter((x) => x.typeFlag == this.PROJECT_STAGE_TYPE_FLAG_WORK)
      .filter((x) => x.statusFlag != this.PROJECT_STAGE_STATUS_FLAG_COMPLETED)
      .map((x) => x.percentage)
      .reduce((a, b) => a + b, 0);
  }

  get fa() {
    return this.f["stagesFA"] as FormArray;
  }
  @Output() update = new EventEmitter();

  get isEditMode() {
    return this.projectService.isEditMode;
  }
  get isPermissionStagesEdit() {
    return this.projectService.isPermissionStagesEdit;
  }
  get isPermissionStageMasters() {
    return this.projectService.isPermissionStagesMaster;
  }
  get isPermissionStagesSpecialEdit() {
    return this.projectService.isPermissionStagesSpecialEdit;
  }
  get isPermissionStagesTargetDate() {
    return this.projectService.isPermissionStagesTargetDate;
  }
  get isPermissionStagesDelete() {
    return this.projectService.isPermissionStagesDelete;
  }
  get isPermissionStagesStatusEdit() {
    return this.projectService.isPermissionStagesStatusEdit;
  }
  get isTeamLead() {
    return this.authService.isTeamLeader;
  }
  get isPermissionMaster() {
    return this.projectService.isPermissionMaster;
  }
  constructor(
    private config: AppConfig,
    private formBuilder: FormBuilder,
    private utilityService: UtilityService,
    private projectService: ProjectApiService,
    private projectStageMasterService: ProjectStageMasterApiService,
    private projectStageService: ProjectStageApiService,
    private router: Router,
    private dialog: MatDialog,
    public authService: AuthService,
    private permissions: AppPermissions
  ) { }

  ngOnInit() {
    // if (this.isTeamLead && !this.isPermissionMaster) {
    //   this.filteredProjectStageStatus = this.projectStageStatus.filter(
    //     (item) =>
    //       item.value === this.config.PROJECT_STAGE_STATUS_FLAG_PENDING ||
    //       item.value === this.config.PROJECT_STAGE_STATUS_FLAG_COMPLETED
    //   );
    // } else {
    this.filteredProjectStageStatus = [...this.projectStageStatus];
    // }
  }

  private async getStages() {
    this.project.stages = await firstValueFrom(
      this.projectStageService.get([
        { key: "projectId", value: this.project.id.toString() },
      ])
    );
    this.project.stages.sort((a, b) => a.orderFlag - b.orderFlag);
    this.createStageTree();
    this.bindForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      stagesFA: this.formBuilder.array([]),
    });
    this.touchForm();
  }

  touchForm() {
    if (this.form) {
      Object.keys(this.form.controls).forEach((field) => {
        const control = this.form.get(field);
        if (control) control.markAsTouched({ onlySelf: true });
      });
    }
  }

  bindForm() {
    this.fa.clear();
    this.project.stages
      .filter((x) => x.typeFlag == this.PROJECT_STAGE_TYPE_FLAG_WORK && !x.isReadOnly)
      .forEach((item: ProjectStage) => {
        this.addInput(item);
      });
    this.addInput(null);
  }

  private addInput(value: ProjectStage | null) {
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
      workOrderStageTitle: new FormControl<any>(null),
      workOrderStageValue: new FormControl<any>(0, [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
      ]),
      statusFlag: new FormControl<any>(0, [Validators.required]),
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
    entity?: ProjectStage
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
      // console.log(entity);
      entity = await firstValueFrom(
        this.projectStageService.update(entity, true)
      );
      this.utilityService.showSwalToast(
        "Success",
        "Stage updated successfully",
        "success"
      );

      // this.update.emit(this.project);
    }
  }

  getErrorMessage(control?: AbstractControl) {
    return this.utilityService.getErrorMessage(control);
  }

  async onSetStage(stage: ProjectStage, statusFlag: number) {
    stage.statusFlag = statusFlag;
    await firstValueFrom(this.projectStageService.update(stage));
  }

  onClickOpenMaster() {
    const _dialogConfig = new MatDialogConfig();
    _dialogConfig.autoFocus = true;

    const _dialogRef = this.dialog.open(
      ProjectStageMasterComponent,
      _dialogConfig
    );
    _dialogRef.afterClosed().subscribe((res) => {
      // console.log(res);
    });
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

  onAddStage() {
    const _dialogConfig = new MatDialogConfig();
    _dialogConfig.autoFocus = true;

    _dialogConfig.data = {
      project: this.project,
      orderFlag:
        this.project.stages.length > 0
          ? this.project.stages[this.project.stages.length - 1].orderFlag + 1
          : 0,
    };

    const _dialogRef = this.dialog.open(
      ProjectStagesCreateComponent,
      _dialogConfig
    );
    _dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.project.stages.push(res);
        this.getStages();
        this.createStageTree();
        // this.addInput(res);
      }
    });
  }

  onDeleteStage(stage: ProjectStage) {
    this.utilityService.showConfirmationDialog(
      `Do you want to delete ${stage.title} stage?`,
      async () => {
        await firstValueFrom(this.projectStageService.delete(stage.id));
        this.project.stages = this.project.stages.filter(
          (x) => x.id != stage.id
        );
        this.update.emit(this.project);
      }
    );
  }

  // async onDrop(event: CdkDragDrop<ProjectStage[]>) {
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex
  //     );
  //     if (event.previousIndex != event.currentIndex) {
  //       let _requests: Observable<any>[] = [];
  //       event.container.data.forEach((x, i) => {
  //         x.orderFlag = i + 1;
  //         _requests.push(this.projectStageService.update(x, true));
  //       });
  //       const _results = await firstValueFrom(forkJoin(_requests));
  //       // this.project.stages = this.project.stages.filter(
  //       //   (x) => x.typeFlag == this.PROJECT_STAGE_TYPE_FLAG_PAYMENT
  //       // );
  //       // this.project.stages.push(..._results);
  //       this.newStages = [];
  //       this.newStages.push(..._results);
  //       this.newStages.sort((a, b) => a.orderFlag - b.orderFlag)
  //       this.buildForm();
  //       this.bindForm();
  //     }
  //   }
  // }

  async onDrop(event: CdkDragDrop<ProjectStage[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      if (event.previousIndex !== event.currentIndex) {
        const requests: Observable<ProjectStage>[] = [];

        event.container.data.forEach((x, i) => {
          x.orderFlag = i + 1;
          requests.push(this.projectStageService.update(x, true));
        });

        const results = await firstValueFrom(forkJoin(requests));
        this.newStages = results.sort((a, b) => a.orderFlag - b.orderFlag);

        this.project.stages = [
          ...this.project.stages.filter(
            s => s.typeFlag !== this.PROJECT_STAGE_TYPE_FLAG_WORK || s.isReadOnly
          ),
          ...this.newStages
        ].sort((a, b) => a.orderFlag - b.orderFlag);

        this.buildForm();
        this.bindForm();
      }
    }
  }



  createStageTree() {
    const stageMap = new Map<number, ProjectStage>(
      this.project.stages.map((stage) => [stage.id, { ...stage, children: [] }])
    );

    let tree: ProjectStage[] = [];

    this.project.stages.forEach((stage) => {
      if (stage.parentID && stageMap.has(stage.parentID)) {
        // Push the stage into its parent's children array
        stageMap.get(stage.parentID)!.children.push(stageMap.get(stage.id)!);
      } else {
        // If no parent, it's a root stage
        tree.push(stageMap.get(stage.id)!);
      }
    });

    // Assign the structured tree to the project stages
    this.project.stages = tree;
    // console.log(this.project.stages);

    this.newStages = this.project.stages
      .filter((x) => x.typeFlag == this.PROJECT_STAGE_TYPE_FLAG_WORK && !x.isReadOnly)
      .sort((a, b) => a.orderFlag - b.orderFlag);

    // console.log(this.newStages);
  }

  toggleExpand(i: number) {
    this.isExpanded[i] = !this.isExpanded[i];
  }

  isDueDateDisabled(item: ProjectStage): boolean {
    return (
      (item.children?.length || 0) >= this.PROJECT_STAGE_UPDATE_LIMIT &&
      !this.isPermissionStagesSpecialEdit
    );
  }

  onEditTargetDate(stage: ProjectStage) {
    const _dialogConfig = new MatDialogConfig();
    _dialogConfig.disableClose = true;
    _dialogConfig.autoFocus = true;
    _dialogConfig.data = {
      stage: stage,
    };

    const _dialogRef = this.dialog.open(
      ProjectStageDateUpdateDialogComponent,
      _dialogConfig
    );
    _dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        // console.log(res);
        this.getStages();
        this.createStageTree();
      }
    });
  }

  async onSubmit() {
    this.project.scopeOfWork = this.scopeOfWork.value;
    this.project = await firstValueFrom(
      this.projectService.update(this.project)
    );
    this.utilityService.showSwalToast(
      "Success",
      "Project updated successfully",
      "success"
    );
    this.update.emit(this.project);
  }

  getStatusTitle(statusFlag: number): string {
    const status = this.filteredProjectStageStatus.find(
      (item) => item.value === statusFlag
    );
    return status ? status.title : "";
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
}
