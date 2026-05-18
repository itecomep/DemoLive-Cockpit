import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { firstValueFrom } from "rxjs";

import { WorkOrderStageApiService } from "src/app/work-order/services/work-order-stage-api.service";

@Component({
  selector: "app-project-points",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./project-points.component.html",
  styleUrls: ["./project-points.component.scss"],
})
export class ProjectPointsComponent {

  stages: any[] = [];

  totalPoints: number = 0;

  private _project: any;

  @Input() set project(value: any) {

    if (value) {
      this._project = value;

      // Reload data automatically
      this.loadPoints();
    }
  }

  get project() {
    return this._project;
  }

  constructor(
    private workOrderStageApiService: WorkOrderStageApiService
  ) {}

  async loadPoints() {

    if (!this.project?.id) return;

    const data = await firstValueFrom(
      this.workOrderStageApiService.get([
        {
          key: 'projectId',
          value: this.project.id.toString()
        }
      ])
    );

    this.stages = (data || []).filter(
      (x: any) => x.projectID === this.project.id
    );

    this.totalPoints = this.stages
      .map((x: any) => x.points || 0)
      .reduce((a: number, b: number) => a + b, 0);
  }

}