import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { DmsService } from "./../../../services/dms.service";
import { MatDividerModule } from "@angular/material/divider";
import { MatListModule } from "@angular/material/list";

@Component({
  selector: "app-subfolder-master-dialog",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatListModule, 
  ],
  templateUrl: "./subfolder-master-dialog.component.html",
  styleUrls: ["./subfolder-master-dialog.component.scss"],
})
export class SubfolderMasterDialogComponent implements OnInit {
  subFolderOptions: any[] = [];
  newSubfolderName: string = "";

  constructor(
    private dialogRef: MatDialogRef<SubfolderMasterDialogComponent>,
    private dmsService: DmsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.loadSubfolders();
  }

  loadSubfolders() {
    this.dmsService.getSubFolders().subscribe({
      next: (res) => (this.subFolderOptions = res),
      error: (err) => console.error("Failed to load subfolders", err),
    });
  }

  addSubfolder() {
    if (!this.newSubfolderName.trim()) return;

    const currentUser = localStorage.getItem("currentUser");
    let userId: number | null = null;
    if (currentUser) {
      try {
        userId = JSON.parse(currentUser).userId ?? null;
      } catch {
        console.error("Invalid user data in localStorage");
      }
    }

    if (!userId) {
      alert("User not logged in");
      return;
    }

    const payload = {
      folderName: this.newSubfolderName.trim(),
      createdBy: userId.toString(),
    };

    this.dmsService.addSubFolder(payload).subscribe({
      next: (res) => {
        this.subFolderOptions.push(res);
        this.newSubfolderName = "";
      },
      error: (err) => console.error("Failed to add subfolder", err),
    });
  }

  deleteSubfolder(sub: any) {
    this.dmsService.deleteSubFolder(sub.id).subscribe({
      next: () =>
        (this.subFolderOptions = this.subFolderOptions.filter(
          (s) => s.id !== sub.id
        )),
      error: (err) => console.error("Failed to delete subfolder", err),
    });
  }

  close() {
    this.dialogRef.close();
  }
}
