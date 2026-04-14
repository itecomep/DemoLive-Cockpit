import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { UtilityService } from 'src/app/shared/services/utility.service';

import { SiteVisitAgendaApiService } from '../../services/site-visit-agenda-api.service';
import { SiteVisitAgendaAttachmentApiService } from '../../services/site-visit-agenda-attachment-api.service';

import { AppConfig } from 'src/app/app.config';
import { SiteVisit } from '../../models/site-visit.model';


import { SitevisitAgenda } from '../../models/site-visit-agenda.model';
import { SitevisitAgendaAttachment } from '../../models/site-visit-agenda.model';
import { SitevisitAgendaFormComponent } from '../site-visit-agenda-form/site-visit-agenda-form.component';

import { McvFileUploadConfig } from 'src/app/mcv-file/models/mcv-file-upload-config.model';
import { Todo } from 'src/app/todo/models/todo.model';
import { TodoApiService } from 'src/app/todo/services/todo-api.service';
import { firstValueFrom } from 'rxjs';
import { MatExpansionModule } from '@angular/material/expansion';
import { McvFileComponent } from '../../../mcv-file/components/mcv-file/mcv-file.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { NgClass, NgIf, NgFor, DecimalPipe, DatePipe } from '@angular/common';


@Component({
    selector: 'app-site-visit-agenda',
    templateUrl: './site-visit-agenda.component.html',
    styleUrls: ['./site-visit-agenda.component.scss'],
    standalone: true,
    imports: [NgClass, NgIf, MatButtonModule, MatTooltipModule, MatIconModule, NgFor, McvFileComponent, MatExpansionModule, DecimalPipe, DatePipe]
})
export class SitevisitAgendaComponent
{
  isSelected: boolean = false;
  @Input() index: number = 0;
  @Input() allowPackageRequiredCheckbox: boolean = false;
  @Input() allowSelection: boolean = false;
  @Input() allowEdit: boolean = false;
  @Input() allowUpdate: boolean = false;
  @Input() allowDelete: boolean = false;
  @Input() showsitevisitDetails: boolean = false;
  @Input() allowAttachmentDelete: boolean = false;
  @Input() hideFileDetails: boolean = false;
  @Input() hideIndex: boolean = false;
  @Input() isReportMode: boolean = false;
  @Input() hideAttachments: boolean = false;
  sitevisit!: SiteVisit;
  todo?: Todo;
  id!: number
  @Input('id') set idValue(value: number)
  {
    if (value)
    {
      this.id = value;
      // this.refresh();
    }
  }

  currentEntity!: SitevisitAgenda;
  blobConfig!: McvFileUploadConfig;
  @Input('config') set setConfig(value: { agenda: SitevisitAgenda, blobConfig: McvFileUploadConfig, sitevisit: SiteVisit })
  {
    if (value)
    {
      this.currentEntity = value.agenda;
      this.blobConfig = value.blobConfig;
      this.sitevisit = value.sitevisit;
      if (this.currentEntity && this.currentEntity.todoID)
      {
        this.getLinkedTodo(this.currentEntity.todoID);
      }
    }
  }

  get isMobileView(): boolean { return this.utilityService.isMobileView }
  get SITE_VISIT_TYPEFLAG_SITE_VISIT() { return this.config.SITE_VISIT_TYPEFLAG_SITE_VISIT; }
  get SITE_VISIT_TYPEFLAG_INSPECTION() { return this.config.SITE_VISIT_TYPEFLAG_INSPECTION; }
  get SITE_VISIT_TYPEFLAG_CNOTE() { return this.config.SITE_VISIT_TYPEFLAG_CNOTE; }

  get SITE_VISIT_AGENDA_STATUSFLAG_PENDING() { return this.agendaService.SITE_VISIT_AGENDA_STATUSFLAG_PENDING; }

  get TODO_STATUS_FLAG_ACTIVE() { return this.todoService.TODO_STATUS_FLAG_ACTIVE; }
  get TODO_STATUS_FLAG_COMPLETED() { return this.todoService.TODO_STATUS_FLAG_COMPLETED; }
  get TODO_STATUS_FLAG_DROPPED() { return this.todoService.TODO_STATUS_FLAG_DROPPED; }

  @Output() update: EventEmitter<any> = new EventEmitter<any>();
  @Output() delete: EventEmitter<any> = new EventEmitter<any>();

  constructor(private config: AppConfig,
    private agendaService: SiteVisitAgendaApiService,
    private sitevisitattachmentService: SiteVisitAgendaAttachmentApiService,
    private utilityService: UtilityService,
    private todoService: TodoApiService
  ) { }


  private async getLinkedTodo(todoID: number)
  {
    this.todo = await firstValueFrom(this.todoService.getById(todoID));
  }

  onDeleteClick()
  {
    this.delete.emit();
  }

  onAgendaSelect()
  {
    // this.isSelected = !this.isSelected;
    // this.selectionChange.emit({ item: this.currentEntity, isSelected: this.isSelected });
  }

  onEditClick()
  {
    const dialogRef = this.agendaService.openDialog(SitevisitAgendaFormComponent,
      {
        autoUpdate: true,
        isCreateMode: false,
        sitevisit: this.sitevisit,
        blobConfig: this.blobConfig,
        agenda: this.currentEntity,

      }, false);
    dialogRef.afterClosed().subscribe(res =>
    {
      if (res)
      {
        console.log('OnClose', res);
        this.currentEntity = Object.assign(this.currentEntity, res);
        this.update.emit(this.currentEntity);
      }
    });
  }

  getFilteredAttachments(attachments: SitevisitAgendaAttachment[], typeFlag: number, isMedia: boolean)
  {
    return this.sitevisitattachmentService.getFilteredAttachments(attachments, typeFlag, isMedia);
  }

}
