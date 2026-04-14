import { Injectable } from '@angular/core';
import { McvBaseApiService } from 'src/app/shared/services/mcv-base-api.service';
import { AssetAttributeMaster } from '../models/asset-master';

@Injectable({
  providedIn: 'root'
})
export class AssetAttributeMasterApiService extends McvBaseApiService
{

  override apiRoute: string = this.config.apiAssetAttributeMaster;

  constructor()
  {
    super();
  }

  private _assetAttributeMasterList: AssetAttributeMaster[] = [];
  get assetAttributeMasterList() { return this._assetAttributeMasterList; }
  set assetAttributeMasterList(value) { this._assetAttributeMasterList = value; }

  getAttributeMasters(categoryValue: string)
  {
    return this.assetAttributeMasterList.filter(x => x.category.toLowerCase() == categoryValue.toLowerCase());
  }
}
