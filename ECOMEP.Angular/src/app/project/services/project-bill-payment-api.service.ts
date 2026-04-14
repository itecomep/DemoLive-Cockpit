import { Injectable } from '@angular/core';
import { McvBaseApiService } from 'src/app/shared/services/mcv-base-api.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectBillPaymentApiService extends McvBaseApiService
{

  get nameOfEntity() { return this.config.NAME_OF_ENTITY_PROJECT_Bill_PAYMMENT; }
  override apiRoute = this.config.apiProjectBillPayment;

  constructor()
  {
    super();
  }

}
