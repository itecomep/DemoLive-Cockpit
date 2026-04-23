  import {Component, Input, Output, EventEmitter, AfterViewChecked, ElementRef, ViewChildren, QueryList } from "@angular/core";
  import { CommonModule } from "@angular/common";
  import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
  import { FormsModule } from "@angular/forms";
  import { MatCardModule } from "@angular/material/card";
  import { MatButtonModule } from "@angular/material/button";
  import { MatIconModule } from "@angular/material/icon";
  import { MatCheckboxModule } from "@angular/material/checkbox";
  import { MatFormFieldModule } from "@angular/material/form-field";
  import { MatSelectModule } from "@angular/material/select";
  import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
  import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
  import { GmailComposeModule } from "../../../gmail/compose-email/gmail-compose.module";
  import { GmailEmail, GmailService } from "../../../gmail/services/gmail.service";
  import { environment } from "src/environments/environment";
  import { MatTooltipModule } from '@angular/material/tooltip';

  export interface GmailAttachment {
    attachmentId: string;
    fileName: string;
    mimeType: string;
    size?: number;
  }

  interface GmailLabel {
    id: string;
    name: string;
    type: string;
  }

  @Component({
    selector: "app-project-gmail-dialog",
    standalone: true,
    imports: [
      CommonModule,
      FormsModule,
      MatCardModule,
      MatButtonModule,
      MatIconModule,
      MatCheckboxModule,
      MatFormFieldModule,
      MatSelectModule,
      MatProgressSpinnerModule,
      NgxMatSelectSearchModule,
      GmailComposeModule,
      MatTooltipModule
    ],
    templateUrl: "./project-gmail-dialog.component.html",
    styleUrls: ["./project-gmail-dialog.component.scss"],
  })
  export class ProjectGmailDialogComponent implements AfterViewChecked {
    @Input() emails: (GmailEmail & { safeBody?: SafeHtml })[] = [];
    @Input() loading = false;
    @Input() currentLabelName: string | null = null;
    @Input() currentPage = 1;
    @Input() totalPages = 1;
    @Input() totalEmails = 0;
    @Input() hasNext = false;
    @Output() prevPage = new EventEmitter<void>();
    @Output() nextPage = new EventEmitter<void>();
    @ViewChildren("emailIframe") emailIframes!: QueryList<ElementRef<HTMLIFrameElement>>;

    showCompose = false;
    composeEmailState: any = null;
    selectedLabel = "";
    labels: GmailLabel[] = [];
    selectedLabelId: string | null = null;
    selectedLabelName: string | null = null;
    syncing = false;

    constructor(
      private sanitizer: DomSanitizer,
      private gmailService: GmailService,
    ) {}

    private getUserId(): number | null {
      const data = localStorage.getItem('currentUser');
      if (!data) return null;

      try {
        return JSON.parse(data).userId ?? null;
      } catch {
        return null;
      }
    }

    toggleEmail(email: GmailEmail & { safeBody?: SafeHtml }) {
      const messageId =
        email.id ||
        email.rfcMessageId;

      if (!email.read && messageId) {
        email.read = true;

        this.gmailService.markAsRead(messageId).subscribe({
          next: () => {
            console.log("Marked as read:", messageId);
          },
          error: err => {
            console.error("Failed to mark as read", err);
            email.read = false;
          }
        });
      }

      email.expanded = !email.expanded;

      if (email.expanded && !email.safeBody) {
        email.safeBody = this.sanitizer.bypassSecurityTrustHtml(
          this.wrapHtml(email.body || "")
        );
      }
    }

    openThread(email: GmailEmail & { safeBody?: SafeHtml }) {
      if (!email.threadId) return;
      email.showReplies = !email.showReplies;

      if (email.showReplies && !email.threadMessages?.length) {
        this.gmailService
          .getThreadMessages(email.threadId)
          .subscribe((messages) => {
            const repliesOnly = messages
              // .filter((m) => m.id !== email.id)
              .filter(m => m.id !== email.id && m.id !== email.rfcMessageId)
              .map((m) => ({
                ...m,
                safeBody: this.sanitizer.bypassSecurityTrustHtml(
                  this.wrapHtml(m.body || ""),
                ),
              }));

            email.threadMessages = repliesOnly.length ? repliesOnly : [];
            email.showReplies = repliesOnly.length > 0;
          });
      }
    }

    reply(email: GmailEmail) {
      this.openCompose(email, "reply");
    }
    replyAll(email: GmailEmail) {
      this.openCompose(email, "replyAll");
    }
    forward(email: GmailEmail) {
      this.openCompose(email, "forward");
    }
    composeNew() {
      this.openCompose(null, "new");
    }

    private openCompose(
      email: GmailEmail | null,
      type: "reply" | "replyAll" | "forward" | "new",
    ) {
      this.showCompose = false;
      setTimeout(() => {
        this.composeEmailState = { 
          email: email ? { ...email } : null, 
          type,
          //  labelId: this.selectedLabelId || null,
            labelName: this.currentLabelName
        };
        this.showCompose = true;
      });
    }

    closeCompose() {
      this.showCompose = false;
    }

    previewAttachment(email: GmailEmail, att: GmailAttachment) {
      const userId = this.getUserId();
      if (userId === null) return;

      const messageId = email.id || email.rfcMessageId || email.threadId;
      if (!messageId) return;

      const url =
        `${environment.apiPath}/api/gmail/attachment/` +
        `${messageId}/${att.attachmentId}` +
        `?userId=${userId}` +
        `&fileName=${encodeURIComponent(att.fileName)}` +
        `&mimeType=${encodeURIComponent(att.mimeType)}`;

      window.open(url, "_blank");
    }

    ngAfterViewChecked() {
      this.emailIframes.forEach((iframeRef) => {
        const iframe = iframeRef.nativeElement;
        if (iframe && iframe.contentWindow) {
          try {
            const doc = iframe.contentDocument || iframe.contentWindow.document;
            if (doc && doc.body) {
              iframe.style.height = doc.body.scrollHeight + "px";
            }
          } catch (err) {
          }
        }
      });
    }

    wrapHtml(html: string): string {
      return `
        <!DOCTYPE html>
        <html>
        <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
        html, body { margin:0; padding:0; width:100%; font-family: Roboto, Arial, sans-serif; font-size:14px; color:#202124; line-height:1.6; }
        table { width:100%; border-collapse:collapse; table-layout:auto; word-break:break-word; }
        td, th { word-break:break-word; }
        img { max-width:100%; height:auto; display:inline-block; }
        blockquote { border-left:4px solid #dadce0; margin:8px 0; padding-left:12px; color:#5f6368; }
        a { color:#1a73e8; text-decoration:none; }
        pre { white-space:pre-wrap; word-break:break-word; }
        </style>
        </head>
        <body>
        ${html}
        </body>
        </html>
      `;
    }

    resizeIframe(event: Event) {
      const iframe = event.target as HTMLIFrameElement;
      if (!iframe) return;

      setTimeout(() => {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        const body = doc?.body;
        if (body) {
          iframe.style.height = body.scrollHeight + "px";
          const links = body.querySelectorAll("a");
          links.forEach((link: HTMLAnchorElement) => {
            link.addEventListener("click", (e: Event) => {
              const url = link.href;
              if (!url) return;
              if (link.hasAttribute("download") || url.includes(".blob.core.windows.net")) {
                e.preventDefault();
                const fileName =
                  link.getAttribute("download") ||
                  url.split("/").pop() ||
                  "download";
                this.forceDownload(url, fileName);
              }
            });
          });
        }
      }, 50);
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

    onLabelSelect(label: GmailLabel) {
      this.selectedLabelId = label.id;
      this.selectedLabelName = label.name;
    }
  }
