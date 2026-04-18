import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HrModuleService } from '../hr-module.service'; 
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // ✅ Keep this
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // ✅ Keep this
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-leaves',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule, // ✅ Added this to the imports array
      MatSortModule ,// ✅ ADD THIS
    FormsModule 
  ],
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.scss']
})
export class LeavesComponent implements OnInit, AfterViewInit  {
  @ViewChild('cvViewerDialog') cvViewerDialog!: TemplateRef<any>;
   @ViewChild(MatSort) sort!: MatSort;

   dataSource = new MatTableDataSource<any>([]); // ✅ CHANGE THIS

  // 1. ✅ DECLARE THE MISSING PROPERTIES HERE
  selectedCvUrl: SafeResourceUrl | null = null;
  rawCvUrl: string = '';
  selectedEmployeeName: string = '';
  searchText: string = '';

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

  // dataSource: any[] = [];
  constructor(
    private service: HrModuleService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadLeaves();
  }

  // loadLeaves() {
  //   this.service.getLeaves().subscribe({
  //     next: (res: any[]) => {
  //       this.dataSource = res.map(x => ({
  //         id: x.id,
  //         employeeName: x.employeeName,
  //         reason: x.reason,
  //         type: x.applicationType,
  //         start: new Date(x.startDate),
  //         end: new Date(x.endDate),
  //         total: x.days,

  //         statusFlag: x.statusFlag,
  //         attachmentUrl: x.attachmentUrl || ''
  //       }));
  //     },
  //     error: (err) => {
  //       console.error('Error fetching leaves:', err);
  //     }
  //   });
  // }



  //  loadLeaves() {
  //   this.service.getLeaves().subscribe({
  //     next: (res: any[]) => {
  //       const data = res.map(x => ({
  //         id: x.id,
  //         employeeName: x.employeeName,
  //         reason: x.reason,
  //         type: x.applicationType,
  //         start: new Date(x.startDate),
  //         end: new Date(x.endDate),
  //         total: x.days,
  //         statusFlag: x.statusFlag,
  //         attachmentUrl: x.attachmentUrl || ''
  //       }));

  //       this.dataSource.data = data;

  //       // ✅ attach sorting
  //       // this.dataSource.sort = this.sort;

  //       // ✅ custom sorting logic
  //       this.dataSource.sortingDataAccessor = (item, property) => {
  //         switch (property) {
  //           case 'employee': return item.employeeName?.toLowerCase();
  //           case 'start': return item.start;
  //           case 'end': return item.end;
  //           default: return item[property];
  //         }
  //       };
  //     }
  //   });
  // }



  loadLeaves() {
  this.service.getLeaves().subscribe({
    next: (res: any[]) => {
      const data = res.map(x => ({
        id: x.id,
        employeeName: x.employeeName,
        reason: x.reason,
        type: x.applicationType,
        start: new Date(x.startDate),
        end: new Date(x.endDate),
        total: x.days,
        statusFlag: x.statusFlag,
        attachmentUrl: x.attachmentUrl || ''
      }));

      this.dataSource.data = data;

      // ✅ ADD THIS HERE
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        return data.employeeName?.toLowerCase().includes(filter) ||
               data.reason?.toLowerCase().includes(filter) ||
               data.type?.toLowerCase().includes(filter);
      };

      // sorting (your existing)
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'employee': return item.employeeName?.toLowerCase();
          case 'start': return item.start;
          case 'end': return item.end;
          default: return item[property];
        }
      };
    }
  });
}

   ngAfterViewInit() {
    this.dataSource.sort = this.sort;
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

    this.service.updateLeaveStatus(row.id, status).subscribe({
      next: () => {
        console.log('Leave status updated');
        this.loadLeaves(); 
      },
      error: (err: any) => {
        console.error('Error updating leave status', err);
      }
    });
  }

  applyFilter() {
  const value = this.searchText.toLowerCase().trim();

  this.dataSource.filter = value;
}
}