import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-asset-video-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './asset-video-player.component.html',
  styleUrls: ['./asset-video-player.component.scss']
})
export class AssetVideoPlayerComponent implements OnInit {
  @Input() fit: 'cover' | 'contain' = 'contain';
  @Input() autoplay: boolean = false;
  @Input() showControls: boolean = false;
  @Input() url: any;
  @Input() contentType!: string;
  constructor() { }

  ngOnInit(): void {
  }
}
