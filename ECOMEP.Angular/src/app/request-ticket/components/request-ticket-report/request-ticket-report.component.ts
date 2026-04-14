import { Component, inject, Input } from '@angular/core';
import { RequestTicket } from '../../models/request-ticket';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

import { UtilityService } from 'src/app/shared/services/utility.service';
import { RequestTicketApiService } from '../../services/request-ticket-api.service';
import { RequestTicketAssigneeApiService } from '../../services/request-ticket-assignee-api.service';
import { McvFileComponent } from '../../../mcv-file/components/mcv-file/mcv-file.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, NgClass, NgFor, DatePipe } from '@angular/common';

@Component({
    selector: 'app-request-ticket-report',
    templateUrl: './request-ticket-report.component.html',
    styleUrls: ['./request-ticket-report.component.scss'],
    standalone: true,
    imports: [NgIf, MatButtonModule, MatTooltipModule, MatIconModule, NgClass, NgFor, McvFileComponent, DatePipe]
})
export class RequestTicketReportComponent
{

  private readonly utilityService = inject(UtilityService);
  private readonly requestTicketService = inject(RequestTicketApiService);
  private readonly requestTicketAssigneeApiService = inject(RequestTicketAssigneeApiService);

  uid!: string;
  currentEntity!: RequestTicket;

  get logoUrl() { return environment.logoUrl };
  get version() { return environment.appVersion; }
  get isMobileView(): boolean { return this.utilityService.isMobileView; }
  get REQUEST_TICKET_ASSIGNEE_TYPEFLAG_TO() { return this.requestTicketAssigneeApiService.REQUEST_TICKET_ASSIGNEE_TYPEFLAG_TO; }
  get REQUEST_TICKET_ASSIGNEE_TYPEFLAG_CC() { return this.requestTicketAssigneeApiService.REQUEST_TICKET_ASSIGNEE_TYPEFLAG_CC; }

  @Input('uid') set configValue(value: string)
  {
    if (value)
    {
      this.uid = value;
      this.getMeetingVersion(this.uid);
    }
  }

  async getMeetingVersion(id: string)
  {
    this.currentEntity = await firstValueFrom(this.requestTicketService.getByPublicUid(id));
  }

  onClickShare()
  {
    this.utilityService.shareURL(window.location.href);
  }

  getFilteredAttendees(typeFlag: number)
  {
    return this.currentEntity.assignees.filter(x => x.typeFlag == typeFlag);
  }
}
