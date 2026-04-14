import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../models/project.model';
import { firstValueFrom, forkJoin, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AppConfig } from 'src/app/app.config';
import { ProjectStageApiService } from '../../services/project-stage-api.service';
import { ProjectStageMasterComponent } from '../project-stage-master/project-stage-master.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProjectStageMasterApiService } from '../../services/project-stage-master-api.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProjectStageMaster } from '../../models/project-stage-master.model';
import { ProjectStage } from '../../models/project-stage.model';
import { ProjectStagesCreateComponent } from '../project-stages-create/project-stages-create.component';
import { ProjectApiService } from '../../services/project-api.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-project-stages',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,

    //Components
    ProjectStageMasterComponent
  ],
  templateUrl: './project-stages.component.html',
  styleUrls: ['./project-stages.component.scss']
})
export class ProjectStagesComponent {

  project!: Project;
  isExpanded: boolean[] = [];
  stageMaster: ProjectStageMaster[] = [];
  @Input('project') set projectValue(val: Project) {
    if (val) {
      this.project = val;
      this.getStages();
    }
  }

  projectProgress: number = 0;

  get PROJECT_STAGE_STATUS_FLAG_PENDING() { return this.config.PROJECT_STAGE_STATUS_FLAG_PENDING; }
  get PROJECT_STAGE_STATUS_FLAG_COMPLETED() { return this.config.PROJECT_STAGE_STATUS_FLAG_COMPLETED; }
  get PROJECT_STAGE_STATUS_FLAG_BILLED() { return this.config.PROJECT_STAGE_STATUS_FLAG_BILLED; }
  get PROJECT_STAGE_STATUS_FLAG_PAYMENT_RECEIVED() { return this.config.PROJECT_STAGE_STATUS_FLAG_PAYMENT_RECEIVED; }

  get PROJECT_STAGE_TYPE_FLAG_WORK() { return this.projectStageService.PROJECT_STAGE_TYPE_FLAG_WORK; }
  get PROJECT_STAGE_TYPE_FLAG_PAYMENT() { return this.projectStageService.PROJECT_STAGE_TYPE_FLAG_PAYMENT; }

  get stages() { return this.project.stages.filter(x => x.typeFlag == this.PROJECT_STAGE_TYPE_FLAG_WORK).sort((a, b) => a.orderFlag - b.orderFlag); }
  get isEditMode() { return this.projectApiService.isEditMode; }

  get stageTotal() { return this.project.stages.filter(x => x.typeFlag == this.PROJECT_STAGE_TYPE_FLAG_WORK).map(x => x.percentage).reduce((a, b) => a + b, 0); }
  get stageTotalProgress() {
    return this.project.stages.filter(x => x.typeFlag == this.PROJECT_STAGE_TYPE_FLAG_WORK)
      .filter(x => x.statusFlag == this.PROJECT_STAGE_STATUS_FLAG_COMPLETED)
      .map(x => x.percentage).reduce((a, b) => a + b, 0);
  }
  get stageManualProgress() {
    return this.project.stages.filter(x => x.typeFlag == this.PROJECT_STAGE_TYPE_FLAG_WORK)
      .filter(x => x.statusFlag == this.PROJECT_STAGE_STATUS_FLAG_COMPLETED)
      .filter(x => x.entity == undefined)
      .map(x => x.percentage).reduce((a, b) => a + b, 0);
  }
  // get stageJobProgress() {
  //   return this.project.stages.filter(x => x.typeFlag == this.PROJECT_STAGE_TYPE_FLAG_WORK)
  //     .filter(x => x.statusFlag == this.PROJECT_STAGE_STATUS_FLAG_COMPLETED)
  //     .filter(x => x.entity == this.config.NAMEOF_ENTITY_JOB)
  //     .map(x => x.percentage).reduce((a, b) => a + b, 0);
  // }
  get stageMeetingProgress() {
    return this.project.stages.filter(x => x.typeFlag == this.PROJECT_STAGE_TYPE_FLAG_WORK)
      .filter(x => x.statusFlag == this.PROJECT_STAGE_STATUS_FLAG_COMPLETED)
      .filter(x => x.entity == this.config.NAMEOF_ENTITY_MEETING)
      .map(x => x.percentage).reduce((a, b) => a + b, 0);
  }

  get stagePendingProgress() {
    return this.project.stages.filter(x => x.typeFlag == this.PROJECT_STAGE_TYPE_FLAG_WORK)
      .filter(x => x.statusFlag != this.PROJECT_STAGE_STATUS_FLAG_COMPLETED)
      .map(x => x.percentage).reduce((a, b) => a + b, 0);
  }

  get isPermissionStagesEdit() { return this.projectService.isPermissionStagesEdit; }
  get isPermissionStageMasters() { return this.projectService.isPermissionStagesMaster; }
  @Output() update = new EventEmitter();
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private config: AppConfig,
    private projectApiService: ProjectApiService,
    private projectStageService: ProjectStageApiService,
    private projectService: ProjectApiService,
    private projectStageMasterService: ProjectStageMasterApiService,
  ) {

  }

  async getStages() {
    const _data = await firstValueFrom(this.projectStageService.get([{ key: 'projectId', value: this.project.id.toString() }]));
    if (_data) {
      this.project.stages = _data;
      this.project.stages.sort((a, b) => a.orderFlag - b.orderFlag);
      this.createStageTree();
    }
  }

  async loadData() {
    const _data = await firstValueFrom(this.projectStageMasterService.get());
    if (_data) {
      this.stageMaster = _data;

      let _createRequests: Observable<any>[] = [];
      this.stageMaster.forEach(x => {
        const _stage = new ProjectStage();
        _stage.title = x.title;
        _stage.percentage = x.percentage;
        _stage.projectID = this.project.id;
        _createRequests.push(this.projectStageService.create(_stage));
      });
      const results = await firstValueFrom(forkJoin(_createRequests));
      if (results && results.length > 0) {
        this.project.stages.push(...results);
      }
    }
  }

  onAddProjectStage() {
    const _dialogConfig = new MatDialogConfig();
    _dialogConfig.autoFocus = true;
  
    _dialogConfig.data = {
      project: this.project
    }

    const _dialogRef = this.dialog.open(ProjectStagesCreateComponent, _dialogConfig);
    _dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.project.stages.unshift(res);
      }
    });
  }

  onClickOpenMaster() {
    const _dialogConfig = new MatDialogConfig();
    _dialogConfig.autoFocus = true;
  

    const _dialogRef = this.dialog.open(ProjectStageMasterComponent, _dialogConfig);
    _dialogRef.afterClosed().subscribe(res => {

    })
    // this.projectStageService.openDialog(ProjectStageMasterComponent);
  }

  createStageTree() {
    const stageMap = new Map<number, ProjectStage>(
      this.project.stages.map(stage => [stage.id, { ...stage, children: [] }])
    );

    let tree: ProjectStage[] = [];

    this.project.stages.forEach(stage => {
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
  }

  toggleExpand(i: number) {
    this.isExpanded[i] = !this.isExpanded[i];
  }
}
