import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { AppConfig } from 'src/app/app.config';
import { M } from '@fullcalendar/core/internal-common';
import { Meeting } from 'src/app/meeting/models/meeting.model';
import { MeetingApiService } from 'src/app/meeting/services/meeting-api.service';
import { firstValueFrom } from 'rxjs';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { McvFileComponent } from "src/app/mcv-file/components/mcv-file/mcv-file.component";

@Component({
  selector: 'app-project-meeting-view-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule, McvFileComponent],
  templateUrl: './project-meeting-view-dialog.component.html',
  styleUrls: ['./project-meeting-view-dialog.component.scss']
})
export class ProjectMeetingViewDialogComponent {
  data: any;
  currentEntity: any;
  historyList: any[] = [];
  toInternal: any[] = [];
  toExternal: any[] = [];
  toContactPerson: any[] = [];

  public readonly MEETING_ATTENDEE_INTERNAL = this.config.MEETING_ATTENDEE_INTERNAL;
  public readonly MEETING_ATTENDEE_EXTERNAL = this.config.MEETING_ATTENDEE_EXTERNAL;
  public readonly MEETING_ATTENDEE_CONTACT_PERSON = this.config.MEETING_ATTENDEE_CONTACT_PERSON;

  constructor(
    private dialogRef: MatDialogRef<ProjectMeetingViewDialogComponent>,
    public config: AppConfig,
    private entityService: MeetingApiService,
    @Inject(MAT_DIALOG_DATA) private dialogData: any
  ) {
    this.data = dialogData;
  }

  async getMeeting(id: number) {
    this.currentEntity= await firstValueFrom(this.entityService.getById(id));
  }

  async ngOnInit() {
    if (this.data && this.data.currentEntity) {
      await this.getMeeting(this.data.currentEntity.id);
    }
    const assignees = this.currentEntity.attendees;

    this.toExternal = assignees.filter(
      (a: any) => a.typeFlag === this.MEETING_ATTENDEE_EXTERNAL
    );
    this.toInternal = assignees.filter(
      (a: any) => a.typeFlag === this.MEETING_ATTENDEE_INTERNAL
    );
    this.toContactPerson = assignees.filter(
      (a: any) => a.typeFlag === this.MEETING_ATTENDEE_CONTACT_PERSON
    );
  }
    
  onClose() {
    this.dialogRef.close();
  }

}
