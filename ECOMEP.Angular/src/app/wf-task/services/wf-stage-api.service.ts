import { Injectable } from "@angular/core";
import { McvBaseApiService } from "../../shared/services/mcv-base-api.service";

@Injectable({
  providedIn: 'root'
})
export class WfStageApiService extends McvBaseApiService
{

  override apiRoute = this.config.apiWFStages;
  constructor()
  {
    super();
  }

}
