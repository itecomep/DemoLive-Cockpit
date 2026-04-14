import { Injectable } from "@angular/core";
import { McvBaseApiService } from "./mcv-base-api.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ActivityApiService extends McvBaseApiService
{

  override apiRoute = this.config.apiContactActivities;
  constructor()
  {
    super();
  }

  getByEntity(entity: string, id: number, taskID?: number): Observable<any>
  {
    let params: any = {
      taskID: taskID ? taskID.toString() : null
    };

    Object.entries(params).forEach(o =>
      o[1] === null ? delete params[o[0]] : 0
    );
    return this.http.get<any[]>(
      this.apiRoute + "/" + entity + "/" + id,
      {
        headers: { 'no-loader': 'true' },
        params: params
      }
    );
  }

  getAttachmentByEntity(taskID: number): Observable<any>
  {
    let params: any = {
      taskID: taskID.toString()
    };

    Object.entries(params).forEach(o =>
      o[1] === null ? delete params[o[0]] : 0
    );
    return this.http.get<any[]>(this.apiRoute + "/AttachmentByEntity",
      {
        headers: { 'no-loader': 'true' },
        params: params
      }
    );
  }

  getByContact(id: number): Observable<any>
  {
    return this.http.get<any[]>(this.apiRoute + "/ByContact/" + id, { headers: { 'no-loader': 'true' } });
  }

  getrelated(
    showAll: boolean,
    entityId?: number,
    entity?: string,
    taskId?: number,
    employeeId?: number
  ): Observable<any[]>
  {
    let params: any = {
      showAll: showAll.toString(),
      entityId: entityId ? entityId.toString() : null,
      entity: entity ? entity : null,
      taskId: taskId ? taskId.toString() : null,
      employeeID: employeeId ? employeeId.toString() : null
    };

    Object.entries(params).forEach(o =>
      o[1] === null ? delete params[o[0]] : 0
    );

    return this.http.get<any[]>(this.apiRoute,
      {
        headers: { 'no-loader': 'true' },
        params: params
      }
    );
  }
}
