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

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  searchText: string = '';

  activeTab: string = 'all';
originalTargets: any[] = []; // store full data
fromDate: string = '';
toDate: string = '';
  
  

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

  constructor(
    private service: ProjectTargetService,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadFormData();
    // this.loadTargets();
  }

  toggleFeedbackExpand(id: number) {
    this.expandedFeedback[id] = !this.expandedFeedback[id];
  }

  isLongText(text: string | null | undefined): boolean {
    return !!text && text.length > 120;
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

    // ✅ IMPORTANT: NOW load targets AFTER projects
    this.loadTargets();
  });
}

// loadTargets() {
//   this.service.getAll().subscribe((res: any[]) => {
//     if (!this.authService.currentUserStore?.roles.includes("MASTER")) {
//       const userTeamIds =
//         this.authService.currentUserStore?.teams?.map((t: any) => t.id) || [];

//       this.targets = (res || []).filter((t: any) =>
//         t.teamIds?.some((id: number) => userTeamIds.includes(id)),
//       );
//     } else {
//       this.targets = res || [];
//     }

//     // ✅ NOW project names WILL BE CORRECT
//     this.applyProjectNames();
//   });
// }

// loadTargets() {
//   this.service.getAll().subscribe((res: any[]) => {

//     let data = res || [];

//     if (!this.authService.currentUserStore?.roles.includes("MASTER")) {
//       const userTeamIds =
//         this.authService.currentUserStore?.teams?.map((t: any) => t.id) || [];

//       data = data.filter((t: any) =>
//         t.teamIds?.some((id: number) => userTeamIds.includes(id)),
//       );
//     }

//     this.originalTargets = data;   // ✅ store original
//     this.targets = [...data];

//     this.applyProjectNames();
//   });
// }



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

      // ✅ FIX: add projectName in originalTargets
      this.originalTargets = data.map(t => ({
        ...t,
        projectName: this.getProjectName(t.projectId) || ''
      }));

      this.targets = [...this.originalTargets];

      this.applyProjectNames();
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

  toggleHistory(id: number) {
    this.expandedRows[id] = !this.expandedRows[id];
  }

  toggleFieldHistory(id: number, field: string) {
    const key = id + '_' + field;
    this.expandedFieldRows[key] = !this.expandedFieldRows[key];
  }

  getFieldHistory(history: any[], field: string) {
    if (!history) return [];

    return history
      .filter(h => h.fieldName === field)
      .sort((a, b) =>
        new Date(b.changedOn).getTime() - new Date(a.changedOn).getTime()
      );
  }


applyProjectNames() {
  if (!this.projects.length || !this.targets.length) return;

  this.targets = this.targets.map(t => ({
    ...t,
    projectName: this.getProjectName(t.projectId) || ''
  }));

  // ✅ always apply default sort
  this.sortData(this.sortColumn || 'date');
}

//   // ✅ FINAL SORT FUNCTION
sortData(column: string) {
  if (this.sortColumn === column) {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    this.sortColumn = column;

    // ✅ if user clicks date first time → start with ASC
    this.sortDirection = column === 'date' ? 'asc' : 'asc';
  }

  const cleanName = (name: string) => {
    return (name || '')
      .toLowerCase()
      .replace(/^m\/s\s*/i, '')
      .replace(/^m\s*s\s*/i, '')
      .replace(/^v\.\s*d\.?\s*/i, '')
      .replace(/pvt\.?\s*ltd\.?/i, '')
      .replace(/[^a-z0-9 ]/g, '')
      .trim();
  };

  const parseDate = (d: any) => {
    if (!d) return 0;

    const parts = d.toString().split('T')[0].split('-');
    if (parts.length !== 3) return 0;

    const year = Number(parts[0]);
    const month = Number(parts[1]) - 1;
    const day = Number(parts[2]);

    return new Date(year, month, day).getTime();
  };

  this.targets = [...this.targets].sort((a: any, b: any) => {
    let valueA: any = '';
    let valueB: any = '';

    switch (column) {
      case 'project':
        valueA = cleanName(a.projectName);
        valueB = cleanName(b.projectName);
        break;

      case 'code':
        valueA = (a.projectCode || '').toLowerCase();
        valueB = (b.projectCode || '').toLowerCase();
        break;

      case 'stage':
        valueA = (a.stage || '').toLowerCase();
        valueB = (b.stage || '').toLowerCase();
        break;

      case 'status':
        valueA = (a.stageStatus || '').toLowerCase();
        valueB = (b.stageStatus || '').toLowerCase();
        break;

      case 'date':
        const timeA = parseDate(a.targetDate);
        const timeB = parseDate(b.targetDate);

        return this.sortDirection === 'asc'
          ? timeA - timeB
          : timeB - timeA;
    }

    return this.sortDirection === 'asc'
      ? valueA.localeCompare(valueB)
      : valueB.localeCompare(valueA);
  });
}




applyCustomDate() {
  if (!this.fromDate || !this.toDate) {
    // if one date missing → reset
    this.targets = [...this.originalTargets];
    this.applyProjectNames();
    return;
  }

  const parseDate = (d: any) => {
    if (!d) return 0;

    const parts = d.toString().split('T')[0].split('-');
    if (parts.length !== 3) return 0;

    const year = Number(parts[0]);
    const month = Number(parts[1]) - 1;
    const day = Number(parts[2]);

    return new Date(year, month, day).getTime();
  };

  const from = parseDate(this.fromDate);
  const to = parseDate(this.toDate);

  this.targets = this.originalTargets.filter((t: any) => {
    const time = parseDate(t.targetDate);
    return time >= from && time <= to;
  });

  this.applyProjectNames(); // keep sorting
}


// applySearch() {
//   const text = this.searchText.toLowerCase();

//   this.targets = this.originalTargets.filter((t: any) => {
//     const project = (t.projectName || '').toLowerCase();
//     const code = (t.projectCode || '').toLowerCase();

//     return project.includes(text) || code.includes(text);
//   });

//   this.applyProjectNames(); // keep sorting
// }


applySearch() {
  const text = this.searchText.toLowerCase();

  this.targets = this.originalTargets.filter((t: any) => {
    const project = this.getProjectName(t.projectId).toLowerCase();
    const code = (t.projectCode || '').toLowerCase();

    return project.includes(text) || code.includes(text);
  });

  this.applyProjectNames(); // keep sorting
}

applyFilter(type: string) {
  this.activeTab = type;

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  this.targets = this.originalTargets.filter((t: any) => {
    if (!t.targetDate) return false;

    const d = new Date(t.targetDate);
    const month = d.getMonth();
    const year = d.getFullYear();

    switch (type) {
      case 'all':
        return true;

      case 'current':
        return month === currentMonth && year === currentYear;

      case 'prev':
        return (
          (month === currentMonth - 1 && year === currentYear) ||
          (currentMonth === 0 && month === 11 && year === currentYear - 1)
        );

      case 'next':
        return (
          (month === currentMonth + 1 && year === currentYear) ||
          (currentMonth === 11 && month === 0 && year === currentYear + 1)
        );

      default:
        return true;
    }
  });

  this.applyProjectNames(); // re-apply names + sorting
}
}