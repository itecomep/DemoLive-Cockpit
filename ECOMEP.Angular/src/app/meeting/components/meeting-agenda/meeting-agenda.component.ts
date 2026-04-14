import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { UtilityService } from 'src/app/shared/services/utility.service';
import { MeetingAgendaApiService } from '../../services/meeting-agenda-api.service';
import { MeetingAgendaAttachmentApiService } from 'src/app/meeting/services/meeting-agenda-attachment-api.service';

import { AppConfig } from 'src/app/app.config';
import { Meeting } from 'src/app/meeting/models/meeting.model';
import { MeetingAgenda, MeetingAgendaAttachment } from '../../models/meeting-agenda.model';
import { MeetingAgendaFormComponent } from '../meeting-agenda-form/meeting-agenda-form.component';
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
  selector: 'app-meeting-agenda',
  templateUrl: './meeting-agenda.component.html',
  styleUrls: ['./meeting-agenda.component.scss'],
  standalone: true,
  imports: [NgClass, NgIf, MatButtonModule, MatTooltipModule, MatIconModule, NgFor, McvFileComponent, MatExpansionModule, DecimalPipe, DatePipe]
})
export class MeetingAgendaComponent {
  isSelected: boolean = false;
  @Input() index: number = 0;
  @Input() allowPackageRequiredCheckbox: boolean = false;
  @Input() allowSelection: boolean = false;
  @Input() allowEdit: boolean = false;
  @Input() allowUpdate: boolean = false;
  @Input() allowDelete: boolean = false;
  @Input() showMeetingDetails: boolean = false;
  @Input() allowAttachmentDelete: boolean = false;
  @Input() hideFileDetails: boolean = false;
  @Input() hideIndex: boolean = false;
  @Input() isReportMode: boolean = false;
  @Input() hideAttachments: boolean = false;

  autoUpdate!: boolean;
  isCreateMode!: boolean;
  meeting!: Meeting;
  todo?: Todo;
  id!: number
  @Input('id') set idValue(value: number) {
    if (value) {
      this.id = value;
      // this.refresh();
    }
  }

  currentEntity!: MeetingAgenda;
  blobConfig!: McvFileUploadConfig;
  @Input('config') set setConfig(value: { agenda: MeetingAgenda, blobConfig: McvFileUploadConfig, meeting: Meeting, autoUpdate: boolean, isCreateMode: boolean }) {
    if (value) {
      this.currentEntity = value.agenda;
      this.blobConfig = value.blobConfig;
      this.meeting = value.meeting;
      this.autoUpdate = value.autoUpdate;
      this.isCreateMode = value.isCreateMode;
    }
  }

  get isMobileView(): boolean { return this.utilityService.isMobileView }
  get MEETING_TYPEFLAG_MEETING() { return this.config.MEETING_TYPEFLAG_MEETING; }
  get MEETING_TYPEFLAG_INSPECTION() { return this.config.MEETING_TYPEFLAG_INSPECTION; }
  get MEETING_TYPEFLAG_CNOTE() { return this.config.MEETING_TYPEFLAG_CNOTE; }

  get MEETING_AGENDA_STATUSFLAG_PENDING() { return this.agendaService.MEETING_AGENDA_STATUSFLAG_PENDING; }

  get TODO_STATUS_FLAG_ACTIVE() { return this.todoService.TODO_STATUS_FLAG_ACTIVE; }
  get TODO_STATUS_FLAG_COMPLETED() { return this.todoService.TODO_STATUS_FLAG_COMPLETED; }
  get TODO_STATUS_FLAG_DROPPED() { return this.todoService.TODO_STATUS_FLAG_DROPPED; }

  @Output() update: EventEmitter<any> = new EventEmitter<any>();
  @Output() delete: EventEmitter<any> = new EventEmitter<any>();

  constructor(private config: AppConfig,
    private agendaService: MeetingAgendaApiService,
    private meetingattachmentService: MeetingAgendaAttachmentApiService,
    private utilityService: UtilityService,
    private todoService: TodoApiService
  ) { }

  async onDeleteClick() {
    if (!this.isCreateMode) {
      await firstValueFrom(this.agendaService.delete(this.currentEntity.id));
    }
    this.delete.emit(this.currentEntity);
  }

  onAgendaSelect() {
    // this.isSelected = !this.isSelected;
    // this.selectionChange.emit({ item: this.currentEntity, isSelected: this.isSelected });
  }

  onEditClick() {
    const dialogRef = this.agendaService.openDialog(MeetingAgendaFormComponent,
      {
        autoUpdate: this.autoUpdate,
        isCreateMode: this.isCreateMode,
        meeting: this.meeting,
        blobConfig: this.blobConfig,
        agenda: this.currentEntity,

      }, false);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        console.log('OnClose', res);
        this.currentEntity = Object.assign(this.currentEntity, res);
        this.update.emit(this.currentEntity);
      }
    });
  }

  getFilteredAttachments(attachments: MeetingAgendaAttachment[], typeFlag: number, isMedia: boolean) {
    return this.meetingattachmentService.getFilteredAttachments(attachments, typeFlag, isMedia);
  }

}
