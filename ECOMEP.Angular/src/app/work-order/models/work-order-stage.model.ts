import { BaseEntity } from "src/app/shared/models/base-entity.model";

export class WorkOrderStage extends BaseEntity {
    projectID!: number;
    workOrderID!: number;
    title!: string;
    percentage!: number;
    abbreviation?: string;
    amount!: number;
    isLumpsum!: boolean;
    parentID?: number;
    dueDate?: Date;
    billingDate?: Date;
    paymentReceivedDate?: Date;
    revisions!: number;
    children: WorkOrderStage[] = [];
    constructor(init?: Partial<WorkOrderStage>) {
        super(init);
        Object.assign(this, init);
    }
}