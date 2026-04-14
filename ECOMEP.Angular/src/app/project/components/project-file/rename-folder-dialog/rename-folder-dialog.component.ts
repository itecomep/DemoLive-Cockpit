import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-rename-folder-dialog',
  standalone: true,
  templateUrl: './rename-folder-dialog.component.html',
  styleUrls: ['./rename-folder-dialog.component.scss'],
  imports: [
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  FormsModule
]

})
export class RenameFolderDialogComponent {

  folderName: string = '';

  constructor(
    public dialogRef: MatDialogRef<RenameFolderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.folderName = data.name;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  rename(): void {
    const name = this.folderName?.trim();
    if (!name) return;

    this.dialogRef.close(name);
  }

}
