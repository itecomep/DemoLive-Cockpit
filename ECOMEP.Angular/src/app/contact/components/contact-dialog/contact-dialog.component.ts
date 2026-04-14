import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Contact } from '../../models/contact';
import { ContactDetailsComponent } from '../contact-details/contact-details.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-contact-dialog',
    templateUrl: './contact-dialog.component.html',
    styleUrls: ['./contact-dialog.component.scss'],
    standalone: true,
    imports: [MatButtonModule, MatIconModule, MatDialogModule, ContactDetailsComponent]
})
export class ContactDialogComponent 
{
  contact!: Contact;
  constructor(
    private dialog: MatDialogRef<ContactDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  )
  {
    this.contact = data;
  }
  onClose(e: any)
  {
    this.dialog.close(e);
  }
}
