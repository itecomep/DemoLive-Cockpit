import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Params, Router, RouterLink, RouterLinkActive } from "@angular/router";
import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";

import { debounceTime, distinctUntilChanged } from "rxjs/operators";

import { ContactApiService } from "src/app/contact/services/contact-api.service";
import { ContactDialogComponent } from "src/app/contact/components/contact-dialog/contact-dialog.component";
import
{
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { ApiFilter } from "src/app/shared/models/api-filters";
import { McvComponentDialogConfig } from "src/app/shared/models/mcv-component-dialog-config";
import { PagedListConfig } from "src/app/shared/models/paged-list-config.model";
import { AppSettingMasterApiService } from "src/app/shared/services/app-setting-master-api.service";
import { AppConfig } from "src/app/app.config";
import { AppService } from "src/app/shared/services/app.service";
import { StatusMasterService } from "src/app/shared/services/status-master.service";
import { TypeMasterService } from "src/app/shared/services/type-master.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { McvComponentConfig } from "src/app/shared/models/mcv-component-config";
import { firstValueFrom, Subscription } from "rxjs";
import { StatusMaster } from "src/app/shared/models/status-master-dto";
import { TypeMaster } from "src/app/shared/models/type-master-dto";
import { FilterToggleDirective } from "../../../shared/directives/filter-toggle.directive";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { FooterComponent } from "../../../shared/components/footer/footer.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatButtonModule } from "@angular/material/button";
import { ContactComponent } from "../contact/contact.component";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { HeaderComponent } from "../../../mcv-header/components/header/header.component";
import { ContactCategoryMasterComponent } from "../contact-category-master/contact-category-master.component";
import { ContactCreateComponent } from "../contact-create/contact-create.component";
import { Contact } from "../../models/contact";
import { CommonModule } from "@angular/common";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { McvFilterSidenavComponent } from "src/app/mcv-header/components/mcv-filter-sidenav/mcv-filter-sidenav.component";
import { ContactPhotoNameDialogComponent } from "src/app/shared/components/contact-photo-name-dialog/contact-photo-name-dialog.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-contact-list-view",
  templateUrl: "./contact-list-view.component.html",
  styleUrls: ["./contact-list-view.component.scss"],
  animations: [
    trigger("toggleTrigger", [
      // We define the 'off' state with a style -- translateX(0%), which does nothing
      state("off", style({ transform: "translateX(100%)", width: "0" })),
      // We define the 'on' state with a style -- move right (on x-axis) by 70%
      state("on", style({ transform: "translateX(0%)" })),
      // We define a transition of on to off (and vice versa) using `<=>`
      transition("on <=> off", [
        // We add the time (in milliseconds) and style of movement with `animate()`
        animate("0.6s ease-in-out"),
      ]),
    ]),
  ],
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    ContactComponent,
    MatButtonModule,
    MatTooltipModule,
    FooterComponent,
    MatSelectModule,
    MatOptionModule,
    FilterToggleDirective,
    RouterLinkActive, RouterLink,
    McvFilterSidenavComponent
  ],
})
export class ContactListViewComponent implements OnInit, OnDestroy
{
  readonly nameOfEntity = this.config.NAMEOF_ENTITY_CONTACT;
  readonly defaultRoute = this.config.ROUTE_CONTACT_LIST;
  readonly defaultSort = "created desc";
  readonly defaultFilters: ApiFilter[] = [
    { key: 'isAppointed', value: 'false' }
  ];
  readonly defaultKeyPropertyName: string = "id";
  readonly defaultPageSize: number = 30;

  title!: string;
  showAllFilterKey: string = "ContactID";
  typeFlagFilterKey: string = "TypeFlag";
  statusFlagFilterKey: string = "StatusFlag";

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
  searchFC = new FormControl("");

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

  get isMobileView(): boolean
  {
    return this.utilityService.isMobileView;
  }
  // $refreshTrigger: Subscription;

