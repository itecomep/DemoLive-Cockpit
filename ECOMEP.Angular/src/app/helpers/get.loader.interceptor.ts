import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { LoaderService } from '../shared/services/loader.service';
import { Observable } from "rxjs";


@Injectable()
export class GetLoaderInterceptor implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];

  constructor(public loaderService: LoaderService) { }

  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    this.loaderService.$showGetLoader.next(this.requests.length > 0);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.headers.has('no-loader')) {
      // console.log('headers',req.headers);
      req = req.clone({
        headers: req.headers.delete('no-loader')
      });
      // this.removeRequest(req);
      // return next.handle(req);
    }
    if (req.method !== 'GET') {

      this.removeRequest(req);
      return next.handle(req);
    }
    this.requests.push(req);
    // console.log("No of requests--->" + this.requests.length);
    this.loaderService.$showGetLoader.next(true);
    return new Observable(observer => {
      const subscription = next.handle(req)
        .subscribe(
          event => {
            if (event instanceof HttpResponse) {
              this.removeRequest(req);
              observer.next(event);
            }
          },
          err => {
            // alert('error returned');
            this.removeRequest(req);
            observer.error(err);
          },
          () => {
            this.removeRequest(req);
            observer.complete();
          });
      // remove request from queue when cancelled
      return () => {
        this.removeRequest(req);
        subscription.unsubscribe();
      };
    });
  }
}
