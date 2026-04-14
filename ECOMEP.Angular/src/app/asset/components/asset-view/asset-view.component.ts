import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { McvFileComponent } from 'src/app/mcv-file/components/mcv-file/mcv-file.component';
import { HeaderComponent } from 'src/app/mcv-header/components/header/header.component';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { AssetFileComponent } from '../asset-file/asset-file.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, firstValueFrom } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { PagedListConfig } from 'src/app/shared/models/paged-list-config.model';
import { StatusMaster } from 'src/app/shared/models/status-master-dto';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { StatusMasterService } from 'src/app/shared/services/status-master.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Asset } from '../../models/asset';
import { AssetApiService } from '../../services/asset-api.service';
import { AssetAttributeMasterApiService } from '../../services/asset-attribute-master-api.service';
import { AssetCategoryMasterComponent } from '../asset-category-master/asset-category-master.component';
import { AssetScheduleListComponent } from '../asset-schedule-list/asset-schedule-list.component';
import { AssetUpdateComponent } from '../asset-update/asset-update.component';
import { AuthService } from 'src/app/auth/services/auth.service';
import { AppPermissions } from 'src/app/app.permissions';
import { AppService } from 'src/app/shared/services/app.service';
import { FilterToggleDirective } from 'src/app/shared/directives/filter-toggle.directive';
import { McvActivityListComponent } from "src/app/mcv-activity/components/mcv-activity-list/mcv-activity-list.component";

@Component({
  selector: 'app-asset-view',
  standalone: true,
  imports: [
    CommonModule,
 
    FormsModule,
    ReactiveFormsModule,
    FooterComponent,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSelectModule,
    MatOptionModule,
    HeaderComponent,
    McvFileComponent,
    //Components
    AssetFileComponent,
    MatTooltipModule,
    FilterToggleDirective,
    McvActivityListComponent
],
  templateUrl: './asset-view.component.html',
  styleUrls: ['./asset-view.component.scss'],
})
export class AssetViewComponent {

  dialog = inject(MatDialog);
  config = inject(AppConfig);
  assetService = inject(AssetApiService);
  utilityService = inject(UtilityService);
  statusMasterService = inject(StatusMasterService);
  appSettingService = inject(AppSettingMasterApiService);
  assetAttributeMasterService = inject(AssetAttributeMasterApiService);
  permissions = inject(AppPermissions);
  authService = inject(AuthService);
  appService = inject(AppService);

  isMobileFilterOpen = false;

