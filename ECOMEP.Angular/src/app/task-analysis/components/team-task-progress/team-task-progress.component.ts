import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChartConfiguration, ChartDataset } from 'chart.js';
import { debounceTime, distinctUntilChanged, firstValueFrom } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { ApiFilter } from 'src/app/shared/models/api-filters';
import { McvGroupByPipe } from 'src/app/shared/pipes/mcv-group-by.pipe';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { WFTaskApiService } from 'src/app/wf-task/services/wf-task-api.service';
import { WFTaskAnalysis, WFTaskAnalysisGroup } from '../../../wf-task/models/wf-task-analysis';
import { Contact } from 'src/app/contact/models/contact';
import { NgChartsModule } from 'ng2-charts';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgFor, NgIf, NgClass, DecimalPipe, DatePipe } from '@angular/common';
import { McvPopoverContentComponent } from '../../../mcv-popover/component/mcv-popover-content/mcv-popover-content.component';
import { MatIconModule } from '@angular/material/icon';
import { McvPopoverDirective } from '../../../mcv-popover/directives/mcv-popover.directive';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'team-task-progress',
  templateUrl: './team-task-progress.component.html',
  styleUrls: ['./team-task-progress.component.scss'],
  standalone: true,
  providers: [
    McvGroupByPipe
  ],
  imports: [MatFormFieldModule, MatDatepickerModule, ReactiveFormsModule, McvPopoverDirective, MatIconModule, McvPopoverContentComponent, NgFor, MatTooltipModule, NgChartsModule, NgIf, NgClass, DecimalPipe, DatePipe]
})
export class TeamTaskProgressComponent
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
    data: [0],
    label: 'Assigned mHr'
  }];
  public assignedMHrChartLegend = true;
  public assignedMHrChartPlugins = [];

  public assessedMHrChartLabels: string[] = [];
  public assessedMHrChart: ChartDataset[] = [{
    data: [0],
    label: 'Assessed mHr'
  }];
  public assessedMHrChartLegend = true;
  public assessedMHrChartPlugins = [];

  public consumedMHrChartLabels: string[] = [];
  public consumedMHrChart: ChartDataset[] = [{
    data: [0],
    label: 'Consumed mHr'
  }];
  public consumedMHrChartLegend = true;
  public consumedMHrChartPlugins = [];

  data!: WFTaskAnalysisGroup;
  taskAnalysis: WFTaskAnalysis[] = [];
  contact!: Contact;

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

  get isMobileView(): boolean { return this.utility.isMobileView; }
  dateFC!: FormGroup;
  filters: ApiFilter[] = [];
  monthlyExpectedMHR = 200;

  @Input('config') set configValue(config: { group: WFTaskAnalysisGroup, contact: Contact, filters: ApiFilter[] })
  {
    if (config)
    {
      this.data = config.group;
      this.contact = config.contact;
      this.filters = config.filters.map(x => ({ key: x.key, value: x.value.toString() }));
      this.filters.push({ key: "ContactID", value: this.contact.id.toString() });
      this.dateFC.setValue({ start: this.filters.find((x) => x.key === "RangeStart")?.value, end: this.filters.find((x) => x.key === "RangeEnd")?.value }, { emitEvent: false });
      this.refresh()
    }
  }

  constructor(
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
            value: (new Date(value.start)).toISOString(),
          });
          this.filters.push({
            key: "RangeEnd",
            value: (new Date(value.end)).toISOString(),
          });

          this.refresh();
        }
      });
  }

  groupByProject: { key: string, values: WFTaskAnalysis[] }[] = [];
  private async refresh()
  {

    this.taskAnalysis = await firstValueFrom(this.taskService.getAnalysis('full', this.filters));
    this.taskAnalysis.sort((a, b) => new Date(a.completedDate).getTime() - new Date(b.completedDate).getTime());

    let assignedMHrChartData: number[] = [];
    let assessedMHrChartData: number[] = [];
    let consumedMHrChartData: number[] = [];
    this.totalAssignedMHr = 0;
    this.totalAssessedMHr = 0;
    this.totalConsumedMHr = 0;
    this.assignedMHrChartLabels = [];
    this.assessedMHrChartLabels = [];
    this.consumedMHrChartLabels = [];

    this.groupByProject = this.groupByPipe.transform(this.taskAnalysis, ['project']);
    this.groupByProject.forEach((obj: { key: string, values: WFTaskAnalysis[] }) =>
    {

      let assignedMHr = obj.values.map((task: WFTaskAnalysis) => task.mHrAssigned)
        .reduce((a: number, b: number) => a + b, 0);
      let assessedMHr = obj.values.map((task: WFTaskAnalysis) => task.mHrAssessed)
        .reduce((a: number, b: number) => a + b, 0);
      let consumedMHr = obj.values.map((task: WFTaskAnalysis) => task.mHrConsumed)
        .reduce((a: number, b: number) => a + b, 0);
      // let burnedMHr = person.values.reduce((a: WFTaskAnalysis, b: WFTaskAnalysis) => a. + b.mHrAssigned, 0);

      // console.log('assignedMHr', assignedMHr);
      // console.log('assessedMHr', assessedMHr);
      // console.log('consumedMHr', consumedMHr);
      this.totalAssessedMHr += assessedMHr;
      this.totalAssignedMHr += assignedMHr;
      this.totalConsumedMHr += consumedMHr;

      assignedMHrChartData.push(assignedMHr);
      this.assignedMHrChartLabels.push((obj.values[0].project as string) != null ? (obj.values[0].project as string) : "Other");

      assessedMHrChartData.push(assessedMHr);
      this.assessedMHrChartLabels.push((obj.values[0].project as string) != null ? (obj.values[0].project as string) : "Other");

      consumedMHrChartData.push(consumedMHr);
      this.consumedMHrChartLabels.push((obj.values[0].project as string) != null ? (obj.values[0].project as string) : "Other");
    });

    // console.log('assignedMHrChartData', assignedMHrChartData);
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
  // getStatusColor(statusFlag: number)
  // {
  //   return this.projectService.getStatusColor(statusFlag);
  // }
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
      total.mHrBurned += x.mHrBurned;

    });
    return total;
  }

  get totalMHr(): number
  {
    const start = new Date(this.dateFC.controls['start'].value);
    const end = new Date(this.dateFC.controls['end'].value);
    const monthsBetween = (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());

    return (monthsBetween + 1) * this.monthlyExpectedMHR;
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
  getMHrBurned(values: WFTaskAnalysis[])
  {
    return values.map(x => { return x.mHrConsumed > x.mHrAssessed ? x.mHrConsumed - x.mHrAssessed : 0; }).reduce((a, b) => a + b, 0);
  }

  //EXPAND/COLLAPSE GROUPS
  isGroupExpanded: boolean[] = [];
  toggleGroupExpand(groupIndex: number)
  {

    this.isGroupExpanded[groupIndex] = !this.isGroupExpanded[groupIndex];
  }

}
