import { Injectable } from '@angular/core';
import { McvBaseApiService } from 'src/app/shared/services/mcv-base-api.service';

@Injectable({
  providedIn: 'root'
})
export class ContactWorkOrderPaymentAttachmentApiService extends McvBaseApiService {

  override apiRoute = this.config.apiContactWorkOrderPaymentAttachment;
  constructor() {
    super();
  }
}
