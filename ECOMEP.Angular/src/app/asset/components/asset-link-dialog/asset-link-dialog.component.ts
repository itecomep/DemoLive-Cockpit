import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { McvFileComponent } from 'src/app/mcv-file/components/mcv-file/mcv-file.component';
import { AssetFileComponent } from '../asset-file/asset-file.component';
import { distinctUntilChanged, debounceTime, firstValueFrom, forkJoin } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { PagedListConfig } from 'src/app/shared/models/paged-list-config.model';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { Asset, AssetLink } from '../../models/asset';
import { AssetApiService } from '../../services/asset-api.service';
import { AssetAttributeMasterApiService } from '../../services/asset-attribute-master-api.service';
import { AssetLinkApiService } from '../../services/asset-link-api.service';

@Component({
  selector: 'app-asset-link-dialog',
  standalone: true,
  imports: [
      CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatTooltipModule,
    McvFileComponent,
    AssetFileComponent
  ],
  templateUrl: './asset-link-dialog.component.html',
  styleUrls: ['./asset-link-dialog.component.scss']
})
export class AssetLinkDialogComponent {

  dialogData = inject(MAT_DIALOG_DATA);
  config = inject(AppConfig);
  assetService = inject(AssetApiService);
  assetLinkService = inject(AssetLinkApiService);
  appSettingService = inject(AppSettingMasterApiService);
  assetAttributeMasterService = inject(AssetAttributeMasterApiService);

  searchFC = new FormControl<any>(null);
  category = new FormControl<any>(null);
  categoryOptions: string[] = [];
  dataList: Asset[] = [];
  pagedListConfig: PagedListConfig = new PagedListConfig({
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
  selectedAssets: Asset[] = [];
  currentAsset!: Asset;
  selectedAsset?: Asset;

  get imagesAttachments() { return this.selectedAsset?.attachments.filter(x => x.typeFlag == 0) || [] }
  get otherAttachments() { return this.selectedAsset?.attachments.filter(x => x.typeFlag == 1) || [] }

  constructor(
    private dialog: MatDialogRef<AssetLinkDialogComponent>,
  )
  {
    if (this.dialogData)
    {
      this.currentAsset = this.dialogData.currentAsset;
      this.pagedListConfig.filters.push({ key: 'category', value: this.dialogData.currentAsset.category.toString() });
      this.getCategoryOptions();
      this.category.setValue(this.dialogData.currentAsset.category.toString());
      this.getDataList();
    }
  }

  onClose(e: any)
  {
    this.dialog.close();
  }

  ngOnInit(): void
  {
    this.searchFC.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(400)
    ).subscribe(res =>
    {
      // if (res !== '') {
      this.pagedListConfig.searchKey = res;
      this.getDataList();
      // } else {
      //   this.pagedListConfig.searchKey = null;
      // }
    });
  }

  getCategoryOptions()
  {
    const _options = this.appSettingService.presets
      .find(x => x.presetKey == this.config.PRESET_ASSET_CATEGORY_OPTIONS)?.presetValue;
    if (_options)
    {
      this.categoryOptions = _options.split(',');
    }
  }

  getDataList()
  {
    this.assetService.get(
      this.pagedListConfig.filters,
      this.pagedListConfig.searchKey
    ).subscribe(res =>
    {
      this.dataList = res;
    })
  }

  onCategoryChange(event: MatSelectChange)
  {
    this.pagedListConfig.filters = this.pagedListConfig.filters.filter(i => i.key !== "category");
    this.pagedListConfig.filters.push({ key: 'category', value: event.value.toString() });
    this.getDataList();
  }

  onSelectAsset(asset: Asset)
  {
    const _exist = this.selectedAssets.find(x => x.id == asset.id);
    if (_exist)
    {
      this.selectedAssets = this.selectedAssets.filter(x => x.id !== asset.id);
    } else
    {
      this.selectedAssets.push(asset);
    }
  }

  async onSubmit()
  {
    let _request: any[] = [];
    this.selectedAssets.forEach(x =>
    {
      const _assetLink = new AssetLink();
      _assetLink.primaryAssetID = this.currentAsset.id;
      _assetLink.secondaryAssetID = x.id;
      _request.push(this.assetLinkService.create(_assetLink));
    });
    const results = await firstValueFrom(forkJoin(_request));
    this.dialog.close(results);
    this.selectedAssets = [];
    this.selectedAsset = undefined;
  }

  async onShowAssetDetails(asset: Asset)
  {
    this.selectedAsset = await firstValueFrom(this.assetService.getById(asset.id));
  }

  onCloseAsset()
  {
    this.selectedAsset = undefined;
  }

  showFirstFive(asset: Asset)
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
}
