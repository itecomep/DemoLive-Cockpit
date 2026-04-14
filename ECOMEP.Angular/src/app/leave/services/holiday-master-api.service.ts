import { Injectable } from "@angular/core";
import { McvBaseApiService } from "src/app/shared/services/mcv-base-api.service";

@Injectable({
  providedIn: 'root'
}) export class HolidayMasterService extends McvBaseApiService {
  override apiRoute = this.config.apiHolidayMaster;
  constructor() {
    super();
  }

  get isPermissionHolidayMaster(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.LEAVE_HOLIDAY_MASTER
    ]);
  }
}
