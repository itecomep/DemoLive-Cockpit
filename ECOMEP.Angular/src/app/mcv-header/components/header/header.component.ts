import { Router } from '@angular/router';
import { Component, HostListener, inject, Input, OnDestroy, OnInit } from '@angular/core';

import { AppConfig } from 'src/app/app.config';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ContactApiService } from 'src/app/contact/services/contact-api.service';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { ContactPhotoEditorComponent } from 'src/app/contact/components/contact-photo-editor/contact-photo-editor.component';
import { MenuSidebarComponent } from '../menu-sidebar/menu-sidebar.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MenuToggleDirective } from '../../directives/menu-toggle.directive';
import { ContactTeamCreateComponent } from 'src/app/contact/components/contact-team-create/contact-team-create.component';
import { Contact } from 'src/app/contact/models/contact';
import { ContactCreateComponent } from 'src/app/contact/components/contact-create/contact-create.component';
import { ProjectApiService } from 'src/app/project/services/project-api.service';
import { ProjectCreateComponent } from 'src/app/project/components/project-create/project-create.component';
import { Project } from 'src/app/project/models/project.model';
import { TodoApiService } from 'src/app/todo/services/todo-api.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TodoCreateDialogComponent } from 'src/app/todo/components/todo-create-dialog/todo-create-dialog.component';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { WebPushApiService } from 'src/app/auth/services/web-push-api.service';
import { RequestTicketApiService } from 'src/app/request-ticket/services/request-ticket-api.service';
import { RequestTicketCreateComponent } from 'src/app/request-ticket/components/request-ticket-create/request-ticket-create.component';
import { LeaveCreateComponent } from 'src/app/leave/components/leave-create/leave-create.component';
import { LeaveApiService } from 'src/app/leave/services/leave-api.service';
import { MeetingCreateComponent } from 'src/app/meeting/components/meeting-create/meeting-create.component';
import { MeetingApiService } from 'src/app/meeting/services/meeting-api.service';
import { AppService } from 'src/app/shared/services/app.service';
import { SwUpdate } from '@angular/service-worker';
import { SiteVisitApiService } from 'src/app/site-visit/services/site-visit-api.service';
import { SitevisitCreateComponent } from 'src/app/site-visit/component/site-visit-create/site-visit-create.component';
import { AssetCreateComponent } from 'src/app/asset/components/asset-create/asset-create.component';
import { AssetApiService } from 'src/app/asset/services/asset-api.service';
import { SignalRService } from "src/app/shared/services/signalr.service";
import { NotificationService } from "src/app/notifications/notification.service";
import { MatBadgeModule } from '@angular/material/badge';
import { WorkFromHomeComponent } from 'src/app/work-from-home/work-from-home/work-from-home.component';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    MenuToggleDirective,
     MatIconModule, 
     MatMenuModule, 
     CommonModule,
       MatBadgeModule, 
     //Components
     MenuSidebarComponent,
     TodoCreateDialogComponent,
    ]
})
export class HeaderComponent implements OnInit, OnDestroy
{
  private router = inject(Router);
  private config = inject(AppConfig);
  private dialog = inject(MatDialog);
  public authService = inject(AuthService);
  private todoService = inject(TodoApiService);
  private utilityService = inject(UtilityService);
  private contactService = inject(ContactApiService);
  private webPushService = inject(WebPushApiService);
  private projectService = inject(ProjectApiService);
  private leaveService = inject(LeaveApiService);
  private meetingService = inject(MeetingApiService);
  private SitevisitService = inject(SiteVisitApiService);
  private appSettingService = inject(AppSettingMasterApiService);
  private requestTicketService = inject(RequestTicketApiService);
  private assetService = inject(AssetApiService);
  private appService = inject(AppService);
  private swUpdate = inject(SwUpdate);
    private signalR = inject(SignalRService);
  private notificationService = inject(NotificationService);


  @Input() title!: string;
  @Input() titleCount: number = 0;
  
  

