import { Component, inject } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ContactApiService } from 'src/app/contact/services/contact-api.service';
import { AppService } from 'src/app/shared/services/app.service';
import { RouterLinkActive, RouterLink, Router } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { ProjectApiService } from 'src/app/project/services/project-api.service';
import { TodoApiService } from 'src/app/todo/services/todo-api.service';
import { WFTaskApiService } from 'src/app/wf-task/services/wf-task-api.service';
import { RequestTicketApiService } from 'src/app/request-ticket/services/request-ticket-api.service';
import { LeaveApiService } from 'src/app/leave/services/leave-api.service';
import { MeetingApiService } from 'src/app/meeting/services/meeting-api.service';
import { SiteVisitApiService } from 'src/app/site-visit/services/site-visit-api.service';
import { AppPermissions } from 'src/app/app.permissions';
import { AssetApiService } from 'src/app/asset/services/asset-api.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-menu-sidebar',
  templateUrl: './menu-sidebar.component.html',
  styleUrls: ['./menu-sidebar.component.scss'],
  standalone: true,
  imports: [NgClass, NgIf, RouterLinkActive, RouterLink]
})
export class MenuSidebarComponent {

  constructor(private http: HttpClient, private elRef: ElementRef) {}

  public readonly config = inject(AppConfig);
  private readonly appService = inject(AppService);
  public readonly authService = inject(AuthService);
  private readonly todoService = inject(TodoApiService);
  private readonly wfTaskService = inject(WFTaskApiService);
  private readonly contactService = inject(ContactApiService);
  private readonly projectService = inject(ProjectApiService);
  private readonly leaveService = inject(LeaveApiService);
  private readonly meetingService = inject(MeetingApiService);
  private readonly siteVisitService = inject(SiteVisitApiService);
  private readonly requestTicketService = inject(RequestTicketApiService);
  private readonly assetService = inject(AssetApiService);
  private readonly permissions = inject(AppPermissions);
    private readonly router = inject(Router);

  showMenu: boolean = false;
  // isPermissionWorkFromHome: boolean =  true;

  get isPermissionContactList() { return this.contactService.isPermissionList; }
  get isPermissionTeamList(): boolean { return this.contactService.isPermissionTeamList; }
  get isPermissionProjectList() { return this.projectService.isPermissionList; }

//   get isPermissionList(): boolean {
//   return this.authService.isInAnyRole([
//     this.permissions.PROJECT_TARGET_VIEW,
//     this.permissions.MASTER
//   ]);
// }
  get isPermissionTodoList() { return this.todoService.isPermissionList; }
  get isPermissionTaskList() { return this.wfTaskService.isPermissionList; }
  get isPermissionRequestTicketList() { return this.requestTicketService.isPermissionList; }
  get isPermissionMeetingList() { return this.meetingService.isPermissionList; }
  get isPermissionSiteVisitList() { return this.siteVisitService.isPermissionList; }
  get isPermissionAssetList() { return this.assetService.isPermissionList; }
  get isPermissionLeaveList() { return this.leaveService.isPermissionList; }
  get isPermissionMaster() { return this.authService.isRoleMaster }
  get isPermissionAllowedIpView(): boolean { return this.authService.isAllowedIpBypassView;}
  get isPermissionAnalysisListView(): boolean { return this.authService.isAnalysisListView; }
  get isPermissionTaskView(): boolean { return this.authService.isTaskView; }

  get isPermissionWorkFromHome(): boolean {
  return this.authService.isInAnyRole([this.permissions.HR_MODULE]);
}
 

  ngOnInit(): void {
    this.getMenuStatus();
  }

  getMenuStatus() {
    this.appService.getMenuStatus().subscribe((value) => {
      setTimeout(() => {
        this.showMenu = value;
      });
    });``
  }

  onCloseMenu() {
    this.appService.setMenuStatus(false);
  }

  

  openTask() {
    this.http.post<any>(
      `${environment.apiPath}/Auth/GenerateTaskSsoToken`,
      {},
      { withCredentials: true } 
    ).subscribe({
      next: (res) => {
        if (res.token) {
          window.location.href = `http://localhost:5173/sso-login?token=${res.token}`, '_blank';
          //  window.open(`https://task.pointcloudengg.com/sso-login?token=${res.token}`, "_blank");
        } else if (res.redirectUrl) {
          // window.location.href = res.redirectUrl;
           window.open(res.redirectUrl, "_blank");
        } else {
          console.error("No token received:", res);
        }
      },
      error: (err) => console.error("Cockpit token error:", err)
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.elRef.nativeElement.contains(event.target);

    if (!clickedInside && this.showMenu) {
      this.appService.setMenuStatus(false);
    }
  }

  
  closeMenuDelayed() {
  setTimeout(() => {
    this.appService.setMenuStatus(false);
  }, 100);
}

// get isPermissionProjectTarget(): boolean {
//   return this.authService.isRoleMaster;
// }

get isPermissionProjectTarget(): boolean {
  return this.authService.isInAnyRole([
    this.permissions.PROJECT_TARGET_VIEW,
    this.permissions.MASTER
  ]);
}
}
