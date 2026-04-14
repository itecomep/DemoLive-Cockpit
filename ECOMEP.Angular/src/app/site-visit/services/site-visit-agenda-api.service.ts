import { Injectable } from "@angular/core";
import { McvBaseApiService } from "src/app/shared/services/mcv-base-api.service";
import { SitevisitAgenda } from "../models/site-visit-agenda.model";


@Injectable({
  providedIn: 'root'
})
export class SiteVisitAgendaApiService extends McvBaseApiService
{

  override apiRoute = this.config.apiSitevisitAgenda;
  get nameOfEntity() { return this.config.NAMEOF_ENTITY_SITE_VISIT_AGENDA; }
  get SITE_VISIT_AGENDA_STATUSFLAG_PENDING() { return this.config.SITE_VISIT_AGENDA_STATUSFLAG_PENDING; }
  get SITE_VISIT_AGENDA_STATUSFLAG_RESOLVED() { return this.config.SITE_VISIT_AGENDA_STATUSFLAG_RESOLVED; }
  constructor()
  {
    super();
  }

  getSortAgendas(agendas: SitevisitAgenda[], sortKey: string): SitevisitAgenda[]
  {

    if (sortKey == 'Due Date')
    {
      let pending = agendas.filter(x => x.dueDate !== undefined && x.dueDate !== null)
        .sort((a, b) =>
        {
          const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
          const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
          return dateA - dateB;
        });

      let completed = agendas.filter(x => x.dueDate == null).sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime());
      return pending.concat(completed);
    } else if (sortKey == 'Modified Date')
    {
      return agendas.sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime());

    }
    else if (sortKey == 'Agenda')
    {
      return agendas.sort((a, b) => ((a.title + a.subtitle) > (b.title + b.subtitle)) ? 1 : (((b.title + b.subtitle) > (a.title + b.subtitle)) ? -1 : 0));

    }
    else if (sortKey == 'Action By')
    {
      return agendas.filter(x => x.actionBy != undefined)
        .sort((a, b) =>
        {
          const actionByA = a.actionBy || ''; // Use an empty string if actionBy is undefined
          const actionByB = b.actionBy || ''; // Use an empty string if actionBy is undefined
          return actionByA.localeCompare(actionByB);
        });

    }
    else
    {
      return agendas.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime());
    }
  }
}
