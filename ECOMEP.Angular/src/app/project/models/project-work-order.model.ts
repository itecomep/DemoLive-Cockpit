import { BaseBlobEntity, BaseEntity } from "src/app/shared/models/base-entity.model";

export class ProjectWorkOrder extends BaseEntity
{
    projectID!: number;
    fees: number = 0;
    rate: number = 0;
    share: number = 0;
    areaTitle!: string;
    unit!: string;
    area: number = 0;
    workOrderNo!: string;
    workOrderDate!: Date;
    dueDate?:Date;
    attachments: ProjectWorkOrderAttachment[] = [];
    workDetail?: string;
    workProposalTemplate?: string;
    blobUrl?: string;
    interiorCost: number = 0;
    segments: ProjectWorkOrderSegment[] = [];
    areas: ProjectWorkOrderArea[] = [];
    serviceAmounts : ProjectWorkOrderServiceAmount [] = [];
    constructor(init?: Partial<ProjectWorkOrder>)
    {
        super(init);
        Object.assign(this, init);
    }
}

export class ProjectWorkOrderArea extends BaseEntity
{
    projectWorkOrderID!: number;
    fees: number = 0;
    rate: number = 0;
    share: number = 0;
    areaTitle!: string;
    unit!: string;
    area: number = 0;

    constructor(init?: Partial<ProjectWorkOrderArea>)
    {
        super(init);
        Object.assign(this, init);
    }
}

export class ProjectWorkOrderAttachment extends BaseBlobEntity
{
    projectWorkOrderID!: number;
    constructor(init?: Partial<ProjectWorkOrderAttachment>)
    {
        super(init);
        Object.assign(this, init);
    }
}

export class ProjectWorkOrderSegment extends BaseEntity
{
    projectWorkOrderID!: number;
    title!: string;
    content?: string;
    constructor(init?: Partial<ProjectWorkOrderSegment>)
    {
        super(init);
        Object.assign(this, init);
    }
}

export class ProjectWorkOrderSegmentMaster extends BaseEntity
{
    projectWorkOrderMasterID!: number;
    title!: string;
    content?: string;
    constructor(init?: Partial<ProjectWorkOrderSegmentMaster>)
    {
        super(init);
        Object.assign(this, init);
    }
}

export class ProjectWorkOrderMaster extends BaseEntity
{
    template!: string;
    segments: ProjectWorkOrderSegmentMaster[] = [];
    constructor(init?: Partial<ProjectWorkOrderMaster>)
    {
        super(init);
        Object.assign(this, init);
    }
}

export class ProjectWorkOrderServiceAmount extends BaseEntity
{
    projectWorkOrderID!:number;
    service!: string;
    amount!: number;
    constructor(init?: Partial<ProjectWorkOrderServiceAmount>)
    {
        super(init);
        Object.assign(this, init);
    }
}
