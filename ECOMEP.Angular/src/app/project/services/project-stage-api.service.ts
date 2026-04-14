import { Injectable } from '@angular/core';
import { McvBaseApiService } from 'src/app/shared/services/mcv-base-api.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectStageApiService extends McvBaseApiService {

  override apiRoute = this.config.apiProjectStage;

  constructor() {
    super();
  }

  get isPermissionView(): boolean { return true }

  get PROJECT_STAGE_STATUS_FLAG_PENDING() { return this.config.PROJECT_STAGE_STATUS_FLAG_PENDING; }
  get PROJECT_STAGE_STATUS_FLAG_COMPLETED() { return this.config.PROJECT_STAGE_STATUS_FLAG_COMPLETED; }
  get PROJECT_STAGE_STATUS_FLAG_BILLED() { return this.config.PROJECT_STAGE_STATUS_FLAG_BILLED; }

  get PROJECT_STAGE_TYPE_FLAG_WORK() { return this.config.PROJECT_STAGE_TYPE_FLAG_WORK; }
  get PROJECT_STAGE_TYPE_FLAG_PAYMENT() { return this.config.PROJECT_STAGE_TYPE_FLAG_PAYMENT; }

}
