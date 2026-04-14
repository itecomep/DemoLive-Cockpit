
import { BaseEntity } from "src/app/shared/models/base-entity.model";

export class ProjectNote extends BaseEntity {
    notes!: string;
    projectID!: number;

    constructor(init?: Partial<ProjectNote>) {
        super(init);
        Object.assign(this, init);
    }
}
