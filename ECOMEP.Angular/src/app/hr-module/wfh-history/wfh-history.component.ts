import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { HrModuleService } from '../hr-module.service';

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
export class WfhHistoryComponent implements OnInit, OnChanges {

  @Input() requests: any[] = [];
  @Output() refresh = new EventEmitter<void>();

  constructor(private hrService: HrModuleService) {}

  // =========================
  // STATE
  // =========================
  editingRowId: any = null;
  editedRow: any = {};
  filteredRequests: any[] = [];

  activeTab: 'all' | 'team' | 'currentMonth' | 'lastMonth' = 'all';
  activeMonthFilter: 'none' | 'current' | 'last' = 'none';


  filters = {
    employeeName: '',
    startDate: '',
    endDate: ''
  };

  // =========================
  // INIT
  // =========================
  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['requests'] && this.requests) {

      this.requests = this.requests.map(req => ({
        ...req,
        status: (req.status || 'pending').toLowerCase(),
        attachments: Array.isArray(req.attachments) ? req.attachments : []
      }));

      this.filteredRequests = [...this.requests];
    }
  }

  // =========================
  // TOGGLE FILTER BUTTONS
  // =========================
 

toggleFilter(type: 'current' | 'last') {

  // 🔥 TOGGLE ON/OFF LOGIC
  if (
    (type === 'current' && this.activeMonthFilter === 'current') ||
    (type === 'last' && this.activeMonthFilter === 'last')
  ) {
    this.activeMonthFilter = 'none';   // disable
  } else {
    this.activeMonthFilter = type;     // enable
  }

  this.applyAllFilters();
}


  onFilterTypeChange() {

    this.resetFilters();

    if (this.activeTab === 'all') {
      this.filteredRequests = [...this.requests];
      return;
    }

    if (this.activeTab === 'team') {
      this.loadTeamLeaderWfh();
      return;
    }

    if (this.activeTab === 'currentMonth') {
      const range = this.getMonthRange('current');
      this.applyFilters(range);
      return;
    }

    if (this.activeTab === 'lastMonth') {
      const range = this.getMonthRange('last');
      this.applyFilters(range);
      return;
    }
  }



  applyAllFilters(): void {

  let data = [...this.requests];

  // SEARCH FILTER
  if (this.filters.employeeName) {
    data = data.filter(req =>
      req.employeeName?.toLowerCase()
        .includes(this.filters.employeeName.toLowerCase())
    );
  }

  // DATE FILTER (MONTH TOGGLE)
  if (this.activeMonthFilter !== 'none') {

    const range = this.getMonthRange(
      this.activeMonthFilter === 'current' ? 'current' : 'last'
    );

    data = data.filter(req => {
      const start = this.formatDate(req.startDate);
      const end = this.formatDate(req.endDate);

      return start <= range.end && end >= range.start;
    });
  }

  this.filteredRequests = data;
}

  // =========================
  // MONTH RANGE
  // =========================
  getMonthRange(type: 'current' | 'last') {

    const now = new Date();

    let start: Date;
    let end: Date;

    if (type === 'current') {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else {
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      end = new Date(now.getFullYear(), now.getMonth(), 0);
    }

    return {
      start: this.formatDate(start),
      end: this.formatDate(end)
    };
  }

  // =========================
  // FILTER LOGIC
  // =========================
  applyFilters(monthRange?: { start: string, end: string }): void {

    this.filteredRequests = this.requests.filter(req => {

      const reqStart = this.formatDate(req.startDate);
      const reqEnd = this.formatDate(req.endDate);

      const empMatch = this.filters.employeeName
        ? req.employeeName?.toLowerCase().includes(this.filters.employeeName.toLowerCase())
        : true;

      let dateMatch = true;

      if (monthRange) {
        dateMatch = reqStart <= monthRange.end && reqEnd >= monthRange.start;
      } else if (this.filters.startDate && this.filters.endDate) {
        dateMatch = reqStart <= this.filters.endDate && reqEnd >= this.filters.startDate;
      }

      return empMatch && dateMatch;
    });
  }

  resetFilters(): void {
    this.filters = {
      employeeName: '',
      startDate: '',
      endDate: ''
    };
  }

  // =========================
  // DATE FORMAT
  // =========================
  formatDate(date: any): string {
    if (!date) return '';

    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
  }

  // =========================
  // TEAM LEADER FILTER
  // =========================
  loadTeamLeaderWfh() {

    this.hrService.getContactTeams().subscribe((teams: any[]) => {

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

      this.filteredRequests = this.requests.filter(req => {

        const empName = req.employeeName?.toLowerCase().trim();

        return leaderNames.some(name =>
          empName === name || empName?.includes(name)
        );
      });

    });
  }

  // =========================
  // UTILITY (existing kept)
  // =========================
  getDays(start: Date, end: Date): number {
    if (!start || !end) return 0;
    const diff = new Date(end).getTime() - new Date(start).getTime();
    return Math.floor(diff / (1000 * 3600 * 24)) + 1;
  }

  openFile(file: any): void {
    if (file?.url) window.open(file.url, '_blank');
  }

  toggleReason(req: any) {
    req.expanded = !req.expanded;
  }

  updateStatus(req: any, status: string): void {
    this.hrService.updateStatus(req.id, status).subscribe(() => {
      req.status = status.toLowerCase();
      this.refresh.emit();
    });
  }

  startEdit(req: any): void {
    this.editingRowId = req.id;

    this.editedRow = {
      ...req,
      startDate: this.formatDate(req.startDate),
      endDate: this.formatDate(req.endDate),
      attachments: [...(req.attachments || [])],
      newFiles: []
    };
  }

  cancelEdit(): void {
    this.editingRowId = null;
    this.editedRow = {};
  }

  toSafeDate(dateStr: string): string {
    return dateStr + 'T12:00:00';
  }

  saveEdit(req: any): void {

    const formData = new FormData();

    formData.append('startDate', this.toSafeDate(this.editedRow.startDate));
    formData.append('endDate', this.toSafeDate(this.editedRow.endDate));
    formData.append('reason', this.editedRow.reason);
    formData.append('existingFiles', JSON.stringify(this.editedRow.attachments));

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

  onFileSelect(event: any): void {
    const files = Array.from(event.target.files);

    if (!this.editedRow.newFiles) {
      this.editedRow.newFiles = [];
    }

    this.editedRow.newFiles.push(...files);
    event.target.value = null;
  }

  removeFile(index: number): void {
    this.editedRow.attachments.splice(index, 1);
  }

  removeNewFile(index: number): void {
    this.editedRow.newFiles.splice(index, 1);
  }

  getCleanFileName(fileName: string): string {
  if (!fileName) return '';

  const index = fileName.indexOf('_');
  return index !== -1 ? fileName.substring(index + 1) : fileName;
}

}
