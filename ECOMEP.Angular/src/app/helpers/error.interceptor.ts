import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, finalize } from 'rxjs/operators';
import { AuthService } from "../auth/services/auth.service";
import { UtilityService } from "../shared/services/utility.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor
{
  constructor(
    private authService: AuthService,
    private utilityService: UtilityService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
  {
    return next.handle(request)
      .pipe(
        catchError((error: any) => this.handleError(error)),
        finalize(() =>
        {
          // do something at the end
        })
      );
  }

  private handleError(error: any): Observable<never>
  {
    if (error instanceof HttpErrorResponse)
    {
      switch (error.status)
      {
        case 0:
          this.showConnectionError();
          break;
        case 400:
          this.handleBadRequest(error);
          break;
        case 401:
          this.handleUnauthorizedError(error);
          break;
        case 504:
          this.showTimeoutError();
          break;
        case 500:
          this.showServerError(error);
          break;
        default:
          this.showErrorMessage(`${error.status}!`, error.error);
      }
    } else if (error.error instanceof ErrorEvent)
    {
      // Client Side Error
      this.showErrorMessage(`Application Error ${error.status}!`, error);
    } else
    {
      // Server Side Error
      this.showErrorMessage(`Server Error ${error.status}!`, error);
    }

    return throwError(() => error);
  }

  private showConnectionError(): void
  {
    this.utilityService.showSweetDialog(
      'Oops!',
      'Looks like we lost connection with the server. Please wait for a few minutes and try again.',
      'warning'
    );
  }

  private handleBadRequest(error: HttpErrorResponse): void
  {
    if (error.error && error.error.error === 'invalid_grant')
    {
      this.utilityService.showSwalToast(
        'Session expired',
        `${error.error.error_description || ''} Please login again.`,
        'error'
      );
      this.authService.logout();
    } else
    {
      this.utilityService.showSweetDialog('Oops!', error.error.error, 'error');
    }
  }

  private handleUnauthorizedError(error: HttpErrorResponse): void
  {
    console.log('401 caught & handled by token interceptor using refresh tokens', error);
    // Additional handling can be implemented if needed
  }

  private showTimeoutError(): void
  {
    this.utilityService.showSweetDialog(
      'Oops!',
      'Looks like we lost connection with the server. Please check your internet connection and try again.',
      'error'
    );
  }

  private showServerError(obj: HttpErrorResponse): void
  {
    console.log('error',obj);
    this.utilityService.showSweetDialog(
      'Oops! Something went wrong',
      obj.error.error || obj.error.exceptionMessage || obj.message,
      'error'
    );
  }

  private showErrorMessage(title: string, message: any): void
  {
    this.utilityService.showSweetDialog(
      title,
      JSON.stringify(message),
      'error'
    );
  }
}