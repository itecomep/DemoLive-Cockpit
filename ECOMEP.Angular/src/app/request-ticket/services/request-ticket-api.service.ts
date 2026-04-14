
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { McvBaseApiService } from 'src/app/shared/services/mcv-base-api.service';
import { RequestTicketCreateComponent } from '../components/request-ticket-create/request-ticket-create.component';
import { RequestTicket } from '../models/request-ticket';
import { ProjectAttachment } from 'src/app/project/models/project.model';

@Injectable({
  providedIn: 'root'
})
export class RequestTicketApiService extends McvBaseApiService
{
  get nameOfEntity() { return this.config.NAMEOF_ENTITY_REQUEST_TICKET; }
  get isMobileView() { return this.utilityService.isMobileView; }

  get REQUEST_TICKET_STATUSFLAG_ACTIVE() { return this.config.REQUEST_TICKET_STATUSFLAG_ACTIVE; }
  get REQUEST_TICKET_STATUSFLAG_CLOSED() { return this.config.REQUEST_TICKET_STATUSFLAG_CLOSED; }

  override apiRoute = this.config.apiRequestTicket;
  constructor()
  {
    super();
  }


  send(id: number): Observable<any>
  {
    return this.http.put<any>(this.apiRoute + '/Send/' + id, null);
  }

  override get isPermissionList(): boolean
  {
    return this.authService.isInAnyRole([this.permissions.REQUEST_TICKET_LIST]);
  }

  override get isPermissionEdit(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.REQUEST_TICKET_EDIT, this.permissions.REQUEST_TICKET_SPECIAL_EDIT
    ]);
  }

  override get isPermissionDelete(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.REQUEST_TICKET_DELETE, this.permissions.REQUEST_TICKET_SPECIAL_DELETE
    ]);
  }
  override get isPermissionSpecialEdit(): boolean
  {
    return this.authService.isInAnyRole([this.permissions.REQUEST_TICKET_SPECIAL_EDIT]);
  }

  override get isPermissionSpecialDelete(): boolean
  {
    return this.authService.isInAnyRole([this.permissions.REQUEST_TICKET_SPECIAL_DELETE]);
  }
  override get isPermissionSpecialShowAll(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.REQUEST_TICKET_SPECIAL_SHOW_ALL
    ]);
  }

  onShowNewDialog()
  {
    const dialogRef = this.openDialog(RequestTicketCreateComponent, { data: new RequestTicket() }, this.isMobileView);
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
    const url = `#/request-ticket/${uid}`;
    console.log(url);
    window.open(url, '_blank');
  }

    //RT Create, copy and paste file from DMS
    private copiedFiles = signal<ProjectAttachment[]>([]);
  
    get copied() {
      return this.copiedFiles();
    }
  
    toggleCopy(file: ProjectAttachment) {
      const currentFiles = this.copiedFiles();
  
      if (currentFiles.some((f) => f.id === file.id)) {
        this.copiedFiles.set(currentFiles.filter((f) => f.id !== file.id));
        this.utilityService.showSwalToast('','File Removed Successfully','success');
      } else {
        this.copiedFiles.set([...currentFiles, file]);
        this.utilityService.showSwalToast('','File Copied Successfully','success');
      }
    }
  
    clearCopied() {
      this.copiedFiles.set([]);
    }
}
