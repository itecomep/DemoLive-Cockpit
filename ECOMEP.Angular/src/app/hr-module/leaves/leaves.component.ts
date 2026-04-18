// import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { MatTableModule } from '@angular/material/table';
// import { MatIconModule } from '@angular/material/icon';
// import { MatTooltipModule } from '@angular/material/tooltip';
// import { HrModuleService } from '../hr-module.service'; 
// import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // ✅ Keep this
// import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // ✅ Keep this
// import { FormsModule } from '@angular/forms'; // ✅ ADD THIS


// @Component({
//   selector: 'app-leaves',
//   standalone: true,
//   imports: [
//     CommonModule,
//     MatTableModule,
//     MatIconModule,
//     MatTooltipModule,
//     MatDialogModule ,// ✅ Added this to the imports array
//     FormsModule 
//   ],
//   templateUrl: './leaves.component.html',
//   styleUrls: ['./leaves.component.scss']
// })
// export class LeavesComponent implements OnInit {
//   @ViewChild('cvViewerDialog') cvViewerDialog!: TemplateRef<any>;

//   // 1. ✅ DECLARE THE MISSING PROPERTIES HERE
//   selectedCvUrl: SafeResourceUrl | null = null;
//   rawCvUrl: string = '';
//   selectedEmployeeName: string = '';

//   filteredRequests: any[] = [];
//   filters = {
//     employeeName: '',
//     startDate: '',
//     endDate: ''
//   };

//   displayedColumns: string[] = [
//     'employee',
//     'reason',
//     'type',
//     'start',
//     'end',
//     'total',
//     'status',
//     'attachment'
//   ];

//   dataSource: any[] = [];

//   constructor(
//     private service: HrModuleService,
//     private dialog: MatDialog,
//     private sanitizer: DomSanitizer
//   ) {}

//   ngOnInit(): void {
//     this.loadLeaves();
//   }

//   loadLeaves() {
//     this.service.getLeaves().subscribe({
//       next: (res: any[]) => {
//         this.dataSource = res.map(x => ({
//           id: x.id,
//           employeeName: x.employeeName,
//           reason: x.reason,
//           type: x.applicationType,
//           start: new Date(x.startDate),
//           end: new Date(x.endDate),
//           total: x.days,
//           statusFlag: x.status === 'Approved' ? 1 : x.status === 'Rejected' ? -1 : 0,
//           attachmentUrl: x.attachmentUrl || ''
//         }));
//         //  this.filteredRequests = [...this.requests];
//         this.filteredRequests = [...this.dataSource];

//       },
//       error: (err) => {
//         console.error('Error fetching leaves:', err);
//       }
//     });
//   }

//   // ✅ Method to open the CV Viewer
//   openCvViewer(element: any) {
//     // 2. ✅ THESE NOW WORK BECAUSE THEY ARE DECLARED ABOVE
//     this.selectedEmployeeName = element.employeeName;
//     this.rawCvUrl = element.attachmentUrl;
    
//     // Convert string URL to a SafeResourceUrl for the iframe
//     this.selectedCvUrl = this.sanitizer.bypassSecurityTrustResourceUrl(element.attachmentUrl);

//     this.dialog.open(this.cvViewerDialog, {
//       width: '950px',
//       height: '95vh',
//       panelClass: 'custom-cv-dialog'
//     });
//   }

//   closeDialog() {
//     this.dialog.closeAll();
//   }

//   toggleReason(row: any): void {
//     row.expanded = !row.expanded;
//   }

//   updateStatus(row: any, status: 'Approved' | 'Rejected') {
//     row.statusFlag = status === 'Approved' ? 1 : -1;
//     this.service.updateStatus(row.id, status).subscribe({
//       next: () => {
//         console.log('Status updated');
//       },
//       error: (err: any) => {
//         console.error('Error updating status', err);
//       }
//     });
//   }

//  applyFilters(): void {

//   this.filteredRequests = this.dataSource.filter((req: any) => {

//     const reqStart = this.formatDate(req.start);
//     const reqEnd = this.formatDate(req.end);

//     const filterStart = this.filters.startDate;
//     const filterEnd = this.filters.endDate;

//     const empMatch = this.filters.employeeName
//       ? req.employeeName?.toLowerCase().includes(this.filters.employeeName.toLowerCase())
//       : true;

//     let dateMatch = true;

//     if (filterStart && filterEnd) {
//       const from = filterStart < filterEnd ? filterStart : filterEnd;
//       const to = filterStart > filterEnd ? filterStart : filterEnd;

