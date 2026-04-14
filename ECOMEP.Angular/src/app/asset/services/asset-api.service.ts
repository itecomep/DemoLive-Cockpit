import { Injectable } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { StatusMaster } from 'src/app/shared/models/status-master-dto';
import { McvBaseApiService } from 'src/app/shared/services/mcv-base-api.service';
import { AssetLightBoxDialogComponent } from '../components/asset-light-box-dialog/asset-light-box-dialog.component';
import { ApiFilter } from 'src/app/shared/models/api-filters';

@Injectable({
  providedIn: 'root'
})
export class AssetApiService extends McvBaseApiService{


  override apiRoute: string = this.config.apiAsset;

  constructor()
  {
    super();
  }

  private _assetStatusOptions: StatusMaster[] = [];
  get assetStatusOptions(): StatusMaster[] { return this._assetStatusOptions }
  set assetStatusOptions(value) { this._assetStatusOptions = value }
   override get isPermissionList(): boolean
  {
    return this.authService.isInAnyRole([this.permissions.ASSET_VIEW]);
  }

  override get isPermissionEdit(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.ASSET_EDIT
    ]);
  }

  override get isPermissionDelete(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.ASSET_DELETE
    ]);
  }

   get isPermissionMaintenanceView(): boolean
  {
    return this.authService.isInAnyRole([
      this.permissions.ASSET_MAINTENANCE_VIEW
    ]);
  }
  openAssetLightBox(attachmentArray: any, currentAttachment?: any)
  {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = '100vw';
    dialogConfig.maxHeight = '100vh';
    dialogConfig.height = '100%';
    dialogConfig.width = '100%';
    dialogConfig.data = {
      currentAttach: currentAttachment,
      attachArray: attachmentArray
    };
    return this.dialog.open(
      AssetLightBoxDialogComponent,
      dialogConfig
    );
  }

  getNextCode(typeFlag: number)
  {
    return this.http.get<any>(this.apiRoute + '/NextCode/' + typeFlag)
  }


  

  exportDetail(id:number)
  {

    let url = this.apiRoute + `/details/${id}`;
    window.open(url, '_blank');
  }

  exportExcel(category: string,  filters?: ApiFilter[], search?: string, sort?: string)
  {

    let url = this.apiRoute + `/excel/${category}`;
    if (filters && filters.length !== 0)
    {
      const filtersParam = encodeURIComponent(JSON.stringify({ filters: filters }));
      url += `?filters=${filtersParam}`;
    }

    if (search)
    {
      if (url.includes('?'))
      {
        url += `&search=${search}`;
      } else
      {
        url += `?search=${search}`;
      }
    }
    if (sort)
    {
      if (url.includes('?'))
      {
        url += `&sort=${sort}`;
      } else
      {
        url += `?sort=${sort}`;
      }
    }

    window.open(url, '_blank');
  }

  exportReport(reportName: string, size: string = 'a4', output: 'PDF' | 'EXCELOPENXML' = 'PDF', filters?: ApiFilter[], search?: string, sort?: string)
  {

    let url = this.apiRoute + `/report/${reportName}`;
    if (filters && filters.length !== 0)
    {
      const filtersParam = encodeURIComponent(JSON.stringify({ filters: filters }));
      url += `?filters=${filtersParam}`;
    }

    if (size)
    {
      if (url.includes('?'))
      {
        url += `&size=${size}`;
      } else
      {
        url += `?size=${size}`;
      }
    }

    if (search)
    {
      if (url.includes('?'))
      {
        url += `&search=${search}`;
      } else
      {
        url += `?search=${search}`;
      }
    }
    if (sort)
    {
      if (url.includes('?'))
      {
        url += `&sort=${sort}`;
      } else
      {
        url += `?sort=${sort}`;
      }
    }
    if (output)
    {
      if (url.includes('?'))
      {
        url += `&output=${output}`;
      } else
      {
        url += `?output=${output}`;
      }
    }

    window.open(url, '_blank');
  }
}
