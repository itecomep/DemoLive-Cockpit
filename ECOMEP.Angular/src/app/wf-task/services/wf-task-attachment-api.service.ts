import { Injectable } from "@angular/core";
import { McvBaseApiService } from "src/app/shared/services/mcv-base-api.service";

@Injectable({
  providedIn: 'root'
})
export class WfTaskAttachmentApiService extends McvBaseApiService
{

  override apiRoute = this.config.apiWFTaskAttachments;
  constructor()
  {
    super();
  }

}
