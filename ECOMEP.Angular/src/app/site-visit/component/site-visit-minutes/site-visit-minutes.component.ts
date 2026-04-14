import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';

import { SiteVisit } from '../../models/site-visit.model';
import { Download } from 'src/app/mcv-file/mcv-download';
import { environment } from 'src/environments/environment';


import { SiteVisitAttendee } from '../../models/site-visit-attendee.model';
import { SiteVisitApiService } from '../../services/site-visit-api.service';

import { UtilityService } from 'src/app/shared/services/utility.service';

import { SitevisitAgenda } from '../../models/site-visit-agenda.model';
import { SitevisitAgendaAttachment } from '../../models/site-visit-agenda.model';
import { SiteVisitAgendaApiService } from '../../services/site-visit-agenda-api.service';
import { SiteVisitAttendeeApiService } from '../../services/site-visit-attendee-api.service';

import { McvFileExtensionPipe } from '../../../mcv-file/pipes/mcv-file-extension.pipe';
import { McvFileUtilityService } from 'src/app/mcv-file/services/mcv-file-utility.service';

import { McvFileSizePipe } from '../../../mcv-file/pipes/mcv-file-size.pipe';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, NgClass, NgFor, NgStyle, DecimalPipe, DatePipe } from '@angular/common';

@Component({
    selector: 'app-site-visit-minutes',
    templateUrl: './site-visit-minutes.component.html',
    styleUrls: ['./site-visit-minutes.component.scss'],
    standalone: true,
    imports: [NgIf, MatButtonModule, MatTooltipModule, MatIconModule, NgClass, NgFor, MatProgressBarModule, MatMenuModule, NgStyle, DecimalPipe, DatePipe, McvFileSizePipe, McvFileExtensionPipe]
})
export class SitevisitMinutesComponent 
{
  private readonly sitevisitAgendaApiService = inject(SiteVisitAgendaApiService);
  private readonly sitevisitApiService = inject(SiteVisitApiService);
  private readonly utilityService = inject(UtilityService);
  private readonly mcvFileUtilityService = inject(McvFileUtilityService);
  private readonly sitevisitAttendeeApiService = inject(SiteVisitAttendeeApiService);
  currentEntity!: SiteVisit;
  selectedAttendee?: SiteVisitAttendee;
  selectedProgressBar?: SitevisitAgenda;
  isProgressBarSelected: boolean = false;
  uid!: string;
  allowEdit: boolean = false;
  allowDelete: boolean = false;
  allowSelection: boolean = false;
  allowPackageRequiredCheckbox: boolean = false;
  hideIndex: boolean = false;
  showDetail: boolean = true;
  hideAttachments: boolean = false;
  hideFileDetails: boolean = false;
  showHistory: boolean[] = [];

  get logoUrl() { return environment.logoUrl };
  get version() { return environment.appVersion; }
  get SITE_VISIT_TYPEFLAG_SITE_VISIT() { return this.sitevisitApiService.SITE_VISIT_TYPEFLAG_SITE_VISIT; }
  get SITE_VISIT_TYPEFLAG_INSPECTION() { return this.sitevisitApiService.SITE_VISIT_TYPEFLAG_INSPECTION; }
  get SITE_VISIT_TYPEFLAG_CNOTE() { return this.sitevisitApiService.SITE_VISIT_TYPEFLAG_CNOTE; }
  get SITE_VISIT_ATTENDEE_TYPEFLAG_TO() { return this.sitevisitAttendeeApiService.SITE_VISIT_ATTENDEE_TYPEFLAG_TO; }
  get SITE_VISIT_ATTENDEE_TYPEFLAG_CC() { return this.sitevisitAttendeeApiService.SITE_VISIT_ATTENDEE_TYPEFLAG_CC; }

  get isMobileView(): boolean
  {
    return this.utilityService.isMobileView;
  }

  @Input() hideTitleBar: boolean = false;
  @Input('uid') set configValue(value: string)
  {
    if (value)
    {
      this.uid = value;
      this.getSitevisitVersion(value);
    }
  }

  @Output() deleteClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() afterUpdate: EventEmitter<any> = new EventEmitter<any>();

  onClickDownloadPDF()
  {
    this.sitevisitApiService.downloadMinutes(this.uid);
  }
  onClickShare()
  {
    // this.utilityService.copyText(location.href);
    this.utilityService.shareURL(window.location.href);
  }
  async getSitevisitVersion(id: string)
  {
    this.currentEntity = await firstValueFrom(this.sitevisitApiService.getByPublicUid(id));
    this.currentEntity.agendas = this.sitevisitAgendaApiService.getSortAgendas(this.currentEntity.agendas, this.sortKey);
    this.updateSeoMetaData();
  }

