import { Component, OnInit } from "@angular/core";
import { ProjectApiService } from "../project/services/project-api.service";
import { ProjectFileComponent } from "../project/components/project-file/project-file.component";

@Component({
  selector: "app-file",
  standalone: true,
  templateUrl: "./file.component.html",
  styleUrls: ["./file.component.scss"],
  imports: [ProjectFileComponent],
})
export class FileComponent implements OnInit {
  project: any;
  selectedProjectId!: number;
  projects: any[] = [];

  constructor(private projectService: ProjectApiService) {}

  ngOnInit() {
    this.loadProjects();
  }

   loadProjects() {
    const userData = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const isFullAccess = userData.roles?.includes("MASTER") || false;
    this.projectService.getProjectsForEmail(0, 10000, isFullAccess).subscribe({
      next: (res: any) => {
        if (!res?.list?.length) {
          console.log("No projects found");
          return;
        }
        this.projects = res.list.map((p: any) => ({
          ...p,
          name: `${p.code} - ${p.title}`
        }));

        const othersProject = {
          id: 0,
          name: "Others",
          isOtherMode: true
        };
        this.projects = [othersProject, ...this.projects];
      },
      error: (err) => {
        console.error("Error fetching projects:", err);
      }
    });
  }
}