  statusFC = new FormControl<any>(null);
  headerTitle: string = 'Assets';
  selectedTabIndex = 0;
  totalRecordsCount = 0;
  totalComponentCostCount = 0
  totalPages = 0;
  selectedConfig: PagedListConfig = new PagedListConfig({
    searchKey: null,
    sort: 'modifieddate desc',
    showAll: false,
    showAssigned: false,
    filters: [],
    route: "",
    pageSize: 50,
    groupBy: [],
    keyPropertyName: "id",
    pageIndex: 0
  });
  selectedAsset?: Asset;
  statusOptions: StatusMaster[] = []
  searchFC = new FormControl<any>(null);
  categoryOptions: string[] = [];
  dataList: Asset[] = [];
  total:Asset=new Asset();
  allComponentsList:any[]=[]
  readonly ASSET_STATUS_FLAG_INUSE = this.config.ASSET_STATUS_FLAG_INUSE;
  readonly ASSET_STATUS_FLAG_DISCARDED = this.config.ASSET_STATUS_FLAG_DISCARDED;
  readonly ASSET_STATUS_FLAG_FORREPAIRS = this.config.ASSET_STATUS_FLAG_FORREPAIRS;
  get imagesAttachments() { return this.selectedAsset?.attachments.filter(x => x.typeFlag == this.config.ASSET_ATTACHMENT_TYPEFLAG_IMAGE) || [] }
  get otherAttachments() { return this.selectedAsset?.attachments.filter(x => x.typeFlag == this.config.ASSET_ATTACHMENT_TYPEFLAG_OTHER) || [] }
  get assetAttributeMasterList() { return this.assetAttributeMasterService.assetAttributeMasterList }
  get purchasedBy() { return this.selectedAsset?.vendors.filter(x => x.title == 'Purchased From') || [] }
  get maintainBy() { return this.selectedAsset?.vendors.filter(x => x.title == 'Maintenance By') || [] }
  get users() { return this.selectedAsset?.vendors.filter(x => x.title == 'User') || [] }
  get isMobileView(){return this.utilityService.isMobileView}
  get isPermissionMaster() {
    return this.authService.isInAnyRole([
      this.permissions.ASSET_ATTRIBUTE_MASTER
    ]);
  }
  get isPermissionDelete() {
    return this.authService.isInAnyRole([
      this.permissions.ASSET_DELETE
    ]);
  }
  get isPermissionEdit() {
    return this.authService.isInAnyRole([
      this.permissions.ASSET_EDIT
    ]);
  }
  get isPermissionMaintenanceEdit() {
    return this.authService.isInAnyRole([
      this.permissions.ASSET_MAINTENANCE_EDIT
    ]);
  }
  async ngOnInit()
  {
     this.getMasterAttributes();
     this.statusOption();
    this.searchFC.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(res =>
      {
        this.selectedConfig.searchKey = res;
        this.refresh();
      });

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
            this.selectedConfig.filters = this.selectedConfig.filters.filter(i => i.key !== "statusFlag");
            value.forEach((element: StatusMaster) =>
            {
              this.addFilter('statusFlag', element.value.toString());
            });
            this.refresh();
          }
        }
      );
    
    this.appService.getMobileFilterStatus().subscribe((value) => {
      this.isMobileFilterOpen = value;
    });
    
    this.refresh();
  }

  currentCategory?:string;
  onSelectedTabIndexChange(event: any)
  {
    this.currentCategory = this.categoryOptions[event];
    this.selectedAsset = undefined;
    this.selectedConfig.filters = this.selectedConfig.filters.filter(i => i.key !== "category");
    this.addFilter('category', this.currentCategory);
    this.refresh();
    // this.onRefresh();
  }

  getDataList()
  {
    this.assetService.getPages(
      this.selectedConfig.pageIndex,
      this.selectedConfig.pageSize,
      this.selectedConfig.filters,
      this.selectedConfig.searchKey,
    ).subscribe(res =>
    {
      this.totalRecordsCount = res.total;
      this.totalPages = res.pages;
      this.dataList = res.list;
      this.total=new Asset(
        {
          cost: this.dataList.reduce((a, b) => a + b.cost, 0),
          quantity: this.dataList.reduce((a, b) => a + b.quantity, 0),
        }
      );
    })
  }

  onRefresh()
  {
    this.dataList = [];
    this.searchFC.setValue('', { emitEvent: false });
    this.selectedConfig.searchKey = '';
    this.selectedAsset = undefined;
    this.getDataList();
  }

  refresh()
  {
    this.dataList = [];
    this.getDataList();

  }

  async onShowAssetDetails(asset: Asset)
  {
    this.selectedAsset = await firstValueFrom(this.assetService.getById(Number(asset.id)));
    this.showComponents()
  }
  
  showComponents() {
    if (this.selectedAsset && this.selectedAsset.schedules) {
        this.allComponentsList = [];
        this.selectedAsset.schedules.forEach(schedule => {
            // Filter components where isDeleted is false before concatenating
            const validComponents = schedule.components.filter(component => !component.isDeleted);
            this.allComponentsList = this.allComponentsList.concat(validComponents);
        });
    }
    this.getTotalCost();
}

  getTotalCost(){
    this.totalComponentCostCount = 0
    this.totalComponentCostCount =  this.allComponentsList.reduce((acc, obj) => acc + obj.cost , 0);

  }
  onEditAsset()
  {
    const _dialogConfig = new MatDialogConfig();
    _dialogConfig.data = {
      entity: this.selectedAsset
    }
    _dialogConfig.autoFocus = true;
    _dialogConfig.disableClose = true;
    _dialogConfig.panelClass = 'mcv-fullscreen-dialog';

    const _dialogRef = this.dialog.open(AssetUpdateComponent, _dialogConfig);
    _dialogRef.afterClosed().subscribe(res =>
    {
      if (res)
      {
        let _asset = this.dataList.find(x => x.id == res.id);
        _asset = Object.assign(_asset ?? {}, res);
      }
    });
  }

  async onDeleteAsset()
  {
    if (this.selectedAsset)
    {
      this.utilityService.showConfirmationDialog(`Do you want to delete asset ${this.selectedAsset.code}?`, async () =>
      {
        this.dataList = this.dataList.filter(x => x.id !== this.selectedAsset?.id);
        await firstValueFrom(this.assetService.delete(this.selectedAsset ? this.selectedAsset.id : 0));
        this.onCloseAsset();
      });
    }
  }

  handlePageEvent(e: PageEvent)
  {
    this.selectedConfig.pageSize = e.pageSize;
    this.selectedConfig.pageIndex = e.pageIndex;
    if (this.selectedConfig)
    {
      this.refresh();
    }
  }

  onCloseAsset()
  {
    this.selectedAsset = undefined;
  }

  async getMasterAttributes()
  {
    if (!this.appSettingService.presets || this.appSettingService.presets.length == 0)
    {
      await this.appSettingService.loadPresets();
    } 
      const _options = this.appSettingService.presets
        .find(x => x.presetKey == this.config.PRESET_ASSET_CATEGORY_OPTIONS)?.presetValue;
      if (_options)
      {
        this.categoryOptions = _options.split(',');
      }
      this.selectedConfig.filters=[{ key: 'category', value: this.categoryOptions[0] }];
  }

  onUpdateMaster()
  {
    const _dialogConfig = new MatDialogConfig();
    _dialogConfig.autoFocus = true;
    _dialogConfig.disableClose = true;
    // _dialogConfig.panelClass = 'mcv-fullscreen-dialog';

    const _dialogRef = this.dialog.open(AssetCategoryMasterComponent, _dialogConfig);
    _dialogRef.afterClosed().subscribe(res =>
    {
      if (res?.categoryUpdated) {
        this.getMasterAttributes();
      }
    });
  }

  showFirst(count:number ,asset: Asset)
  {
    if (asset && asset.attributes && asset.attributes.length > 0)
    {
      const _attri = asset.attributes.slice(0, 5);
      return _attri;
    } else
    {
      return [];
    }
  }

  hasImage(asset: Asset)
  {
    if (asset && asset.attachments)
    {
      const _images = asset.attachments.filter(x => x.typeFlag == 0 && this.utilityService.getFileMediaType(x.filename) == 'image');
      if (_images && _images.length > 0)
      {
        return _images[0].url || _images[0].thumbUrl;
      } else
      {
        return '';
      }
    } else
    {
      return '';
    }
  }

  private addFilter(key: string, value: string)
  {
    const _filter = this.selectedConfig.filters.find(obj =>
    {
      return obj.key === key && obj.value === value;
    });
    if (!_filter)
    {
      this.selectedConfig.filters.push({ key: key, value: value });
    }
  }

  async statusOption()
  {
    if (!this.statusOptions.length)
    {
      this.statusOptions = await firstValueFrom(this.statusMasterService.get([{ key: 'Entity', value: this.config.NAME_OF_ENTITY_ASSET }]));
      this.assetService.assetStatusOptions = this.statusOptions;
      const _statusValue = this.statusOptions.filter(x => x.value === this.ASSET_STATUS_FLAG_INUSE);
      this.statusFC.setValue(_statusValue, { emitEvent: false });
      _statusValue.forEach(x =>
      {
        this.selectedConfig.filters.push({ key: 'statusFlag', value: x.value.toString() });
      });
    }
  }

  onExportReport(reportName: string, size: string = 'a4', output: 'PDF' | 'EXCELOPENXML' = 'PDF')
  {
    this.assetService.exportReport(reportName, size, output, this.selectedConfig.filters, this.selectedConfig.searchKey, this.selectedConfig.sort);
  }

  onExportDetail(obj:Asset){
    this.assetService.exportDetail(obj.id);
  }

  onExportExcel(category:string='')
  {
    this.assetService.exportExcel(category,this.selectedConfig.filters,this.selectedConfig.searchKey,this.selectedConfig.sort);
  }

  onMaintainanceSchedule() {
    const _dialogConfig = new MatDialogConfig();
    _dialogConfig.disableClose = true;
    _dialogConfig.autoFocus = true;
    if (this.isMobileView) {
      _dialogConfig.panelClass = 'mcv-fullscreen-dialog';
    }
    _dialogConfig.data = {
      asset: this.selectedAsset,
      schedules: this.selectedAsset?.schedules
    }

    const _dialogRef = this.dialog.open(AssetScheduleListComponent, _dialogConfig);
    _dialogRef.afterClosed().subscribe(res => {

    });
  }

  // onIssue() {
  //   const _dialogConfig = new MatDialogConfig();
  //   _dialogConfig.disableClose = true;
  //   _dialogConfig.autoFocus = true;
  //   if (this.isMobileView) {
  //     _dialogConfig.panelClass = 'mcv-fullscreen-dialog';
  //   }
  //   _dialogConfig.data = {
  //     asset: this.selectedAsset,
  //     schedules: this.selectedAsset?.schedules
  //   }
  //   // console.log('this.selectedAsset',this.selectedAsset);
  //   const _dialogRef = this.dialog.open(AssetIssueListComponent, _dialogConfig);
  //   _dialogRef.afterClosed().subscribe(res => {

  //   });
  // }
}