  get isPermissionEdit()
  {
    return this.entityService.isPermissionEdit;
  }
  get isPermissionCategoryMaster()
  {
    return this.entityService.isPermissionCategoryMaster;
  }

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
    private dialog: MatDialog
  ) { }

  async ngOnInit()
  {
    if (this.route)
    {
      this.headerTitle = this.route.snapshot.data["title"];
      // this.appService.setHeaderTitle(this.route.snapshot.data.title);
      this.route.params.subscribe((params: Params) =>
      {
        this.componentConfig = new McvComponentConfig();
        this.componentConfig.isCreateMode = false;
        this.componentConfig.entityID = params["id"];

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
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) =>
      {
        if (value)
        {
          this.pagedListConfig.filters = this.pagedListConfig.filters.filter(
            (i) => i.key !== this.typeFlagFilterKey
          );
          value.forEach((element: StatusMaster) =>
          {
            this.addFilter(this.typeFlagFilterKey, element.value.toString());
          });
          this.search();
        }
      });

    await this.getStatusOptions();
    this.statusFC.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) =>
      {
        if (value)
        {
          this.pagedListConfig.filters = this.pagedListConfig.filters.filter(
            (i) => i.key !== this.statusFlagFilterKey
          );
          value.forEach((element: StatusMaster) =>
          {
            this.addFilter(this.statusFlagFilterKey, element.value.toString());
          });
          this.search();
        }
      });
    //  this.statusFC.setValue([0],{onlySelf:true,emitEvent:false,emitModelToViewChange:false,emitViewToModelChange:false});
    // this.getSortOptions();
    this.sortFC.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) =>
      {
        if (value)
        {
          // this.filters = this.filters.filter(i => i.key !== "typeFlag");
          // value.forEach(element => {
          //   this.addFilter('typeFlag', element);
          // });
          // this.search();
        }
      });
    this.getTagOptions();
    this.tagFC.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) =>
      {
        if (value)
        {
          this.pagedListConfig.filters = this.pagedListConfig.filters.filter(
            (i) => i.key !== "SearchTag"
          );
          value.forEach((element: any) =>
          {
            this.addFilter("SearchTag", element);
          });
          this.search();
        }
      });

    this.searchFC.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) =>
      {
        if(value){
        this.pagedListConfig.searchKey = value;
        //This method is necessary as the
        this.search();
        }
      });

    this.searchFC.reset();
    if (this.entityService)
    {
      this.subscribeToDelete();
      this.subscribeToRefresh();
    }
    this.appService.setHeaderTitle(this.route.snapshot.data["title"]);
    await this.getMasterCategoryOptions();
    this.categoryFC.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) =>
      {
        if (value)
        {
          this.pagedListConfig.filters = this.pagedListConfig.filters.filter(
            (i) => i.key !== "category"
          );
          value.forEach((element: string) =>
          {
            this.addFilter("category", element);
          });
          this.search();
        }
      });

    this.isCompanyFC.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) =>
      {
        if (value)
        {
          // console.log(value);
          this.pagedListConfig.filters = this.pagedListConfig.filters.filter(
            (i) => i.key !== "iscompany"
          );

          this.addFilter("iscompany", value.toString());
          this.search();
        }
      });

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
    this.typeOptions = await firstValueFrom(
      this.typeMasterService.get([{ key: "Entity", value: this.nameOfEntity }])
    );
  }

  async getStatusOptions()
  {
    this.statusOptions = await firstValueFrom(
      this.statusMasterService.get([
        { key: "Entity", value: this.nameOfEntity },
      ])
    );
  }

  private async getTagOptions()
  {
    this.tagOptions = await firstValueFrom(
      this.entityService.getSearchTagOptions()
    );
  }
  openContactDialog()
  {
    let _dialogData = new McvComponentDialogConfig();
    _dialogData.dialogTitle = "New Contact";
    const dialogRef = this.entityService.openDialog(
      ContactDialogComponent,
      _dialogData
    );
    dialogRef.afterClosed().subscribe((res) =>
    {
      if (res)
      {
        console.log("onClose", res);
      }
    });
  }

  onClickExportToExcel()
  {
    // this.entityService.exportToExcel(this.pagedListConfig.filters, this.pagedListConfig.searchKey, this.pagedListConfig.sort);
  }

  async refresh()
  {
    this.pagedListConfig.searchKey = null;
    this.pagedListConfig.filters=this.defaultFilters;
    this.pagedListConfig.pageIndex = 0 ;
    this.searchFC.reset();
    this.dataList = [];
    await this.getDataList(this.pagedListConfig.pageIndex, this.pagedListConfig.pageSize);
  }
  onListLoad(e: any)
  {
    this.headerTitleCount = e.totalRecordsCount;
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
      this.pagedListConfig.filters.push(
        new ApiFilter({ key: key, value: value })
      );
    }
  }
  onToggleShowAll()
  {
    this.pagedListConfig.showAll = !this.pagedListConfig.showAll;
    this.pagedListConfig.filters = this.pagedListConfig.filters.filter(
      (x) => x.key !== this.showAllFilterKey
    );
    if (!this.pagedListConfig.showAll)
    {
      this.pagedListConfig.filters = this.defaultFilters;
    }
    this.search();
  }

  onContainerScroll(e: any)
  {
    if (
      (e.target as Element).scrollHeight <
      (e.target as Element).scrollTop + window.innerHeight
    )
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
      filter.push({ key: "id", value: x.id });
    });

    // console.log(filter);
    this.resetCheckbox = true;
    this.entityService.exportAddressTags(filter);
    this.entityService.selectedItems = [];
  }

  onContactAnalysis()
  {
    // const url = this.defaultRoute + '/contact-table';
    // window.open(url);
    this.router.navigate([this.defaultRoute + "/contact-table"]);
  }

  get isSelectedAny(): boolean
  {
    return this.entityService.selectedItems.length > 0;
  }
  get isShowSharePanel(): boolean
  {
    return this.entityService.isShowSharePanel;
  }
  onClickShare()
  {
    this.entityService.isShowSharePanel = !this.entityService.isShowSharePanel;
  }

  onShowNewDialog()
  {
    this.entityService.openDialog(ContactCreateComponent, { data: new Contact() }, false);
  }

  onToggleIsCompanyFilter(isCompany: boolean)
  {
    this.pagedListConfig.filters = this.pagedListConfig.filters.filter(
      (i) => i.key !== "isCompany"
    );
   
      this.addFilter("isCompany", isCompany.toString());
    
    this.search();
  }

  checkIsCompanyFilter(isCompany: string)
  {
    
  return this.pagedListConfig.filters.some(x => x.key === "isCompany" && x.value === isCompany)
   
  }

  private async getMasterCategoryOptions()
  {
    await this.appSettingService.loadPresets();
    const _setting = this.appSettingService.presets
      .find(x => x.presetKey == this.config.PRESET_CONTACT_CATEGORY_OPTIONS);
    if (_setting)
    {
      this.categoryOptions = _setting.presetValue.split(',').map(x => x.toUpperCase());
    }
  }

  onOpenCategoryMaster() {
    const _dialogRef = this.entityService.openDialog(ContactCategoryMasterComponent, {});
    _dialogRef.afterClosed().subscribe(res => {
      if (res) {
        console.log(res);
        this.categoryOptions = res.split(',').map((x: any) => x.toUpperCase());
      }
    })
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
  // --------------------

  refreshFilters() {
    this.pagedListConfig.showAll = false;
    this.typeFC.reset();
    this.statusFC.reset();
    this.searchFC.reset();
    this.pagedListConfig.filters = this.pagedListConfig.filters.filter(x => x.key !== this.showAllFilterKey);
    this.pagedListConfig.filters = this.defaultFilters;
    this.getDataList(this.pagedListConfig.pageIndex, this.pagedListConfig.pageSize);
  }

  onDeleteContact(contact:Contact){
    this.dataList = this.dataList.filter(x => x.id != contact.id);
  }

  openPhotoDialog(member: any ) {
            this.dialog.open(ContactPhotoNameDialogComponent, {
              data: member
            });
          }
}


