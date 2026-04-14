import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

// ================= INTERFACES =================

export interface ChecklistFile {
  name: string;
  url: string;
}

export interface ChecklistItem {
  id: number;
  title: string;
  description?: string;
  files: ChecklistFile[];
}

export interface ChecklistCategory {
  categoryId: number;
  categoryName: string;
  checklists: ChecklistItem[];
}

export interface ChecklistStage {
  stageId: number;
  stageName: string;
  categories: ChecklistCategory[];
}

// ================= SERVICE =================

@Injectable({
  providedIn: 'root'
})
export class ChecklistService {

  private readonly baseUrl = environment.apiPath + '/api/TodoStage';

  constructor(private http: HttpClient) {}

  // ================= TREE =================
  getTreeUI(): Observable<ChecklistStage[]> {
    return this.http.get<ChecklistStage[]>(`${this.baseUrl}/tree-ui`);
  }

  // ================= STAGE =================
  getStages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/stages`);
  }

  updateStage(id: number, title: string): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/stage/${id}`,
      JSON.stringify(title),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  deleteStage(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/stage/${id}`);
  }

  // ================= CATEGORY =================
  getCategories(stageId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/categories/${stageId}`);
  }

  updateCategory(id: number, title: string): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/category/${id}`,
      JSON.stringify(title),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/category/${id}`);
  }

  // ================= CHECKLIST =================
  updateChecklist(id: number, data: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/checklist/${id}`, data);
  }

  deleteChecklist(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/checklist/${id}`);
  }

  // ================= CREATE =================
  save(data: FormData): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/save`, data, {
      responseType: 'text' as 'json'
    });
  }

  // ================= 🔥 SINGLE FILE DELETE (OLD - KEEP) =================
  deleteFile(checklistId: number, fileName: string): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/checklist/${checklistId}/file`,
      {
        params: { fileName }
      }
    );
  }

  // ================= 🚀 BULK FILE DELETE (NEW - FIX) =================
  deleteMultipleFiles(checklistId: number, fileNames: string[]): Observable<any> {
    return this.http.request(
      'delete',
      `${this.baseUrl}/checklist/${checklistId}/files`,
      {
        body: fileNames
      }
    );
  }

  // ================= FILE URL =================
  getFileUrl(path: string): string {
    if (!path) return '';

    // Azure URLs already absolute
    if (path.startsWith('http')) return path;

    return `${window.location.origin}${path}`;
  }
}