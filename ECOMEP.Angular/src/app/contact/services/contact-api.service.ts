import { Injectable } from '@angular/core';
import { Contact } from '../models/contact';
import { map, Observable } from 'rxjs';
import { McvBaseApiService } from 'src/app/shared/services/mcv-base-api.service';
import { ApiFilter } from 'src/app/shared/models/api-filters';
import { EmailContact } from 'src/app/shared/models/email-contact';

@Injectable({
  providedIn: 'root'
})
export class ContactApiService extends McvBaseApiService
{
  private _selectedItems: Contact[] = [];
  get selectedItems(): Contact[] { return this._selectedItems; }
  set selectedItems(value: Contact[]) { this._selectedItems = value; }

  private _isShowSharePanel: boolean = false;
  get isShowSharePanel(): boolean { return this._isShowSharePanel; }
  set isShowSharePanel(value: boolean) { this._isShowSharePanel = value; }

  private _isEditMode: boolean = false;
  get isEditMode(): boolean { return this._isEditMode; }
  set isEditMode(value: boolean) { this._isEditMode = value; }

  get nameOfEntity() { return this.config.NAMEOF_ENTITY_CONTACT; }

  override apiRoute = this.config.apiContacts;
  override defaultRoute = this.config.ROUTE_CONTACT_LIST;
  constructor()
  {
    super();
  }
  merge(obj: number[], hideLoader: boolean = false): Observable<any>
  {
    if (hideLoader)
    {
      return this.http.post<any>(this.apiRoute + "/merge", obj, { headers: { 'No-loader': 'true' } })
        .pipe(map(result => { this.$triggerCreated.next(result); return result; }));
    }
    return this.http.post<any>(this.apiRoute + "/merge", obj)
      .pipe(map(result => { this.$triggerCreated.next(result); return result; }));
  }
  share(
    emails: string[],
    filters?: ApiFilter[],
  ): Observable<any[]>
  {

    let params = {
      emails: emails,
      filters: filters,
    };
    return this.http.post<any[]>(`${this.apiRoute}/share`, params);
  }
  getEmailOptions(filters?: ApiFilter[],
    search?: string,
    sort?: string
  ): Observable<EmailContact[]>
  {

    let params: any = {
      search: search ? search : null,
      sort: sort ? sort : null,
      filters: filters && filters.length !== 0 ? JSON.stringify({ filters: filters }) : null,
    };

    Object.entries(params).forEach(o =>
      o[1] === null ? delete params[o[0]] : 0
    );
    return this.http.get<EmailContact[]>(this.apiRoute + "/EmailOptions", { params: params });
  }


  override get isPermissionList()
  {
    return this.authService.isInAnyRole([
      this.permissions.CONTACT_LIST
    ]);
  }

  get isPermissionLevel2(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.CONTACT_LEVEL_2
    ]);
  }
  get isPermissionLevel3(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.CONTACT_LEVEL_3
    ]);
  }
  get isPermissionLevel4(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.CONTACT_LEVEL_4
    ]);
  }

  override get isPermissionEdit()
  {
    return this.authService.isInAnyRole([
      this.permissions.CONTACT_EDIT
    ]);
  }

  override get isPermissionDelete()
  {
    return this.authService.isInAnyRole([
      this.permissions.CONTACT_DELETE
    ]);
  }

  get isPermissionCategoryMaster()
  {
    return this.authService.isInAnyRole([
      this.permissions.CONTACT_CATEGORY_MASTER
    ]);
  }
  
  get isPermissionAssocationView()
  {
    return this.authService.isInAnyRole([
      this.permissions.CONTACT_ASSOCIATIONS_VIEW
    ]);
  }

  get isPermissionAssocationEdit()
  {
    return this.authService.isInAnyRole([
      this.permissions.CONTACT_ASSOCIATIONS_EDIT
    ]);
  }

  get isPermissionAssocationDelete()
  {
    return this.authService.isInAnyRole([
      this.permissions.CONTACT_ASSOCIATIONS_DELETE
    ]);
  }

  //Contact Team Permissions
  get isPermissionTeamList()
  {
    return this.authService.isInAnyRole([
      this.permissions.TEAM_LIST
    ]);
  }

  get isPermissionTeamContactView(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.TEAM_CONTACT_VIEW
    ]);
  }

  get isPermissionTeamContactEdit(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.TEAM_CONTACT_EDIT
    ]);
  }

  get isPermissionTeamContactDelete(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.TEAM_CONTACT_DELETE
    ]);
  }
  get isPermissionAppointmentsView(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.TEAM_APPOINTMENTS_VIEW
    ]);
  }

  get isPermissionAppointmentsEdit(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.TEAM_APPOINTMENTS_EDIT
    ]);
  }

  get isPermissionAppointmentsDelete(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.TEAM_APPOINTMENTS_DELETE
    ]);
  }

  get isPermissionDocumentsView(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.TEAM_DOCUMENTS_VIEW
    ]);
  }

  get isPermissionDocumentsEdit(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.TEAM_DOCUMENTS_EDIT
    ]);
  }

  get isPermissionDocumentsDelete(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.TEAM_DOCUMENTS_DELETE
    ]);
  }

  get isPermissionUserManagement(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.TEAM_USER_MGMT
    ]);
  }

  get isPermissionTeamManagement(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.TEAM_MANAGEMENT
    ]);
  }


  get isPermissionNotesView(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.CONTACT_NOTES_VIEW
    ]);
  }

  get isPermissionNotesEdit()
  {
    return this.authService.isInAnyRole([
      this.permissions.CONTACT_NOTES_EDIT
    ]);
  }

  get isPermissionAnalysisShowAll()
  {
    return this.authService.isInAnyRole([
      this.permissions.CONTACT_ANALYSIS_SHOW_ALL,
    ]);
  }
  get isPermissionAnalysisExcel()
  {
    return this.authService.isInAnyRole([this.permissions.CONTACT_ANALYSIS_EXCEL]);
  }

   get isPermissionTeamSpecialShowAll(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.TEAM_SPECIAL_SHOW_ALL
    ]);
  }

  //WorkOrder
  get isPermissionProjectView(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.CONTACT_PROJECT_VIEW
    ]);
  }

  get isPermissionWorkOrderView(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.CONTACT_WORKORDER_VIEW
    ]);
  }

  get isPermissionWorkOrderEdit(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.CONTACT_WORKORDER_EDIT
    ]);
  }

  get isPermissionWorkOrderDelete(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.CONTACT_WORKORDER_DELETE
    ]);
  }

  exportAddressTags(filters?: ApiFilter[])
  {

    let url = this.apiRoute + `/addressTags`;
    if (filters && filters.length !== 0)
    {
      const filtersParam = encodeURIComponent(JSON.stringify({ filters: filters }));
      url += `?filters=${filtersParam}`;
    }

    window.open(url, '_blank');
  }

  getVCard(uid: string)
  {

    let url = `${this.apiRoute}/vcard/${uid}`;

    window.open(url, '_blank');
  }

  // shareVcfLink(contact: Contact)
  // {
  //   this.utilityService.shareURL(`${this.apiRoute}/VCardFile/${contact.id}`);
  // }

}
