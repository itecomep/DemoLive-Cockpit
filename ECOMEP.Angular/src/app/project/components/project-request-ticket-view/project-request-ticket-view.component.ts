import { debounceTime, distinctUntilChanged, firstValueFrom } from "rxjs";
import { Component, Input, ViewChild } from "@angular/core";
import { ApiFilter } from "src/app/shared/models/api-filters";

import { ProjectApiService } from "../../services/project-api.service";
import { RequestTicketApiService } from "src/app/request-ticket/services/request-ticket-api.service";
import { RequestTicket } from "src/app/request-ticket/models/request-ticket";
import { RequestTicketAssignee } from "src/app/request-ticket/models/request-ticket-assignee";
import { RequestTicketAssigneeApiService } from "src/app/request-ticket/services/request-ticket-assignee-api.service";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { NgIf, NgFor, DatePipe } from "@angular/common";
import { McvComponentDialogConfig } from "src/app/shared/models/mcv-component-dialog-config";
import { ProjectRequestTicketViewDialogComponent } from "../project-request-ticket-view-dialog/project-request-ticket-view-dialog.component";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";

import { StatusMaster } from "src/app/shared/models/status-master-dto";
import { MatOptionModule } from "@angular/material/core";
import { AppConfig } from "src/app/app.config";
import { StatusMasterService } from "src/app/shared/services/status-master.service";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatAccordion } from "@angular/material/expansion";
import { UtilityService } from "src/app/shared/services/utility.service";
import { AuthService } from "src/app/auth/services/auth.service";
import { Project } from "../../models/project.model";
import { ContactPhotoNameDialogComponent } from "src/app/shared/components/contact-photo-name-dialog/contact-photo-name-dialog.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-project-request-ticket-view",
  templateUrl: "./project-request-ticket-view.component.html",
  styleUrls: ["./project-request-ticket-view.component.scss"],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    DatePipe,
    MatPaginatorModule,
    FormsModule,
    MatInputModule,
    MatOptionModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
})
export class ProjectRequestTicketViewComponent {
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  protected readonly nameOfEntity = this.config.NAMEOF_ENTITY_REQUEST_TICKET;
  projectID!: number;
  project!: Project;
  pageIndex: number = 0;
  pageSize: number = 30;
  totalRecordsCount!: number;
  totalPages!: number;
  keyPropertyName = "id";
  requestTickets: RequestTicket[] = [];
  defaultFilter: ApiFilter[] = [];
  @Input("project") set reqID(value: Project) {
    if (value) {
      // console.log('this.requestTickets',this.requestTickets);
      this.projectID = value.id;
      this.project= value;
      this.defaultFilter = []
   
      this.defaultFilter.push(
        { key: "isReadonly", value: "false" },
        {
          key: "statusFlag",
          value: this.config.REQUEST_TICKET_STATUSFLAG_ACTIVE.toString(),
        },
        {
          key: "statusFlag",
          value: this.config.REQUEST_TICKET_STATUSFLAG_CLOSED.toString(),
        },
        { key: "projectID", value: this.projectID.toString() },

      );

      // Apply filters based on user role:
      // 1. Role masters can see all tickets (no filter applied)
      // 2. Project managers can see all tickets for their projects (no filter applied)
      // 3. Team leaders can see tickets sent by themselves, their team members, or where they are in TO/CC/BCC
      // 4. Regular users only see tickets assigned to them (filter applied)
      if (!this.authService.isRoleMaster && this.authService.currentUserStore?.contact &&
         this.project.projectManagerContactID !== this.authService.currentUserStore?.contact.id) {
        
        if (this.authService.isTeamLeader) {
          // Team leader can see tickets from themselves, team members, or where they are assignees
          this.defaultFilter.push(
            { key: "teamLeaderContactID", value: this.authService.currentUserStore?.contact.id.toString() }
          );
        } else {
          // Normal members only see tickets where they are in To, Cc, or Bcc
          this.defaultFilter.push(
            { key: "assigneeContactID", value: this.authService.currentUserStore?.contact.id.toString() }
          );
        }
      }

      this.getProjectRequestTicket();
    }
  }

  statusFlagFilterKey: string = "statusFlag";
  searchFC = new FormControl<any>(null);
  statusFC = new FormControl<StatusMaster[]>([]);
  statusOptions: StatusMaster[] = [];
  get REQUEST_TICKET_ASSIGNEE_TYPEFLAG_TO() {
    return this.assigneeService.REQUEST_TICKET_ASSIGNEE_TYPEFLAG_TO;
  }
  get REQUEST_TICKET_ASSIGNEE_TYPEFLAG_CC() {
    return this.assigneeService.REQUEST_TICKET_ASSIGNEE_TYPEFLAG_CC;
  }

  // get requestTickets() {
  //   return this.projectService.requestTickets;
  // }

  constructor(
    public projectService: ProjectApiService,
    private requestTicketService: RequestTicketApiService,
    private assigneeService: RequestTicketAssigneeApiService,
    private config: AppConfig,
    private statusMasterService: StatusMasterService,
    private utilityService: UtilityService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  getFilteredAssignees(
    assignees: RequestTicketAssignee[],
    typeFlag: number = 0
  ): RequestTicketAssignee[] {
    if (assignees) {
      return assignees.filter((x) => x.typeFlag == typeFlag);
    }
    return [];
  }

  async getProjectRequestTicket() {
    this.requestTickets = [];
    let _data = await firstValueFrom(this.requestTicketService.getPages(
      this.pageIndex,
      this.pageSize,
      this.defaultFilter,
      this.searchFC.value ? this.searchFC.value : undefined
    ));
    this.totalRecordsCount = _data.total;
    this.totalPages = _data.pages;
    this.requestTickets = this.utilityService.updatePagedList<any>(
      _data.list,
      this.requestTickets,
      this.keyPropertyName
    );
    // console.log(
    //   "this.projectService.requestTickets",
    //   this.requestTickets
    // );
  }

  async openRequestTicket(item: RequestTicket) {
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
      ProjectRequestTicketViewDialogComponent,
      _dialogData,
      true
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
      }
    });
  }

  async ngOnInit() {
    await this.getStatusOptions();
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.searchFC.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((x) => {
        this.getProjectRequestTicket();
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
          this.getProjectRequestTicket();
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

  handlePageEvent(e: PageEvent) {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    if (this.pageSize && this.pageIndex) {
      // this.refresh();
      this.getProjectRequestTicket();
    }
  }

  openPhotoDialog(member: any ) {
        this.dialog.open(ContactPhotoNameDialogComponent, {
          data: member
        });
      }
}
