import { Injectable } from '@angular/core';
import { McvBaseApiService } from 'src/app/shared/services/mcv-base-api.service';

@Injectable({
  providedIn: 'root'
})
export class AssetAttachmentApiService extends McvBaseApiService
{

  override apiRoute: string = this.config.apiAssetAttachment;

  constructor()
  {
    super()
  }
}
