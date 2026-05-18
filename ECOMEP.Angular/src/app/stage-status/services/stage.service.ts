import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";


@Injectable({ providedIn: "root" })
export class StageService {
  private baseUrl = environment.apiPath + "/api/project-stages";
  constructor(private http: HttpClient) {}

  getStagesByProject(projectId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/stages/${projectId}`);
  }	

  // getUserProjectStageMails( userId: number ): Observable<any[]> {
  //   return this.http.get<any[]>(
  //     `${this.baseUrl}/user-mails/${userId}`
  //   );
  // }

  getUserProjectStageMails(projectIds: number[]): Observable<any[]> {
    return this.http.post<any[]>(
      `${this.baseUrl}/user-mails`,
      projectIds
    );
  }

  getLatestRevisions(projectId: number, stageId: number) {
    return this.http.get<any>(
      `${this.baseUrl}/latest-revisions?projectId=${projectId}&stageId=${stageId}`
    );
  }
}
