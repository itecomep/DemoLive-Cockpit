import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { McvElasticEvent } from "../model/mcv-elastic-event";

@Injectable({
  providedIn: 'root'
})
export class McvElasticService {
  private eventSource: Subject<McvElasticEvent> = new Subject<McvElasticEvent>();
  public events: Observable<McvElasticEvent> = this.eventSource.asObservable();

  private isResizeActiveSubject: Subject<boolean> = new Subject<boolean>();
  public isResizeActive: Observable<boolean> = this.isResizeActiveSubject.asObservable();

  private resizing: boolean = false;
  public set isResizing(value: boolean) {
    this.resizing = value;
    this.isResizeActiveSubject.next(value);
  }
  public get isResizing(): boolean {
    return this.resizing;
  }
  private moving: boolean = false;
  public set isMoving(value: boolean) {
    this.moving = value;
    this.isResizeActiveSubject.next(value);
  }
  public get isMoving(): boolean {
    return this.moving;
  }

  constructor() {
  }

  resize(obj: McvElasticEvent) {
    this.emitEvent(obj);
  }

  private emitEvent(event: McvElasticEvent) {
    if (this.eventSource) {
      this.eventSource.next(event);
    }
  }
}
