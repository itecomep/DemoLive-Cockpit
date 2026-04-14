import { Contact } from "src/app/contact/models/contact";
import { BaseBlobEntity, BaseEntity } from "src/app/shared/models/base-entity.model";


export class Leave extends BaseEntity {

    contactID!: number;
    start!: Date;
    end!: Date;
    allDay: boolean = false;
    total: number = 0;
    reason!: string;
    contact!: Contact;
    title?: string;
    attachments: LeaveAttachment[] = [];

    constructor(init?: Partial<Leave>) {
        super(init);
        Object.assign(this, init);
    }
}

    export class LeaveAttachment extends BaseBlobEntity
    {
      leaveID!: number;
      constructor(init?: Partial<LeaveAttachment>)
      {
        super(init);
        Object.assign(this, init);
      }
    }
