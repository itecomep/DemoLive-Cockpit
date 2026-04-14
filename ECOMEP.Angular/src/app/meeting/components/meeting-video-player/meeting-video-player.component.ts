import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';

@Component({
    selector: 'app-meeting-video-player',
    templateUrl: './meeting-video-player.component.html',
    styleUrls: ['./meeting-video-player.component.scss'],
    standalone: true,
    imports: [NgClass, NgIf]
})
export class MeetingVideoPlayerComponent 
{

  @ViewChild('resetVideo') videoPlayer: any;
  url: string = '';

  @Input('url') set urlValue(value: string)
  {
    if (value)
    {
      this.url = value;
      if (this.videoPlayer)
      {
        this.videoPlayer.nativeElement.load();
      }
    }
  }
  @Input() fit: 'cover' | 'contain' = 'contain';
  @Input() autoplay: boolean = false;
  @Input() showControls: boolean = false;
  @Input() contentType?: string;

}
