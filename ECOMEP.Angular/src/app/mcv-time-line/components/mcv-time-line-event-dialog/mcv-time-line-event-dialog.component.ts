import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { McvTimeLineEventDetailComponent } from '../mcv-time-line-event-detail/mcv-time-line-event-detail.component';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-mcv-time-line-event-dialog',
    templateUrl: './mcv-time-line-event-dialog.component.html',
    styleUrls: ['./mcv-time-line-event-dialog.component.scss'],
    standalone: true,
    imports: [MatButtonModule, MatIconModule, MatDialogModule, NgIf, McvTimeLineEventDetailComponent]
})
export class McvTimeLineEventDialogComponent implements OnInit {
  data: any;

  constructor(
    private dialogRef: MatDialogRef<McvTimeLineEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.data = data;
  }

  ngOnInit(): void {
  }

  onSelect(e: any) {
    this.dialogRef.close(e);
  }

  onClose(e: any) {
    this.dialogRef.close(e);
  }
}
