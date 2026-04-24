import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ProjectTargetService } from "./project-target.service";

@Component({
  selector: "app-project-target",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./project-target.component.html",
  styleUrls: ["./project-target.component.scss"],
})
export class ProjectTargetComponent implements OnInit {
  completedStages: string[] = [];
  isEdit = false;
  editId: number | null = null;
  // 🔹 Dropdown data
  projects: any[] = [];
  stages: any[] = [];
  statuses: string[] = [];

  // 🔹 Table data
  targets: any[] = [];

  // 🔹 Form model
  form: any = {
    projectId: null,
    stage: "",
    stageStatus: "",
    targetDate: null,
    feedback: "",
  };

  constructor(private service: ProjectTargetService) {}

  // ================= INIT =================
  ngOnInit(): void {
    this.loadFormData();
    this.loadTargets();
  }

  // ================= LOAD DATA =================

  loadFormData() {
    this.service.getFormData().subscribe((res) => {
      console.log("Projects:", res.projects); // 👈 CHECK THIS

      this.projects = res.projects || [];
      this.stages = res.stages || [];
      this.statuses = res.statuses || [];
    });
  }

  // loadTargets() {
  //   this.service.getAll().subscribe({
  //     next: (res) => {
  //       this.targets = res || [];
  //     },
  //     error: (err) => {
  //       console.error("Error loading targets", err);
  //     },
  //   });
  // }

  loadTargets() {
    this.service.getAll().subscribe({
      next: (res) => {
        this.targets = res || [];

        // 🔥 Recalculate if project already selected
        if (this.form.projectId) {
          this.onProjectChange();
        }
      },
      error: (err) => {
        console.error("Error loading targets", err);
      },
    });
  }

  // ================= EVENTS =================

  onProjectChange() {
    if (!this.form.projectId) {
      this.stages = [];
      this.completedStages = [];
      return;
    }

    // load stages
    this.service.getStagesByProject(this.form.projectId).subscribe({
      next: (res) => (this.stages = res || []),
      error: (err) => console.error("Error loading stages", err),
    });

    // 🔥 filter completed stages from targets
    this.completedStages = this.targets
      .filter(
        (t) =>
          t.projectId === this.form.projectId &&
          t.stageStatus === "Complete & Generate Invoice",
      )
      .map((t) => t.stage);
  }

  // ================= ACTIONS =================

  save() {
    if (!this.form.projectId || !this.form.stage || !this.form.stageStatus) {
      alert("Please fill all required fields");
      return;
    }

    const payload = {
      ...this.form,
      targetDate: this.form.targetDate ? new Date(this.form.targetDate) : null,
    };

    if (this.isEdit && this.editId) {
      this.service.update(this.editId, payload).subscribe(() => {
        this.afterSave();
      });
    } else {
      this.service.create(payload).subscribe(() => {
        this.afterSave();
      });
    }
  }

  afterSave() {
    this.resetForm();
    this.loadTargets();
    this.isEdit = false;
    this.editId = null;
  }

  delete(id: number) {
    if (!confirm("Are you sure you want to delete this record?")) return;

    this.service.delete(id).subscribe({
      next: () => {
        this.loadTargets();
      },
      error: (err) => {
        console.error("Error deleting", err);
      },
    });
  }

  // ================= HELPERS =================

  resetForm() {
    this.form = {
      projectId: null,
      stage: "",
      stageStatus: "",
      targetDate: null,
      feedback: "",
    };

    this.stages = [];
  }

  trackById(index: number, item: any) {
    return item.id;
  }

  edit(item: any) {
    this.isEdit = true;
    this.editId = item.id;

    const matchedStatus = this.statuses.find(
      (s) =>
        s.trim().toLowerCase() ===
        (item.stageStatus || "").trim().toLowerCase(),
    );

    // ✅ FIX: force LOCAL date (ignore timezone completely)
    let formattedDate = null;

    if (item.targetDate) {
      const d = new Date(item.targetDate);
      formattedDate =
        d.getFullYear() +
        "-" +
        String(d.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(d.getDate()).padStart(2, "0");
    }

    

    this.service.getStagesByProject(item.projectId).subscribe((res) => {
      this.stages = res || [];
    });

    this.form = {
      projectId: item.projectId,
       stage: (item.stage || "").trim(),
      stageStatus: matchedStatus || null,
      targetDate: formattedDate,
      feedback: item.feedback,
    };
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
}
