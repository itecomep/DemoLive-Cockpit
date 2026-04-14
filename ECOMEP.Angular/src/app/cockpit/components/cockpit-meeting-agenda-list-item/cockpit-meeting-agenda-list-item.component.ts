import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { firstValueFrom } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { MatDialog } from '@angular/material/dialog';
import { MeetingAgendaApiService } from 'src/app/meeting/services/meeting-agenda-api.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { AppPermissions } from 'src/app/app.permissions';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MeetingAgenda } from 'src/app/meeting/models/meeting-agenda.model';
import { MeetingAgendaDialogComponent } from 'src/app/meeting/components/meeting-agenda-dialog/meeting-agenda-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MeetingAgendaFormComponent } from 'src/app/meeting/components/meeting-agenda-form/meeting-agenda-form.component';
import { MeetingApiService } from 'src/app/meeting/services/meeting-api.service';

@Component({
  selector: 'app-cockpit-meeting-agenda-list-item',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './cockpit-meeting-agenda-list-item.component.html',
  styleUrls: ['./cockpit-meeting-agenda-list-item.component.scss']
})
export class CockpitMeetingAgendaListItemComponent implements OnInit {

  readonly config = inject(AppConfig);
  readonly dialog = inject(MatDialog);
  readonly authService = inject(AuthService);
  readonly permissions = inject(AppPermissions);
  readonly utilityService = inject(UtilityService);
  readonly meetingService = inject(MeetingApiService);
  readonly agendaService = inject(MeetingAgendaApiService);


  isDelayed: boolean = false;
  agenda!: MeetingAgenda;
  @Input('agenda') set setAgenda(value: MeetingAgenda) {
    if (value) {
      this.agenda = value;
      if (this.agenda && this.agenda.dueDate) {
        const currentDate = new Date(); // Get the current date
        const dueDate = new Date(this.agenda.dueDate); // Safely create a Date object

        // Perform your logic
        if (dueDate < currentDate) {
          this.isDelayed = true; // Set the isDelayed flag
        } else {
          this.isDelayed = false;
        }
      }
    }
  }

  @Output() resovled = new EventEmitter<any>();

  get MEETING_TYPEFLAG_MEETING() { return this.config.MEETING_TYPEFLAG_MEETING; }
  get MEETING_TYPEFLAG_INSPECTION() { return this.config.MEETING_TYPEFLAG_INSPECTION; }
  get MEETING_TYPEFLAG_CNOTE() { return this.config.MEETING_TYPEFLAG_CNOTE; }

  get allowEdit(): boolean {
    return this.authService.isInAnyRole([this.permissions.MEETING_CNOTE_EDIT]);
  }

  get isMobileView() { return this.utilityService.isMobileView }

  ngOnInit(): void {
  }

  async onEditClick() {
    const _agenda = await firstValueFrom(this.agendaService.getById(this.agenda.id));
    const _meeting = await firstValueFrom(this.meetingService.getById(this.agenda.meetingID));
    if (_agenda) {
      const _agendaFormConfig = {
        isMeetingCreateMode: false,
        isCreatemode: false,
        autoUpdate: true,
        meeting: _meeting,
        agenda: _agenda,
        dialogTitle: 'Agenda Update'
      };

      const dialogRef = this.agendaService.openDialog(MeetingAgendaFormComponent, _agendaFormConfig, false);
      dialogRef.afterClosed().subscribe(res => {
        console.log('onClose', res);
        if (res) {
          this.agenda = Object.assign({}, res);
          if (this.agenda.statusFlag == this.config.MEETING_AGENDA_STATUSFLAG_RESOLVED) {
            this.resovled.emit(this.agenda);
          }
        }
      });
    }
  }
}
