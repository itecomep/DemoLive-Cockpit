import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { WfTaskAssessmentComponent } from '../wf-task-assessment/wf-task-assessment.component';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-wf-task-assessment-dialog',
    templateUrl: './wf-task-assessment-dialog.component.html',
    styleUrls: ['./wf-task-assessment-dialog.component.scss'],
    standalone: true,
    imports: [MatButtonModule, MatIconModule, MatDialogModule, NgIf, WfTaskAssessmentComponent]
})
export class WfTaskAssessmentDialogComponent implements OnInit {
  data: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) dialogData: any,
    private dialogRef: MatDialogRef<WfTaskAssessmentDialogComponent>
  ) {
    this.data = dialogData;
  }

  ngOnInit() { }

  onClose(result: any) {
    this.dialogRef.close(result);
  }
}
