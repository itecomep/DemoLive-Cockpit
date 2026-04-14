import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription, firstValueFrom } from 'rxjs';
import { PagedListConfig } from 'src/app/shared/models/paged-list-config.model';
import { MeetingApiService } from 'src/app/meeting/services/meeting-api.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MeetingListItemComponent } from '../meeting-list-item/meeting-list-item.component';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { ContactPhotoNameDialogComponent } from 'src/app/shared/components/contact-photo-name-dialog/contact-photo-name-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-meeting-paged-list',
  templateUrl: './meeting-paged-list.component.html',
  styleUrls: ['./meeting-paged-list.component.scss'],
  standalone: true,
  imports: [NgFor, RouterLinkActive, RouterLink, MeetingListItemComponent, NgIf, MatTooltipModule]
})
export class MeetingPagedListComponent implements OnInit, OnDestroy
{
  protected pagedListConfig: PagedListConfig = new PagedListConfig();

  @Input('config') set configValue(value: PagedListConfig)
  {
    if (value)
    {
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

    private utilityService: UtilityService,
    private entityService: MeetingApiService,
    private dialog: MatDialog
  )
  {
  }

  ngOnInit()
  {
    // console.log('base paged list init');

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

  ngOnDestroy()
  {
    this.$refreshTrigger.unsubscribe();
  }


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
    this.listLoad.emit({ totalRecordsCount: this.totalRecordsCount });
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
    this.pagedListConfig.pageIndex = 0;
    this.dataList = [];
    // console.log('onSearch', this.pagedListConfig);
    await this.getDataList(this.pagedListConfig.pageIndex, this.pagedListConfig.pageSize);
  }
  async refresh()
  {
    // this.searchKey = null;
    // this.filters = [];
    // this.sort = null;
    // console.log('onRefresh', this.pagedListConfig);
    this.dataList = [];
    await this.getDataList(this.pagedListConfig.pageIndex, this.pagedListConfig.pageSize);
  }

  async reload()
  {
    await this.getDataList(this.pagedListConfig.pageIndex, this.pagedListConfig.pageSize);
  }

  openPhotoDialog(member: any ) {
          this.dialog.open(ContactPhotoNameDialogComponent, {
            data: member
          });
        }
}

