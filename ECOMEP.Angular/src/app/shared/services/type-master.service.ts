
import { Injectable } from "@angular/core";
import { McvBaseApiService } from "./mcv-base-api.service";

@Injectable({
  providedIn: 'root'
})
export class TypeMasterService extends McvBaseApiService
{

  override apiRoute = this.config.apiTypeMasters;
  constructor()
  {
    super();
  }
}