import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagedListConfig } from 'src/app/shared/models/paged-list-config.model';
import { firstValueFrom, Subscription } from 'rxjs';
import { LeaveApiService } from '../../services/leave-api.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RouterModule } from '@angular/router';
import { LeaveListItemComponent } from '../leave-list-item/leave-list-item.component';
import { LeaveSummary } from '../../models/leave-summary.model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ContactPhotoNameDialogComponent } from 'src/app/shared/components/contact-photo-name-dialog/contact-photo-name-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-leave-paged-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTooltipModule,

    //Components
    LeaveListItemComponent
  ],
  templateUrl: './leave-paged-list.component.html',
  styleUrls: ['./leave-paged-list.component.scss']
})
export class LeavePagedListComponent implements OnInit, OnDestroy {
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
  monthlySummary: LeaveSummary[] = [];
  currentMonthSummary?: LeaveSummary;

  @Output() listLoad = new EventEmitter<any>();


  constructor(

    private utilityService: UtilityService,
    private entityService: LeaveApiService,
    private authService: AuthService,
    private dialog: MatDialog
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
    await this.loadMonthlySummary();
    await this.getDataList(this.pagedListConfig.pageIndex, this.pagedListConfig.pageSize);
  }
  async refresh() {
    this.dataList = [];
    await this.loadMonthlySummary();
    await this.getDataList(this.pagedListConfig.pageIndex, this.pagedListConfig.pageSize);
  }

  async loadMonthlySummary() {
    if (this.authService.currentUserStore?.contact?.id) {
        this.monthlySummary = await firstValueFrom(
          this.entityService.getPerMonthSummary(this.authService.currentUserStore.contact.id, 0)
        );
        this.setCurrentMonthSummary();
      } 
  }

  setCurrentMonthSummary() {
    const currentMonth = new Date().getMonth() + 1;
    this.currentMonthSummary = this.monthlySummary.find(s => s.month === currentMonth);
  }

  getCurrentMonthSummary(): LeaveSummary | undefined {
    return this.currentMonthSummary;
  }

  async reload() {
    await this.getDataList(this.pagedListConfig.pageIndex, this.pagedListConfig.pageSize);
  }

  // isDelayed(item: Todo): boolean {
  //   const due = new Date(item.dueDate);
  //   const now = new Date();

  //   if (item && item.statusFlag === 0 && due <= now) {
  //     return true;
  //   }
  //   return false;
  // }

  // isForDelay(item: Todo): boolean {
  //   const due = new Date(item.dueDate);
  //   const now = new Date();
  //   const next = new Date();
  //   next.setDate(next.getDay() + 1);
  //   if (item && item.statusFlag === 0 && due > now && due <= next) {
  //     return true;
  //   }
  //   return false;
  // }
  openPhotoDialog(member: any ) {
            this.dialog.open(ContactPhotoNameDialogComponent, {
              data: member
            });
          }
}
