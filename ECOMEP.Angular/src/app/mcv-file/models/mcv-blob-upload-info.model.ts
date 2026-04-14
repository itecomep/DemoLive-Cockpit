import { BlobServiceClient } from "@azure/storage-blob";
import * as uuid from 'uuid';
import swal, { SweetAlertIcon } from 'sweetalert2';

export class BlobUploadInfo
{

    file: File;
    account: string;
    sasToken: string;
    container: string;
    folderPath: string;
    blobPath!: string;
    typeFlag!: number;
    private _progress = 0;

    get progress() { return this._progress; }

    url!: string;
    replaceExisting: boolean;

    private controller = new AbortController();

    constructor(file: File, account: string, sasToken: string, container: string, folderPath: string, replaceExisting: boolean = false)
    {
        this.file = file;
        this.account = account;
        this.sasToken = sasToken;
        this.container = container;
        this.folderPath = folderPath;
        this.replaceExisting = replaceExisting;
    }

    async upload()
    {
        try
        {
            const azureStorageRoot = `https://${this.account}.blob.core.windows.net`;
            const blobServiceClient = new BlobServiceClient(azureStorageRoot + `${this.sasToken}`);
            const containerClient = blobServiceClient.getContainerClient(this.container);
            this.blobPath = `${this.folderPath}/${this.file.name}`;
            if (!this.replaceExisting)
            {
                this.blobPath = `${this.folderPath}/${uuid.v4()}/${this.file.name}`;
            }
            const blockBlobClient = containerClient.getBlockBlobClient(this.blobPath);
            console.log(`start uploading file ${this.blobPath}`)
            const totalSize = this.file.size
            const response = await blockBlobClient.uploadData(this.file, {
                abortSignal: this.controller.signal,
                blobHTTPHeaders: { blobContentType: this.file.type },
                blockSize: 4 * 1024 * 1024,
                onProgress: (ev) =>
                {
                    console.log(`You have uploaded ${ev.loadedBytes} bytes`);
                    this._progress = Math.round(100 * ev.loadedBytes / totalSize);
                }
            })
            this.url = blockBlobClient.url.split('?')[0];
            console.log(` upload file ${this.file.name} successfully,`, response, blockBlobClient.url.split('?')[0]);
        } catch (error: any)
        {
            console.log(`cannot upload file ${this.file.name}, it return error ${error}`);
            if (error?.name === 'AbortError')
            {
                console.log(`aborted!`);
            } else
            {
                swal.fire(
                    `File upload failed!`,
                    `Uploading file ${this.file.name} failed. Please try again.`,
                    error
                );
            }

        }

    }

    cancel()
    {
        this.controller.abort()
        console.log(`cancel uploading file ${this.file.name}`)
    }
}