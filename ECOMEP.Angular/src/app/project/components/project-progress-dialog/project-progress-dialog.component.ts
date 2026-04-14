import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ProjectProgressComponent } from '../project-progress/project-progress.component';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-project-progress-dialog',
    templateUrl: './project-progress-dialog.component.html',
    styleUrls: ['./project-progress-dialog.component.scss'],
    standalone: true,
    imports: [MatButtonModule, MatIconModule, MatDialogModule, NgIf, ProjectProgressComponent]
})
export class ProjectProgressDialogComponent
{
  data: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) dialogData: any,
    private dialogRef: MatDialogRef<ProjectProgressDialogComponent>
  )
  {
    this.data = dialogData;
  }

  onClose(result: any)
  {
    this.dialogRef.close(result);
  }
}
