import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {

  constructor() { }

  private emitRefresh = new Subject<void>();

  refreshEmitted = this.emitRefresh.asObservable();

  refresh() {
    this.emitRefresh.next();
  }
}
