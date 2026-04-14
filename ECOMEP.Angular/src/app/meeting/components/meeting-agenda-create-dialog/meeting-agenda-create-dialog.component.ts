import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-meeting-agenda-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './meeting-agenda-create-dialog.component.html',
  styleUrls: ['./meeting-agenda-create-dialog.component.scss']
})
export class MeetingAgendaCreateDialogComponent {

  constructor(
    private dialog: MatDialogRef<MeetingAgendaCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
  }


  onClose() {

  }

}
