import { HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, EMPTY } from 'rxjs';
import { SafeHtml } from '@angular/platform-browser';
import { environment } from "src/environments/environment";

export interface GmailEmail {
  id: string;
  threadId?: string; 
  rfcMessageId?: string;
  from: string;
  to?: string;
  toList?: string[];  
  cc?: string;
  references?: string;
  ccList?: string[];
  bccList?: string[];
  bcc?: string;
  subject: string;
  body?: string;
  snippet: string;
  date: string;
  attachments?: GmailAttachment[];
  threadMessages?: GmailEmail[];
  showReplies?: boolean;
  read?: boolean;
  starred?: boolean;
  expanded?: boolean;
  safeBody?: SafeHtml;
  selected?: boolean;
  labels?: string[];
  draftId?: string; 
}

export interface GmailAttachment {
  fileName: string;
  mimeType: string;
  attachmentId: string;
  size: number;
  file?: File;
  source?: 'gmail' | 'user';
  url?: string;
}

export interface LabelSyncDto {
  userId: number;
  labelId: string;
  labelName?: string;
}

@Injectable({ providedIn: 'root' })
export class GmailService {
  private api = `${environment.apiPath}/api/gmail`;

  constructor(private http: HttpClient) {}

  private getUserId(): number | null {
    const data = localStorage.getItem('currentUser');
    if (!data) return null;

    try {
      return JSON.parse(data).userId ?? null;
    } catch {
      return null;
    }
  }

  getLoggedInEmail(): Observable<{ email: string | null }> {
    const userId = this.getUserId();
    if (!userId) {
      return new Observable(subscriber => {
        subscriber.next({ email: null });
        subscriber.complete();
      });
    }

    return this.http.get<{ email: string | null }>(`${this.api}/me`, {
      params: { userId }
    });
  }

  getEmails(pageToken: string | null = null, pageSize: number = 20): Observable<any> {
    const userId = this.getUserId();
    let params: any = {
      userId: userId ?? '',
      pageSize: pageSize.toString()
    };
    if (pageToken) params.pageToken = pageToken;

    return this.http.get<any>(`${this.api}/emails`, { params });
  }

  getSentEmails(pageToken: string | null = null, pageSize: number = 20): Observable<any> {
    const userId = this.getUserId();
    let params: any = {
      userId: userId ?? '',
      pageSize: pageSize.toString()
    };
    if (pageToken) params.pageToken = pageToken;

    return this.http.get<any>(`${this.api}/sent`, { params });
  }

  sendEmailFormData(formData: FormData) {
    return this.http.post(
      `${this.api}/send`,
      formData
    );
  }

  getThreadMessages(threadId: string) {
    const userId = this.getUserId();

    if (userId === null) {
      return throwError(() => new Error("User not logged in"));
    }

    return this.http.get<GmailEmail[]>(
      `${this.api}/threads/${threadId}`,
      { params: { userId: userId.toString() } }
    );
  }

  getLabels(): Observable<any> {
    const userId = this.getUserId();

    if (userId === null) {
      return throwError(() => new Error("User not logged in"));
    }

    return this.http.get<any>(
      `${this.api}/labels`,
      { params: { userId: userId.toString() } }
    );
  }

  applyLabel(payload: any): Observable<any> {
    return this.http.post(`${this.api}/apply-label`, payload);
  }

 syncLabelEmails(payload: { UserId: string; LabelName: string }): Observable<any> {
    return this.http.post(`${environment.apiPath}/api/gmail/sync-label-emails`, payload);
  }

  getEmailsByLabel(labelName: string, pageNumber: number = 1, pageSize: number = 20) {
    return this.http.post<{ threads: any[], totalEmails: number }>(
      `${environment.apiPath}/api/gmail/by-label`,
      { labelName, pageNumber, pageSize }
    );
  }

  markAsRead(messageId: string): Observable<any> {
    const userId = this.getUserId();

    if (userId === null) {
      return throwError(() => new Error("User not logged in"));
    }

    return this.http.post(
      `${this.api}/mark-read`,
      {
        messageId,
        userId: userId.toString()
      }
    );
  }

  searchEmails(query: string, pageToken: string | null = null, pageSize: number = 20) {
    const userId = this.getUserId();
    if (!userId) return EMPTY;

    return this.http.get<{
      emails: any[],
      total: number,
      nextPageToken: string | null
    }>(`${environment.apiPath}/api/gmail/search`, {
      params: {
        userId,
        query,
        pageToken: pageToken || '',
        pageSize: pageSize.toString()
      }
    });
  }

  disconnect(userId: string) {
    return this.http.post(
      `${environment.apiPath}/api/gmail/disconnect?userId=${userId}`,
      {}
    );
  }

   async uploadToAzure(file: File): Promise<{ fileName: string; url: string }> {
    const formData = new FormData();
    formData.append("file", file);

    return (await this.http
      .post<{
        fileName: string;
        url: string;
      }>(`${environment.apiPath}/api/gmail/azure/upload`, formData)
      .toPromise()) as any;
  }

  async uploadMultiple(
    files: File[],
  ): Promise<{ fileName: string; url: string }[]> {
    return Promise.all(files.map((file) => this.uploadToAzure(file)));
  }
  
  getDraftEmails(pageToken: string | null = null, pageSize: number = 20): Observable<any> {
    const userId = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')!).userId : null;
    if (!userId) throw new Error('User not logged in');

    const params = new HttpParams()
      .set('userId', userId)
      .set('pageSize', pageSize.toString())
      .set('pageToken', pageToken || '');

    return this.http.get(`${environment.apiPath}/api/gmail/drafts`, { params });
  }

  saveDraft(payload: any) {
    return this.http.post(`${environment.apiPath}/api/gmail/draft`, payload);
  }

  deleteDraft(draftId: string, userId: string) {
    return this.http.delete(
      `${environment.apiPath}/api/gmail/draft/${draftId}?userId=${userId}`
    );
  }
}