  get user() { return this.authService.currentUserStore; }
  get isMobileView() { return this.utilityService.isMobileView; }
  // get isPermissionOfficeTimelineView(): boolean
  //   {
  //     return this.authService.isInAnyRole([
  //       this.permissions.OFFICE_TIMELINE_VIEW,
  //       this.permissions.ROLE_ADMIN_EXECUTIVE,
  //       this.permissions.ROLE_TEAM_LEADER
  //     ]);
  //   }
  get isPermissionContactEdit(): boolean { return this.contactService.isPermissionEdit; }
  get isPermissionTeamEdit(): boolean { return this.contactService.isPermissionTeamContactEdit; }
  get isPermissionProjectEdit(): boolean { return this.projectService.isPermissionEdit; }
  get isPermissionTodoEdit():boolean{return this.todoService.isPermissionEdit}
  get isPermissionLeaveEdit():boolean{return this.leaveService.isPermissionEdit}
  get isPermissionMeetingEdit():boolean{return this.meetingService.isPermissionEdit}
  get isPermissionSitevisitEdit():boolean{return this.SitevisitService.isPermissionEdit}
  get IsPermissionRequestTicketEdit(): boolean { return this.requestTicketService.isPermissionEdit; }
  get isPermissionAssetEdit(): boolean { return this.assetService.isPermissionEdit; } 
  get isRoleMaster(){return this.authService.isRoleMaster}
  // get isPermissionUserSessions(): boolean
  // {
  //   return this.authService.isInAnyRole([
  //     this.permissions.ROLE_PROPRIETOR1,
  //     this.permissions.ROLE_ADMIN_EXECUTIVE
  //   ]);
  // }

  get ROUTE_SESSIONS() { return this.config.ROUTE_SESSIONS; }
  get ROUTE_CHANGE_PASSWORD() { return this.config.ROUTE_CHANGE_PASSWORD; }

  ngOnDestroy()
  {

  }
  // ngOnInit()
  // {
  //   // if (!this.user || !this.user.isAuth)
  //   // {
  //   //   this.logout();
  //   // }

    
  //   this.checkForVersionUpdate();
  //   if (this.appSettingService.presets.length == 0)
  //   {
  //     this.appSettingService.loadPresets();
  //   }

  //   if (this.authService.currentUserStore && this.authService.currentUserStore.isChangePassword)
  //   {

  //     this.router.navigate([this.config.ROUTE_CHANGE_PASSWORD]);
  //   }

  //   this.authService.refreshRoles();

  // }

  ngOnInit() {

    const token = localStorage.getItem("token") || "";

    /* SIGNALR CONNECTION */
    this.signalR.startConnection(token);

    /* LOAD EXISTING NOTIFICATIONS FROM DB */
    this.notificationService.loadNotificationsFromApi();

    /* SUBSCRIBE TO NOTIFICATION STREAM */
    this.notificationService.getNotifications()
      .subscribe((data) => {
        this.notifications = data;
      });

    this.checkForVersionUpdate();

    if (this.appSettingService.presets.length === 0) {
      this.appSettingService.loadPresets();
    }

    if (this.authService.currentUserStore?.isChangePassword) {
      this.router.navigate([this.config.ROUTE_CHANGE_PASSWORD]);
    }

    this.authService.refreshRoles();
  }

  isNewVersionAvailable: boolean = false;
  private checkForVersionUpdate() {

    this.appService.getIsVersionUpdateAvailable().subscribe((value) => {
      setTimeout(() => {
        this.isNewVersionAvailable = value;
      });
    });
  }



   // ------------------- Notifications -------------------
  notifications: { message: string; isRead: boolean }[] = [];

  get unreadNotificationCount(): number {
    return this.notifications.filter((n) => !n.isRead).length;
  }

  loadNotifications() {
    if (!this.authService.currentUserStore) return;

    this.notifications = [
      { message: "New Task assigned to you", isRead: false },
      { message: "Meeting scheduled today", isRead: false },
    ];
  }

  markAsRead(notification: any) {
    notification.isRead = true;
  }

  openNotifications() {
    this.router.navigate(["/notifications"]);
  }

  // -----------------------------------------------------


  updateVersion() {
    this.swUpdate.activateUpdate().then(() => {
      this.utilityService.showSwalToast('Version Update', 'New version installed!');
      window.location.reload();
    });
  }

  onClickLogout()
  {
    this.authService.logout();
  }

  openRoute(routeCommand: string, inNewTab: boolean = false)
  {
    if (inNewTab)
    {
      let newRelativeUrl = this.router.createUrlTree([routeCommand]);
      let baseUrl = window.location.href.replace(this.router.url, '');

      window.open(baseUrl + newRelativeUrl);
    } else
    {
      this.router.navigate([routeCommand]);
    }
  }




  openNewContact()
  {
    this.contactService.openDialog(ContactCreateComponent, { data: new Contact() });
  }

  openNewTeam()
  {
    this.contactService.openDialog(ContactTeamCreateComponent, { data: new Contact() });
  }

  openNewProject()
  {
    this.projectService.openDialog(ProjectCreateComponent, { data: new Project() });
  }

