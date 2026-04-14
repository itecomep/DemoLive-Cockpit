import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, Params, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription, debounceTime, distinctUntilChanged, firstValueFrom } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { ApiFilter } from 'src/app/shared/models/api-filters';
import { McvComponentConfig } from 'src/app/shared/models/mcv-component-config';
import { PagedListConfig } from 'src/app/shared/models/paged-list-config.model';
import { StatusMaster } from 'src/app/shared/models/status-master-dto';
import { TypeMaster } from 'src/app/shared/models/type-master-dto';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { AppService } from 'src/app/shared/services/app.service';
import { StatusMasterService } from 'src/app/shared/services/status-master.service';
import { TypeMasterService } from 'src/app/shared/services/type-master.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ContactApiService } from '../../services/contact-api.service';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HeaderComponent } from 'src/app/mcv-header/components/header/header.component';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { FilterToggleDirective } from 'src/app/shared/directives/filter-toggle.directive';
import { ContactTeamComponent } from '../contact-team/contact-team.component';
import { ContactTeamCreateComponent } from '../contact-team-create/contact-team-create.component';
import { Contact } from '../../models/contact';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TeamsComponent } from '../teams/teams.component';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ContactTeamApiService } from '../../services/contact-team-api.service';
import { ContactTeamDocumentsCategoryEditComponent } from '../contact-team-documents-category-edit/contact-team-documents-category-edit.component';
import { McvFilterSidenavComponent } from 'src/app/mcv-header/components/mcv-filter-sidenav/mcv-filter-sidenav.component';
import { ContactPhotoNameDialogComponent } from 'src/app/shared/components/contact-photo-name-dialog/contact-photo-name-dialog.component';

@Component({
  selector: 'app-contact-team-list-view',
  standalone: true,
  imports: [CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTooltipModule,
    MatSelectModule,
    MatOptionModule,
    FilterToggleDirective,
    RouterLinkActive,
    RouterLink,
    //Components
    HeaderComponent,
    FooterComponent,
    ContactTeamComponent,
    McvFilterSidenavComponent
  ],
  templateUrl: './contact-team-list-view.component.html',
  styleUrls: ['./contact-team-list-view.component.scss']
})
export class ContactTeamListViewComponent implements OnInit, OnDestroy
{

  showAllFilterKey: string = 'ContactID';
  typeFlagFilterKey: string = 'AppointmentTypeFlag';
  statusFlagFilterKey: string = 'AppointmentStatusFlag';

  readonly nameOfEntity = this.config.NAMEOF_ENTITY_CONTACT;
  readonly defaultRoute = this.config.ROUTE_TEAM_LIST;
  readonly defaultSort = 'created desc';
  readonly defaultFilters: ApiFilter[] = [
    { key: 'IsAppointed', value: 'true' }, 
    { key: this.statusFlagFilterKey, value: this.TEAM_APPOINTMENT_STATUS_APPOINTED.toString() },
  ];
  readonly defaultKeyPropertyName: string = 'id';
  readonly defaultPageSize: number = 30;

  title!: string;


  pagedListConfig = new PagedListConfig({
    searchKey: null,
    sort: this.defaultSort,
    showAll: false,
    showAssigned: false,
    filters: this.defaultFilters,
    route: this.defaultRoute,
    pageSize: this.defaultPageSize,
    pageIndex: 0,
    groupBy: [],
    keyPropertyName: "id",
  });

  componentConfig!: McvComponentConfig;

  isShowList: boolean = true;
  isShowDetail: boolean = true;

  statusOptions: StatusMaster[] = [];
  statusFC = new FormControl();

  typeOptions: TypeMaster[] = [];
  typeFC = new FormControl();
  searchFC = new FormControl('');

  sortOptions: string[] = [];
  sortFC = new FormControl();

  tagOptions: string[] = [];
  tagFC = new FormControl();

  totalRecordsCount: any;
  totalPages: any;
  currentPage: any;
  pageSize: any;
  headerTitle: any;
  headerTitleCount: any;

  get isMobileView() { return this.utilityService.isMobileView; }
  get isPermissionEdit() { return this.entityService.isPermissionTeamContactEdit; }
  get isPermissionSpecialShowAll() { return this.entityService.isPermissionSpecialShowAll; }
  get isPermissionTeamManagement() { return this.entityService.isPermissionTeamManagement; }
  get isPermissionTeamDocumentsSettings(){return this.contactTeamService.isPermissionTeamDocumentsSettings}
  get TEAM_APPOINTMENT_STATUS_APPOINTED() { return this.config.TEAM_APPOINTMENT_STATUS_APPOINTED; }

