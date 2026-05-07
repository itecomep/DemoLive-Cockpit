import { Contact } from "src/app/contact/models/contact";
import { BaseBlobEntity, BaseEntity } from "src/app/shared/models/base-entity.model";

export class ProjectInward extends BaseEntity
{
    title!: string;
     projectInput!: string; // ✅ ADD HERE
    message!: string;
    projectID!: number;
    contactID!: number;
    contact!: Contact;
    senderName!: string;
    senderEmail!: string;
    category!: string;
    receivedDate: Date = new Date();
    attachments: ProjectInwardAttachment[] = [];

    constructor(init?: Partial<ProjectInward>) {
        super(init);
        Object.assign(this, init);
      }
}

export class ProjectInwardAttachment extends BaseBlobEntity
{
    projectInwardID: number = 0;

    constructor(options?: {
        projectInwardID: number,
        filename: string,
        uid: string,
        url: string,
        size: number,
        guidname: string,
        originalItem: any,
        id: number,
        searchTags: string[],
        description: string,
        orderFlag: number,
        typeFlag: number,
        statusFlag: number,
        entity: string,
        entityID: number,
        entityTitle: string,
        isDeleted: boolean,
        originalUrl: string,
        blobPath: string,
        thumbUrl: string,
        attributes: any[],
        categories: string[],
    })
    {
        super(options);
        if (options)
        {
            this.projectInwardID = options.projectInwardID;
        }
    }
}