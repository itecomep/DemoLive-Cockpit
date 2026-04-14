import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, firstValueFrom } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { ApiFilter } from 'src/app/shared/models/api-filters';
import { Company } from 'src/app/shared/models/company.model';
import { StatusMaster } from 'src/app/shared/models/status-master-dto';
import { ProjectApiService } from 'src/app/project/services/project-api.service';
import { CompanyApiService } from 'src/app/shared/services/company-api.service';
import { StatusMasterService } from 'src/app/shared/services/status-master.service';
import { ProjectAnalysis } from '../../models/project-analysis.model';
import { Contact } from 'src/app/contact/models/contact';
import { AuthService } from 'src/app/auth/services/auth.service';
import { AppPermissions } from 'src/app/app.permissions';
import * as saveAs from 'file-saver';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { NgFor, NgIf, DecimalPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { McvSelectAllComponent } from '../../../mcv-select-all/components/mcv-select-all/mcv-select-all.component';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'project-analysis',
  templateUrl: './project-analysis.component.html',
  styleUrls: ['./project-analysis.component.scss'],
  standalone: true,
  imports: [FooterComponent, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatIconModule, MatSelectModule, McvSelectAllComponent, NgFor, MatOptionModule, MatButtonModule, MatTooltipModule, NgIf, DecimalPipe, CurrencyPipe, DatePipe]
})
export class ProjectAnalysisComponent implements OnInit
{

  // getProjectData;
  xCostFactor = 1;
  totalBillAmount = 0;
  totalProformaAmount = 0;
  totalVHrCost = 0;
  total5xCost = 0;
  totalreceivedByCops = 0;

  dataList: ProjectAnalysis[] = [];
  companyFC = new FormControl();
  clientFC = new FormControl();
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

  // partnerFilter = [
  //   { key: 'usersOnly', value: 'true' },
  //   { key: 'projectPartnersOnly', value: 'true' }
  // ];

  filters: ApiFilter[] = [
    { key: 'StatusFlag', value: this.config.PROJECT_STATUS_FLAG_PREPROPOSAL.toString() },
    { key: 'StatusFlag', value: this.config.PROJECT_STATUS_FLAG_INPROGRESS.toString() },
    // { key: 'statusFlag', value: this.config.PROJECT_STATUS_FLAG_ONHOLD },
    // { key: 'statusFlag', value: this.config.PROJECT_STATUS_FLAG_PREPROPOSAL },
    // { key: 'statusFlag', value: this.config.PROJECT_STATUS_FLAG_LOCKED },
    // { key: 'CompanyID', value: '1' },
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

  get isPermissionShowAll()
  {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_ANALYSIS_SHOW_ALL,
    ]);
  }
  get isPermissionExcel()
  {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_ANALYSIS_EXCEL,
    ]);
  }

  constructor(
    private companyAccountService: CompanyApiService,
    private projectService: ProjectApiService,
    private config: AppConfig,
    private statusMasterService: StatusMasterService,
    private authService: AuthService,
    private permissions: AppPermissions
  ) { }

  async ngOnInit()
  {
    await this.getCompanyOptions();
    await this.getStatusOptions();
    this.refresh();

    this.sortFC.setValue(this.sortOptions.find(x => x.sortKey == this.sort), { emitEvent: false });

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

    this.clientFC.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(
        (value) =>
        {
          if (value)
          {
            this.filters = this.filters.filter(i => i.key !== "ClientContactID");
            value.forEach((contact: Contact) =>
            {
              this.addFilter('ClientContactID', contact.id.toString());

            });
            this.refresh();
          }
        }
      );

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

  private async getCompanyOptions()
  {
    this.companyOptions = await firstValueFrom(this.companyAccountService.get())
    this.companyFC.setValue(this.companyOptions, { emitEvent: false });
    this.filters.push(...this.companyOptions.map(x => { return { key: 'CompanyID', value: x.id.toString() } }));
  }

  private refresh()
  {
    this.projectService.getAnalysis('full', this.filters, this.searchKey,
      this.sort)
      .subscribe((data: ProjectAnalysis[]) =>
      {
        this.getChartData(data);
        this.dataList = data;
        // const findProject = data.find(x => x.code == 1696);
        // console.log(findProject);
      });
  }

  private async getStatusOptions()
  {
    this.statusOptions = await firstValueFrom(this.statusMasterService.get([{ key: 'Entity', value: this.config.NAMEOF_ENTITY_PROJECT }]))

    this.statusFC.setValue(this.statusOptions.filter(x => this.filters.find(f => f.key == 'StatusFlag' && f.value == x.value.toString())), { emitEvent: false })

    //    this.statusFC.setValue(this.statusOptions, { emitEvent: false })
    // this.filters.push(...this.statusOptions.map(x => { return { key: 'StatusFlag', value: x.value.toString() } }));
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

  onExportExcel()
  {
    this.projectService.exportAnalysisExcel('full', this.filters, this.searchKey,
      this.sort);
  }

  async onExportExcelFromData(filename: string, data: any[])
  {
    var response = await firstValueFrom(this.projectService.exportDataToExcel(filename, data));
    saveAs(response, filename);
  }

  getChartData(data: ProjectAnalysis[])
  {

    if (this.sort == 'Big Blue')
    {
      // data.sort((a:ProjectAnalysis, b:ProjectAnalysis) =>
      // {
      //   if ((a.totalBillAmount - a.vHrCost) == (b.totalBillAmount - b.vHrCost))
      //   {
      //     return (a.totalBillAmount - a.xCost) < (b.totalBillAmount - a.xCost) ? -1 : 1
      //   } else
      //   {
      //     return (a.totalBillAmount - a.vHrCost) < (b.totalBillAmount - b.vHrCost) ? -1 : 1
      //   }
      // });
    } else
    {
      // data.sort((a:ProjectAnalysis, b:ProjectAnalysis) =>
      // {
      //   return a.totalBillAmount < b.totalBillAmount ? -1 : 1
      // });
    }

    this.totalVHrCost = 0;
    this.total5xCost = 0;
    this.totalBillAmount = 0;
    this.totalProformaAmount = 0;
    this.totalreceivedByCops = 0
    // data.forEach((obj:ProjectAnalysis) =>
    // {
    //   // this.totalVHrCost += obj.vHrCost;
    //   // this.total5xCost += (obj.vHrCost * this.xCostFactor);
    //   // this.totalBillAmount += obj.totalBillAmount;
    //   // this.totalProformaAmount += obj.proformaAmount;
    //   // this.totalreceivedByCops = (this.totalBillAmount / this.totalVHrCost);
    // });
  }

  getPercentage(value: number, total: number, minValue: number = 0): number
  {
    return (total > 0 ? (value < total ? value / total * 100 : 100) : minValue);
  }

}

