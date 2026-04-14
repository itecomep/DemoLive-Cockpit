import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppConfig } from '../app.config';
import { AuthService } from '../auth/services/auth.service';
import { AllowedIpService } from '../../app/allowed-ip/services/allowed-ip.service';
import { map } from 'rxjs/operators';
import { AppPermissions } from '../app.permissions';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard 
{
  constructor(
    private router: Router,
    private authService: AuthService,
    private allowedIpService: AllowedIpService,
    private config: AppConfig,
    private permissions: AppPermissions
  ) { }

  canActivate(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean
  {
    let url: string = state.url;
    return this.checkLogin(state.url, next.data['roles']);
  }

  // checkLogin(url: string, roles: string[]): boolean
  checkLogin(url: string, roles: string[]): Observable<boolean> | boolean
  {
    // console.log('authgaurd check', this.authService.currentUserStore);
    if (this.authService.currentUserStore && this.authService.currentUserStore.isAuth)
    {
      //  if (this.authService.user && this.authService.user.isChangePassword) {

      //     this.router.navigate([this.config.ROUTE_CHANGE_PASSWORD]);
      //   }
      // if (this.authService.user && this.authService.user.agreementFlag !== 1 ) {
      //   this.router.navigate([this.config.ROUTE_EULA]);
      // }
      const currentUser = this.authService.currentUserStore;
      if (!currentUser || !currentUser.isAuth) {
        this.authService.redirectUrl = url;
        this.router.navigate([this.config.ROUTE_LOGIN]);
        return false;
      }
      if (url.startsWith('/allowed-ip') || url.startsWith('/bypass-allowed-user/bypass')) {
        const hasPermission = this.authService.isInAnyRole([
          this.permissions.PROJECT_ALLOWED_IP_BYPASS_VIEW
        ]);

        if (!hasPermission) {
          this.router.navigate(['/unauthorized']);
          return false;
        }

        return true;
      }
      if (roles)
      {
        return this.authService.isInAnyRole(roles);
      }

      if (currentUser.isOutsideIP) {
        if (!url.includes('leave-list')) {
          this.router.navigate(['/leave-list']);
          return false;
        }
      }

      return true;
    }

    console.log('authgaurd check failed. redirecting to login');
    // To redirect to the page user is after login
    this.authService.redirectUrl = url;
    // move to login page
    this.router.navigate([this.config.ROUTE_LOGIN]);
    return false;
  }
}
