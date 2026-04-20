import { Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe, DecimalPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormControl, Validators, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { debounceTime, distinctUntilChanged, firstValueFrom, forkJoin } from 'rxjs';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { FilterToggleDirective } from 'src/app/shared/directives/filter-toggle.directive';
import { ApiFilter } from 'src/app/shared/models/api-filters';
import { Company } from 'src/app/shared/models/company.model';
import { TypeMaster } from 'src/app/shared/models/type-master-dto';
import { TypeMasterService } from 'src/app/shared/services/type-master.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ProjectBillApiService } from '../../../project/services/project-bill-api.service';
import { ProjectBillPaymentApiService } from '../../services/project-bill-payment-api.service';
import { ProjectBillAnalysis, ProjectBillPayment } from '../../models/project-bill.model';
import { CompanyApiService } from 'src/app/shared/services/company-api.service';
import { MatMenuModule } from '@angular/material/menu';
import { McvSelectAllComponent } from 'src/app/mcv-select-all/components/mcv-select-all/mcv-select-all.component';
import { StatusMaster } from 'src/app/shared/models/status-master-dto';
import { StatusMasterService } from 'src/app/shared/services/status-master.service';
import { ProjectApiService } from '../../services/project-api.service';
import { Project } from '../../models/project.model'; // ✅ ADD THIS
import { McvFilterSidenavComponent } from 'src/app/mcv-header/components/mcv-filter-sidenav/mcv-filter-sidenav.component';
import { ContactTeam } from 'src/app/contact/models/contact-team.model';
import { ContactTeamApiService } from 'src/app/contact/services/contact-team-api.service';
import { BillAnalysisRowComponent } from './bill-analysis-row/bill-analysis-row.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/services/auth.service';


@Component({
  selector: 'app-project-bill-analysis',
  standalone: true,
  imports: [NgIf, NgFor, NgClass,
     MatSelectModule, ReactiveFormsModule, FormsModule, MatMenuModule,McvSelectAllComponent,
     MatOptionModule, FooterComponent, MatIconModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatButtonModule, MatTooltipModule, FilterToggleDirective, DecimalPipe, CurrencyPipe, DatePipe,
     McvFilterSidenavComponent,BillAnalysisRowComponent
    ],
  templateUrl: './project-bill-analysis.component.html',
  styleUrls: ['./project-bill-analysis.component.scss']
})
export class ProjectBillAnalysisComponent implements OnInit
{
  private readonly projectBillService = inject(ProjectBillApiService);
  private readonly typeMasterService = inject(TypeMasterService);
  private readonly utilityService = inject(UtilityService);
  private readonly billPaymentService = inject(ProjectBillPaymentApiService);
  private readonly companyService = inject(CompanyApiService);
  private readonly statusMasterService = inject(StatusMasterService);
  private readonly projectService = inject(ProjectApiService);
  private readonly contactTeamService = inject(ContactTeamApiService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);


  today = new Date();
  teamFC = new FormControl();
  dataList: ProjectBillAnalysis[] = [];
  total = new ProjectBillAnalysis();
  companyFC = new FormControl();
  companyOptions: Company[] = [];


  sortFC = new FormControl();
  searchFC = new FormControl();
  stagePercentageStartFC = new FormControl(0, [Validators.min(0), Validators.max(99)]);
  stagePercentageEndFC = new FormControl(100, [Validators.min(1), Validators.max(100)]);

  typeOptions: TypeMaster[] = [];
  typeFC = new FormControl();

  projectStatusOptions: StatusMaster[] = [];
  projectStatusFC = new FormControl();
  teamOptions: ContactTeam[] = [];

  dateFC = new FormGroup({
    start: new FormControl(this.utilityService.getFYearStart()),
    end: new FormControl(this.utilityService.getFYearEnd()),
  });


  filters: ApiFilter[] = [
    { key: 'TypeFlag', value: this.projectBillService.PROJECT_BILL_TYPEFLAG_TAX_INVOICE.toString() },
    { key: "RangeStart", value: this.utilityService.getFYearStart().toISOString() },
    { key: "RangeEnd", value: this.utilityService.getFYearEnd().toISOString() },
  ];
  searchKey?: string;
  sort: string = 'billdate';
  sortOptions: any[] = [  // { label: 'Code', sortKey: 'code', icon: 'north' },
    // { label: 'Code', sortKey: 'code desc', icon: 'south' },
    { label: 'Bill Date', sortKey: 'billdate', icon: 'north' },
    { label: 'Bill Date', sortKey: 'billdate desc', icon: 'south' },
  ];

  get isMobileView(): boolean { return this.utilityService.isMobileView; }

  get isPermissionAnalysisDownload(){ return this.projectBillService.isPermissionAnalysisExcelDownload; }

  get PROJECT_BILL_TYPEFLAG_PROFORMA_INVOICE() { return this.projectBillService.PROJECT_BILL_TYPEFLAG_PROFORMA_INVOICE; }
  get PROJECT_BILL_TYPEFLAG_TAX_INVOICE() { return this.projectBillService.PROJECT_BILL_TYPEFLAG_TAX_INVOICE; }

  get totalBillAmount(){
    return this.dataList
    // .filter(x => x.typeFlag == this.PROJECT_BILL_TYPE_FLAG_INVOICE)
    .reduce((a, b) => a + b.dueAmount, 0);
  }

  get totalGstAmount(){
    return this.dataList
    // .filter(x => x.typeFlag == this.PROJECT_BILL_TYPE_FLAG_INVOICE)
    .reduce((a, b) => a + b.cgstAmount + b.igstAmount+ b.sgstAmount, 0);
  }

  get totalPayable(){
    return this.dataList
    // .filter(x => x.typeFlag == this.PROJECT_BILL_TYPE_FLAG_INVOICE)
    .reduce((a, b) => a + b.payableAmount, 0);
  }

  get totalReceivedAmount(){
    return this.dataList
    // .filter(x => x.typeFlag == this.PROJECT_BILL_TYPE_FLAG_INVOICE)
    .reduce((a, b) => a + this.getReceivedPayment(b), 0);
  }
  async ngOnInit()
  {
    this.companyOptions = await firstValueFrom(this.companyService.get());
    this.teamOptions = await firstValueFrom(this.contactTeamService.get());
    this.companyFC.setValue(this.companyOptions, { emitEvent: false });
    this.filters.push(...this.companyOptions.map(x => { return { key: 'CompanyID', value: x.id.toString() } }));

    this.typeOptions = await firstValueFrom(this.typeMasterService.get([{ key: 'Entity', value: this.projectBillService.nameOfEntity }]));

    this.typeFC.setValue(this.typeOptions.find(x => this.filters.find(f => f.key == 'TypeFlag' && f.value == x.value.toString())), { emitEvent: false });

    this.projectStatusOptions = await firstValueFrom(this.statusMasterService.get([{ key: 'Entity', value: this.projectService.nameOfEntity }]));

    this.projectStatusFC.setValue(this.typeOptions.filter(x => this.filters.find(f => f.key == 'ProjectStatusFlag' && f.value == x.value.toString())), { emitEvent: false });

    this.getData();

    this.sortFC.setValue(this.sortOptions.find(x => x.sortKey == this.sort), { emitEvent: false });

    this.typeFC.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(
        (element) =>
        {
          if (element)
          {
            this.filters = this.filters.filter(i => i.key !== "TypeFlag");
            // value.forEach((element: TypeMaster) =>
            // {
              this.addFilter('TypeFlag', element.value.toString());
            // });
            this.getData();
          }
        }
      );

      this.projectStatusFC.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(
        (value) =>
        {
          if (value)
          {
            this.filters = this.filters.filter(i => i.key !== "ProjectStatusFlag");
            value.forEach((element: StatusMaster) =>
            {
              this.addFilter('ProjectStatusFlag', element.value.toString());
            });
            this.getData();
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
            this.getData();
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
        this.getData();
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

            this.getData();
          }
        }
      );

    this.stagePercentageStartFC.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(
        (value) =>
        {
          if (value)
          {
            this.filters = this.filters.filter(i => i.key !== "stagePercentageStart");

            this.addFilter('stagePercentageStart', value.toString());

            this.getData();
          }
        }
      );

    this.stagePercentageEndFC.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(
        (value) =>
        {
          if (value)
          {
            this.filters = this.filters.filter(i => i.key !== "stagePercentageEnd");

            this.addFilter('stagePercentageEnd', value.toString());

            this.getData();
          }
        }
      );

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

          this.getData();
        }
      });

      this.teamFC.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(
        (value) => {
          if (value) {
            this.filters = this.filters.filter(i => i.key !== "teamID");
            value.forEach((element: ContactTeam) => {
              this.addFilter('teamID', element.id.toString());
            });
            this.getData();
          }
        }
      );
  }



  private async getData()
  {
    this.dataList = await firstValueFrom(this.projectBillService.getAnalysis('full', this.filters, this.searchKey,
      this.sort));

    this.total = new ProjectBillAnalysis();
    this.dataList.forEach(x =>
    {
      this.total.dueAmount += x.dueAmount;
      // this.total.tds += x.tds;
      // this.total.tdsBalance += x.tdsBalance;
      this.total.cgstAmount += x.cgstAmount;
      this.total.sgstAmount += x.sgstAmount;
      // this.total.gstAmount += x.gstAmount;
      this.total.billAmount += x.billAmount;
      this.total.igstAmount += x.igstAmount;
      this.total.payableAmount += x.payableAmount;
      this.total.pendingPayment += x.pendingPayment;
      // this.total.tdsPaid += x.tdsPaid;
    });
  }



