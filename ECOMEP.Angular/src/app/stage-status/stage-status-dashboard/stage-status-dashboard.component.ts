import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { CreateStagePopupComponent } from "../create-stage-popup/create-stage-popup.component";
import { StageService } from "../services/stage.service";
import { ProjectStageMailViewComponent } from "../project-stage-mail-view/project-stage-mail-view.component";
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { ProjectApiService } from "src/app/project/services/project-api.service";
import { ProjectAssociationDialogComponent } from "src/app/gmail/project-association-dialog/project-association-dialog.component";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { UtilityService } from "src/app/shared/services/utility.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-stage-status-dashboard",
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    MatInputModule,
  ],
  templateUrl: "./stage-status-dashboard.component.html",
  styleUrls: ["./stage-status-dashboard.component.scss"],
})
export class StageStatusDashboardComponent implements OnInit {
  mails: any[] = [];
  isLoading = false;
  selectedMail: any = null;
  searchText = "";
  filteredMails: any[] = [];
  groupedMails: any[] = [];
  filteredGroupedMails: any[] = [];
  associationDialogRef: any;

  constructor(
    private dialog: MatDialog,
    private stageService: StageService,
    private projectService: ProjectApiService,
    private http: HttpClient,
    private utilityService: UtilityService,
  ) {}

  ngOnInit(): void {
    this.loadMails();
  }

  // loadMails() {
  //   const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  //   const userId = currentUser.userId;
  //   if (!userId) return;
  //   this.isLoading = true;
  //   this.stageService.getUserProjectStageMails(userId).subscribe({
  //     next: (res: any[]) => {
  //       this.mails = res || [];
  //       this.prepareGroupedMails(this.mails);
  //       this.isLoading = false;
  //     },
  //     error: (err) => {
  //       console.error(err);
  //       this.isLoading = false;
  //     },
  //   });
  // }

  loadMails() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const isFullAccess = currentUser.roles?.includes("MASTER") || false;

    this.isLoading = true;

