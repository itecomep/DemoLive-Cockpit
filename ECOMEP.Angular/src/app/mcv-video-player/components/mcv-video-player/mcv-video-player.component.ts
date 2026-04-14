import { Component, Input, OnInit } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';

@Component({
    selector: 'mcv-video-player',
    templateUrl: './mcv-video-player.component.html',
    styleUrls: ['./mcv-video-player.component.scss'],
    standalone: true,
    imports: [NgClass, NgIf]
})
export class McvVideoPlayerComponent implements OnInit {
  @Input() fit: 'cover' | 'contain' = 'contain';
  @Input() autoplay: boolean = false;
  @Input() showControls: boolean = false;
  @Input() url: any;
  @Input() contentType!: string;
  constructor() { }

  ngOnInit(): void {
  }
}
