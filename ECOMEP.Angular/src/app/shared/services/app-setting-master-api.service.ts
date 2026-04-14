import { Injectable } from "@angular/core";

import { McvBaseApiService } from "./mcv-base-api.service";
import { Observable, firstValueFrom } from "rxjs";
import { PresetMaster } from "../models/preset-master";

@Injectable({
  providedIn: 'root'
})
export class AppSettingMasterApiService extends McvBaseApiService
{

  presets: PresetMaster[] = [];
  override apiRoute = this.config.apiAppSettings;

  constructor()
  {
    super();
  }

  async loadPresets()
  {
    if (!this.presets || this.presets.length == 0)
    {
      this.presets = await firstValueFrom(this.get()) as PresetMaster[];
    }
  }
  getValue(propertyKey: string): Observable<string>
  {
    return this.http.get<string>(this.apiRoute + '/value/' + propertyKey);
  }

  getAppSettingMaster()
  {
    return this.http.get<any>(this.apiRoute);
  }
}
