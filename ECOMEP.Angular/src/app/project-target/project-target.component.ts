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

      HeaderComponent, // ✅ ADD HEADER HERE
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
  expandedRows: { [key: number]: boolean } = {};
  expandedFieldRows: { [key: string]: boolean } = {};
    
    constructor(
      private service: ProjectTargetService,
      private router: Router,
    ) {}

    ngOnInit(): void {
      this.loadFormData();
      this.loadTargets();
    }

    // ================= LOAD DATA =================
    loadFormData() {
      this.service.getFormData().subscribe((res) => {
        this.projects = res.projects || [];
        this.stages = res.stages || [];
        this.statuses = res.statuses || [];
      });
    }

    // loadTargets() {
    //   this.service.getAll().subscribe((res) => {
    //     this.targets = res || [];
    //   });
    // }

  //   loadTargets() {
  //   this.service.getAll().subscribe((res) => {
  //     this.targets = res || [];

  //     this.targets.forEach(t => {
  //       if (!t.statusHistory) {
  //         t.statusHistory = [];
  //       }
  //     });
  //   });
  // }


  loadTargets() {
    this.service.getAll().subscribe((res) => {
      this.targets = res || [];

      this.targets.forEach(t => {

        // ✅ normalize BOTH possible backend fields
        t.statusHistory = t.statusHistory || t.history || [];

        // optional safety: ensure it's always an array
        if (!Array.isArray(t.statusHistory)) {
          t.statusHistory = [];
        }
      });

    });
  }

    // ================= NAVIGATION =================

    openForm() {
      this.router.navigate(["/project-target/create"]);
    }

    edit(item: any) {
      this.router.navigate(["/project-target/edit", item.id]);
    }

    // ================= ACTIONS =================

    // delete(id: number) {
    //   if (!confirm("Are you sure you want to delete this record?")) return;

    //   this.service.delete(id).subscribe(() => {
    //     this.loadTargets();
    //   });
    // }

    // ================= HELPERS =================

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

        // ✅ FIX: LOCAL DATE ONLY (NO SHIFT)
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

    // CANCEL EDIT
    cancelEdit() {
      this.editId = null;
      this.editRow = {};
    }

    // SAVE EDIT

    // saveEdit() {
    //   const original = this.targets.find((t) => t.id === this.editId);

    //   let fixedDate = null;

    //   if (this.editRow.targetDate) {
    //     const d = new Date(this.editRow.targetDate);

    //     // ✅ ADD 1 DAY to counter backend timezone shift
    //     d.setDate(d.getDate() + 1);

    //     fixedDate =
    //       d.getFullYear() +
    //       "-" +
    //       String(d.getMonth() + 1).padStart(2, "0") +
    //       "-" +
    //       String(d.getDate()).padStart(2, "0") +
    //       "T00:00:00";
    //   }

    //   const payload = {
    //     projectId: original.projectId,
    //     stage: this.editRow.stage,
    //     stageStatus: this.editRow.stageStatus,
    //     targetDate: fixedDate,
    //     feedback: this.editRow.feedback,
    //   };

    //   this.service.update(this.editId!, payload).subscribe(() => {
    //     this.editId = null;
    //     this.loadTargets();
    //   });
    // }

    saveEdit() {
    const original = this.targets.find(t => t.id === this.editId);

    const today = new Date();
    const formatted =
      today.getFullYear() +
      '-' +
      String(today.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(today.getDate()).padStart(2, '0');

    // 🔥 clone old history
    const history = original.statusHistory
      ? [...original.statusHistory]
      : [];

    // 🔥 avoid duplicate consecutive status
    const last = history[history.length - 1];

    if (!last || last.status !== this.editRow.stageStatus) {
      history.push({
        status: this.editRow.stageStatus,
        date: formatted
      });
    }

    const payload = {
      projectId: original.projectId,
      stage: this.editRow.stage,
      stageStatus: this.editRow.stageStatus,
      targetDate: this.editRow.targetDate,
      feedback: this.editRow.feedback,
      statusHistory: history   // ✅ IMPORTANT
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
    
  // getLatestHistory(row: any, field: string) {
  //   if (!row.history) return null;

  //   return row.history
  //     .filter((h: any) => h.fieldName === field)
  //     .sort((a: any, b: any) =>
  //       new Date(b.changedOn).getTime() - new Date(a.changedOn).getTime()
  //     )[0];
  // }

  getLatestStatus(row: any) {
    if (!row?.statusHistory?.length) return null;

    return [...row.statusHistory].sort((a: any, b: any) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
  }

  getAllHistory(row: any) {
    if (!row?.history) return [];

    return row.history
      .filter((h: any) => h.fieldName === 'StageStatus')
      .sort((a: any, b: any) =>
        new Date(b.changedOn).getTime() -
        new Date(a.changedOn).getTime()
      );
  }

  toggleHistory(rowId: number) {
    this.expandedRows[rowId] = !this.expandedRows[rowId];
  }

  getLatestHistory(row: any, field: string) {
    if (!row?.history) return null;

    return row.history
      .filter((h: any) => h.fieldName === field)
      .sort((a: any, b: any) =>
        new Date(b.changedOn).getTime() - new Date(a.changedOn).getTime()
      )[0];
  }

  toggleFieldHistory(rowId: number, field: string) {
  const key = `${rowId}_${field}`;
  this.expandedFieldRows[key] = !this.expandedFieldRows[key];
}



getHistoryByField(row: any, field: string) {
  if (!row?.history) return [];

  return row.history
    .filter((h: any) => h.fieldName === field)
    .sort((a: any, b: any) =>
      new Date(b.changedOn).getTime() -
      new Date(a.changedOn).getTime()
    );
}

// Add this inside your ProjectTargetComponent class
getFieldHistory(history: any[], fieldName: string): any[] {
  if (!history || !Array.isArray(history)) return [];
  
  return history
    .filter((h: any) => h.fieldName === fieldName)
    .sort((a: any, b: any) => new Date(b.changedOn).getTime() - new Date(a.changedOn).getTime());
}


  }
