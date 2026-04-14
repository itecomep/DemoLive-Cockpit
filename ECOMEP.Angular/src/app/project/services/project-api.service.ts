import { ComponentType } from "@angular/cdk/portal";
import { Injectable, TemplateRef } from "@angular/core";
import { Observable } from "rxjs";
import { McvBaseApiService } from "src/app/shared/services/mcv-base-api.service";
import { Meeting } from "src/app/meeting/models/meeting.model";
import { RequestTicket } from "src/app/request-ticket/models/request-ticket";
import { Project } from "../models/project.model";
import { HttpParams } from "@angular/common/http";
import { ApiFilter } from "src/app/shared/models/api-filters";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class ProjectApiService extends McvBaseApiService
{
  get nameOfEntity() { return this.config.NAMEOF_ENTITY_PROJECT; }
  private _isEditMode: boolean = false;
  get isEditMode(): boolean { return this._isEditMode; }
  set isEditMode(value: boolean) { this._isEditMode = value; }
  
  override defaultRoute=this.config.ROUTE_PROJECT_LIST;
  override apiRoute = this.config.apiProjects;
  constructor()
  {
    super();
  }

  //Project List/Definition Permissions
  override get isPermissionList(): boolean
  {
    return this.authService.isInAnyRole([this.permissions.PROJECT_LIST]);
  }

  override get isPermissionEdit(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_EDIT
    ]);
  }

  override get isPermissionDelete(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_DELETE
    ]);
  }

  //Billing Permissions
  get isPermissionBillingView(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_BILLING_VIEW,
    ]);
  }

  get isPermissionBillingEdit(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_BILLING_EDIT,
    ]);
  }

  //Association Permissions
  get isPermissionAssociationsView(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_ASSOCIATIONS_VIEW,
    ]);
  }

  get isPermissionAssociationsEdit(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_ASSOCIATIONS_EDIT,
    ]);
  }

  get isPermissionAssociationsDelete(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_ASSOCIATIONS_DELETE,
    ]);
  }

  //Notes Permissions
  get isPermissionNotesView(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_NOTES_VIEW,
    ]);
  }

  get isPermissionNotesEdit(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_NOTES_EDIT,
    ]);
  }

  //Inwards Permissions
  get isPermissionInwardsView(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_INWARDS_VIEW,
    ]);
  }

  get isPermissionInwardsEdit(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_INWARDS_EDIT,
    ]);
  }

  //Photos Permissions
  get isPermissionPhotosView(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_PHOTOS_VIEW,
    ]);
  }

  get isPermissionPhotosEdit(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_PHOTOS_EDIT,
    ]);
  }

  //Stages Permissions
  get isPermissionStagesView(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_STAGES_VIEW,
    ]);
  }

  get isPermissionStagesEdit(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_STAGES_EDIT,
    ]);
  }

  get isPermissionStagesDelete(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_STAGES_DELETE,
    ]);
  }

  get isPermissionStagesTargetDate(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_STAGES_TARGET_DATE,
    ]);
  }

  get isPermissionStagesMaster(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_STAGES_MASTER,
    ]);
  }

  get isPermissionMaster(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.MASTER,
    ]);
  }

  get isPermissionStagesSpecialEdit(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_STAGES_SPECIAL_EDIT,
    ]);
  }

  get isPermissionStageAnalysisView(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_STAGES_ANALYSIS,
    ]);
  }

  get isPermissionMeetingsView(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_MEETINGS_VIEW,
    ]);
  }

  get isPermissionFileDms(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_FILE_DMS,
    ]);
  }

  get isPermissionFileDmsDelete(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.FILE_DMS_DELETE,
    ]);
  }

  get isPermissionFileDmsFolderEdit(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.FILE_DMS_FOLDER_EDIT,
    ]);
  }

  get isPermissionFolderAdd(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.FILE_DMS_FOLDER_ADD,
    ]);
  }

  get isPermissionSubFolderAdd(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.FILE_DMS_SUB_FOLDER_ADD,
    ]);
  }

  get isPermissionRequestTicketsView(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_EMAIL_VIEW,
    ]);
  }

  //Team Permissions
  get isPermissionTeamView(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_TEAM_VIEW,
    ]);
  }

  get isPermissionTeamEdit(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_TEAM_EDIT,
    ]);
  }

  get isPermissionTeamDelete(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_TEAM_DELETE,
    ]);
  }

  //DMS Permissions
  get isPermissionDMSView(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_DOCUMENTS_VIEW
    ]);
  }

  get isPermissionDMSEdit(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_DOCUMENTS_EDIT
    ]);
  }

  get isPermissionDMSDelete(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_DOCUMENTS_DELETE
    ]);
  }

  get isPermissionDMSSetting(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_DOCUMENTS_SETTINGS
    ]);
  }

  //Todo Permissions
  get isPermissionTodoView(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_TODO_VIEW
    ]);
  }

  override get isPermissionSpecialShowAll(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_SPECIAL_SHOW_ALL
    ]);
  }

  //WorkOrder Permission
  get isPermissionWorkOrderView(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_WORKORDER_VIEW,
    ]);
  }

  get isPermissionWorkOrderEdit(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_WORKORDER_EDIT,
    ]);
  }

  get isPermissionWorkOrderDelete(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_WORKORDER_DELETE,
    ]);
  }

  get isPermissionWorkOrderServiceMaster(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_WORKORDER_SERVICE_MASTER,
    ]);
  }

  //Offer Permission
  get isPermissionOfferView(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_OFFER_VIEW,
    ]);
  }

  get isPermissionOfferEdit(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_OFFER_EDIT,
    ]);
  }

  get isPermissionOfferDelete(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_OFFER_DELETE,
    ]);
  }

  get isPermissionStagesStatusEdit(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_STAGES_STATUS_EDIT,
    ]);
  }

  get isPermissionGmailView(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_GMAIL_VIEW,
    ]);
  }

  get isPermissionAllowedIpBypassView(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_ALLOWED_IP_BYPASS_VIEW,
    ]);
  }

  // Checklist Permission
  get isPermissionChecklistView(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.CHECKLIST_VIEW
    ]);
  }

  get isPermissionChecklistEdit(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.CHECKLIST_EDIT
    ]);
  }


  getNewCode(): Observable<any>
  {
    return this.http.get<any>(this.apiRoute + '/NewCode');
  }

  isExist(title: string): Observable<any>
  {
    return this.http.get<any>(this.apiRoute + '/Exists', { params: { title } });
  }

  get PROJECT_STATUS_FLAG_LOST() { return this.config.PROJECT_STATUS_FLAG_LOST; }
  get PROJECT_STATUS_FLAG_DISCARD() { return this.config.PROJECT_STATUS_FLAG_DISCARD; }
  get PROJECT_STATUS_FLAG_INQUIRY() { return this.config.PROJECT_STATUS_FLAG_INQUIRY; }
  get PROJECT_STATUS_FLAG_PREPROPOSAL() { return this.config.PROJECT_STATUS_FLAG_PREPROPOSAL; }
  get PROJECT_STATUS_FLAG_INPROGRESS() { return this.config.PROJECT_STATUS_FLAG_INPROGRESS; }
  get PROJECT_STATUS_FLAG_ONHOLD() { return this.config.PROJECT_STATUS_FLAG_ONHOLD; }
  get PROJECT_STATUS_FLAG_COMPLETED() { return this.config.PROJECT_STATUS_FLAG_COMPLETED; }
  get PROJECT_STATUS_FLAG_DUE() { return this.config.PROJECT_STATUS_FLAG_DUE; }
  get PROJECT_STATUS_FLAG_LOCKED() { return this.config.PROJECT_STATUS_FLAG_LOCKED; }

  getStatusColor(statusFlag: number)
  {
    switch (statusFlag)
    {
      case this.PROJECT_STATUS_FLAG_LOST: return 'gray-700';
      case this.PROJECT_STATUS_FLAG_DISCARD: return 'gray-300';
      case this.PROJECT_STATUS_FLAG_INQUIRY: return 'yellow';
      case this.PROJECT_STATUS_FLAG_PREPROPOSAL: return 'orange';
      case this.PROJECT_STATUS_FLAG_INPROGRESS: return 'green';
      case this.PROJECT_STATUS_FLAG_ONHOLD: return 'purple';
      case this.PROJECT_STATUS_FLAG_COMPLETED: return 'gray-500';
      case this.PROJECT_STATUS_FLAG_DUE: return 'red';
      case this.PROJECT_STATUS_FLAG_LOCKED: return 'blue';
      default: return 'gray-900';
    }
  }

  //Project Meetings
  private _projectMeetings: Meeting[] = [];
  get projectMeetings(): Meeting[] { return this._projectMeetings; }
  set projectMeetings(value: Meeting[]) { this._projectMeetings = value; }

  //Project Request Ticket
  private _requestTickets: RequestTicket[] = [];
  get requestTickets(): RequestTicket[] { return this._requestTickets; }
  set requestTickets(value: RequestTicket[]) { this._requestTickets = value; }

  getNewProjectCode(id: number): Observable<any> {
    return this.http.get<any>(this.apiRoute + '/NewCode/' + id);
  }

  getProjectStageAnalysis(
    filters?: ApiFilter[],
    search?: string,
    sort?: string
  ): Observable<any> {

    let params = new HttpParams();
    if (filters && filters.length !== 0) {
      params = params.append('filters', JSON.stringify({ filters: filters }));
    }
    if (search) {
      params = params.append('search', search);
    }
    if (sort) {
      params = params.append('sort', sort);
    }

    return this.http.get<any>(this.apiRoute + '/StageAnalysis', { params: params });
  }

  getRTProject(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiRoute + '/GetRTProject');
  }

  getProjectsForEmail(
    page: number = 0,
    pageSize: number = 30,
    isFullAccess: boolean = false
  ): Observable<any> {
    const userData = JSON.parse(localStorage.getItem('currentUser') || '{}');

    let filters: { key: string; value: any }[] = [
      { key: 'statusFlag', value: 2 },
      { key: 'statusFlag', value: 1 },
      { key: 'statusFlag', value: 3 }
    ];

    // if (!isFullAccess && userData.teams?.length) {
    //   const teamID = userData.teams[0].id;
    //   filters.push({ key: 'teamID', value: teamID });
    // }
    if (!isFullAccess && userData.teams?.length) {
      userData.teams.forEach((team: any) => {
        filters.push({
          key: 'teamID',
          value: team.id
        });
      });
    }

    const normalizedFilters = filters.map(f => ({
      key: f.key,
      value: f.value.toString()
    }));

    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('filters', JSON.stringify({ filters: normalizedFilters }))
      .set('sort', 'code desc');

    return this.http.get<any>(`${this.apiRoute}/Pages`, { params });
  }

  getEmailsByLabel(userId: string, labelName: string, pageToken: string | null = null, pageSize: number = 20) {
    let params = new HttpParams()
      .set('userId', userId)
      .set('labelName', labelName)
      .set('maxResults', pageSize.toString());

    if (pageToken) {
      params = params.set('pageToken', pageToken);
    }

    return this.http.get<{ emails: any[], nextPageToken: string | null, totalEmails: number }>(
      `${environment.apiPath}/api/gmail/emails/label`,
      { params }
    );
  }
}
