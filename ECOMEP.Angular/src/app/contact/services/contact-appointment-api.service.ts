import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { McvBaseApiService } from "src/app/shared/services/mcv-base-api.service";

@Injectable({
  providedIn: 'root'
})
export class ContactAppointmentApiService extends McvBaseApiService
{
  private $updateTrigger = new Subject();
  override apiRoute = this.config.apiContactAppointments;
  get nameOfEntity() { return this.config.NAMEOF_ENTITY_CONTACT_APPOINTMENT; }
  get TEAM_APPOINTMENT_STATUS_APPOINTED() { return this.config.TEAM_APPOINTMENT_STATUS_APPOINTED; };
  get TEAM_APPOINTMENT_STATUS_RESIGNED() { return this.config.TEAM_APPOINTMENT_STATUS_RESIGNED; }
  get TEAM_APPOINTMENT_STATUS_ONBREAK() { return this.config.TEAM_APPOINTMENT_STATUS_ONBREAK; }
  constructor()
  {
    super();
  }
  triggerUpdate()
  {
    return this.$updateTrigger.next("");
  }

  get updateTrigger(): Observable<any>
  {
    return this.$updateTrigger.asObservable();
  }

}
