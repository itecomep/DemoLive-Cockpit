import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  $message: BehaviorSubject<string>;
  $showLoader: BehaviorSubject<boolean>;
  $showGetLoader: BehaviorSubject<boolean>;

  message: Observable<string>;
  showLoader: Observable<boolean>;
  showGetLoader: Observable<boolean>;

  constructor() {
    this.$message = new BehaviorSubject('Processing...');
    this.$showLoader = new BehaviorSubject(false);
    this.$showGetLoader = new BehaviorSubject(false);

    // tslint:disable-next-line: no-unused-expression
    this.message = this.$message.asObservable();
    this.showLoader = this.$showLoader.asObservable();
    this.showGetLoader = this.$showGetLoader.asObservable();
  }

  show(message: string) {
    this.$showLoader.next(true);
    this.$message.next(message);
  }

  hide() {
    this.$showLoader.next(false);
    this.$message.next('');
  }

  showGet(message: string) {
    this.$showGetLoader.next(true);
    this.$message.next(message);
  }

  showHideGet() {
    this.$showGetLoader.next(false);
    this.$message.next('');
  }
}
