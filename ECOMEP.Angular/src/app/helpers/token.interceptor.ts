import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators';
import { AuthService } from "../auth/services/auth.service";
import { HttpCancelService } from "./httpcancel.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor
{
  private AUTH_HEADER = 'Authorization';
  private refreshTokenInProgress = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private authService: AuthService,
    private httpCancelService: HttpCancelService
  )
  {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
  {
    req = this.addAuthenticationToken(req);

    return next.handle(req)
      .pipe(
        catchError((error: HttpErrorResponse) =>
        {
          if (error && error.status === 401)
          {
            if (this.authService.currentUserStore && this.authService.currentUserStore.refreshToken)
            {
              // 401 errors are most likely going to be because we have an expired token that we need to refresh.
              if (this.refreshTokenInProgress)
              {
                console.log('401 catched, refreshTokenInProgress');
                // If refreshTokenInProgress is true, we will wait until refreshTokenSubject has a non-null value
                // which means the new token is ready and we can retry the request again
                return this.refreshTokenSubject.pipe(
                  filter(result => result !== null),
                  take(1),
                  switchMap(() => next.handle(this.addAuthenticationToken(req)))
                );
              } else
              {
                console.log('401 catched, refreshing token');
                this.refreshTokenInProgress = true;

                this.refreshTokenSubject.next(null);
                return this.authService.getRefreshToken()
                  .pipe(
                    switchMap((token) =>
                    {
                      if (token)
                      {
                        this.refreshTokenSubject.next(token);
                        return next.handle(this.addAuthenticationToken(req));
                      }
                      console.log('token not found, logging out');
                      this.httpCancelService.cancelPendingRequests();
                      // If we don't get a new token, we are in trouble so logout.
                      this.authService.logout();
                      return next.handle(req);
                      // return throwError(er);
                    }), catchError(er =>
                    {
                      // If there is an exception calling 'refreshToken', bad news so logout.
                      console.log('exception calling refreshToken, logging out');
                      this.httpCancelService.cancelPendingRequests();
                      this.authService.logout();
                      return throwError(er);
                    }), finalize(() =>
                    {
                      this.refreshTokenInProgress = false;
                    }));
              }
            } else
            {
              console.log('refreshToken not found, logging out!');
              this.httpCancelService.cancelPendingRequests();
              this.authService.logout();
            }
          }
          return throwError(error);
        })
      );
  }


  private addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any>
  {
    if (request.headers.has('No-Auth'))
    {
      return request;
    }
    if (!(request.body instanceof FormData) && !request.headers.has('Content-Type'))
    {
      request = request.clone({
        headers: request.headers.set('Content-Type', 'application/json')
      });
    }
    // If we do not have a token yet then we should not set the header.
    // Here we could first retrieve the token from where we store it.
    if (!this.authService.currentUserStore || !this.authService.currentUserStore.token)
    {
      return request;
    }

    // If you are calling an outside domain then do not add the token.
    // if (!request.url.match(/www.mydomain.com\//)) {
    //     return request;
    // }

    return request.clone({
      headers: request.headers.set(this.AUTH_HEADER, 'Bearer ' + this.authService.currentUserStore.token)
    });
  }

}
