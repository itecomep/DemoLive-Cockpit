import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTableModule } from "@angular/material/table";
import { FormsModule } from "@angular/forms";

import { HrModuleService } from "../hr-module.service";
import { AuthService } from "src/app/auth/services/auth.service";
import { HeaderComponent } from "src/app/mcv-header/components/header/header.component";
import { MatDialog } from "@angular/material/dialog";
import { WorkFromHomeComponent } from "../../work-from-home/work-from-home/work-from-home.component";

import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ViewChild, TemplateRef } from '@angular/core';

@Component({
  selector: "app-wfh-requests",
  standalone: true,
  imports: [CommonModule, MatTableModule, FormsModule, HeaderComponent,MatDialogModule,
  MatIconModule],
  templateUrl: "./wfh-requests.component.html",
  styleUrls: ["./wfh-requests.component.scss"],
})
export class WfhRequestsComponent implements OnInit {
  activeMonthFilter: "none" | "current" | "last" = "none";
  requests: any[] = [];

  // editingRowId: number | null = null;
  backupRow: any = null;

  existingFiles: any[] = [];
  newFiles: File[] = [];
  @ViewChild("fileViewerDialog", { static: true }) fileViewerDialog!: TemplateRef<any>;

selectedFileUrl: SafeResourceUrl | null = null;
rawFileUrl: string = "";
selectedEmployeeName: string = "";

selectedMonth: 'previous' | 'current' | 'next' = 'current';
 currentDate: Date = new Date();
  currentMonthLabel: string = '';



  constructor(
    private hrService: HrModuleService,
    private authService: AuthService,
    private dialog: MatDialog,
     private sanitizer: DomSanitizer
  ) {}

  editingRowId: any = null;
  editedRow: any = {};
  filteredRequests: any[] = [];
  filters = {
    employeeName: "",
    startDate: "",
    endDate: "",
  };

  // ngOnInit(): void {
  //   this.loadRequests();
  // }


  ngOnInit(): void {
  // this.updateMonthLabel();
  this.loadRequests();
}

  // ================= LOAD =================
  // loadRequests(): void {
  //   const currentUser = this.authService.currentUserStore;
  //   const userId = currentUser?.contact?.id;

  //   this.hrService.getRequests().subscribe({
  //     next: (data: any[]) => {
  //       this.requests = data
  //         .filter((x) => x.userId === userId)
  //         .map((x) => ({
  //           ...x,
  //           status: (x.status || "PENDING").toLowerCase(),
  //           // status: x.status || 'PENDING',

  //           employeeName:
  //             x.userName ||
  //             x.name ||
  //             x.user?.name ||
  //             currentUser?.contact?.name ||
  //             "Unknown",
  //           attachments: Array.isArray(x.attachments) ? x.attachments : [],
  //         }));

  //       this.filteredRequests = [...this.requests];
  //     },
  //     error: (err) => console.error(err),
  //   });
  // }

 loadRequests(): void {
  const currentUser = this.authService.currentUserStore;
  const userId = currentUser?.contact?.id;

  this.hrService.getRequests().subscribe({
    next: (data: any[]) => {
      this.requests = data
        .filter((x) => x.userId === userId)
        .map((x) => ({
          ...x,
          status: (x.status || "PENDING").toLowerCase(),
          employeeName:
            x.userName ||
            x.name ||
            x.user?.name ||
            currentUser?.contact?.name ||
            "Unknown",
          attachments: Array.isArray(x.attachments) ? x.attachments : [],
        }));

      // ✅ DEFAULT = CURRENT MONTH
      this.selectedMonth = 'current';

      // ✅ APPLY MONTH FILTER
      this.applyMonthFilter();
    },
    error: (err) => console.error(err),
  });
}


  // ================= EDIT =================
  openEdit(req: any): void {
    if (req.status !== "pending") return;

    this.editingRowId = req.id;
    this.backupRow = { ...req };

    req.startDate = this.formatDateForInput(req.startDate);
    req.endDate = this.formatDateForInput(req.endDate);

    this.existingFiles = req.attachments ? [...req.attachments] : [];
    this.newFiles = [];
  }

