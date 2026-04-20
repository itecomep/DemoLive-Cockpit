import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppPermissions } from 'src/app/app.permissions';
import { AppConfig } from '../../app.config';
import { UserDto } from 'src/app/auth/models/user-dto';
import { CurrentUserStore } from 'src/app/auth/models/current-user';
import { ChangePasswordDto } from '../models/change-password-dto';
import { RegisterUserDto } from '../models/register-user-dto';
import { ResetPasswordDto } from '../models/reset-password-dto';
import { RoleDto } from '../models/role-dto';
import { DeviceDetectorService } from 'ngx-device-detector';
@Injectable({
  providedIn: 'root'
})
export class AuthService
{
  private apiRoute: string;
  currentUserStore?: CurrentUserStore;
  redirectUrl!: string;
  loginStatus: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private http: HttpClient,
    private permissions: AppPermissions,
    private config: AppConfig,
    private router: Router,
    private deviceService: DeviceDetectorService
  )
  {
    this.apiRoute = this.config.apiAuth;
    this.getUserStore();
  }

  get deviceInfo() { return this.deviceService.getDeviceInfo(); }
  get isMobile()
  {
    return this.deviceService.isMobile();
  }
  get isTablet()
  {
    return this.deviceService.isTablet();
  }
  get isDesktopDevice()
  {
    return this.deviceService.isDesktop();
  }

  // , lattitude: number, longitude: number
  login(username: string, password: string, geolocation:string)
  {
    return this.http.post<any>(`${this.apiRoute}/login`, {
      username,
      password,
      userAgent: this.deviceInfo.userAgent,
      os: `${this.deviceInfo.os} ${this.deviceInfo.os_version}`,
      browser: `${this.deviceInfo.browser} ${this.deviceInfo.browser_version}`,
      device: `${this.deviceInfo.device}`,
      deviveType: `${this.deviceInfo.deviceType}`,
      geolocation
    })
      .pipe(
        map(result =>
        {
          this.currentUserStore = new CurrentUserStore();
          if (result && result.accessToken)
          {
            this.currentUserStore.token = result.accessToken;
            this.currentUserStore.username = username;
            this.currentUserStore.refreshToken = result.refreshToken;
            this.currentUserStore.isAuth = !result.isOTPRequired;
            this.currentUserStore.isOTPRequired = result.isOTPRequired;
            this.currentUserStore.sessionID = result.sessionID;
            // this.currentUserStore.contact = result.contact;
            // this.currentUserStore.roles = result.roles;
            this.currentUserStore.isChangePassword = result.isChangePassword;
            this.currentUserStore.userId = result.userId;
            this.currentUserStore.isOutsideIP = result.isOutsideIP ?? false;
            this.currentUserStore.allowedModules = result.allowedModules;
            this.setUserStore(this.currentUserStore);

          }
          return this.currentUserStore;
        })
      );
  }

  getRefreshToken()
  {
    return this.http.post<any>(
      `${this.apiRoute}/refresh`,
      { token: this.currentUserStore?.refreshToken },
      { headers: { 'No-Auth': 'true' } }
    )
      .pipe(
        map(result =>
        {
          if (result && result.accessToken && this.currentUserStore)
          {
            this.currentUserStore.token = result.accessToken;
            // this.currentUserStore.username = result.userName;
            this.currentUserStore.refreshToken = result.refreshToken;
            this.currentUserStore.isAuth = true;
            this.setUserStore(this.currentUserStore);
          }
          // console.log('Token refreshed', result);
          return this.currentUserStore;
        })
      );

  }

  async logout()
  {
    // remove user from local storage to log user out
    if (this.currentUserStore)
    {

      await firstValueFrom(this.logoutSession(
        this.currentUserStore.username, this.currentUserStore.refreshToken
      )).catch((error) =>
      {
        console.log(error);
      });
    }
    // remove user from local storage to log user out

    if (localStorage.getItem('currentUser'))
    {
      localStorage.removeItem('currentUser');
    }
    // sessionStorage.removeItem('userId');
    // sessionStorage.removeItem('sessionId');
    this.currentUserStore = undefined;
    this.router.navigate([this.config.ROUTE_LOGIN]);
    window.location.reload();
  }


  logoutSession(username: string, token: string): Observable<any>
  {
    return this.http.post<any>(`${this.apiRoute}/Logout`, { username: username, token: token },
      { headers: { 'no-refresh-token': 'true' } });
  }


  getUserStore()
  {
    const store = localStorage.getItem('currentUser');
    if (store)
    {
      const _currentUser = JSON.parse(store);
      this.currentUserStore = _currentUser as CurrentUserStore;
    }
  }

  setUserStore(user: CurrentUserStore)
  {
    this.currentUserStore = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  get isRoleMaster(): boolean
  {
    if (!this.currentUserStore || !this.currentUserStore.roles || this.currentUserStore.roles.length == 0) { return false; }

    const _master = this.currentUserStore.roles.find((item) =>
    {
      return item == this.permissions.MASTER;
    });

    if (_master)
    {
      return true;
    }

    return false;
  }

 get isTeamLeader(): boolean {
  const user = this.currentUserStore;
  
  if (
    user &&
    Array.isArray(user.teams) &&
    user.teams.length > 0 &&
    user.contact &&
    user.contact.id != null
  ) {
    return user.teams.some(
      (team: any) => team?.leaderID === user.contact.id
    );
  }

  return false;
}



  verifyEmailOTP(otp: string)
  {
    return this.http.post<any>(`${this.apiRoute}/email/verifyOTP`, { sessionId: this.currentUserStore?.sessionID, otp: otp })
      .pipe(
        map(result =>
        {
          if (result?.status === 'success' && this.currentUserStore)
          {
            this.currentUserStore.isAuth = true;
            this.setUserStore(this.currentUserStore);
          }
          // console.log('Token refreshed', result);
          return result;
        })
      );
  }
  isInRole(role: string): boolean
  {

    if (!this.currentUserStore || !this.currentUserStore.roles || this.currentUserStore.roles.length == 0) { return false; }

    const _master = this.currentUserStore.roles.find((item) =>
    {
      return item == this.permissions.MASTER;
    });

    if (_master)
    {
      return true;
    }

    const _role = this.currentUserStore.roles.find((item) =>
    {
      return item == role;
    });

    if (_role)
    {

      return true;
    } else
    {

      return false;
    }
  }

  isInAnyRole(roles: string[]): boolean
  {
    if (!this.currentUserStore || !this.currentUserStore.roles || this.currentUserStore.roles.length == 0) { return false; }
    for (let i = 0; i < roles.length; i++)
    {
      if (this.isInRole(roles[i])) { return true; }
    }

    return false;
  }

  isCurrentUser(contactID: number[] | number): boolean
  {
    if (this.currentUserStore)
      if (typeof contactID == "number")
      {
        return contactID === this.currentUserStore.contact.id;
      } else
      {
        const obj = contactID.find((item) =>
        {
          return item === this.currentUserStore?.contact.id;
        });

        if (obj)
        {

          return true;
        }
      }

    return false;
  }

  register(obj: RegisterUserDto): Observable<UserDto>
  {
    return this.http.post<UserDto>(this.apiRoute + '/register', obj);
  }

  resetPassword(obj: ResetPasswordDto): Observable<any>
  {
    return this.http.put<any>(this.apiRoute + '/reset', obj);
  }

  changePassword(obj: ChangePasswordDto): Observable<any>
  {
    return this.http.put<any>(this.apiRoute + '/change', obj);
  }

  delete(id: string): Observable<UserDto>
  {
    return this.http.delete<UserDto>(this.apiRoute + '/' + id);
  }

  update(obj: any): Observable<UserDto>
  {
    return this.http.put<UserDto>(this.apiRoute, obj);
  }

  getPasswordExpired(username: string): Observable<boolean>
  {
    return this.http.get<boolean>(
      this.apiRoute + '/PasswordExpired',
      {
        params: {
          Username: username
        }
      }
    );
  }

  getRolesByUsername(username: string): Observable<string[]>
  {
    return this.http.get<string[]>(
      this.apiRoute + '/RolesbyUsername', { params: { username: username } }
    );
  }

  getRoleOptionsByUsername(username: string): Observable<RoleDto[]>
  {
    return this.http.get<RoleDto[]>(
      this.apiRoute + '/RoleOptionsByUsername',
      {
        params: {
          Username: username
        }
      }
    );
  }

  addRoles(
    username: string,
    roles: string[]
  ): Observable<any>
  {
    return this.http.put<any>(this.apiRoute + '/AddRoles',
      {
        roles: roles,
        username: username
      }
    );
  }

  removeRoles(
    username: string,
    roles: string[]
  ): Observable<any>
  {
    return this.http.put<any>(this.apiRoute + '/RemoveRoles', {

      roles: roles,
      username: username

    });
  }

  getRoles(
    
  ): Observable<any>
  {
    return this.http.get<any>(this.apiRoute + '/Roles', {

  

    });
  }

  refreshRoles()
  {
    if (this.currentUserStore)
    {
      this.getRolesByUsername(this.currentUserStore.username).subscribe((result) =>
      {
        if (result)
        {

          if (this.currentUserStore)
          {
            this.currentUserStore.roles = result;
            this.setUserStore(this.currentUserStore);
          }
        }
      });
    }
  }

  assignPrevilegeToUser(
    userId: string,
    previlegeName: string
  ): Observable<any>
  {
    return this.http.post<any>(this.apiRoute + '/AddRole/' + userId, null, {
      params: {
        Role: previlegeName
      }
    });
  }

  removePrevilegeFromUser(
    username: string,
    previlegeName: string
  ): Observable<any>
  {
    return this.http.delete<any>(this.apiRoute + '/RemoveRole/' + username, {
      params: {
        Role: previlegeName
      }
    });
  }

  get isAllowedIpBypassView(): boolean {
    return this.isInAnyRole([this.permissions.PROJECT_ALLOWED_IP_BYPASS_VIEW]);
  }

  get isAnalysisListView(): boolean {
    return this.isInAnyRole([this.permissions.ANALYSIS_LIST_VIEW]);
  }

  get isTaskView(): boolean {
    return this.isInAnyRole([this.permissions.TASK_VIEW]);
  }







  getCurrentUserTeamIds(): number[] {
  if (
    this.currentUserStore &&
    Array.isArray(this.currentUserStore.teams)
  ) {
    return this.currentUserStore.teams.map((t: any) => t.id);
  }
  return [];
}


}
