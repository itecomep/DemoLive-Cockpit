import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-contact-photo-name-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule],
  templateUrl: './contact-photo-name-dialog.component.html',
  styleUrls: ['./contact-photo-name-dialog.component.scss']
})
export class ContactPhotoNameDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ContactPhotoNameDialogComponent>
  ) {
    this.data = data
    console.log('ContactPhotoNameDialogComponent opened with data:', this.data);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
