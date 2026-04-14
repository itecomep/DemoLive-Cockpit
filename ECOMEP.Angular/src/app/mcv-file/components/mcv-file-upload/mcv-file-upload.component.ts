import { Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { BlobUploadInfo } from '../../models/mcv-blob-upload-info.model';
import { AzureBlobStorageService } from '../../services/azure-blob-storage.service';
import * as uuid from 'uuid';
import { McvFileUtilityService } from '../../services/mcv-file-utility.service';
import { AppInjector } from 'src/app/app-injector';
import { McvFileUploadConfig } from '../../models/mcv-file-upload-config.model';
import { AppConfig } from 'src/app/app.config';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { firstValueFrom } from 'rxjs';
import { McvFileComponent } from '../mcv-file/mcv-file.component';
import { McvFileDropDirective } from '../../directives/mcv-file-drop.directive';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, NgClass, NgFor } from '@angular/common';

@Component({
    selector: 'app-mcv-file-upload',
    templateUrl: './mcv-file-upload.component.html',
    styleUrls: ['./mcv-file-upload.component.scss'],
    standalone: true,
    imports: [NgIf, NgClass, MatButtonModule, MatTooltipModule, MatIconModule, McvFileDropDirective, NgFor, McvFileComponent]
})
export class McvFileUploadComponent
{

  uploadQueue: Array<BlobUploadInfo> = []
  @ViewChild('fileInput', { static: false })
  fileInput!: ElementRef<HTMLInputElement>;

  @Input()
  uploaderConfig!: McvFileUploadConfig;

  @Input()
  showLabels!: boolean;

  @Input()
  showPaste!: boolean;

  @Input()
  showDrop!: boolean;

  @Input()
  unSupportedMediaTypes!: string[];
  @Input() uploadMultiple: boolean = true;

  @Output() upload = new EventEmitter<UploadResult[]>()

  protected azureBlobStorageService: AzureBlobStorageService;
  protected sanitizer: DomSanitizer;
  protected mcvFileUtilityService: McvFileUtilityService;
  protected config: AppConfig;
  protected utilityService: UtilityService;
  constructor()
  {
    const injector = AppInjector.getInjector();
    this.azureBlobStorageService = injector.get(AzureBlobStorageService);
    this.sanitizer = injector.get(DomSanitizer);
    this.mcvFileUtilityService = injector.get(McvFileUtilityService);
    this.config = injector.get(AppConfig);
    this.utilityService = injector.get(UtilityService);
  }


  onClickUpload(): void
  {
    this.fileInput.nativeElement.click();
  }

  async onSelectionChange(event: any): Promise<void>
  {
    // if (event.target.files.length > this.config.INPUT_UPLOAD_FILE_LIMITER)
    // {
    //   this.utilityService.showSweetDialog(
    //     'File Limit Exceeded',
    //     `You can only upload ${this.config.INPUT_UPLOAD_FILE_LIMITER} files at a time.`,
    //     'error'
    //   );
    // } else
    {
      await this.uploadFiles(event.target.files);
    }
  }

  onDeleteFromQueue(item: BlobUploadInfo)
  {
    item.cancel();
    this.uploadQueue = this.uploadQueue.filter(x => x.file.name != item.file.name);
  }

  private async uploadFiles(files: File[])
  {
    this.uploadQueue = []
    const res = await firstValueFrom(this.azureBlobStorageService.getSAS(this.uploaderConfig.container));

    // console.log('sas', res);
    for (var i = 0; i < files.length; i++)
    {
      var file = files[i];

      if (this.unSupportedMediaTypes
        && this.unSupportedMediaTypes.length
        && !this.unSupportedMediaTypes.includes(this.mcvFileUtilityService.getMediaType(file.name)))
      {
        this.uploadQueue.push(new BlobUploadInfo(file, res.account, res.sasToken, this.uploaderConfig.container, this.uploaderConfig.folderPath));
      } else
      {
        this.uploadQueue.push(new BlobUploadInfo(file, res.account, res.sasToken, this.uploaderConfig.container, this.uploaderConfig.folderPath));
      }
    }
    this.fileInput.nativeElement.value === '';

    for (let x of this.uploadQueue)
    {
      await x.upload();
    }
    this.afterUpload();
    // let uploads: Promise<void>[] = [];
    // this.uploadQueue.forEach(x => uploads.push(x.upload()));
    // Promise.all(uploads).then(value =>
    // {
    //   this.afterUpload();
    // });
  }

