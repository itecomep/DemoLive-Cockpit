import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { HrModuleService } from '../hr-module.service';
import { OnChanges, SimpleChanges } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-wfh-history',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    FormsModule
  ],
  templateUrl: './wfh-history.component.html',
  styleUrls: ['./wfh-history.component.scss']
})
export class WfhHistoryComponent implements OnInit, OnChanges  {

  @Input() requests: any[] = [];
  @Output() refresh = new EventEmitter<void>();

  displayedColumns: string[] = [
    'employeeName',
    'startDate',
    'endDate',
    'days',
    'reason',
    'attachment',
    'status',
    'edit'
  ];

  constructor(private hrService: HrModuleService) {}

  // ✅ INLINE EDIT SUPPORT (FIXED)
  editingRowId: any = null;
  editedRow: any = {};

ngOnInit(): void {
  
}

  // =========================
  // DAYS CALCULATION
  // =========================
  getDays(start: Date, end: Date): number {
    if (!start || !end) return 0;
    const diff = new Date(end).getTime() - new Date(start).getTime();
    return Math.floor(diff / (1000 * 3600 * 24)) + 1;
  }

  // =========================
  // FILE HANDLING
  // =========================
  // openFile(file: any): void {
  //   const url = file?.url;
  //   if (!url) return;

  //   const type = url.split('.').pop()?.toLowerCase();

  //   if (['jpg', 'jpeg', 'png'].includes(type!)) {
  //     window.open(url, '_blank');
  //   } else {
  //     const a = document.createElement('a');
  //     a.href = url;
  //     a.download = file.fileName || file.name;
  //     a.click();
  //   }
  // }

  // =========================
// FILE HANDLING (UPDATED)
// ======================


openFile(file: any): void {
  const url = file?.url;
  if (!url) return;

  window.open(url, '_blank');  // 👈 always open in new tab
}



  getCleanFileName(fileName: string): string {
    if (!fileName) return '';
    const index = fileName.indexOf('_');
    return index !== -1 ? fileName.substring(index + 1) : fileName;
  }

  getFileChunks(files: any[]): any[][] {
    const result: any[][] = [];
    for (let i = 0; i < files.length; i += 2) {
      result.push(files.slice(i, i + 2));
    }
    return result;
  }

  // =========================
  // STATUS UPDATE
  // =========================
updateStatus(req: any, status: string): void {
  this.hrService.updateStatus(req.id, status).subscribe(() => {
    req.status = status.toLowerCase(); // ✅ instant UI update
    this.refresh.emit();               // ✅ tell parent to reload
  });
}
  // =========================
  // REASON EXPAND
  // =========================
  toggleReason(req: any) {
    req.expanded = !req.expanded;
  }

  // =========================
  // INLINE EDIT (FIXED)
  // =========================

 formatDate(date: any): string {
  if (!date) return '';

  // If already string → return as is
  if (typeof date === 'string') {
    return date.split('T')[0];
  }

  // If Date object → convert safely
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);

  return `${year}-${month}-${day}`;
}

    startEdit(req: any): void {
  this.editingRowId = req.id;

  this.editedRow = {
    ...req,
    startDate: this.formatDate(req.startDate),
    endDate: this.formatDate(req.endDate),
    attachments: [...(req.attachments || [])], // ✅ copy existing files
    newFiles: [] // ✅ new uploads
  };
}

toSafeDate(dateStr: string): string {
  return dateStr + 'T12:00:00';
}


saveEdit(req: any): void {

  const formData = new FormData();

  // formData.append('startDate', this.editedRow.startDate + 'T00:00:00');
  // formData.append('endDate', this.editedRow.endDate + 'T00:00:00');
  formData.append('startDate', this.toSafeDate(this.editedRow.startDate));
formData.append('endDate', this.toSafeDate(this.editedRow.endDate));

  formData.append('reason', this.editedRow.reason);

  // Existing files (keep)
  formData.append('existingFiles', JSON.stringify(this.editedRow.attachments));

  // New files
  if (this.editedRow.newFiles) {
    this.editedRow.newFiles.forEach((file: File) => {
      formData.append('files', file);
    });
  }

  this.hrService.updateRequest(req.id, formData).subscribe(() => {
    this.refresh.emit();
    this.editingRowId = null;
    this.editedRow = {};
  });
}

  cancelEdit(): void {
    this.editingRowId = null;
    this.editedRow = {};
  }


   ngOnChanges(changes: SimpleChanges): void {
    if (changes['requests'] && this.requests) {

      this.requests = this.requests.map(req => ({
        ...req,
        status: (req.status || 'pending').toLowerCase(),
        attachments: Array.isArray(req.attachments) ? req.attachments : []
      }));

    }
  }
    // onFileSelect(event: any): void {
    //   const files = Array.from(event.target.files);

    //   if (!this.editedRow.newFiles) {
    //     this.editedRow.newFiles = [];
    //   }

    //   this.editedRow.newFiles.push(...files);

    //   // ✅ RESET INPUT (VERY IMPORTANT)
    //   event.target.value = null;
    // }

    onFileSelect(event: any): void {
  const files = Array.from(event.target.files);

  if (!this.editedRow.newFiles) {
    this.editedRow.newFiles = [];
  }

  this.editedRow.newFiles.push(...files);

  event.target.value = null; // keep this
}

    
 // remove EXISTING file
removeFile(index: number): void {
  this.editedRow.attachments.splice(index, 1);
}

// remove NEW file
removeNewFile(index: number): void {
  this.editedRow.newFiles.splice(index, 1);
}


}

