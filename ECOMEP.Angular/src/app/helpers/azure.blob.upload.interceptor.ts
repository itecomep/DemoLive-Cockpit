import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable()
export class AzureBlobUploadInterceptor implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes(environment.azureBlobStorageRoot)) {
      // console.log('headers',req.headers);
      req = req.clone({
        headers: req.headers.append('ngsw-bypass', 'true')
      });
    }
    return next.handle(req);
  }
}
