import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AppConfig } from 'src/app/app.config';
import { Contact } from 'src/app/contact/models/contact';

import { AppService } from 'src/app/shared/services/app.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { AppPermissions } from 'src/app/app.permissions';
import { environment } from 'src/environments/environment';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { CockpitComponent } from '../cockpit/cockpit.component';
import { HeaderComponent } from 'src/app/mcv-header/components/header/header.component';
import { TaskAnalysisComponent } from 'src/app/task-analysis/components/task-analysis/task-analysis.component';
import { CommonModule } from '@angular/common';
import { ProjectAnalysisComponent } from 'src/app/project/components/project-analysis/project-analysis.component';
import { TeamTaskProgressChartComponent } from 'src/app/task-analysis/components/team-task-progress-chart/team-task-progress-chart.component';
import { ProjectProgressChartComponent } from 'src/app/project/components/project-progress-chart/project-progress-chart.component';
import { ProjectBillApiService } from 'src/app/project/services/project-bill-api.service';
import { ProjectBillAnalysisComponent } from 'src/app/project/components/project-bill-analysis/project-bill-analysis.component';
import { TodoAnalysisComponent } from 'src/app/todo/components/todo-analysis/todo-analysis.component';
import { ProjectStagesAnalysisComponent } from 'src/app/project/components/project-stages-analysis/project-stages-analysis.component';
import { CockpitTeamCalendarComponent } from '../cockpit-team-calendar/cockpit-team-calendar.component';
import { CockpitMyCalendarComponent } from '../cockpit-my-calendar/cockpit-my-calendar.component';
import { AssetMaintenanceComponent } from "src/app/asset/components/asset-maintenance/asset-maintenance.component";
import { AssetApiService } from 'src/app/asset/services/asset-api.service';
import { EmailListComponent } from '../../../email-list/email-list.component';
import { FileComponent } from 'src/app/file/file.component';

@Component({
  selector: 'app-cockpit-view',
  templateUrl: './cockpit-view.component.html',
  styleUrls: ['./cockpit-view.component.scss'],
  standalone: true,
  imports: [
    MatTabsModule,
    MatIconModule,
    CommonModule,
    //Components
    TaskAnalysisComponent,
    CockpitComponent,
    HeaderComponent,
    ProjectAnalysisComponent,
    TeamTaskProgressChartComponent,
    ProjectProgressChartComponent,
    ProjectBillAnalysisComponent,
    TodoAnalysisComponent,
    ProjectStagesAnalysisComponent,
    CockpitTeamCalendarComponent,
    CockpitMyCalendarComponent,
    AssetMaintenanceComponent,
    EmailListComponent,
    FileComponent
]
})
export class CockpitViewComponent implements OnInit, OnDestroy {
  selectedTabIndex = 0;
  headerTitle!: string;
  logoUrl: string = environment.logoUrl;
  get isPermissionProjectProgress(): boolean {
    return this.authService.isInAnyRole([this.permissions.PROJECT_PROGRESS]);
  }
  get isPermissionProjectAnalysis(): boolean {
    return this.authService.isInAnyRole([this.permissions.PROJECT_ANALYSIS]);
  }
  get isPermissionTeamProgress(): boolean {
    return this.authService.isInAnyRole([this.permissions.TEAM_PROGRESS]);
  }

  get isPermissionSpecificationManufacturerAnalysis(): boolean {
    return this.authService.isInAnyRole([this.permissions.SPECIFICATION_MANUFACTURER_ANALYSIS]);
  }

  get isPermissionMaster(): boolean {
    return this.authService.isInAnyRole([this.permissions.MASTER]);
  }

  get isPermissionStageAnalysisView():boolean{
    return this.authService.isInAnyRole([this.permissions.PROJECT_STAGES_ANALYSIS]);
  }

  get isPermissionTeamCalendarView():boolean{
    return this.authService.isInAnyRole([this.permissions.TEAM_CALENDAR]);
  }

  get isPermissionGmailView():boolean{
    return this.authService.isInAnyRole([this.permissions.GMAIL_DASHBOARD_VIEW]);
  }

  get isPermissionFileView():boolean{
    return this.authService.isInAnyRole([this.permissions.FILE_DASHBOARD_VIEW]);
  }

  get isPermissionTodoAnalysis():boolean{
    return this.authService.isInAnyRole([this.permissions.TODO_ANALYSIS])
  }

  get isAppointed(): boolean {
    if (this.authService.currentUserStore?.contact) {
      return this.authService.currentUserStore?.contact.appointments
        .filter(x => x.statusFlag == this.config.TEAM_APPOINTMENT_STATUS_APPOINTED).length != 0;
    }
    return false;
  }

  get isPermissionProjectBillAnalysis(){
    return this.projectBillService.isPermissionAnalysisView;
  }

  get isPermissionAssetMaintenanceView(){
    return this.assetService.isPermissionMaintenanceView;
  }

  constructor(
    private router: Router,
    private config: AppConfig,
    private appService: AppService,
    private authService: AuthService,
    private permissions: AppPermissions,
    private activatedRoute: ActivatedRoute,
    private presetMasterService: AppSettingMasterApiService,
    private projectBillService: ProjectBillApiService,
    private assetService:AssetApiService
  ) { }

  get currentUser(): Contact | any {
    if (this.authService.currentUserStore) {
      return this.authService.currentUserStore.contact ? this.authService.currentUserStore.contact : null;
    }
  }


  ngOnDestroy(): void {
    this.appService.resetHeader();
  }

  ngOnInit() {
    this.headerTitle = this.activatedRoute.snapshot.data['title'];
    // this.appService.setHeaderTitle(this.activatedRoute.snapshot.data.title);
    this.presetMasterService.loadPresets();

    this.activatedRoute.queryParamMap.subscribe((params: ParamMap) => {
      // console.log('param',params);
      this.selectedTabIndex = Number(params.get('index'));
    });

  }

  onSelectedTabIndexChange(index: number) {
    this.router.navigate([this.config.ROUTE_COCKPIT], {
      queryParams: JSON.parse(`{"index":"${index}"}`),
      relativeTo: this.activatedRoute
    });
  }

  connectGmail() {
    const authUrl = `${environment.apiPath}/api/gmail/auth`;
    window.location.href = authUrl;
  }

}
