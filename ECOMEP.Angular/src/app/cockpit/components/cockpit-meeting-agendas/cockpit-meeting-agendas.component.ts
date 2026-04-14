import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeetingAgendaApiService } from 'src/app/meeting/services/meeting-agenda-api.service';
import { PagedListConfig } from 'src/app/shared/models/paged-list-config.model';
import { firstValueFrom, Subscription } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { CockpitMeetingAgendaListItemComponent } from '../cockpit-meeting-agenda-list-item/cockpit-meeting-agenda-list-item.component';
import { MeetingAgenda } from 'src/app/meeting/models/meeting-agenda.model';

@Component({
  selector: 'app-cockpit-meeting-agendas',
  standalone: true,
  imports: [
    CommonModule,
    CockpitMeetingAgendaListItemComponent
  ],
  templateUrl: './cockpit-meeting-agendas.component.html',
  styleUrls: ['./cockpit-meeting-agendas.component.scss']
})
export class CockpitMeetingAgendasComponent {

  readonly entityService = inject(MeetingAgendaApiService);
  readonly utilityService = inject(UtilityService);

  dataList: any[] = [];
  $refreshTrigger!: Subscription;
  isLoading: boolean = false;
  totalRecordsCount = 0;
  totalPages = 0;
  protected pagedListConfig: PagedListConfig = new PagedListConfig();

  @Input('config') set configValue(value: PagedListConfig) {
    if (value) {
      this.pagedListConfig = value;
      console.log('pagedListConfig', this.pagedListConfig);
      this.refresh();
    }
  }

  @Output() listLoad = new EventEmitter<any>();

  async refresh() {
    // this.searchKey = null;
    // this.filters = [];
    // this.sort = null;
    // console.log('onRefresh', this.pagedListConfig);
    this.dataList = [];
    await this.getDataList(this.pagedListConfig.pageIndex, this.pagedListConfig.pageSize);
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

  onResolved(agenda: MeetingAgenda) {
    console.log(agenda);
    this.dataList = this.dataList.filter(x => x.id !== agenda.id);
    this.utilityService.showSwalToast('', 'Successfully Updated!', 'success');
  }
}
