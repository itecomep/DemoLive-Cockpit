import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  AfterViewInit,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTableModule, MatTableDataSource } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { HrModuleService } from "../hr-module.service";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { FormsModule } from "@angular/forms";
import { ContactApiService } from "src/app/contact/services/contact-api.service";

@Component({
  selector: "app-leaves",
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatSortModule,
    FormsModule,
  ],
  templateUrl: "./leaves.component.html",
  styleUrls: ["./leaves.component.scss"],
})
export class LeavesComponent implements OnInit, AfterViewInit {
  @ViewChild("cvViewerDialog") cvViewerDialog!: TemplateRef<any>;
  @ViewChild("profileDialog") profileDialog!: TemplateRef<any>;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<any>([]);
  originalData: any[] = [];

  selectedCvUrl: SafeResourceUrl | null = null;
  rawCvUrl: string = "";
  selectedEmployeeName: string = "";

  activeTab: "all" | "team" = "all";

  filters = {
    employeeName: "",
    startDate: "",
    endDate: "",
  };

  // selectedMonthTab: "none" | "current" | "last" = "none";
  selectedMonthTab: "none" | "current" | "previous" | "next" = "none";


  displayedColumns: string[] = [
    "employee",
    "reason",
    "type",
    "start",
    "end",
    "total",
    "status",
    "attachment",
  ];

  constructor(
    private contactService: ContactApiService,
    private service: HrModuleService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.loadLeaves();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  loadLeaves() {
    // this.service.getLeaves().subscribe((leaves: any[]) => {
    //   this.contactService.get([]).subscribe((contacts: any[]) => {
    //     this.originalData = leaves.map((leave) => {
    //       const contact = contacts.find(
    //         (c) =>
    //           c.name?.toLowerCase().trim() ===
    //           leave.employeeName?.toLowerCase().trim()
    //       );

    //       return {
    //         id: leave.id,
    //         employeeName: leave.employeeName,
    //         reason: leave.reason,
    //         type: leave.applicationType,
    //         start: new Date(leave.startDate),
    //         end: new Date(leave.endDate),
    //         total: leave.days,
    //         statusFlag: leave.statusFlag,
    //         attachmentUrl: leave.attachmentUrl || "",
    //         photoUrl: contact?.photoUrl || "",
    //       };
    //     });

    //     this.originalData.sort((a, b) => b.id - a.id);
    //     this.applyFilters();
    //   });
    // });

    this.service.getContactTeams().subscribe((teams: any[]) => {

  const leaderNames: string[] = [];

  teams.forEach((team) => {
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
    this.contactService.get([]).subscribe((contacts: any[]) => {

      this.originalData = leaves.map((leave) => {
        const contact = contacts.find(
          (c) =>
            c.name?.toLowerCase().trim() ===
            leave.employeeName?.toLowerCase().trim()
        );

        const empName = leave.employeeName?.toLowerCase().trim();

        return {
          id: leave.id,
          employeeName: leave.employeeName,
          reason: leave.reason,
          type: leave.applicationType,
          start: new Date(leave.startDate),
          end: new Date(leave.endDate),
          total: leave.days,
          statusFlag: leave.statusFlag,
          attachmentUrl: leave.attachmentUrl || "",
          photoUrl: contact?.photoUrl || "",
          isTeamLeader: leaderNames.includes(empName), // ✅ ADD THIS
        };
      });

      this.applyFilters();
    });
  });
});
  }

  // loadTeamLeaderLeaves() {
  //   this.service.getContactTeams().subscribe((teams: any[]) => {
  //     const leaderNames: string[] = [];

  //     teams.forEach((team) => {
  //       team.members?.forEach((m: any) => {
  //         if (m.contactID === team.leaderID) {
  //           const name = m.contact?.name?.toLowerCase().trim();
  //           if (name && !leaderNames.includes(name)) {
  //             leaderNames.push(name);
  //           }
  //         }
  //       });
  //     });

  //     this.service.getLeaves().subscribe((leaves: any[]) => {
  //       this.originalData = leaves
  //         .filter((l: any) => {
  //           const empName = l.employeeName?.toLowerCase().trim();

  //           return leaderNames.some(
  //             (name) => empName === name || empName?.includes(name),
  //           );
  //         })
  //         .map((x) => this.mapLeave(x));

  //       this.applyFilters();
  //     });
  //   });
  // }


  loadTeamLeaderLeaves() {
  this.service.getContactTeams().subscribe((teams: any[]) => {
    const leaderNames: string[] = [];

    teams.forEach((team) => {
      team.members?.forEach((m: any) => {
        if (m.contactID === team.leaderID) {
          const name = m.contact?.name?.toLowerCase().trim();
          if (name && !leaderNames.includes(name)) {
            leaderNames.push(name);
          }
        }
      });
    });

    // ✅ FETCH CONTACTS ALSO (IMPORTANT)
    this.contactService.get([]).subscribe((contacts: any[]) => {
      this.service.getLeaves().subscribe((leaves: any[]) => {

        this.originalData = leaves
          .filter((l: any) => {
            const empName = l.employeeName?.toLowerCase().trim();
            return leaderNames.some(
              (name) => empName === name || empName?.includes(name)
            );
          })
          .map((leave) => {
            const contact = contacts.find(
              (c) =>
                c.name?.toLowerCase().trim() ===
                leave.employeeName?.toLowerCase().trim()
            );

            // return {
            //   id: leave.id,
            //   employeeName: leave.employeeName,
            //   reason: leave.reason,
            //   type: leave.applicationType,
            //   start: new Date(leave.startDate),
            //   end: new Date(leave.endDate),
            //   total: leave.days,
            //   statusFlag: leave.statusFlag,
            //   attachmentUrl: leave.attachmentUrl || "",
            //   photoUrl: contact?.photoUrl || "", // ✅ FIXED HERE
            // };

            return {
  id: leave.id,
  employeeName: leave.employeeName,
  reason: leave.reason,
  type: leave.applicationType,
  start: new Date(leave.startDate),
  end: new Date(leave.endDate),
  total: leave.days,
  statusFlag: leave.statusFlag,
  attachmentUrl: leave.attachmentUrl || "",
  photoUrl: contact?.photoUrl || "",
  isTeamLeader: true,   // ✅ ADD THIS
};
          });

        this.applyFilters();
      });
    });
  });
}

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
      attachmentUrl: x.attachmentUrl || "",
      photoUrl: x.contact?.photoUrl || "",
    };
  }

  onFilterTypeChange() {
    this.filters = {
      employeeName: "",
      startDate: "",
      endDate: "",
    };

    this.selectedMonthTab = "none";

    if (this.activeTab === "all") {
      this.loadLeaves();
    } else {
      this.loadTeamLeaderLeaves();
    }
  }

