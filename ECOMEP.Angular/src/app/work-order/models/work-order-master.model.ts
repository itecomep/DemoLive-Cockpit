import { BaseEntity } from "src/app/shared/models/base-entity.model";
import { WorkOrderMasterStage } from "./work-order-master-stage.model";

export class WorkOrderMaster extends BaseEntity {
    typologyTitle!: string;
    workOrderMasterStages: WorkOrderMasterStage[] = [];

    constructor(init?: Partial<WorkOrderMaster>) {
        super(init);
        Object.assign(this, init);
    }
}