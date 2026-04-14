import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { TimeLineGroupFormComponent } from '../time-line-group-form/time-line-group-form.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-time-line-group-dialog',
    templateUrl: './time-line-group-dialog.component.html',
    styleUrls: ['./time-line-group-dialog.component.scss'],
    standalone: true,
    imports: [MatButtonModule, MatIconModule, MatDialogModule, TimeLineGroupFormComponent]
})
export class TimeLineGroupDialogComponent implements OnInit {

  data: any;

  constructor(@Inject(MAT_DIALOG_DATA) dialogData: any,
    private dialogRef: MatDialogRef<TimeLineGroupDialogComponent>
  ) {
    this.data = dialogData;
    // console.log(this.data);
  }

  ngOnInit() { }

  onClose(result: any) {
    this.dialogRef.close(result);
  }

}
