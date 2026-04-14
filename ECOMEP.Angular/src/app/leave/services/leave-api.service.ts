import { Injectable } from '@angular/core';
import { McvBaseApiService } from 'src/app/shared/services/mcv-base-api.service';
import { Leave } from '../models/leave.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeaveApiService extends McvBaseApiService {

  override apiRoute = this.config.apiLeave;

  constructor() {
    super();
  }

  override get isPermissionList() {
    return this.authService.isInAnyRole([
      this.permissions.LEAVE_LIST
    ]);
  }

  override get isPermissionEdit() {
    return this.authService.isInAnyRole([
      this.permissions.LEAVE_EDIT
    ]);
  }

  override get isPermissionDelete() {
    return this.authService.isInAnyRole([
      this.permissions.LEAVE_DELETE
    ]);
  }

  override get isPermissionSpecialEdit() {
    return this.authService.isInAnyRole([
      this.permissions.LEAVE_SPECIAL_EDIT
    ]);
  }

  get isPermissionLeaveMaster(){
    return this.authService.isInAnyRole([
      this.permissions.LEAVE_HOLIDAY_MASTER
    ]);
  }

  get nameOfEntity() { return this.config.NAMEOF_ENTITY_LEAVE; }

  getTotalSummary(contactID: number, index: number = 0) {
    const params: any = {
      index: index.toString()
    };

    Object.entries(params).forEach(o => (o[1] === null ? delete params[o[0]] : 0));

    return this.http.get<any>(this.apiRoute + '/TotalSummary/' + contactID, { params: params });
  }

  getPerMonthSummary(contactID: number, index: number = 0) {
    const params: any = {
      index: index.toString()
    };

    Object.entries(params).forEach(o => (o[1] === null ? delete params[o[0]] : 0));

    return this.http.get<any>(this.apiRoute + '/PerMonthSummary/' + contactID, { params: params });
  }

   validate(obj: Leave): Observable<any> {
    return this.http.post<any>(this.apiRoute + '/validate', obj, { headers: { 'no-loader': 'true' } });
  }


  mapToMcvFullCalendarEvent(obj: Leave, showAll: boolean) {
    // tslint:disable-next-line: prefer-const
    let _event = {
      id: obj.uid,
      groupId: obj.uid,
      title: `${obj.title} | ${obj.contact.name} | ${obj.total} Days`,
      extendedProps: obj,
      start: new Date(obj.start),
      end: new Date(obj.end),
      color: '#9B5DE0',
      // allDay: obj.typeFlag != this.config.LEAVE_TYPEFLAG_APPROVED_BREAK && obj.typeFlag != this.config.LEAVE_TYPEFLAG_APPROVED_HALFDAY,
    };
    return _event;
  }

}