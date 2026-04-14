import { BaseEntity } from "src/app/shared/models/base-entity.model";
import { WorkOrderAttachment } from "./work-order-attachment.model";
import { Project } from "src/app/project/models/project.model";
import { Company } from "src/app/shared/models/company.model";
import { WorkOrderStage } from "./work-order-stage.model";

export class WorkOrder extends BaseEntity {
    companyID!: number;
    company?: Company;
    projectID!: number;
    project!: Project;
    typology!: string;
    workOrderNo?: number;
    workOrderDate!: Date;
    dueDate?: Date;
    area!: number;
    isLumpSum: boolean = false;
    rate!: number;
    attachments: WorkOrderAttachment[] = [];
    amount!: number;
    stages: WorkOrderStage[] = [];


    constructor(init?: Partial<WorkOrder>) {
        super(init);
        Object.assign(this, init);
    }
}