//       dateMatch = reqStart >= from && reqEnd <= to;
//     }
//     else if (filterStart) {
//       dateMatch = reqStart === filterStart;
//     }
//     else if (filterEnd) {
//       dateMatch = reqEnd === filterEnd;
//     }

//     return empMatch && dateMatch;
//   });

// }


//  resetFilters(): void {
//   this.filters = {
//     employeeName: '',
//     startDate: '',
//     endDate: ''
//   };

//   this.filteredRequests = [...this.dataSource];
// }

// formatDate(date: any): string {
//   if (!date) return '';

//   const d = new Date(date);

//   // ✅ Convert to YYYY-MM-DD (safe format)
//   const year = d.getFullYear();
//   const month = ('0' + (d.getMonth() + 1)).slice(-2);
//   const day = ('0' + d.getDate()).slice(-2);

//   return `${year}-${month}-${day}`;
// }

// }








// import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { MatTableModule } from '@angular/material/table';
// import { MatIconModule } from '@angular/material/icon';
// import { MatTooltipModule } from '@angular/material/tooltip';
// import { HrModuleService } from '../hr-module.service'; 
// import { MatDialog, MatDialogModule } from '@angular/material/dialog';
// import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
// import { FormsModule } from '@angular/forms';
// import { forkJoin } from 'rxjs'; // 🔥 IMPORTANT

// @Component({
//   selector: 'app-leaves',
//   standalone: true,
//   imports: [
//     CommonModule,
//     MatTableModule,
//     MatIconModule,
//     MatTooltipModule,
//     MatDialogModule,
//     FormsModule 
//   ],
//   templateUrl: './leaves.component.html',
//   styleUrls: ['./leaves.component.scss']
// })
// export class LeavesComponent implements OnInit {

//   @ViewChild('cvViewerDialog') cvViewerDialog!: TemplateRef<any>;

//   selectedCvUrl: SafeResourceUrl | null = null;
//   rawCvUrl: string = '';
//   selectedEmployeeName: string = '';

//   // 🔥 NEW TAB STATE
//   activeTab: 'all' | 'team' = 'all';

//   filteredRequests: any[] = [];
//   dataSource: any[] = [];

//   filters = {
//     employeeName: '',
//     startDate: '',
//     endDate: ''
//   };

//   displayedColumns: string[] = [
//     'employee',
//     'reason',
//     'type',
//     'start',
//     'end',
//     'total',
//     'status',
//     'attachment'
//   ];

//   constructor(
//     private service: HrModuleService,
//     private dialog: MatDialog,
//     private sanitizer: DomSanitizer
//   ) {}

//   ngOnInit(): void {
//     this.loadLeaves();
//   }

//   // 🔥 COMMON MAPPER (VERY IMPORTANT)
//   mapLeave(x: any) {
//     return {
//       id: x.id,
//       employeeName: x.employeeName,
//       reason: x.reason,
//       type: x.applicationType,
//       start: new Date(x.startDate),
//       end: new Date(x.endDate),
//       total: x.days,
//       statusFlag: x.status === 'Approved' ? 1 : x.status === 'Rejected' ? -1 : 0,
//       attachmentUrl: x.attachmentUrl || ''
//     };
//   }

//   // ✅ LOAD ALL
//   loadLeaves() {
//     this.service.getLeaves().subscribe({
//       next: (res: any[]) => {
//         this.dataSource = res.map(x => this.mapLeave(x));
//         this.filteredRequests = [...this.dataSource];
//       },
//       error: (err) => console.error('Error fetching leaves:', err)
//     });
//   }

//   // 🔥 LOAD TEAM LEADERS (FRONTEND FILTER)
//  loadTeamLeaderLeaves() {

//   this.service.getContactTeams().subscribe((teams: any[]) => {

//     console.log('Teams:', teams);

//     // 🔥 Extract ALL TEAM LEADER IDs
//     const teamLeaderIds: number[] = [];

//     teams.forEach(team => {
//       if (team.members && team.members.length > 0) {
//         team.members.forEach((m: any) => {
//           if (m.isLeader === true) {
//             teamLeaderIds.push(m.contactID);
//           }
//         });
//       }
//     });

//     console.log('Team Leader IDs:', teamLeaderIds);

//     // 🔥 Now match with leaves
//     this.service.getLeaves().subscribe((leaves: any[]) => {

//       console.log('Leaves:', leaves);

//       this.dataSource = leaves
//         .filter((l: any) => teamLeaderIds.includes(l.userId))
//         .map(x => this.mapLeave(x));

//       this.filteredRequests = [...this.dataSource];
//     });

//   });

// }


