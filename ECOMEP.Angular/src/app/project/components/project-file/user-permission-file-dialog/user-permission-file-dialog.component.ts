import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-user-permission-file-dialog',
  standalone: true,
  templateUrl: './user-permission-file-dialog.component.html',
  styleUrls: ['./user-permission-file-dialog.component.scss'],
    imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class UserPermissionFileDialogComponent {

  contactOptions: any[] = [];
  filteredContactOptions: any[] = [];
  selectedContacts: number[] = [];
  selectedItem: any = null;
  selectedItemType: 'file' | 'folder' = 'file';
  contactsSearch: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<any>
  ) {
    this.contactOptions = data.contactOptions;
    this.filteredContactOptions = [...this.contactOptions];
    this.selectedContacts = data.selectedContacts;
    this.selectedItem = data.item;
    this.selectedItemType = data.type;
  }

  save() {
    this.dialogRef.close(this.selectedContacts);
  }

  close() {
    this.dialogRef.close();
  }

  filterContacts() {
    const search = this.contactsSearch.toLowerCase();
    this.filteredContactOptions = this.contactOptions.filter(c =>
      c.name?.toLowerCase().includes(search)
    );
  }

  toggleSelection(contact: any) {
    const index = this.selectedContacts.indexOf(contact.id);

    if (index > -1) {
      this.selectedContacts.splice(index, 1);
    } else {
      this.selectedContacts.push(contact.id);
    }
  }

  get deniedUsersCount(): number {
    return this.contactOptions.length - this.selectedContacts.length;
  }
}