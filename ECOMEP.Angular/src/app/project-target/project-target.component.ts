import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { ProjectTargetService } from "./project-target.service";

import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";

import { HeaderComponent } from "../mcv-header/components/header/header.component";
import { AuthService } from "src/app/auth/services/auth.service";
import { StageService } from "../stage-status/services/stage.service";
import { ProjectStageMailViewComponent } from "../stage-status/project-stage-mail-view/project-stage-mail-view.component";
import { ProjectApiService } from "../project/services/project-api.service";
import { WorkOrderStageApiService } from "src/app/work-order/services/work-order-stage-api.service";


@Component({
  selector: "app-project-target",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDialogModule,
    HeaderComponent,
  ],
  templateUrl: "./project-target.component.html",
  styleUrls: ["./project-target.component.scss"],
})
export class ProjectTargetComponent implements OnInit {
  expandedDialog: { [key: number]: boolean } = {};
  expandedRows: { [key: number]: boolean } = {};
  expandedFieldRows: { [key: string]: boolean } = {};
  expandedFeedback: { [key: number]: boolean } = {};
  stagePointsMap: any = {};
  workOrderStages: any[] = [];

  isEdit = false;
  editId: number | null = null;

  sortColumn: string = "";
  sortDirection: "asc" | "desc" = "asc";
  searchText: string = "";

  activeTab: string = "all";
  originalTargets: any[] = [];
  fromDate: string = "";
  toDate: string = "";

  projects: any[] = [];
  stages: any[] = [];
  statuses: string[] = [];
  targets: any[] = [];
  latestStageMailMap: any = {};
  editSelectedFiles: File[] = [];
  deletedAttachments: string[] = [];

  previewVisible = false;

  previewFiles: any[] = [];

  currentPreview: any = null;

  currentIndex = 0;

  editRow: any = {
    stage: "",
    stageStatus: "",
    targetDate: null,
    feedback: "",
  };

  constructor(
    private service: ProjectTargetService,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog,
    private stageService: StageService,
    private projectService: ProjectApiService,
    private workOrderStageApiService: WorkOrderStageApiService,
  ) {}

  // ================= FEEDBACK =================

  toggleFeedbackExpand(id: number) {
    this.expandedFeedback[id] = !this.expandedFeedback[id];
  }

  isLongText(text: string | null | undefined): boolean {
    return !!text && text.length > 120;
  }

  dialogData: any[] = [];

  openFeedbackDialog(template: any, row: any) {
    this.dialogData = this.getFieldHistory(row.history, "Feedback");

    this.dialog.open(template, {
      width: "650px",
      maxWidth: "90vw",
      panelClass: "custom-dialog",
    });
  }

  // ================= INIT =================

  ngOnInit(): void {
    this.loadFormData();
    this.loadStagePoints();
    this.loadWorkOrderStages();
  }

  loadFormData() {
    this.service.getFormData().subscribe((res) => {
      const allProjects = res.projects || [];

      if (!this.authService.currentUserStore?.roles.includes("MASTER")) {
        const userTeamIds =
          this.authService.currentUserStore?.teams?.map((t: any) => t.id) || [];

        this.projects = allProjects.filter((p: any) =>
          p.teamIds?.some((id: number) => userTeamIds.includes(id)),
        );
      } else {
        this.projects = allProjects;
      }

      this.stages = res.stages || [];
      this.statuses = res.statuses || [];

      this.loadTargets();
    });
  }

  loadTargets() {
    this.service.getAll().subscribe((res: any[]) => {
      let data = res || [];

      if (!this.authService.currentUserStore?.roles.includes("MASTER")) {
        const userTeamIds =
          this.authService.currentUserStore?.teams?.map((t: any) => t.id) || [];

        data = data.filter((t: any) =>
          t.teamIds?.some((id: number) => userTeamIds.includes(id)),
        );
      }

      this.originalTargets = data.map((t) => ({
        ...t,
        projectName: this.getProjectName(t.projectId) || "",

        // fallback safety
        attachments: t.attachments || [],
      }));

      this.targets = [...this.originalTargets];

      this.groupTargetsByMonth();

      this.applyProjectNames();
      this.loadLatestStageStatuses();
    });
  }

  openForm() {
    this.router.navigate(["/project-target/create"]);
  }

