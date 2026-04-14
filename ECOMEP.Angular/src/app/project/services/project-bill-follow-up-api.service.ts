import { Injectable } from "@angular/core";
import { McvBaseApiService } from "src/app/shared/services/mcv-base-api.service";

@Injectable({
  providedIn: 'root'
})
export class ProjectBillFollowUpApiService extends McvBaseApiService
{
  override apiRoute = this.config.apiProjectBillFollowUp;
  constructor()
  {
    super();
  }

  get isPermissionView(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_BILL_FOLLOW_UP_VIEW,
    ]);
  }

  override get isPermissionEdit(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.PROJECT_BILL_FOLLOW_UP_EDIT,
    ]);
  }
}