//   // 🔥 TAB SWITCH
//   switchTab(tab: 'all' | 'team') {
//     this.activeTab = tab;
//     this.resetFilters();

//     if (tab === 'all') {
//       this.loadLeaves();
//     } else {
//       this.loadTeamLeaderLeaves();
//     }
//   }

//   // ================= EXISTING CODE (UNCHANGED) =================

//   openCvViewer(element: any) {
//     this.selectedEmployeeName = element.employeeName;
//     this.rawCvUrl = element.attachmentUrl;
//     this.selectedCvUrl = this.sanitizer.bypassSecurityTrustResourceUrl(element.attachmentUrl);

//     this.dialog.open(this.cvViewerDialog, {
//       width: '950px',
//       height: '95vh',
//       panelClass: 'custom-cv-dialog'
//     });
//   }

//   closeDialog() {
//     this.dialog.closeAll();
//   }

//   toggleReason(row: any): void {
//     row.expanded = !row.expanded;
//   }

//   updateStatus(row: any, status: 'Approved' | 'Rejected') {
//     row.statusFlag = status === 'Approved' ? 1 : -1;

//     this.service.updateStatus(row.id, status).subscribe({
//       next: () => console.log('Status updated'),
//       error: (err: any) => console.error('Error updating status', err)
//     });
//   }

//   applyFilters(): void {

//     this.filteredRequests = this.dataSource.filter((req: any) => {

//       const reqStart = this.formatDate(req.start);
//       const reqEnd = this.formatDate(req.end);

//       const filterStart = this.filters.startDate;
//       const filterEnd = this.filters.endDate;

//       const empMatch = this.filters.employeeName
//         ? req.employeeName?.toLowerCase().includes(this.filters.employeeName.toLowerCase())
//         : true;

//       let dateMatch = true;

//       if (filterStart && filterEnd) {
//         const from = filterStart < filterEnd ? filterStart : filterEnd;
//         const to = filterStart > filterEnd ? filterStart : filterEnd;

//         dateMatch = reqStart >= from && reqEnd <= to;
//       }
//       else if (filterStart) {
//         dateMatch = reqStart === filterStart;
//       }
//       else if (filterEnd) {
//         dateMatch = reqEnd === filterEnd;
//       }

//       return empMatch && dateMatch;
//     });
//   }

//   resetFilters(): void {
//     this.filters = {
//       employeeName: '',
//       startDate: '',
//       endDate: ''
//     };

//     this.filteredRequests = [...this.dataSource];
//   }

//   formatDate(date: any): string {
//     if (!date) return '';

//     const d = new Date(date);

//     const year = d.getFullYear();
//     const month = ('0' + (d.getMonth() + 1)).slice(-2);
//     const day = ('0' + d.getDate()).slice(-2);

//     return `${year}-${month}-${day}`;
//   }
// }














// import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { MatTableModule } from '@angular/material/table';
// import { MatIconModule } from '@angular/material/icon';
// import { MatTooltipModule } from '@angular/material/tooltip';
// import { HrModuleService } from '../hr-module.service'; 
// import { MatDialog, MatDialogModule } from '@angular/material/dialog';
// import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-leaves',
//   standalone: true,
//   imports: [
//     CommonModule,
//     MatTableModule,
//     MatIconModule,
//     MatTooltipModule,
//     MatDialogModule,
//     FormsModule 
//   ],
//   templateUrl: './leaves.component.html',
//   styleUrls: ['./leaves.component.scss']
// })
// export class LeavesComponent implements OnInit {

//   @ViewChild('cvViewerDialog') cvViewerDialog!: TemplateRef<any>;

//   selectedCvUrl: SafeResourceUrl | null = null;
//   rawCvUrl: string = '';
//   selectedEmployeeName: string = '';

//   activeTab: 'all' | 'team' = 'all';

//   filteredRequests: any[] = [];
//   dataSource: any[] = [];

//   filters = {
//     employeeName: '',
//     startDate: '',
//     endDate: ''
//   };

//   displayedColumns: string[] = [
//     'employee',
//     'reason',
//     'type',
//     'start',
//     'end',
//     'total',
//     'status',
//     'attachment'
//   ];

//   constructor(
//     private service: HrModuleService,
//     private dialog: MatDialog,
//     private sanitizer: DomSanitizer
//   ) {}

//   ngOnInit(): void {
//     this.loadLeaves();
//   }

//   // ✅ COMMON MAPPER
//   mapLeave(x: any) {
//     return {
//       id: x.id,
//       employeeName: x.employeeName,
//       reason: x.reason,
//       type: x.applicationType,
//       start: new Date(x.startDate),
//       end: new Date(x.endDate),
//       total: x.days,
//       statusFlag: x.status === 'Approved' ? 1 : x.status === 'Rejected' ? -1 : 0,
//       attachmentUrl: x.attachmentUrl || ''
//     };
//   }

