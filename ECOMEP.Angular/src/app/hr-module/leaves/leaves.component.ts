import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HrModuleService } from '../hr-module.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-leaves',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatSortModule,
    FormsModule
  ],
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.scss']
})
export class LeavesComponent implements OnInit, AfterViewInit {

  @ViewChild('cvViewerDialog') cvViewerDialog!: TemplateRef<any>;
  @ViewChild(MatSort) sort!: MatSort;

  // ================= DATA =================

  dataSource = new MatTableDataSource<any>([]);
  originalData: any[] = [];

  // ================= VIEWER =================

  selectedCvUrl: SafeResourceUrl | null = null;
  rawCvUrl: string = '';
  selectedEmployeeName: string = '';

  // ================= FILTERS =================

  activeTab: 'all' | 'team' = 'all';

  filters = {
    employeeName: '',
    startDate: '',
    endDate: ''
  };

  selectedMonthTab: 'current' | 'last' = 'current';

  // ================= TABLE =================

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

  constructor(
    private service: HrModuleService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {}

  // ================= INIT =================

  ngOnInit(): void {
    this.loadLeaves();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  // ================= LOAD ALL =================

  loadLeaves() {
    this.service.getLeaves().subscribe({
      next: (res: any[]) => {
        this.originalData = res.map(x => this.mapLeave(x));
        this.applyFilters();
      },
      error: err => console.error('Error fetching leaves:', err)
    });
  }

  // ================= LOAD TEAM LEADERS =================

  loadTeamLeaderLeaves() {

    this.service.getContactTeams().subscribe((teams: any[]) => {

      const leaderNames: string[] = [];

      teams.forEach(team => {
        team.members?.forEach((m: any) => {
          if (m.contactID === team.leaderID) {
            const name = m.contact?.name?.toLowerCase().trim();
            if (name && !leaderNames.includes(name)) {
              leaderNames.push(name);
            }
          }
        });
      });

      this.service.getLeaves().subscribe((leaves: any[]) => {

        this.originalData = leaves
          .filter((l: any) => {
            const empName = l.employeeName?.toLowerCase().trim();

            return leaderNames.some(name =>
              empName === name || empName?.includes(name)
            );
          })
          .map(x => this.mapLeave(x));

        this.applyFilters();
      });

    });
  }

  // ================= MAP DATA =================

  mapLeave(x: any) {
    return {
      id: x.id,
      employeeName: x.employeeName,
      reason: x.reason,
      type: x.applicationType,
      start: new Date(x.startDate),
      end: new Date(x.endDate),
      total: x.days,
      statusFlag: x.statusFlag,
      attachmentUrl: x.attachmentUrl || ''
    };
  }

  // ================= SWITCH FILTER =================

  onFilterTypeChange() {

    // reset filters when switching
    this.filters = {
      employeeName: '',
      startDate: '',
      endDate: ''
    };

    this.selectedMonthTab = 'current';

    if (this.activeTab === 'all') {
      this.loadLeaves();
    } else {
      this.loadTeamLeaderLeaves();
    }
  }

  // ================= MAIN FILTER =================

  applyFilters() {

    let data = [...this.originalData];

    // 🔹 Employee Search
    if (this.filters.employeeName) {
      data = data.filter(x =>
        x.employeeName?.toLowerCase().includes(this.filters.employeeName.toLowerCase())
      );
    }

    // 🔹 Date Range
    if (this.filters.startDate && this.filters.endDate) {
      const from = new Date(this.filters.startDate);
      const to = new Date(this.filters.endDate);

      data = data.filter(x =>
        x.start >= from && x.end <= to
      );
    }

    // 🔹 Month Filter
    const now = new Date();

    if (this.selectedMonthTab === 'current') {
      data = data.filter(x =>
        x.start.getMonth() === now.getMonth() &&
        x.start.getFullYear() === now.getFullYear()
      );
    }

    if (this.selectedMonthTab === 'last') {
      const last = new Date(now.getFullYear(), now.getMonth() - 1, 1);

      data = data.filter(x =>
        x.start.getMonth() === last.getMonth() &&
        x.start.getFullYear() === last.getFullYear()
      );
    }

    this.dataSource.data = data;
  }

  // ================= STATUS =================

  updateStatus(row: any, status: 'Approved' | 'Rejected') {

    row.statusFlag = status === 'Approved' ? 1 : -1;

    this.service.updateLeaveStatus(row.id, status).subscribe({
      next: () => {
        console.log('Status updated');
        this.loadLeaves();
      },
      error: err => console.error('Error updating status', err)
    });
  }

  // ================= UI =================

  openCvViewer(element: any) {
    this.selectedEmployeeName = element.employeeName;
    this.rawCvUrl = element.attachmentUrl;

    this.selectedCvUrl =
      this.sanitizer.bypassSecurityTrustResourceUrl(element.attachmentUrl);

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

}