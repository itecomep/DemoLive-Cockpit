import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { GmailService } from '../services/gmail.service';
import { CommonModule } from '@angular/common'; 

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

interface ThreadMessage {
  messageId: string;
  from: string;
  subject: string;
  body: string;
  date: string;
  safeBody?: SafeHtml;
  safeFrom?: SafeHtml;
  safeTo?: SafeHtml;
  safeCc?: SafeHtml;
  safeBcc?: SafeHtml;
  safeSubject?: SafeHtml;
  to?: string;
  cc?: string;
  bcc?: string;
  attachments?: Attachment[];
}

interface EmailThread {
  threadId: string;
  subject: string;
  from: string;
  date: string;
  snippet: string;
  messages: ThreadMessage[];
  expanded: boolean;
  subject_safe?: SafeHtml;
  from_safe?: SafeHtml;
  to_safe?: SafeHtml;
  cc_safe?: SafeHtml;
  bcc_safe?: SafeHtml;
}

interface Attachment {
  fileName: string;
  mimeType: string;
  blobUrl: string;
  safeName?: SafeHtml;
}

@Component({
  selector: 'app-all-mail',
  templateUrl: './all-mail.component.html',
  styleUrls: ['./all-mail.component.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatIconModule, 
    MatCheckboxModule, MatButtonModule, MatFormFieldModule, MatInputModule
  ],
})
export class AllMailComponent implements OnChanges {
  
  @Input() labelName: string = '';
  @Input() userId: string = '';
  emailThreads: EmailThread[] = [];
  loadingEmails = false;
  searchText: string = '';
  currentPage = 1;
  totalPages = 1;
  totalEmails = 0;
  pageSize = 20;
  hasNext = false;
  @Output() prevPage = new EventEmitter<void>();
  @Output() nextPage = new EventEmitter<void>();

  constructor(private gmailService: GmailService, private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['labelName'] && this.labelName) {
      this.loadEmails();
    }
  }

  loadEmails(page: number = 1) {
    if (!this.labelName) return;

    this.loadingEmails = true;
    this.emailThreads = [];
    this.currentPage = page;

    this.gmailService.getEmailsByLabel(this.labelName, page, this.pageSize)
      .subscribe({
        next: res => {
          this.emailThreads = res.threads.map((t: any) => ({
            ...t,
            expanded: false,
            messages: t.messages.map((m: any) => ({
              ...m,
              safeBody: this.sanitizer.bypassSecurityTrustHtml(m.body || ''),
              safeFrom: this.sanitizer.bypassSecurityTrustHtml(m.from || ''),
              safeTo: this.sanitizer.bypassSecurityTrustHtml(m.to || ''),
              safeCc: this.sanitizer.bypassSecurityTrustHtml(m.cc || ''),
              safeBcc: this.sanitizer.bypassSecurityTrustHtml(m.bcc || ''),
              safeSubject: this.sanitizer.bypassSecurityTrustHtml(m.subject || ''),
              attachments: m.attachments?.map((a: any) => ({
                ...a,
                safeName: this.sanitizer.bypassSecurityTrustHtml(a.fileName || '')
              }))
            }))
          }));

          this.totalEmails = res.totalEmails;
          this.totalPages = Math.ceil(this.totalEmails / this.pageSize);
          this.hasNext = this.currentPage < this.totalPages;

          this.loadingEmails = false;
        },
        error: () => {
          this.emailThreads = [];
          this.loadingEmails = false;
        }
      });
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.loadEmails(page);
  }

  toggleThread(thread: EmailThread) {
    thread.expanded = !thread.expanded;
  }

  highlightAllMatches() {
    const term = this.searchText?.toLowerCase().trim() || '';

    this.emailThreads.forEach(thread => {
      let threadHasMatch = false;

      if (this.contains(term, thread.subject) || this.contains(term, thread.from)) {
        threadHasMatch = true;
      }

      thread.subject_safe = this.highlightText(thread.subject || '', term);
      thread.from_safe = this.highlightText(thread.from || '', term);

      thread.messages.forEach(msg => {
        const messageMatch =
          this.contains(term, msg.body) ||
          this.contains(term, msg.from) ||
          this.contains(term, msg.to) ||
          this.contains(term, msg.cc) ||
          this.contains(term, msg.bcc) ||
          this.contains(term, msg.subject) ||
          msg.attachments?.some(att => this.contains(term, att.fileName));

        if (messageMatch) {
          threadHasMatch = true;
        }

        msg.safeBody = this.highlightText(msg.body || '', term);
        msg.safeFrom = this.highlightText(msg.from || '', term);
        msg.safeTo = this.highlightText(msg.to || '', term);
        msg.safeCc = this.highlightText(msg.cc || '', term);
        msg.safeBcc = this.highlightText(msg.bcc || '', term);
        msg.safeSubject = this.highlightText(msg.subject || '', term);

        msg.attachments?.forEach(att => {
          att.safeName = this.highlightText(att.fileName || '', term);
        });
      });

      thread.expanded = !!term && threadHasMatch;
    });
  }

  contains(term: string, value?: string): boolean {
    if (!term || !value) return false;
    return value.toLowerCase().includes(term);
  }


  highlightText(html: string, term: string): SafeHtml {
    if (!html || !term) {
      return this.sanitizer.bypassSecurityTrustHtml(html || '');
    }

    const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedTerm, 'gi');

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const walk = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.nodeValue || '';
        if (regex.test(text)) {
          const span = doc.createElement('span');
          span.innerHTML = text.replace(
            regex,
            '<mark class="search-highlight">$&</mark>'
          );
          node.parentNode?.replaceChild(span, node);
        }
      } else {
        node.childNodes.forEach(walk);
      }
    };

    doc.body.childNodes.forEach(walk);

    return this.sanitizer.bypassSecurityTrustHtml(doc.body.innerHTML);
  }


}
