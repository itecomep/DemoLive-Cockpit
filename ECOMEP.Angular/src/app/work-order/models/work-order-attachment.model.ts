import { BaseBlobEntity } from "src/app/shared/models/base-entity.model";

export class WorkOrderAttachment extends BaseBlobEntity {
    workOrderID!: number;

    constructor(init?: Partial<WorkOrderAttachment>) {
        super(init);
        Object.assign(this, init);
    }
}