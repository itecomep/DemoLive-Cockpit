import { Component, OnInit, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GmailService, GmailEmail, GmailAttachment } from ".././gmail/services/gmail.service";
import { Project } from "../project/models/project.model";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { Router, ActivatedRoute } from "@angular/router";
import { MatDividerModule } from "@angular/material/divider";
import { UtilityService } from "src/app/shared/services/utility.service";
import { MatIconModule } from "@angular/material/icon";
import { GmailComposeModule } from "../gmail/compose-email/gmail-compose.module";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { ProjectApiService } from "../project/services/project-api.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from "@angular/material/input";
import { FormControl } from '@angular/forms';
import { Pipe, PipeTransform } from '@angular/core';

declare const gapi: any;
interface GmailLabel {
  id: string;
  name: string;
  type: string;
  labelListVisibility?: string;
  messageListVisibility?: string;
}

@Pipe({ name: 'safeHtml', standalone: true })
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html || '');
  }
}

@Component({
  selector: "app-email-list",
  standalone: true,
  imports: [
    CommonModule,
    SafeHtmlPipe,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    GmailComposeModule,
    MatCheckboxModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: "./email-list.component.html",
  styleUrls: ["./email-list.component.scss"],
})
export class EmailListComponent implements OnInit {
  @Input() project!: Project;
  @Input() showAll: boolean = false;
  @Input() connectGmailFn?: () => void;

  emails: (GmailEmail & { safeBody?: SafeHtml })[] = [];
  loggedInEmail: string | null = null;
  loading = false;
  showCompose = false;
  composeEmailState: any = null;
  selectedLabel: string = "";
  labels: GmailLabel[] = [];
  labelFilter: string = "";
  filteredLabels: GmailLabel[] = [];
  searchText: string = "";
  activeToolbarButton: 'inbox' | 'sent' | 'drafts' | 'compose' = 'inbox';
  emailSearchText: string = "";
  currentPage = 1;
  pageSize = 20;
  totalEmails = 0;
  totalPages: number = 1;
  nextPageToken: string | null = null;
  prevPageTokens: (string | null)[] = [];
  pageTokens: { [page: number]: string | null } = {};
  sentPageTokens: { [page: number]: string | null } = {};
  sentNextPageToken: string | null = null;
  sentPrevPageTokens: (string | null)[] = [];
  draftId: string | null = null;
  labelSearchCtrl = new FormControl('');
  isGmailConnected: boolean = false;

  constructor(
    private gmailService: GmailService,
    private route: ActivatedRoute,
    private router: Router,
    private utilityService: UtilityService,
    private sanitizer: DomSanitizer,
    private projectApi: ProjectApiService,
    private http: HttpClient,
  ) {}

  getUserId(): number | null {
    const data = localStorage.getItem("currentUser");
    if (!data) return null;

    try {
      return JSON.parse(data).userId ?? null;
    } catch {
      return null;
    }
  }

  connectGmail() {
    const userId = this.getUserId();
    if (!userId) return alert("User not logged in");
    const authUrl = `${environment.apiPath}/api/gmail/auth?userId=${userId}`;
    // this.loadProjectsAndCreateLabels();
    window.location.href = authUrl;
  }

  loadEmails(page: number = 1, pageToken: string | null = null) {
    this.activeToolbarButton = "inbox";
    this.loading = true;
    this.currentPage = page;

    const tokenToUse = pageToken ?? this.pageTokens[page - 1] ?? null;
    this.gmailService.getEmails(tokenToUse, this.pageSize).subscribe({
      next: (res: any) => {
        this.loading = false;

        if (
          res?.message === "Gmail not connected|First Connect The Gmail" ||
          res?.emails?.length === 0
        ) {
          this.emails = [];
          this.totalEmails = 0;
          this.totalPages = 0;
          this.nextPageToken = null;
          this.utilityService.showSwalToast(
            "Gmail not connected",
            "Please connect your Gmail first",
            "warning",
          );
          return;
        }

        this.pageTokens[page] = res.nextPageToken ?? null;
        this.nextPageToken = res.nextPageToken ?? null;

        this.totalEmails = res.total;
        this.totalPages = Math.ceil(this.totalEmails / this.pageSize);

        this.emails = res.emails.map((email: any) => ({
          ...email,
          safeBody: this.sanitizer.bypassSecurityTrustHtml(
            this.sanitizeEmailHtml(email.body || ""),
          ),
        }));
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        if (err.status === 400 && err.error === "First connect Gmail") {
          this.emails = [];

          this.utilityService.showSwalToast(
            "Gmail not connected",
            "Please connect your Gmail first",
            "warning",
          );
        }
      },
    });
  }

  loadNext() {
    if (this.activeToolbarButton === 'sent') {
      if (!this.sentNextPageToken) return;
      this.currentPage++;
      this.loadSentEmails(this.currentPage, this.sentNextPageToken);
    } else {
      if (!this.nextPageToken) return;
      this.currentPage++;
      this.loadEmails(this.currentPage, this.nextPageToken);
    }
  }

  loadPrev() {
    if (this.currentPage === 1) return;

    this.currentPage--;
    if (this.activeToolbarButton === 'sent') {
      const prevToken = this.sentPageTokens[this.currentPage - 1] ?? null;
      this.loadSentEmails(this.currentPage, prevToken);
    } else {
      const prevToken = this.pageTokens[this.currentPage - 1] ?? null;
      this.loadEmails(this.currentPage, prevToken);
    }
  }

  ngOnInit() {
    this.checkGmailConnection();
    this.loadEmails();
    this.fetchLabels();
    // this.loadProjectsAndCreateLabels();
      this.labelSearchCtrl.valueChanges.subscribe(search => {
      const searchValue = search?.toLowerCase() || '';

      this.filteredLabels = this.labels.filter(label =>
        label.name.toLowerCase().includes(searchValue)
      );
    });
  }

  loadSentEmails(page: number = 1, pageToken: string | null = null) {
    this.activeToolbarButton = 'sent';
    this.loading = true;
    this.currentPage = page;

    const tokenToUse = pageToken ?? this.sentPageTokens[page - 1] ?? null;

    this.gmailService.getSentEmails(tokenToUse, this.pageSize).subscribe({
      next: (res: any) => {
        this.loading = false;

        if (!res?.emails?.length) {
          this.emails = [];
          this.totalEmails = 0;
          this.totalPages = 0;
          this.sentNextPageToken = null;
          return;
        }

        this.sentPageTokens[page] = res.nextPageToken ?? null;
        this.sentNextPageToken = res.nextPageToken ?? null;

        this.totalEmails = res.total;
        this.totalPages = Math.ceil(this.totalEmails / this.pageSize);

        this.emails = res.emails.map((email: any) => ({
          ...email,
          safeBody: this.sanitizer.bypassSecurityTrustHtml(
            this.sanitizeEmailHtml(email.body || '')
          ),
        }));
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.emails = [];
      },
    });
  }

  reply(email: GmailEmail) {
    this.openComposePanel(email, "reply");
  }

  replyAll(email: GmailEmail) {
    this.openComposePanel(email, "replyAll");
  }

  forward(email: GmailEmail) {
    this.openComposePanel(email, "forward");
  }

  private openComposePanel(
    email: GmailEmail,
    type: "reply" | "replyAll" | "forward",
  ) {
    this.showCompose = false;
    const systemLabels = ["INBOX", "SENT", "DRAFT", "TRASH", "SPAM", "STARRED", "IMPORTANT", "CATEGORY_FORUMS", "CATEGORY_UPDATES", "CATEGORY_PERSONAL", "CATEGORY_PROMOTIONS", "CATEGORY_SOCIAL", "UNREAD"];
    setTimeout(() => {
      const projectLabel = email.labels?.find(l => !systemLabels.includes(l)) || null;
      this.composeEmailState = { email: { ...email }, type, labelName: projectLabel };
      this.showCompose = true;
    });
  }
  composeNew() {
    this.activeToolbarButton = 'compose';
    const userId = this.getUserId();
    if (!userId) {
      this.utilityService?.showSwalToast(
        "Not logged in",
        "Please login first",
        "warning",
      );
      return;
    }
    this.showCompose = false;
    setTimeout(() => {
      this.composeEmailState = {
        type: "new",
        email: null,
      };
      this.showCompose = true;
    });
  }
  closeCompose() {
    this.showCompose = false;
  }
  // getAttachmentPreviewUrl(email: GmailEmail, att: GmailAttachment) {
  //   const userId = this.getUserId();
  //   if (!userId) return "";
  //   return `${environment.apiPath}/api/gmail/attachment/${email.id}/${
  //     att.attachmentId
  //   }?userId=${userId}&fileName=${encodeURIComponent(
  //     att.fileName,
  //   )}&mimeType=${encodeURIComponent(att.mimeType)}`;
  // }

  // previewAttachment(email: GmailEmail, att: GmailAttachment) {
  //   const url = this.getAttachmentPreviewUrl(email, att);
  //   console.log("Preview URL:", url);
  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.download = att.fileName;
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // }

  getAttachmentPreviewUrl(email: GmailEmail, att: GmailAttachment) {
    const userId = this.getUserId();
    if (!userId) return "";

    return `${environment.apiPath}/api/gmail/attachment`
      + `?userId=${userId}`
      + `&messageId=${email.id}`
      + `&attachmentId=${att.attachmentId}`
      + `&fileName=${encodeURIComponent(att.fileName)}`
      + `&download=true`;
  }

  previewAttachment(email: GmailEmail, att: GmailAttachment) {
    const url = this.getAttachmentPreviewUrl(email, att);
    if (!url) {
      alert("User not found");
      return;
    }
    console.log("Download URL:", url);
    const link = document.createElement('a');
    link.href = url;
    link.download = att.fileName || 'download';
    // link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  openThread(email: GmailEmail) {
    if (email.showReplies) {
      email.showReplies = false;
      return;
    }
    if (!email.threadId) {
      return;
    }
    email.showReplies = true;
    if (!email.threadMessages?.length) {
      this.gmailService
        .getThreadMessages(email.threadId)
        .subscribe((messages) => {
          const repliesOnly = messages
            .filter((m) => m.id !== email.id)
            .map((m) => ({
              ...m,
              safeBody: this.sanitizer.bypassSecurityTrustHtml(m.body || ""),
            }));

          email.threadMessages = repliesOnly.length ? repliesOnly : [];
          email.showReplies = repliesOnly.length > 0;
        });
    }
  }

  toggleEmail(email: GmailEmail) {
    if (!email.read) {
      email.read = true;

      this.gmailService.markAsRead(email.id).subscribe({
        error: err => console.error("Failed to mark as read", err)
      });
    }

    email.expanded = !email.expanded;
  }

  async createGmailLabel(project: any) {
    const label = {
      name: `${project.code} - ${project.title}`,
      labelListVisibility: "labelShow",
      messageListVisibility: "show",
    };

    try {
      await gapi.client.gmail.users.labels.create({
        userId: "me",
        resource: label,
      });
    } catch (err: any) {
      if (err?.result?.error?.code !== 409) {
        console.error("Label error:", err);
      }
    }
  }

  loadProjectsAndCreateLabels() {
    const userData = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const isFullAccess = userData.roles?.includes("MASTER") || false;

    this.projectApi.getProjectsForEmail(0, 10000, isFullAccess).subscribe({
      next: (res) => {
        if (!res?.list?.length) {
          return;
        }

        this.gmailService.getLabels().subscribe({
          next: (labelRes) => {

            const existingLabelNames = (labelRes.labels || [])
              .filter((l: any) => l.type === "user")
              .map((l: any) => l.name);

            const missingProjects = res.list.filter((project: any) => {
              const labelName = `${project.code} - ${project.title}`;
              return !existingLabelNames.includes(labelName);
            });

            if (!missingProjects.length) {
              return;
            }
            this.syncProjectLabels(missingProjects).subscribe({
              next: () => {
                this.fetchLabels();
              },
              error: (err) => console.error("Label sync failed", err),
            });
          }
        });
      },
      error: (err) => {
        console.error("Error fetching projects:", err);
      },
    });
  }

  syncProjectLabels(projects: any[]) {
    const userId = this.getUserId();
     if (userId === null) {
      throw new Error("User not logged in");
    }
    const labels = projects.map((p) => ({
      code: p.code,
      title: p.title,
    }));
    const params = new HttpParams().set("userId", userId);

    return this.http.post(`${environment.apiPath}/api/gmail/labels`, labels, {
      params,
    });
  }

  assignLabel() {
    const selectedEmails = this.emails
      .filter((e) => e.selected)
      .map((e) => e.id);

    if (!selectedEmails.length) {
      this.utilityService.showSwalToast(
        "Validation Error",
        "Select Emails First",
        "warning"
      );
      return;
    }

    if (!this.selectedLabel) {
      this.utilityService.showSwalToast(
        "Validation Error",
        "Select Label First",
        "warning"
      );
      return;
    } 

    const userId = this.getUserId();
    if (userId === null) {
      alert("User not logged in");
      return;
    }
    const selectedLabelObj = this.labels.find(
      l => l.id === this.selectedLabel
    );

    const payload = {
      UserId: userId.toString(),
      LabelId: this.selectedLabel, 
      LabelName: selectedLabelObj?.name || "", 
      MessageIds: selectedEmails
    };
    this.http
    .post(`${environment.apiPath}/api/gmail/apply-label`, payload)
    .subscribe(() => {
      this.emails = this.emails.filter((e) => !e.selected);
      this.selectedLabel = "";
       const syncPayload = {
          UserId: payload.UserId,
          LabelName: payload.LabelName
        };

        this.gmailService.syncLabelEmails(syncPayload).subscribe({
          next: (res: any) => {
            console.log(`Label (${syncPayload.LabelName}) sync completed.`);
          },
          error: (err) => {
            console.warn(`Label sync failed for (${syncPayload.LabelName})`, err);
          }
        });
    });
  }

  fetchLabels() {
    this.gmailService.getLabels().subscribe({
      next: (res) => {
        this.labels = res.labels.filter(
          (label: GmailLabel) =>
            label.type === "user" || label.labelListVisibility === "labelShow",
        );
        this.filteredLabels = [...this.labels];
      },
      error: (err) => console.error(err),
    });
  }

  filterLabels() {
    const search = this.labelFilter.toLowerCase();
    this.filteredLabels = this.labels.filter((label) =>
      label.name.toLowerCase().includes(search),
    );
  }

  private sanitizeEmailHtml(html: string): string {
    if (!html) return "";
    html = html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
    html = html.replace(/ on\w+="[^"]*"/gi, "");
    html = html.replace(
        /src="(https:\/\/lh3\.googleusercontent\.com[^"]+)"/g,
        (match, url) => {
          return `src="${environment.apiPath}/api/gmail/image-proxy?url=${encodeURIComponent(url)}"`;
        }
    );

    return html;
  }

  searchEmails(pageToken: string | null = null, pageSize: number = 20) {
    if (!this.emailSearchText.trim()) {
      if (this.activeToolbarButton === "sent") {
        this.loadSentEmails();
      } else {
        this.loadEmails();
      }
      return;
    }

    this.loading = true;
    this.currentPage = 1;
    this.pageTokens = {};

    let gmailQuery = this.emailSearchText.trim();
    if (!gmailQuery.startsWith("in:") && !gmailQuery.startsWith("label:")) {
      if (this.activeToolbarButton === "sent") {
        gmailQuery = `in:sent ${gmailQuery}`;
      } else if (this.selectedLabel) {
        gmailQuery = `label:${this.selectedLabel} ${gmailQuery}`;
      } else {
        gmailQuery = `in:inbox ${gmailQuery}`;
      }
    }

    this.gmailService.searchEmails(gmailQuery, pageToken, pageSize).subscribe({
      next: (res) => {
        this.emails = res.emails.map((email: any) => ({
          ...email,
          safeBody: this.sanitizer.bypassSecurityTrustHtml(
            this.sanitizeEmailHtml(email.body || "")
          ),
        }));

        this.totalEmails = res.total;
        this.totalPages = Math.ceil(this.totalEmails / this.pageSize);
        this.nextPageToken = res.nextPageToken ?? null;

        if (this.currentPage === 1) {
          this.pageTokens[1] = pageToken ?? null;
        }

        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  checkGmailConnection() {
    this.gmailService.getLoggedInEmail().subscribe({
      next: (res) => {
        this.loggedInEmail = res.email;
        this.isGmailConnected = !!res.email;
      },
      error: () => {
        this.isGmailConnected = false;
        this.loggedInEmail = null;
      }
    });
  }

  disconnectGmail() {
    this.utilityService.showConfirmationDialog(
      "Are you sure you want to disconnect Gmail?",
      () => {

        const userId = this.getUserId();
        if (!userId) return;

        this.gmailService.disconnect(userId.toString()).subscribe({
          next: () => {

            this.utilityService.showSwalToast(
              "Success",
              "Gmail disconnected successfully",
              "success"
            );

            this.loggedInEmail = null;
            this.isGmailConnected = false;
            this.emails = [];
          },
          error: (err) => console.error(err)
        });

      }
    );
  }

  loadDraftEmails(page: number = 1, pageToken: string | null = null) {
    this.activeToolbarButton = 'drafts';
    this.loading = true;
    this.currentPage = page;

    const tokenToUse = pageToken ?? this.pageTokens[page - 1] ?? null;

    this.gmailService.getDraftEmails(tokenToUse, this.pageSize).subscribe({
      next: (res: any) => {
        this.loading = false;

        if (!res?.emails?.length) {
          this.emails = [];
          this.totalEmails = 0;
          this.totalPages = 0;
          return;
        }

        this.pageTokens[page] = res.nextPageToken ?? null;
        this.nextPageToken = res.nextPageToken ?? null;

        this.totalEmails = res.total;
        this.totalPages = Math.ceil(this.totalEmails / this.pageSize);

        this.emails = res.emails.map((email: any) => ({
          ...email,
          safeBody: this.sanitizer.bypassSecurityTrustHtml(
            this.sanitizeEmailHtml(email.body || '')
          ),
        }));
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.emails = [];
      },
    });
  }

  openDraft(email: GmailEmail) {
    this.showCompose = false;

    setTimeout(() => {
      this.composeEmailState = {
        type: 'draft',
        email: { ...email }
      };
      this.showCompose = true;
    });
  }

  discardDraft(email: GmailEmail) {
    if (!email.draftId) return;
    const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const cleanDraftId = email.draftId.replace("drafts/", "");

    this.gmailService.deleteDraft(cleanDraftId, user.userId).subscribe({
      next: () => {
        this.utilityService.showSwalToast(
          "Draft discarded",
          "Draft deleted successfully",
          "success"
        );

        this.loadDraftEmails();
      },
      error: (err) => {
        console.error("Delete failed:", err);
      }
    });
  }

  onIframeLoad(event: Event) {
    const iframe = event.target as HTMLIFrameElement;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;

    if (!doc) return;

    iframe.style.height = doc.body.scrollHeight + "px";

    const links = doc.querySelectorAll("a");

    links.forEach((link: HTMLAnchorElement) => {
      link.addEventListener("click", (e: Event) => {
        const url = link.href;

        if (!url) return;

        e.preventDefault();

        const fileName =
          link.getAttribute("download") || url.split("/").pop() || "download";

        this.forceDownload(url, fileName);
      });
    });
  }

  async forceDownload(url: string, fileName: string) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName;

      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
    }
  }
}
