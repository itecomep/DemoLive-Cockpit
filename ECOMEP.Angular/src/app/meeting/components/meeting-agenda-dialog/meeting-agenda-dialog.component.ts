import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-meeting-agenda-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './meeting-agenda-dialog.component.html',
  styleUrls: ['./meeting-agenda-dialog.component.scss']
})
export class MeetingAgendaDialogComponent {
  data: any;
  constructor(
    private dialog: MatDialogRef<MeetingAgendaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.data = data;
  }

  onClose(e: any) {
    this.dialog.close(e);
  }
}
