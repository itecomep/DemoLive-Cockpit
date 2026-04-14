import { Injectable, TemplateRef } from "@angular/core";
import { ComponentType } from '@angular/cdk/portal';

import { BehaviorSubject, Observable } from "rxjs";
import { WFTask } from "src/app/wf-task/models/wf-task.model";
import { ApiFilter } from "src/app/shared/models/api-filters";
import { McvBaseApiService } from "src/app/shared/services/mcv-base-api.service";

import { VHr } from "src/app/shared/models/vhr-analysis";
import { McvTimeLineEvent } from "src/app/mcv-time-line/model/mcv-time-line-events";

@Injectable({
  providedIn: 'root'
})
export class WFTaskApiService extends McvBaseApiService
{
  $triggerTaskComplete: BehaviorSubject<any>;
  triggerTaskComplete: Observable<WFTask>;
  override apiRoute = this.config.apiWFTasks;
  constructor()
  {
    super();
    this.$triggerTaskComplete = new BehaviorSubject(null);
    this.triggerTaskComplete = this.$triggerTaskComplete.asObservable();
  }

  completeTask(obj: WFTask)
  {
    this.$triggerTaskComplete.next(obj);
  }

  override refreshList()
  {
    this.$triggerListRefresh.next(true);
    this.$triggerListRefresh.next(false);
  }

  resetTriggers()
  {
    this.$triggerTaskComplete.next(null);
  }

  getAnalysisPages(page: number, pageSize: number,
    filters?: ApiFilter[], search?: string, sort?: string, showAll?: boolean): Observable<any>
  {
    // tslint:disable-next-line: prefer-const
    let params: any = {
      page: page.toString(),
      pageSize: pageSize.toString(),
      search: search ? search : null,
      sort: sort ? sort : null,
      filters: filters && filters.length !== 0 ? JSON.stringify({ filters }) : null,
      showAll: showAll ? showAll.toString() : null,
    };

    Object.entries(params).forEach(o =>
      o[1] === null ? delete params[o[0]] : 0
    );

    return this.http.get<any>(this.apiRoute + '/Analysis/Pages', { params });
  }

  getAnalysisTotal(filters?: ApiFilter[], search?: string, sort?: string, showAll?: boolean): Observable<any>
  {
    // tslint:disable-next-line: prefer-const
    let params: any = {
      search: search ? search : null,
      sort: sort ? sort : null,
      filters: filters && filters.length !== 0 ? JSON.stringify({ filters: filters }) : null,
    };

    Object.entries(params).forEach(o =>
      o[1] === null ? delete params[o[0]] : 0
    );

    return this.http.get<any>(this.apiRoute + "/Analysis/Total", { params: params });
  }

  getVHrAnalysis(filters?: ApiFilter[], search?: string, sort?: string, showAll?: boolean)
    : Observable<VHr[]>
  {
    // tslint:disable-next-line: prefer-const
    let params: any = {
      search: search ? search : null,
      sort: sort ? sort : null,
      filters: filters && filters.length !== 0 ? JSON.stringify({ filters }) : null,
      showAll: showAll ? showAll.toString() : null,
    };

    Object.entries(params).forEach(o =>
      o[1] === null ? delete params[o[0]] : 0
    );

    return this.http.get<VHr[]>(this.apiRoute + '/Analysis/vhr', { params });
  }

  exportVHrAnalysisExcel(filters?: ApiFilter[], search?: string, sort?: string)
  {

    let url = this.apiRoute + '/Analysis/vhr/excel';
    if (filters || search || sort)
    {
      url = url + '?'
        + (filters && filters.length !== 0 ? '&filters=' + JSON.stringify({ filters: filters }) : '')
        + (search ? '&search=' + search : '')
        + (sort ? '&sort=' + sort : '');
    }
    window.open(url, '_blank');
  }

