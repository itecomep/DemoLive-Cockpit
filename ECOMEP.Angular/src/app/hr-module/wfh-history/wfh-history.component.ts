import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTableModule } from "@angular/material/table";
import { FormsModule } from "@angular/forms";
import { HrModuleService } from "../hr-module.service";
import { MatDialog } from "@angular/material/dialog";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { ViewChild, TemplateRef } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { ContactApiService } from "src/app/contact/services/contact-api.service";
import { AuthService } from "src/app/auth/services/auth.service";

@Component({
  selector: "app-wfh-history",
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
  ],
  templateUrl: "./wfh-history.component.html",
  styleUrls: ["./wfh-history.component.scss"],
})
export class WfhHistoryComponent implements OnInit, OnChanges {
  allRequests: any[] = []; // ✅ master data with photo
  @Input() requests: any[] = [];
  @Output() refresh = new EventEmitter<void>();
  @ViewChild("fileViewerDialog", { static: true })
  fileViewerDialog!: TemplateRef<any>;
  @ViewChild("profileDialog") profileDialog!: TemplateRef<any>;

  selectedFileUrl: SafeResourceUrl | null = null;
  rawFileUrl: string = "";
  selectedEmployeeName: string = "";

  constructor(
    private hrService: HrModuleService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private contactService: ContactApiService,
    private authService: AuthService,
  ) {}
  currentUserId: number = 0;
  isTeamLeader: boolean = false;
  editingRowId: any = null;
  editedRow: any = {};
  filteredRequests: any[] = [];

  activeTab: "all" | "team" | "currentMonth" | "lastMonth" = "all";
  // activeMonthFilter: "none" | "current" | "last" = "none";
  activeMonthFilter: "none" | "current" | "previous" | "next" = "none";

  filters = {
    employeeName: "",
    startDate: "",
    endDate: "",
  };

