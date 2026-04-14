import { Injectable } from '@angular/core';
import { McvBaseApiService } from 'src/app/shared/services/mcv-base-api.service';

@Injectable({
  providedIn: 'root'
})
export class MeetingAttachmentApiService extends McvBaseApiService {

  override apiRoute = this.config.apiMeetingAttachment;
  constructor() {
    super();
  }
}
