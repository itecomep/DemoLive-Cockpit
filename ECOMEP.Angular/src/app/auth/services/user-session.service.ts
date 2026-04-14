import { Injectable } from '@angular/core';
import { ApiFilter } from 'src/app/shared/models/api-filters';
import { McvBaseApiService } from 'src/app/shared/services/mcv-base-api.service';

@Injectable({
  providedIn: 'root'
})
export class UserSessionService extends McvBaseApiService {

  override apiRoute = this.config.apiUserSessions;
  constructor() {
    super();
  }

  getReport(filters?: ApiFilter[], search?: string, sort?: string, reportType?: string) {
    let url = this.apiRoute + '/report';
    if (filters || search || sort || reportType) {
      url = url + '?'
        + (filters && filters.length !== 0 ? '&filters=' + JSON.stringify({ filters }) : '')
        + (search ? '&search=' + search : '')
        + (sort ? '&sort=' + sort : '')
        + (reportType ? '&reporttype=' + reportType : '');
    }
    window.open(url, '_blank');
  }
}