  openNewTodo(){
    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.panelClass = 'mcv-fullscreen-dialog';
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
   

    const _dialogRef = this.dialog.open(TodoCreateDialogComponent, dialogConfig);
    _dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.todoService.refreshList();
      }
    });
  }

  createAsset(dialogTitle: string) {
    const dialogConfig = new MatDialogConfig();

    // if (isFullScreen)
    //   dialogConfig.panelClass = 'mcv-fullscreen-dialog';

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      dialogTitle: dialogTitle,
    }

    this.dialog.open(AssetCreateComponent, dialogConfig);

  }


  async changePhoto() {
    if (this.user != null) {
      const _contact = await firstValueFrom(this.contactService.getById(this.user.contact.id));
      if (_contact) {

        let _dialogData = {
          dialogTitle: "Change My Photo",
          contact: _contact,
        };

        const dialogRef = this.contactService.openDialog(ContactPhotoEditorComponent, _dialogData);
        dialogRef.afterClosed().subscribe((res: any) => {
          if (res && this.user != null) {
            // console.log('onClose', res);
            this.user.contact.photoUrl = res.photoUrl;
            this.authService.setUserStore(this.user);
            //Reloads the window when this action takes place
            // window.location.reload();
            this.utilityService.showSwalToast('Success', 'Team Member saved successfully.');
          }
        });
      }
    }
  }

  refresh()
  {
    window.location.reload();
  }

  public promptEvent!:any;

  @HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(e:any) {
    e.preventDefault();
    this.promptEvent = e;
  }

  public installPWA() {
    this.promptEvent.prompt();
  }

  get shouldInstall(): boolean {
    return !this.isRunningStandalone() && this.promptEvent;
  }

  public isRunningStandalone(): boolean {
    return (window.matchMedia('(display-mode: standalone)').matches);
  }

  async subscribeToPush()
  {
    if (this.authService.currentUserStore && this.authService.currentUserStore.isAuth)
    {
      await this.webPushService.subscribe();
      console.log('subscribed', this.webPushService.subscription);
    }
  }

  async unsubscribeToPush() {
    if (this.authService.currentUserStore && this.authService.currentUserStore.isAuth) {
      this.webPushService.unSubscribe();
      await firstValueFrom(this.webPushService.deleteByUsername(this.authService.currentUserStore.username));
      console.log('unsubscribed all');
      if (localStorage.getItem('web-push-subscription')) {
        localStorage.removeItem('web-push-subscription');
      }
      this.utilityService.showSwalToast('Success', "Unsubscribed all devices successfully");
    }
  }

  openNewRequestTicket(){
    const _dialogConfig = new MatDialogConfig();
    _dialogConfig.disableClose = true;
    _dialogConfig.autoFocus = true;
    _dialogConfig.panelClass = 'mcv-fullscreen-dialog';

    const _dialogRef = this.dialog.open(RequestTicketCreateComponent,_dialogConfig);
    _dialogRef.afterClosed().subscribe(res =>{
      this.requestTicketService.refreshList()
      // console.log(res);
    });
  }

  openNewLeave(){
    const _dialogConfig = new MatDialogConfig();
    _dialogConfig.disableClose = true;
    _dialogConfig.autoFocus = true;

    const _dialogRef = this.dialog.open(LeaveCreateComponent,_dialogConfig);
    _dialogRef.afterClosed().subscribe(res =>{
      // console.log(res);
      this.leaveService.refreshList();
    });
  }

  openNewMeeting(){
    const _dialogConfig = new MatDialogConfig();
    _dialogConfig.disableClose = true;
    _dialogConfig.autoFocus = true;

    const _dialogRef = this.dialog.open(MeetingCreateComponent,_dialogConfig);
    _dialogRef.afterClosed().subscribe(res =>{
      // console.log(res);
      this.meetingService.refreshList();
    });
  }

  openNewSiteVisit(){
  const _dialogConfig = new MatDialogConfig();
  _dialogConfig.disableClose = true;
  _dialogConfig.autoFocus = true;

  const _dialogRef = this.dialog.open(SitevisitCreateComponent,_dialogConfig);
  _dialogRef.afterClosed().subscribe(res =>{
    console.log(res);
  });
}


openWorkFromHome() {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;

  const dialogRef = this.dialog.open(WorkFromHomeComponent, dialogConfig);

  dialogRef.afterClosed().subscribe(() => {
    this.leaveService.refreshList();
  });
}

  onClickDataBank() {
    window.open('https://ecomumbai.ezconnect.to/');
  }

  canAccess(module: string): boolean {
    if (!this.user) return false;
    if (this.user.isOutsideIP) {
      return !!this.user.allowedModules?.includes(module);
    }
    return true;
  }
}

