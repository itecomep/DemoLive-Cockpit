import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { HeaderComponent } from 'src/app/mcv-header/components/header/header.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AppConfig } from 'src/app/app.config';
import { HolidayMasterComponent } from '../holiday-master/holiday-master.component';
import { ApiFilter } from 'src/app/shared/models/api-filters';
import { PagedListConfig } from 'src/app/shared/models/paged-list-config.model';
import { McvComponentConfig } from 'src/app/shared/models/mcv-component-config';
import { ActivatedRoute, Params, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { debounceTime, distinctUntilChanged, firstValueFrom } from 'rxjs';
import { LeaveApiService } from '../../services/leave-api.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { LeavePagedListComponent } from '../leave-paged-list/leave-paged-list.component';
import { LeaveComponent } from '../leave/leave.component';
import { AuthService } from 'src/app/auth/services/auth.service';
import { FilterToggleDirective } from 'src/app/shared/directives/filter-toggle.directive';
import { McvFilterSidenavComponent } from 'src/app/mcv-header/components/mcv-filter-sidenav/mcv-filter-sidenav.component';
import { TypeMaster } from 'src/app/shared/models/type-master-dto';
import { TypeMasterService } from 'src/app/shared/services/type-master.service';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-leave-list-view',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    RouterLinkActive,
    RouterLink,
    MatOptionModule,
    MatSelectModule,

    //Components
    FooterComponent,
    HeaderComponent,
    LeavePagedListComponent,
    LeaveComponent,
    McvFilterSidenavComponent,

    //Directive
    FilterToggleDirective
  ],
  templateUrl: './leave-list-view.component.html',
  styleUrls: ['./leave-list-view.component.scss']
})
export class LeaveListViewComponent {

  private readonly router = inject(Router);
  private readonly config = inject(AppConfig);
  private readonly dialog = inject(MatDialog);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly utilityService = inject(UtilityService);
  private readonly entityService = inject(LeaveApiService);
  private readonly typeMasterService = inject(TypeMasterService);

  @ViewChild(LeavePagedListComponent) protected pagedList!: LeavePagedListComponent;

  readonly nameOfEntity = this.config.NAMEOF_ENTITY_LEAVE;
  readonly defaultRoute = this.config.ROUTE_LEAVE_LIST;
  readonly defaultSort = "created desc";
  readonly defaultFilters: ApiFilter[] = [
  ];
  readonly defaultKeyPropertyName: string = "id";
  readonly defaultPageSize: number = 30;

  typeFC = new FormControl();
  typeOptions: TypeMaster[] = [];
  title!: string;
  dataList: any[] = [];
  showAllFilterKey: string[] = [
    "ContactID", "teamID"
  ];
  typeFlagFilterKey: string = "TypeFlag";
  statusFlagFilterKey: string = "StatusFlag";

  isShowList: boolean = true;
  isShowDetail: boolean = true;

  isLoading: boolean = false;
  searchFC = new FormControl('');

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

  totalRecordsCount: any;
  totalPages: any;
  currentPage: any;
  pageSize: any;
  headerTitle: any;
  headerTitleCount: any;

  get isPermissionEdit() { return this.entityService.isPermissionEdit }
  get isPermissionDelete() { return this.entityService.isPermissionDelete }
  get isPermissionSpecialEdit() { return this.entityService.isPermissionSpecialEdit }
  get isPermissionLeaveMaster() { return this.entityService.isPermissionLeaveMaster }
  get isMobileView(): boolean {
    return this.utilityService.isMobileView;
  }

