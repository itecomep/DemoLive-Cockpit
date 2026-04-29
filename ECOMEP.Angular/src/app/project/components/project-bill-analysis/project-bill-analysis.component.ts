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
import { BillAnalysisRowService } from './bill-analysis-row/bill-analysis-row.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';



@Component({
  selector: 'app-project-bill-analysis',
  standalone: true,
  imports: [NgIf, NgFor, NgClass,
     MatSelectModule, ReactiveFormsModule, FormsModule, MatMenuModule,McvSelectAllComponent,
     MatOptionModule, FooterComponent, MatIconModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatButtonModule, MatTooltipModule, FilterToggleDirective, DecimalPipe, CurrencyPipe, DatePipe,
     McvFilterSidenavComponent,BillAnalysisRowComponent,MatSlideToggleModule
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
   private followUpService = inject(BillAnalysisRowService); // ✅ ADD THIS
   private isPeriodUpdating = false;
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);

                     //for billing analysis for hiding the another check box from other users
pageIndex = 0;
pageSize = 100;
totalRecords = 0;
usePagesApi: boolean = true;
showZeroAmount = true; // ON by default

                        // for displaying next followup column 
followUpMap: { [billId: number]: Date | null } = {};


periodOptions = [
   { label: 'Current Year', value: 'current' },
   { label: 'Last 6 Months', value: '6m' },
   { label: 'Last 1 Year', value: '1y' },
   { label: 'Last 2 Years', value: '2y' }
];

// periodFC = new FormControl('current');
periodFC = new FormControl<string | null>(null);
sortDirection: { [key: string]: 'asc' | 'desc' } = {};



  today = new Date();
  teamFC = new FormControl();
  dataList: ProjectBillAnalysis[] = [];
  total = new ProjectBillAnalysis();
  companyFC = new FormControl();
  companyOptions: Company[] = [];
fullDataList: ProjectBillAnalysis[] = [];

  sortFC = new FormControl();
  searchFC = new FormControl();
  stagePercentageStartFC = new FormControl(0, [Validators.min(0), Validators.max(99)]);
  stagePercentageEndFC = new FormControl(100, [Validators.min(1), Validators.max(100)]);

  typeOptions: TypeMaster[] = [];
  typeFC = new FormControl();

  projectStatusOptions: StatusMaster[] = [];
  projectStatusFC = new FormControl();
  teamOptions: ContactTeam[] = [];

  // dateFC = new FormGroup({
  //   start: new FormControl(this.utilityService.getFYearStart()),
  //   end: new FormControl(this.utilityService.getFYearEnd()),
  // });


//   dateFC = new FormGroup({
//   start: new FormControl(null),
//   end: new FormControl(null),
// });

dateFC = new FormGroup({
  start: new FormControl<Date | null>(null),
  end: new FormControl<Date | null>(null),
});

  filters: ApiFilter[] = [
    { key: 'TypeFlag', value: this.projectBillService.PROJECT_BILL_TYPEFLAG_TAX_INVOICE.toString() },
   
  ];
  searchKey?: string;
  // sort: string = 'billdate';
  sort: string = '';

  sortOptions: any[] = [ 
    { label: 'Bill Date', sortKey: 'billdate', icon: 'north' },
    { label: 'Bill Date', sortKey: 'billdate desc', icon: 'south' },
  ];

  get isMobileView(): boolean { return this.utilityService.isMobileView; }

  get isPermissionAnalysisDownload(){ return this.projectBillService.isPermissionAnalysisExcelDownload; }

  get PROJECT_BILL_TYPEFLAG_PROFORMA_INVOICE() { return this.projectBillService.PROJECT_BILL_TYPEFLAG_PROFORMA_INVOICE; }
  get PROJECT_BILL_TYPEFLAG_TAX_INVOICE() { return this.projectBillService.PROJECT_BILL_TYPEFLAG_TAX_INVOICE; }

  get totalBillAmount(){
    return this.dataList
    .reduce((a, b) => a + b.dueAmount, 0);
  }

  // get totalGstAmount(){
  //   return this.dataList
  //   .reduce((a, b) => a + b.cgstAmount + b.igstAmount+ b.sgstAmount, 0);
  // }

  get totalGstAmount(){
    return this.dataList
    .reduce((a, b) => a + b.cgstAmount + b.igstAmount+ b.sgstAmount, 0);
  }

  get totalPayable(){
    return this.dataList
    .reduce((a, b) => a + b.payableAmount, 0);
  }

  get totalReceivedAmount(){
    return this.dataList
    .reduce((a, b) => a + this.getReceivedPayment(b), 0);
  }
  async ngOnInit()
  {
    this.companyOptions = await firstValueFrom(this.companyService.get());
    this.teamOptions = await firstValueFrom(this.contactTeamService.get());
    this.companyFC.setValue(this.companyOptions, { emitEvent: false });
    this.filters.push(...this.companyOptions.map(x => { return { key: 'CompanyID', value: x.id.toString() } }));

      this.filters.push(...this.companyOptions.map(x => {
    return { key: 'CompanyID', value: x.id.toString() }
  }));

  // 🔒 ADD THIS BLOCK HERE (IMPORTANT POSITION)
  if (!this.isAdmin) {
    const userTeams = this.authService.currentUserStore?.teams || [];

    this.filters = this.filters.filter(f => f.key !== 'teamID');

    userTeams.forEach(team => {
      this.filters.push({
        key: 'teamID',
        value: team.id.toString()
      });
    });
  }

this.periodFC.valueChanges.subscribe(value => {

  const today = new Date();
  let start: Date;
  let end: Date = new Date();

  end.setHours(23, 59, 59, 999);

  switch (value) {
  case '6m':
    start = new Date(today);
    start.setMonth(start.getMonth() - 6);
    break;

  case '1y':
    start = new Date(today);
    start.setFullYear(start.getFullYear() - 1);
    break;

  case '2y':
    start = new Date(today);
    start.setFullYear(start.getFullYear() - 2);
    break;

  case 'current':
  default:
    start = new Date(this.utilityService.getFYearStart());
    end = new Date(this.utilityService.getFYearEnd());
    break;
}


  start.setHours(0, 0, 0, 0);

  // 🚨 IMPORTANT: stop other triggers
  this.isPeriodUpdating = true;

  this.dateFC.setValue({ start, end }, { emitEvent: false });

  this.filters = this.filters.filter(
    f => f.key !== 'RangeStart' && f.key !== 'RangeEnd'
  );

  this.filters.push(
    { key: 'RangeStart', value: start.toISOString() },
    { key: 'RangeEnd', value: end.toISOString() }
  );

  this.getData();

  this.isPeriodUpdating = false;
});

    this.typeOptions = await firstValueFrom(this.typeMasterService.get([{ key: 'Entity', value: this.projectBillService.nameOfEntity }]));

    this.typeFC.setValue(this.typeOptions.find(x => this.filters.find(f => f.key == 'TypeFlag' && f.value == x.value.toString())), { emitEvent: false });

    this.projectStatusOptions = await firstValueFrom(this.statusMasterService.get([{ key: 'Entity', value: this.projectService.nameOfEntity }]));

    this.projectStatusFC.setValue(this.typeOptions.filter(x => this.filters.find(f => f.key == 'ProjectStatusFlag' && f.value == x.value.toString())), { emitEvent: false });

    this.getData();

    this.sortFC.setValue(this.sortOptions.find(x => x.sortKey == this.sort), { emitEvent: false });


    this.typeFC.valueChanges
  .pipe(debounceTime(400), distinctUntilChanged())
  .subscribe((element) =>
  {
    if (element)
    {
      this.filters = this.filters.filter(i => i.key !== "TypeFlag");

      this.addFilter('TypeFlag', element.value.toString());

      this.pageIndex = 0;   // ✅ ADD THIS
      this.getData();
    }
  });

     
      this.projectStatusFC.valueChanges
  .pipe(debounceTime(400), distinctUntilChanged())
  .subscribe((value) =>
  {
    if (value)
    {
      this.filters = this.filters.filter(i => i.key !== "ProjectStatusFlag");

      value.forEach((element: StatusMaster) =>
      {
        this.addFilter('ProjectStatusFlag', element.value.toString());
      });

      this.pageIndex = 0;   // ✅ ADD THIS
      this.getData();
    }
  });
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

    this.companyFC.valueChanges
  .pipe(debounceTime(400), distinctUntilChanged())
  .subscribe((value) =>
  {
    if (value)
    {
      this.filters = this.filters.filter(i => i.key !== "CompanyID");

      value.forEach((element: Company) =>
      {
        this.addFilter('CompanyID', element.id.toString())
      });

      this.pageIndex = 0;   // ✅ ADD THIS
      this.getData();
    }
  });

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


  //   this.dateFC.valueChanges
  // .pipe(debounceTime(400), distinctUntilChanged())
  // .subscribe((value) =>
  // {
  //   if (value && value.start && value.end)
  //   {
  //     this.filters = this.filters.filter(
  //       (x) => x.key !== "RangeStart" && x.key != "RangeEnd"
  //     );

  //     this.filters.push({
  //       key: "RangeStart",
  //       value: value.start.toISOString(),
  //     });

  //     this.filters.push({
  //       key: "RangeEnd",
  //       value: value.end.toISOString(),
  //     });

  //     this.pageIndex = 0;   // ✅ ADD THIS
  //     this.getData();
  //   }
  // });


  this.dateFC.valueChanges
  .pipe(debounceTime(400), distinctUntilChanged())
  .subscribe((value) =>
  {
    if (value && value.start && value.end)
    {
      // ✅ ADD THIS (VERY IMPORTANT)
      const start = value.start as Date;
      const end = value.end as Date;

      this.filters = this.filters.filter(
        (x) => x.key !== "RangeStart" && x.key != "RangeEnd"
      );

      this.filters.push({
        key: "RangeStart",
        value: start.toISOString(),   // ✅ FIXED
      });

      this.filters.push({
        key: "RangeEnd",
        value: end.toISOString(),     // ✅ FIXED
      });

      this.pageIndex = 0;
      this.getData();
    }
  });
  
  this.teamFC.valueChanges
  .pipe(debounceTime(400), distinctUntilChanged())
  .subscribe((value) => {
    if (value) {
      this.filters = this.filters.filter(i => i.key !== "teamID");

      value.forEach((element: ContactTeam) => {
        this.addFilter('teamID', element.id.toString());
      });

      this.pageIndex = 0;   // ✅ ADD THIS
      this.getData();
    }
  });
  }


private async getData()
{
  // 🔒 Always apply user restriction
  if (!this.isAdmin) {
    const userTeams = this.authService.currentUserStore?.teams || [];

    this.filters = this.filters.filter(f => f.key !== 'teamID');

    userTeams.forEach(team => {
      this.filters.push({
        key: 'teamID',
        value: team.id.toString()
      });
    });
  }


  const [pageResponse, fullData] = await Promise.all([
  firstValueFrom(
    this.projectBillService.getPages(
      this.pageIndex,
      this.pageSize,
      this.filters,
      this.searchKey,
      this.sort
    )
  ),
  firstValueFrom(
    this.projectBillService.getAnalysis(
      'full',
      this.filters,
      this.searchKey,
      this.sort
    )
  )
]);

// this.dataList = pageResponse.list;
// this.dataList = pageResponse.list;
// this.fullDataList = [...this.dataList]; // ✅ ADD THIS
// if (!this.showZeroAmount) {
//   this.dataList = this.dataList.filter(
//     // bill => this.getReceivedPayment(bill) !== 0
//     (bill: ProjectBillAnalysis) => this.getReceivedPayment(bill) !== 0
//   );
// }
// this.totalRecords = pageResponse.totalCount;

// await this.loadFollowUps();


this.dataList = pageResponse.list;

// 🔥 IMPORTANT FIX: handle empty next page
if (this.dataList.length === 0 && this.pageIndex > 0) {
  this.pageIndex--;   // go back to previous page
  return;             // stop execution
}

this.fullDataList = [...this.dataList]; // keep original copy

if (!this.showZeroAmount) {
  this.dataList = this.dataList.filter(
    (bill: ProjectBillAnalysis) => this.getReceivedPayment(bill) !== 0
  );
}

this.totalRecords = pageResponse.totalCount;

await this.loadFollowUps();

  // ✅ Use full data for totals
  this.total = new ProjectBillAnalysis();

  // fullData.forEach(x =>
  fullData.forEach((x: ProjectBillAnalysis) =>
  {
    this.total.dueAmount += x.dueAmount;
    this.total.cgstAmount += x.cgstAmount;
    this.total.sgstAmount += x.sgstAmount;
    this.total.billAmount += x.billAmount;
    this.total.igstAmount += x.igstAmount;
    this.total.payableAmount += x.payableAmount;
    this.total.pendingPayment += x.pendingPayment;
  });
}



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


  if (column === 'billdate') {

  const isDesc = this.sort === 'billdate desc';

  this.sort = isDesc ? 'billdate' : 'billdate desc';

  this.getData(); // only now API is called

  return;
}


  if (column === 'received') {
  const isDesc = this.sort === 'received desc';

  this.sort = isDesc ? 'received' : 'received desc';

  this.dataList.sort((a: ProjectBillAnalysis, b: ProjectBillAnalysis) => {
    const receivedA = this.getReceivedPayment(a) || 0;
    const receivedB = this.getReceivedPayment(b) || 0;

    return isDesc
      ? receivedA - receivedB   // ASC
      : receivedB - receivedA;  // DESC
  });

  return;
}

if (column === 'days') {

  this.sortDirection['days'] =
    this.sortDirection['days'] === 'asc' ? 'desc' : 'asc';

  const isAsc = this.sortDirection['days'] === 'asc';

  this.dataList = [...this.dataList].sort((a, b) => {

    const valA = this.getDaysSinceBill(a);
    const valB = this.getDaysSinceBill(b);

    let daysA: number;
    let daysB: number;

    if (isAsc) {
      // 🔥 ASC → push '-' to bottom
      daysA = valA === '-' ? Number.MAX_SAFE_INTEGER : parseInt(valA);
      daysB = valB === '-' ? Number.MAX_SAFE_INTEGER : parseInt(valB);

      return daysA - daysB;
    } else {
      // 🔥 DESC → push '-' to bottom
      daysA = valA === '-' ? Number.MIN_SAFE_INTEGER : parseInt(valA);
      daysB = valB === '-' ? Number.MIN_SAFE_INTEGER : parseInt(valB);

      return daysB - daysA;
    }

  });

  return;
}

// // ===== NEXT FOLLOW-UP SORT =====
if (column === 'followUp') {

  this.sortDirection['followUp'] =
    this.sortDirection['followUp'] === 'asc' ? 'desc' : 'asc';

  const isAsc = this.sortDirection['followUp'] === 'asc';

  this.dataList = [...this.dataList].sort((a, b) => {

    const valA = this.followUpMap[a.id];
    const valB = this.followUpMap[b.id];

    let dateA: number;
    let dateB: number;

    if (isAsc) {
      // 🔥 ASC → push null to bottom
      dateA = valA ? new Date(valA).getTime() : Number.MAX_SAFE_INTEGER;
      dateB = valB ? new Date(valB).getTime() : Number.MAX_SAFE_INTEGER;

      return dateA - dateB;
    } else {
      // 🔥 DESC → push null to bottom
      dateA = valA ? new Date(valA).getTime() : Number.MIN_SAFE_INTEGER;
      dateB = valB ? new Date(valB).getTime() : Number.MIN_SAFE_INTEGER;

      return dateB - dateA;
    }

  });

  return;
}
  // ===== OTHER FRONTEND SORTS =====
  if (column === 'projectCode') {
    const isDesc = this.sort === 'projectCode';
    this.sort = isDesc ? 'projectCode desc' : 'projectCode';

    this.dataList = [...this.dataList].sort((a, b) => {
      const numA = parseInt(a.projectCode) || 0;
      const numB = parseInt(b.projectCode) || 0;
      return isDesc ? numB - numA : numA - numB;
    });

    return;
  }

  if (column === 'clientName') {
    const isDesc = this.sort === 'clientName';
    this.sort = isDesc ? 'clientName desc' : 'clientName';

    this.dataList = [...this.dataList].sort((a, b) => {
      return isDesc
        ? (b.clientName || '').localeCompare(a.clientName || '')
        : (a.clientName || '').localeCompare(b.clientName || '');
    });

    return;
  }

  // ===== API SORT (ONLY FOR BACKEND FIELDS) =====
  if (this.sort === column) {
    this.sort = column + ' desc';
  } else {
    this.sort = column;
  }

  this.getData(); // only for API fields like billdate
}





// till here //


  onDownloadPdf(url?: string) {
    if(url){
      window.open(url, '_blank');
    }
  }



getReceivedPayment(bill: ProjectBillAnalysis) {
  const payment = (bill.payments || []).reduce((a, b) => a + b.amount, 0);

  // 👇 fallback for proforma
  if (payment === 0 && bill.typeFlag === this.PROJECT_BILL_TYPEFLAG_PROFORMA_INVOICE) {
    return bill.dueAmount || 0; // OR payableAmount depending on your logic
  }

  return payment;
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
    data: { 
      bill: bill,
      contact: {
        name: bill.clientName,
        email: (bill as any)?.clientEmail,
        phone: (bill as any)?.clientPhone
      }
    }
  });
}


                                         //billing analysis for admin
  get isAdmin(): boolean {
  return this.authService.isInRole('ADMIN');
}
                                         // next follow update 
