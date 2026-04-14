import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private headerTitle = new BehaviorSubject<string>("");
  private headerTitle$ = this.headerTitle.asObservable();

  private headerTitleCount = new BehaviorSubject<number>(0);
  private headerTitleCount$ = this.headerTitleCount.asObservable();

  private version = new BehaviorSubject<string>('0.0.0');
  private version$ = this.version.asObservable();

  private isVersionUpdateAvailable = new BehaviorSubject<boolean>(false);
  private isVersionUpdateAvailable$ = this.isVersionUpdateAvailable.asObservable();

  private mobileFilterStatus = new BehaviorSubject<boolean>(false);
  private mobileFilterStatus$ = this.mobileFilterStatus.asObservable();

  private menuStatus = new BehaviorSubject<boolean>(false);
  private menuStatus$ = this.menuStatus.asObservable();

  private logoUrl = new BehaviorSubject<string>("");
  private logoUrl$ = this.logoUrl.asObservable();

  constructor(
  ) { }

  setHeaderTitle(title: string) {
    this.headerTitle.next(title);
  }

  getHeaderTitle(): Observable<string> {
    return this.headerTitle$;
  }

  setHeaderTitleCount(count: number) {
    this.headerTitleCount.next(count);
  }

  getHeaderTitleCount(): Observable<number> {
    return this.headerTitleCount$;
  }

  setVersion(value: string) {
    this.version.next(value);
  }

  getVersion(): Observable<string> {
    return this.version$;
  }

  setIsVersionUpdateAvailable(value: boolean)
  {
    this.isVersionUpdateAvailable.next(value);
  }

  getIsVersionUpdateAvailable(): Observable<boolean>
  {
    return this.isVersionUpdateAvailable$;
  }

  setMobileFilterStatus(value: boolean) {
    this.mobileFilterStatus.next(value);
  }

  getMobileFilterStatus(): Observable<boolean> {
    return this.mobileFilterStatus$;
  }

  setMenuStatus(value: boolean) {
    this.menuStatus.next(value);
  }

  getMenuStatus(): Observable<boolean> {
    return this.menuStatus$;
  }

  resetHeader() {
    this.headerTitle.next('');
    this.headerTitleCount.next(0);
  }

  setLogoUrl(value: string) {
    this.logoUrl.next(value);
  }

  getLogoUrl(): Observable<string> {
    return this.logoUrl$;
  }

}