//   // ✅ ALL LEAVES
//   loadLeaves() {
//     this.service.getLeaves().subscribe({
//       next: (res: any[]) => {
//         this.dataSource = res.map(x => this.mapLeave(x));
//         this.filteredRequests = [...this.dataSource];
//       },
//       error: (err) => console.error('Error fetching leaves:', err)
//     });
//   }

//   // 🔥 ✅ FINAL WORKING TEAM LEADER LOGIC
//   loadTeamLeaderLeaves() {

//     this.service.getContactTeams().subscribe((teams: any[]) => {

//       // ✅ STEP 1: Extract leader names
//       const leaderNames: string[] = [];

//       teams.forEach(team => {
//         team.members?.forEach((m: any) => {

//           // 🔥 Identify leader correctly
//           if (m.contactID === team.leaderID) {

//             const name = m.contact?.name?.toLowerCase().trim();

//             if (name && !leaderNames.includes(name)) {
//               leaderNames.push(name);
//             }
//           }
//         });
//       });

//       console.log('Leader Names:', leaderNames);

//       // ✅ STEP 2: Filter leaves using employeeName
//       this.service.getLeaves().subscribe((leaves: any[]) => {

//         this.dataSource = leaves
//           .filter((l: any) => {
//             const empName = l.employeeName?.toLowerCase().trim();

//             return leaderNames.some(name =>
//               empName === name || empName?.includes(name)
//             );
//           })
//           .map(x => this.mapLeave(x));

//         console.log('Team Leader Leaves:', this.dataSource);

//         this.filteredRequests = [...this.dataSource];
//       });

//     });

//   }

//   // 🔥 TAB SWITCH
//   // switchTab(tab: 'all' | 'team') {
//   //   this.activeTab = tab;
//   //   this.resetFilters();

//   //   if (tab === 'all') {
//   //     this.loadLeaves();
//   //   } else {
//   //     this.loadTeamLeaderLeaves();
//   //   }
//   // }


// onFilterTypeChange() {
//   this.resetFilters();

//   if (this.activeTab === 'all') {
//     this.loadLeaves();
//   } else {
//     this.loadTeamLeaderLeaves();
//   }
// }



//   // ================= EXISTING =================

//   openCvViewer(element: any) {
//     this.selectedEmployeeName = element.employeeName;
//     this.rawCvUrl = element.attachmentUrl;
//     this.selectedCvUrl = this.sanitizer.bypassSecurityTrustResourceUrl(element.attachmentUrl);

//     this.dialog.open(this.cvViewerDialog, {
//       width: '950px',
//       height: '95vh',
//       panelClass: 'custom-cv-dialog'
//     });
//   }

//   closeDialog() {
//     this.dialog.closeAll();
//   }

//   toggleReason(row: any): void {
//     row.expanded = !row.expanded;
//   }

//   updateStatus(row: any, status: 'Approved' | 'Rejected') {
//     row.statusFlag = status === 'Approved' ? 1 : -1;

//     this.service.updateStatus(row.id, status).subscribe({
//       next: () => console.log('Status updated'),
//       error: (err: any) => console.error('Error updating status', err)
//     });
//   }

//   applyFilters(): void {

//     this.filteredRequests = this.dataSource.filter((req: any) => {

//       const reqStart = this.formatDate(req.start);
//       const reqEnd = this.formatDate(req.end);

//       const filterStart = this.filters.startDate;
//       const filterEnd = this.filters.endDate;

//       const empMatch = this.filters.employeeName
//         ? req.employeeName?.toLowerCase().includes(this.filters.employeeName.toLowerCase())
//         : true;

//       let dateMatch = true;

//       if (filterStart && filterEnd) {
//         const from = filterStart < filterEnd ? filterStart : filterEnd;
//         const to = filterStart > filterEnd ? filterStart : filterEnd;

//         dateMatch = reqStart >= from && reqEnd <= to;
//       }
//       else if (filterStart) {
//         dateMatch = reqStart === filterStart;
//       }
//       else if (filterEnd) {
//         dateMatch = reqEnd === filterEnd;
//       }

//       return empMatch && dateMatch;
//     });
//   }

//   resetFilters(): void {
//     this.filters = {
//       employeeName: '',
//       startDate: '',
//       endDate: ''
//     };

//     this.filteredRequests = [...this.dataSource];
//   }

//   formatDate(date: any): string {
//     if (!date) return '';

