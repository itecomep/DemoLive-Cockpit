// src/app/services/ip.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IpService {
  constructor(private http: HttpClient) {}

getClientIp(): Observable<string> {
  // return this.http.get<{ ip: string }>('http://192.168.1.189:8080/Auth/client-ip')

  // return this.http.get<{ ip: string }>('https://myecomep.com/staging-api/Auth/client-ip')
  return this.http.get<{ ip: string }>('https://myecomep.com/api/Auth/client-ip')
    .pipe(map(res => res.ip));
}

}
