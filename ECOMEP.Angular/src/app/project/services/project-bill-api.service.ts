import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiFilter } from 'src/app/shared/models/api-filters';
import { McvBaseApiService } from 'src/app/shared/services/mcv-base-api.service';
import { ProjectBill } from '../models/project-bill.model';
import { ChartDataDto } from 'src/app/shared/models/chart-data-dto';
import { HttpParams } from '@angular/common/http'; // ✅ REQUIRED

@Injectable({
  providedIn: 'root'
})
export class ProjectBillApiService extends McvBaseApiService {

  override apiRoute = this.config.apiProjectBill;

  get nameOfEntity() { return this.config.NAME_OF_ENTITY_PROJECT_Bill; }

  protected $triggerBillRefresh: BehaviorSubject<ProjectBill | null> = new BehaviorSubject<ProjectBill | null>(null);
  get triggerBillRefresh(): Observable<ProjectBill | null> {
    return this.$triggerBillRefresh.asObservable();
  }

  refreshBill(bill: ProjectBill) {
    this.$triggerBillRefresh.next(bill);
  }

  constructor() {
    super();
  }

  private _bill?: ProjectBill;
  get activeBill() { return this._bill; }
  set activeBill(value) { this._bill = value; }


  get isPermissionView(): boolean {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_BILLING_VIEW,
    ]);
  }

  override get isPermissionEdit(): boolean {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_BILLING_EDIT,
    ]);
  }

  get isPermissionAnalysisView(){
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_BILLING_ANALYSIS_VIEW,
    ]);
  }
  get isPermissionAnalysisExcelDownload(){
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_BILLING_ANALYSIS_EXCEL_DOWNLOAD,
    ]);
  }

  get PROJECT_BILL_TYPEFLAG_PROFORMA_INVOICE() { return this.config.PROJECT_BILL_TYPEFLAG_PROFORMA_INVOICE; }
  get PROJECT_BILL_TYPEFLAG_TAX_INVOICE() { return this.config.PROJECT_BILL_TYPEFLAG_TAX_INVOICE; }

  getChartData(
    period: 'Monthly' | 'Yearly' | 'Quarterly' | 'Half Yearly' = 'Monthly',
    previousYearIndex: number = 0,
    teamID?: number
  ): Observable<ChartDataDto[]> {
    const params: any = {
      previousYearIndex: previousYearIndex.toString(),
      teamID: teamID ? teamID.toString() : null
    };
    Object.entries(params).forEach(o => (o[1] === null ? delete params[o[0]] : 0));

    return this.http.get<ChartDataDto[]>(this.apiRoute + '/chartData/' + this.utilityService.getMonthsByPeriod(period), { params });
  }


  exportReport(reportName: string, size: string = 'a4', output: 'PDF' | 'EXCELOPENXML' = 'PDF', filters?: ApiFilter[], search?: string, sort?: string) {

    let url = this.apiRoute + `/report/${reportName}`;
    if (filters && filters.length !== 0) {
      const filtersParam = encodeURIComponent(JSON.stringify({ filters: filters }));
      url += `?filters=${filtersParam}`;
    }

    if (size) {
      if (url.includes('?')) {
        url += `&size=${size}`;
      } else {
        url += `?size=${size}`;
      }
    }

    if (search) {
      if (url.includes('?')) {
        url += `&search=${search}`;
      } else {
        url += `?search=${search}`;
      }
    }
    if (sort) {
      if (url.includes('?')) {
        url += `&sort=${sort}`;
      } else {
        url += `?sort=${sort}`;
      }
    }
    if (output) {
      if (url.includes('?')) {
        url += `&output=${output}`;
      } else {
        url += `?output=${output}`;
      }
    }

    window.open(url, '_blank');
  }

  getDraft(
    projectID?: number,
    typeFlag: number=0,
    isPreDated: boolean=false
  ): Observable<ProjectBill> {
    return this.http.get<ProjectBill>(this.apiRoute + '/draft/' + projectID+'/'+typeFlag,{params:{isPreDated:isPreDated.toString()}});
  }

  override getPages(
  page: number,
  pageSize: number,
  filters?: ApiFilter[],
  search?: string,
  sort?: string
): Observable<any> {

  let params = new HttpParams()
    .set('page', page.toString())
    .set('pageSize', pageSize.toString());

  if (filters?.length) {
    params = params.set('filters', JSON.stringify({ filters }));
  }

  if (search) {
    params = params.set('search', search);
  }

  if (sort) {
    params = params.set('sort', sort);
  }

  return this.http.get<any>(`${this.apiRoute}/Pages`, { params });
}
}
