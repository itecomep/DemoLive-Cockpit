import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ChangeDetectorRef } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-project-association-dialog',
  standalone: true,
  templateUrl: './project-association-dialog.component.html',
  styleUrls: ['./project-association-dialog.component.scss'],
  imports: [MatDialogModule, CommonModule, MatButtonModule, MatIconModule, MatFormFieldModule, FormsModule, MatInputModule]
})
  export class ProjectAssociationDialogComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private cdr: ChangeDetectorRef) {
  }

  searchText: string = '';
  filteredAssociations: any[] = [];

  ngOnInit() {
    this.filteredAssociations = this.data.associations || [];
  }

  filterAssociations() {
    const search = this.searchText.toLowerCase();
    this.filteredAssociations = (this.data.associations || []).filter((item: any) => {
      return (
        item.contact?.fullName?.toLowerCase().includes(search) ||
        item.contact?.email?.toLowerCase().includes(search) ||
        item.title?.toLowerCase().includes(search)
      );
    });
  }

  highlight(text: string): string {
    if (!this.searchText) return text;
    const search = this.searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${search})`, 'gi');
    return text.replace(regex, `<mark>$1</mark>`);
  }
}