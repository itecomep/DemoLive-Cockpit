import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

// ✅ AUTH SERVICE
import { AuthService } from "src/app/auth/services/auth.service";

// ================= INTERFACES =================

export interface WfhFile {
  name: string;
  url: string;
}

export interface WfhRequest {
  id: number;
  userID: number;
  userName: string;

  startDate: string;
  endDate: string;

  reason: string;

  files: WfhFile[];

  created: string;
  modified?: string;
}

// ================= SERVICE =================

@Injectable({
  providedIn: "root",
})
export class WorkFromHomeService {
  private readonly baseUrl = "http://localhost:5054/api/WorkFromHome";

  private authService = inject(AuthService);

  constructor(private http: HttpClient) {}

  // ================= GET CURRENT USER =================
  private getCurrentUser() {
    const user = this.authService.currentUserStore;

    return {
      userId: user?.contact?.id ?? 0,
      userName: user?.contact?.name || user?.username || "",
    };
  }

  // ================= GET ALL =================
  getAll(): Observable<WfhRequest[]> {
    return this.http.get<WfhRequest[]>(`${this.baseUrl}`);
  }

  // ================= GET MY REQUESTS =================
  getMyRequests(): Observable<WfhRequest[]> {
    return this.http.get<WfhRequest[]>(`${this.baseUrl}/my`);
  }

  // ================= CREATE =================
  create(data: FormData): Observable<any> {
    // ✅ FIXED: use correct keys (userId, userName)
    if (!data.has("userId")) {
      const user = this.getCurrentUser();

      data.append("userId", user.userId.toString());
      data.append("userName", user.userName);
    }

    return this.http.post(`${this.baseUrl}/create`, data);
  }

  // ================= UPDATE =================
  update(id: number, data: FormData): Observable<any> {
    // ✅ FIXED: same logic here
    if (!data.has("userId")) {
      const user = this.getCurrentUser();

      data.append("userId", user.userId.toString());
      data.append("userName", user.userName);
    }

    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  // ================= DELETE =================
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // ================= FILE DELETE =================
  deleteFile(requestId: number, fileName: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${requestId}/file`, {
      params: { fileName },
    });
  }

  // ================= FILE URL =================
  getFileUrl(path: string): string {
    if (!path) return "";

    if (path.startsWith("http")) return path;

    return `${window.location.origin}${path}`;
  }
}
