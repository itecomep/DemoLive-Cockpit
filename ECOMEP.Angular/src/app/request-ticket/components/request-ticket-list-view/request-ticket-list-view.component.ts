import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RequestTicketApiService } from 'src/app/request-ticket/services/request-ticket-api.service';
import { RequestTicketPagedListComponent } from '../request-ticket-paged-list/request-ticket-paged-list.component';
import { PagedListConfig } from 'src/app/shared/models/paged-list-config.model';
import { AppConfig } from 'src/app/app.config';
import { AuthService } from 'src/app/auth/services/auth.service';
import { StatusMasterService } from 'src/app/shared/services/status-master.service';
import { TypeMasterService } from 'src/app/shared/services/type-master.service';
import { debounceTime, distinctUntilChanged, firstValueFrom, Subscription } from 'rxjs';
import { McvComponentConfig } from 'src/app/shared/models/mcv-component-config';
import { StatusMaster } from 'src/app/shared/models/status-master-dto';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ApiFilter } from 'src/app/shared/models/api-filters';
import { TypeMaster } from 'src/app/shared/models/type-master-dto';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { FilterToggleDirective } from '../../../shared/directives/filter-toggle.directive';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { RequestTicketComponent } from '../request-ticket/request-ticket.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { NgIf, NgFor } from '@angular/common';
import { HeaderComponent } from '../../../mcv-header/components/header/header.component';

@Component({
  selector: 'app-request-ticket-list-view',
  templateUrl: './request-ticket-list-view.component.html',
  styleUrls: ['./request-ticket-list-view.component.scss'],
  standalone: true,
  imports: [HeaderComponent, NgIf, MatIconModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, RequestTicketPagedListComponent, RequestTicketComponent, MatButtonModule, MatTooltipModule, FooterComponent, MatSelectModule, NgFor, MatOptionModule, FilterToggleDirective]
})
export class RequestTicketListViewComponent implements OnInit, OnDestroy
{

  @ViewChild(RequestTicketPagedListComponent) protected pagedList!: RequestTicketPagedListComponent;

  protected readonly nameOfEntity = this.config.NAMEOF_ENTITY_REQUEST_TICKET;
  protected readonly defaultRoute = this.config.ROUTE_REQUEST_TICKET_LIST;
  protected readonly defaultSort = 'createdDate desc';
  protected readonly defaultFilters = [
    { key: 'statusFlag', value: '0' },
    { key: 'isreadonly', value: 'false' },
    { key: 'assignerContactID', value: this.authService.currentUserStore ? this.authService.currentUserStore.contact.id.toString() : '0' },
  ];
  protected readonly defaultPageSize: number = 30;

  id: number = 0;
  isLoading: boolean = false;
  searchFish!: string;
  showAll: boolean = false;
  showToday: boolean = false;
  showTodayFilterKey: string = 'rangeend';
  showAssigned: boolean = false;
  sort: string = this.defaultSort;
  filters: ApiFilter[] = this.defaultFilters;
  totalRecordsCount: number = 0;
  totalPages: number = 0;
  currentPage: number = 0;
  pageSize: number = this.defaultPageSize;
  headerTitle: string = '';
  headerTitleCount: number = 0;
  componentConfig!: McvComponentConfig;
  title!: string;
  typeFlagFilterKey: string = 'TypeFlag';
  statusFlagFilterKey: string = 'statusFlag';
  showAllFilterKey = 'assignerContactID';
  isShowList = true;
  isShowDetail = true;

  statusOptions: StatusMaster[] = [];
  statusFC = new FormControl();

  typeOptions: TypeMaster[] = [];
  typeFC = new FormControl();
  searchFC = new FormControl('');

  sortOptions: string[] = [];
  sortFC = new FormControl();

  tagOptions: string[] = [];
  tagFC = new FormControl();


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
  $deleteTrigger!: Subscription;

  get isMobileView(): boolean
  {
    return this.utilityService.isMobileView;
  }
  get isPermissionEdit() { return this.entityService.isPermissionEdit; }
  get isPermissionSpecialShowAll() { return this.entityService.isPermissionSpecialShowAll; }

  constructor(
    private route: ActivatedRoute,
    private entityService: RequestTicketApiService,
    private config: AppConfig,
    private typeMasterService: TypeMasterService,
    private statusMasterService: StatusMasterService,
    private authService: AuthService,
    private utilityService: UtilityService,
    private router: Router
  )
  {
  }

  async ngOnInit()
  {
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
          if (value && value.length > 0)
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
    ).subscribe(x =>
    {
      this.pagedListConfig.searchKey = x;
      //This method is necessary as the
      this.search();
    });

    this.searchFC.reset();
    if (this.entityService)
    {
      this.$deleteTrigger = this.entityService.triggerListDelete.subscribe((value) =>
      {
        if (value)
        {
          setTimeout(() =>
          {
            this.resetView();
          });
        }
      });
    }
    this.statusFC.setValue([0], { emitEvent: false });
  }

  ngOnDestroy(): void
  {
    if (this.$deleteTrigger)
    {
      this.$deleteTrigger.unsubscribe();
    }
  }
  private async getTypeOptions()
  {
    this.typeOptions = await firstValueFrom(this.typeMasterService.get([{ key: 'Entity', value: this.nameOfEntity }]));
  }

  private async getStatusOptions()
  {
    this.statusOptions = await firstValueFrom(this.statusMasterService.get([{ key: 'Entity', value: this.nameOfEntity }]));
  }


  search()
  {

    if (this.pagedList)
    {
      this.pagedList.search();
    }
  }

  resetView()
  {
    this.router.navigate([this.defaultRoute]);
  }
  onShowNewDialog()
  {
    this.entityService.onShowNewDialog();
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
    if (this.pagedList)
    {
      this.pagedList.search();
    }
  }

  onContainerScroll(e: any)
  {
    if ((e.target as Element).scrollHeight <
      (e.target as Element).scrollTop +
      window.innerHeight)
    {

      if (this.pagedList)
      {
        this.pagedList.loadMoreRecords();
      }
    }
  }

  refresh()
  {

    this.pagedListConfig.searchKey = null;
    this.pagedListConfig.sort = this.defaultSort;

    //code to maintain ShowAll filters
    this.pagedListConfig.filters = this.pagedListConfig.filters.filter(x => x.key !== this.showAllFilterKey);
    if (!this.pagedListConfig.showAll)
    {
      this.pagedListConfig.filters = this.defaultFilters;
    }

    // this.typeFC.reset();
    // this.statusFC.reset();
    this.searchFC.reset();
    if (this.pagedList)
    {
      this.pagedList.refresh();
    }
  }

  onListLoad(e: any)
  {
    this.headerTitleCount = e.totalRecordsCount;
  }
  back()
  {
    this.utilityService.locationBack();
  }
}