  saveEdit(req: any): void {
    const formData = new FormData();

    formData.append("startDate", this.toSafeDate(req.startDate));
    formData.append("endDate", this.toSafeDate(req.endDate));
    formData.append("reason", req.reason);
    formData.append("existingFiles", JSON.stringify(this.existingFiles));

    this.newFiles.forEach((file) => {
      formData.append("files", file);
    });

    this.hrService.updateRequest(req.id, formData).subscribe(() => {
      this.loadRequests();
      this.editingRowId = null;
      this.backupRow = null;
      this.existingFiles = [];
      this.newFiles = [];
    });
  }

  cancelEdit(req: any): void {
    const index = this.requests.findIndex((r) => r.id === req.id);

    if (index !== -1 && this.backupRow) {
      this.requests[index] = { ...this.backupRow };
    }

    this.editingRowId = null;
    this.backupRow = null;
    this.existingFiles = [];
    this.newFiles = [];
  }

  deleteRequest(req: any): void {
    if (req.status !== "pending") return;

    if (!confirm("Are you sure you want to delete this request?")) return;

    this.hrService.deleteRequest(req.id).subscribe(() => {
      // remove from main list
      this.requests = this.requests.filter((r) => r.id !== req.id);

      // 🔥 IMPORTANT: refresh filtered list
      this.applyFilters();
    });
  }

  // ================= FILE =================
  onFileSelected(event: any): void {
    const files = event.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      this.newFiles.push(files[i]);
    }

    event.target.value = null;
  }

  removeExistingFile(index: number): void {
    this.existingFiles.splice(index, 1);
  }

  removeNewFile(index: number): void {
    this.newFiles.splice(index, 1);
  }

  // ================= HELPERS =================
  toSafeDate(dateStr: string): string {
    return dateStr + "T12:00:00";
  }

  formatDateForInput(date: any): string {
    if (!date) return "";

    const d = new Date(date);
    const year = d.getFullYear();
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    const day = ("0" + d.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
  }

  getTotalDays(): number {
    let total = 0;

    this.filteredRequests.forEach((req) => {
      if (req.startDate && req.endDate) {
        total += this.getDays(req.startDate, req.endDate);
      }
    });

    return total;
  }

  getDays(start: Date, end: Date): number {
    const diff = new Date(end).getTime() - new Date(start).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
  }

  openFile(file: any): void {
    if (file?.url) window.open(file.url, "_blank");
  }

  toggleReason(req: any): void {
    req.expanded = !req.expanded;
  }

  // ================= FILE UI HELPERS =================
  getFileChunks(files: any[]): any[][] {
    const chunks: any[][] = [];

    if (!files) return chunks;

    for (let i = 0; i < files.length; i += 2) {
      chunks.push(files.slice(i, i + 2));
    }

    return chunks;
  }

  getCleanFileName(fileName: string): string {
    if (!fileName) return "";

    const parts = fileName.split("_");
    return parts.length > 1 ? parts.slice(1).join("_") : fileName;
  }

  applyFilters(): void {
    let data = [...this.requests];

    // 🔍 Employee search
    if (this.filters.employeeName) {
      data = data.filter((req) =>
        req.employeeName
          ?.toLowerCase()
          .includes(this.filters.employeeName.toLowerCase()),
      );
    }

    // 📅 Month filter (NEW)
    if (this.activeMonthFilter !== "none") {
      const range = this.getMonthRange(this.activeMonthFilter);

      data = data.filter((req) => {
        const start = this.formatDate(req.startDate);
        const end = this.formatDate(req.endDate);

        return start <= range.end && end >= range.start;
      });
    }

    // 📅 Manual date filter (existing)
    else if (this.filters.startDate && this.filters.endDate) {
      const from =
        this.filters.startDate < this.filters.endDate
          ? this.filters.startDate
          : this.filters.endDate;

      const to =
        this.filters.startDate > this.filters.endDate
          ? this.filters.startDate
          : this.filters.endDate;

      data = data.filter((req) => {
        const reqStart = this.formatDate(req.startDate);
        const reqEnd = this.formatDate(req.endDate);

        return reqStart >= from && reqEnd <= to;
      });
    }

    this.filteredRequests = data;
  }

  resetFilters(): void {
    this.filters = {
      employeeName: "",
      startDate: "",
      endDate: "",
    };

    this.activeMonthFilter = "none"; // 🔥 add this
    this.filteredRequests = [...this.requests];
  }

  formatDate(date: any): string {
    if (!date) return "";

    const d = new Date(date);
    const year = d.getFullYear();
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    const day = ("0" + d.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
  }

  toggleFilter(type: "current" | "last") {
    if (
      (type === "current" && this.activeMonthFilter === "current") ||
      (type === "last" && this.activeMonthFilter === "last")
    ) {
      this.activeMonthFilter = "none";
    } else {
      this.activeMonthFilter = type;
    }

    this.applyFilters();
  }

  getMonthRange(type: "current" | "last") {
    const now = new Date();

    let start: Date;
    let end: Date;

    if (type === "current") {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else {
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      end = new Date(now.getFullYear(), now.getMonth(), 0);
    }

    return {
      start: this.formatDate(start),
      end: this.formatDate(end),
    };
  }

  getApprovedDays(): number {
    let total = 0;

    this.filteredRequests.forEach((req) => {
      if (
        req.status?.toLowerCase() === "approved" &&
        req.startDate &&
        req.endDate
      ) {
        total += this.getDays(req.startDate, req.endDate);
      }
    });

    return total;
  }

  getRejectedDays(): number {
    let total = 0;

    this.filteredRequests.forEach((req) => {
      if (
        req.status?.toLowerCase() === "rejected" &&
        req.startDate &&
        req.endDate
      ) {
        total += this.getDays(req.startDate, req.endDate);
      }
    });

    return total;
  }

  onNewRequest(): void {
    const dialogRef = this.dialog.open(WorkFromHomeComponent, {
      width: "1000px",
      maxWidth: "95vw",
      maxHeight: "95vh",
      panelClass: "custom-dialog-container",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadRequests();
      }
    });
  }


  openViewer(file: any, req: any) {
  const fileUrl = file?.url;

  if (!fileUrl) {
    console.error("File URL missing", file);
    return;
  }

  this.selectedEmployeeName = req?.employeeName || "Employee";
  this.rawFileUrl = fileUrl;

  this.selectedFileUrl =
    this.sanitizer.bypassSecurityTrustResourceUrl(fileUrl);

  this.dialog.open(this.fileViewerDialog, {
    width: '80vw',
    height: '90vh',
    panelClass: 'custom-cv-dialog'
  });
}

closeDialog() {
  this.dialog.closeAll();
}

downloadFile() {
  if (!this.rawFileUrl) return;

  fetch(this.rawFileUrl)
    .then(res => res.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = this.getFileName(this.rawFileUrl);

      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    });
}

getFileName(url: string): string {
  return url.split('/').pop() || 'file';
}


updateMonthLabel() {
  this.currentMonthLabel = this.currentDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric'
  });

  this.applyMonthFilter();
}
// goToPreviousMonth() {
//   this.currentDate.setMonth(this.currentDate.getMonth() - 1);
//   this.updateMonthLabel();
// }


