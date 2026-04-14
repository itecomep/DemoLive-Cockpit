import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef, ChangeDetectorRef } from "@angular/core";
import { GmailService, GmailEmail } from "../../gmail/services/gmail.service";
import { HttpClient } from "@angular/common/http";
import { FormControl } from "@angular/forms";
import { startWith, map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { UtilityService } from "src/app/shared/services/utility.service";
import { ProjectApiService } from "../../project/services/project-api.service";
import { MatDialog } from '@angular/material/dialog';
import { ProjectFileComponent } from "src/app/project/components/project-file/project-file.component";
import { firstValueFrom } from "rxjs";

interface ContactEmail {
  email: string;
  title: string;
  isPrimary?: boolean;
}

interface Project {
  id: number;
  code: string;
  name: string;
  gmailLabelId?: string;
}

type FontSizeType = "small" | "normal" | "large" | "huge";

@Component({
  selector: "app-compose-email",
  templateUrl: "./compose-email.component.html",
  styleUrls: ["./compose-email.component.scss"],
})
export class ComposeEmailComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Input() state: any;
  @ViewChild("editorElement") editorElement!: ElementRef<HTMLDivElement>;
  @ViewChild("textPalette") textPaletteRef!: ElementRef;
  @ViewChild("bgPalette") bgPaletteRef!: ElementRef;

  newBody: string = "";
  to: string = "";
  cc: string = "";
  bcc: string = "";
  subject: string = "";
  // attachments: { file: File; previewUrl?: string }[] = [];
  showCcBcc: boolean = false;
  threadId?: string;
  replyMessageId?: string;
  allEmails: ContactEmail[] = [];
  filteredToEmails: ContactEmail[] = [];
  filteredCcEmails: ContactEmail[] = [];
  filteredBccEmails: ContactEmail[] = [];
  toControl = new FormControl("");
  ccControl = new FormControl("");
  bccControl = new FormControl("");
  showColorPalette = false;
  showTextColorPalette = false;
  showBgColorPalette = false;
  isExpanded = false;
  isMaximized = false;
  isMinimized = false;
  manualSubject = "";
  projects: Project[] = [];
  selectedProjectId: number | null = null;
  isProjectLoading = false;
  dmsPreviewFiles: { name: string; url: string }[] = [];
  dmsAttachments: { name: string; size?: string; icon: string; url: string }[] = [];
  attachments: { file: File; size: string; icon: string; url?: string }[] = [];
  projectControl = new FormControl('');
  filteredProjects: Project[] = [];
  selectedMailType: 'project' | 'other' = 'project';
  associations: any[] = [];

  noToEmailFound = false;
  noCcEmailFound = false;
  noBccEmailFound = false;
  toObjects: any[] = [];
  ccObjects: any[] = [];
  bccObjects: any[] = [];


  activeStyles: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    bullet: boolean;
    number: boolean;
    color: string;
    align: "left" | "center" | "right" | "justify";
    fontSize: "small" | "normal" | "large" | "huge";
    fontFamily: string;
  } = {
    bold: false,
    italic: false,
    underline: false,
    bullet: false,
    number: false,
    color: "#000000",
    align: "left",
    fontSize: "normal",
    fontFamily: "Arial",
  };

  constructor(
    private gmailService: GmailService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private utilityService: UtilityService,
    private projectService: ProjectApiService,
    private dialog: MatDialog
  ) {}
  colorPalette: string[] = ["#ffffff", "#f5f5f5", "#e0e0e0", "#bdbdbd", "#9e9e9e", "#616161", "#212121", "#000000", "#fdecea", "#f28b82", "#ea4335", "#d93025", "#b31412", "#ffe0b2", "#ffb74d", "#ff6d01", "#e8710a", "#c25e00", "#fff7d6", "#fde293", "#fbbc05", "#f29900", "#ea8600", "#e6f4ea", "#81c995", "#34a853", "#1e8e3e", "#137333", "#e0f7fa", "#4dd0e1", "#46bdc6", "#0097a7", "#006064", "#e8f0fe", "#8ab4f8", "#4285f4", "#1a73e8", "#174ea6", "#f3e8fd", "#c58af9", "#9b51e0", "#7e57c2", "#5e35b1", "#fde7f3", "#ff8bcf", "#ff4081", "#e91e63", "#ad1457", "#efebe9", "#bcaaa4", "#795548", "#5d4037", "#3e2723"];

  fontFamilies = [
    { label: "Default", value: "" },
    { label: "Sans Serif", value: "Arial, Helvetica, sans-serif" },
    { label: "Serif", value: "Times New Roman, Times, serif" },
    { label: "Monospace", value: "Courier New, Courier, monospace" },
    { label: "Roboto", value: "Roboto, Arial, sans-serif" },
    { label: "Georgia", value: "Georgia, serif" },
    { label: "Verdana", value: "Verdana, Geneva, sans-serif" },
  ];

  openDmsDialog() {
    const isMobile = window.innerWidth < 768;
    const dialogRef = this.dialog.open(ProjectFileComponent, {
      width: isMobile ? '100vw' : '95vw',
      maxWidth: '98vw',
      height: isMobile ? '100vh' : '90vh',
      maxHeight: '95vh',
      panelClass: ['custom-dialog', 'no-padding-dialog'],
      data: { 
        projects: this.projects,
        selectedProjectId: this.selectedProjectId,
        isOtherMode: this.selectedMailType === 'other'
      },
    });

    dialogRef.afterClosed().subscribe((selectedFiles: any[]) => {
      if (!selectedFiles?.length) return;

      selectedFiles.forEach(f => {
        if (!this.dmsAttachments.some(a => a.url === f.blobUrl)) {
          this.dmsAttachments.push({
            name: f.name,
            size: this.formatFileSize(f.size || 0),
            icon: this.getFileIcon(f.type || "application/octet-stream"),
            url: f.blobUrl
          });
        }
      });
    });
  }

  removeDmsAttachment(index: number) {
    this.dmsAttachments.splice(index, 1);
  }

  ngOnInit() {
    this.gmailService.getLoggedInEmail().subscribe(async ({ email }) => {
      const state = this.state || {};
      const myEmail = email || "";

      let signature = await this.fetchSignature(myEmail);

      if (state.email) {
        const emailData: GmailEmail = state.email;
        this.threadId = emailData.threadId;
        this.replyMessageId = emailData.rfcMessageId;
        this.showCcBcc = !!(emailData.cc || emailData.bcc);

        if (state.type === "reply" || state.type === "replyAll") {
          if (emailData.attachments?.length) {
            for (const att of emailData.attachments) {
              const url = `${environment.apiPath}/api/gmail/attachment/${emailData.id}/${att.attachmentId}?userId=${this.getUserId()}&fileName=${encodeURIComponent(att.fileName)}&mimeType=${encodeURIComponent(att.mimeType)}`;
              const response = await fetch(url);
              const blob = await response.blob();
              const file = new File([blob], att.fileName, { type: att.mimeType });
            }
          }
          this.to = this.computeTo(state.type, emailData, myEmail);
          this.cc =
            state.type === "replyAll" ? this.computeCc(emailData, myEmail) : "";
          this.bcc =
            state.type === "replyAll"
              ? this.computeBcc(emailData, myEmail)
              : "";
          this.subject = emailData.subject.startsWith("Re:")
            ? emailData.subject
            : "Re: " + emailData.subject;

          this.newBody = `
            <p><br></p>
            ${signature ? `<div>${signature}</div><br>` : ""}
            ${this.buildOriginalHtml(emailData)}`;
        }

        if (state.type === "draft") {
          const draftEmail: GmailEmail = state.email;

          this.to = draftEmail.to || draftEmail.toList?.join(", ") || "";
          this.cc = draftEmail.cc || draftEmail.ccList?.join(", ") || "";
          this.bcc = draftEmail.bcc || draftEmail.bccList?.join(", ") || "";
          this.subject = draftEmail.subject || "";
          this.newBody = draftEmail.body || "";

          if (draftEmail.attachments?.length) {
            this.attachments = draftEmail.attachments.map((att) => ({
              file: new File([], att.fileName, { type: att.mimeType }),
              size: this.formatFileSize(att.size),
              icon: this.getFileIcon(att.mimeType),
            }));
          }

          this.threadId = draftEmail.threadId;
          this.replyMessageId = draftEmail.rfcMessageId;
        }

        if (state.type === "forward") {
          this.to = "";
          this.cc = "";
          this.bcc = "";
          this.subject = emailData.subject.startsWith("Fwd:")
            ? emailData.subject
            : "Fwd: " + emailData.subject;

          this.newBody = `
            <br>
            ${signature ? `<div>${signature}</div>` : ""}
            ${this.buildOriginalHtml(emailData)}
          `;
        }
      }

      if (state.type === "new") {
        this.to = "";
        this.cc = "";
        this.bcc = "";
        this.subject = "";
        this.newBody = `<div><br></div>${signature ? `<div>${signature}</div>` : ""}`;
      }

      this.syncEditorContent();
    });

    this.projectControl.valueChanges.subscribe(value => {
      const search = typeof value === 'string' ? value.toLowerCase() : '';
      this.filteredProjects = this.projects.filter(p =>
        p.name.toLowerCase().includes(search)
      );
    });

    this.loadContacts();
    this.setupAutocomplete();
    this.loadProjects();
    document.addEventListener("click", this.onClickOutside.bind(this));
  }

  ngOnDestroy() {
    document.removeEventListener("click", this.onClickOutside.bind(this));
  }

  private savedSelection: Range | null = null;
  saveSelection() {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      this.savedSelection = sel.getRangeAt(0).cloneRange();
    }
  }

  private getUserId(): number | null {
    const data = localStorage.getItem('currentUser');
    if (!data) return null;

    try {
      return JSON.parse(data).userId ?? null;
    } catch {
      return null;
    }
  }

  restoreSelection() {
    const sel = window.getSelection();
    if (sel && this.savedSelection) {
      sel.removeAllRanges();
      sel.addRange(this.savedSelection);
    }
  }

  private syncEditorContent() {
    setTimeout(() => {
      if (this.editorElement) {
        this.editorElement.nativeElement.innerHTML = this.newBody;
        this.updateToolbarState();
      }
    }, 0);
  }

  updateToolbarState() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    let parent = range.commonAncestorContainer as HTMLElement;
    let el = parent.nodeType === 3 ? parent.parentElement! : parent;

    if (parent.nodeType === 3) {
      parent = parent.parentNode as HTMLElement;
    }

    const hasTag = (tag: string) => {
      let curr: HTMLElement | null = parent;
      while (curr && curr !== this.editorElement.nativeElement) {
        if (curr.tagName === tag) return true;
        curr = curr.parentElement;
      }
      return false;
    };

    const computedStyle = window.getComputedStyle(parent);
    const computedFontSize = window.getComputedStyle(el).fontSize;
    const computedFontFamily = window.getComputedStyle(el).fontFamily;
    const computedFont =
      computedFontFamily?.replace(/["']/g, "") ||
      "Arial, Helvetica, sans-serif";
    const matchedFont = this.fontFamilies.find((f) => f.value.split(",")[0] === computedFont) || this.fontFamilies[0];

    const sizeMap: Record<string, FontSizeType> = {
      "12px": "small",
      "14px": "normal",
      "18px": "large",
      "24px": "huge",
    };

    this.activeStyles = {
      bold:
        computedStyle.fontWeight === "bold" ||
        parseInt(computedStyle.fontWeight) >= 700 ||
        hasTag("B") ||
        hasTag("STRONG"),
      italic:
        computedStyle.fontStyle === "italic" || hasTag("I") || hasTag("EM"),
      underline:
        computedStyle.textDecoration.includes("underline") || hasTag("U"),
      bullet: hasTag("UL"),
      number: hasTag("OL"),
      color: this.rgbToHex(computedStyle.color),
      align: this.getCurrentAlignment(selection),
      fontSize: sizeMap[computedFontSize] ?? "normal",
      fontFamily: matchedFont.value,
    };
    this.cdr.detectChanges();
  }

  private getCurrentAlignment(
    selection: Selection,
  ): "left" | "center" | "right" | "justify" {
    let parent = selection.anchorNode as HTMLElement;
    if (parent.nodeType === 3) parent = parent.parentElement!;
    const style = window.getComputedStyle(parent);
    const textAlign = style.textAlign as
      | "left"
      | "center"
      | "right"
      | "justify";
    return textAlign || "left";
  }

  applyFontSize(size: FontSizeType) {
    this.restoreSelection();
    const px = this.mapFontSizeToPx(size);
    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);

    let container = range.commonAncestorContainer as HTMLElement;

    if (container.nodeType === 3) {
      container = container.parentElement!;
    }

    const blockTags = ["P", "DIV", "LI"];
    let el: HTMLElement | null = container;

    while (el && el !== this.editorElement.nativeElement) {
      if (blockTags.includes(el.tagName)) {
        el.style.fontSize = px;
      }
      el = el.parentElement;
    }
    if (!selection.isCollapsed) {
      const span = document.createElement("span");
      span.style.fontSize = px;
      try {
        span.appendChild(range.extractContents());
        range.insertNode(span);
        selection.removeAllRanges();
        const newRange = document.createRange();
        newRange.selectNodeContents(span);
        selection.addRange(newRange);
      } catch {}
    }
    this.editorElement.nativeElement
      .querySelectorAll("font")
      .forEach((font: any) => {
        const span = document.createElement("span");
        span.style.fontSize = px;
        span.innerHTML = font.innerHTML;
        font.replaceWith(span);
      });

    this.onEditorInput();
    this.updateToolbarState();
    this.editorElement.nativeElement.focus();
  }

  applyFontFamily(font: string) {
    this.restoreSelection();
    const fontToApply = font || "Arial";
    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    let container = range.commonAncestorContainer as HTMLElement;
    if (container.nodeType === 3) {
      container = container.parentElement!;
    }
    const blockTags = ["P", "DIV", "LI"];
    let el: HTMLElement | null = container;

    while (el && el !== this.editorElement.nativeElement) {
      if (blockTags.includes(el.tagName)) {
        el.style.fontFamily = fontToApply;
      }
      el = el.parentElement;
    }

    if (!selection.isCollapsed) {
      const span = document.createElement("span");
      span.style.fontFamily = fontToApply;

      try {
        span.appendChild(range.extractContents());
        range.insertNode(span);
        selection.removeAllRanges();
        const newRange = document.createRange();
        newRange.selectNodeContents(span);
        selection.addRange(newRange);
      } catch {}
    }

    this.onEditorInput();
    this.updateToolbarState();
    this.editorElement.nativeElement.focus();
  }

  private mapFontSizeToPx(size: string): string {
    const sizeMap: Record<string, string> = {
      small: "12px",
      normal: "14px",
      large: "18px",
      huge: "24px",
    };

    return sizeMap[size] ?? "14px";
  }

  normalizeFontSizes() {
    const fonts = this.editorElement.nativeElement.querySelectorAll("font");

    fonts.forEach((font) => {
      const size = font.getAttribute("size") || "3";
      const face = font.getAttribute("face");

      const span = document.createElement("span");
      span.style.fontSize = this.mapFontSizeToPx(size);

      if (face) {
        span.style.fontFamily = face;
      }

      span.innerHTML = font.innerHTML;
      font.replaceWith(span);
    });
  }

  private rgbToHex(rgb: string): string {
    if (!rgb || !rgb.startsWith("rgb")) return "#000000";
    const match = rgb.match(/\d+/g);
    if (!match) return "#000000";
    const [r, g, b] = match.map(Number);
    return (
      "#" +
      ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
    );
  }

  exec(command: string, value?: string) {
    this.restoreSelection();
    document.execCommand(command, false, value);

    if (command.startsWith("justify")) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const container = range.commonAncestorContainer as HTMLElement;

        const lists = this.getParentLists(container);
        const align =
          command === "justifyLeft"
            ? "left"
            : command === "justifyCenter"
              ? "center"
              : command === "justifyRight"
                ? "right"
                : "justify";

        lists.forEach((list) => {
          list.style.textAlign = align;
          list.style.listStylePosition = "inside";
          list.style.paddingLeft = "0";
          list.style.marginLeft = "0";
          Array.from(list.children).forEach((li) => {
            (li as HTMLElement).style.textAlign = align;
          });
        });
      }
    }

    this.onEditorInput();
    this.updateToolbarState();
    this.editorElement.nativeElement.focus();
  }

  private getParentLists(el: HTMLElement | null): HTMLElement[] {
    const lists: HTMLElement[] = [];
    while (el && el !== this.editorElement.nativeElement) {
      if (el.tagName === "UL" || el.tagName === "OL") lists.push(el);
      el = el.parentElement;
    }
    return lists;
  }

  onEditorInput() {
    this.normalizeContent();
    this.newBody = this.editorElement.nativeElement.innerHTML;
  }

  normalizeContent() {
    const editor = this.editorElement.nativeElement;

    editor.querySelectorAll("font").forEach(f => {
      const span = document.createElement("span");
      span.innerHTML = f.innerHTML;
      f.replaceWith(span);
    });

    editor.querySelectorAll("span").forEach(span => {
      const style = span.getAttribute("style");
      if (!style || style.trim() === "") {
        span.replaceWith(...Array.from(span.childNodes));
      }
    });
  }

  onColorMouseDown(event: MouseEvent) {
    event.preventDefault();
  }

  handleEditorClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.tagName === 'A') {
      event.preventDefault();
      const url = target.getAttribute('href');
      if (url) {
        window.open(url, '_blank');
      }
    }

    if (target.getAttribute('data-remove') === 'true') {
      const url = target.getAttribute('data-url');
      const itemDiv = target.closest('div');
      const sectionDiv = target.closest('div[style*="border:1px solid"]');
      itemDiv?.remove();
      this.dmsAttachments = this.dmsAttachments.filter(a => a.url !== url);
      this.attachments = this.attachments.filter(a => a.url !== url);
      if (sectionDiv) {
        const remaining = sectionDiv.querySelectorAll('a[download]');
        if (remaining.length === 0) {
          sectionDiv.remove();
        }
      }
      this.newBody = this.editorElement.nativeElement.innerHTML;
    }
  }

  cleanBodyBeforeSend(html: string): string {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    temp.querySelectorAll('[data-remove="true"]').forEach(el => el.remove());
    return temp.innerHTML;
  }

  private buildOriginalHtml(email: GmailEmail): string {
    let attachmentsHtml = "";
    if (email.attachments?.length) {
      const formatted = new Date(email.date).toLocaleString();
      attachmentsHtml = `
        <div style="border:1px solid #dadce0; background:#f6f8fa; padding:12px; border-radius:6px; margin-top:15px; margin-bottom:15px; font-family:Arial, sans-serif;">
          <div style="display:flex; justify-content:space-between; align-items:center; font-weight:600; margin-bottom:10px;">
            <span>Attachments (${email.attachments.length}) :</span>
            <span style="font-size:12px;color:#666;">
              ${formatted}
            </span>
          </div>

          ${email.attachments.map(a => {
            const fileName = encodeURIComponent(a.fileName.trim());
            const mimeType = encodeURIComponent(a.mimeType);
            const url =
              `${environment.apiPath}/api/gmail/attachment/${email.id}/${a.attachmentId}` +
              `?userId=${this.getUserId()}` +
              `&fileName=${fileName}` +
              `&mimeType=${mimeType}` +
              `&download=true`;

            console.log("Download URL:", url);

            return `
              <div style="display:flex; align-items:center; gap:8px; padding:6px 0;">
                <span style="font-size:16px;">📎</span>
                <a href="${url}"
                  style="text-decoration:none; color:#1a73e8; font-weight:500;">
                  ${a.fileName}
                </a>
              </div>
            `;
          }).join("")}
        </div>
      `;
    }

    return `
      <blockquote style="border-left:4px solid #dadce0;margin:12px 0;padding-left:12px;color:#555;">
        <p style="font-size:12px;color:#666;">
          On ${email.date}, <strong>${email.from}</strong> wrote:
        </p>
        ${attachmentsHtml}
        ${email.body}
      </blockquote>
    `;
  }

  toggleColorPalette(event: MouseEvent) {
    event.stopPropagation();
    this.showTextColorPalette = !this.showTextColorPalette;
    if (this.showTextColorPalette) this.showBgColorPalette = false;
  }

  toggleBgColorPalette(event: MouseEvent) {
    event.stopPropagation();
    this.showBgColorPalette = !this.showBgColorPalette;
    if (this.showBgColorPalette) this.showTextColorPalette = false;
  }

  applyColor(color?: string) {
    this.restoreSelection();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);

    if (selection.isCollapsed) {
      const span = document.createElement("span");
      span.style.color = color || "inherit";
      span.innerHTML = "&#8203;";
      range.insertNode(span);
      range.setStart(span, 1);
      range.collapse(true);
    } else {
      const span = document.createElement("span");
      span.style.color = color || "inherit";
      try {
        span.appendChild(range.extractContents());
        range.insertNode(span);
        selection.removeAllRanges();
        const newRange = document.createRange();
        newRange.selectNodeContents(span);
        selection.addRange(newRange);
      } catch {}
    }

    this.onEditorInput();
    this.updateToolbarState();
    this.showTextColorPalette = false;
    this.editorElement.nativeElement.focus();
  }

  applyBackgroundColor(color?: string) {
    this.editorElement.nativeElement.focus();
    this.restoreSelection();
    document.execCommand("styleWithCSS", false, "true");
    document.execCommand("hiliteColor", false, color || "transparent");
    this.onEditorInput();
    this.updateToolbarState();
    this.showBgColorPalette = false;
  }

  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const textPalette = document.querySelector(
      ".color-btn:not(.highlight) .color-palette-dropdown",
    );
    const bgPalette = document.querySelector(
      ".color-btn.highlight .color-palette-dropdown",
    );
    const textButton = document.querySelector(".color-btn:not(.highlight)");
    const bgButton = document.querySelector(".color-btn.highlight");

    const clickedInsideTextPalette = textPalette?.contains(target);
    const clickedInsideBgPalette = bgPalette?.contains(target);
    const clickedOnTextButton = textButton?.contains(target);
    const clickedOnBgButton = bgButton?.contains(target);

    if (
      !clickedInsideTextPalette &&
      !clickedInsideBgPalette &&
      !clickedOnTextButton &&
      !clickedOnBgButton
    ) {
      this.showTextColorPalette = false;
      this.showBgColorPalette = false;
      this.cdr.detectChanges();
    }
  }

  private setupAutocomplete() {
    this.toControl.valueChanges.subscribe(value => {
      this.filteredToEmails = this.filterEmails(value || "");
      this.checkEmailExists(value || "", 'to');
    });

    this.ccControl.valueChanges.subscribe(value => {
      this.filteredCcEmails = this.filterEmails(value || "");
      this.checkEmailExists(value || "", 'cc');
    });

    this.bccControl.valueChanges.subscribe(value => {
      this.filteredBccEmails = this.filterEmails(value || "");
      this.checkEmailExists(value || "", 'bcc');
    });
  }

   private checkEmailExists(value: string, type: 'to' | 'cc' | 'bcc') {
    if (!value) {
      this.setFlag(type, false);
      return;
    }

    const f = value.toLowerCase();

    const exists = this.allEmails.some(c =>
      c.email.toLowerCase() === f
    );

    const filtered = this.allEmails.filter(c =>
      c.email.toLowerCase().includes(f)
    );

    const notFound = filtered.length === 0 && !exists;

    this.setFlag(type, notFound);
  }

  private setFlag(type: string, val: boolean) {
    if (type === 'to') this.noToEmailFound = val;
    if (type === 'cc') this.noCcEmailFound = val;
    if (type === 'bcc') this.noBccEmailFound = val;
  }

  private computeTo(type: string, email: GmailEmail, myEmail: string): string {
    if (type === "reply") return email.from;
    const my = myEmail.toLowerCase();
    const isSentByMe = email.from.toLowerCase().includes(my);
    const toList = isSentByMe
      ? email.toList?.length
        ? email.toList
        : this.parseEmails(email.to)
      : [
          email.from,
          ...(email.toList?.length ? email.toList : this.parseEmails(email.to)),
        ];
    return [...new Set(toList)]
      .filter((e) => e && !e.toLowerCase().includes(my))
      .join(", ");
  }

  private computeCc(email: GmailEmail, myEmail: string): string {
    const my = myEmail.toLowerCase();
    const ccList = email.ccList?.length
      ? email.ccList
      : this.parseEmails(email.cc);
    return [...new Set(ccList)]
      .filter((e) => e && !e.toLowerCase().includes(my))
      .join(", ");
  }

  private computeBcc(email: GmailEmail, myEmail: string): string {
    const my = myEmail.toLowerCase();
    const bccList = email.bccList?.length
      ? email.bccList
      : this.parseEmails(email.bcc);
    return [...new Set(bccList)]
      .filter((e) => e && !e.toLowerCase().includes(my))
      .join(", ");
  }

  private parseEmails(value?: string): string[] {
    return (
      value
        ?.split(",")
        .map((v) => v.trim())
        .filter(Boolean) || []
    );
  }

   onFileSelected(event: any) {
    if (!event.target.files) return;

    const files: FileList = event.target.files;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (this.attachments.some((a) => a.file.name === file.name)) {
        continue;
      }

      this.attachments.push({
        file,
        size: this.formatFileSize(file.size),
        icon: this.getFileIcon(file.type),
      });
    }

    event.target.value = "";
  }
  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    if (bytes < 1024 * 1024 * 1024)
      return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
  }

  getFileIcon(type: string): string {
    if (type.includes("pdf")) return "picture_as_pdf";
    if (type.includes("image")) return "image";
    if (type.includes("excel") || type.includes("sheet")) return "table_chart";
    if (type.includes("word")) return "description";
    if (type.includes("zip")) return "folder_zip";
    return "attach_file";
  }

  removeAttachment(index: number) {
    this.attachments.splice(index, 1);
  }

  async sendEmail() {

    if (this.selectedMailType === "project" && !this.selectedProjectId) {
      this.utilityService.showSwalToast(
        "Validation Error",
        "Please select a project before sending mail",
        "warning"
      );
      return;
    }

    if (!this.to.trim()) {
      this.utilityService.showSwalToast(
        "Validation Error",
        "Please enter at least one recipient in 'To' field",
        "warning",
      );
      return;
    }

    if (!this.subject.trim()) {
      this.utilityService.showSwalToast(
        "Validation Error",
        "Please enter a subject",
        "warning",
      );
      return;
    }

    try {

      const temp = document.createElement('div');
      temp.innerHTML = this.newBody;

      const oldAttachments: any[] = [];
      temp.querySelectorAll('a[download]').forEach((a: any) => {
        oldAttachments.push({
          fileName: a.getAttribute('download'),
          url: a.getAttribute('href')
        });
      });


      const uploadedFiles = this.attachments.length
        ? await this.gmailService.uploadMultiple(
            this.attachments.map((a) => a.file),
          )
        : [];

      let attachmentSection = "";

      const allAttachments = [
        ...oldAttachments,
        ...uploadedFiles.map((f: any) => ({
          fileName: f.fileName,
          url: f.url
        })),
        ...this.dmsAttachments.map((f) => ({
          fileName: f.name,
          url: f.url
        }))
      ];

      const uniqueAttachments = Array.from(
        new Map(allAttachments.map(f => [f.url, f])).values()
      );

      if (allAttachments.length > 0) {
        const now = new Date();
        const formatted = now.toLocaleString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        }).replace(",", "").replace(/ /g, " - ");


        attachmentSection = `
        <div style="border:1px solid #dadce0; background:#f6f8fa; padding:12px; border-radius:6px; margin-top:15px; margin-bottom:15px; font-family:Arial, sans-serif;">
          <div style="font-weight:600; margin-bottom:10px; justify-content:space-between; align-items:center;">
            <span>Attachments (${uniqueAttachments.length}) :</span>&nbsp;
            <span style="font-size:12px;color:#666;">
              ${formatted}
            </span>
          </div>

          ${allAttachments
            .map(
              (f) => `
              <div style="align-items:center; gap:8px; padding:6px 0;">
                <span style="font-size:16px">📎</span>
                <a href="${f.url}" download="${f.fileName}"
                  style="text-decoration:none; color:#1a73e8; font-weight:500;">
                  ${f.fileName}
                </a>
              </div>
            `
            )
            .join("")}
        </div>
        `;
      }

      const userId = this.getUserId();
      if (userId === null) {
        this.utilityService.showSwalToast(
          "Authentication Error",
          "User not logged in",
          "error",
        );
        return;
      }
      const cleanBody = this.cleanBodyBeforeSend(
        this.removeOldAttachmentSection(this.newBody)
      );

      const formatEmails = (list: any[]) =>
        list.map(x => x.fullName ? `${x.fullName} <${x.email}>` : x.email).join(',');
      
      const payload = {
        userId: userId.toString(),
        draftId: this.state?.email?.draftId || null,
        to: formatEmails(this.toObjects),
        cc: formatEmails(this.ccObjects),
        bcc: formatEmails(this.bccObjects),
        subject: this.combinedSubject,
        // body:  attachmentSection + this.newBody,
        body: attachmentSection + cleanBody,
        threadId: this.threadId || null,
        replyMessageId: this.replyMessageId || null,
        // attachments: [],
        attachments: uploadedFiles.map((f: any) => ({
          fileName: f.fileName,
          url: f.url
        })),
        projectId: this.selectedProjectId,
        attachmentsMeta: uniqueAttachments.map((f) => ({
          name: f.fileName,
          url: f.url
        }))
      };

      this.http
        .post<{
          threadId: string;
          messageId: string;
        }>(`${environment.apiPath}/api/gmail/send`, payload)
        .subscribe({
          next: (res) => {
            this.utilityService.showSwalToast(
              "Success",
              "Mail sent successfully",
              "success",
            );
            this.closeCompose();

            const sentMessageId = res.messageId;

            const hasLabel = !!this.state?.labelName;
            const hasProject = !!this.selectedProjectId;

            if (hasLabel || hasProject) {
              this.gmailService.getLabels().subscribe({
                next: (labelsRes) => {
                  const labels = labelsRes.labels || [];

                  const systemLabels = [
                    "INBOX",
                    "SENT",
                    "DRAFT",
                    "TRASH",
                    "SPAM",
                    "STARRED",
                    "IMPORTANT",
                    "CATEGORY_FORUMS",
                    "CATEGORY_UPDATES",
                    "CATEGORY_PERSONAL",
                    "CATEGORY_PROMOTIONS",
                    "CATEGORY_SOCIAL",
                    "UNREAD",
                    "YELLOW_STAR",
                    "CHAT",
                  ];

                  const userLabels = labels.filter(
                    (label: any) => !systemLabels.includes(label.name),
                  );

                  const labelObj = userLabels.find(
                    (l: any) =>
                      l.name.trim().toLowerCase() ===
                      this.state?.labelName?.trim().toLowerCase(),
                  );

                  const labelPayload: any = {
                    UserId: userId.toString(),
                    LabelName: this.state?.labelName,
                    MessageIds: [sentMessageId],
                  };

                  if (labelObj) {
                    labelPayload.LabelId = labelObj.id;
                  }

                  if (labelPayload.LabelName) {
                    this.gmailService.syncLabelEmails(labelPayload).subscribe({
                      next: () =>
                        console.log(
                          `Label (${labelPayload.LabelName}) emails synced!`,
                        ),
                      error: (err) => console.error("Label sync failed", err),
                    });
                  }

                  if (this.selectedProjectId) {
                    const selectedProject = this.projects.find(
                      (p) => p.id === this.selectedProjectId,
                    );
                    if (selectedProject) {
                      const projectLabelObj = userLabels.find(
                        (l: any) =>
                          l.name.trim().toLowerCase() ===
                          selectedProject.name.trim().toLowerCase(),
                      );

                      if (projectLabelObj) {
                        const projectLabelPayload = {
                          UserId: userId.toString(),
                          LabelId: projectLabelObj.id,
                          LabelName: selectedProject.name,
                          MessageIds: [sentMessageId],
                        };

                        this.gmailService
                          .applyLabel(projectLabelPayload)
                          .subscribe({
                            next: () =>
                              console.log(
                                `Project label (${projectLabelPayload.LabelName}) applied!`,
                              ),
                            error: (err) =>
                              console.error("Project label apply failed", err),
                          });
                      }
                    }
                  }
                },
                error: (err) => console.error("Failed to fetch labels", err),
              });
            }
          },
          error: (err) => console.error(err),
        });
    } catch (error: any) {
      console.error("Upload failed", error);
      this.utilityService.showSwalToast(
        "Invalid Attachment",
        error?.error?.message || "This file type is not allowed",
        "error",
      );
    }
  }

  closeCompose() {
    this.close.emit();
  }

  addTo(contact: any) {
    if (!this.toObjects.some(e => e.email === contact.email)) {
      this.toObjects.push(contact);
    }

    // still keep string for UI
    this.to = this.toObjects.map(e => e.email).join(", ");
    this.toControl.setValue("");
  }

  addCc(contact: any) {
    if (!this.ccObjects.some(e => e.email === contact.email)) {
      this.ccObjects.push(contact);
    }

    this.cc = this.ccObjects.map(e => e.email).join(", ");
    this.ccControl.setValue("");
  }

  addBcc(contact: any) {
    if (!this.bccObjects.some(e => e.email === contact.email)) {
      this.bccObjects.push(contact);
    }

    this.bcc = this.bccObjects.map(e => e.email).join(", ");
    this.bccControl.setValue("");
  }

  removeTo(index: number) {
    const l = this.toList;
    l.splice(index, 1);
    this.to = l.join(", ");
  }
  removeCc(index: number) {
    const l = this.ccList;
    l.splice(index, 1);
    this.cc = l.join(", ");
  }
  removeBcc(index: number) {
    const l = this.bccList;
    l.splice(index, 1);
    this.bcc = l.join(", ");
  }

  get toList(): string[] {
    return this.parseEmails(this.to);
  }
  get ccList(): string[] {
    return this.parseEmails(this.cc);
  }
  get bccList(): string[] {
    return this.parseEmails(this.bcc);
  }

  get combinedSubject(): string {
    const projectName = this.projectControl.value || '';
    const subjectText = this.subject || '';
    if (this.state?.type === 'new') {
        return projectName ? `${subjectText} | ${projectName}` : subjectText;
      }
      return subjectText;
  }

  loadContacts() {
    this.http
      .get<ContactEmail[]>(`${environment.apiPath}/api/gmail/contacts/emails`)
      .subscribe((res) => {
        this.allEmails = res.filter(
          (v, i, a) => a.findIndex((t) => t.email === v.email) === i,
        );
      });
  }

  filterEmails(value: string): ContactEmail[] {
    const f = value.toLowerCase();
    return this.allEmails.filter((c) => c.email.toLowerCase().includes(f));
  }

  private fetchSignature(fromEmail: string): Promise<string> {
    const userId = this.getUserId();
    if (userId === null) return Promise.resolve("");

    return this.http
      .get<{ signature: string }>(
        `${environment.apiPath}/api/gmail/signature?userId=${userId.toString()}&fromEmail=${fromEmail}`,
      )
      .toPromise()
      .then((res) => res?.signature || "");
  }

  toggleMaximize() {
    this.isMaximized = !this.isMaximized;

    if (this.isMaximized) {
      this.isMinimized = false;
    }
  }

  toggleMinimize() {
    this.isMinimized = !this.isMinimized;

    if (this.isMinimized) {
      this.isMaximized = false;
    }
  }

  loadProjects() {
    this.isProjectLoading = true;

    const userData = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const isFullAccess = userData.roles?.includes("MASTER") || false;

    this.projectService.getProjectsForEmail(0, 10000, isFullAccess).subscribe({
      next: (res: any) => {
        this.projects = (res?.list || []).map((p: any) => ({
          id: p.id,
          code: p.code,
          name: `${p.code} - ${p.title}`,
        }));
        
        this.filteredProjects = [...this.projects];
        this.isProjectLoading = false;
        if (this.state?.labelName) {
          const matchedProject = this.projects.find(
            p => p.name.trim().toLowerCase() ===
                this.state.labelName.trim().toLowerCase()
          );

          if (matchedProject) {
            this.selectedProjectId = matchedProject.id;
            this.projectControl.setValue(matchedProject.name, { emitEvent:false });
          }

        }
      },
      error: (err) => {
        console.error("Error fetching projects:", err);
        this.isProjectLoading = false;
      },
    });
  }

  onProjectSelected(project: Project | null) {
    if (project === null) {
      this.selectedProjectId = null;
      this.projectControl.setValue(null, { emitEvent: false });
      this.associations = [];
    } else {
      this.selectedProjectId = project.id;
      this.projectControl.setValue(project.name, { emitEvent: false });
      this.loadProjectAssociations(project.id);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const dropZone = (event.currentTarget as HTMLElement);
    dropZone.classList.add('drag-over');
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const dropZone = (event.currentTarget as HTMLElement);
    dropZone.classList.remove('drag-over');
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const dropZone = event.currentTarget as HTMLElement;
    dropZone.classList.remove("drag-over");

    const files = event.dataTransfer?.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (this.attachments.some((a) => a.file.name === file.name)) continue;

      this.attachments.push({
        file,
        size: this.formatFileSize(file.size),
        icon: this.getFileIcon(file.type),
      });
    }
  }

  async saveDraft() {
    try {
      const temp = document.createElement('div');
      temp.innerHTML = this.newBody;
      const oldAttachments: any[] = [];
      temp.querySelectorAll('a[download]').forEach((a: any) => {
        oldAttachments.push({
          fileName: a.getAttribute('download'),
          url: a.getAttribute('href')
        });
      });

      const uploadedFiles = this.attachments.length
        ? await this.gmailService.uploadMultiple(
            this.attachments.map((a) => a.file),
          )
        : [];

      const allAttachments = [
        ...oldAttachments,
        ...uploadedFiles.map((f: any) => ({
          fileName: f.fileName,
          url: f.url
        })),
        ...(this.dmsAttachments || []).map((f: any) => ({
          fileName: f.name,
          url: f.url
        }))
      ];

      const uniqueAttachments = Array.from(
        new Map(allAttachments.map(f => [f.url, f])).values()
      );

      let attachmentSection = "";

      if (uniqueAttachments.length > 0) {
        const now = new Date();
        const formatted = now.toLocaleString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        }).replace(",", "").replace(/ /g, " - ");

        attachmentSection = `
          <div style="border:1px solid #dadce0; background:#f6f8fa; padding:12px; border-radius:6px; margin-bottom:15px; font-family:Arial, sans-serif;">
            <div style="font-weight:600; margin-bottom:10px;">
              <span>Attachments (${uniqueAttachments.length}) :</span>&nbsp;
              <span style="font-size:12px;color:#666;">
                ${formatted}
              </span>
            </div>

           ${uniqueAttachments
            .map(
              (f) => `
              <div style="display:flex; align-items:center; justify-content:space-between; padding:6px 0;">
                
                <div>
                  <span style="font-size:16px">📎</span>
                  <a href="${f.url}" download="${f.fileName}" style="text-decoration:none; color:#1a73e8; font-weight:500;">
                    ${f.fileName}
                  </a>
                </div>

                <span 
                  data-remove="true"
                  data-url="${f.url}"
                  contenteditable="false"
                  style="cursor:pointer; color:red; font-weight:bold; margin-left:10px;"
                >
                  ✕
                </span>

              </div>
            `
            )
            .join("")}
          </div>
        `;
      }

      const userId = this.getUserId();
      if (!userId) throw new Error("User not logged in");

      const cleanBody = this.cleanBodyBeforeSend(
        this.removeOldAttachmentSection(this.newBody)
      );
      const formatEmails = (list: any[]) =>
        list.map(x => x.fullName ? `${x.fullName} <${x.email}>` : x.email).join(',');
      const payload = {
        userId: userId.toString(),
        to: formatEmails(this.toObjects),
        cc: formatEmails(this.ccObjects),
        bcc: formatEmails(this.bccObjects),
        subject: this.combinedSubject,
        body: attachmentSection + cleanBody,
        threadId: this.threadId || null,
        replyMessageId: this.replyMessageId || null,
        projectId: this.selectedProjectId,
        draftId: this.state?.email?.draftId || null
      };

      this.gmailService.saveDraft(payload).subscribe({
        next: () => {
          this.utilityService.showSwalToast(
            "Success",
            "Draft saved successfully",
            "success",
          );
        },
        error: (err) => {
          console.error(err);
          this.utilityService.showSwalToast(
            "Error",
            "Failed to save draft",
            "error",
          );
        },
      });

    } catch (err: any) {
      console.error(err);
      this.utilityService.showSwalToast(
        "Error",
        err.message || "Draft save failed",
        "error",
      );
    }
  }

  removeOldAttachmentSection(html: string): string {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const sections = temp.querySelectorAll('div');
    sections.forEach((div: any) => {
      if (div.innerText?.includes('Attachments (')) {
        div.remove();
      }
    });

    temp.querySelectorAll('a[download]').forEach((a: any) => {
      const parent = a.parentElement;
      if (parent && parent.innerText.includes('📎')) {
        parent.remove();
      } else {
        a.remove();
      }
    });

    return temp.innerHTML;
  }

  extractOldAttachments(html: string): { fileName: string; url: string }[] {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const links = temp.querySelectorAll('a[download]');
    const files: any[] = [];
    links.forEach((a: any) => {
      files.push({
        fileName: a.getAttribute('download'),
        url: a.getAttribute('href')
      });
    });
    return files;
  }

  selectMailType(type: 'project' | 'other') {
    this.selectedMailType = type;
    if (type === 'other') {
      this.selectedProjectId = null;
      this.projectControl.setValue('');
      this.projectControl.disable();
    } else {
      this.projectControl.enable();
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const text = event.clipboardData?.getData("text/html") || event.clipboardData?.getData("text/plain") || "";
    const cleaned = this.cleanHtml(text);
    document.execCommand("insertHTML", false, cleaned);
  }

  cleanHtml(html: string): string {
    const div = document.createElement("div");
    div.innerHTML = html;
    ["style", "script", "meta", "link"].forEach(tag => {
      div.querySelectorAll(tag).forEach(el => el.remove());
    });
    div.querySelectorAll("li").forEach(li => {
      const p = document.createElement("p");
      p.innerHTML = li.innerHTML;
      li.replaceWith(p);
    });
    div.querySelectorAll("ol, ul").forEach(list => {
      const parent = list.parentNode;
      if (!parent) return;

      while (list.firstChild) {
        parent.insertBefore(list.firstChild, list);
      }
      parent.removeChild(list);
    });

    div.querySelectorAll("*").forEach(el => {
      el.removeAttribute("style");
      el.removeAttribute("class");
    });
    return div.innerHTML;
  }

    private async loadProjectAssociations(projectId: number) {
    const project = await firstValueFrom(this.projectService.getById(projectId));
    this.associations = project.associations || [];
  }

  isContactAdded(item: any): boolean {
    const email = item?.contact?.email;
    return this.to.includes(email) || this.cc.includes(email) || this.bcc.includes(email);
  }

  getContactTypeFlag(item: any): string | null {
    const email = item?.contact?.email;
    if (this.to.includes(email)) return 'TO';
    if (this.cc.includes(email)) return 'CC';
    if (this.bcc.includes(email)) return 'BCC';
    return null;
  }

  addToRecipients(item: any, type: 'TO' | 'CC' | 'BCC') {
    const contact = item.contact;
    if (!contact?.email) return;
    const email = contact.email;
    const obj = {
      email: contact.email,
      fullName: contact.fullName
    };
    this.toObjects = this.toObjects.filter(e => e.email !== email);
    this.ccObjects = this.ccObjects.filter(e => e.email !== email);
    this.bccObjects = this.bccObjects.filter(e => e.email !== email);

    const alreadySelected =
      (type === 'TO' && this.to.includes(email)) ||
      (type === 'CC' && this.cc.includes(email)) ||
      (type === 'BCC' && this.bcc.includes(email));

    if (!alreadySelected) {
      if (type === 'TO') this.toObjects.push(obj);
      if (type === 'CC') this.ccObjects.push(obj);
      if (type === 'BCC') this.bccObjects.push(obj);
    }

    this.to = this.toObjects.map(e => e.email).join(', ');
    this.cc = this.ccObjects.map(e => e.email).join(', ');
    this.bcc = this.bccObjects.map(e => e.email).join(', ');

    if (type === 'CC' || type === 'BCC') {
      this.showCcBcc = true;
    }
  }
}
