import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { SitevisitAgendaAttachment } from '../../models/site-visit-agenda.model';
import { SiteVisitAgendaAttachmentApiService } from '../../services/site-visit-agenda-attachment-api.service';
import { SiteVisitAgendaApiService } from '../../services/site-visit-agenda-api.service';
import { SitevisitAgendaFileComponent } from '../site-visit-agenda-file/site-visit-agenda-file.component';

import { NgFor } from '@angular/common';

@Component({
    selector: 'site-visit-agenda-file-list',
    templateUrl: './sitevisit-agenda-file-list.component.html',
    styleUrls: ['./sitevisit-agenda-file-list.component.scss'],
    standalone: true,
    imports: [NgFor, SitevisitAgendaFileComponent]
})
export class SitevisitAgendaFileListComponent implements OnInit
{

  @Input() files: SitevisitAgendaAttachment[] = [];
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
    private sitevisitAgendaService: SiteVisitAgendaApiService,
    private attachmentService: SiteVisitAgendaAttachmentApiService
  ) { }

  ngOnInit(): void { }

  onDownload(attachment: SitevisitAgendaAttachment)
  {
    this.download.emit(attachment);
  }

  onDelete(attachment: SitevisitAgendaAttachment)
  {
    this.delete.emit(attachment);
  }

}
