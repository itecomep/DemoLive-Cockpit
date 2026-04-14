import { Injectable } from "@angular/core";
import { McvBaseApiService } from "src/app/shared/services/mcv-base-api.service";

@Injectable({
  providedIn: 'root'
})
export class MeetingAttendeeApiService extends McvBaseApiService
{

  get MEETING_ATTENDEE_TYPEFLAG_TO() { return this.config.MEETING_ATTENDEE_TYPEFLAG_TO; }
  get MEETING_ATTENDEE_TYPEFLAG_CC() { return this.config.MEETING_ATTENDEE_TYPEFLAG_CC; }
  override apiRoute = this.config.apiMeetingAttendee;
  constructor()
  {
    super();
  }
}
