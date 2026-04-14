import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AssetApiService } from '../../services/asset-api.service';
import { McvFileComponent } from 'src/app/mcv-file/components/mcv-file/mcv-file.component';

@Component({
  selector: 'app-asset-file',
  standalone: true,
  imports: [
     CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressBarModule
  ],
  templateUrl: './asset-file.component.html',
  styleUrls: ['./asset-file.component.scss']
})
export class AssetFileComponent  extends McvFileComponent{

  @Input() files: any[] = [];
  @Output() update = new EventEmitter();

  constructor(
    private assetApiService: AssetApiService,
  ) {
    super();
  }

  onPreview() {
    const _data = {
      title: this.entityTitle ? this.entityTitle : this.filename,
      urls: null,
      filename: this.filename,
      activeUrl: this.url,
      mediaType: this.mediaType,
      contentType: this.contentType,
      mediaCaption: this.mediaCaption
    };
    this.assetApiService.openAssetLightBox(this.files, _data);
  }

  onRemove(searchTag: string) {
    const index = this.tags.indexOf(searchTag);
    if (index >= 0) {
      this.tags.splice(index, 1);
      this.update.emit(this.tags);
    }
  }
}
