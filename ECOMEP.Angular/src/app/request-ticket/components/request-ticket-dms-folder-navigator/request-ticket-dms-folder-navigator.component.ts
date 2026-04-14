import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectAttachment } from 'src/app/project/models/project.model';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RequestTicketApiService } from '../../services/request-ticket-api.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { McvFileSizePipe } from 'src/app/mcv-file/pipes/mcv-file-size.pipe';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';

@Component({
  selector: 'app-request-ticket-dms-folder-navigator',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    McvFileSizePipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TextFieldModule,
    MatDialogModule
  ],
  templateUrl: './request-ticket-dms-folder-navigator.component.html',
  styleUrls: ['./request-ticket-dms-folder-navigator.component.scss']
})
export class RequestTicketDmsFolderNavigatorComponent {
  requestTicketApiService = inject(RequestTicketApiService);

  treeData: ProjectAttachment[] = []; // Tree data input
  currentLevelItems: ProjectAttachment[] = []; // Items of the current level
  currentParent: ProjectAttachment | null = null; // Track current parent for navigation
  projectID?: number
  // @Input('treeData') set setTreeData(value: { treeData: ProjectAttachment[], projectID?: number }) {
  //   this.treeData = value.treeData;
  //   this.projectID = value.projectID;
  //   this.currentParent = null;
  //   // Initialize with root-level items (level 0)
  //   this.currentLevelItems = this.treeData.filter(item => item.level === 0);
  // }

  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    private dialog: MatDialogRef<RequestTicketDmsFolderNavigatorComponent>,
  ) {
    if (data) {
      this.treeData = data.treeData;
      this.projectID = data.projectID;
      this.currentParent = null;

      // Initialize with root-level items (level 0
      this.currentLevelItems = this.treeData.filter(item => item.level === 0);
    }
  }

  // Navigate back to the parent level
  navigateBack(): void {
    if (this.currentParent) {
      const parentID = this.currentParent.parentID;
      if (parentID === null) {
        // We're back at the root level
        this.currentParent = null;
        this.currentLevelItems = this.treeData.filter(item => item.level === 0);
      } else {
        // Find the parent in the tree
        const parent = this.findParentById(this.treeData, parentID);
        if (parent) {
          this.currentParent = parent;
          this.currentLevelItems = parent.children || [];
        }
      }
    }
  }

  // Navigate into a folder
  navigateToChildren(parent: ProjectAttachment): void {
    if (parent.isFolder) {
      this.currentParent = parent;
      this.currentLevelItems = parent.children || [];
    }
  }

  // Helper function to find parent by ID
  private findParentById(tree: ProjectAttachment[], parentID?: number): ProjectAttachment | null {
    for (const item of tree) {
      if (item.id === parentID) {
        return item;
      }
      const foundInChildren = this.findParentById(item.children || [], parentID);
      if (foundInChildren) {
        return foundInChildren;
      }
    }
    return null;
  }

  getSize(item: ProjectAttachment) {
    if (item.isFolder) {
      return 0;
    }
    return item.size;
  }

  isCopied(file: ProjectAttachment): boolean {
    return this.requestTicketApiService.copied.some((f) => f.id === file.id);
  }

  toggleCopy(file: ProjectAttachment) {
    this.requestTicketApiService.toggleCopy(file);
  }

  onClose() {
    this.dialog.close();
  }
}
