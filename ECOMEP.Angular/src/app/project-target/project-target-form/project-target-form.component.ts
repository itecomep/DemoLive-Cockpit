import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ProjectTargetService } from "../project-target.service";
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { HeaderComponent } from "../../mcv-header/components/header/header.component";

@Component({
  selector: "app-project-target-form",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,

    HeaderComponent, // ✅ ADD THIS LINE
  ],
  templateUrl: "./project-target-form.component.html",
  styleUrls: ["./project-target-form.component.scss"],
})
export class ProjectTargetFormComponent implements OnInit {
  targets: any[] = [];
  isEdit = false;
  id: number | null = null;

  form: any = {
    projectId: null,
    stage: "",
    stageStatus: "",
    targetDate: null,
    feedback: "",
  };

  projects: any[] = [];
  stages: any[] = [];
  statuses: string[] = [];

  constructor(
    private service: ProjectTargetService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  // ================= INIT =================
  ngOnInit() {
    this.loadFormData();

    const idParam = this.route.snapshot.paramMap.get("id");

    if (idParam) {
      this.isEdit = true;
      this.id = +idParam;
      this.loadById(this.id);
    }

    this.service.getAll().subscribe((res: any) => {
      this.targets = res || [];
    });
  }

  // ================= LOAD DROPDOWNS =================
  loadFormData() {
    this.service.getFormData().subscribe((res: any) => {
      this.projects = res.projects || [];
      this.stages = res.stages || [];
      this.statuses = res.statuses || [];
    });
  }

  // ================= LOAD BY ID =================
  loadById(id: number) {
    this.service.getById(id).subscribe((res: any) => {
      this.form = res;

      if (this.form?.projectId) {
        this.loadStages(this.form.projectId);
      }
    });
  }

  // ================= PROJECT CHANGE =================
  onProjectChange() {
    if (!this.form.projectId) {
      this.stages = [];
      return;
    }

    this.loadStages(this.form.projectId);
  }

  loadStages(projectId: number) {
    this.service.getStagesByProject(projectId).subscribe((res: any) => {
      this.stages = res || [];
    });
  }

  // ================= SAVE =================
  save() {
    if (!this.form.projectId || !this.form.stage || !this.form.stageStatus) {
      alert("Please fill required fields");
      return;
    }

    if (this.isEdit && this.id) {
      this.service.update(this.id, this.form).subscribe(() => {
        this.router.navigate(["/project-target"]);
      });
    } else {
      this.service.create(this.form).subscribe(() => {
        this.router.navigate(["/project-target"]);
      });
    }
  }

  // ================= CANCEL =================
  cancel() {
    this.router.navigate(["/project-target"]);
  }

  // ================= TRACK =================
  trackById(index: number, item: any) {
    return item.id;
  }

  isStageAlreadyUsed(stageTitle: string): boolean {
    return this.targets?.some(
      (t: any) => t.projectId === this.form.projectId && t.stage === stageTitle,
    );
  }
}
