import { BaseEntity } from "src/app/shared/models/base-entity.model";

export class ProjectStageMasterDelivery extends BaseEntity {
    projectStageMasterID!: number;
    title!: string;
    abbrivation?: string;
    percentage: number = 0;
}