import { BaseEntity } from "src/app/shared/models/base-entity.model";
import { ProjectStageMasterDelivery } from "./project-stage-master-delivery.model";

export class ProjectStageMaster extends BaseEntity {
    title!: string;
    percentage!: number;
    typology!: string;
    deliveries: ProjectStageMasterDelivery[] = [];

    constructor(init?: Partial<ProjectStageMaster>) {
        super(init);
        Object.assign(this, init);

    }
}