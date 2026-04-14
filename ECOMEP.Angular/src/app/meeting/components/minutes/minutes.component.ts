import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { Meeting } from '../../models/meeting.model';
import { Download } from 'src/app/mcv-file/mcv-download';
import { environment } from 'src/environments/environment';
import { MeetingAttendee } from '../../models/meeting-attendee.model';
import { MeetingApiService } from '../../services/meeting-api.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { McvFileUtilityService } from 'src/app/mcv-file/services/mcv-file-utility.service';
import { MeetingAgenda, MeetingAgendaAttachment } from '../../models/meeting-agenda.model';
import { MeetingAttachment } from '../../models/meeting-attachments.model';
import { MeetingAgendaApiService } from '../../services/meeting-agenda-api.service';
import { MeetingAttendeeApiService } from '../../services/meeting-attendee-api.service';
import { McvFileExtensionPipe } from '../../../mcv-file/pipes/mcv-file-extension.pipe';
import { McvFileSizePipe } from '../../../mcv-file/pipes/mcv-file-size.pipe';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, NgClass, NgFor, NgStyle, DecimalPipe, DatePipe } from '@angular/common';
import { AppConfig } from 'src/app/app.config';
import { McvFileComponent } from 'src/app/mcv-file/components/mcv-file/mcv-file.component';

