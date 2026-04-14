import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

// import { AuthService } from 'src/app/auth/services/auth.service';
// import { ActivityApiService } from 'src/app/services/activity-api.service';

import { ActivityDto } from 'src/app/shared/models/activity-dto';
import { ActivityApiService } from 'src/app/shared/services/activity-api.service';
import { McvActivityListItemComponent } from '../../../mcv-activity/components/mcv-activity-list-item/mcv-activity-list-item.component';
import { NgFor, NgIf } from '@angular/common';

@Component({
    selector: 'app-cockpit-activity',
    templateUrl: './cockpit-activity.component.html',
    styleUrls: ['./cockpit-activity.component.scss'],
    standalone: true,
    imports: [NgFor, McvActivityListItemComponent, NgIf]
})
export class CockpitActivityComponent implements OnInit
{
  @Input() entity: any;
  @Input() taskMode: boolean = false;
  @Input() showAll: boolean = false;

  dataList: ActivityDto[] = [];
  attachmentList: any[] = [];
  totalRecordsCount = 0;
  totalPages = 0;
  pageSize = 20;
  currentPage = 0;


  constructor(
    private service: ActivityApiService,
    private authService: AuthService,
  ) { }

  ngOnInit()
  {
    this.refresh();
  }

  refresh()
  {
    this.getDataList(this.currentPage, this.pageSize, this.showAll, this.entity);

  }

  getDataList(currentPage: number, pageSize: number, showAll: boolean, entity: any)
  {
    let filters: any = [];
    if (!showAll)
    {
      if (this.authService.currentUserStore != null)
      {
        filters = [
          { key: 'ContactID', value: this.authService.currentUserStore.contact.id.toString() },
        ];
      }
    }
    this.service.getPages(currentPage, pageSize, filters).subscribe(
      data =>
      {
        this.totalRecordsCount = data.total;
        this.totalPages = data.pages;

        data.list.forEach((item: any) =>
        {
          this.dataList = this.dataList.filter(obj => obj.id !== item.id);
          this.dataList.push(item);
        });
      }
    );
  }

  loadMoreRecords()
  {
    if (this.currentPage * this.pageSize < this.totalRecordsCount)
    {
      this.currentPage++;
      this.getDataList(this.currentPage, this.pageSize, this.showAll, this.entity);
    }
  }
}
