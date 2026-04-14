import { Injectable } from "@angular/core";
import { McvBaseApiService } from "../../shared/services/mcv-base-api.service";
import { Observable } from "rxjs";
import { TaskAction } from "../models/wf-task.model";

@Injectable({
  providedIn: 'root'
})
export class WorkflowApiService extends McvBaseApiService
{

  override apiRoute = this.config.apiWorkflow;
  constructor()
  {
    super();
  }

  action(obj: TaskAction, hideLoader: boolean = false): Observable<any>
  {
    if (hideLoader)
    {
      return this.http.put<any>(this.apiRoute + '/action/' + obj.taskID, obj, { headers: { 'No-loader': 'true' } });
    }
    // console.log('Updating',obj.id);
    return this.http.put<any>(this.apiRoute + '/action/' + obj.taskID, obj);
  }
}