    this.projectService
      .getProjectsForEmail(0, 10000, isFullAccess)
      .subscribe({
        next: (projectRes: any) => {

          const projectIds = (projectRes?.list || []).map((p: any) => p.id);

          if (!projectIds.length) {
            this.mails = [];
            this.groupedMails = [];
            this.isLoading = false;
            return;
          }

          this.stageService.getUserProjectStageMails(projectIds).subscribe({
            next: (mailRes: any[]) => {
              this.mails = mailRes || [];
              this.prepareGroupedMails(this.mails);
              this.isLoading = false;
            },
            error: (err) => {
              console.error(err);
              this.isLoading = false;
            }
          });
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
        }
      });
  }

  prepareGroupedMails(data: any[]) {
    const grouped: any = {};
    data.forEach((mail) => {
      const key = `${mail.projectName}_${mail.stageName}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(mail);
    });

    this.groupedMails = Object.keys(grouped).map((key) => {
      const mails = grouped[key].sort(
        (a: any, b: any) =>
          new Date(b.mailSentDate).getTime() -
          new Date(a.mailSentDate).getTime(),
      );
      return {
        projectName: mails[0].projectName,
        stageName: mails[0].stageName,
        latest: mails[0],
        history: mails.slice(1),
        expanded: false,
      };
    });
    this.filteredGroupedMails = [...this.groupedMails];
  }

  toggleRow(group: any, event: Event) {
    event.stopPropagation();
    group.expanded = !group.expanded;
  }

  openPopup() {
    const dialogRef = this.dialog.open(CreateStagePopupComponent, {
      width: "70vw",
      height: "90vh",
      maxWidth: "70vw",
      maxHeight: "90vh",
      position: {
        left: "20px",
      },
      disableClose: true,
      panelClass: "stage-popup-dialog",
    });
    dialogRef.afterClosed().subscribe(() => {
      this.loadMails();
    });
  }

  openMail(item: any) {
    this.selectedMail = item;
    this.dialog.open(ProjectStageMailViewComponent, {
      width: "75vw",
      height: "85vh",
      maxWidth: "95vw",
      data: item,
    });
  }

  onSearch() {
    const value = this.searchText.toLowerCase().trim();
    if (!value) {
      this.filteredGroupedMails = [...this.groupedMails];
      return;
    }

    this.filteredGroupedMails = this.groupedMails.filter((group: any) => {
      const allMails = [group.latest, ...group.history];

      return allMails.some((item: any) => {
        const formattedDate = item.mailSentDate
          ? new Date(item.mailSentDate).toLocaleString("en-GB").toLowerCase()
          : "";
        return (
          item.projectName?.toLowerCase().includes(value) ||
          item.stageName?.toLowerCase().includes(value) ||
          item.subject?.toLowerCase().includes(value) ||
          item.toMail?.toLowerCase().includes(value) ||
          item.ccMail?.toLowerCase().includes(value) ||
          item.bccMail?.toLowerCase().includes(value) ||
          item.stageCompleteRevision?.toLowerCase().includes(value) ||
          item.generateInvoiceRevision?.toLowerCase().includes(value) ||
          item.reworkRevision?.toLowerCase().includes(value) ||
          formattedDate.includes(value) ||
          (item.stageComplete && "stage complete".includes(value)) ||
          (item.generateInvoice && "generate invoice".includes(value)) ||
          (item.rework && "rework".includes(value))
        );
      });
    });
  }

  openProjectAssociation(item: any, event: Event) {
    event.stopPropagation();
    const projectName = item.projectName;
    this.projectService
      .getProjectsForEmail(0, 10000, true)
      .subscribe((res: any) => {
        const projects = res?.list || [];

        const matchedProject = projects.find(
          (p: any) => `${p.code} - ${p.title}` === projectName,
        );

        if (!matchedProject) {
          console.log("Project not found");
          return;
        }

        this.projectService
          .getById(matchedProject.id)
          .subscribe((project: any) => {
            const associations = (project.associations || []).map((a: any) => ({
              ...a,
              contact: {
                ...a.contact,
                mobile: a.contact?.mobile || a.contact?.phone || "",
              },
            }));

            if (this.associationDialogRef) {
              this.associationDialogRef.close();
            }

            this.associationDialogRef = this.dialog.open(
              ProjectAssociationDialogComponent,
              {
                width: "400px",
                height: "80vh",
                panelClass: "side-dialog",
                hasBackdrop: false,
                position: {
                  right: "10px",
                  top: "100px",
                },
                data: {
                  associations,
                  parent: {
                    addToRecipients: (
                      association: any,
                      type: "TO" | "CC" | "BCC",
                    ) => {
                      const contact = association?.contact;
                      if (!contact?.email) return;
                      const email = contact.email;
                      if (type === "TO") {
                        item.toMail = email;
                      }
                      if (type === "CC") {
                        item.ccMail = email;
                      }
                      if (type === "BCC") {
                        item.bccMail = email;
                      }
                      const currentUser = JSON.parse(
                        localStorage.getItem("currentUser") || "{}",
                      );

                      const payload = {
                        userId: currentUser.userId?.toString(),
                        to: item.toMail || "",
                        cc: item.ccMail || "",
                        bcc: item.bccMail || "",
                        subject: item.subject || "",
                        body: item.body || "",
                        // threadId: item.gmailThreadId || null,
                        // replyMessageId: item.gmailMessageId || null,
                        threadId: null,
                        replyMessageId: null,
                        attachments: [],
                        attachmentsMeta: [],
                        projectId: item.projectId,
                      };

                      Swal.fire({
                        title: 'Send Mail?',
                        text: `Are you sure you want to send mail to ${email}?`,
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'Yes Send',
                        cancelButtonText: 'Cancel',
                        confirmButtonColor: '#1976d2'
                      }).then((result) => {

                        if (!result.isConfirmed) {
                          return;
                        }

                        this.http
                          .post(`${environment.apiPath}/api/gmail/send`, payload)
                          .subscribe({
                            next: () => {
                              this.utilityService.showSwalToast(
                                'Success',
                                'Mail sent successfully',
                                'success'
                              );
                              this.loadMails();
                            },
                            error: (err) => {
                              console.error(err);
                              this.utilityService.showSwalToast(
                                'Error',
                                'Mail send failed',
                                'error'
                              );
                            }
                          });
                      });
                    },
                    isContactAdded: () => false,
                    getContactTypeFlag: () => false,
                  },
                },
              },
            );
          });
      });
  }
}