async loadFollowUps() {
  for (let bill of this.dataList) {

    try {
      const res: any[] = await firstValueFrom(
        this.followUpService.get(bill.id)
      );

      if (res && res.length > 0) {
        // get latest nextFollowUpDate
        const latest = res
          .filter(x => x.nextFollowUpDate)
          .sort((a, b) =>
            new Date(b.nextFollowUpDate).getTime() -
            new Date(a.nextFollowUpDate).getTime()
          )[0];

        this.followUpMap[bill.id] = latest?.nextFollowUpDate || null;

      } else {
        this.followUpMap[bill.id] = null;
      }

    } catch (err) {
      this.followUpMap[bill.id] = null;
    }
  }
}




getDaysSinceBill(bill: ProjectBillAnalysis): string {
  const pending = this.getPendingPayment(bill);

  // ✅ If no pending → show "-"
  if (!pending || pending <= 0) {
    return '-';
  }

  if (!bill.billDate) return '-';

  const today = new Date();
  const billDate = new Date(bill.billDate);

  // normalize (avoid timezone bugs)
  today.setHours(0, 0, 0, 0);
  billDate.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - billDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays.toString();
}


// nextPage() {
//   this.pageIndex++;
//   this.getData();
// }

nextPage() {
  const nextPageStart = (this.pageIndex + 1) * this.pageSize;

  // ❌ stop if no more data
  if (nextPageStart >= this.totalRecords) {
    return;
  }

  this.pageIndex++;
  this.getData();
}

prevPage() {
  if (this.pageIndex > 0) {
    this.pageIndex--;
    this.getData();
  }
}

// getTotalPages(): number {
//   return Math.ceil(this.totalRecords / this.pageSize);
// }

getTotalPages(): number {
  if (!this.totalRecords || !this.pageSize) return 0;
  return Math.ceil(this.totalRecords / this.pageSize);
}

toggleZeroAmount() {

  if (this.showZeroAmount) {
    // ✅ show all
    this.dataList = [...this.fullDataList];
  } else {
    // ❌ remove rows where received = 0
    this.dataList = this.fullDataList.filter(
      bill => this.getReceivedPayment(bill) !== 0
    );
  }
}
}



