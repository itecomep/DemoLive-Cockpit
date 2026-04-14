
import { Injectable } from "@angular/core";
import { McvBaseApiService } from "./mcv-base-api.service";

@Injectable({
  providedIn: 'root'
})
export class StatusMasterService extends McvBaseApiService
{

  override apiRoute = this.config.apiStatusMasters;
  constructor()
  {
    super();
  }
}