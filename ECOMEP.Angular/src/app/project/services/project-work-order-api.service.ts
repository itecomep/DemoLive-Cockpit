import { Injectable } from '@angular/core';
import { McvBaseApiService } from 'src/app/shared/services/mcv-base-api.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectWorkOrderApiService extends McvBaseApiService{

  
  override apiRoute = this.config.apiProjectWorkOrder;

  constructor() {
    super();
  }
}