//   applyFilters() {
//     let data = [...this.originalData];

//     if (this.filters.employeeName) {
//       data = data.filter((x) =>
//         x.employeeName
//           ?.toLowerCase()
//           .includes(this.filters.employeeName.toLowerCase()),
//       );
//     }

//     if (this.filters.startDate && this.filters.endDate) {
//       const from = new Date(this.filters.startDate);
//       const to = new Date(this.filters.endDate);

//       data = data.filter((x) => x.start >= from && x.end <= to);
//     }

//     const now = new Date();

//     // if (this.selectedMonthTab === "current") {
//     //   data = data.filter(
//     //     (x) =>
//     //       x.start.getMonth() === now.getMonth() &&
//     //       x.start.getFullYear() === now.getFullYear(),
//     //   );
//     // } 

//     if (this.selectedMonthTab !== "none") {
//   const range = this.getMonthRange(this.selectedMonthTab);

//   data = data.filter((x) => {
//     return x.start <= range.end && x.end >= range.start;
//   });
// }

//     else if (this.selectedMonthTab === "last") {
//       const last = new Date(now.getFullYear(), now.getMonth() - 1, 1);

//       data = data.filter(
//         (x) =>
//           x.start.getMonth() === last.getMonth() &&
//           x.start.getFullYear() === last.getFullYear(),
//       );
//     }

//     this.dataSource.data = data;
//   }


// applyFilters() {
//   let data = [...this.originalData];

//   // 👤 Name filter
//   if (this.filters.employeeName) {
//     data = data.filter((x) =>
//       x.employeeName
//         ?.toLowerCase()
//         .includes(this.filters.employeeName.toLowerCase())
//     );
//   }

//   // 📅 Custom date filter
//   if (this.filters.startDate && this.filters.endDate) {
//     const from = new Date(this.filters.startDate);
//     const to = new Date(this.filters.endDate);

//     data = data.filter((x) => x.start <= to && x.end >= from);
//   }