  get reportType()
  {
    if (this.currentEntity.typeFlag == this.SITE_VISIT_TYPEFLAG_CNOTE)
    {
      return `COMMUNICATION NOTE `;
    }
    else if (this.currentEntity.typeFlag == this.SITE_VISIT_TYPEFLAG_INSPECTION)
    {
      return `INSPECTION REPORT `;
    }
    return `MINUTES OF SITEVISIT `;
  }

  get sitevisitTitle()
  {
    if (this.currentEntity.typeFlag == this.SITE_VISIT_TYPEFLAG_CNOTE)
    {
      return `${this.currentEntity.code}`;
    }
    else if (this.currentEntity.typeFlag == this.SITE_VISIT_TYPEFLAG_INSPECTION)
    {
      return `${this.currentEntity.code}`;
    }
    return `${this.currentEntity.code}`;
  }

  get SITE_VISIT_AGENDA_STATUSFLAG_PENDING() { return this.sitevisitAgendaApiService.SITE_VISIT_AGENDA_STATUSFLAG_PENDING; }

  getPendingAgendaCount(attendee: SiteVisitAttendee)
  {
    if (attendee && attendee.contactID)
    {
      const pendingAgendas = this.currentEntity.agendas.filter(x => x.actionByContactID === attendee.contactID && x.statusFlag === 0);
      return pendingAgendas.length;
    }
    return 0;
  }

  getFilteredAttendees(typeFlag: number)
  {
    return this.currentEntity.attendees.filter(x => x.typeFlag == typeFlag);
  }

  sortKey: string = 'Due Date';
  sortBy(key: string)
  {
    this.sortKey = key;
  }

  progressExpanded: boolean = false;
  toggleProgress()
  {
    this.progressExpanded = !this.progressExpanded;
  }

  onAttendeeSelect(item: SiteVisitAttendee)
  {
    if (item)
    {
      this.selectedAttendee = item;
    }
  }

  onProgressBarSelected(item: SitevisitAgenda)
  {
    if (item)
    {
      this.selectedProgressBar = item;
      this.isProgressBarSelected = true;
    }
  }

  resetAttendeeSelection()
  {
    this.selectedAttendee = undefined;
  }

  resetProgressBarSelection()
  {
    //Setting the value as null so we can get all the agendas again
    this.selectedProgressBar = undefined;
    this.isProgressBarSelected = false;
  }

  private updateSeoMetaData()
  {
    // const _seoData = {
    //   title: this.sitevisitTitle,
    //   metaTags: [
    //     { name: 'author', content: `${this.sitevisit.contact.name} | Newarch®` },
    //     { name: 'description', content: `Date: ${this.datePipe.transform(this.sitevisit.startDate, 'dd MMM y')}. PreparedBy: ${this.sitevisit.contact.name}` },
    //     { name: 'robots', content: "follow,index" },
    //     { property: 'og:title', content: this.sitevisitTitle },
    //     { property: 'og:description', content: `Date: ${this.datePipe.transform(this.sitevisit.startDate, 'dd MMM y')}. PreparedBy: ${this.sitevisit.contact.name}` },
    //     { property: 'og:image', content: environment.logoUrl },
    //     { property: 'og:url', content: this.router.url },
    //   ]
    // };
    // this.seoService.updateTitle(_seoData.title);
    // this.seoService.updateMetaTags(_seoData.metaTags);
    // console.log('Seo meta data updated');
  }

  toggleHistorySection(index: number)
  {
    this.showHistory[index] = !this.showHistory[index];
  }

  showDetails: boolean = false;

  getMediaType(filename: string)
  {
    if (filename)
    {
      return this.mcvFileUtilityService.getMediaType(filename);
    } else
    {
      return 'other';
    }
  }

  onPreviewClick(file: SitevisitAgendaAttachment)
  {
    if(!file.url) return;
    const mediaType = this.utilityService.getFileMediaType(file.filename);
    if (mediaType == 'image' || mediaType == 'video')
    {
      this.mcvFileUtilityService.onPreview(file.filename, file.url, file.contentType, true, mediaType);
    } else
    {
      this.onDownload(file);
    }
  }

  download$!: Observable<Download>
  onDownload(item: SitevisitAgendaAttachment)
  {
    if(!item.url) return;
    this.download$ = this.mcvFileUtilityService.download(item.url, item.filename);
    this.download$.subscribe(val =>
    {
      console.log(val);
    })
    // this.download.emit();
  }

  onPreview(agendaTitle: string, file: SitevisitAgendaAttachment, files: SitevisitAgendaAttachment[], index: number = 0, comment?: string,)
  {
    this.sitevisitApiService.onPreviewMinutesFiles(agendaTitle, file, files, index, comment);
  }

  getVideoThumbUrl(url: string)
  {
    return url.replace('.mp4', '.jpg');
  }


}
