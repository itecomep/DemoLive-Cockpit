import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { TodoDialogComponent } from 'src/app/todo/components/todo-dialog/todo-dialog.component';
import { TodoApiService } from 'src/app/todo/services/todo-api.service';
import { TodoPagedListComponent } from '../todo-paged-list/todo-paged-list.component';
import { McvComponentDialogConfig } from 'src/app/shared/models/mcv-component-dialog-config';
import { PagedListConfig } from 'src/app/shared/models/paged-list-config.model';
import { AppConfig } from 'src/app/app.config';
import { AuthService } from 'src/app/auth/services/auth.service';
import { StatusMasterService } from 'src/app/shared/services/status-master.service';
import { TypeMasterService } from 'src/app/shared/services/type-master.service';
import { debounceTime, distinctUntilChanged, firstValueFrom, Subscription } from 'rxjs';
import { McvComponentConfig } from 'src/app/shared/models/mcv-component-config';
import { StatusMaster } from 'src/app/shared/models/status-master-dto';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiFilter } from 'src/app/shared/models/api-filters';
import { TypeMaster } from 'src/app/shared/models/type-master-dto';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { FilterToggleDirective } from '../../../shared/directives/filter-toggle.directive';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { TodoComponent } from '../../../todo/components/todo/todo.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../mcv-header/components/header/header.component';
import { TodoCreateDialogComponent } from '../todo-create-dialog/todo-create-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { McvFilterSidenavComponent } from 'src/app/mcv-header/components/mcv-filter-sidenav/mcv-filter-sidenav.component';
import { ContactTeam } from 'src/app/contact/models/contact-team.model';
import { ContactTeamApiService } from 'src/app/contact/services/contact-team-api.service';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-todo-list-view',
  templateUrl: './todo-list-view.component.html',
  styleUrls: ['./todo-list-view.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTooltipModule,
    MatSelectModule,
    MatOptionModule,
    FilterToggleDirective,
    MatDatepickerModule,
    //Components
    TodoComponent,
    HeaderComponent,
    FooterComponent,
    TodoPagedListComponent,
    TodoCreateDialogComponent,
    McvFilterSidenavComponent
  ]
})
export class TodoListViewComponent implements OnInit, OnDestroy {
  @ViewChild(TodoPagedListComponent) protected pagedList!: TodoPagedListComponent;

