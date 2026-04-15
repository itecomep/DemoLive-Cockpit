import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';

import { HrModuleService } from '../hr-module.service';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-wfh-requests',
  standalone: true,
  imports: [CommonModule, MatTableModule, FormsModule],
  templateUrl: './wfh-requests.component.html',
  styleUrls: ['./wfh-requests.component.scss']
})
export class WfhRequestsComponent implements OnInit {

  requests: any[] = [];

  editingRowId: number | null = null;
  backupRow: any = null;

  existingFiles: any[] = [];
  newFiles: File[] = [];

  constructor(
    private hrService: HrModuleService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  // ================= LOAD =================
  loadRequests(): void {
    const currentUser = this.authService.currentUserStore;
    const userId = currentUser?.contact?.id;

    this.hrService.getRequests().subscribe({
      next: (data: any[]) => {

        this.requests = data
          .filter(x => x.userId === userId)
          .map(x => ({
            ...x,
            status: (x.status || 'PENDING').toLowerCase(),
            employeeName:
              x.userName ||
              x.name ||
              x.user?.name ||
              currentUser?.contact?.name ||
              'Unknown',
            attachments: Array.isArray(x.attachments) ? x.attachments : []
          }));
      },
      error: err => console.error(err)
    });
  }

  // ================= EDIT =================
  openEdit(req: any): void {
    if (req.status !== 'pending') return;

    this.editingRowId = req.id;
    this.backupRow = { ...req };

    req.startDate = this.formatDateForInput(req.startDate);
    req.endDate = this.formatDateForInput(req.endDate);

    this.existingFiles = req.attachments ? [...req.attachments] : [];
    this.newFiles = [];
  }

  saveEdit(req: any): void {

    const formData = new FormData();

    formData.append('startDate', this.toSafeDate(req.startDate));
    formData.append('endDate', this.toSafeDate(req.endDate));
    formData.append('reason', req.reason);
    formData.append('existingFiles', JSON.stringify(this.existingFiles));

    this.newFiles.forEach(file => {
      formData.append('files', file);
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
    const index = this.requests.findIndex(r => r.id === req.id);

    if (index !== -1 && this.backupRow) {
      this.requests[index] = { ...this.backupRow };
    }

    this.editingRowId = null;
    this.backupRow = null;
    this.existingFiles = [];
    this.newFiles = [];
  }

  deleteRequest(req: any): void {
    if (req.status !== 'pending') return;

    if (!confirm('Are you sure you want to delete this request?')) return;

    this.hrService.deleteRequest(req.id).subscribe(() => {
      this.requests = this.requests.filter(r => r.id !== req.id);
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
    return dateStr + 'T12:00:00';
  }

  formatDateForInput(date: any): string {
    if (!date) return '';

    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
  }

  getTotalDays(): number {
    let total = 0;

    this.requests.forEach(req => {
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
    if (file?.url) window.open(file.url, '_blank');
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
    if (!fileName) return '';

    const parts = fileName.split('_');
    return parts.length > 1 ? parts.slice(1).join('_') : fileName;
  }
}
