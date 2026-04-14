import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { BlobClient } from '@azure/storage-blob';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';

import * as cropro from 'cropro';
import { BlobUploadInfo } from '../../models/mcv-blob-upload-info.model';

import { McvFileUtilityService } from '../../services/mcv-file-utility.service';
import { AzureBlobStorageService } from '../../services/azure-blob-storage.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-mcv-image-editor',
    templateUrl: './mcv-image-editor.component.html',
    styleUrls: ['./mcv-image-editor.component.scss'],
    standalone: true,
    imports: [NgIf, MatButtonModule, MatTooltipModule, MatIconModule, MatDialogModule]
})
export class McvImageEditorComponent implements OnInit
{

  @ViewChild('sampleImage', { static: true }) sampleImageRef!: ElementRef;

  private cropperImage: any;
  private annotationUrl: any;

  showCrop: boolean = true;
  showAnnotation: boolean = true;
  isCrop: boolean = false;
  isAnnotation: boolean = false;

  editedImageDataURL: string | null = null;
  editedImage: any;
  data: any;
  // toolbar = ['Crop',
  //   'CustomSelection',
  //   'CircleSelection',
  //   'SquareSelection',
  //   'Reset',
  //   'Annotate',
  //   'Line',
  //   'Rectangle',
  //   'Ellipse',
  //   'Pen',
  //   'Text',
  //   'Transform',
  //   'RotateLeft',
  //   'RotateRight',
  //   'Open'];

  constructor(
    @Inject(MAT_DIALOG_DATA) dialogData: any,
    private dialogRef: MatDialogRef<McvImageEditorComponent>,
    private mcvFileUtilityService: McvFileUtilityService,
    private azureBlobStorageService: AzureBlobStorageService,
    private utilityService: UtilityService,
  )
  {
    // console.log(this.data);
    this.data = dialogData;
    this.showAnnotation = this.data.showAnnotation;
    // const blobClient = new BlobClient(this.data.url);
    // console.log('Account', blobClient.accountName);
    // console.log('Continer', blobClient.containerName);
    // console.log('Name', blobClient.name);
    // console.log('Folder', blobClient.name.substring(0, blobClient.name.indexOf(this.data.filename) - 1));
    // console.log('filename', this.data.filename);
  }

  ngOnInit(): void
  {
  }

  onClose(result: any)
  {
    this.dialogRef.close(result);
  }

  onEdit(editType: string)
  {
    if (editType == 'crop')
    {
      this.isCrop = true;
      this.showCropMarkArea(this.sampleImageRef.nativeElement as HTMLImageElement);
    }
    else if (editType == 'annotate')
    {
      this.isAnnotation = true;
      this.showEditMarkerArea(this.sampleImageRef.nativeElement as HTMLImageElement);
    }
  }

  showEditMarkerArea(target: HTMLImageElement)
  {
    // const markerArea = new markerjs2.MarkerArea(target);
    // markerArea.settings.displayMode = 'popup';
    // markerArea.renderAtNaturalSize = true;
    // markerArea.renderImageQuality = 1;
    // markerArea.uiStyleSettings.zoomButtonVisible = true;
    // markerArea.uiStyleSettings.zoomOutButtonVisible = true;
    // markerArea.addEventListener('render', (event) => {
    //   // console.log(event);
    //   target.src = event.dataUrl;
    //   this.annotationUrl = target.src;
    // });
    // markerArea.show();
  }

  showCropMarkArea(target: HTMLImageElement)
  {
    this.isCrop = true;
    const cropArea = new cropro.CropArea(this.sampleImageRef.nativeElement as HTMLImageElement);
    cropArea.displayMode = 'popup';
    cropArea.addRenderEventListener((imgUrl) =>
    {
      console.log(imgUrl);
      target.src = imgUrl;
      this.cropperImage = imgUrl;
    });
    cropArea.show();
  }

  onClickSave()
  {

    var editedImage: any;
    if (this.isCrop)
    {
      this.isAnnotation = false;
      editedImage = this.cropperImage;
    } else if (this.isAnnotation)
    {
      this.isCrop = false;
      editedImage = this.annotationUrl;
    }

    if (editedImage)
    {
      const message = 'Do you want to apply changes?';
      this.utilityService.showConfirmationDialog(message, () =>
      {
        // console.log(croppedImage);
        const newBlob: Blob = this.dataToBlob(editedImage);
        // console.log(newBlob);

        if (newBlob)
        {
          const blobClient = new BlobClient(this.data.url);
          const folder = blobClient.name.substring(0, blobClient.name.indexOf(this.data.filename) - 1);
          const file = this.mcvFileUtilityService.blobToFile(newBlob, this.data.filename);
          // console.log('file', file);

          this.azureBlobStorageService.getSAS(blobClient.containerName).subscribe(res =>
          {
            const _uploader = new BlobUploadInfo(file, res.account, res.sasToken, blobClient.containerName, folder, true);
            // console.log('uploadInfo', _uploader);
            _uploader.upload().then((res) =>
            {
              this.onClose(_uploader.url);
            });
          });
        };
      })
    }
  }

  dataToBlob(dataURL: any)
  {
    //We are using atob which decodes a string of data which has been encoded using Base64 encoding.
    const byteString = atob(dataURL.split(',')[1]);
    // mimeString variable stores the MIME type extracted from the Data URL. (image/png)
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    //ArrayBuffer is created with a length equal to the length of the byteString.
    const arrayBuffer = new ArrayBuffer(byteString.length);
    //Uint8Array is created from the ArrayBuffer.
    const uint8Array = new Uint8Array(arrayBuffer);
    //The byteString is iterated over, and the character codes are stored in the Uint8Array
    for (let i = 0; i < byteString.length; i++)
    {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    const test = new Blob([arrayBuffer], { type: mimeString });
    return new Blob([arrayBuffer], { type: mimeString });
  }

}
