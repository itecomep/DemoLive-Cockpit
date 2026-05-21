import { Injectable } from "@angular/core";
import { McvBaseApiService } from "src/app/shared/services/mcv-base-api.service";

@Injectable({
  providedIn: 'root'
})
export class DepartmentApiService extends McvBaseApiService
{
  override apiRoute = 'http://localhost:5054/Department';

  constructor()
  {
    super();
  }
}