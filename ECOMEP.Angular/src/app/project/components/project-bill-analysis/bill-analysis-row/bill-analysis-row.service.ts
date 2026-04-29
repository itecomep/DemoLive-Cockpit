import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BillAnalysisRowService {

  // ✅ Base API URL (change if needed)
  private baseUrl = environment.apiPath + '/api/BillFollowUp';

  constructor(private http: HttpClient) {}

  // ================= SAVE FOLLOW-UP =================
  save(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/save`, formData);
  }

  // ================= GET FOLLOW-UP HISTORY =================
  get(billId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${billId}`);
  }

  // UPDATE
update(id: number, formData: FormData) {
  return this.http.put(`${this.baseUrl}/update/${id}`, formData);
}

// DELETE
// delete(id: number) {
//   return this.http.delete(`${this.baseUrl}/delete/${id}`);
// }
delete(id: number) {
  return this.http.delete(`${this.baseUrl}/delete/${id}`);
}

}