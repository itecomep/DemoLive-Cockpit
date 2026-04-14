import { Injectable } from '@angular/core';
import { McvBaseApiService } from 'src/app/shared/services/mcv-base-api.service';

@Injectable({
  providedIn: 'root'
})
export class AssetVendorApiService extends McvBaseApiService
{

  protected override apiRoute: string = this.config.apiAssetVendor;

  constructor()
  {
    super();
  }
}

