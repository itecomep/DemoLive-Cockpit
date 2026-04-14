import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { LeaveComponent } from '../leave/leave.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-leave-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,

    //Component
    LeaveComponent
  ],
  templateUrl: './leave-dialog.component.html',
  styleUrls: ['./leave-dialog.component.scss']
})
export class LeaveDialogComponent {
  data: any;
  constructor(
    private dialog: MatDialogRef<LeaveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.data = data;
  }

  onClose(e: any) {
    this.dialog.close(e);
  }
}