  edit(item: any) {
    this.router.navigate(["/project-target/edit", item.id]);
  }

  getProjectName(id: number): string {
    const p = this.projects.find((x) => x.id === id);
    return p ? p.title : "";
  }

  getStatusClass(status: string): string {
    switch (status) {
      case "Complete & Generate Invoice":
        return "status-complete";
      case "In Progress":
        return "status-progress";
      case "On Hold":
        return "status-hold";
      default:
        return "status-default";
    }
  }

  startEdit(row: any) {
    this.editId = row.id;

    let formattedDate = null;

    if (row.targetDate) {
      const d = new Date(row.targetDate);
      formattedDate =
        d.getFullYear() +
        "-" +
        String(d.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(d.getDate()).padStart(2, "0");
    }

    this.editRow = {
      stage: row.stage,
      stageStatus: row.stageStatus,
      targetDate: formattedDate,
      feedback: row.feedback,
    };

    this.loadStages(row.projectId);
  }

  cancelEdit() {
    this.editId = null;
    this.editRow = {};
  }

  saveEdit() {
    const original = this.targets.find((t) => t.id === this.editId);

    let fixedDate = null;

    if (this.editRow.targetDate) {
      const d = new Date(this.editRow.targetDate);
      d.setDate(d.getDate() + 1);

      fixedDate =
        d.getFullYear() +
        "-" +
        String(d.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(d.getDate()).padStart(2, "0") +
        "T00:00:00";
    }

    const formData = new FormData();

    formData.append("projectId", original.projectId);

    formData.append("stage", this.editRow.stage);

    formData.append("stageStatus", this.editRow.stageStatus);

    formData.append("targetDate", fixedDate || "");

    formData.append("feedback", this.editRow.feedback || "");

    this.editSelectedFiles.forEach((file: File) => {
      formData.append("attachments", file);
    });

    // original.attachments?.forEach((file: any) => {
    //   formData.append("existingAttachments", file.fileName);
    // });

    this.deletedAttachments.forEach((fileName: string) => {
      formData.append("deletedAttachments", fileName);
    });

    // this.service.update(this.editId!, payload).subscribe(() => {
    this.service.update(this.editId!, formData).subscribe(() => {
      this.editSelectedFiles = [];
      this.deletedAttachments = [];
      this.editId = null;
      this.loadTargets();
    });
  }

  loadStages(projectId: number) {
    this.service.getStagesByProject(projectId).subscribe((res: any) => {
      this.stages = res || [];
    });
  }

  toggleHistory(id: number) {
    this.expandedRows[id] = !this.expandedRows[id];
  }

  toggleFieldHistory(id: number, field: string) {
    const key = id + "_" + field;
    this.expandedFieldRows[key] = !this.expandedFieldRows[key];
  }

  getFieldHistory(history: any[], field: string) {
    if (!history) return [];

    return history
      .filter((h) => h.fieldName === field)
      .sort(
        (a, b) =>
          new Date(b.changedOn).getTime() - new Date(a.changedOn).getTime(),
      );
  }

  applyProjectNames() {
    if (!this.projects.length || !this.targets.length) return;

    this.targets = this.targets.map((t) => ({
      ...t,
      projectName: this.getProjectName(t.projectId) || "",
    }));

    if (this.sortColumn) {
      this.sortData(this.sortColumn);
    }
  }

  sortData(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
    } else {
      this.sortColumn = column;
      this.sortDirection = "asc";
    }

    const cleanName = (name: string) => {
      return (name || "")
        .toLowerCase()
        .replace(/^m\/s\s*/i, "")
        .replace(/^m\s*s\s*/i, "")
        .replace(/^v\.\s*d\.?\s*/i, "")
        .replace(/pvt\.?\s*ltd\.?/i, "")
        .replace(/[^a-z0-9 ]/g, "")
        .trim();
    };

    const parseDate = (d: any) => {
      if (!d) return 0;

      const parts = d.toString().split("T")[0].split("-");
      if (parts.length !== 3) return 0;

      const year = Number(parts[0]);
      const month = Number(parts[1]) - 1;
      const day = Number(parts[2]);

      return new Date(year, month, day).getTime();
    };

    this.targets = [...this.targets].sort((a: any, b: any) => {
      let valueA: any = "";
      let valueB: any = "";

      switch (column) {
        case "project":
          valueA = cleanName(a.projectName);
          valueB = cleanName(b.projectName);
          break;

        case "code":
          valueA = (a.projectCode || "").toLowerCase();
          valueB = (b.projectCode || "").toLowerCase();
          break;

        case "stage":
          valueA = (a.stage || "").toLowerCase();
          valueB = (b.stage || "").toLowerCase();
          break;

        case "status":
          valueA = (a.stageStatus || "").toLowerCase();
          valueB = (b.stageStatus || "").toLowerCase();
          break;

        case "date":
          const timeA = parseDate(a.targetDate);
          const timeB = parseDate(b.targetDate);

          return this.sortDirection === "asc" ? timeA - timeB : timeB - timeA;
      }

      return this.sortDirection === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
  }

  applySearch() {
    this.applyAllFilters();
  }

  applyFilter(type: string) {
    this.activeTab = type;
    this.applyAllFilters();
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  applyAllFilters() {
    const text = this.searchText.toLowerCase();

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const parseDate = (d: any) => {
      if (!d) return 0;

      const parts = d.toString().split("T")[0].split("-");
      if (parts.length !== 3) return 0;

      const year = Number(parts[0]);
      const month = Number(parts[1]) - 1;
      const day = Number(parts[2]);

      return new Date(year, month, day).getTime();
    };

    const from = this.fromDate ? parseDate(this.fromDate) : null;
    const to = this.toDate ? parseDate(this.toDate) : null;

    this.targets = this.originalTargets.filter((t: any) => {
      // 🔍 SEARCH
      const project = this.getProjectName(t.projectId).toLowerCase();
      const code = (t.projectCode || "").toLowerCase();

      const matchesSearch =
        !text || project.includes(text) || code.includes(text);

      // 📅 TAB FILTER
      let matchesTab = true;

      if (t.targetDate) {
        const d = new Date(t.targetDate);
        const month = d.getMonth();
        const year = d.getFullYear();

        switch (this.activeTab) {
          case "current":
            matchesTab = month === currentMonth && year === currentYear;
            break;

          case "prev":
            matchesTab =
              (month === currentMonth - 1 && year === currentYear) ||
              (currentMonth === 0 && month === 11 && year === currentYear - 1);
            break;

          case "next":
            matchesTab =
              (month === currentMonth + 1 && year === currentYear) ||
              (currentMonth === 11 && month === 0 && year === currentYear + 1);
            break;
        }
      }

      // 📆 CUSTOM DATE FILTER
      let matchesDateRange = true;

      if (from !== null && to !== null) {
        const time = parseDate(t.targetDate);
        matchesDateRange = time >= from && time <= to;
      }

      return matchesSearch && matchesTab && matchesDateRange;
    });

    this.applyProjectNames();
    this.groupTargetsByMonth();
  }

  onEditFilesSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.editSelectedFiles = Array.from(event.target.files);

      console.log("Edit Selected Files => ", this.editSelectedFiles);
    }
  }

  getDisplayFileName(fileName: string): string {
    if (!fileName) {
      return "";
    }

    const parts = fileName.split("_");

    if (parts.length > 1) {
      parts.shift();

      return parts.join("_");
    }

    return fileName;
  }

  removeSelectedFile(index: number) {
    this.editSelectedFiles.splice(index, 1);

    this.editSelectedFiles = [...this.editSelectedFiles];
  }

  removeAttachment(row: any, index: number) {
    const removedFile = row.attachments[index];

    if (removedFile?.fileName) {
      this.deletedAttachments.push(removedFile.fileName);
    }

    row.attachments.splice(index, 1);

    row.attachments = [...row.attachments];

    console.log("Deleted Attachments => ", this.deletedAttachments);
  }

  openPreview(files: any[], index: number) {
    this.previewFiles = files;
    this.currentIndex = index;
    this.currentPreview = files[index];

    this.previewVisible = true;
  }

  closePreview() {
    this.previewVisible = false;
  }

  nextFile() {
    if (this.currentIndex < this.previewFiles.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }

    this.currentPreview = this.previewFiles[this.currentIndex];
  }

  previousFile() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.previewFiles.length - 1;
    }

    this.currentPreview = this.previewFiles[this.currentIndex];
  }

