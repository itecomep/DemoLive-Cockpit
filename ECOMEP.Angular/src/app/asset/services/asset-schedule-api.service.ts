import { Injectable } from '@angular/core';
import { McvBaseApiService } from 'src/app/shared/services/mcv-base-api.service';

@Injectable({
  providedIn: 'root'
})
export class AssetScheduleApiService extends McvBaseApiService {

    override apiRoute: string = this.config.apiAssetSchedule;

    constructor() {
        super();
    }
}