import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { McvBaseApiService } from "src/app/shared/services/mcv-base-api.service";
import { SitevisitCreateComponent } from "../component/site-visit-create/site-visit-create.component";
import { SiteVisit } from "../models/site-visit.model";
import { MatDialogConfig } from "@angular/material/dialog";
import { SitevisitAgendaAttachment } from "../models/site-visit-agenda.model";
import { SitevisitLightBoxComponent } from "../component/site-visit-light-box/site-visit-light-box.component";

@Injectable({
  providedIn: "root"
})
export class SiteVisitApiService extends McvBaseApiService
{
  get nameOfEntity() { return this.config.NAMEOF_ENTITY_SITE_VISIT; }
  get SITE_VISIT_TYPEFLAG_SITE_VISIT() { return this.config.SITE_VISIT_TYPEFLAG_SITE_VISIT; }
  get SITE_VISIT_TYPEFLAG_INSPECTION() { return this.config.SITE_VISIT_TYPEFLAG_INSPECTION; }
  get SITE_VISIT_TYPEFLAG_CNOTE() { return this.config.SITE_VISIT_TYPEFLAG_CNOTE; }
  get isMobileView() { return this.utilityService.isMobileView; }
  override apiRoute = this.config.apiSitevisit;
  constructor()
  {
    super();
  }

  isEditable(id: number): Observable<boolean>
  {
    return this.http.get<boolean>(this.apiRoute + '/isEditable/' + id);
  }

  isDelayed(id: number): Observable<boolean>
  {
    return this.http.get<boolean>(this.apiRoute + '/isDelayed/' + id);
  }

  send(id: number): Observable<any>
  {
    return this.http.put<any>(this.apiRoute + '/Send/' + id, null);
  }

  override get isPermissionList(): boolean
  {
    return this.authService.isInAnyRole([this.permissions.SITE_VISIT_LIST]);
  }

  override get isPermissionSpecialEdit(): boolean
  {
    return this.authService.isInAnyRole([this.permissions.SITE_VISIT_SPECIAL_EDIT]);
  }

  get isPermissionCreateEvent(): boolean
  {
    return this.authService.isInAnyRole([this.permissions.SITE_VISIT_CREATE_EVENT]);
  }

  override get isPermissionSpecialDelete(): boolean
  {
    return this.authService.isInAnyRole([this.permissions.SITE_VISIT_SPECIAL_DELETE]);
  }

  override get isPermissionEdit(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.SITE_VISIT_EDIT, this.permissions.SITE_VISIT_SPECIAL_EDIT
    ]);
  }

  get isPermissionCNoteEdit(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.SITE_VISIT_CNOTE_EDIT, this.permissions.SITE_VISIT_SPECIAL_EDIT
    ]);
  }

  get isPermissionInspectionEdit(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.SITE_VISIT_INSPECTION_EDIT, this.permissions.SITE_VISIT_SPECIAL_EDIT
    ]);
  }

  override get isPermissionDelete(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.SITE_VISIT_DELETE, this.permissions.SITE_VISIT_SPECIAL_DELETE
    ]);
  }
  override get isPermissionSpecialShowAll(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.SITE_VISIT_SPECIAL_SHOW_ALL
    ]);
  }
  get isPermissionSpecialRevive(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.SITE_VISIT_REVIVE
    ]);
  }

  onShowNewDialog()
  {

    const dialogRef = this.openDialog(SitevisitCreateComponent, { data: new SiteVisit() }, this.isMobileView);
    dialogRef.afterClosed().subscribe(res =>
    {
      if (res)
      {
        console.log('OnClose', res);
      }
    });
  }

  openHtmlView(uid: string)
  {
    const url = `${this.apiRoute}/site-visit-minutes/${uid}`;
    window.open(url, '_blank');
  }

  onPreviewMinutesFiles(agendaTitle: string, file: SitevisitAgendaAttachment, files: SitevisitAgendaAttachment[], index: number = 0, comment?: string)
  {

    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = '100vw';
    dialogConfig.maxHeight = '100vh';
    dialogConfig.height = '100%';
    dialogConfig.width = '100%';
    dialogConfig.data = {
      dialogTitle: agendaTitle,
      currentfile: file,
      attachments: files,
      comment: comment,
      index: index
    };
    return this.dialog.open(SitevisitLightBoxComponent, dialogConfig);

  }


  downloadMinutes(id: string)
  {
    const url = this.apiRoute + "/Report/minutes/a4/" + id;
    window.open(url);
  }
  
  mapToMcvFullCalendarEvent(obj: SiteVisit, showAll: boolean)
  {
    // tslint:disable-next-line: prefer-const
    let _event = {
      id: obj.uid,
      groupId: obj.uid,
      title: `SiteVisit | ${obj.title} | ${obj.contact.name}`,
      extendedProps: obj,
      start: obj.startDate,
      end: obj.endDate,
      color: '#573ee8ff',
      // allDay: false
    };
    return _event;
  }
}
