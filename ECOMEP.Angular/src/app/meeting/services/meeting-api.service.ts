import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { McvBaseApiService } from "src/app/shared/services/mcv-base-api.service";
import { MeetingCreateComponent } from "../components/meeting-create/meeting-create.component";
import { Meeting } from "../models/meeting.model";
import { MatDialogConfig } from "@angular/material/dialog";
import { MeetingAgendaAttachment } from "../models/meeting-agenda.model";
import { MeetingLightBoxComponent } from "../components/meeting-light-box/meeting-light-box.component";
import { MeetingAttachment } from "../models/meeting-attachments.model";

@Injectable({
  providedIn: "root"
})
export class MeetingApiService extends McvBaseApiService
{
  get nameOfEntity() { return this.config.NAMEOF_ENTITY_MEETING; }
  get MEETING_TYPEFLAG_MEETING() { return this.config.MEETING_TYPEFLAG_MEETING; }
  get MEETING_TYPEFLAG_INSPECTION() { return this.config.MEETING_TYPEFLAG_INSPECTION; }
  get MEETING_TYPEFLAG_CNOTE() { return this.config.MEETING_TYPEFLAG_CNOTE; }
  get isMobileView() { return this.utilityService.isMobileView; }
  override apiRoute = this.config.apiMeeting;
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
    return this.authService.isInAnyRole([this.permissions.MEETING_LIST]);
  }

  override get isPermissionSpecialEdit(): boolean
  {
    return this.authService.isInAnyRole([this.permissions.MEETING_SPECIAL_EDIT]);
  }

  get isPermissionCreateEvent(): boolean
  {
    return this.authService.isInAnyRole([this.permissions.MEETING_CREATE_EVENT]);
  }

  override get isPermissionSpecialDelete(): boolean
  {
    return this.authService.isInAnyRole([this.permissions.MEETING_SPECIAL_DELETE]);
  }

  override get isPermissionEdit(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.MEETING_EDIT, this.permissions.MEETING_SPECIAL_EDIT
    ]);
  }

  get isPermissionCNoteEdit(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.MEETING_CNOTE_EDIT, this.permissions.MEETING_SPECIAL_EDIT
    ]);
  }

  get isPermissionInspectionEdit(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.MEETING_INSPECTION_EDIT, this.permissions.MEETING_SPECIAL_EDIT
    ]);
  }

  override get isPermissionDelete(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.MEETING_DELETE, this.permissions.MEETING_SPECIAL_DELETE
    ]);
  }
  override get isPermissionSpecialShowAll(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.MEETING_SPECIAL_SHOW_ALL
    ]);
  }
  get isPermissionSpecialRevive(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.MEETING_REVIVE
    ]);
  }

  onShowNewDialog()
  {

    const dialogRef = this.openDialog(MeetingCreateComponent, { data: new Meeting() }, this.isMobileView);
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
    const url = `${this.apiRoute}/Minutes/${uid}`;
    window.open(url, '_blank');
  }

  onPreviewMinutesFiles(agendaTitle: string, file: MeetingAgendaAttachment , files: MeetingAgendaAttachment[], index: number = 0, comment?: string)
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
    return this.dialog.open(MeetingLightBoxComponent, dialogConfig);

  }
  onPreviewMeetingFiles(agendaTitle: string, file: MeetingAttachment , files: MeetingAttachment[], index: number = 0, comment?: string)
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
    return this.dialog.open(MeetingLightBoxComponent, dialogConfig);

  }


  downloadMinutes(id: string)
  {
    const url = this.apiRoute + "/Report/minutes/a4/" + id;
    window.open(url);
  }
  
  mapToMcvFullCalendarEvent(obj: Meeting, showAll: boolean)
  {
    // tslint:disable-next-line: prefer-const
    let _event = {
      id: obj.uid,
      groupId: obj.uid,
      title: (showAll ? `Meeting | ${obj.title} | ` : '') + (`${obj.contact.name}`),
      extendedProps: obj,
      start: obj.startDate,
      end: obj.endDate,
      color: '#e83e8c',
      // allDay: false
    };
    return _event;
  }
}
