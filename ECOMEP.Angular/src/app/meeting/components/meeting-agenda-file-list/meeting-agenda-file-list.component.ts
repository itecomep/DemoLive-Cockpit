import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MeetingAgendaAttachment } from 'src/app/meeting/models/meeting-agenda.model';
import { MeetingAgendaAttachmentApiService } from '../../services/meeting-agenda-attachment-api.service';
import { MeetingAgendaApiService } from '../../services/meeting-agenda-api.service';
import { MeetingAgendaFileComponent } from '../meeting-agenda-file/meeting-agenda-file.component';
import { NgFor } from '@angular/common';

@Component({
    selector: 'meeting-agenda-file-list',
    templateUrl: './meeting-agenda-file-list.component.html',
    styleUrls: ['./meeting-agenda-file-list.component.scss'],
    standalone: true,
    imports: [NgFor, MeetingAgendaFileComponent]
})
export class MeetingAgendaFileListComponent implements OnInit
{

  @Input() files: MeetingAgendaAttachment[] = [];
  @Input() hideDetails: boolean = false;
  @Input() allowAttachmentDelete: boolean = false;
  @Input() showRemove: boolean = false;
  @Input() showPreview: boolean = false;
  @Input() entityTitle!: string;
  @Input() isVerticalThumb: boolean = false;
  @Input() showEditor: boolean = false;

  @Output() download = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() preview = new EventEmitter<any>();

  constructor(
    private meetingAgendaService: MeetingAgendaApiService,
    private attachmentService: MeetingAgendaAttachmentApiService
  ) { }

  ngOnInit(): void { }

  onDownload(attachment: MeetingAgendaAttachment)
  {
    this.download.emit(attachment);
  }

  onDelete(attachment: MeetingAgendaAttachment)
  {
    this.delete.emit(attachment);
  }

}
