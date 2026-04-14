import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable, TemplateRef } from "@angular/core";
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ComponentType } from "@angular/cdk/portal";
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from "rxjs";

import { UtilityService } from "./utility.service";
import { AuthService } from "../../auth/services/auth.service";

import { AppConfig } from "src/app/app.config";
import { ApiFilter } from "../models/api-filters";
import { AppPermissions } from "../../app.permissions";
import { AppInjector } from "src/app/app-injector";
import { McvComponentDialogConfig } from "../models/mcv-component-dialog-config";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class McvBaseApiService
{
  protected apiRoute!: string;
  protected defaultRoute!: string;
  protected $triggerListRefresh: BehaviorSubject<boolean>;
  protected $triggerListDelete: BehaviorSubject<boolean>;
  get triggerListRefresh(): Observable<boolean>
  {
    return this.$triggerListRefresh.asObservable();
  }
  get triggerListDelete(): Observable<boolean>
  {
    return this.$triggerListDelete.asObservable();
  }

  protected $triggerCreated: BehaviorSubject<any>;
  get triggerCreated(): Observable<any>
  {
    return this.$triggerCreated.asObservable();
  }

  protected $triggerActivityRefresh: BehaviorSubject<boolean>;
  get triggerActivityRefresh(): Observable<boolean>
  {
    return this.$triggerActivityRefresh.asObservable();
  }

  private _activeEntity: any;
  get activeEntity(): any { return this._activeEntity; }
  set activeEntity(value: any) { this._activeEntity = value; }

  protected http: HttpClient;
  protected config: AppConfig;
  protected dialog: MatDialog;
  protected permissions: AppPermissions;
  protected authService: AuthService;
  protected utilityService: UtilityService;
  protected router: Router;

  constructor(
  )
  {
    const injector = AppInjector.getInjector();
    this.http = injector.get(HttpClient);
    this.config = injector.get(AppConfig);
    this.dialog = injector.get(MatDialog);
    this.utilityService = injector.get(UtilityService);
    this.authService = injector.get(AuthService);
    this.permissions = injector.get(AppPermissions);
    this.router = injector.get(Router);

    this.$triggerListRefresh = new BehaviorSubject<boolean>(false);
    this.$triggerListDelete = new BehaviorSubject<boolean>(false);
    this.$triggerCreated = new BehaviorSubject<any>(null);
    this.$triggerActivityRefresh = new BehaviorSubject<boolean>(false);
  }

  refreshList()
  {
    this.$triggerListRefresh.next(true);
    this.$triggerActivityRefresh.next(true);
  }

  deleteFromList()
  {
    this.$triggerListDelete.next(true);
  }

  get(
    filters?: ApiFilter[],
    search?: string,
    sort?: string
  ): Observable<any[]>
  {

    let params = new HttpParams();
    if (filters && filters.length !== 0)
    {
      params = params.append('filters', JSON.stringify({ filters: filters }));
    }
    if (search)
    {
      params = params.append('search', search);
    }
    if (sort)
    {
      params = params.append('sort', sort);
    }

    return this.http.get<any[]>(this.apiRoute, { params: params });
  }

  getCount(
    filters?: ApiFilter[],
    search?: string,
    sort?: string
  ): Observable<number>
  {

    let params = new HttpParams();
    if (filters && filters.length !== 0)
    {
      params = params.append('filters', JSON.stringify({ filters: filters }));
    }
    if (search)
    {
      params = params.append('search', search);
    }
    if (sort)
    {
      params = params.append('sort', sort);
    }

    return this.http.get<number>(this.apiRoute + '/count', { params: params });
  }

  getPages(
    page: number,
    pageSize: number,
    filters?: ApiFilter[],
    search?: string,
    sort?: string
  ): Observable<any>
  {

    let params = new HttpParams();
    if (filters && filters.length !== 0)
    {
      params = params.append('filters', JSON.stringify({ filters: filters }));
    }

    if (page !== undefined)
    {
      params = params.append('page', page.toString());
    }
    if (pageSize !== undefined)
    {
      params = params.append('pageSize', pageSize.toString());
    }
    if (search)
    {
      params = params.append('search', search);
    }
    if (sort)
    {
      params = params.append('sort', sort);
    }

    return this.http.get<any>(this.apiRoute + '/Pages', { params: params });
  }
  getOptions(filters?: ApiFilter[],
    search?: string,
    sort?: string
  ): Observable<any[]>
  {

    let params: any = {
      search: search ? search : null,
      sort: sort ? sort : null,
      filters: filters && filters.length !== 0 ? JSON.stringify({ filters: filters }) : null,
    };

    Object.entries(params).forEach(o =>
      o[1] === null ? delete params[o[0]] : 0
    );
    return this.http.get<any[]>(this.apiRoute + "/Options", { params: params });
  }
  getById(id: number): Observable<any>
  {
    return this.http.get<any>(this.apiRoute + '/' + id);
  }

  getByPublicUid(id: string): Observable<any>
  {
    return this.http.get<any>(this.apiRoute + "/uid/" + id,
      { headers: { 'No-Auth': 'true' } });
  }

  create(obj: any, hideLoader: boolean = false): Observable<any>
  {
    if (hideLoader)
    {
      return this.http.post<any>(this.apiRoute, obj, { headers: { 'No-loader': 'true' } })
        .pipe(map(result => { this.$triggerCreated.next(result); return result; }));
    }
    return this.http.post<any>(this.apiRoute, obj)
      .pipe(map(result => { this.$triggerCreated.next(result); return result; }));
  }

  update(obj: any, hideLoader: boolean = false): Observable<any>
  {
    if (hideLoader)
    {
      return this.http.put<any>(this.apiRoute + '/' + obj.id, obj, { headers: { 'No-loader': 'true' } });
    }
    // console.log('Updating',obj.id);
    return this.http.put<any>(this.apiRoute + '/' + obj.id, obj);
  }

  getVersions(entityID: number
  ): Observable<any[]>
  {

    return this.http.get<any[]>(this.apiRoute + '/versions/' + entityID);
  }

  delete(id: number, hideLoader: boolean = false): Observable<any>
  {
    if (hideLoader)
    {
      return this.http.delete<any>(this.apiRoute + '/' + id, { headers: { 'No-loader': 'true' } });
    }
    return this.http.delete<any>(this.apiRoute + '/' + id);
  }

  getSearchTagOptions(): Observable<string[]>
  {
    return this.http.get<string[]>(this.apiRoute + "/SearchTagOptions");
  }
  getFieldOptions(field: string): Observable<any>
  {
    return this.http.get<any>(this.apiRoute + '/FieldOptions', { params: { field } });
  }

  getAnalysis(analysisType: string, filters?: ApiFilter[], search?: string, sort?: string, page?: number, pageSize?: number)
  {
    let params = new HttpParams();
    if (filters && filters.length !== 0)
    {
      params = params.append('filters', JSON.stringify({ filters: filters }));
    }

    if (search)
    {
      params = params.append('search', search);
    }
    if (sort)
    {
      params = params.append('sort', sort);
    }
    if (page)
    {
      params = params.append('page', page);
    }
    if (pageSize)
    {
      params = params.append('pageSize', pageSize);
    }

    return this.http.get<any>(this.apiRoute + '/Analysis/' + analysisType, { headers: { 'no-loader': 'true' }, params });
  }

  exportAnalysisExcel(analysisType: string, filters?: ApiFilter[], search?: string, sort?: string)
  {

    let url = this.apiRoute + '/Analysis/' + analysisType + '/excel';
    if (filters || search || sort)
    {
      url = url + '?'
        + (filters && filters.length !== 0 ? '&filters=' + JSON.stringify({ filters: filters }) : '')
        + (search ? '&search=' + search : '')
        + (sort ? '&sort=' + sort : '');
    }
    window.open(url, '_blank');
  }


  exportDataToExcel(filename: string, dataList: any[]): Observable<Blob>
  {
    return this.http.post(this.apiRoute + '/excel', { filename: filename, dataList: dataList }, { responseType: 'blob' });
  }

  openDialog(
    componentOrTemplateRef: ComponentType<unknown> | TemplateRef<unknown>,
    dialogData: McvComponentDialogConfig | any, isFullScreen: boolean = false
  )
  {

    const dialogConfig = new MatDialogConfig();

    if (isFullScreen)
      dialogConfig.panelClass = 'mcv-fullscreen-dialog';

    
    dialogConfig.autoFocus = true;
    dialogConfig.data = dialogData;
    dialogConfig.disableClose = true;

    return this.dialog.open(componentOrTemplateRef, dialogConfig);

  }

  //new method
  openEntityDialog(componentOrTemplateRef: ComponentType<unknown> | TemplateRef<unknown>,
    dialogTitle: string,
    entityID: number,
    entityTypeFlag: number,
    isCreateMode: boolean = false,
    isTaskMode: boolean = false,
    wfTask?: any
  )
  {
    let _dialogData = new McvComponentDialogConfig();
    _dialogData.dialogTitle = dialogTitle;
    _dialogData.entityID = entityID;
    _dialogData.entityTypeFlag = entityTypeFlag;
    _dialogData.isCreateMode = isCreateMode;
    _dialogData.isTaskMode = isTaskMode;
    _dialogData.task = wfTask;
    return this.openDialog(componentOrTemplateRef, _dialogData, true);
  }

  get isPermissionList(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.MASTER
    ]);
  }

  get isPermissionEdit(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.MASTER
    ]);
  }

  get isPermissionDelete(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.MASTER
    ]);
  }

  get isPermissionSpecialEdit(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.MASTER
    ]);
  }

  get isPermissionSpecialDelete(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.MASTER
    ]);
  }

  get isPermissionSpecialShowAll(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.MASTER
    ]);
  }

  navigateToDetails(id: number)
  {
    this.router.navigate([`${this.defaultRoute}/${id}`]);

  }
}
