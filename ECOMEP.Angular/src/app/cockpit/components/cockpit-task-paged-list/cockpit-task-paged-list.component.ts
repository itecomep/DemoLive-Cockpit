import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CockpitTaskListItemComponent } from '../cockpit-task-list-item/cockpit-task-list-item.component';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { WFTask } from 'src/app/wf-task/models/wf-task.model';
import { PagedListConfig } from 'src/app/shared/models/paged-list-config.model';
import { firstValueFrom, Subscription } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { WFTaskApiService } from 'src/app/wf-task/services/wf-task-api.service';

@Component({
  selector: 'app-cockpit-task-paged-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLinkActive,
    RouterLink,
    CockpitTaskListItemComponent
  ],
  templateUrl: './cockpit-task-paged-list.component.html',
  styleUrls: ['./cockpit-task-paged-list.component.scss']
})
export class CockpitTaskPagedListComponent implements OnInit, OnDestroy {
  @Input() openAsDialog: boolean = false;
  @Input() showTaskStatus: boolean = false;
  @Output() taskClick = new EventEmitter<WFTask>();
  protected pagedListConfig: PagedListConfig = new PagedListConfig();

  @Input('config') set configValue(value: PagedListConfig) {
    if (value) {
      this.pagedListConfig = value;
      console.log('pagedListConfig', this.pagedListConfig);
      this.refresh();
    }
  }

  $refreshTrigger!: Subscription;
  dataList: any[] = [];
  isLoading: boolean = false;
  totalRecordsCount = 0;
  totalPages = 0;

  @Output() listLoad = new EventEmitter<any>();


  constructor(
    private router: Router,
    private utilityService: UtilityService,
    private entityService: WFTaskApiService
  ) {
  }

  ngOnInit() {
    // console.log('base paged list init');

    this.$refreshTrigger = this.entityService.triggerListRefresh.subscribe((value) => {
      if (value) {
        setTimeout(() => {
          this.refresh();
        });
      }
    });
  }

  ngOnDestroy() {
    this.$refreshTrigger.unsubscribe();
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
    this.listLoad.emit({ totalRecordsCount: this.totalRecordsCount });
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
    this.pagedListConfig.pageIndex = 0;
    this.dataList = [];
    // console.log('onSearch', this.pagedListConfig);
    await this.getDataList(this.pagedListConfig.pageIndex, this.pagedListConfig.pageSize);
  }
  async refresh() {
    // this.searchKey = null;
    // this.filters = [];
    // this.sort = null;
    // console.log('onRefresh', this.pagedListConfig);
    this.dataList = [];
    await this.getDataList(this.pagedListConfig.pageIndex, this.pagedListConfig.pageSize);
  }

  async reload() {
    await this.getDataList(this.pagedListConfig.pageIndex, this.pagedListConfig.pageSize);
  }

  onTaskClick(task: WFTask) {
    // if(this.openAsDialog)
    this.taskClick.emit(task);
    // else
    // this.openRoute();
  }

  openRoute(routeCommand: string) {
    this.router.navigate([routeCommand]);
  }

  isDelayed(item: WFTask): boolean {
    const due = new Date(item.dueDate);
    const now = new Date();

    if (item && item.statusFlag != 1 && due <= now) {
      return true;
    }
    return false;
  }

  isForToday(item: WFTask): boolean {
    const _taskDue = new Date(item.dueDate);
    _taskDue.setHours(0, 0, 0, 0);
    const _today = new Date();
    _today.setHours(0, 0, 0, 0);
    const _tomorrow = new Date(_today);
    _tomorrow.setDate(_tomorrow.getDay() + 1);

    if (item && item.statusFlag != 1 && _taskDue.getTime() == _today.getTime()) {
      return true;
    }
    return false;
  }
}
