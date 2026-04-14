import { Injectable } from "@angular/core";
import { McvBaseApiService } from "./mcv-base-api.service";

@Injectable({
  providedIn: 'root'
})
export class CompanyApiService extends McvBaseApiService
{
  override apiRoute = this.config.apiCompany;
  constructor()
  {
    super();
  }

}
