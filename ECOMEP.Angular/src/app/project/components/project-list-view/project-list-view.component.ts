import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { Company } from 'src/app/shared/models/company.model';
import { ProjectApiService } from 'src/app/project/services/project-api.service';

import { firstValueFrom, Subscription } from 'rxjs';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { PagedListConfig } from 'src/app/shared/models/paged-list-config.model';
import { AppConfig } from 'src/app/app.config';
import { StatusMasterService } from 'src/app/shared/services/status-master.service';
import { TypeMasterService } from 'src/app/shared/services/type-master.service';
import { ApiFilter } from 'src/app/shared/models/api-filters';
import { McvComponentConfig } from 'src/app/shared/models/mcv-component-config';
import { StatusMaster } from 'src/app/shared/models/status-master-dto';
import { TypeMaster } from 'src/app/shared/models/type-master-dto';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { FilterToggleDirective } from '../../../shared/directives/filter-toggle.directive';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { ProjectComponent } from '../project/project.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { HeaderComponent } from '../../../mcv-header/components/header/header.component';
import { ProjectCreateComponent } from '../project-create/project-create.component';
import { AppService } from 'src/app/shared/services/app.service';
import { Project } from '../../models/project.model';
import { CompanyApiService } from 'src/app/shared/services/company-api.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AuthService } from 'src/app/auth/services/auth.service';
import { McvFilterSidenavComponent } from 'src/app/mcv-header/components/mcv-filter-sidenav/mcv-filter-sidenav.component';
import { ContactTeam } from 'src/app/contact/models/contact-team.model';
import { ContactTeamApiService } from 'src/app/contact/services/contact-team-api.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProjectTypologyMasterComponent } from '../project-typology-master/project-typology-master.component';
import { ProjectSegmentMasterComponent } from '../project-segment-master/project-segment-master.component';

