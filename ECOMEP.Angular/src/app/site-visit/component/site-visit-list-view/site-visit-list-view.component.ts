import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { SitevisitPagedListComponent } from '../site-visit-paged-list/site-visit-paged-list.component';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { SiteVisitApiService } from '../../services/site-visit-api.service';
import { PagedListConfig } from 'src/app/shared/models/paged-list-config.model';
import { debounceTime, distinctUntilChanged, firstValueFrom, Subscription } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ApiFilter } from 'src/app/shared/models/api-filters';
import { McvComponentConfig } from 'src/app/shared/models/mcv-component-config';
import { StatusMaster } from 'src/app/shared/models/status-master-dto';
import { TypeMaster } from 'src/app/shared/models/type-master-dto';
import { AppConfig } from 'src/app/app.config';
import { AuthService } from 'src/app/auth/services/auth.service';
import { StatusMasterService } from 'src/app/shared/services/status-master.service';
import { TypeMasterService } from 'src/app/shared/services/type-master.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { FilterToggleDirective } from '../../../shared/directives/filter-toggle.directive';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

import { SiteVisitComponent } from '../site-visit/site-visit.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { NgIf, NgFor } from '@angular/common';
import { HeaderComponent } from '../../../mcv-header/components/header/header.component';

@Component({
    selector: 'app-site-visit-list-view',
    templateUrl: './site-visit-list-view.component.html',
    styleUrls: ['./site-visit-list-view.component.scss'],
    standalone: true,
    imports: [HeaderComponent, NgIf, MatIconModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, SitevisitPagedListComponent, SiteVisitComponent, MatButtonModule, MatTooltipModule, FooterComponent, MatSelectModule, NgFor, MatOptionModule, FilterToggleDirective]
})
export class SitevisitListViewComponent implements OnInit, OnDestroy
{

  @ViewChild(SitevisitPagedListComponent) pagedList!: SitevisitPagedListComponent;
  readonly nameOfEntity = this.config.NAMEOF_ENTITY_SITE_VISIT;
  readonly defaultRoute = this.config.ROUTE_SITE_VISIT_LIST;
  readonly defaultSort = 'fromDate desc';
  readonly defaultFilters = [
    // { key: 'contactID', value: this.authService.currentUserStore.entity.id.toString() },
    { key: 'contactID', value: this.authService.currentUserStore ? this.authService.currentUserStore.contact.id.toString() : '0' },
    { key: 'isReadOnly', value: 'false' }
  ];
  readonly defaultKeyPropertyName: string = 'id';
  readonly defaultPageSize: number = 30;

  title!: string;
  typeFlagFilterKey: string = 'TypeFlag';
  statusFlagFilterKey: string = 'StatusFlag';
  
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

  componentConfig!: McvComponentConfig;

  isShowList: boolean = true;
  isShowDetail: boolean = true;

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

  get isPermissionEdit() { return this.entityService.isPermissionEdit; }
  get isPermissionSpecialShowAll() { return this.entityService.isPermissionSpecialShowAll; }

  $deleteTrigger!: Subscription;


  showAllFilterKey = 'contactID';


  // get isPermissionEdit(): boolean { return this.entityService.isPermissionEdit; }
  constructor(
    private route: ActivatedRoute,
    private entityService: SiteVisitApiService,
    private config: AppConfig,
    private typeMasterService: TypeMasterService,
    private statusMasterService: StatusMasterService,
    private utilityService: UtilityService,
    private authService: AuthService,
    private router: Router
  )
  { }

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
  }

  ngOnDestroy()
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
  onListLoad(e: any)
  {
    this.headerTitleCount = e.totalRecordsCount;
  }
  back()
  {
    this.utilityService.locationBack();
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

}
