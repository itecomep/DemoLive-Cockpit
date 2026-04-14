import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AppConfig } from 'src/app/app.config';
import { ApiFilter } from 'src/app/shared/models/api-filters';
import { Company } from 'src/app/shared/models/company.model';
import { StatusMaster } from 'src/app/shared/models/status-master-dto';
import { ProjectAnalysis } from 'src/app/project/models/project-analysis.model';
import { ProjectApiService } from 'src/app/project/services/project-api.service';
import { CompanyApiService } from 'src/app/shared/services/company-api.service';
import { StatusMasterService } from 'src/app/shared/services/status-master.service';
import { ProjectProgressDialogComponent } from '../project-progress-dialog/project-progress-dialog.component';
import { McvPopoverContentComponent } from '../../../mcv-popover/component/mcv-popover-content/mcv-popover-content.component';
import { McvPopoverDirective } from '../../../mcv-popover/directives/mcv-popover.directive';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { NgFor, DecimalPipe } from '@angular/common';
import { McvSelectAllComponent } from '../../../mcv-select-all/components/mcv-select-all/mcv-select-all.component';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'project-progress-chart',
  templateUrl: './project-progress-chart.component.html',
  styleUrls: ['./project-progress-chart.component.scss'],
  standalone: true,
  imports: [FooterComponent, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatIconModule, MatSelectModule, McvSelectAllComponent, NgFor, MatOptionModule, MatButtonModule, MatTooltipModule, McvPopoverDirective, McvPopoverContentComponent, DecimalPipe]
})
export class ProjectProgressChartComponent implements OnInit
{

  dataList: ProjectAnalysis[] = [];
  companyFC = new FormControl();
  statusFC = new FormControl();
  sortFC = new FormControl();
  searchFC = new FormControl();

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

  companyOptions: Company[] = [];
  statusOptions: StatusMaster[] = [];

  filters: ApiFilter[] = [
    { key: 'StatusFlag', value: this.config.PROJECT_STATUS_FLAG_INPROGRESS.toString() },
    { key: 'StatusFlag', value: this.config.PROJECT_STATUS_FLAG_PREPROPOSAL.toString() },
    // { key: 'StatusFlag', value: this.config.PROJECT_STATUS_FLAG_INQUIRY.toString() },
    // { key: 'statusFlag', value: this.config.PROJECT_STATUS_FLAG_ONHOLD },
    // { key: 'statusFlag', value: this.config.PROJECT_STATUS_FLAG_PREPROPOSAL },
    // { key: 'statusFlag', value: this.config.PROJECT_STATUS_FLAG_LOCKED },
    { key: 'CompanyID', value: '1' },
  ];
  searchKey?: string;
  sort: string = 'created desc';
  sortOptions: any[] = [  // { label: 'Code', sortKey: 'code', icon: 'north' },
    // { label: 'Code', sortKey: 'code desc', icon: 'south' },
    { label: 'Modified', sortKey: 'modified', icon: 'north' },
    { label: 'Modified', sortKey: 'modified desc', icon: 'south' },
    { label: 'Created', sortKey: 'created', icon: 'north' },
    { label: 'Created', sortKey: 'created desc', icon: 'south' },
    { label: 'Expected CompletionDate', sortKey: 'expectedCompletionDate', icon: 'north' },
    { label: 'Expected CompletionDate', sortKey: 'expectedCompletionDate desc', icon: 'south' },
    // { label: 'Contract CompletionDate', sortKey: 'contractCompletionDate', icon: 'north' },
    // { label: 'Contract CompletionDate', sortKey: 'contractCompletionDate desc', icon: 'south' },
    // { label: 'Inquiry ConvertionDate', sortKey: 'contractCompletionDate', icon: 'north' },
    // { label: 'Inquiry ConvertionDate', sortKey: 'contractCompletionDate desc', icon: 'south' },
  ];

  constructor(
    private companyAccountService: CompanyApiService,
    private projectService: ProjectApiService,
    private config: AppConfig,
    private statusMasterService: StatusMasterService,
  ) { }

  ngOnInit(): void
  {
    // this.refresh();
    this.sortFC.setValue(this.sortOptions.find(x => x.sortKey == this.sort), { emitEvent: false });
    this.getStatusOptions();
    this.getCompanyOptions();
    this.statusFC.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(
        (value) =>
        {
          if (value)
          {
            this.filters = this.filters.filter(i => i.key !== "StatusFlag");
            value.forEach((element: StatusMaster) =>
            {
              this.addFilter('StatusFlag', element.value.toString());
            });
            this.refresh();
          }
        }
      );

    this.sortFC.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(
        (value) =>
        {
          if (value)
          {
            this.sort = value.sortKey;
            this.refresh();
          }
        }
      );

    this.searchFC.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe((value) =>
      {
        this.searchKey = value;
        this.refresh();
      });


    this.companyFC.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(
        (value) =>
        {
          // console.log(value);
          if (value)
          {
            this.filters = this.filters.filter(i => i.key !== "CompanyID");
            value.forEach((element: Company) =>
            {
              this.addFilter('CompanyID', element.id.toString())
            });

            this.refresh();
          }
        }
      );
  }

  private getCompanyOptions()
  {
    this.companyAccountService.get().subscribe((data) =>
    {
      this.companyOptions = data;
      this.companyFC.setValue(this.companyOptions.filter(x => this.filters.find(f => f.key == 'CompanyID' && f.value == x.id.toString())), { emitEvent: false });
    }
    );
  }

  private refresh()
  {
    this.projectService.getAnalysis('full', this.filters, this.searchKey,
      this.sort)
      .subscribe((data: ProjectAnalysis[]) =>
      {
        this.dataList = data;
        // const findProject = data.find(x => x.code == 1696);
        // console.log(findProject);
      });
  }

  protected getStatusOptions()
  {
    this.statusMasterService.get([{ key: 'Entity', value: this.config.NAMEOF_ENTITY_PROJECT }]).subscribe(data =>
    {
      if (data)
      {
        this.statusOptions = data; //.filter(item => item.title != "Employee");
        this.statusFC.setValue(this.statusOptions.filter(x => this.filters.find(f => f.key == 'StatusFlag' && f.value == x.value.toString())), { emitEvent: false })
      }
    });
  }

  onRefresh()
  {
    this.searchKey = undefined;
    this.searchFC.setValue(null);
    this.refresh();
  }

  private addFilter(key: string, value: string)
  {
    const _filter = this.filters.find(obj =>
    {
      return obj.key === key && obj.value === value;
    });
    if (!_filter)
    {
      this.filters.push({ key: key, value: value });
    }
  }

  getPercentage(value: number, total: number, minValue: number = 0): number
  {
    return (total > 0 ? (value < total ? value / total * 100 : 100) : minValue);
  }
  getStatusColor(statusFlag: number)
  {
    return this.projectService.getStatusColor(statusFlag);
  }

  onClick(item: ProjectAnalysis)
  {
    this.projectService.openDialog(ProjectProgressDialogComponent, {
      dialogTitle: `Project Progress | ${item.code}-${item.title}`,
      config: item,
    }, true);
  }
}
