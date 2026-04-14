import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BlobServiceClient, BlobUploadCommonResponse, ContainerClient } from '@azure/storage-blob';
import { Observable } from 'rxjs';
import { AppConfig } from '../../app.config';

// import * as mime from 'mime-types';

@Injectable({
  providedIn: 'root'
})
export class AzureBlobStorageService
{
  private apiRoute = this.config.apiAzureBlobsUtility;



  constructor(
    private http: HttpClient,
    private config: AppConfig
  ) { }


  // getFileMime(filename: string)
  // {
  //   return mime.lookup(filename) ? mime.lookup(filename) : 'application/octet-stream';
  // }

  getSAS(container: string): Observable<any>
  {
    return this.http.get<any>(
      this.apiRoute + '/SAS',
      {
        params: {
          container: container
        }
      }
    );
  }
  copyFromUrl(
    account: string,
    sasToken: string,
    container: string,
    blobName: string,
    sourceUrl: string
  )
  {
    const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net${sasToken}`);
    const containerClient = blobServiceClient.getContainerClient(container);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    return blockBlobClient.syncCopyFromURL(sourceUrl).then((response) =>
    {
      console.log(response);
      return blockBlobClient.url.split('?')[0];
    }).catch((error) =>
    {
      console.log(error);
      return null;
    });
  }
  upload(container: string,
    content: Blob,
    blobName: string,
    onSuccess?: (response: any) => any,
    onError?: (response: any) => any,
    onProgress?: (response: any) => any
  )
  {
    this.getSAS(container).subscribe((res: any) =>
    {
      // console.log('sas', res);
      const blobServiceClient = new BlobServiceClient(`https://${res.account}.blob.core.windows.net${res.sasToken}`);
      const containerClient = blobServiceClient.getContainerClient(container);
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      blockBlobClient.uploadData(content,
        {
          blobHTTPHeaders: { blobContentType: content.type },
          onProgress: onProgress
        })
        .then((response) => { if (onSuccess) onSuccess(response) }, (response) => { if (onError) onError(response) });
    });
  }

  // list(sas: string, account: string, container: string): Promise<string[]>
  // {
  //   const containerClient = this.containerClient(sas, account, container);
  //   return this.listBlobs(containerClient)
  // }

  // download(sas: string, account: string, container: string, name: string, handler: (blob: Blob) => void)
  // {
  //   const containerClient = this.containerClient(sas, account, container);
  //   this.downloadBlob(name, containerClient, handler)
  // }

  // delete(sas: string, account: string, container: string, name: string, handler: () => void)
  // {
  //   const containerClient = this.containerClient(sas, account, container);
  //   this.deleteBlob(name, containerClient, handler)
  // }

  private uploadBlob(content: Blob, name: string, client: ContainerClient, handler: (response: BlobUploadCommonResponse) => void, progressHandler: (progress: any) => void)
  {
    let blockBlobClient = client.getBlockBlobClient(name);
    blockBlobClient.uploadData(content, { blobHTTPHeaders: { blobContentType: content.type }, onProgress: progressHandler })
      .then((response) => handler(response))
  }

  private async listBlobs(client: ContainerClient): Promise<string[]>
  {
    let result: string[] = []

    let blobs = client.listBlobsFlat();
    for await (const blob of blobs)
    {
      result.push(blob.name)
    }

    return result;
  }

  private downloadBlob(name: string, client: ContainerClient, handler: (blob: Blob) => void)
  {
    const blobClient = client.getBlobClient(name);
    blobClient.download().then(resp =>
    {
      if (resp?.blobBody)
        resp.blobBody.then(blob =>
        {
          handler(blob)
        })
    })
  }

  private deleteBlob(name: string, client: ContainerClient, handler: () => void)
  {
    client.deleteBlob(name).then(() =>
    {
      handler()
    })
  }

  private containerClient(sas: string, account: string, container: string): ContainerClient
  {
    const blobServiceClient = new BlobServiceClient(
      `https://${account}.blob.core.windows.net${sas}`
    );
    return blobServiceClient.getContainerClient(container);
  }

}
