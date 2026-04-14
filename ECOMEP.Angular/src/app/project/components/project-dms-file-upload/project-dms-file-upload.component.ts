import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom, Observable, forkJoin } from 'rxjs';
import { BlobUploadInfo } from 'src/app/mcv-file/models/mcv-blob-upload-info.model';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ProjectAttachment } from '../../models/project.model';
import { ProjectAttachmentApiService } from '../../services/project-attachment-api.service';
import { McvFileUploadComponent, UploadResult } from 'src/app/mcv-file/components/mcv-file-upload/mcv-file-upload.component';
import { McvFileComponent } from 'src/app/mcv-file/components/mcv-file/mcv-file.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-project-dms-file-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatTooltipModule,
    McvFileUploadComponent,
    McvFileComponent,
  ],
  templateUrl: './project-dms-file-upload.component.html',
  styleUrls: ['./project-dms-file-upload.component.scss']
})
export class ProjectDmsFileUploadComponent {

  projectID!: number;
  parent!: ProjectAttachment;
  blobConfig!: {
    container: string,
    folderPath: string
  };
  constructor(
    @Inject(MAT_DIALOG_DATA) data: { projectID: number, parent: ProjectAttachment, blobConfig: {
      container: string,
      folderPath: string
    } },
    private dialogRef: MatDialogRef<ProjectDmsFileUploadComponent>,
    private utilityService: UtilityService,
    private projectAttachmentService: ProjectAttachmentApiService
  ) {
    if (data) {
      this.blobConfig = data.blobConfig;
      this.projectID = data.projectID;
      this.parent = data.parent;

    }
  }

  onClose() {
    this.dialogRef.close();
  }



  async onUpload(uploads: UploadResult[]) {
    let _createRequests: Observable<ProjectAttachment>[] = [];
    //Creating a dummy object
    uploads.forEach(x => {
      let obj = new ProjectAttachment();
      obj.filename = x.filename;
      obj.size = x.size;
      obj.contentType = x.contentType;
      obj.guidname = x.blobPath;
      obj.blobPath = x.blobPath;
      obj.projectID = this.projectID;
      obj.container = this.blobConfig.container;
      obj.typeFlag = 0;
      obj.url = x.url;
      obj.parentID = this.parent?.id;
      obj.folderPath = this.parent?.folderPath + "/" + this.parent?.filename;
      _createRequests.push(this.projectAttachmentService.create(obj));
    });
    if (_createRequests.length != 0) {

      const results = await firstValueFrom(forkJoin(_createRequests));
      this.dialogRef.close(results);
    }
  }

}
