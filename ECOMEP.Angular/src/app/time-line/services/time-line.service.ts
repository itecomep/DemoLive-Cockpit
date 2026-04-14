import { Injectable } from "@angular/core";
import { McvBaseApiService } from "src/app/shared/services/mcv-base-api.service";
import { TimeLineGroup } from "../model/time-line-group";

@Injectable({
  providedIn: "root"
})
export class TimeLineService extends McvBaseApiService
{

  constructor()
  {
    super();
  }

  private _timeLineGroupArray: TimeLineGroup[] = [];
  get timeLineGroupItems() { return this._timeLineGroupArray; }
  set timeLineGroupItems(value) { this._timeLineGroupArray = value; }
}
