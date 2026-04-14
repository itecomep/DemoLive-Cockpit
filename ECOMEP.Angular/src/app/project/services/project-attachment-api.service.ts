import { Injectable, signal } from "@angular/core";
import { McvBaseApiService } from "src/app/shared/services/mcv-base-api.service";
import { ProjectAttachment } from "../models/project.model";

@Injectable({
  providedIn: 'root'
})
export class ProjectAttachmentApiService extends McvBaseApiService
{
  get nameOfEntity() { return this.config.NAMEOF_ENTITY_PROJECT_ATTACHMENT; }
  override apiRoute = this.config.apiProjectAttachments;
  constructor()
  {
    super();
  }

  private copiedFiles = signal<ProjectAttachment[]>([]);

  get copied() {
    return this.copiedFiles();
  }

  toggleCopy(file: ProjectAttachment) {
    const currentFiles = this.copiedFiles();

    if (currentFiles.some((f) => f.id === file.id)) {
      this.copiedFiles.set(currentFiles.filter((f) => f.id !== file.id));
      this.utilityService.showSwalToast('', 'File Removed Successfully', 'success');
    } else {
      this.copiedFiles.set([...currentFiles, file]);
      this.utilityService.showSwalToast('', 'File Copied Successfully', 'success');
    }
  }

  clearCopied() {
    this.copiedFiles.set([]);
  }
}
