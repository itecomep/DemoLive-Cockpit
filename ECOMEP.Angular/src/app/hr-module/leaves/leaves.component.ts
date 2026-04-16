import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HrModuleService } from '../hr-module.service'; 
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // ✅ Keep this
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // ✅ Keep this

@Component({
  selector: 'app-leaves',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule // ✅ Added this to the imports array
  ],
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.scss']
})
export class LeavesComponent implements OnInit {
  @ViewChild('cvViewerDialog') cvViewerDialog!: TemplateRef<any>;

  // 1. ✅ DECLARE THE MISSING PROPERTIES HERE
  selectedCvUrl: SafeResourceUrl | null = null;
  rawCvUrl: string = '';
  selectedEmployeeName: string = '';

  displayedColumns: string[] = [
    'employee',
    'reason',
    'type',
    'start',
    'end',
    'total',
    'status',
    'attachment'
  ];

  dataSource: any[] = [];

  constructor(
    private service: HrModuleService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadLeaves();
  }

  loadLeaves() {
    this.service.getLeaves().subscribe({
      next: (res: any[]) => {
        this.dataSource = res.map(x => ({
          id: x.id,
          employeeName: x.employeeName,
          reason: x.reason,
          type: x.applicationType,
          start: new Date(x.startDate),
          end: new Date(x.endDate),
          total: x.days,
          statusFlag: x.status === 'Approved' ? 1 : x.status === 'Rejected' ? -1 : 0,
          attachmentUrl: x.attachmentUrl || ''
        }));
      },
      error: (err) => {
        console.error('Error fetching leaves:', err);
      }
    });
  }

  // ✅ Method to open the CV Viewer
  openCvViewer(element: any) {
    // 2. ✅ THESE NOW WORK BECAUSE THEY ARE DECLARED ABOVE
    this.selectedEmployeeName = element.employeeName;
    this.rawCvUrl = element.attachmentUrl;
    
    // Convert string URL to a SafeResourceUrl for the iframe
    this.selectedCvUrl = this.sanitizer.bypassSecurityTrustResourceUrl(element.attachmentUrl);

    this.dialog.open(this.cvViewerDialog, {
      width: '950px',
      height: '95vh',
      panelClass: 'custom-cv-dialog'
    });
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  toggleReason(row: any): void {
    row.expanded = !row.expanded;
  }

  updateStatus(row: any, status: 'Approved' | 'Rejected') {
    row.statusFlag = status === 'Approved' ? 1 : -1;
    this.service.updateStatus(row.id, status).subscribe({
      next: () => {
        console.log('Status updated');
      },
      error: (err: any) => {
        console.error('Error updating status', err);
      }
    });
  }
}