//     const d = new Date(date);

//     const year = d.getFullYear();
//     const month = ('0' + (d.getMonth() + 1)).slice(-2);
//     const day = ('0' + d.getDate()).slice(-2);

//     return `${year}-${month}-${day}`;
//   }
// }


















import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HrModuleService } from '../hr-module.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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
    FormsModule
  ],
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.scss']
})
export class LeavesComponent implements OnInit {

  @ViewChild('cvViewerDialog') cvViewerDialog!: TemplateRef<any>;

  selectedCvUrl: SafeResourceUrl | null = null;
  rawCvUrl: string = '';
  selectedEmployeeName: string = '';

  activeTab: 'all' | 'team' = 'all';

  filteredRequests: any[] = [];
  dataSource: any[] = [];
  

  // 🔥 MONTH FILTER
  selectedMonthTab: string = 'current';

  // availableMonths: { key: string, label: string }[] = [];

  filters = {
    employeeName: '',
    startDate: '',
    endDate: ''
  };

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

  ngOnInit(): void {
    this.loadLeaves();
  
  }

  // ================= MONTH TABS =================


filterByMonth(type: string) {
  // prevents unnecessary re-trigger
  if (this.selectedMonthTab === type) return;

  this.selectedMonthTab = type;
  this.applyFilters();
}

getSelectedMonth(): { month: number, year: number } | null {
  const now = new Date();

  if (this.selectedMonthTab === 'current') {
    return { month: now.getMonth(), year: now.getFullYear() };
  }

  if (this.selectedMonthTab === 'last') {
    const last = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return { month: last.getMonth(), year: last.getFullYear() };
  }

  return null;
}


  // ================= DATA LOAD =================

  mapLeave(x: any) {
    return {
      id: x.id,
      employeeName: x.employeeName,
      reason: x.reason,
      type: x.applicationType,
      start: new Date(x.startDate),
      end: new Date(x.endDate),
      total: x.days,
      statusFlag: x.status === 'Approved' ? 1 : x.status === 'Rejected' ? -1 : 0,
      attachmentUrl: x.attachmentUrl || ''
    };
  }

  loadLeaves() {
    this.service.getLeaves().subscribe({
      next: (res: any[]) => {
        this.dataSource = res.map(x => this.mapLeave(x));
        this.applyFilters();
      },
      error: (err) => console.error('Error fetching leaves:', err)
    });
  }

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

        this.dataSource = leaves
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

  onFilterTypeChange() {
    this.resetFilters();

    if (this.activeTab === 'all') {
      this.loadLeaves();
    } else {
      this.loadTeamLeaderLeaves();
    }
  }

  // ================= MAIN FILTER PIPE =================

  applyFilters(): void {

    const monthFilter = this.getSelectedMonth();

    this.filteredRequests = this.dataSource.filter((req: any) => {

      const reqStart = new Date(req.start);

      // employee filter
      const empMatch = this.filters.employeeName
        ? req.employeeName?.toLowerCase().includes(this.filters.employeeName.toLowerCase())
        : true;

      // date range filter (existing)
      const reqStartStr = this.formatDate(req.start);
      const reqEndStr = this.formatDate(req.end);

      const filterStart = this.filters.startDate;
      const filterEnd = this.filters.endDate;

      let dateMatch = true;

      if (filterStart && filterEnd) {
        const from = filterStart < filterEnd ? filterStart : filterEnd;
        const to = filterStart > filterEnd ? filterStart : filterEnd;

        dateMatch = reqStartStr >= from && reqEndStr <= to;
      }
      else if (filterStart) {
        dateMatch = reqStartStr === filterStart;
      }
      else if (filterEnd) {
        dateMatch = reqEndStr === filterEnd;
      }

      // 🔥 MONTH FILTER
      let monthMatch = true;

      if (monthFilter) {
        monthMatch =
          reqStart.getMonth() === monthFilter.month &&
          reqStart.getFullYear() === monthFilter.year;
      }

      return empMatch && dateMatch && monthMatch;
    });
  }

  resetFilters(): void {
    this.filters = {
      employeeName: '',
      startDate: '',
      endDate: ''
    };

    this.selectedMonthTab = 'current';
    this.applyFilters();
  }

  // ================= UI HELPERS =================

  openCvViewer(element: any) {
    this.selectedEmployeeName = element.employeeName;
    this.rawCvUrl = element.attachmentUrl;
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
      next: () => console.log('Status updated'),
      error: (err: any) => console.error('Error updating status', err)
    });
  }

  formatDate(date: any): string {
    if (!date) return '';

    const d = new Date(date);

    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
  }
}
