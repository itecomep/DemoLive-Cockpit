import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { McvFileUtilityService } from 'src/app/mcv-file/services/mcv-file-utility.service';
import { AssetAttachment } from '../../models/asset';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AssetVideoPlayerComponent } from '../asset-video-player/asset-video-player.component';

@Component({
  selector: 'app-asset-light-box',
  standalone: true,
  imports: [  
    CommonModule,
    MatIconModule,
    MatButtonModule,
    AssetVideoPlayerComponent],
  templateUrl: './asset-light-box.component.html',
  styleUrls: ['./asset-light-box.component.scss']
})
export class AssetLightBoxComponent {
 private mcvFileUtilityservice = inject(McvFileUtilityService);
  
  thumbUrlArray: AssetAttachment[] = [];
  selectedIndex: number = 0;
  activeAttachment: any;

  @Input('thumbUrlArray') set imageArray(value: any) {
    if (value) {
      this.thumbUrlArray = value;
      this.thumbUrlArray = value.filter((x: any) => x.contentType !== 'application/pdf');
    }
  }

  @Input('activeAttachment') set activeImage(value: any) {
    if (value) {
      this.activeAttachment = value;
      const current = this.thumbUrlArray.find(x => x.url == value.activeUrl || x.thumbUrl == value.activeUrl);
      this.activeAttachment = current;
      // this.selectedIndex = this.thumbUrlArray.map(x => x.uid).indexOf(this.activeAttachment.uid);
    }
  }

  ngOnInit(): void {
  }

  get mediaType() {
    if (this.activeAttachment && this.activeAttachment.filename) {
      return this.mcvFileUtilityservice.getMediaType(this.activeAttachment.filename);
    }
    return 'other';
  }

  onClick(image: any) {
    this.activeAttachment = image;
    this.selectedIndex = this.thumbUrlArray.map(x => x.uid).indexOf(image.uid);
  }

  getVideoThumbUrl(url?: string) {
    if (url) {
      return url.replace('.mp4', '.jpg');
    } else {
      return '';
    }
  }

  onPreviousClick() {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
      this.activeAttachment = this.thumbUrlArray[this.selectedIndex];
    }
  }

  onNextClick() {
    if (this.selectedIndex < this.thumbUrlArray.length - 1) {
      this.selectedIndex++;
      this.activeAttachment = this.thumbUrlArray[this.selectedIndex];
    }
  }
}
