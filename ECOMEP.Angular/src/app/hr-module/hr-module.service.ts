import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Attachment {
  fileName: string;
  url: string;
}

export interface WfhRequest {
  id: number;
  userId: number;
  userName: string;
  startDate: string;
endDate: string;
  reason: string;
  status: string; 
  attachments: Attachment[];
}

@Injectable({
  providedIn: 'root'
})
export class HrModuleService {

  private baseUrl = 'http://localhost:5054/api/WorkFromHome';
  private baseleaveUrl = 'http://localhost:5054/Leave';

  constructor(private http: HttpClient) {}

  getRequests(): Observable<WfhRequest[]> {
    return this.http.get<WfhRequest[]>(`${this.baseUrl}/list`);
  }

  getLeaves() {
    return this.http.get<any[]>(`${this.baseleaveUrl}/LeaveList`); 
  }

  updateStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/update-status/${id}`, {
      status: status
    });
  }

  getContactTeams() {
    return this.http.get<any[]>(`http://localhost:5054/ContactTeam`);
  }

  updateRequest(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${id}`, data);
  }

  deleteRequest(id: number): Observable<any> {
  return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }

  updateLeaveStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.baseleaveUrl}/update-status/${id}`, {
       status: status
    });
  }

}