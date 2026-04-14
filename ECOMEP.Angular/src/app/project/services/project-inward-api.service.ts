import { Injectable } from "@angular/core";
import { McvBaseApiService } from "src/app/shared/services/mcv-base-api.service";
import { ProjectInwardDialogComponent } from "../components/project-inward-dialog/project-inward-dialog.component";
import { ApiFilter } from "src/app/shared/models/api-filters";

@Injectable({
  providedIn: 'root'
})
export class ProjectInwardApiService extends McvBaseApiService
{
  override apiRoute = this.config.apiProjectInwards;

  get PROJECT_INWARDS_TYPE_FLAG_INWARDS() { return this.config.PROJECT_INWARDS_TYPE_FLAG_INWARDS; }
  get PROJECT_INWARDS_TYPE_FLAG_PHOTOS() { return this.config.PROJECT_INWARDS_TYPE_FLAG_PHOTOS; }
  get PROJECT_INWARDS_TYPE_FLAG_REPORTS() { return this.config.PROJECT_INWARDS_TYPE_FLAG_REPORTS; }
  constructor()
  {
    super();
  }


  exportReport(
    uid: string,
    reportName: string,
    size: string = 'a4',
    reportType: 'PDF' | 'EXCELOPENXML' = 'PDF',
    filters?: ApiFilter[]
  )
  {

    let url = this.apiRoute + `/report/${reportName}/${size}/${uid}`;
    if (filters && filters.length !== 0)
    {
      const filtersParam = encodeURIComponent(JSON.stringify({ filters: filters }));
      url += `?filters=${filtersParam}`;
    }


    if (reportType)
    {
      if (url.includes('?'))
      {
        url += `&reportType=${reportType}`;
      } else
      {
        url += `?reportType=${reportType}`;
      }
    }

    window.open(url, '_blank');
  }
}
