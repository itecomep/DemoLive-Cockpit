import { Injectable } from '@angular/core';
import { McvBaseApiService } from 'src/app/shared/services/mcv-base-api.service';
import { ContactTeam } from '../models/contact-team.model';

@Injectable({
  providedIn: 'root'
})
export class ContactTeamApiService extends McvBaseApiService {

  protected override apiRoute: string = this.config.apiContactTeam;

  constructor() {
    super();
  }

  private _selectedTeam!: ContactTeam;
  get selectedTeam() { return this._selectedTeam }
  set selectedTeam(val: ContactTeam) { this._selectedTeam = val }

  get isPermission()
  {
    return this.authService.isInAnyRole([
      this.permissions.TEAM_MANAGEMENT
    ]);
  }

  get isPermissionTeamDocumentsSettings()
  {
    return this.authService.isInAnyRole([
      this.permissions.TEAM_DOCUMENTS_SETTINGS
    ]);
  }
}
