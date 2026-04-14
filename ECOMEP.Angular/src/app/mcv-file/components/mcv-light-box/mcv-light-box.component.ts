import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { config } from 'rxjs';
import { McvVideoPlayerComponent } from '../../../mcv-video-player/components/mcv-video-player/mcv-video-player.component';
import { NgIf, NgClass, NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'mcv-light-box',
    templateUrl: './mcv-light-box.component.html',
    styleUrls: ['./mcv-light-box.component.scss'],
    standalone: true,
    imports: [MatButtonModule, MatIconModule, MatDialogModule, NgIf, NgClass, NgFor, McvVideoPlayerComponent]
})
export class McvLightBoxComponent implements OnInit, OnDestroy
{
  @Input() contentType!: string;
  @Input() activeUrl?: string;
  @Input() urls: string[] = [];
  @Input() title!: string;
  @Input() mediaCaption!: string;
  @Input() mediaType = 'other';
  constructor(
    private dialog: MatDialogRef<McvLightBoxComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  )
  {
    if (data)
    {
      console.log('config', data);
      this.activeUrl = data.activeUrl;
      this.urls = data.urls;
      this.title = data.title;
      this.mediaType = data.mediaType;
      this.contentType = data.contentType;
      this.mediaCaption = data.mediaCaption
    }
  }

  ngOnInit(): void
  {
  }
  ngOnDestroy()
  {
    this.activeUrl = undefined;
  }

  onClose()
  {
    this.activeUrl = undefined;
    this.dialog.close('some value');
  }

}
