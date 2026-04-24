import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { ProjectTargetService } from "./project-target.service";

import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";

import { HeaderComponent } from "../mcv-header/components/header/header.component";

@Component({
  selector: "app-project-target",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,

    HeaderComponent   // ✅ ADD HEADER HERE
  ],
  templateUrl: "./project-target.component.html",
  styleUrls: ["./project-target.component.scss"],
})
export class ProjectTargetComponent implements OnInit {

  isEdit = false;
  editId: number | null = null;

  projects: any[] = [];
  stages: any[] = [];
  statuses: string[] = [];
  targets: any[] = [];
  editRow: any = {
  stage: '',
  stageStatus: '',
  targetDate: null,
  feedback: ''
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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFormData();
    this.loadTargets();
  }

  // ================= LOAD DATA =================
  loadFormData() {
    this.service.getFormData().subscribe(res => {
      this.projects = res.projects || [];
      this.stages = res.stages || [];
      this.statuses = res.statuses || [];
    });
  }

  loadTargets() {
    this.service.getAll().subscribe(res => {
      this.targets = res || [];
    });
  }

  // ================= NAVIGATION =================

  openForm() {
    this.router.navigate(['/project-target/create']);
  }

  edit(item: any) {
    this.router.navigate(['/project-target/edit', item.id]);
  }

  // ================= ACTIONS =================

  delete(id: number) {
    if (!confirm("Are you sure you want to delete this record?")) return;

    this.service.delete(id).subscribe(() => {
      this.loadTargets();
    });
  }

  // ================= HELPERS =================

  getProjectName(id: number): string {
    const p = this.projects.find(x => x.id === id);
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
      case "Complete & Generate Invoice": return "status-complete";
      case "In Progress": return "status-progress";
      case "On Hold": return "status-hold";
      default: return "status-default";
    }
  }

  trackById(index: number, item: any) {
    return item.id;
  }


startEdit(row: any) {
  this.editId = row.id;

  this.editRow = {
    stage: row.stage,
    stageStatus: row.stageStatus,
    targetDate: row.targetDate ? row.targetDate.split('T')[0] : null,
    feedback: row.feedback
  };

  // only for dependent dropdown
  this.loadStages(row.projectId);
}

// CANCEL EDIT
cancelEdit() {
  this.editId = null;
  this.editRow = {};
}

// SAVE EDIT


saveEdit() {
  const original = this.targets.find(t => t.id === this.editId);

  const payload = {
    projectId: original.projectId,   // ✅ KEEP THIS
    stage: this.editRow.stage,
    stageStatus: this.editRow.stageStatus,
    targetDate: this.editRow.targetDate,
    feedback: this.editRow.feedback
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
}