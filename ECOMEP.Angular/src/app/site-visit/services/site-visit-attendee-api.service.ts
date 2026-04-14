import { Injectable } from "@angular/core";
import { McvBaseApiService } from "src/app/shared/services/mcv-base-api.service";

@Injectable({
  providedIn: 'root'
})
export class SiteVisitAttendeeApiService extends McvBaseApiService
{

  get SITE_VISIT_ATTENDEE_TYPEFLAG_TO() { return this.config.SITE_VISIT_ATTENDEE_TYPEFLAG_TO; }
  get SITE_VISIT_ATTENDEE_TYPEFLAG_CC() { return this.config.SITE_VISIT_ATTENDEE_TYPEFLAG_CC; }
  override apiRoute = this.config.apiSitevisitAttendee;
  constructor()
  {
    super();
  }
}