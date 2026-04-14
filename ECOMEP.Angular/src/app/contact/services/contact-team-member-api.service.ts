import { Injectable } from '@angular/core';
import { McvBaseApiService } from 'src/app/shared/services/mcv-base-api.service';
import { ContactTeam } from '../models/contact-team.model';

@Injectable({
  providedIn: 'root'
})
export class ContactTeamMemberApiService extends McvBaseApiService {

  protected override apiRoute: string = this.config.apiContactTeamMember;

  constructor() {
    super();
  }

}