  editContactForm: boolean = false;
  categoryOptions: any[] = [];
  categoryFC = new FormControl();
  resetCheckbox: boolean = false;
  typeFlagOptions: any[] = [];
  isCompanyFC = new FormControl();


  constructor(
    private appSettingService: AppSettingMasterApiService,
    private config: AppConfig,
    private typeMasterService: TypeMasterService,
    private statusMasterService: StatusMasterService,
    private route: ActivatedRoute,
    private appService: AppService,
    private utilityService: UtilityService,
    private entityService: ContactApiService,
    private router: Router,
    private dialog:MatDialog,
    private authService:AuthService,
    private contactTeamService: ContactTeamApiService
  )
  { }

  async ngOnInit()
  {
    this.subscribeToRefresh();
    this.subscribeToDelete();
    if (this.route)
    {
      this.headerTitle = this.route.snapshot.data['title'];
      // this.appService.setHeaderTitle(this.route.snapshot.data.title);
      this.route.params.subscribe((params: Params) =>
      {
        this.componentConfig = new McvComponentConfig();
        this.componentConfig.isCreateMode = false;
        this.componentConfig.entityID = params['id'];

        const innerWidth = window.innerWidth;
        if (this.componentConfig.entityID)
        {
          if (innerWidth < this.config.MOBILE_BREAKPOINT_SCREEN_WIDTH)
          {
            this.isShowList = false;
            this.isShowDetail = true;
          }
        } else
        {
          if (innerWidth < this.config.MOBILE_BREAKPOINT_SCREEN_WIDTH)
          {
            this.isShowList = true;
            this.isShowDetail = false;
          }
        }
      });
    }

    await this.getTypeOptions();
    this.typeFC.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(
        (value) =>
        {
          if (value)
          {
            this.pagedListConfig.filters = this.pagedListConfig.filters.filter(i => i.key !== this.typeFlagFilterKey);
            value.forEach((element: StatusMaster) =>
            {
              this.addFilter(this.typeFlagFilterKey, element.value.toString());
            });
            this.search();
          }
        }
      );

    await this.getStatusOptions();
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
            this.pagedListConfig.filters = this.pagedListConfig.filters.filter(i => i.key !== this.statusFlagFilterKey);
            value.forEach((element: StatusMaster) =>
            {
              this.addFilter(this.statusFlagFilterKey, element.value.toString());
            });
            this.search();
          }
        }
      );
    //  this.statusFC.setValue([0],{onlySelf:true,emitEvent:false,emitModelToViewChange:false,emitViewToModelChange:false});
    // this.getSortOptions();
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
            // this.filters = this.filters.filter(i => i.key !== "typeFlag");
            // value.forEach(element => {
            //   this.addFilter('typeFlag', element);
            // });
            // this.search();
          }
        }
      );
    this.tagFC.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(
        (value) =>
        {
          if (value)
          {
            this.pagedListConfig.filters = this.pagedListConfig.filters.filter(i => i.key !== "SearchTag");
            value.forEach((element: any) =>
            {
              this.addFilter('SearchTag', element);
            });
            this.search();
          }
        }
      );

    this.searchFC.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(value =>
    { 
      if(value){
      this.pagedListConfig.searchKey = value;
      //This method is necessary as the
      this.search();
      }
    });

    this.searchFC.reset();

    this.appService.setHeaderTitle(this.route.snapshot.data['title']);
    if (!this.appSettingService.presets || !this.appSettingService.presets.length)
      {
        await this.appSettingService.loadPresets();
      }
    const _setting = this.appSettingService.presets
      .find(x => x.presetKey == this.config.PRESET_CONTACT_CATEGORY_OPTIONS);
    if (_setting)
    {
      this.categoryOptions = _setting.presetValue.split(',').map(x => x.toUpperCase());
    }
    this.categoryFC.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(
        (value) =>
        {
          if (value)
          {
            // console.log(value);
            this.pagedListConfig.filters = this.pagedListConfig.filters.filter(i => i.key !== "category");
            value.forEach((element: string) =>
            {
              this.addFilter('category', element);
            });
            this.search();
          }
        }
      );

    this.isCompanyFC.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(
        (value) =>
        {
          if (value)
          {
            // console.log(value);
            this.pagedListConfig.filters = this.pagedListConfig.filters.filter(i => i.key !== "iscompany");

            this.addFilter('iscompany', value.toString());
            this.search();
          }
        }
      );

      if(
        !this.authService.isRoleMaster 
        && !this.entityService.isPermissionTeamSpecialShowAll
        && this.authService.currentUserStore?.teams 
        && this.authService.currentUserStore?.teams.length > 0){
      this.pagedListConfig.filters.push(...this.authService.currentUserStore?.teams.map(x=>new ApiFilter({key:'teamID',value:x.id.toString()})));
      }
      await this.getDataList(this.pagedListConfig.pageIndex, this.pagedListConfig.pageSize);
  }
  ngOnDestroy()
  {
    if (this.$deleteTrigger)
      this.unSubscribeToDelete();

    if (this.$refreshTrigger)
      this.unSubscribeToRefresh();
  }


  resetView()
  {
    this.router.navigate([this.defaultRoute]);
  }

  async getTypeOptions()
  {
    this.typeOptions = await firstValueFrom(this.typeMasterService.get([{ key: 'Entity', value: this.nameOfEntity }]));
  }

  async getStatusOptions()
  {
    this.statusOptions = await firstValueFrom(this.statusMasterService.get([{ key: 'Entity', value: this.config.NAMEOF_ENTITY_CONTACT_APPOINTMENT }]));

    const filter = this.defaultFilters.find(x => x.key == this.statusFlagFilterKey);
    if (filter && this.statusOptions.length != 0)
    {
      this.statusFC.setValue([this.statusOptions.find(x => x.value.toString() == filter.value)], { emitEvent: false });
    }

  }

  onClickExportToExcel()
  {
    // this.entityService.exportToExcel(this.pagedListConfig.filters, this.pagedListConfig.searchKey, this.pagedListConfig.sort);
  }


  async refresh()
  {
    this.pagedListConfig.searchKey = null;
    this.pagedListConfig.pageIndex = 0;
    this.searchFC.reset();
    this.dataList = [];
    await this.getDataList(this.pagedListConfig.pageIndex, this.pagedListConfig.pageSize);
  }


  back()
  {
    this.utilityService.locationBack();
  }

  addFilter(key: string, value: string)
  {
    const _filter = this.pagedListConfig.filters.find((obj) =>
    {
      return obj.key === key && obj.value === value;
    });
    if (!_filter)
    {
      this.pagedListConfig.filters.push(new ApiFilter({ key: key, value: value }));
    }
  }
  onToggleShowAll()
  {
    this.pagedListConfig.showAll = !this.pagedListConfig.showAll;
    this.pagedListConfig.filters = this.pagedListConfig.filters.filter(x => x.key !== this.showAllFilterKey);
    if (!this.pagedListConfig.showAll)
    {
      this.pagedListConfig.filters = this.defaultFilters;
    }

    this.search();

  }

  onContainerScroll(e: any)
  {
    if ((e.target as Element).scrollHeight <
      (e.target as Element).scrollTop +
      window.innerHeight)
    {
      this.loadMoreRecords();
    }
  }
  editForm(e: boolean)
  {
    this.editContactForm = e;
    // console.log(this.editContactForm);
  }

  onAddressLabel()
  {
    const filter: ApiFilter[] = [];
    this.entityService.selectedItems.map((x: any) =>
    {
      filter.push({ 'key': 'id', 'value': x.id });
    });

    console.log(filter);
    this.resetCheckbox = true;
    this.entityService.exportAddressTags(filter);
    this.entityService.selectedItems = [];
  }


  onContactAnalysis()
  {
    // const url = this.defaultRoute + '/contact-table';
    // window.open(url);
    this.router.navigate([this.defaultRoute + '/contact-table']);
  }

  get isSelectedAny(): boolean { return this.entityService.selectedItems.length > 0; }
  get isShowSharePanel(): boolean { return this.entityService.isShowSharePanel; }
  onClickShare()
  {
    this.entityService.isShowSharePanel = !this.entityService.isShowSharePanel;
  }


  onShowNewDialog()
  {
    this.entityService.openDialog(ContactTeamCreateComponent, { data: new Contact() });
  }

  onFilterChange(isCompany: boolean)
  {
    const filterKey = "isCompany";
    const filterValue = isCompany.toString();
    const _existing = this.pagedListConfig.filters.filter(x => x.key === filterKey && x.value === filterValue);
    const _getIsCompanyCount = this.pagedListConfig.filters.filter(x => x.key === filterKey);
    if (_getIsCompanyCount.length == 0)
    {
      this.pagedListConfig.filters.push({ key: filterKey, value: filterValue });
      this.search();
    } else if (_existing.length)
    {
      const existingFilterIndex = this.pagedListConfig.filters.findIndex(x => x.key === filterKey && x.value === filterValue);
      this.pagedListConfig.filters.splice(existingFilterIndex, 1);
      this.search();
    } else
    {
      const existingFilterIndex = this.pagedListConfig.filters.findIndex(x => x.key === filterKey);
      this.pagedListConfig.filters.splice(existingFilterIndex, 1);
      this.pagedListConfig.filters.push({ key: filterKey, value: filterValue });
      this.search();
    }
  }

  checkIsCompany(isCompany: string)
  {
    if (this.pagedListConfig.filters.some(filter => filter.key === 'isCompany' && filter.value === isCompany))
    {
      return true;
    } else
    {
      return false;
    }
  }

  //paged-list
  $refreshTrigger!: Subscription;
  private subscribeToRefresh()
  {
    this.$refreshTrigger = this.entityService.triggerListRefresh.subscribe((value) =>
    {
      if (value)
      {
        setTimeout(() =>
        {
          this.refresh();
        });
      }
    });
  }
  private unSubscribeToRefresh()
  {
    this.$refreshTrigger.unsubscribe();
  }

  $deleteTrigger!: Subscription;
  private subscribeToDelete()
  {
    this.$deleteTrigger = this.entityService.triggerListDelete.subscribe(
      (value) =>
      {
        if (value)
        {
          setTimeout(() =>
          {
            this.resetView();
          });
        }
      }
    );
  }
  private unSubscribeToDelete()
  {
    this.$deleteTrigger.unsubscribe();
  }

  dataList: any[] = [];
  isLoading: boolean = false;
  async getDataList(currentPage: number, pageSize: number)
  {

    this.isLoading = true;
    const data = await firstValueFrom(this.entityService.getPages(
      currentPage,
      pageSize,
      this.pagedListConfig.filters,
      this.pagedListConfig.searchKey,
      this.pagedListConfig.sort,
    ));
    this.totalRecordsCount = data.total;
    this.totalPages = data.pages;
    this.headerTitleCount = this.totalRecordsCount;

    this.dataList = this.utilityService.updatePagedList<any>(data.list, this.dataList, this.pagedListConfig.keyPropertyName);
    this.isLoading = false;

  }



  async loadMoreRecords()
  {
    if (this.pagedListConfig.pageIndex * this.pagedListConfig.pageSize < this.totalRecordsCount && !this.isLoading)
    {
      this.pagedListConfig.pageIndex++;
      await this.getDataList(this.pagedListConfig.pageIndex, this.pagedListConfig.pageSize);
    }
  }

  async search()
  {
    this.resetView();
    this.entityService.activeEntity = null;
    this.pagedListConfig.pageIndex = 0;
    this.dataList = [];
    await this.getDataList(this.pagedListConfig.pageIndex, this.pagedListConfig.pageSize);

  }
  // --------------------------
  //Selection
  isSelected(item: Contact): boolean { return this.entityService.selectedItems.includes(item); }
  onCheckboxChange(event: MatCheckboxChange, item: Contact)
  {
    if (event.checked)
    {
      this.onSelect(item);
    } else
    {
      this.onRemoveFromSelection(item);
    }

  }

  onSelect(item: Contact)
  {
    this.entityService.selectedItems.push(item);
  }

  onRemoveFromSelection(item: Contact)
  {
    this.entityService.selectedItems = this.entityService.selectedItems.filter(x => x.id != item.id);
  }
  activeAppointments(item: Contact)
  {
    return item.appointments.filter(x => x.statusFlag == this.config.TEAM_APPOINTMENT_STATUS_APPOINTED);
  }
  
  onOpenTeamDialog() {
    const dialogConfig = new MatDialogConfig();
    
    // dialogConfig.panelClass = 'mcv-fullscreen-dialog';
    dialogConfig.autoFocus = true;

    const _dialogRef = this.dialog.open(TeamsComponent, dialogConfig);
    _dialogRef.afterClosed().subscribe(res => {
    });
  }

  onEditDocumentCategory() {
    const _dialogConfig = new MatDialogConfig();
    _dialogConfig.autoFocus = true;
    _dialogConfig.panelClass = 'mcv-fullscreen-dialog';

    const _dialogRef = this.contactTeamService.openDialog(ContactTeamDocumentsCategoryEditComponent, _dialogConfig);
    _dialogRef.afterClosed().subscribe(res => {

    });
  }

  refreshFilters() {
    this.pagedListConfig.showAll = false;
    this.typeFC.reset();
    this.statusFC.reset();
    this.searchFC.reset();
    this.pagedListConfig.filters = this.pagedListConfig.filters.filter(x => x.key !== this.showAllFilterKey);
    this.pagedListConfig.filters = this.defaultFilters;
    this.getDataList(this.pagedListConfig.pageIndex, this.pagedListConfig.pageSize);
  }

  openPhotoDialog(member: any ) {
            this.dialog.open(ContactPhotoNameDialogComponent, {
              data: member
            });
          }
}

