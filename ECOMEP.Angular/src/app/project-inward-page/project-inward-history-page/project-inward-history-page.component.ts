// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-project-inward-history-page',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './project-inward-history-page.component.html',
//   styleUrls: ['./project-inward-history-page.component.scss']
// })
// export class ProjectInwardHistoryPageComponent {

// }







import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';

// import { ProjectInwardApiService } from '../project/services/project-inward-api.service';
import { ProjectInwardApiService } from "../../project/services/project-inward-api.service";
import { Output, EventEmitter } from '@angular/core';
import { ProjectApiService } from '../../project/services/project-api.service';

@Component({
  selector: 'app-project-inward-history-page',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe
  ],
  templateUrl: './project-inward-history-page.component.html',
  styleUrls: ['./project-inward-history-page.component.scss']
})
export class ProjectInwardHistoryPageComponent implements OnInit {
  @Output() createClicked = new EventEmitter<void>();

openCreateForm() {
  this.createClicked.emit();
}

  inwardList: any[] = [];

  loading = false;

  // constructor(
  //   private inwardService: ProjectInwardApiService
  // ) {}

  constructor(
  private inwardService: ProjectInwardApiService,
  private projectService: ProjectApiService
) {}

  async ngOnInit() {

    await this.loadHistory();
  }

  
  async loadHistory() {

  try {

    this.loading = true;

    this.inwardList = await firstValueFrom(
      this.inwardService.get([], '', 'id desc')
    );

    // LOAD PROJECTS
    const projects: any[] = await firstValueFrom(
      this.projectService.get([], '', '')
    );

    // MAP PROJECT NAME
    this.inwardList.forEach((item: any) => {

      item.projectName =
        projects.find(x => x.id === item.projectID)?.title || '-';

    });

    console.log('HISTORY LIST', this.inwardList);

  } catch (error) {

    console.error(error);

  } finally {

    this.loading = false;
  }
}
}