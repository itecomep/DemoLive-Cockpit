import { Injectable, inject } from "@angular/core";
import { McvBaseApiService } from "src/app/shared/services/mcv-base-api.service";
import { SitevisitAgendaAttachment } from "../models/site-visit-agenda.model";
import { McvFileUtilityService } from "src/app/mcv-file/services/mcv-file-utility.service";

@Injectable({
  providedIn: 'root'
})
export class SiteVisitAgendaAttachmentApiService extends McvBaseApiService
{
  override apiRoute = this.config.apiSitevisitAgendaAttachment;
  private readonly mcvFileUtilityService = inject(McvFileUtilityService);
  getFilteredAttachments(attachments: SitevisitAgendaAttachment[], typeFlag: number, isMedia: boolean)
  {
    // console.log('filtered', attachments, typeFlag, isMedia, attachments.filter(x => x.typeFlag == typeFlag));
    return isMedia ?
      attachments.filter(x => x.typeFlag == typeFlag
        && (this.mcvFileUtilityService.isImage(x.filename) || this.mcvFileUtilityService.isVideo(x.filename) || this.mcvFileUtilityService.isAudio(x.filename))
      ) :
      attachments.filter(x => x.typeFlag == typeFlag
        && !(this.mcvFileUtilityService.isImage(x.filename) || this.mcvFileUtilityService.isVideo(x.filename) || this.mcvFileUtilityService.isAudio(x.filename))
      );
  }
}