//   // 📆 Month filter (🔥 SINGLE SOURCE OF TRUTH)
//   if (this.selectedMonthTab !== "none") {
//     const range = this.getMonthRange(this.selectedMonthTab);

//     data = data.filter((x) => {
//       // return x.start <= range.end && x.end >= range.start;
//       const start = new Date(x.start);

// return (
//   start >= range.start &&
//   start <= range.end
// );

//     });
//   }

//   this.dataSource.data = data;
// }


applyFilters() {
  let data = [...this.originalData];

  // 👤 Name filter
  if (this.filters.employeeName) {
    data = data.filter((x) =>
      x.employeeName
        ?.toLowerCase()
        .includes(this.filters.employeeName.toLowerCase())
    );
  }

  // 📅 Custom date filter
  if (this.filters.startDate && this.filters.endDate) {
    const from = new Date(this.filters.startDate);
    const to = new Date(this.filters.endDate);

    data = data.filter((x) => x.start >= from && x.start <= to);
  }

  // 📆 Month filter (🔥 START DATE BASED)
  if (this.selectedMonthTab !== "none") {
    const range = this.getMonthRange(this.selectedMonthTab);

    data = data.filter((x) => {
      const start = new Date(x.start);

      start.setHours(0, 0, 0, 0);

      return start >= range.start && start <= range.end;
    });
  }

  this.dataSource.data = data;
}


  updateStatus(row: any, status: "Approved" | "Rejected") {
    row.statusFlag = status === "Approved" ? 1 : -1;

    this.service.updateLeaveStatus(row.id, status).subscribe({
      next: () => {
        console.log("Status updated");
        this.loadLeaves();
      },
      error: (err) => console.error("Error updating status", err),
    });
  }

  openCvViewer(element: any) {
    this.selectedEmployeeName = element.employeeName;
    this.rawCvUrl = element.attachmentUrl;

    this.selectedCvUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      element.attachmentUrl,
    );

    this.dialog.open(this.cvViewerDialog, {
      width: "80vw",
      height: "90vh",
      panelClass: "custom-cv-dialog",
    });
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  toggleReason(row: any): void {
    row.expanded = !row.expanded;
  }

  resetFilters(): void {
    this.filters = {
      employeeName: "",
      startDate: "",
      endDate: "",
    };

    this.selectedMonthTab = "none";
    this.applyFilters();
  }

  getTotalDays(): number {
    return this.dataSource.data.reduce((sum, row) => {
      return sum + (row.total || 0);
    }, 0);
  }

  getApprovedDays(): number {
    return this.dataSource.data.reduce((sum, row) => {
      if (row.statusFlag === 1) {
        return sum + (row.total || 0);
      }
      return sum;
    }, 0);
  }

  getRejectedDays(): number {
    return this.dataSource.data.reduce((sum, row) => {
      if (row.statusFlag === -1) {
        return sum + (row.total || 0);
      }
      return sum;
    }, 0);
  }

  isImage(url: string): boolean {
    return url.match(/\.(jpeg|jpg|png|gif|webp)$/i) != null;
  }

  isPdf(url: string): boolean {
    return url.match(/\.pdf$/i) != null;
  }

  openProfileModal(element: any) {
  this.dialog.open(this.profileDialog, {
    data: element,
    panelClass: "profile-dialog",
    backdropClass: "blur-backdrop"
  });
}

// getMonthRange(type: "previous" | "current" | "next") {
//   const now = new Date();

//   let start: Date;
//   let end: Date;

//   if (type === "current") {
//     start = new Date(now.getFullYear(), now.getMonth(), 1);
//     end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
//   } 
//   else if (type === "previous") {
//     start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
//     end = new Date(now.getFullYear(), now.getMonth(), 0);
//   } 
//   else {
//     start = new Date(now.getFullYear(), now.getMonth() + 1, 1);
//     end = new Date(now.getFullYear(), now.getMonth() + 2, 0);
//   }

//   return { start, end };
// }

getMonthRange(type: "previous" | "current" | "next") {
  const now = new Date();

  let start: Date;
  let end: Date;

  if (type === "current") {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  } 
  else if (type === "previous") {
    start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    end = new Date(now.getFullYear(), now.getMonth(), 0);
  } 
  else {
    start = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    end = new Date(now.getFullYear(), now.getMonth() + 2, 0);
  }

  // 🔥 NORMALIZE TIME (IMPORTANT)
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}


}