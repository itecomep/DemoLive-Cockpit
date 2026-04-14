import { BaseEntity } from "src/app/shared/models/base-entity.model";
import { ProjectStageDelivery } from "./project-stage-delivery.model";

export class ProjectStage extends BaseEntity {
    projectID!: number;
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
    deliveries: ProjectStageDelivery[] = [];
    children: ProjectStage[] = [];
    constructor(init?: Partial<ProjectStage>) {
        super(init);
        Object.assign(this, init);

    }
}