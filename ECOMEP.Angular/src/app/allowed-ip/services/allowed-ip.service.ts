import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AllowedIp {
  id?: number;
  ipAddress: string;
  description?: string;
  isActive?: boolean;
}

export interface BypassUser {
  id: number;
  username: string;
  isActive: boolean;
  createdAt: string;
}

export interface ContactUser {
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class AllowedIpService {

  //  private baseUrl = 'http://192.168.1.189:8080/api/admin/ip';
  //  private baseUrl = 'https://myecomep.com/staging-api/api/admin/ip';
  //  private baseUrlForBypassUser = 'https://myecomep.com/staging-api/api';
  //  private contactBaseUrl = 'https://myecomep.com/staging-api/api/bypass-allowed-user/contacts';

  private baseUrl = 'https://myecomep.com/api/api/admin/ip';
   private baseUrlForBypassUser = 'https://myecomep.com/api/api';
   private contactBaseUrl = 'https://myecomep.com/api/api/bypass-allowed-user/contacts';
  constructor(private http: HttpClient) {}
  

  getAll(): Observable<AllowedIp[]> {
    return this.http.get<AllowedIp[]>(`${this.baseUrl}/list`);
  }

  add(ip: AllowedIp): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, ip);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }

  // ----- Bypass Allowed User -----
  getBypassUsers(): Observable<BypassUser[]> {
    return this.http.get<BypassUser[]>(`${this.baseUrlForBypassUser}/bypass-allowed-user`);
  }

  addBypassUser(user: Partial<BypassUser>): Observable<BypassUser> {
    return this.http.post<BypassUser>(`${this.baseUrlForBypassUser}/bypass-allowed-user`, user);
  }

  updateBypassUser(id: number, user: Partial<BypassUser>): Observable<BypassUser> {
    return this.http.put<BypassUser>(`${this.baseUrlForBypassUser}/bypass-allowed-user/${id}`, user);
  }

  deleteBypassUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrlForBypassUser}/bypass-allowed-user/${id}`);
  }

  // 🔹 GET CONTACT USERNAMES
  getContactUsers(): Observable<ContactUser[]> {
    return this.http.get<ContactUser[]>(`${this.contactBaseUrl}`);
  }

  // 🔹 ADD BYPASS USER (send username only)
  addBypassUserByUsername(username: string): Observable<any> {
    return this.http.post(this.baseUrlForBypassUser, {
      username,
      isActive: true
    });
  }

}
