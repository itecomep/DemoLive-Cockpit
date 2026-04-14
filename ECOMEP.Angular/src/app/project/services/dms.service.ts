import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";

export interface RenameFolderDto {
  projectId: number;
  oldPath: string;
  newName: string;
}

export interface SubFolder {
  id: number;
  folderName: string;
  createdBy?: string;
}

export interface UploadMetadataDto {
  projectId: number;
  folderId?: number;
  classification?: string;
  createdBy?: string;
  tags?: string[];
  files: FileMetaDto[];
  deniedUsers?: string[];
}

export interface FileMetaDto {
  fileName: string;
  blobUrl: string;
  fileSize: number;
}

export interface AddFullClassificationDto {
  classification: string;
  subClassification?: string;
  subSubClassification?: string;
  createdBy?: string;
}

@Injectable({ providedIn: "root" })
export class DmsService {
  private baseUrl = environment.apiPath + "/api/DmsAttachment";

  constructor(private http: HttpClient) {}

  uploadFile(formData: FormData): Observable<any> {
    const headers = new HttpHeaders();
    return this.http.post<any>(`${this.baseUrl}/upload`, formData, { headers });
  }

  getFolderTree(projectId: number, userId: string, isMaster: boolean): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/folderTree/${projectId}?userId=${userId}&isMaster=${isMaster}`);
  }

  getClassifications() {
    return this.http.get<any[]>(`${this.baseUrl}/classifications`);
  }

  getSubClassifications(classificationId: number) {
    return this.http.get<any[]>(`${this.baseUrl}/sub-classifications/${classificationId}`);
  }

  getSubSubClassifications(subClassificationId: number) {
    return this.http.get<any[]>(`${this.baseUrl}/sub-sub-classifications/${subClassificationId}`);
  }

  addFullClassification(data: AddFullClassificationDto) {
    return this.http.post(`${this.baseUrl}/add-full-classification`, data);
  }

  searchFiles(
    projectId: number,
    query?: string,
    fromDate?: string,
    toDate?: string,
    isMaster?: boolean
  ) {
    let params: any = { projectId };

    if (query) params.query = query;
    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;
    if (isMaster !== undefined) params.isMaster = isMaster;

    return this.http.get<any[]>(`${this.baseUrl}/search`, { params });
  }

  // uploadMultipleFiles(formData: FormData) {
  //   return this.http.post<any[]>(`${this.baseUrl}/upload-multiple`, formData);
  // }

  generateUploadUrl(fileName: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/generate-upload-url`, {
      fileName: fileName,
    });
  }

  uploadMetadata(data: UploadMetadataDto): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/upload-metadata`, data);
  }

  addClassification(data: any) {
    return this.http.post(`${this.baseUrl}/add-classification`, data);
  }

  renameFolder(projectId: number, folderId: number, newName: string) {
    return this.http.post(`${this.baseUrl}/rename-folder`, {
      projectId: projectId,
      folderId: folderId,
      newName: newName
    });
  }

  createFolder(data: any) {
    return this.http.post(`${this.baseUrl}/create-folder`, data);
  }

  deleteFile(fileId: number) {
    return this.http.delete(`${this.baseUrl}/file/${fileId}`);
  }

  deleteFolder(folderId: number) {
    return this.http.delete(`${this.baseUrl}/folder/${folderId}`);
  }

  getSubFolders() {
    return this.http.get<any[]>(`${this.baseUrl}/get-subfolders`);
  }

  addSubFolder(payload: { folderName: string; createdBy: string }): Observable<SubFolder> {
    return this.http.post<SubFolder>(`${this.baseUrl}/add-subfolder`, payload);
  }

  deleteSubFolder(subFolderId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete-subfolder/${subFolderId}`);
  }

  getOthersFiles() {
    return this.http.get<any[]>(`${this.baseUrl}/others`);
  }

  updateFolderPermission(data: any) {
    return this.http.post(`${this.baseUrl}/update-folder-permission`, data);
  }

  updateFilePermission(data: any) {
    return this.http.post(`${this.baseUrl}/update-file-permission`, data);
  }
}