@Component({
    selector: 'app-minutes',
    templateUrl: './minutes.component.html',
    styleUrls: ['./minutes.component.scss'],
    standalone: true,
    imports: [NgIf, MatButtonModule,McvFileComponent, MatTooltipModule, MatIconModule, NgClass, NgFor, MatProgressBarModule, MatMenuModule, NgStyle, DecimalPipe, DatePipe, McvFileSizePipe, McvFileExtensionPipe]
})
export class MinutesComponent 
{
  private readonly meetingAgendaApiService = inject(MeetingAgendaApiService);
  private readonly meetingApiService = inject(MeetingApiService);
  private readonly utilityService = inject(UtilityService);
  private readonly mcvFileUtilityService = inject(McvFileUtilityService);
  private readonly meetingAttendeeApiService = inject(MeetingAttendeeApiService);
  private readonly config = inject(AppConfig);
  currentEntity!: Meeting;
  selectedAttendee?: MeetingAttendee;
  selectedProgressBar?: MeetingAgenda;
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
  get MEETING_TYPEFLAG_MEETING() { return this.meetingApiService.MEETING_TYPEFLAG_MEETING; }
  get MEETING_TYPEFLAG_INSPECTION() { return this.meetingApiService.MEETING_TYPEFLAG_INSPECTION; }
  get MEETING_TYPEFLAG_CNOTE() { return this.meetingApiService.MEETING_TYPEFLAG_CNOTE; }
  get MEETING_ATTENDEE_TYPEFLAG_TO() { return this.meetingAttendeeApiService.MEETING_ATTENDEE_TYPEFLAG_TO; }
  get MEETING_ATTENDEE_TYPEFLAG_CC() { return this.meetingAttendeeApiService.MEETING_ATTENDEE_TYPEFLAG_CC; }
  public readonly MEETING_ATTENDEE_INTERNAL = this.config.MEETING_ATTENDEE_INTERNAL;
  public readonly MEETING_ATTENDEE_EXTERNAL = this.config.MEETING_ATTENDEE_EXTERNAL;
  public readonly MEETING_ATTENDEE_CONTACT_PERSON = this.config.MEETING_ATTENDEE_CONTACT_PERSON;

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
      this.getMeetingVersion(value);
    }
  }

  @Output() deleteClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() afterUpdate: EventEmitter<any> = new EventEmitter<any>();

  onClickDownloadPDF()
  {
    this.meetingApiService.downloadMinutes(this.uid);
  }
  onClickShare()
  {
    // this.utilityService.copyText(location.href);
    this.utilityService.shareURL(window.location.href);
  }
  async getMeetingVersion(id: string)
  {
    this.currentEntity = await firstValueFrom(this.meetingApiService.getByPublicUid(id));
    this.currentEntity.agendas = this.meetingAgendaApiService.getSortAgendas(this.currentEntity.agendas, this.sortKey);
    this.updateSeoMetaData();
  }

  get reportType()
  {
    if (this.currentEntity.typeFlag == this.MEETING_TYPEFLAG_CNOTE)
    {
      return `COMMUNICATION NOTE `;
    }
    else if (this.currentEntity.typeFlag == this.MEETING_TYPEFLAG_INSPECTION)
    {
      return `INSPECTION REPORT `;
    }
    return `MINUTES OF MEETING `;
  }

  get meetingTitle()
  {
    if (this.currentEntity.typeFlag == this.MEETING_TYPEFLAG_CNOTE)
    {
      return `${this.currentEntity.code}`;
    }
    else if (this.currentEntity.typeFlag == this.MEETING_TYPEFLAG_INSPECTION)
    {
      return `${this.currentEntity.code}`;
    }
    return `${this.currentEntity.code}`;
  }

  get MEETING_AGENDA_STATUSFLAG_PENDING() { return this.meetingAgendaApiService.MEETING_AGENDA_STATUSFLAG_PENDING; }
  get MEETING_AGENDA_STATUSFLAG_RESOLVED() { return this.meetingAgendaApiService.MEETING_AGENDA_STATUSFLAG_RESOLVED; }

  getStatusBadgeColor(statusFlag: number): string {
    return statusFlag === this.MEETING_AGENDA_STATUSFLAG_PENDING ? 'badge-warning' : 'badge-success';
  }

  getPendingAgendaCount(attendee: MeetingAttendee)
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

  getFilteredAgendas(typeFlag: number)
  {
    return this.currentEntity.agendas.filter(x => (x.typeFlag || 0) === typeFlag);
  }

  getMeetingAttachments(typeFlag: number)
  {
    return this.currentEntity.attachments?.filter(x => (x.typeFlag || 0) === typeFlag) || [];
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

  onAttendeeSelect(item: MeetingAttendee)
  {
    if (item)
    {
      this.selectedAttendee = item;
    }
  }

  onProgressBarSelected(item: MeetingAgenda)
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
    //   title: this.meetingTitle,
    //   metaTags: [
    //     { name: 'author', content: `${this.meeting.contact.name} | Newarch®` },
    //     { name: 'description', content: `Date: ${this.datePipe.transform(this.meeting.startDate, 'dd MMM y')}. PreparedBy: ${this.meeting.contact.name}` },
    //     { name: 'robots', content: "follow,index" },
    //     { property: 'og:title', content: this.meetingTitle },
    //     { property: 'og:description', content: `Date: ${this.datePipe.transform(this.meeting.startDate, 'dd MMM y')}. PreparedBy: ${this.meeting.contact.name}` },
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

  onPreviewClick(file: MeetingAgendaAttachment)
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
  onDownload(item: MeetingAgendaAttachment | MeetingAttachment)
  {
    if(!item.url) return;
    this.download$ = this.mcvFileUtilityService.download(item.url, item.filename);
    this.download$.subscribe(val =>
    {
      console.log(val);
    })
    // this.download.emit();
  }

  onPreviewAgenda(agendaTitle: string, file: MeetingAgendaAttachment, files: MeetingAgendaAttachment[], index: number = 0, comment?: string)
  {
    this.meetingApiService.onPreviewMinutesFiles(agendaTitle, file, files, index, comment);
  }

  onPreviewMeeting(title: string, file: MeetingAttachment, files: MeetingAttachment[], index: number = 0)
  {
    this.meetingApiService.onPreviewMeetingFiles(title, file, files, index);
  }

  getVideoThumbUrl(url: string)
  {
    return url.replace('.mp4', '.jpg');
  }


}