  // =========================
  // INIT
  // =========================
  ngOnInit(): void {
    const user = this.authService.currentUserStore;
    this.currentUserId = user?.contact?.id ?? 0;
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes["requests"] && this.requests) {
  //     this.requests = this.requests.map((req) => ({
  //       ...req,
  //       status: (req.status || "pending").toLowerCase(),
  //       attachments: Array.isArray(req.attachments) ? req.attachments : [],
  //     }));

  //     this.filteredRequests = [...this.requests];
  //   }
  // }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["requests"] && this.requests) {
      // ✅ Get logged-in user
      const user = this.authService.currentUserStore;
      this.currentUserId = user?.contact?.id ?? 0;

      // ✅ Get contacts first (for name + photo mapping)
      this.contactService.get([]).subscribe((contacts: any[]) => {
        // 🔥 STEP 1: Normalize ALL incoming data
        const normalizeData = (data: any[]) => {
          return data.map((req) => {
            const contact = contacts.find(
              (c) =>
                c.name?.toLowerCase().trim() ===
                (req.userName || req.employeeName)?.toLowerCase().trim(),
            );

            return {
              ...req,
              employeeName: req.userName || req.employeeName, // ✅ FIX NAME
              status: (req.status || "pending").toLowerCase(),
              attachments: Array.isArray(req.attachments)
                ? req.attachments
                : [],
              photoUrl: contact?.photoUrl || "",
            };
          });
        };

        // 🔥 STEP 2: Check TL
        this.hrService.getContactTeams().subscribe((teams: any[]) => {
          this.isTeamLeader = teams.some(
            (team) => team.leaderID === this.currentUserId,
          );

          // =========================
          // ✅ TEAM LEADER FLOW
          // =========================
          if (this.isTeamLeader) {
            this.activeTab = "all";

            this.hrService
              .getRequestsByTeamLeader(this.currentUserId)
              .subscribe((data: any[]) => {
                this.allRequests = normalizeData(data); // store full TL data

                this.filteredRequests = this.allRequests.filter(
                  (req) =>
                    req.teamLeaderId === this.currentUserId &&
                    req.userId !== this.currentUserId, // ✅ EXCLUDE OWN
                );

                // console.log("TL DATA:", this.filteredRequests);
              });
          }
          // =========================
          // ✅ NON TL FLOW
          // =========================
          else {
            this.allRequests = normalizeData(this.requests); // ✅ store clean data
            this.filteredRequests = [...this.allRequests];
          }

          console.log("Logged User:", this.currentUserId);
          console.log("Is TL:", this.isTeamLeader);
          console.log("Final Data:", this.filteredRequests);
        });
      });
    }
  }
  // =========================
  // TOGGLE FILTER BUTTONS
  // =========================

  // toggleFilter(type: "current" | "last") {
  //   // 🔥 TOGGLE ON/OFF LOGIC
  //   if (
  //     (type === "current" && this.activeMonthFilter === "current") ||
  //     (type === "last" && this.activeMonthFilter === "last")
  //   ) {
  //     this.activeMonthFilter = "none"; // disable
  //   } else {
  //     this.activeMonthFilter = type; // enable
  //   }

  //   this.applyAllFilters();
  // }

  toggleFilter(type: "current" | "previous" | "next") {
    this.activeMonthFilter = this.activeMonthFilter === type ? "none" : type;

    this.applyAllFilters();
  }

  onFilterTypeChange() {
    this.resetFilters();

    if (this.activeTab === "all") {
      // ✅ ALWAYS USE NORMALIZED DATA
      if (this.isTeamLeader) {
        this.filteredRequests = this.allRequests.filter(
          (req) =>
            req.teamLeaderId === this.currentUserId &&
            req.userId !== this.currentUserId, // ✅ ADD THIS LINE
        );
      } else {
        this.filteredRequests = [...this.allRequests];
      }
      return;
    }

    if (this.activeTab === "team") {
      this.loadTeamLeaderWfh();
      return;
    }

    if (this.activeTab === "currentMonth") {
      const range = this.getMonthRange("current");
      this.applyFilters(range);
      return;
    }

    if (this.activeTab === "lastMonth") {
      const range = this.getMonthRange("previous");
      this.applyFilters(range);
      return;
    }
  }

  applyAllFilters(): void {
    let data = [...this.requests];

    // SEARCH FILTER
    if (this.filters.employeeName) {
      data = data.filter((req) =>
        req.employeeName
          ?.toLowerCase()
          .includes(this.filters.employeeName.toLowerCase()),
      );
    }

    // DATE FILTER (MONTH TOGGLE)
    // if (this.activeMonthFilter !== "none") {
    //   const range = this.getMonthRange(
    //     this.activeMonthFilter === "current" ? "current" : "last",
    //   );

    //   data = data.filter((req) => {
    //     const start = this.formatDate(req.startDate);
    //     const end = this.formatDate(req.endDate);

    //     return start <= range.end && end >= range.start;
    //   });
    // }

    if (this.activeMonthFilter !== "none") {
      const range = this.getMonthRange(this.activeMonthFilter);

      data = data.filter((req) => {
        const start = this.formatDate(req.startDate);
        const end = this.formatDate(req.endDate);

        // ❌ OLD
        // return start <= range.end && end >= range.start;

        // ✅ NEW (STRICT MONTH)
        return start >= range.start && end <= range.end;
      });
    }

    this.filteredRequests = data;
  }

  // =========================
  // MONTH RANGE
  // =========================
  // getMonthRange(type: "current" | "last") {
  //   const now = new Date();

  //   let start: Date;
  //   let end: Date;

  //   if (type === "current") {
  //     start = new Date(now.getFullYear(), now.getMonth(), 1);
  //     end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  //   } else {
  //     start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  //     end = new Date(now.getFullYear(), now.getMonth(), 0);
  //   }

  //   return {
  //     start: this.formatDate(start),
  //     end: this.formatDate(end),
  //   };
  // }

  // =========================
  // FILTER LOGIC
  // =========================
  applyFilters(monthRange?: { start: string; end: string }): void {
    this.filteredRequests = this.requests.filter((req) => {
      const reqStart = this.formatDate(req.startDate);
      const reqEnd = this.formatDate(req.endDate);

      const empMatch = this.filters.employeeName
        ? req.employeeName
            ?.toLowerCase()
            .includes(this.filters.employeeName.toLowerCase())
        : true;

      let dateMatch = true;

      if (monthRange) {
        dateMatch = reqStart <= monthRange.end && reqEnd >= monthRange.start;
      } else if (this.filters.startDate && this.filters.endDate) {
        dateMatch =
          reqStart <= this.filters.endDate && reqEnd >= this.filters.startDate;
      }

      return empMatch && dateMatch;
    });
  }

  // resetFilters(): void {
  //   this.filters = {
  //     employeeName: "",
  //     startDate: "",
  //     endDate: "",
  //   };

  //   this.activeMonthFilter = "none"; // 🔥 important
  //   this.filteredRequests = [...this.requests];
  // }
  resetFilters(): void {
    this.filters = {
      employeeName: "",
      startDate: "",
      endDate: "",
    };

    this.activeMonthFilter = "none";

    if (this.isTeamLeader) {
      this.filteredRequests = this.allRequests.filter(
        (req) =>
          req.teamLeaderId === this.currentUserId &&
          req.userId !== this.currentUserId, // ✅ ADD THIS
      );
    } else {
      this.filteredRequests = [...this.allRequests];
    }
  }

  // =========================
  // DATE FORMAT
  // =========================
  formatDate(date: any): string {
    if (!date) return "";

    const d = new Date(date);
    const year = d.getFullYear();
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    const day = ("0" + d.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
  }

  // =========================
  // TEAM LEADER FILTER
  // =========================
  // loadTeamLeaderWfh() {
  //   this.hrService.getContactTeams().subscribe((teams: any[]) => {
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

  //     this.filteredRequests = this.requests.filter((req) => {
  //       const empName = req.employeeName?.toLowerCase().trim();

  //       return leaderNames.some(
  //         (name) => empName === name || empName?.includes(name),
  //       );
  //     });
  //   });
  // }

  // loadTeamLeaderWfh() {
  //   // ✅ STEP 1: get all teams
  //   this.hrService.getContactTeams().subscribe((teams: any[]) => {
  //     const leaderNames: string[] = [];

  //     // ✅ STEP 2: extract TL names (same as Leaves module)
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

  //     // ✅ STEP 3: fetch ALL WFH data again
  //     this.hrService.getRequests().subscribe((data: any[]) => {
  //       // ✅ STEP 4: filter only TL requests
  //       const filtered = data.filter((req: any) => {
  //         const empName = (req.userName || "").toLowerCase().trim();

  //         return leaderNames.some(
  //           (name) => empName === name || empName.includes(name),
  //         );
  //       });

  //       // ✅ STEP 5: normalize (IMPORTANT)
  //       this.filteredRequests = filtered.map((req) => ({
  //         ...req,
  //         employeeName: req.userName,
  //         status: (req.status || "pending").toLowerCase(),
  //         attachments: Array.isArray(req.attachments) ? req.attachments : [],
  //       }));

  //       console.log("TEAM LEADERS WFH:", this.filteredRequests);
  //     });
  //   });
  // }

  loadTeamLeaderWfh() {
    // ✅ STEP 1: get contacts (IMPORTANT for photo)
    this.contactService.get([]).subscribe((contacts: any[]) => {
      // ✅ STEP 2: get all teams
      this.hrService.getContactTeams().subscribe((teams: any[]) => {
        const leaderNames: string[] = [];

        // ✅ STEP 3: extract TL names
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

        // ✅ STEP 4: fetch all WFH
        this.hrService.getRequests().subscribe((data: any[]) => {
          const filtered = data.filter((req: any) => {
            const empName = (req.userName || "").toLowerCase().trim();

            return (
              leaderNames.some(
                (name) => empName === name || empName.includes(name),
              ) && req.userId !== this.currentUserId // ✅ EXCLUDE TL OWN
            );
          });

          // ✅ STEP 5: map INCLUDING photoUrl
          this.filteredRequests = filtered.map((req) => {
            const contact = contacts.find(
              (c) =>
                c.name?.toLowerCase().trim() ===
                (req.userName || "").toLowerCase().trim(),
            );

            return {
              ...req,
              employeeName: req.userName,
              status: (req.status || "pending").toLowerCase(),
              attachments: Array.isArray(req.attachments)
                ? req.attachments
                : [],
              photoUrl: contact?.photoUrl || "", // ✅ THIS FIXES YOUR ISSUE
            };
          });

          console.log("TEAM LEADERS WFH:", this.filteredRequests);
        });
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
    if (file?.url) window.open(file.url, "_blank");
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
      newFiles: [],
    };
  }

  cancelEdit(): void {
    this.editingRowId = null;
    this.editedRow = {};
  }

  toSafeDate(dateStr: string): string {
    return dateStr + "T12:00:00";
  }

  saveEdit(req: any): void {
    const formData = new FormData();

    formData.append("startDate", this.toSafeDate(this.editedRow.startDate));
    formData.append("endDate", this.toSafeDate(this.editedRow.endDate));
    formData.append("reason", this.editedRow.reason);
    formData.append(
      "existingFiles",
      JSON.stringify(this.editedRow.attachments),
    );

    if (this.editedRow.newFiles) {
      this.editedRow.newFiles.forEach((file: File) => {
        formData.append("files", file);
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
    if (!fileName) return "";

    const index = fileName.indexOf("_");
    return index !== -1 ? fileName.substring(index + 1) : fileName;
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

  closeDialog() {
    this.dialog.closeAll();
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

    if (!this.fileViewerDialog) {
      console.error("Dialog template not found!");
      return;
    }

    this.dialog.open(this.fileViewerDialog, {
      width: "80vw",
      height: "90vh",
      panelClass: "custom-cv-dialog",
    });
  }

  downloadFile() {
    if (!this.rawFileUrl) return;

    fetch(this.rawFileUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = this.getFileName(this.rawFileUrl);

        document.body.appendChild(a);
        a.click();

        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => console.error("Download failed", err));
  }

  getFileName(url: string): string {
    return url.split("/").pop() || "file";
  }

  getMonthRange(type: "current" | "previous" | "next") {
    const now = new Date();

    let start: Date;
    let end: Date;

    if (type === "current") {
      // MAY
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (type === "previous") {
      // APRIL
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      end = new Date(now.getFullYear(), now.getMonth(), 0);
    } else {
      // JUNE
      start = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      end = new Date(now.getFullYear(), now.getMonth() + 2, 0);
    }

    return {
      start: this.formatDate(start),
      end: this.formatDate(end),
    };
  }

  openProfileModal(element: any) {
    this.dialog.open(this.profileDialog, {
      data: element,
      panelClass: "profile-dialog",
      backdropClass: "blur-backdrop",
    });
  }

  showOnlyTeamLeadersData() {
    this.hrService.getContactTeams().subscribe((teams: any[]) => {
      // ✅ Get all TL IDs
      const leaderIds = teams.map((t) => t.leaderID);

      // ✅ Filter requests where USER itself is TL
      this.filteredRequests = this.requests.filter((req) =>
        leaderIds.includes(req.userId),
      );

      console.log("TEAM LEADERS DATA:", this.filteredRequests);
    });
  }
}
