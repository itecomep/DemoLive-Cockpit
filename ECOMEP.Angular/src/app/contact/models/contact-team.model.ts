import { BaseEntity } from "src/app/shared/models/base-entity.model";
import { Contact } from "./contact";

export class ContactTeam extends BaseEntity {
    title!: string;
    leaderID?:number;
    assistantID?:number;
    members: ContactTeamMember[] = [];
    constructor(init?: Partial<ContactTeam>)
    {
        super(init);
      Object.assign(this, init);
    }
}

export class ContactTeamMember extends BaseEntity {
    contactTeamID!: number;
    contactID!: number;
    contact?:Contact;
    isLeader: boolean=false;
    isAssistantLeader: boolean=false;
    constructor(init?: Partial<ContactTeamMember>)
    {
        super(init);
      Object.assign(this, init);
    }
}

