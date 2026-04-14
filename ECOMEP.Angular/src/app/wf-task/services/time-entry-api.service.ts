import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { McvTimeLineEvent } from "src/app/mcv-time-line/model/mcv-time-line-events";
import { TimeEntryDto } from "src/app/shared/models/time-entry-dto";
import { ApiFilter } from "src/app/shared/models/api-filters";
import { McvBaseApiService } from "src/app/shared/services/mcv-base-api.service";


@Injectable({
  providedIn: 'root'
})
export class TimeEntryApiService extends McvBaseApiService
{

  override apiRoute = this.config.apiTimeEntries;
  constructor()
  {
    super();
  }

  exportExcel(filters?: ApiFilter[], search?: string, sort?: string)
  {

    let url = this.apiRoute + "/EXCEL";
    if (filters || search || sort)
    {
      url = url + '?'
        + (filters && filters.length !== 0 ? '&filters=' + JSON.stringify({ filters: filters }) : '')
        + (search ? '&search=' + search : '')
        + (sort ? '&sort=' + sort : '');
    }
    window.open(url, '_blank');
  }

  getTimeLineEvents(
    filters: any,
    showAll?: boolean): Observable<any>
  {

    let params: any = {
      filters: JSON.stringify({ filters: filters }),
      showAll: showAll ? showAll.toString() : null,
    };

    Object.entries(params).forEach(o =>
      o[1] === null ? delete params[o[0]] : 0
    );

    return this.http.get<any>(this.apiRoute + "/TimeLineEvents", { params: params });
  }

  mapToMcvTimelineEvent(obj: TimeEntryDto): McvTimeLineEvent
  {
    // tslint:disable-next-line: prefer-const
    let _event = new McvTimeLineEvent();
    _event.id = obj.id.toString();
    _event.entity = this.config.NAMEOF_ENTITY_TIMEENTRY;
    _event.entityLabel = 'Time Entry';
    _event.start = obj.startDate;
    _event.end = obj.endDate ? obj.endDate : new Date();
    _event.actualStart = obj.startDate;
    _event.actualEnd = obj.endDate ? obj.endDate : new Date();
    _event.title = obj.taskTitle;
    _event.subTitle = obj.entityTitle ?? '';
    _event.eventData = obj;
    _event.resourceID = obj.contactID.toString();
    _event.resourceTitle = obj.contact?.name;
    _event.avatarUrl = obj.contact?.photoUrl;
    _event.colorClass = obj.statusFlag === 0 ? 'green' : 'blue';
    if (obj.entity && obj.entity == 'Meeting')
    {
      _event.colorClass = 'purple';
    }
    _event.status = obj.statusFlag === 0 ? 'LIVE' : 'RECORDED';
    _event.isLive = obj.statusFlag === 0;
    return _event;
  }
}