  mapToMcvTimelineEvent(obj: WFTask): McvTimeLineEvent
  {
    // tslint:disable-next-line: prefer-const
    let event = new McvTimeLineEvent();
    event.id = obj.id.toString();
    event.entity = this.config.NAMEOF_ENTITY_WFTASK;
    event.entityLabel = 'Task';
    event.eventType = 'Task';
    event.taskDue = obj.dueDate;
    event.taskCompleted = obj.completedDate;

    event.start = obj.startDate;
    event.end = obj.dueDate; //obj.statusFlag === 1 && (new Date(obj.completedDate)).getTime() < (new Date(obj.dueDate)).getTime() ? obj.completedDate : obj.dueDate;

    event.actualStart = obj.startDate;
    event.actualEnd = obj.dueDate;
    event.title = obj.title + (obj.stageRevision != 0 ? ' R' + obj.stageRevision : '');
    event.subTitle = obj.subtitle;
    event.eventData = obj;
    event.resourceID = obj.contactID.toString();
    if (obj.contact)
    {
      event.resourceTitle = obj.contact.name;
      event.avatarUrl = obj.contact.photoUrl;
    }
    event.status = this.config.WFTASK_STATUS_0;
    event.colorClass = 'gray';
    if (obj.statusFlag == 1)
    {
      event.status = this.config.WFTASK_STATUS_1;
      event.colorClass = 'gray-light';
    }
    else if (obj.statusFlag == 2)
    {
      event.status = this.config.WFTASK_STATUS_2;
    }
    else if (obj.statusFlag == 3)
    {
      event.status = this.config.WFTASK_STATUS_3;
      // _event.colorClass = 'yellow';
    }


    if (obj.isDelayed)
    {
      event.status = event.status + ' | DELAYED';
      event.colorClass = 'red';
    }
    if (obj.timeEntries && obj.timeEntries.length != 0)
    {
      obj.timeEntries.forEach(child =>
      {
        child.contact = obj.contact;
        let _timeEntryEvent = new McvTimeLineEvent();
        _timeEntryEvent.id = child.id.toString();
        _timeEntryEvent.entity = this.config.NAMEOF_ENTITY_TIMEENTRY;
        _timeEntryEvent.entityLabel = 'Time Entry';
        _timeEntryEvent.start = child.startDate;
        _timeEntryEvent.end = child.endDate ? child.endDate : new Date();
        _timeEntryEvent.actualStart = child.startDate;
        _timeEntryEvent.actualEnd = child.endDate ? child.endDate : new Date();
        _timeEntryEvent.title = child.taskTitle;
        _timeEntryEvent.subTitle = child.entityTitle ?? '';
        _timeEntryEvent.eventData = child;
        _timeEntryEvent.resourceID = obj.contactID.toString();
        if (obj.contact)
        {
          _timeEntryEvent.resourceTitle = obj.contact.name;
          _timeEntryEvent.avatarUrl = obj.contact.photoUrl;
        }
        _timeEntryEvent.colorClass = child.statusFlag === 0 ? 'green' : 'blue';
        if (obj.entity && obj.entity == 'Meeting')
        {
          _timeEntryEvent.colorClass = 'purple';
        }
        _timeEntryEvent.status = child.statusFlag === 0 ? 'LIVE' : 'RECORDED';
        _timeEntryEvent.isLive = child.statusFlag === 0;
        _timeEntryEvent.parentGuid = event.guid;

        event.children.push(_timeEntryEvent);
      });
    }

    return event;
  }

  override get isPermissionSpecialShowAll(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.WFTASK_SPECIAL_SHOW_ALL
    ]);
  }

  openTaskAssessmentDialog(
    dialogTitle: string,
    componentOrTemplateRef: ComponentType<unknown> | TemplateRef<unknown>,
    wfTaskID: number)
  {

    return this.openDialog(componentOrTemplateRef, {
      dialogTitle,
      wfTaskID,
    }, true);
  }


  private _activeTask?: WFTask;
  get activeTask() { return this._activeTask; }
  set activeTask(value) { this._activeTask = value; }

}
