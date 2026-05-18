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
  allowedUsers: any[] = [];
  deniedUsers: any[] = [];
  projectAccessUserIds: number[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<any>
  ) {
    this.contactOptions = data.contactOptions;
    this.filteredContactOptions = [...this.contactOptions];
    this.selectedContacts = data.selectedContacts || [];
    this.selectedItem = data.item;
    this.selectedItemType = data.type;
    this.projectAccessUserIds =
      data.projectAccessUserIds || [];
    this.allowedUsers =
      this.contactOptions.filter(c =>
        this.projectAccessUserIds.includes(c.id)
      );
    this.deniedUsers =
      this.contactOptions.filter(c =>
        !this.projectAccessUserIds.includes(c.id)
      );
  }

  save() {
    this.dialogRef.close(this.selectedContacts);
  }

  close() {
    this.dialogRef.close();
  }

  filterContacts() {
    const search =
      this.contactsSearch.toLowerCase();
    this.allowedUsers =
      this.contactOptions.filter(c =>
        this.projectAccessUserIds.includes(c.id) &&
        c.name?.toLowerCase().includes(search)
      );
    this.deniedUsers =
      this.contactOptions.filter(c =>
        !this.projectAccessUserIds.includes(c.id) &&
        c.name?.toLowerCase().includes(search)
      );
  }

  toggleSelection(contactId: number) {
    const index =
      this.selectedContacts.indexOf(contactId);
    if (index > -1) {
      this.selectedContacts.splice(index, 1);
    } else {
      this.selectedContacts.push(contactId);
    }
    this.selectedContacts =
      [...this.selectedContacts];
  }

  toggleAllowedUsers(checked: boolean) {
    const allowedIds =
      this.allowedUsers.map(x => x.id);
    if (checked) {
      this.selectedContacts = [
        ...new Set([
          ...this.selectedContacts,
          ...allowedIds
        ])
      ];
    } else {
      this.selectedContacts =
        this.selectedContacts.filter(
          x => !allowedIds.includes(x)
        );
    }
  }

  toggleDeniedUsers(checked: boolean) {
    const deniedIds =
      this.deniedUsers.map(x => x.id);
    if (checked) {
      this.selectedContacts = [
        ...new Set([
          ...this.selectedContacts,
          ...deniedIds
        ])
      ];
    } else {
      this.selectedContacts =
        this.selectedContacts.filter(
          x => !deniedIds.includes(x)
        );
    }
  }

  isAllAllowedSelected(): boolean {
    if (this.allowedUsers.length === 0) {
      return false;
    }
    return this.allowedUsers.every(x =>
      this.selectedContacts.includes(x.id)
    );
  }

  isAllDeniedSelected(): boolean {
    if (this.deniedUsers.length === 0) {
      return false;
    }
    return this.deniedUsers.every(x =>
      this.selectedContacts.includes(x.id)
    );
  }

  get deniedUsersCount(): number {
    return this.contactOptions.length -
      this.selectedContacts.length;
  }
}