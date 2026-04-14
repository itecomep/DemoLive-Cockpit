import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';

@Component({
    selector: 'app-site-visit-video-player',
    templateUrl: './site-visit-video-player.component.html',
    styleUrls: ['./site-visit-video-player.component.scss'],
    standalone: true,
    imports: [NgClass, NgIf]
})
export class SiteVisitVideoPlayerComponent 
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