goToPreviousMonth() {
  this.currentDate = new Date(this.currentDate); // 🔥 avoid mutation bug
  this.currentDate.setMonth(this.currentDate.getMonth() - 1);
  this.updateMonthLabel();
}

goToNextMonth() {
  this.currentDate = new Date(this.currentDate); // 🔥 avoid mutation bug
  this.currentDate.setMonth(this.currentDate.getMonth() + 1);
  this.updateMonthLabel();
}

// goToNextMonth() {
//   this.currentDate.setMonth(this.currentDate.getMonth() + 1);
//   this.updateMonthLabel();
// }

applyMonthFilter() {
  const now = new Date();

  let targetMonth = now.getMonth();
  let targetYear = now.getFullYear();

  if (this.selectedMonth === 'previous') {
    targetMonth -= 1;
  }

  if (this.selectedMonth === 'next') {
    targetMonth += 1;
  }

  const start = new Date(targetYear, targetMonth, 1);
  const end = new Date(targetYear, targetMonth + 1, 0);

  const startStr = this.formatDate(start);
  const endStr = this.formatDate(end);

  this.filteredRequests = this.requests.filter((req) => {
    const reqStart = this.formatDate(req.startDate);
    const reqEnd = this.formatDate(req.endDate);

    return reqStart <= endStr && reqEnd >= startStr;
  });
}


setMonth(type: 'previous' | 'current' | 'next') {
  this.selectedMonth = type;
  this.applyMonthFilter();
}



}
