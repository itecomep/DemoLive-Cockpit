import { BaseEntity } from "src/app/shared/models/base-entity.model";

export class ProjectStageDelivery extends BaseEntity {
    title?: string;
    abbreviation?: string;
    percentage!: number;
    amount!: number;
    projectStageID!: number;
}