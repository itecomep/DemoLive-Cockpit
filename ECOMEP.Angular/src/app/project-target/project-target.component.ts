import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { ProjectTargetService } from "./project-target.service";

import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";

import { HeaderComponent } from "../mcv-header/components/header/header.component";
import { AuthService } from "src/app/auth/services/auth.service";

@Component({
  selector: "app-project-target",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    HeaderComponent,
  ],
  templateUrl: "./project-target.component.html",
  styleUrls: ["./project-target.component.scss"],
})
export class ProjectTargetComponent implements OnInit {
  expandedRows: { [key: number]: boolean } = {};
expandedFieldRows: { [key: string]: boolean } = {};
expandedFeedback: { [key: number]: boolean } = {};
  isEdit = false;
  editId: number | null = null;
  

  projects: any[] = [];
  stages: any[] = [];
  statuses: string[] = [];
  targets: any[] = [];
  editRow: any = {
    stage: "",
    stageStatus: "",
    targetDate: null,
    feedback: "",
  };

  form: any = {
    projectId: null,
    stage: "",
    stageStatus: "",
    targetDate: null,
    feedback: "",
  };


  
  constructor(
    private service: ProjectTargetService,
    private router: Router,
    private authService: AuthService,
  ) {}

  
  toggleFeedbackExpand(id: number) {
  this.expandedFeedback[id] = !this.expandedFeedback[id];
}


isLongText(text: string | null | undefined): boolean {
  return !!text && text.length > 120;
}

  ngOnInit(): void {
    this.loadFormData();
    this.loadTargets();
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
    });
  }

  loadTargets() {
    this.service.getAll().subscribe((res: any[]) => {
      if (!this.authService.currentUserStore?.roles.includes("MASTER")) {
        const userTeamIds =
          this.authService.currentUserStore?.teams?.map((t: any) => t.id) || [];

        this.targets = (res || []).filter((t: any) =>
          t.teamIds?.some((id: number) => userTeamIds.includes(id)),
        );
      } else {
        this.targets = res || [];
      }
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
    return p ? p.title : "id";
  }

  isExpired(date: any): boolean {
    if (!date) return false;
    const d = new Date(date + "T00:00:00");
    const today = new Date();
    return d < today;
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

  trackById(index: number, item: any) {
    return item.id;
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

    const payload = {
      projectId: original.projectId,
      stage: this.editRow.stage,
      stageStatus: this.editRow.stageStatus,
      targetDate: fixedDate,
      feedback: this.editRow.feedback,
    };

    this.service.update(this.editId!, payload).subscribe(() => {
      this.editId = null;
      this.loadTargets();
    });
  }

  loadStages(projectId: number) {
    this.service.getStagesByProject(projectId).subscribe((res: any) => {
      this.stages = res || [];
    });
  }

  getLatestHistory(row: any, field: string) {
    if (!row.history) return null;

    return row.history
      .filter((h: any) => h.fieldName === field)
      .sort(
        (a: any, b: any) =>
          new Date(b.changedOn).getTime() - new Date(a.changedOn).getTime(),
      )[0];
  }

  historyState: { [key: string]: boolean } = {};

toggleHistory(id: number) {
  this.expandedRows[id] = !this.expandedRows[id];
}

toggleFieldHistory(id: number, field: string) {
  const key = id + '_' + field;
  this.expandedFieldRows[key] = !this.expandedFieldRows[key];
}

toggleFeedback(event: Event, id: number) {
  event.stopPropagation();
  this.expandedFeedback[id] = !this.expandedFeedback[id];
}

isHistoryOpen(row: any, type: string): boolean {
  return this.historyState[row.id + '_' + type];
}

getHistory(row: any, field: string) {
  if (!row.history) return [];

  return row.history
    .filter((h: any) => h.fieldName === field)
    .sort((a: any, b: any) =>
      new Date(b.changedOn).getTime() - new Date(a.changedOn).getTime()
    );
}


getFieldHistory(history: any[], field: string) {
  if (!history) return [];

  return history
    .filter(h => h.fieldName === field)
    .sort((a, b) =>
      new Date(b.changedOn).getTime() - new Date(a.changedOn).getTime()
    );
}

  // delete(id: number) {
  //   if (!confirm("Are you sure you want to delete this record?")) return;

  //   this.service.delete(id).subscribe(() => {
  //     this.loadTargets();
  //   });
  // }
}
