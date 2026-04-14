import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Download } from '../../mcv-download';
import { AppInjector } from 'src/app/app-injector';
import { McvFileUtilityService } from '../../services/mcv-file-utility.service';
import * as cropro from 'cropro';
import { AzureBlobStorageService } from '../../services/azure-blob-storage.service';
import { BlobClient } from '@azure/storage-blob';
import { BlobUploadInfo } from '../../models/mcv-blob-upload-info.model';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { McvFileExtensionPipe } from '../../pipes/mcv-file-extension.pipe';
import { McvFileSizePipe } from '../../pipes/mcv-file-size.pipe';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { NgClass, NgIf, AsyncPipe } from '@angular/common';
@Component({
    selector: 'mcv-file',
    templateUrl: './mcv-file.component.html',
    styleUrls: ['./mcv-file.component.scss'],
    standalone: true,
    imports: [NgClass, NgIf, MatIconModule, MatTooltipModule, MatButtonModule, MatMenuModule, MatProgressBarModule, AsyncPipe, McvFileSizePipe, McvFileExtensionPipe]
})
export class McvFileComponent
{

  @ViewChild('previewImage') previewImage!: ElementRef;
  @Input() file!:any;
  @Input() thumbUrl?: string;
  @Input() url?: string;
  @Input() downloadUrl?: string;
  @Input() originalUrl?: string;
  filename!: string;
  @Input('filename') set filenameValue(filename: string)
  {
    this.filename = filename;
    this.mediaType = this.mcvFileUtilityService.getMediaType(this.filename);
  }
  @Input() showCopy:boolean = false;
  @Input() size: number = 0;
  @Input() showRemove: boolean = false;
  @Input() progress: number = 0;
  @Input() showPreview: boolean = false;
  @Input() hideDetails: boolean = false;
  @Input() singlePreview: boolean = false;
  @Input() contentType?: string;
  @Input() mediaCaption!: string;
  @Input() isVerticalThumb: boolean = false;
  @Input() entityTitle!: string;
  @Input() tags: string[] = [];
  @Input() allowTagging: boolean = false;
  @Input() showEditor: boolean = false;
  @Input() isUploading: boolean = false;
  // @Input() showDetails: boolean;

  mediaType: string = 'other';

  get tagList(): string[]
  {
    return this.tags ? this.tags : [];
  }

  // @Output() download = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() preview = new EventEmitter<any>();
  @Output() addTag = new EventEmitter<any>();
  @Output() edited = new EventEmitter<any>();

  download$!: Observable<Download>

  protected mcvFileUtilityService: McvFileUtilityService;
  protected http: HttpClient;
  protected utilityService: UtilityService;
  protected azureBlobStorageService: AzureBlobStorageService;
  constructor()
  {
    const injector = AppInjector.getInjector();
    this.mcvFileUtilityService = injector.get(McvFileUtilityService);
    this.http = injector.get(HttpClient);
    this.utilityService = injector.get(UtilityService);
    this.azureBlobStorageService = injector.get(AzureBlobStorageService);
  }


  onDownload()
  {
    if(this.url)
    this.download$ = this.mcvFileUtilityService.download(this.downloadUrl || this.url, this.filename);
    // this.download.emit();
  }

  onDownloadOriginal()
  {
    if(this.originalUrl)
    this.download$ = this.mcvFileUtilityService.download(this.originalUrl, this.filename);
    // this.download.emit();
  }

  onDelete()
  {
    this.delete.emit(this.url);
  }

  onPreviewClick()
  {
    if(this.url)
    this.mcvFileUtilityService.onPreview(this.filename, this.url, this.contentType, this.singlePreview, this.mediaType, this.entityTitle, this.mediaCaption);
  }

  get extension()
  {
    return this.mcvFileUtilityService.getFileExtension(this.filename);
  }

  getVideoThumbUrl(url: string)
  {
    return url.replace('.mp4', '.jpg');
  }

  onEdit()
  { if(!this.url) return;
    // console.log('url', this.url);
    // console.log('thumburl', this.thumbUrl);
    const dialogRef = this.mcvFileUtilityService.openImageEditorDialog(this.filename, this.url, true);
    dialogRef.afterClosed().subscribe(res =>
    {
      console.log('onClose', res);
      if (res)
      {
        this.url = res;
        this.thumbUrl = res;
        this.edited.emit(res);
      }
    });
  }

  //Copy any document
  onCopy(){
    this.mcvFileUtilityService.copiedAttachment = this.file;
    this.utilityService.showSwalToast('Copied Successfully!!','Image copied','success');
  }


  //Crop Area
  onCrop()
  {
    const target = this.previewImage.nativeElement as HTMLImageElement;
    const cropArea = new cropro.CropArea(target);
    cropArea.displayMode = 'popup';
    cropArea.addRenderEventListener((imgUrl) =>
    {
      // console.log(imgUrl);
      target.src = imgUrl;
      this.afterCrop(imgUrl);
    });
    cropArea.show();
  }

  private afterCrop(croppedUrl: string)
  {
   
    if (croppedUrl)
    {
      const message = 'Do you want to apply changes?';
      this.utilityService.showConfirmationDialog(message, () =>
      {
        // console.log(croppedImage);
        const newBlob: Blob = this.mcvFileUtilityService.urlToBlob(croppedUrl);
        // console.log(newBlob);

        if (newBlob && this.url)
        {
          const blobClient = new BlobClient(this.url);
          const folder = blobClient.name.substring(0, blobClient.name.indexOf(this.filename) - 1);
          const file = this.mcvFileUtilityService.blobToFile(newBlob, this.filename);
          // console.log('file', file);

          this.azureBlobStorageService.getSAS(blobClient.containerName).subscribe(res =>
          {
            const _uploader = new BlobUploadInfo(file, res.account, res.sasToken, blobClient.containerName, folder, true);
            // console.log('uploadInfo', _uploader);
            _uploader.upload().then((res) =>
            {
              this.url = _uploader.url;
              this.thumbUrl = _uploader.url;
            });
          });
        };
      })
    }
  }
}
