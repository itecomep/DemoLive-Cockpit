import { Component, Input } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { debounceTime, distinctUntilChanged, firstValueFrom } from 'rxjs';
import { ApiFilter } from 'src/app/shared/models/api-filters';
import { Meeting } from 'src/app/meeting/models/meeting.model';
import { ProjectApiService } from '../../services/project-api.service';
import { MeetingApiService } from 'src/app/meeting/services/meeting-api.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgIf, NgFor, DecimalPipe, DatePipe } from '@angular/common';
import { Project } from '../../models/project.model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { StatusMaster } from 'src/app/shared/models/status-master-dto';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { StatusMasterService } from 'src/app/shared/services/status-master.service';
import { co } from '@fullcalendar/core/internal-common';
import { MatInputModule } from "@angular/material/input";
import { MaterialImportModule } from "src/app/material-import/material-import.module";
import { PageEvent } from '@angular/material/paginator';
import { McvComponentDialogConfig } from 'src/app/shared/models/mcv-component-dialog-config';
import { ProjectMeetingViewDialogComponent } from '../project-meeting-view-dialog/project-meeting-view-dialog.component';
import { ContactPhotoNameDialogComponent } from 'src/app/shared/components/contact-photo-name-dialog/contact-photo-name-dialog.component';

@Component({
    selector: 'app-project-meeting-view',
    templateUrl: './project-meeting-view.component.html',
    styleUrls: ['./project-meeting-view.component.scss'],
    standalone: true,
    imports: [NgIf, NgFor, MatTooltipModule, MatButtonModule, MatIconModule, DecimalPipe, DatePipe, MatInputModule, MaterialImportModule, ReactiveFormsModule]
})
export class ProjectMeetingViewComponent {
  protected readonly nameOfEntity = this.config.NAMEOF_ENTITY_MEETING;
  projectID!: number;
  project!: Project;
  pageIndex: number = 0;
  pageSize: number = 30;
  totalRecordsCount!: number;
  totalPages!: number;
  keyPropertyName = 'id';
  meetings: Meeting[] = [];
  defaultFilter: ApiFilter[] = [];

  @Input('project') set projectValue(value: Project) {
    if (value && this.projectID !== value.id) {
      this.projectID = value.id;
      this.project = value;
      this.defaultFilter =[]

      this.defaultFilter.push(
        { key: "isReadonly", value: "false" },
        {
          key: "statusFlag",
          value: this.config.MEETING_STATUSFLAG_PENDING.toString(),
        },
        {
          key: "statusFlag",
          value: this.config.MEETING_STATUSFLAG_SENT.toString(),
        },
        { key: "projectID", value: this.projectID.toString() },
      );

      // Apply filters based on user role:
      // 1. Role masters can see all tickets (no filter applied)
      // 2. Project managers can see all tickets for their projects (no filter applied)
      // 3. Team leaders can see tickets sent by themselves, their team members, or where they are in TO/CC/BCC
      // 4. Regular users only see tickets assigned to them (filter applied)

      if(!this.authService.isRoleMaster && this.authService.currentUserStore?.contact &&
        this.project.projectManagerContactID !== this.authService.currentUserStore?.contact.id) {

          if(this.authService.isTeamLeader) {
            this.defaultFilter.push(
              { key: "teamLeaderContactID", value: this.authService.currentUserStore?.contact.id.toString() }
            );
          }
          else {
          // Normal members only see tickets where they are in To, Cc, or Bcc
          this.defaultFilter.push(
            { key: "assigneeContactID", value: this.authService.currentUserStore?.contact.id.toString() }
          );
        }
      }
      this.getProjectMeeting();
  }
}
  statusFlagFilterKey: string = "statusFlag";
  searchFC = new FormControl<any>(null);
  statusFC = new FormControl<StatusMaster[]>([]);
  statusOptions: StatusMaster[] = [];

  get MEETING_STATUSFLAG_SENT() { return this.config.MEETING_STATUSFLAG_SENT }
  get projectMeetings() { return this.projectService.projectMeetings || []; }