  protected afterUpload()
  {
    // console.log('super upload', this.uploadQueue);
    this.upload.emit(this.uploadQueue.filter(x => x.url != undefined && x.url != '').map(x => new UploadResult(x.url, x.file.name, x.file.size, x.file.type, x.blobPath)));
    this.uploadQueue = [];
    this.imageUrl = undefined;
  }

  //-----------------Paste zone ------------------//
  imageUrl?: SafeUrl;
  private lastObjectUrl!: string;
  @Output() copied = new EventEmitter<any>()
  async onClickPaste() {
    if (this.mcvFileUtilityService.copiedAttachment) {
      this.uploadQueue = [];
      const file = this.mcvFileUtilityService.copiedAttachment;
      this.upload.emit([new UploadResult(file.url, file.filename, file.size, file.contentType, file.blobPath)]);
    } else if (this.mcvFileUtilityService.copied) {
      this.uploadQueue = [];
      const _files = this.mcvFileUtilityService.copied;
      _files.forEach(file => {
        this.upload.emit([
          new UploadResult(file.url, file.filename, file.size, file.contentType, file.blobPath)
        ]);
      });
      this.utilityService.showSwalToast('', 'Files copied successfully!!', 'success');
      this.mcvFileUtilityService.clearCopied();
    }
    else {
      this.pasteFromClipboard().then(value => console.log("pasted from clipboard"));
    }
  }

  async pasteFromClipboard()
  {

    try
    {
      const data = await navigator.clipboard.read();
      const clipboardContent = data[0];

      if (!clipboardContent)
      {
        console.log('clipboard empty');
        return;
      }

      const imageBlob = await clipboardContent.getType('image/png');
      if (!imageBlob)
      {
        console.log('not an image');
        return;
      }


      // When we create Object URLs, the browser will keep them in memory until the
      // document is unloaded or until the URL is explicitly released. Since we are
      // going to create a new URL every time the user pastes an image into the app (in
      // this particular demo), we need to be sure to release the previous Object URL
      // before we create the new one.
      // --
      // NOTE: One the Image is rendered in the DOM, releasing the Object URL will not
      // affect the rendering.
      if (this.lastObjectUrl) { window.URL.revokeObjectURL(this.lastObjectUrl); }

      // At this point, the "pastedImage" is a File object, which is a specialized type
      // of "Blob". We can now generate a "blob:" URL using the given File.
      this.lastObjectUrl = window.URL.createObjectURL(imageBlob);

      // By default, Angular WILL NOT TRUST this "blob:" style URLs. However, since we
      // know these are going to be expected, we can use the DOM Sanitizer to bypass
      // the security checks on these images.
      // --
      // NOTE: The sanitizer doesn't return Strings - it returns SafeUrls.
      this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(this.lastObjectUrl);

      await this.uploadFiles([this.mcvFileUtilityService.blobToFile(imageBlob, `${uuid.v4()}.png`)]);
    } catch (error)
    {
      console.log('clipboard error', error);
    }
  }

  //-----------------------------//

  //--------DROP ZONE------------//

  async onFilesDropped(files: FileList)
  {
    const fileArray: File[] = [];

    Array.from(files).forEach(file =>
    {
      fileArray.push(file);
    });

    await this.uploadFiles(fileArray);
  }

  async convertToFile(attachment:any): Promise<File> {
    const response = await fetch(attachment.url); 
    const blob = await response.blob();           

    // Create a new File from the Blob
    const file = new File([blob], attachment.filename, { type: attachment.contentType });
    console.log('File created:', file);

    return file;
  }

  //-----------------------------//

}

export class UploadResult {
  url!: string;
  filename!: string;
  size!: number;
  contentType!: string;
  blobPath!: string;

  constructor(url: string, filename: string, size: number, contentType: string, blobPath: string) {
    this.url = url;
    this.filename = filename;
    this.size = size;
    this.contentType = contentType;
    this.blobPath = blobPath;
  }
}