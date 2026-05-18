import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ProjectApiService } from 'src/app/project/services/project-api.service';
import { StageService } from '../services/stage.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { GmailComposeModule } from 'src/app/gmail/compose-email/gmail-compose.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@Component({
  selector: 'app-create-stage-popup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    GmailComposeModule,
    NgxMatSelectSearchModule
  ],
  templateUrl: './create-stage-popup.component.html',
  styleUrls: ['./create-stage-popup.component.scss']
})
export class CreateStagePopupComponent implements OnInit {
  selectedProject: any = null;
  selectedStage: any = null;
  projects: any[] = [];
  stages: any[] = [];
  isLoading = false;
  isStageComplete = false;
  isGenerateInvoice = false;
  isRework = false;
  showCompose = false;

  projectSearch = '';
  stageSearch = '';

  filteredProjects: any[] = [];
  filteredStages: any[] = [];

  latestStageCompleteRevision = '-';
  latestGenerateInvoiceRevision = '-';
  latestReworkRevision = '-';

  constructor(
    private dialogRef: MatDialogRef<CreateStagePopupComponent>,
    private projectApiService: ProjectApiService,
    private service: StageService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects() {
    const userData = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const isFullAccess = userData.roles?.includes('MASTER') || false;
    this.isLoading = true;
    this.projectApiService
      .getProjectsForEmail(0, 10000, isFullAccess)
      .subscribe({
        next: (res: any) => {
          if (!res?.list?.length) {
            this.projects = [];
            this.isLoading = false;
            return;
          }
          this.projects = res.list.map((p: any) => ({
            ...p,
            name: `${p.code} - ${p.title}`
          }));
          this.filteredProjects = [...this.projects];
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
        }
      });
  }

  onProjectChange() {
    if (this.selectedProject?.id) {
      this.loadStages(this.selectedProject.id);
    }
    this.loadLatestRevisions();
    this.checkComposeVisibility();
  }

  onStageChange() {
    this.loadLatestRevisions();
    this.checkComposeVisibility();   
  }

  loadStages(projectId: number) {
    this.service.getStagesByProject(projectId)
      .subscribe((res: any) => {
        const uniqueStages = (res || []).filter(
          (stage: any, index: number, self: any[]) =>
            index === self.findIndex(
              (s) =>
                (s.title || s.Title)?.trim().toLowerCase() ===
                (stage.title || stage.Title)?.trim().toLowerCase()
            )
        );
        this.stages = uniqueStages;
        this.filteredStages = [...this.stages];
      });
  }

  onStatusChange() {
    this.checkComposeVisibility();
  }

  checkComposeVisibility() {
    const hasStatus = this.isStageComplete || this.isGenerateInvoice || this.isRework;
    this.showCompose = !!this.selectedProject && !!this.selectedStage && hasStatus;
    this.dialogRef.updateSize('95vw', '95vh');
  }
  
  close() {
    this.dialogRef.close();
  }

  onMailSent() {
    this.dialogRef.close(true);
  }

  filterProjects() {
    const value = this.projectSearch
      .toLowerCase()
      .trim();
    this.filteredProjects = this.projects.filter((p: any) =>
      p.name?.toLowerCase().includes(value)
    );
  }

  filterStages() {
    const value = this.stageSearch
      .toLowerCase()
      .trim();
    this.filteredStages = this.stages.filter((s: any) =>
      s.title?.toLowerCase().includes(value)
    );
  }

  loadLatestRevisions() {
    if (!this.selectedProject?.id || !this.selectedStage?.id) {
      return;
    }

    this.service
      .getLatestRevisions(
        this.selectedProject.id,
        this.selectedStage.id
      )
      .subscribe((res: any) => {
        this.latestStageCompleteRevision =
          res.stageCompleteRevision || '-';
        this.latestGenerateInvoiceRevision =
          res.generateInvoiceRevision || '-';
        this.latestReworkRevision =
          res.reworkRevision || '-';
      });
  }
}