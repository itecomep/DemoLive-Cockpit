import * as uuid from 'uuid';

export class BaseEntity
{
  id: number = 0;
  uid!: string;
  created!: Date;
  modified!: Date;
  createdBy!: string;
  modifiedBy!: string;
  statusFlag: number = 0;
  typeFlag: number = 0;
  orderFlag: number = 0;
  description!: string;
  isDeleted!: boolean;
  statusValue!: string;
  typeValue!: string;
  entity?: string;
  entityID?: number;
  entityTitle?: string;
  createdByContactID?: number;
  modifiedByContactID?: number;
  searchTags: string[] = [];
  isReadOnly: boolean = false;

  constructor(init?: Partial<BaseEntity>)
  {
    Object.assign(this, init);
    this.uid = this.uid ?? uuid.v4();
  }

}

export class BaseBlobEntity extends BaseEntity
{
  filename!: string;
  container?: string;
  size: number = 0;
  guidname?: string;
  contentType?: string;
  url?: string;
  originalUrl?: string;
  attributes: any[] = [];
  categories: string[] = [];
  blobPath?: string;
  thumbFilename?: string;
  thumbUrl?: string;
  isFolder: boolean = false;
  folderPath?: string;
  parentID?: number;


  fileExtension(): string
  {
    return this.filename ? this.filename.substring((this.filename.lastIndexOf('.') + 1)).toLowerCase() : '';
  }
  mediaType(): string
  {

    if (this.fileExtension() === 'mp4' || this.fileExtension() === 'avi')
    {
      return 'video';
    } else if (this.fileExtension() === 'jpg' || this.fileExtension() === 'jpeg' || this.fileExtension() === 'png' || this.fileExtension() === 'gif')
    {
      return 'image';
    } else if (this.fileExtension() === 'mp3')
    {
      return 'audio';
    } else
    {
      return 'other'
    }
  }

  constructor(init?: Partial<BaseBlobEntity>)
  {
    super(init);
    Object.assign(this, init);
    this.originalUrl = this.originalUrl || this.url;
    this.thumbUrl = this.thumbUrl || this.url;
  }

}

export class BaseAttribute
{
  attributeKey!: string;
  attributeValue!: string;
  category!: string;
}

