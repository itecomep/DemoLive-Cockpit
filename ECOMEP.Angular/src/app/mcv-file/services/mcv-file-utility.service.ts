import { HttpClient } from '@angular/common/http';
import { ComponentType } from '@angular/cdk/portal';
import { Injectable, signal, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { Observable } from 'rxjs';
import { McvFile } from '../models/mcv-file';
import { Download, download } from '../mcv-download';
import { saveAs } from 'file-saver';

import { McvImageEditorComponent } from '../components/mcv-image-editor/mcv-image-editor.component';
import { McvLightBoxComponent } from '../components/mcv-light-box/mcv-light-box.component';

@Injectable({
  providedIn: 'root'
})
export class McvFileUtilityService
{

  constructor(
    private dialog: MatDialog,
    private http: HttpClient,
  ) { }

  private _attachment?: any;
  get copiedAttachment() { return this._attachment }
  set copiedAttachment(val: any) { this._attachment = val }

  getImageUrls(files: McvFile[]): string[]
  {
    return files.filter(x => this.isImage(x.filename)).map(x => x.url);
  }

  getFileExtension(filename: string): string
  {
    return filename ? filename.substring((filename.lastIndexOf('.') + 1)).toLowerCase() : '';

  }

  isImage(filename: string): boolean
  {
    if (filename)
    {
      const fileExtension = this.getFileExtension(filename);
      return fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png' || fileExtension === 'gif';
    }
    return false;
  }

  isVideo(filename: string): boolean
  {
    if (filename)
    {
      const fileExtension = this.getFileExtension(filename);
      return fileExtension === 'mp4' || fileExtension === 'flv' || fileExtension === 'mov' || fileExtension === 'avi' || fileExtension === 'wmv' || fileExtension === '3gp' || fileExtension === 'webm';
    }
    return false;
  }

  isAudio(filename: string): boolean
  {
    if (filename)
    {
      const fileExtension = this.getFileExtension(filename);
      return fileExtension === 'mp3';
    }
    return false;
  }

  isPdf(filename: string): boolean
  {
    if (filename)
    {
      const fileExtension = this.getFileExtension(filename);
      return fileExtension === 'pdf';
    }
    return false;
  }

  getMediaType(filename: string): string
  {

    if (this.isVideo(filename))
    {
      return 'video';
    } else if (this.isImage(filename))
    {
      return 'image';
    } else if (this.isAudio(filename))
    {
      return 'audio';
    } else if (this.isPdf(filename))
    {
      return 'pdf';
    } else
    {
      return 'other'
    }
    // return contentType? contentType.toLowerCase().substring(0,contentType.indexOf('/')) :'other';

  }

  openTagDialog(
    componentOrTemplateRef: ComponentType<unknown> | TemplateRef<unknown>,
    dialogData: any
  )
  {

    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.panelClass = 'mcv-fullscreen-dialog';
    dialogConfig.autoFocus = true;
    dialogConfig.data = dialogData;

    return this.dialog.open(componentOrTemplateRef, dialogConfig);

  }

  openImageEditorDialog(filename: string, url: string, showAnnotation?: boolean)
  {

    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.panelClass = 'mcv-fullscreen-dialog';
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      dialogTitle: `ImageEditor | ${filename}`,
      filename,
      url,
      showAnnotation
    };

    return this.dialog.open(McvImageEditorComponent, dialogConfig);

  }

  download(url: string, filename?: string): Observable<Download>
  {
    console.log(url, filename)
    return this.http.get(url, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob',
      headers: { 'No-Auth': 'true' }
    }).pipe(download(blob => saveAs(blob, filename)))
  }

  ImageDataToBlob(imageData: ImageData)
  {
    let w = imageData.width;
    let h = imageData.height;
    let canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    let ctx = canvas.getContext("2d");
    ctx?.putImageData(imageData, 0, 0);        // synchronous

    return new Promise((resolve) =>
    {
      canvas.toBlob(resolve); // implied image/png format
    });
  }

  urlToBlob(dataURL: any)
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

  blobToFile(theBlob: Blob, fileName: string): File
  {
    var b: any = theBlob;
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;

    //Cast to a File() type
    return <File>theBlob;
  }

  onPreview(filename: string, url: string, contentType?: string, singlePreview?: boolean, mediaType?: string, entityTitle?: string, mediaCaption?: string)
  {
    if (mediaType === 'image' || mediaType === 'video' || mediaType === 'audio')
    {
      if (singlePreview)
      {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass = 'mcv-fullscreen-dialog';
        
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
          title: entityTitle ? entityTitle : filename,
          urls: null,
          activeUrl: url,
          mediaType: mediaType,
          contentType: contentType,
          mediaCaption: mediaCaption
        };

        const ref = this.dialog.open(McvLightBoxComponent, dialogConfig);
      } else
      {
        // this.preview.emit({ filename: filename, url: url });
      }
    } else
    {
      window.open(url, '_blank');
    }
  }

   //Todo Create copy and paste file from DMS
    private copiedFiles = signal<any[]>([]);
  
    get copied() {
      return this.copiedFiles();
    }
  
    toggleCopy(file: any) {
      const currentFiles = this.copiedFiles();
  
      if (currentFiles.some((f:any) => f.id === file.id)) {
        this.copiedFiles.set(currentFiles.filter((f:any) => f.id !== file.id));
      } else {
        this.copiedFiles.set([...currentFiles, file]);
      }
    }
  
    clearCopied() {
      //Clears the files from signal we have used
      this.copiedFiles.set([]);
    }
}
