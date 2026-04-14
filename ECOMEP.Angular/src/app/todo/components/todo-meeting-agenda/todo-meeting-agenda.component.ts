import { Component, Inject, Input } from '@angular/core';
import { MeetingAgenda, MeetingAgendaAttachment } from 'src/app/meeting/models/meeting-agenda.model';
import { MeetingAgendaApiService } from 'src/app/meeting/services/meeting-agenda-api.service';
import { MeetingAgendaAttachmentApiService } from 'src/app/meeting/services/meeting-agenda-attachment-api.service';
import { MeetingApiService } from 'src/app/meeting/services/meeting-api.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { McvFileComponent } from '../../../mcv-file/components/mcv-file/mcv-file.component';
import { NgClass, NgIf, NgFor, DecimalPipe, DatePipe } from '@angular/common';

@Component({
    selector: 'app-todo-meeting-agenda',
    templateUrl: './todo-meeting-agenda.component.html',
    styleUrls: ['./todo-meeting-agenda.component.scss'],
    standalone: true,
    imports: [NgClass, NgIf, NgFor, McvFileComponent, MatExpansionModule, DecimalPipe, DatePipe]
})
export class TodoMeetingAgendaComponent
{
  @Input('agenda') currentEntity!: MeetingAgenda;

  get isMobileView(): boolean { return this.utilityService.isMobileView }

  get MEETING_TYPEFLAG_MEETING() { return this.meetingService.MEETING_TYPEFLAG_MEETING; }
  get MEETING_TYPEFLAG_INSPECTION() { return this.meetingService.MEETING_TYPEFLAG_INSPECTION; }
  get MEETING_TYPEFLAG_CNOTE() { return this.meetingService.MEETING_TYPEFLAG_CNOTE; }

  get MEETING_AGENDA_STATUSFLAG_PENDING() { return this.meetingAgendaService.MEETING_AGENDA_STATUSFLAG_PENDING; }

  constructor(
    private utilityService: UtilityService,
    private meetingService: MeetingApiService,
    private meetingAgendaService: MeetingAgendaApiService,
    private meetingAgendaAttachmentService: MeetingAgendaAttachmentApiService)
  {
  }
  getFilteredAttachments(attachments: MeetingAgendaAttachment[], typeFlag: number, isMedia: boolean)
  {
    return this.meetingAgendaAttachmentService.getFilteredAttachments(attachments, typeFlag, isMedia);
  }
}
