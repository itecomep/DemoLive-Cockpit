import { Injectable } from '@angular/core';
import { McvBaseApiService } from 'src/app/shared/services/mcv-base-api.service';

@Injectable({
  providedIn: 'root'
})
export class RequestTicketAssigneeApiService extends McvBaseApiService
{

  override apiRoute = this.config.apiRequestTicketAssignee;
  constructor()
  {
    super();
  }

  get REQUEST_TICKET_ASSIGNEE_TYPEFLAG_TO() { return this.config.REQUEST_TICKET_ASSIGNEE_TYPEFLAG_TO; }
  get REQUEST_TICKET_ASSIGNEE_TYPEFLAG_CC() { return this.config.REQUEST_TICKET_ASSIGNEE_TYPEFLAG_CC; }
  get REQUEST_TICKET_ASSIGNEE_TYPEFLAG_BCC() { return this.config.REQUEST_TICKET_ASSIGNEE_TYPEFLAG_BCC; }
}
