import { ContactTeam } from "src/app/contact/models/contact-team.model";
import { BaseEntity } from "src/app/shared/models/base-entity.model";

export class ProjectTeam extends BaseEntity {
    projectID!: number;
    contactTeamID!: number;
    contactTeam!: ContactTeam;

    constructor(init?: Partial<ProjectTeam>) {
        super(init);
        Object.assign(this, init);
    }
}