  protected readonly nameOfEntity = this.config.NAMEOF_ENTITY_TODO;
  protected readonly defaultRoute = this.config.ROUTE_TODO_LIST;
  protected readonly defaultSort = 'duedate desc';
  protected readonly defaultFilters = [
    { key: 'StatusFlag', value: '0' },
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
  statusFlagFilterKey: string = 'StatusFlag';
  showAllFilterKey = 'AssignerContactID';
  isShowList = true;
  isShowDetail = true;

  teamOptions: ContactTeam[] = [];
  teamFC = new FormControl();

  statusOptions: StatusMaster[] = [];
  statusFC = new FormControl();

  typeOptions: TypeMaster[] = [];
  typeFC = new FormControl();
  searchFC = new FormControl('');

  sortOptions: string[] = [];
  sortFC = new FormControl();

  tagOptions: string[] = [];
  tagFC = new FormControl();

  dateFC!: FormGroup;
  
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
  get isMobileView(): boolean {
    return this.utilityService.isMobileView;
  }
  get isPermissionEdit() { return this.entityService.isPermissionEdit; }
  get isPermissionSpecialShowAll() { return this.entityService.isPermissionSpecialShowAll; }
  get isMaster() { return this.authService.currentUserStore ? this.authService.currentUserStore.roles.includes('MASTER') : false }


  constructor(
    private route: ActivatedRoute,
    private entityService: TodoApiService,
    private config: AppConfig,
    private typeMasterService: TypeMasterService,
    private statusMasterService: StatusMasterService,
    private authService: AuthService,
    private utilityService: UtilityService,
    private router: Router,
    private dialog: MatDialog,
    private contactTeamService: ContactTeamApiService
  ) {
    if (this.authService.currentUserStore != null) {
      // //User has masterlogin
      // if (this.authService.isRoleMaster) {
      //   //Default filter, all TODOs are visible
      // }
      //User is a TeamLeader
      if (this.authService.isTeamLeader) {
        const _assignerFilter = { key: 'AssignerContactID', value: this.authService.currentUserStore.contact.id.toString() };
        this.defaultFilters.push(_assignerFilter);
      } else if (!this.authService.isTeamLeader && !this.authService.isRoleMaster) {
        //User is a normal user
        const _assigneeFilter = { key: 'AssigneeContactID', value: this.authService.currentUserStore.contact.id.toString() };
        this.defaultFilters.push(_assigneeFilter);
      }
    }
  }

  async ngOnInit() {
    if(!this.dateFC){
    this.dateFC = new FormGroup({
      start: new FormControl(this.utilityService.getMonthStart()),
      end: new FormControl(this.utilityService.getMonthEnd()),
    });
    }
    if (this.route) {
      this.headerTitle = this.route.snapshot.data['title'];
      // this.appService.setHeaderTitle(this.route.snapshot.data.title);
      this.route.params.subscribe((params: Params) => {
        this.componentConfig = new McvComponentConfig();
        this.componentConfig.isCreateMode = false;
        this.componentConfig.entityID = params['id'];

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

    await this.getTypeOptions();
    this.typeFC.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(
        (value) => {
          if (value) {
            this.pagedListConfig.filters = this.pagedListConfig.filters.filter(i => i.key !== this.typeFlagFilterKey);
            value.forEach((element: StatusMaster) => {
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
        (value) => {
          if (value) {
            this.pagedListConfig.filters = this.pagedListConfig.filters.filter(i => i.key !== this.statusFlagFilterKey);
            value.forEach((element: StatusMaster) => {
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
        (value) => {
          if (value) {
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
        (value) => {
          if (value) {
            this.pagedListConfig.filters = this.pagedListConfig.filters.filter(i => i.key !== "SearchTag");
            value.forEach((element: any) => {
              this.addFilter('SearchTag', element);
            });
            this.search();
          }
        }
      );

    await this.getTeamOptions();
    this.teamFC.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(
        (value) => {
          if (value) {
            this.pagedListConfig.filters = this.pagedListConfig.filters.filter(i => i.key !== "teamID");
            value.forEach((element: ContactTeam) => {
              this.addFilter('teamID', element.id.toString());
            });
            this.search();
          }
        }
      );

    this.searchFC.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(x => {
      this.pagedListConfig.searchKey = x;
      //This method is necessary as the
      this.search();
    });

    this.searchFC.reset();
    if (this.entityService) {
      this.$deleteTrigger = this.entityService.triggerListDelete.subscribe((value) => {
        if (value) {
          setTimeout(() => {
            this.resetView();
          });
        }
      });
    }
    // this.statusFC.setValue(this.statusOptions.find(x => x.value == this.config.TODO_STATUS_FLAG_ACTIVE)?.value, { emitEvent: false });
 
    this.dateFC.valueChanges
    .pipe(debounceTime(400), distinctUntilChanged())
    .subscribe((value) => {
      if (value && value.start && value.end) {
        this.pagedListConfig.filters  = this.pagedListConfig.filters .filter(
          (x) => x.key !== "RangeStart" && x.key != "RangeEnd"
        );
        this.pagedListConfig.filters .push({
          key: "RangeStart",
          value: value.start.toISOString(),
        });
        this.pagedListConfig.filters .push({
          key: "RangeEnd",
          value: value.end.toISOString(),
        });

        this.search();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.$deleteTrigger) {
      this.$deleteTrigger.unsubscribe();
    }
  }
  
  private async getTypeOptions() {
    this.typeOptions = await firstValueFrom(this.typeMasterService.get([{ key: 'Entity', value: this.nameOfEntity }]));
 
    const filter = this.defaultFilters.find(x => x.key == this.typeFlagFilterKey);
    if (filter && this.typeOptions.length != 0)
    {
      this.typeFC.setValue([this.typeOptions.find(x => x.value.toString() == filter.value)], { emitEvent: false });
    }
  }

  private async getTeamOptions() {
    this.teamOptions = await firstValueFrom(this.contactTeamService.get());
  }

  private async getStatusOptions() {
    this.statusOptions = await firstValueFrom(this.statusMasterService.get([{ key: 'Entity', value: this.nameOfEntity }]));
    const filter = this.defaultFilters.filter(x => x.key == this.statusFlagFilterKey);
    if (filter) {
      const _setValues = this.statusOptions.filter(x => filter.some(y => x.value.toString() == y.value));
      if (_setValues) {
        this.statusFC.setValue(_setValues, { emitEvent: false });
      }
    }
  }

  resetView() {
    this.router.navigate([this.defaultRoute]);
  }

  onShowNewDialog() {
    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.panelClass = 'mcv-fullscreen-dialog';
    dialogConfig.autoFocus = true;
   

    const _dialogRef = this.dialog.open(TodoCreateDialogComponent, dialogConfig);
    _dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.entityService.refreshList();
      }
    });
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

  addFilter(key: string, value: string) {
    const _filter = this.pagedListConfig.filters.find((obj) => {
      return obj.key === key && obj.value === value;
    });
    if (!_filter) {
      this.pagedListConfig.filters.push(new ApiFilter({ key: key, value: value }));
    }
  }

  onToggleShowAll() {
    this.pagedListConfig.showAll = !this.pagedListConfig.showAll;
    this.pagedListConfig.filters = this.pagedListConfig.filters.filter(x => x.key !== this.showAllFilterKey);
    if (!this.pagedListConfig.showAll) {
      this.pagedListConfig.filters = this.defaultFilters;
    }
    if (this.pagedList) {
      this.pagedList.search();
    }
  }

  onContainerScroll(e: any) {
    if ((e.target as Element).scrollHeight <
      (e.target as Element).scrollTop +
      window.innerHeight) {

      if (this.pagedList) {
        this.pagedList.loadMoreRecords();
      }
    }
  }

  refresh() {
    this.pagedListConfig.searchKey = null;
    this.pagedListConfig.sort = this.defaultSort;
    //code to maintain ShowAll filters
    this.pagedListConfig.filters = this.pagedListConfig.filters.filter(x => x.key !== this.showAllFilterKey);
    if (!this.pagedListConfig.showAll) {
      this.pagedListConfig.filters = this.defaultFilters;
    }

    this.searchFC.reset();
    if (this.pagedList) {
      this.pagedList.refresh();
    }
  }

  onListLoad(e: any) {
    this.headerTitleCount = e.totalRecordsCount;
  }

  back() {
    this.utilityService.locationBack();
  }

  refreshFilters() {
    this.pagedListConfig.showAll = false;
    this.typeFC.reset();
    this.statusFC.reset();
    this.searchFC.reset();
    this.pagedListConfig.filters = this.pagedListConfig.filters.filter(x => x.key !== this.showAllFilterKey);
    this.pagedListConfig.filters = this.defaultFilters;
    this.pagedList.getDataList(this.pagedListConfig.pageIndex, this.pagedListConfig.pageSize);
  }
}