  constructor(
    private config: AppConfig,
    private projectService: ProjectApiService,
    private meetingApiService: MeetingApiService,
    private authService: AuthService,
    private dialog: MatDialog,
    private utilityService: UtilityService,
    private statusMasterService: StatusMasterService
  ) { }

  async getProjectMeeting() {
    this.meetings=[];
    let _data = await firstValueFrom(this.meetingApiService.getPages(
      this.pageIndex,
      this.pageSize,
      this.defaultFilter,
      this.searchFC.value ? this.searchFC.value : undefined
    ));
    this.totalRecordsCount = _data.total;
    this.totalPages = _data.pages;
    this.meetings= this.utilityService.updatePagedList<any>(
      _data.list,
      this.meetings,
      this.keyPropertyName
    );
    console.log(this.meetings);
  }
    
  handlePageEvent(e: PageEvent) {
      this.pageSize = e.pageSize;
      this.pageIndex = e.pageIndex;
      if (this.pageSize && this.pageIndex) {
        // this.refresh();
        this.getProjectMeeting();
      }
    }

  async ngOnInit() {
      await this.getStatusOptions();
      //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
      //Add 'implements OnInit' to the class.
      this.searchFC.valueChanges
        .pipe(debounceTime(400), distinctUntilChanged())
        .subscribe((x) => {
          this.getProjectMeeting();
        });
  
      this.statusFC.valueChanges
        .pipe(debounceTime(400), distinctUntilChanged())
        .subscribe((value) => {
          if (value) {
            this.defaultFilter = this.defaultFilter.filter(
              (i) => i.key !== this.statusFlagFilterKey
            );
            value.forEach((element: StatusMaster) => {
              this.addFilter(this.statusFlagFilterKey, element.value.toString());
            });
            this.getProjectMeeting();
          }
        });
    }

    private async getStatusOptions() {
    this.statusOptions = await firstValueFrom(
      this.statusMasterService.get([
        { key: "Entity", value: this.nameOfEntity },
      ])
    );
    const filter = this.defaultFilter.filter((x) => x.key == "statusFlag");
    if (filter && this.statusOptions.length != 0) {
      const _filter = this.statusOptions.filter((x) =>
        filter.some((y) => y.value == x.value.toString())
      );
      this.statusFC.setValue(_filter, { emitEvent: false });
    }
  }

  addFilter(key: string, value: string) {
    const _filter = this.defaultFilter.find((obj) => {
      return obj.key === key && obj.value === value;
    });
    if (!_filter) {
      this.defaultFilter.push({ key: key, value: value });
    }
    // console.log(" this.defaultFilter", this.defaultFilter);
  }

  async openMeeting(item: Meeting) {
      // console.log(" this.requestTickets", this.requestTickets);
      let _dialogData = new McvComponentDialogConfig();
      // _dialogData.data = item;
      // _dialogData.entityID = entityID;
      // _dialogData.entityTypeFlag = entityTypeFlag;
      _dialogData.isReadOnly = true;
      // _dialogData.isTaskMode = isTaskmode;
      _dialogData.currentEntity = item;
      // Object.assign(_dialogData.currentEntity,item)
      const dialogRef = this.projectService.openDialog(
        ProjectMeetingViewDialogComponent,
        _dialogData,
        true
      );
      dialogRef.afterClosed().subscribe((res) => {
        if (res) {
        }
      });
    }

    openPhotoDialog(member: any ) {
        this.dialog.open(ContactPhotoNameDialogComponent, {
          data: member
        });
      }
  // async openMeeting(item: Meeting) {
  //   const versions = await firstValueFrom(this.meetingApiService.get([{ key: 'isReadOnly', value: 'true' }, { key: 'parentid', value: item.id.toString() }]));
  //   versions.sort((a, b) => (new Date(b.created)).getTime() - (new Date(a.created)).getTime());
  //   if (versions && versions.length > 0) {
  //     this.meetingApiService.openHtmlView(versions[0].uid);
  //   } else {
  //     this.meetingApiService.openHtmlView(item.uid);
  //   }
  // }
}
