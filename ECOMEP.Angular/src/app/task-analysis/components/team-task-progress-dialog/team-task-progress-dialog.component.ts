import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { TeamTaskProgressComponent } from '../team-task-progress/team-task-progress.component';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-team-task-progress-dialog',
    templateUrl: './team-task-progress-dialog.component.html',
    styleUrls: ['./team-task-progress-dialog.component.scss'],
    standalone: true,
    imports: [MatButtonModule, MatIconModule, MatDialogModule, NgIf, TeamTaskProgressComponent]
})
export class TeamTaskProgressDialogComponent 
{
  data: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) dialogData: any,
    private dialogRef: MatDialogRef<TeamTaskProgressDialogComponent>
  )
  {
    this.data = dialogData;
  }

  onClose(result: any)
  {
    this.dialogRef.close(result);
  }
}