// private async getData()
// {
//   // 🔒 ALWAYS restrict data to logged-in user's teams
//   const userTeamIds = this.authService.getCurrentUserTeamIds();

//   // remove any existing team filters
//   this.filters = this.filters.filter(f => f.key !== 'teamID');

//   // add only user's teams
//   userTeamIds.forEach(id => {
//     this.filters.push({
//       key: 'teamID',
//       value: id.toString()
//     });
//   });

//   // 🔥 Step 1: Get projects
//   const projectResponse = await firstValueFrom(
//     this.projectService.getPages(
//       0,
//       1000,
//       this.filters,
//       this.searchKey,
//       this.sort
//     )
//   );

//   const projectIds = projectResponse.list.map((p: Project) => p.id);

//   // 🔥 Step 2: Prepare filters for bill API
//   const updatedFilters = [...this.filters];

//   const filtered = updatedFilters.filter(f => f.key !== 'ProjectID');

//   projectIds.forEach((id: number) => {
//     filtered.push({ key: 'ProjectID', value: id.toString() });
//   });

//   // 🔥 Step 3: Call bill analysis API
//   this.dataList = await firstValueFrom(
//     this.projectBillService.getAnalysis('full', filtered, this.searchKey, this.sort)
//   );

//   // totals calculation
//   this.total = new ProjectBillAnalysis();
//   this.dataList.forEach(x => {
//     this.total.dueAmount += x.dueAmount;
//     this.total.cgstAmount += x.cgstAmount;
//     this.total.sgstAmount += x.sgstAmount;
//     this.total.billAmount += x.billAmount;
//     this.total.igstAmount += x.igstAmount;
//     this.total.payableAmount += x.payableAmount;
//     this.total.pendingPayment += x.pendingPayment;
//   });
// }


  refresh()
  {
    this.searchKey = undefined;
    this.searchFC.setValue(null);
    this.getData();
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
    this.projectBillService.exportAnalysisExcel('full', this.filters, this.searchKey,
      this.sort);
  }

  onExportReport(reportName: string, size: string = 'a4', output: 'PDF' | 'EXCELOPENXML' = 'PDF')
  {
    this.projectBillService.exportReport(reportName, size, output, this.filters, this.searchKey, this.sort);
  }

  getPercentage(value: number, total: number, minValue: number = 0): number
  {
    return (total > 0 ? (value < total ? value / total * 100 : 100) : minValue);
  }

  isShowReports: boolean = false;
  openReports()
  {
    this.isShowReports = !this.isShowReports;
  }
  

                                 //filtering 

  toggleSort(column: string) {

  // ===== PROJECT CODE (NUMERIC SORT) =====
  if (column === 'projectCode') {
    const isDesc = this.sort === 'projectCode';

    this.sort = isDesc ? 'projectCode desc' : 'projectCode';

    this.dataList.sort((a, b) => {
      const numA = parseInt(a.projectCode) || 0;
      const numB = parseInt(b.projectCode) || 0;

      return isDesc ? numB - numA : numA - numB;
    });

    return;
  }

  // ===== CLIENT NAME (ALPHABETICAL SORT) =====
  if (column === 'clientName') {

    const isDesc = this.sort === 'clientName';

    this.sort = isDesc ? 'clientName desc' : 'clientName';

    this.dataList.sort((a, b) => {
      const nameA = (a.clientName || '').toLowerCase();
      const nameB = (b.clientName || '').toLowerCase();

      return isDesc
        ? nameB.localeCompare(nameA)
        : nameA.localeCompare(nameB);
    });

    return;
  }

  // ===== BILL DATE (API SORT - KEEP AS IT IS) =====
  if (this.sort === column) {
    this.sort = column + ' desc';
  } else {
    this.sort = column;
  }

  this.getData();
}
// till here //


  onDownloadPdf(url?: string) {
    if(url){
      window.open(url, '_blank');
    }
  }

  getReceivedPayment(bill: ProjectBillAnalysis) {
    return bill.payments.reduce((a, b) => a + b.amount, 0)
  }

  getPendingPayment(bill: ProjectBillAnalysis) {
    return bill.payableAmount - bill.payments.reduce((a, b) => a + b.amount, 0);
  }

  getPaymentWithoutTDS(bill: ProjectBillAnalysis) {

    let paymentReceived = bill.payments.reduce((a, b) => a + b.amount, 0);
    let tdsAmount = (bill.billAmount * 10 / 100.0);
    let gstAmount = bill.payableAmount - bill.dueAmount;
    return paymentReceived > 0 ? paymentReceived : bill.dueAmount - tdsAmount + gstAmount;
  }

  getPaymentMode(bill: ProjectBillAnalysis) {
    return bill.payments.length > 0 ? bill.payments[0].mode : '';
  }

  refreshFilters() {
    this.searchFC.reset();
  }

  onFollowUp(bill: ProjectBillAnalysis) {
      this.dialog.open(BillAnalysisRowComponent, {
          width: '1000px',
          maxWidth: '90vw',
          height: 'auto',
          data: { bill: bill }
      });
  }

  
  get isAdmin(): boolean {
  return this.authService.isInRole('ADMIN');
}

}



