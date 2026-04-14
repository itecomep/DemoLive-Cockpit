import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { WfTaskPagedListComponent } from '../wf-task-paged-list/wf-task-paged-list.component';
import { WFTaskEntityComponentHostDirective } from '../../directives/taskEntityComponenetHost.directive';
import { ApiFilter } from 'src/app/shared/models/api-filters';
import { TypeMaster } from 'src/app/shared/models/type-master-dto';
import { StatusMaster } from 'src/app/shared/models/status-master-dto';
import { Subscription, debounceTime, distinctUntilChanged, firstValueFrom } from 'rxjs';
import { WFTask } from 'src/app/wf-task/models/wf-task.model';
import { WFTaskApiService } from 'src/app/wf-task/services/wf-task-api.service';
import { TodoComponent } from 'src/app/todo/components/todo/todo.component';
import { PagedListConfig } from 'src/app/shared/models/paged-list-config.model';
import { MeetingComponent } from 'src/app/meeting/components/meeting/meeting.component';
import { MeetingAgendaTaskComponent } from 'src/app/meeting/components/meeting-agenda-task/meeting-agenda-task.component';
import { RequestTicketComponent } from 'src/app/request-ticket/components/request-ticket/request-ticket.component';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { AppConfig } from 'src/app/app.config';
import { AuthService } from 'src/app/auth/services/auth.service';
import { StatusMasterService } from 'src/app/shared/services/status-master.service';
import { TypeMasterService } from 'src/app/shared/services/type-master.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { McvComponentConfig } from 'src/app/shared/models/mcv-component-config';
import { FilterToggleDirective } from '../../../shared/directives/filter-toggle.directive';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { HeaderComponent } from '../../../mcv-header/components/header/header.component';

@Component({
  selector: 'app-wf-task-list-view',
  templateUrl: './wf-task-list-view.component.html',
  styleUrls: ['./wf-task-list-view.component.scss'],
  standalone: true,
  imports: [HeaderComponent, NgIf, MatIconModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, WfTaskPagedListComponent, WFTaskEntityComponentHostDirective, FooterComponent, MatButtonModule, MatTooltipModule, MatSelectModule, NgFor, MatOptionModule, FilterToggleDirective, NgClass]
})
export class WfTaskListViewComponent implements OnInit, OnDestroy
{

  @ViewChild(WfTaskPagedListComponent) pagedList!: WfTaskPagedListComponent;
  @ViewChild(WFTaskEntityComponentHostDirective) taskHost!: WFTaskEntityComponentHostDirective;

  protected readonly nameOfEntity = this.config.NAMEOF_ENTITY_WFTASK;
  protected readonly defaultRoute = this.config.ROUTE_WFTASK_LIST;
  protected readonly defaultSort = 'dueDate';
  protected readonly defaultKeyPropertyName: string = 'id';
  protected readonly defaultPageSize: number = 30;

  protected readonly defaultFilters = [
    { key: 'ContactID', value: '' },
    { key: 'StatusFlag', value: this.config.WFTASK_STATUS_FLAG_PENDING.toString() },
    { key: 'StatusFlag', value: this.config.WFTASK_STATUS_FLAG_PAUSED.toString() },
    { key: 'StatusFlag', value: this.config.WFTASK_STATUS_FLAG_STARTED.toString() },
  ];

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
  headerTitle: string = 'Task List';
  headerTitleCount: number = 0;
  componentConfig!: McvComponentConfig;
  title!: string;
  showAllFilterKey: string = 'ContactID';
  typeFlagFilterKey: string = 'TypeFlag';
  statusFlagFilterKey: string = 'StatusFlag';

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

  entityOptions: any[] = [];
  entityFC = new FormControl();

  loading: boolean = false;

  taskEntityComponent!: any;
  componentMode: boolean = false;
  wfTask!: WFTask;
  $deleteTrigger!: Subscription;

  get isMobileView(): boolean
  {
    return this.utilityService.isMobileView;
  }
  get isPermissionEdit() { return this.entityService.isPermissionEdit; }
  get isPermissionSpecialShowAll() { return this.entityService.isPermissionSpecialShowAll; }