  isImage(url: string): boolean {
    if (!url) return false;

    return (
      url.includes(".png") ||
      url.includes(".jpg") ||
      url.includes(".jpeg") ||
      url.includes(".gif") ||
      url.includes(".webp")
    );
  }

  isPdf(url: string): boolean {
    if (!url) return false;

    return url.includes(".pdf");
  }

  downloadFile(file: any) {
    fetch(file.fileUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const blobUrl = window.URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = blobUrl;

        a.download = this.getDisplayFileName(file.fileName);

        document.body.appendChild(a);

        a.click();

        document.body.removeChild(a);

        window.URL.revokeObjectURL(blobUrl);
      });
  }

  loadLatestStageStatuses() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const isFullAccess = currentUser.roles?.includes("MASTER") || false;
    this.projectService
      .getProjectsForEmail(0, 10000, isFullAccess)
      .subscribe({
        next: (projectRes: any) => {
          const projectIds = (projectRes?.list || []).map((p: any) => p.id);
          if (!projectIds.length) {
            this.latestStageMailMap = {};
            this.attachLatestStatusToTargets();
            return;
          }

          this.stageService.getUserProjectStageMails(projectIds)
            .subscribe((res: any[]) => {
              const grouped: any = {};
              res.forEach((mail: any) => {
                const key = `${mail.projectName}_${mail.stageName}`;
                if (
                  !grouped[key] ||
                  new Date(mail.mailSentDate).getTime() >
                  new Date(grouped[key].mailSentDate).getTime()
                ) {
                  grouped[key] = mail;
                }
              });
              this.latestStageMailMap = grouped;
              this.attachLatestStatusToTargets();
            });
        }
      });
  }

  attachLatestStatusToTargets() {
    this.targets = this.targets.map((t: any) => {
      const key = `${t.projectCode} - ${t.projectName}_${t.stage}`;
      return {
        ...t,
        latestMailStatus: this.latestStageMailMap[key] || null
      };
    });
  }

  openStageMail(item: any) {
    if (!item) return;
    this.dialog.open(ProjectStageMailViewComponent, {
      width: "75vw",
      height: "85vh",
      maxWidth: "95vw",
      data: item,
    });
  }

  loadStagePoints() {

    this.workOrderStageApiService.get().subscribe((res: any[]) => {

      this.stagePointsMap = {};

      res.forEach((x: any) => {

        const key = `${x.projectID}_${x.title}`;

        this.stagePointsMap[key] = x.points || 0;
      });
    });
  }

  getStagePoints(projectId: number, stage: string): number {

    const key = `${projectId}_${stage}`;

    return this.stagePointsMap[key] || 0;
  }


  loadWorkOrderStages() {

    this.workOrderStageApiService.get().subscribe((res: any[]) => {

      this.workOrderStages = res || [];
    });
  }

  getPoints(projectId: number, stage: string): number {

    const targetStage = (stage || "")
      .trim()
      .toLowerCase();

    const row = this.workOrderStages.find((x: any) => {

      const dbStage = (x.title || "")
        .trim()
        .toLowerCase();

      return (
        x.projectID === projectId &&
        (
          dbStage.includes(targetStage) ||
          targetStage.includes(dbStage)
        )
      );
    });

    return row?.points || 0;
  }

  groupedTargets: any[] = [];

  groupTargetsByMonth() {

    const groups: any = {};

    this.targets.forEach((t: any) => {

      if (!t.targetDate) return;

      const d = new Date(t.targetDate);

      const monthKey =
        d.toLocaleString('default', { month: 'long' }) +
        ' ' +
        d.getFullYear();

      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }

      groups[monthKey].push(t);
    });

    this.groupedTargets = Object.keys(groups)

    .sort((a: any, b: any) => {

      const dateA = new Date(a);
      const dateB = new Date(b);

      return dateB.getTime() - dateA.getTime();
    })

    .map((month) => {

      const items = groups[month];

      const totalPoints = items.reduce(
        (sum: number, x: any) =>
          sum + this.getPoints(x.projectId, x.stage),
        0
      );

      return {
        month,
        items,
        totalPoints
      };
    });
  }
}
