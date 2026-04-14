import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeetingAgenda } from '../../models/meeting-agenda.model';
import { AppConfig } from 'src/app/app.config';
import { MeetingAgendaApiService } from '../../services/meeting-agenda-api.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { AppPermissions } from 'src/app/app.permissions';
import { MatIconModule } from '@angular/material/icon';
import { MeetingAgendaDialogComponent } from '../meeting-agenda-dialog/meeting-agenda-dialog.component';

@Component({
  selector: 'app-meeting-agenda-list-item',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    
    //Components
    MeetingAgendaDialogComponent
  ],
  templateUrl: './meeting-agenda-list-item.component.html',
  styleUrls: ['./meeting-agenda-list-item.component.scss']
})
export class MeetingAgendaListItemComponent implements OnInit {

  agenda!: MeetingAgenda;
  @Input('agenda') set setAgenda(value: MeetingAgenda) {
    if (value) {
      this.agenda = value;
    }
  }

  get MEETING_TYPEFLAG_MEETING() { return this.config.MEETING_TYPEFLAG_MEETING; }
  get MEETING_TYPEFLAG_INSPECTION() { return this.config.MEETING_TYPEFLAG_INSPECTION; }
  get MEETING_TYPEFLAG_CNOTE() { return this.config.MEETING_TYPEFLAG_CNOTE; }

  get allowEdit(): boolean {
    return this.authService.isInAnyRole([this.permissions.MEETING_CNOTE_EDIT]);
  }
  constructor(
    private config: AppConfig,
    private agendaService: MeetingAgendaApiService,
    private authService: AuthService,
    private permissions: AppPermissions
  ) { }

  ngOnInit(): void {
  }

  onEditClick() {

    const _agendaFormConfig = {
      isMeetingCreateMode: false,
      isCreatemode: false,
      meetingID: this.agenda.meetingID,
      agenda: this.agenda,
      dialogTitle: 'Agenda Update'
    };

    const dialogRef = this.agendaService.openDialog(MeetingAgendaDialogComponent, _agendaFormConfig, true);
    dialogRef.afterClosed().subscribe(res => {
      console.log('onClose', res);
      if (res) {
        this.agenda = Object.assign({}, res);
      }
    });
  }
}