  constructor(
    private appSettingService: AppSettingMasterApiService,
    private route: ActivatedRoute,
    private entityService: WFTaskApiService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private config: AppConfig,
    private typeMasterService: TypeMasterService,
    private statusMasterService: StatusMasterService,
    private utilityService: UtilityService,
    private authService: AuthService,
    private router: Router
  )
  {
    if (this.authService.currentUserStore != null)
    {
      this.defaultFilters[0].value = this.authService.currentUserStore.contact.id.toString();
    }
  }

  async ngOnInit()
  {
    if (this.route)
    {
      // this.headerTitle = this.route.snapshot.data['title'];
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
    if (!this.appSettingService.presets || !this.appSettingService.presets.length)
    {
      await this.appSettingService.loadPresets();
    }

    this.route.params.subscribe((params: Params) =>
    {
      // console.log('on param change', params);
      this.id = params["id"];
      const innerWidth = window.innerWidth;
      if (this.id)
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
      if (this.id)
      {
        this.getTask(this.id);
      }
    });

    this.getEntityOptions();
    this.entityFC.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(
        (value) =>
        {
          this.filters = this.filters.filter(i => i.key !== 'Entity');
          if (value)
          {
            value.forEach((element: any) =>
            {
              this.addFilter('Entity', element);
            });
            this.search();
          }
        }
      );
    if (this.entityService)
    {
      this.$taskComplete = this.entityService.triggerTaskComplete.subscribe((value) =>
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
  $taskComplete!: Subscription;
  ngOnDestroy()
  {
    if (this.$deleteTrigger)
    {
      this.$deleteTrigger.unsubscribe();
    }
    if (this.$taskComplete)
    {
      this.$taskComplete.unsubscribe();
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
  private getEntityOptions()
  {
    this.entityService.getFieldOptions('Entity').subscribe(data =>
    {
      this.entityOptions = (<string[]>data).map(x => { return { key: x, value: x.replace('Mcv', '') }; });
    });
  }

  back()
  {
    this.utilityService.locationBack();
  }

  public getTask(id: number)
  {
    this.entityService.getById(id).subscribe(
      data =>
      {
        this.wfTask = data;
        if (this.wfTask.entity && this.wfTask.entityID)
        {
          this.loadEntity(this.wfTask.entity, this.wfTask.entityID);
        }
      });
  }

  public loadEntity(entity: any, entityID: number)
  {
    this.componentMode = false;
    if (entity === this.config.NAMEOF_ENTITY_TODO)
    {
      this.componentMode = true;
      this.loadComponent(TodoComponent, entityID, this.wfTask);
    }
    else if (entity === this.config.NAMEOF_ENTITY_MEETING)
    {
      this.componentMode = true;
      this.loadComponent(MeetingComponent, entityID, this.wfTask);
    }
    else if (entity === this.config.NAMEOF_ENTITY_MEETING_AGENDA)
    {
      this.componentMode = true;
      this.loadComponent(MeetingAgendaTaskComponent, entityID, this.wfTask);

    }
    else if (entity === this.config.NAMEOF_ENTITY_REQUEST_TICKET)
    {
      this.componentMode = true;
      this.loadComponent(RequestTicketComponent, entityID, this.wfTask);

    }
  }

  private loadComponent(component: any, id: number, task: WFTask)
  {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      component
    );

    const viewContainerRef = this.taskHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);
    this.taskEntityComponent = componentRef.instance;
    this.taskEntityComponent.entityID = id;
    this.taskEntityComponent.isTaskMode = true;
    this.taskEntityComponent.task = task;
    this.taskEntityComponent.refresh();
  }

  onToggleShowToday()
  {
    this.showToday = !this.showToday;
    this.pagedListConfig.filters = this.pagedListConfig.filters.filter(x => x.key !== this.showTodayFilterKey);
    if (!this.showToday)
    {
      this.pagedListConfig.filters = this.defaultFilters;
    } else
    {
      this.pagedListConfig.filters = this.defaultFilters.concat([{ key: this.showTodayFilterKey, value: (new Date).toISOString() }]);
    }
    if (this.pagedList)
    {
      this.pagedList.search();
    }
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

}
