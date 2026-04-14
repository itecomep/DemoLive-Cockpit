import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogConfig } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { FilterToggleDirective } from 'src/app/shared/directives/filter-toggle.directive';
import { PagedListConfig } from 'src/app/shared/models/paged-list-config.model';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AssetSchedule } from '../../models/asset';
import { AssetScheduleApiService } from '../../services/asset-schedule-api.service';
import { AssetScheduleUpdateComponent } from '../asset-schedule-update/asset-schedule-update.component';

@Component({
  selector: 'app-asset-maintenance',
  standalone: true,
  imports: [ 
    CommonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatPaginatorModule,
    MatButtonModule,

    //Components
    FooterComponent,
    FilterToggleDirective,
    AssetScheduleUpdateComponent],
  templateUrl: './asset-maintenance.component.html',
  styleUrls: ['./asset-maintenance.component.scss']
})
export class AssetMaintenanceComponent {

  config = inject(AppConfig);
  utilityService = inject(UtilityService);
  assetScheduleService = inject(AssetScheduleApiService);

  dataList: any[] = [];
  totalPages: number = 0;
  statusFC = new FormControl();
  searchFC = new FormControl();
  totalRecordsCount: number = 0;
  statusOptions: any[] =
    [
      { label: 'Pending', key: 'statusFlag', value: this.config.ASSET_SCHEDULE_ISSUE_PENDING },
      { label: 'Completed', key: 'statusFlag', value: this.config.ASSET_SCHEDULE_ISSUE_APPROVED },
      { label: 'Verified', key: 'statusFlag', value: this.config.ASSET_SCHEDULE_ISSUE_VERIFIED }
    ];

  pagedListConfig: PagedListConfig = new PagedListConfig({
    searchKey: null,
    filters: [
      { key: 'statusFlag', value: this.config.ASSET_SCHEDULE_ISSUE_PENDING.toString() },
      { key: 'statusFlag', value: this.config.ASSET_SCHEDULE_ISSUE_APPROVED.toString() },
      { key: 'statusFlag', value: this.config.ASSET_SCHEDULE_ISSUE_VERIFIED.toString() },
      { key: 'typeFlag', value: this.config.ASSET_SCHEDULE_MAINTENANCE_TYPEFLAG.toString() },

    ],
    pageSize: 50,
    pageIndex: 0
  });

  readonly ASSET_SCHEDULE_ISSUE_PENDING = this.config.ASSET_SCHEDULE_ISSUE_PENDING;
  readonly ASSET_SCHEDULE_ISSUE_APPROVED = this.config.ASSET_SCHEDULE_ISSUE_APPROVED;
  readonly ASSET_SCHEDULE_ISSUE_VERIFIED = this.config.ASSET_SCHEDULE_ISSUE_VERIFIED;

  get isMobileView() { return this.utilityService.isMobileView }

  ngOnInit() {
    this.refresh();


    this.searchFC.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe((value) => {
        this.pagedListConfig.searchKey = value;
        this.getDataList();
      });

    // this.statusFC.setValue(this.statusOptions[0].value, { emitEvent: false });
    this.statusFC.setValue([this.statusOptions[0].value, this.statusOptions[1].value,this.statusOptions[2].value], { emitEvent: false });
    this.statusFC.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe((res) => {
        console.log('res',res);
       
        this.pagedListConfig.filters = this.pagedListConfig.filters.filter(x => x.key !== 'statusFlag');
        res.forEach((status:any) => {
          this.pagedListConfig.filters.push({ key: 'statusFlag', value: status.toString() });
        });
        this.getDataList();
      });
  }

  refresh() {
    this.dataList = [];
    this.getDataList();
  }

  handlePageEvent(e: PageEvent) {
    this.pagedListConfig.pageSize = e.pageSize;
    this.pagedListConfig.pageIndex = e.pageIndex;
    if (this.pagedListConfig) {
      this.refresh();
    }
  }

  getDataList() {
    this.assetScheduleService.getPages(
      this.pagedListConfig.pageIndex,
      this.pagedListConfig.pageSize,
      this.pagedListConfig.filters,
      this.pagedListConfig.searchKey,
    ).subscribe(res => {
      this.dataList = [];
      this.totalRecordsCount = res.total;
      this.totalPages = res.pages;
      this.dataList = this.utilityService.updatePagedList<AssetSchedule>(res.list, this.dataList, 'id');
      this.dataList.sort((a: any, b: any) => new Date(b.nextScheduleDate).getTime() - new Date(a.nextScheduleDate).getTime());

    });
  }

  onUpdateMaintenance(assetSchedule: AssetSchedule) {
    const _dialogConfig = new MatDialogConfig();
    _dialogConfig.autoFocus = true;
    _dialogConfig.disableClose = true;
    _dialogConfig.data = {
      issue: assetSchedule
    }

    const _dialogRef = this.assetScheduleService.openDialog(AssetScheduleUpdateComponent, _dialogConfig, this.isMobileView);
    _dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        assetSchedule = Object.assign(assetSchedule, res);
      }
    });
  }

}
