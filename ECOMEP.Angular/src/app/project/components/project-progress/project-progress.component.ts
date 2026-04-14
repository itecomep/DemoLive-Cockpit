import { Component, Input } from '@angular/core';
import { ChartConfiguration, ChartDataset, ChartOptions } from 'chart.js';
import { ProjectAnalysis } from '../../models/project-analysis.model';
import { ProjectApiService } from 'src/app/project/services/project-api.service';
import { WFTaskApiService } from 'src/app/wf-task/services/wf-task-api.service';
import { WFTaskAnalysis } from 'src/app/wf-task/models/wf-task-analysis';
import { debounceTime, distinctUntilChanged, firstValueFrom } from 'rxjs';
import { ApiFilter } from 'src/app/shared/models/api-filters';
import { AppConfig } from 'src/app/app.config';
import { McvGroupByPipe } from 'src/app/shared/pipes/mcv-group-by.pipe';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { NgIf, NgClass, NgFor, DecimalPipe, DatePipe } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { MatTooltipModule } from '@angular/material/tooltip';
import { McvPopoverContentComponent } from '../../../mcv-popover/component/mcv-popover-content/mcv-popover-content.component';
import { MatIconModule } from '@angular/material/icon';
import { McvPopoverDirective } from '../../../mcv-popover/directives/mcv-popover.directive';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-project-progress',
  templateUrl: './project-progress.component.html',
  styleUrls: ['./project-progress.component.scss'],
  standalone: true,
  providers: [
    McvGroupByPipe
  ],
  imports: [MatFormFieldModule, MatDatepickerModule, ReactiveFormsModule, McvPopoverDirective, MatIconModule, McvPopoverContentComponent, MatTooltipModule, NgChartsModule, NgIf, NgClass, NgFor, DecimalPipe, DatePipe]
})
export class ProjectProgressComponent
{
  // Pie
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'right',
      },
      title: {
        position: 'bottom',
      }
    },
    maintainAspectRatio: false
  };
  public assignedMHrChartLabels: string[] = [];
  public assignedMHrChart: ChartDataset[] = [{
    data: [0, 0, 0],
    label: 'Assigned mHr'
  }];
  public assignedMHrChartLegend = true;
  public assignedMHrChartPlugins = [];

  public assessedMHrChartLabels: string[] = [];
  public assessedMHrChart: ChartDataset[] = [{
    data: [0, 0, 0],
    label: 'Assessed mHr'
  }];
  public assessedMHrChartLegend = true;
  public assessedMHrChartPlugins = [];

  public consumedMHrChartLabels: string[] = [];
  public consumedMHrChart: ChartDataset[] = [{
    data: [0, 0, 0],
    label: 'Consumed mHr'
  }];
  public consumedMHrChartLegend = true;
  public consumedMHrChartPlugins = [];

  data!: ProjectAnalysis;
  taskAnalysis: WFTaskAnalysis[] = [];

  totalAssignedMHr = 0;
  totalAssessedMHr = 0;
  totalConsumedMHr = 0;

  readonly COLOR_WHITE = '#ffffff';
  readonly COLOR_BLACK = '#000000';
  readonly COLOR_BLUE_100 = '#d6ebff';
  readonly COLOR_BLUE_500 = '#6eb8ff';
  readonly COLOR_BLUE_900 = '#0070b7';
  readonly COLOR_RED = '#da0202';
  readonly COLOR_YELLOW = '#ffc107';
  readonly COLOR_GRAY = '#495057';
  readonly COLOR_LIGHT_GREEN = '#04a82a';
  readonly COLOR_DARK_GREEN = '#118700';

  readonly COLOR_ORANGE = '#fd7e14';
  readonly PROGRESS_PROPOSED = '#003a5f';

  @Input('config') set configValue(data: ProjectAnalysis)
  {
    if (data)
    {
      this.data = data;
      this.filters = [
        {
          key: 'ProjectID',
          value: this.data.id.toString()
        },
        { key: "StatusFlag", value: this.config.WFTASK_STATUS_FLAG_COMPLETED.toString() },
        { key: "RangeStart", value: (this.utility.getMonthStart()).toISOString() },
        { key: "RangeEnd", value: (this.utility.getMonthEnd()).toISOString() },
      ];
      this.dateFC.setValue({ start: this.utility.getMonthStart(), end: this.utility.getMonthEnd() }, { emitEvent: false });
      this.refresh()
    }
  }

  get isMobileView(): boolean { return this.utility.isMobileView; }
  dateFC!: FormGroup;
  filters: ApiFilter[] = [];

  constructor(
    private projectService: ProjectApiService,
    private taskService: WFTaskApiService,
    private config: AppConfig,
    private groupByPipe: McvGroupByPipe,
    private utility: UtilityService
  )
  {
    this.dateFC = new FormGroup({
      start: new FormControl(this.utility.getMonthStart()),
      end: new FormControl(this.utility.getMonthEnd()),
    });

    this.dateFC.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) =>
      {
        if (value && value.start && value.end)
        {
          this.filters = this.filters.filter(
            (x) => x.key !== "RangeStart" && x.key != "RangeEnd"
          );
          this.filters.push({
            key: "RangeStart",
            value: value.start.toISOString(),
          });
          this.filters.push({
            key: "RangeEnd",
            value: value.end.toISOString(),
          });

          this.refresh();
        }
      });
  }
  groupByPerson: { key: string, values: WFTaskAnalysis[] }[] = [];
  private async refresh()
  {

    this.taskAnalysis = await firstValueFrom(this.taskService.getAnalysis('full', this.filters));



    let assignedMHrChartData: number[] = [];
    let assessedMHrChartData: number[] = [];
    let consumedMHrChartData: number[] = [];
    this.totalAssignedMHr = 0;
    this.totalAssessedMHr = 0;
    this.totalConsumedMHr = 0;
    this.assignedMHrChartLabels = [];
    this.assessedMHrChartLabels = [];
    this.consumedMHrChartLabels = [];

    this.groupByPerson = this.groupByPipe.transform(this.taskAnalysis, ['person']);

    this.groupByPerson.forEach((person: { key: string, values: WFTaskAnalysis[] }) =>
    {

      let assignedMHr = person.values.map((task: WFTaskAnalysis) => task.mHrAssigned)
        .reduce((a: number, b: number) => a + b, 0);
      let assessedMHr = person.values.map((task: WFTaskAnalysis) => task.mHrAssessed)
        .reduce((a: number, b: number) => a + b, 0);
      let consumedMHr = person.values.map((task: WFTaskAnalysis) => task.mHrConsumed)
        .reduce((a: number, b: number) => a + b, 0);

      this.totalAssessedMHr += assessedMHr;
      this.totalAssignedMHr += assignedMHr;
      this.totalConsumedMHr += consumedMHr;

      assignedMHrChartData.push(assignedMHr);
      this.assignedMHrChartLabels.push(person.key as string);

      assessedMHrChartData.push(assessedMHr);
      this.assessedMHrChartLabels.push(person.key as string);

      consumedMHrChartData.push(consumedMHr);
      this.consumedMHrChartLabels.push(person.key as string);
    });


    this.assignedMHrChart = [{
      data: assignedMHrChartData,
    }];
    this.assessedMHrChart = [{
      data: assessedMHrChartData
    }];
    this.consumedMHrChart = [{
      data: consumedMHrChartData
    }];
  }
  getStatusColor(statusFlag: number)
  {
    return this.projectService.getStatusColor(statusFlag);
  }
  getPercentage(value: number, total: number, minValue: number = 0): number
  {
    return (total > 0 ? (value < total ? value / total * 100 : 100) : minValue);
  }

  get taskAnalysisTotal(): WFTaskAnalysis
  {
    let total = new WFTaskAnalysis();
    this.taskAnalysis.forEach(x =>
    {

      total.delay += x.delay;
      total.mHrAssessed += x.mHrAssessed;
      total.mHrAssigned += x.mHrAssigned;
      total.mHrConsumed += x.mHrConsumed;

    });
    return total;
  }
  getMHrAssigned(values: WFTaskAnalysis[])
  {
    return values.map(x => x.mHrAssigned).reduce((a, b) => a + b, 0);
  }
  getMHrAssessed(values: WFTaskAnalysis[])
  {
    return values.map(x => x.mHrAssessed).reduce((a, b) => a + b, 0);
  }
  getMHrConsumed(values: WFTaskAnalysis[])
  {
    return values.map(x => x.mHrConsumed).reduce((a, b) => a + b, 0);
  }
  //EXPAND/COLLAPSE GROUPS
  isGroupExpanded: boolean[] = [];
  toggleGroupExpand(groupIndex: number)
  {

    this.isGroupExpanded[groupIndex] = !this.isGroupExpanded[groupIndex];
  }
}
