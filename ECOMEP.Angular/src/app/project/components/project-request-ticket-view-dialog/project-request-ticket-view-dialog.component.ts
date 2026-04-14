import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { RequestTicketComponent } from "../../../request-ticket/components/request-ticket/request-ticket.component";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { AppConfig } from "src/app/app.config";
import { McvFileComponent } from "src/app/mcv-file/components/mcv-file/mcv-file.component";
import { firstValueFrom } from "rxjs";
import { RequestTicketApiService } from "src/app/request-ticket/services/request-ticket-api.service";
import { RequestTicket } from "src/app/request-ticket/models/request-ticket";
import { RequestTicketAssigneeApiService } from "src/app/request-ticket/services/request-ticket-assignee-api.service";
import { RequestTicketAssignee } from "src/app/request-ticket/models/request-ticket-assignee";
import { MatAccordion, MatExpansionModule } from "@angular/material/expansion";

@Component({
  selector: "app-project-request-ticket-view-dialog",
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    RequestTicketComponent,
    MatCheckboxModule,
    McvFileComponent,
    MatExpansionModule,
  ],
  templateUrl: "./project-request-ticket-view-dialog.component.html",
  styleUrls: ["./project-request-ticket-view-dialog.component.scss"],
})
export class ProjectRequestTicketViewDialogComponent implements OnInit {
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  data: any;
  currentEntity: any;
  toAttendees: any[] = [];
  ccAttendees: any[] = [];
  bccAttendees: any[] = [];
  historyList: RequestTicket[] = [];

  get REQUEST_TICKET_ASSIGNEE_TYPEFLAG_TO() {
    return this.assigneeService.REQUEST_TICKET_ASSIGNEE_TYPEFLAG_TO;
  }
  get REQUEST_TICKET_ASSIGNEE_TYPEFLAG_CC() {
    return this.assigneeService.REQUEST_TICKET_ASSIGNEE_TYPEFLAG_CC;
  }
  get REQUEST_TICKET_ASSIGNEE_TYPEFLAG_BCC() {
    return this.assigneeService.REQUEST_TICKET_ASSIGNEE_TYPEFLAG_BCC;
  }

  constructor(
    private dialogRef: MatDialogRef<ProjectRequestTicketViewDialogComponent>,
    public config: AppConfig,
    private entityService: RequestTicketApiService,
    private assigneeService: RequestTicketAssigneeApiService,
    @Inject(MAT_DIALOG_DATA) private dialogData: any
  ) {
    this.data = dialogData;
  }

  async getRequestTicket(id: number) {
    this.currentEntity = await firstValueFrom(this.entityService.getById(id));
    // console.log("this.historyList", this.currentEntity);
  }
  
  async ngOnInit() {
    if (this.data && this.data.currentEntity) {
      await this.getRequestTicket(this.data.currentEntity.id);
      await this.getCurrentHistory(
        this.config.NAMEOF_ENTITY_REQUEST_TICKET,
        this.data.currentEntity.id
      );

    }
    const assignees = this.currentEntity?.assignees ?? [];

    this.toAttendees = assignees.filter(
      (a: any) => a.typeFlag === this.config.REQUEST_TICKET_ASSIGNEE_TYPEFLAG_TO
    );

    this.ccAttendees = assignees.filter(
      (a: any) => a.typeFlag === this.config.REQUEST_TICKET_ASSIGNEE_TYPEFLAG_CC
    );

    this.bccAttendees = assignees.filter(
      (a: any) =>
        a.typeFlag === this.config.REQUEST_TICKET_ASSIGNEE_TYPEFLAG_BCC
    );
  }

  onClose() {
    this.dialogRef.close();
  }

  private async getCurrentHistory(entity: string, entityID: number) {
    this.historyList = await firstValueFrom(
      this.entityService.get([
        { key: "parentID", value: entityID.toString() },
        { key: "isreadonly", value: "true" },
      ])
    );
    // console.log(" this.historyList", this.historyList);
  }

  getFilteredAssignees(
    assignees: RequestTicketAssignee[],
    typeFlag: number = 0
  ): RequestTicketAssignee[] {
    if (assignees) {
      return assignees.filter((x) => x.typeFlag == typeFlag);
    }
    return [];
  }
}
