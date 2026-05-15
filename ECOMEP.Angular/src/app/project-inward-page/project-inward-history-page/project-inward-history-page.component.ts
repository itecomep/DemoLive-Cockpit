import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { ProjectInwardApiService } from "../../project/services/project-inward-api.service";
import { Output, EventEmitter } from '@angular/core';
import { ProjectApiService } from '../../project/services/project-api.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-project-inward-history-page',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    FormsModule
  ],
  templateUrl: './project-inward-history-page.component.html',
  styleUrls: ['./project-inward-history-page.component.scss']
})
export class ProjectInwardHistoryPageComponent implements OnInit {

  @Output() createClicked = new EventEmitter<void>();

  inwardList: any[] = [];

  originalList: any[] = [];

  loading = false;
  searchText = '';

  sortColumn = '';
  sortDirection: 'asc' | 'desc' | '' = '';
  fromDate = '';
toDate = '';

  // constructor(
  //   private inwardService: ProjectInwardApiService,
  //   private projectService: ProjectApiService
  // ) {}


  constructor(
  private inwardService: ProjectInwardApiService,
  private projectService: ProjectApiService,
  private authService: AuthService
) {}

  openCreateForm() {
    this.createClicked.emit();
  }

  async ngOnInit() {
    await this.loadHistory();
  }

  async loadHistory() {

    try {

      this.loading = true;

      // this.inwardList = await firstValueFrom(
      //   this.inwardService.get([], '', '')
      // );

      const allHistory = await firstValueFrom(
  this.inwardService.get([], '', '')
);

// const currentUser = this.authService.currentUserStore;

// const currentUserName =
//   currentUser?.contact?.name
//     ?.toLowerCase()
//     .trim();

// // SHOW ONLY LOGGED-IN USER HISTORY
// this.inwardList = allHistory.filter((x: any) => {

//   const receivedFrom =
//     (
//       x.contact?.name ||
//       ''
//     ).toLowerCase().trim();

//   return receivedFrom === currentUserName;
// });

const currentUser =
  this.authService.currentUserStore;

const currentUserName =
  currentUser?.contact?.name
    ?.toLowerCase()
    .trim();

// CHECK ADMIN ROLE
const isAdmin =
  currentUser?.roles?.some(
    (x: string) =>
      x.toLowerCase() === 'admin'
  );

// ADMIN CAN SEE ALL HISTORY
if (isAdmin) {

  this.inwardList = allHistory;

}

// NORMAL USER CAN SEE ONLY THEIR HISTORY
else {

  this.inwardList = allHistory.filter((x: any) => {

    const receivedFrom =
      (
        x.contact?.name ||
        ''
      ).toLowerCase()
       .trim();

    return receivedFrom === currentUserName;
  });
}

      const projects: any[] = await firstValueFrom(
        this.projectService.get([], '', '')
      );

      this.inwardList.forEach((item: any) => {

        const project = projects.find(x => x.id === item.projectID);

        item.projectName = project
          ? `${project.code} - ${project.title}`
          : '-';

        item.receivedFrom = item.contact?.name || '-';

      });

      // DEFAULT ORIGINAL ORDER
      this.originalList = [...this.inwardList];

    } catch (error) {

      console.error(error);

    } finally {

      this.loading = false;
    }
  }




 sortBy(column: string) {

  // FIRST CLICK → ASC
  // SECOND CLICK → DESC
  // THIRD CLICK → RESET

  if (this.sortColumn !== column) {

    this.sortColumn = column;
    this.sortDirection = 'asc';

  } else {

    if (this.sortDirection === 'asc') {

      this.sortDirection = 'desc';

    } else if (this.sortDirection === 'desc') {

      this.sortDirection = '';

      this.inwardList = [...this.originalList];

      return;

    } else {

      this.sortDirection = 'asc';
    }
  }

  this.inwardList.sort((a: any, b: any) => {

    let valueA: any;
    let valueB: any;

    // DATE SORT
    if (column === 'receivedDate') {

      valueA = new Date(a.receivedDate).getTime();
      valueB = new Date(b.receivedDate).getTime();

    }

    // FILE COUNT SORT
    else if (column === 'attachments') {

      valueA = a.attachments?.length || 0;
      valueB = b.attachments?.length || 0;

    }

    // TEXT SORT
    else {

      valueA = (a[column] || '')
        .toString()
        .toLowerCase();

      valueB = (b[column] || '')
        .toString()
        .toLowerCase();
    }

    if (valueA < valueB) {
      return this.sortDirection === 'asc'
        ? -1
        : 1;
    }

    if (valueA > valueB) {
      return this.sortDirection === 'asc'
        ? 1
        : -1;
    }

    return 0;
  });
}







  getArrow(column: string): string {

    if (this.sortColumn !== column) {
      return '↕';
    }

    if (this.sortDirection === 'asc') {
      return '▲';
    }

    if (this.sortDirection === 'desc') {
      return '▼';
    }

    return '';
  }

filterProjects() {

  const search = this.searchText
    .toLowerCase()
    .trim();

  this.inwardList = this.originalList.filter((item: any) => {

    // TEXT SEARCH
    const projectName =
      (item.projectName || '').toLowerCase();

    const receivedFrom =
      (
        item.receivedFrom ||
        item.contact?.name ||
        ''
      ).toLowerCase();

    const title =
      (item.title || '').toLowerCase();

    const category =
      (item.category || '').toLowerCase();

    const message =
      (item.message || '').toLowerCase();

    const matchesSearch =
      !search ||
      projectName.includes(search) ||
      receivedFrom.includes(search) ||
      title.includes(search) ||
      category.includes(search) ||
      message.includes(search);

    // DATE FILTER
    const itemDate = new Date(item.receivedDate);

    const from =
      this.fromDate
        ? new Date(this.fromDate)
        : null;

    const to =
      this.toDate
        ? new Date(this.toDate)
        : null;

    if (to) {
      to.setHours(23, 59, 59, 999);
    }

    const matchesDate =
      (!from || itemDate >= from) &&
      (!to || itemDate <= to);

    return matchesSearch && matchesDate;
  });
}

resetFilters() {

  this.searchText = '';

  this.fromDate = '';

  this.toDate = '';

  this.sortColumn = '';

  this.sortDirection = '';

  this.inwardList = [...this.originalList];
}
}