import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MeetingComponent } from '../meeting/meeting.component';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-meeting-dialog',
    templateUrl: './meeting-dialog.component.html',
    styleUrls: ['./meeting-dialog.component.scss'],
    standalone: true,
    imports: [MatButtonModule, MatIconModule, MatDialogModule, NgIf, MeetingComponent]
})
export class MeetingDialogComponent 
{
  data: any;
  constructor(
    private dialog: MatDialogRef<MeetingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  )
  {
    this.data = data;
  }

  onClose(e: any)
  {
    this.dialog.close(e);
  }
}
