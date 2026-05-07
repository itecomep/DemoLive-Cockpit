import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectInwardService {

  private apiUrl = 'http://localhost:5054/ProjectInwardNew';

  constructor(private http: HttpClient) {}

  // create(data: any): Observable<any> {
  //   return this.http.post(this.apiUrl, data);
  // }

  create(data: FormData): Observable<any> {
  return this.http.post(this.apiUrl, data);
}
}