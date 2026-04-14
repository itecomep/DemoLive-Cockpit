import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


import { UtilityService } from 'src/app/shared/services/utility.service';
import { McvFileUtilityService } from 'src/app/mcv-file/services/mcv-file-utility.service';
import { MeetingAgendaAttachment } from '../../models/meeting-agenda.model';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MeetingVideoPlayerComponent } from '../meeting-video-player/meeting-video-player.component';
import { NgClass, NgStyle, NgIf, NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-meeting-light-box',
    templateUrl: './meeting-light-box.component.html',
    styleUrls: ['./meeting-light-box.component.scss'],
    standalone: true,
    imports: [MatButtonModule, MatIconModule, NgClass, NgStyle, NgIf, MeetingVideoPlayerComponent, MatTooltipModule, NgFor]
})
export class MeetingLightBoxComponent implements OnInit
{

  data: any;
  selectedIndex: number = 0;
  activeAttachment!: MeetingAgendaAttachment;
  attachmentArray: MeetingAgendaAttachment[] = [];


  get isMobileView(): boolean
  {
    return this.utilityService.isMobileView;
  }

  get mediaType()
  {
    if (this.activeAttachment && this.activeAttachment.filename)
    {
      return this.mcvFileUtilityservice.getMediaType(this.activeAttachment.filename);
    }
    return 'other';
  }

  constructor(
    private dialog: MatDialogRef<MeetingLightBoxComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private mcvFileUtilityservice: McvFileUtilityService,
    private utilityService: UtilityService,
  )
  {
    this.data = data;
    if (this.data)
    {
      // console.log(this.data);
      this.activeAttachment = data.currentfile;
      this.attachmentArray = data.attachments;
      this.selectedIndex = data?.index;
    }
  }

  ngOnInit(): void
  {
  }

  onClick(image: MeetingAgendaAttachment)
  {
    this.activeAttachment = image;
    this.selectedIndex = this.attachmentArray.map(x => x.uid).indexOf(image.uid);
  }

  getVideoThumbUrl(url: string)
  {
    return url.replace('.mp4', '.jpg');
  }

  onPreviousClick()
  {
    if (this.selectedIndex > 0)
    {
      this.selectedIndex--;
      this.activeAttachment = this.attachmentArray[this.selectedIndex];
    }
  }

  onNextClick()
  {
    if (this.selectedIndex < this.attachmentArray.length - 1)
    {
      this.selectedIndex++;
      this.activeAttachment = this.attachmentArray[this.selectedIndex];
    }
  }

  onClose(e: null)
  {
    this.dialog.close(e);
  }

}