  async ngOnInit() {
    if (this.route) {
      this.headerTitle = this.route.snapshot.data["title"];
      // this.appService.setHeaderTitle(this.route.snapshot.data.title);
      this.route.params.subscribe((params: Params) => {
        this.componentConfig = new McvComponentConfig();
        this.componentConfig.isCreateMode = false;
        this.componentConfig.entityID = params["id"];

        const innerWidth = window.innerWidth;
        if (this.componentConfig.entityID) {
          if (innerWidth < this.config.MOBILE_BREAKPOINT_SCREEN_WIDTH) {
            this.isShowList = false;
            this.isShowDetail = true;
          }
        } else {
          if (innerWidth < this.config.MOBILE_BREAKPOINT_SCREEN_WIDTH) {
            this.isShowList = true;
            this.isShowDetail = false;
          }
        }
      });
    }

    if (this.authService.currentUserStore != null) {
      if (this.authService.isTeamLeader) {
        const _team = this.authService.currentUserStore.teams.find(x => x.leaderID == this.authService.currentUserStore?.contact.id);
        if (_team) {
          const _teamFilter = { key: 'teamID', value: _team.id.toString() };
          this.defaultFilters.push(_teamFilter);
        }
      } else {
        this.defaultFilters.push({ key: 'ContactID', value: this.authService.currentUserStore.contact.id.toString() });
      }
    }

    this.searchFC.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(x => {
      this.pagedListConfig.searchKey = x;
      //This method is necessary as the
      this.search();
    });

    await this.getTypeOptions();
    this.typeFC.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((type) => {
        if (type) {
          this.pagedListConfig.filters = this.pagedListConfig.filters.filter(
            (i) => i.key !== this.typeFlagFilterKey
          );
          this.addFilter(this.typeFlagFilterKey, type.value.toString());
          this.search();
        }
      });
  }

  onAddHolidays() {
    const _dialogData = new MatDialogConfig();
    _dialogData.disableClose = true;
    _dialogData.autoFocus = true;

    const _dialog = this.dialog.open(HolidayMasterComponent, _dialogData);
    _dialog.afterClosed().subscribe(res => {
      console.log(res);
    });
  }

  async getDataList(currentPage: number, pageSize: number) {

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

  onContainerScroll(e: any) {
    if (
      (e.target as Element).scrollHeight <
      (e.target as Element).scrollTop + window.innerHeight
    ) {
      if (this.pagedList) {
        this.pagedList.loadMoreRecords();
      }
    }
  }

  async refresh() {
    this.pagedListConfig.searchKey = null;
    // this.pagedListConfig.filters = this.defaultFilters;
    this.pagedListConfig.pageIndex = 0;
    this.searchFC.reset();
    this.dataList = [];
    await this.getDataList(this.pagedListConfig.pageIndex, this.pagedListConfig.pageSize);
  }

  search() {
    if (this.pagedListConfig.filters.find(x => x.key == 'statusFlag' && x.value == '1')) {
      this.pagedListConfig.sort = 'modifieddate desc'
    } else {
      this.pagedListConfig.sort = this.defaultSort;
    }
    if (this.pagedList) {
      this.pagedList.search();
    }
  }

  onToggleShowAll() {
    this.pagedListConfig.showAll = !this.pagedListConfig.showAll;
    this.showAllFilterKey.forEach(y => {
      this.pagedListConfig.filters = this.pagedListConfig.filters.filter(x => x.key !== y);
    });
    if (!this.pagedListConfig.showAll) {
      this.pagedListConfig.filters = this.defaultFilters;
    }
    if (this.pagedList) {
      this.pagedList.search();
    }
  }

  onListLoad(e: any) {
    this.headerTitleCount = e.totalRecordsCount;
  }

  addFilter(key: string, value: string) {
    const _filter = this.pagedListConfig.filters.find((obj) => {
      return obj.key === key && obj.value === value;
    });
    if (!_filter) {
      this.pagedListConfig.filters.push(
        new ApiFilter({ key: key, value: value })
      );
    }
  }

  refreshFilters() {

  }

  back() {
    this.utilityService.locationBack();
  }

  async getTypeOptions() {
    this.typeOptions = await firstValueFrom(
      this.typeMasterService.get([{ key: "Entity", value: this.nameOfEntity }])
    );
  }
}
