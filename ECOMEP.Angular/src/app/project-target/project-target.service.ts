// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class ProjectTargetService {

//   constructor() { }
// }


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectTargetService {

  // 🔥 Use environment if available, else keep as is
  private baseUrl = 'http://localhost:5054/api/projecttarget';

  constructor(private http: HttpClient) {}

  // ================= GET =================

  // 🔹 Get all targets
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  // 🔹 Get form data (projects + stages + statuses)
  getFormData(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/form-data`);
  }

  // 🔹 Get stages based on selected project
  getStagesByProject(projectId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/stages/${projectId}`);
  }

  // ================= POST =================

  // 🔹 Create new project target
  create(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, data);
  }

  // ================= DELETE =================

  // 🔹 Soft delete
  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  update(id: number, data: any) {
  return this.http.put(`${this.baseUrl}/${id}`, data);
}


getById(id: number) {
  return this.http.get<any>(`${this.baseUrl}/${id}`);
}
}