@Component({
  selector: 'app-project-list-view',
  templateUrl: './project-list-view.component.html',
  styleUrls: ['./project-list-view.component.scss'],
  animations: [
    trigger("toggleTriggerFilters", [
      state("off", style({ transform: "translateX(-100%)", width: "0" })),
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
    HeaderComponent,
    NgIf,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    ProjectComponent,
    MatButtonModule,
    MatTooltipModule,
    FooterComponent,
    MatSelectModule,
    NgFor,
    MatOptionModule,
    RouterLinkActive, RouterLink,
    DatePipe,
    McvFilterSidenavComponent
  ]
})
export class ProjectListViewComponent implements OnInit, OnDestroy {
  dialog = inject(MatDialog);
  readonly nameOfEntity = this.config.NAMEOF_ENTITY_PROJECT;
  readonly defaultRoute = this.config.ROUTE_PROJECT_LIST;
  readonly defaultSort = "code desc";
  readonly defaultFilters: ApiFilter[] = [
    { key: 'statusFlag', value: this.entityService.PROJECT_STATUS_FLAG_INPROGRESS.toString() },
    { key: 'statusFlag', value: this.entityService.PROJECT_STATUS_FLAG_PREPROPOSAL.toString()},
    { key: 'statusFlag', value: this.entityService.PROJECT_STATUS_FLAG_ONHOLD.toString()}
  ];
  readonly defaultKeyPropertyName: string = "id";
  readonly defaultPageSize: number = 30;

  title!: string;
  showAllFilterKey: string = "ContactID";
  typeFlagFilterKey: string = "typeFlag";
  statusFlagFilterKey: string = "statusFlag";

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

  get isMobileView() { return this.utilityService.isMobileView; }
  get isPermissionEdit() { return this.entityService.isPermissionEdit; }
  get isMaster() { return this.authService.currentUserStore ? this.authService.currentUserStore.roles.includes('MASTER') : false }


  categoryOptions: any[] = [];
  categoryFC = new FormControl();
  resetCheckbox: boolean = false;
  typeFlagOptions: any[] = [];

  companyAccountOptions: Company[] = [];
  companyAccountFC = new FormControl();

  teamOptions: ContactTeam[] = [];
  teamFC = new FormControl();

  segmentOptions: string[] = [];
  typologyOptions: string[] = [];
  segmentFC = new FormControl();
  typologyFC = new FormControl();

  sortProjectFC = new FormControl();
  sortProjectOptions: any[] = [
    // { label: 'Code', sortKey: 'code', icon: 'north' },
    // { label: 'Code', sortKey: 'code desc', icon: 'south' },
    // { label: 'Modified', sortKey: 'modified', icon: 'north' },
    // { label: 'Modified', sortKey: 'modified desc', icon: 'south' },
    { label: 'Created', sortKey: 'created', icon: 'north' },
    { label: 'Created', sortKey: 'created desc', icon: 'south' },
    { label: 'Expected CompletionDate', sortKey: 'expectedCompletionDate', icon: 'north' },
    { label: 'Expected CompletionDate', sortKey: 'expectedCompletionDate desc', icon: 'south' },
    // { label: 'Contract CompletionDate', sortKey: 'contractCompletionDate', icon: 'north' },
    // { label: 'Contract CompletionDate', sortKey: 'contractCompletionDate desc', icon: 'south' },
    // { label: 'Inquiry ConvertionDate', sortKey: 'contractCompletionDate', icon: 'north' },
    // { label: 'Inquiry ConvertionDate', sortKey: 'contractCompletionDate desc', icon: 'south' },
  ];
  constructor(
    private appSettingService: AppSettingMasterApiService,
    private config: AppConfig,
    private typeMasterService: TypeMasterService,
    private statusMasterService: StatusMasterService,
    private route: ActivatedRoute,
    private appService: AppService,
    private utilityService: UtilityService,
    private entityService: ProjectApiService,
    private router: Router,
    private companyAccountsService: CompanyApiService,
    private authService: AuthService,
    private contactTeamService: ContactTeamApiService
  ) { }

  async ngOnInit() {
    this.subscribeToRefresh();
    this.subscribeToDelete();
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

    await this.getTypeOptions();
    this.typeFC.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        if (value) {
          this.pagedListConfig.filters = this.pagedListConfig.filters.filter(
            (i) => i.key !== this.typeFlagFilterKey
          );
          value.forEach((element: StatusMaster) => {
            this.addFilter(this.typeFlagFilterKey, element.value.toString());
          });
          this.search();
        }
      });

    await this.getStatusOptions();
    this.statusFC.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        if (value) {
          this.pagedListConfig.filters = this.pagedListConfig.filters.filter(
            (i) => i.key !== this.statusFlagFilterKey
          );
          value.forEach((element: StatusMaster) => {
            this.addFilter(this.statusFlagFilterKey, element.value.toString());
          });
          this.search();
        }
      });

    this.sortFC.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        if (value) {
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
      .subscribe((value) => {
        if (value) {
          this.pagedListConfig.filters = this.pagedListConfig.filters.filter(
            (i) => i.key !== "SearchTag"
          );
          value.forEach((element: any) => {
            this.addFilter("SearchTag", element);
          });
          this.search();
        }
      });

    this.searchFC.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        if (value) {
          this.pagedListConfig.searchKey = value;
          this.search();
        }
      });

    this.searchFC.reset();
    this.appService.setHeaderTitle(this.route.snapshot.data["title"]);
    if (!this.appSettingService.presets || !this.appSettingService.presets.length) {
      await this.appSettingService.loadPresets();
    }
    const _setting = this.appSettingService.presets.find(
      (x) => x.presetKey == this.config.PRESET_CONTACT_CATEGORY_OPTIONS
    );
    if (_setting) {
      this.categoryOptions = _setting.presetValue
        .split(",")
        .map((x) => x.toUpperCase());
    }
    this.categoryFC.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        if (value) {
          // console.log(value);
          this.pagedListConfig.filters = this.pagedListConfig.filters.filter(
            (i) => i.key !== "category"
          );
          value.forEach((element: string) => {
            this.addFilter("category", element);
          });
          this.search();
        }
      });

    await this.getCompanyAccounts();
    this.companyAccountFC.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(
        (value) => {
          if (value) {
            this.pagedListConfig.filters = this.pagedListConfig.filters.filter(i => i.key !== "CompanyID");
            value.forEach((element: Company) => {
              this.addFilter('CompanyID', element.id.toString());
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
            // value.forEach((element: ContactTeam) => {
              this.addFilter('teamID', value.id.toString());
            // });
            this.search();
          }
        }
      );

    await this.getSegmentOptions();
    await this.getTypologyOptions();
    this.segmentFC.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(
        (value) => {
          if (value) {
            this.pagedListConfig.filters = this.pagedListConfig.filters.filter(i => i.key !== "Segment");
            //convert array to comma separated string
            const segment= value.join(',');
            this.addFilter('Segment', segment);
            this.search();
          }
        }
      );

    this.typologyFC.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(
        (value) => {
          if (value) {
            this.pagedListConfig.filters = this.pagedListConfig.filters.filter(i => i.key !== "Typology");
 //convert array to comma separated string
            const segment= value.join(',');
              this.addFilter('Typology', segment); 
            this.search();
          }
        }
      );

    this.sortProjectFC.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe((value) => {
      if (value) {
        this.pagedListConfig.sort = value.sortKey;
        this.search();
      }
    });

    if (!this.authService.isRoleMaster
      && !this.entityService.isPermissionSpecialShowAll
      && this.authService.currentUserStore?.teams
      && this.authService.currentUserStore?.teams.length > 0) {
      this.pagedListConfig.filters.push(...this.authService.currentUserStore?.teams.map(x => new ApiFilter({ key: 'teamID', value: x.id.toString() })));
    }
    await this.getDataList(this.pagedListConfig.pageIndex, this.pagedListConfig.pageSize);

  }
  ngOnDestroy() {
    if (this.$deleteTrigger)
      this.unSubscribeToDelete();

    if (this.$refreshTrigger)
      this.unSubscribeToRefresh();
  }


  resetView() {
    console.log("resetView");
    this.router.navigate([this.defaultRoute]);
  }

  async getTypeOptions() {
    this.typeOptions = await firstValueFrom(this.typeMasterService.get([{ key: "Entity", value: this.nameOfEntity }]));

    const filter = this.defaultFilters.find(x => x.key == this.typeFlagFilterKey);

    if (filter && this.typeOptions.length != 0) {
      this.typeFC.setValue([this.typeOptions.find(x => x.value.toString() == filter.value)], { emitEvent: false });
    }
  }

  async getStatusOptions() {
    this.statusOptions = await firstValueFrom(this.statusMasterService.get([{ key: "Entity", value: this.nameOfEntity }]));

    const filter = this.defaultFilters.filter(x => x.key == this.statusFlagFilterKey);
    if (filter) {
      const _setValues = this.statusOptions.filter(x => filter.some(y => x.value.toString() == y.value));
      if (_setValues) {
        this.statusFC.setValue(_setValues, { emitEvent: false });
      }
    }
  }

  private async getTagOptions() {
    this.tagOptions = await firstValueFrom(this.entityService.getSearchTagOptions());
  }
  private async getCompanyAccounts() {
    this.companyAccountOptions = await firstValueFrom(this.companyAccountsService.get());
  }

  private async getTeamOptions() {
    this.teamOptions = await firstValueFrom(this.contactTeamService.get());
  }
  private async getSegmentOptions() {
    if (!this.appSettingService.presets || !this.appSettingService.presets.length) {
      await this.appSettingService.loadPresets();
    }
    const _setting = this.appSettingService.presets
      .find(x => x.presetKey == this.config.PRESET_PROJECT_SEGMENT_OPTIONS);
    if (_setting) {
      this.segmentOptions = _setting.presetValue.split(',').map(x => x.toUpperCase());
      // this.segmentFC.setValue(this.segmentOptions[0], { emitEvent: false });
    }
  }
  private async getTypologyOptions() {
    if (!this.appSettingService.presets || !this.appSettingService.presets.length) {
      await this.appSettingService.loadPresets();
    }
    const _setting = this.appSettingService.presets
      .find(x => x.presetKey == this.config.PRESET_PROJECT_TYPOLOGY_OPTIONS);
    if (_setting) {
      this.typologyOptions = _setting.presetValue.split(',').map(x => x.toUpperCase());
      // this.segmentFC.setValue(this.segmentOptions[0], { emitEvent: false });
    }
  }

  async refresh() {
    this.pagedListConfig.searchKey = null;
    this.pagedListConfig.sort = this.defaultSort;
    this.pagedListConfig.filters = this.pagedListConfig.filters.filter(
      (x) => x.key !== "isCompany"
    );
    //code to maintain ShowAll filters
    this.pagedListConfig.filters = this.pagedListConfig.filters.filter(
      (x) => x.key !== this.showAllFilterKey
    );
    if (!this.pagedListConfig.showAll) {
      this.pagedListConfig.filters = this.defaultFilters;
    }

    // this.typeFC.reset();
    // this.statusFC.reset();
    this.searchFC.reset();
    this.categoryFC.reset();
    this.tagFC.reset();
    this.dataList = [];
    await this.getDataList(this.pagedListConfig.pageIndex, this.pagedListConfig.pageSize);
  }


  back() {
    this.utilityService.locationBack();
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
  onToggleShowAll() {
    this.pagedListConfig.showAll = !this.pagedListConfig.showAll;
    this.pagedListConfig.filters = this.pagedListConfig.filters.filter(
      (x) => x.key !== this.showAllFilterKey
    );
    if (!this.pagedListConfig.showAll) {
      this.pagedListConfig.filters = this.defaultFilters;
    }
    this.search();
  }

  onContainerScroll(e: any) {
    if (
      (e.target as Element).scrollHeight <
      (e.target as Element).scrollTop + window.innerHeight
    ) {
      this.loadMoreRecords();
    }
  }
  onShowNewDialog() {
    this.entityService.openDialog(ProjectCreateComponent, { data: new Project() }, false);
  }

  //paged-list
  $refreshTrigger!: Subscription;
  private subscribeToRefresh() {
    this.$refreshTrigger = this.entityService.triggerListRefresh.subscribe((value) => {
      if (value) {
        setTimeout(() => {
          this.refresh();
        });
      }
    });
  }
  private unSubscribeToRefresh() {
    this.$refreshTrigger.unsubscribe();
  }

  $deleteTrigger!: Subscription;
  private subscribeToDelete() {
    this.$deleteTrigger = this.entityService.triggerListDelete.subscribe(
      (value) => {
        if (value) {
          setTimeout(() => {
            this.resetView();
          });
        }
      }
    );
  }
  private unSubscribeToDelete() {
    this.$deleteTrigger.unsubscribe();
  }

  dataList: any[] = [];
  isLoading: boolean = false;
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



  async loadMoreRecords() {
    if (this.pagedListConfig.pageIndex * this.pagedListConfig.pageSize < this.totalRecordsCount && !this.isLoading) {
      this.pagedListConfig.pageIndex++;
      await this.getDataList(this.pagedListConfig.pageIndex, this.pagedListConfig.pageSize);
    }
  }

  async search() {
    this.resetView();
    this.entityService.activeEntity = null;
    this.pagedListConfig.pageIndex = 0;
    this.dataList = [];
    await this.getDataList(this.pagedListConfig.pageIndex, this.pagedListConfig.pageSize);
  }
  getStatusColor(item: Project) { return this.entityService.getStatusColor(item.statusFlag); }
  //------------------

  isShowFilters: boolean = false;
  toggleFilters() {
    this.isShowFilters = !this.isShowFilters;
  }


  refreshFilters() {
    this.pagedListConfig.showAll = false;
    // this.typeFC.reset();
    // this.statusFC.reset();
    this.searchFC.reset();
    // this.pagedListConfig.filters = this.pagedListConfig.filters.filter(x => x.key !== this.showAllFilterKey);
    // this.pagedListConfig.filters = this.defaultFilters;
    this.getDataList(this.pagedListConfig.pageIndex, this.pagedListConfig.pageSize);
  }

  openTypologyMasterDialog(){
     const _dialogConfig = new MatDialogConfig();
        _dialogConfig.autoFocus = true;
        _dialogConfig.disableClose = true;
        
    
        const _dialogRef = this.dialog.open(ProjectTypologyMasterComponent, _dialogConfig);
        _dialogRef.afterClosed().subscribe(res => {
        
        });
  }

  openSegmentMasterDialog(){
     const _dialogConfig = new MatDialogConfig();
        _dialogConfig.autoFocus = true;
        _dialogConfig.disableClose = true;
        
    
        const _dialogRef = this.dialog.open(ProjectSegmentMasterComponent, _dialogConfig);
        _dialogRef.afterClosed().subscribe(res => {
        
        });
  }
}
