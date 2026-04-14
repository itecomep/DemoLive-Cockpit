export class McvFileUploadConfig
{
    container: string;
    folderPath: string;

    /**
     *
     */
    constructor(container: string,
        folderPath: string,)
    {
        this.container = container;
        this.folderPath = folderPath;
    }
}