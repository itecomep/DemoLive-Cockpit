import { BaseEntity } from "src/app/shared/models/base-entity.model";

export class WorkOrderMasterStage extends BaseEntity {
    workOrderMasterID!: number;
    title!: string;
    value!: number;

    constructor(init?: Partial<WorkOrderMasterStage>) {
        super(init);
        Object.assign(this, init);
    }
}