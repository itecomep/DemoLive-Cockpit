import { Contact } from 'src/app/contact/models/contact';
import { RequestTicketAssignee } from './request-ticket-assignee';
import { BaseBlobEntity, BaseEntity } from "src/app/shared/models/base-entity.model";

export class RequestTicket extends BaseEntity {
  purpose!: string;
  title!: string;
  subtitle!: string;
  code!: string;
  requestMessage!: string;
  resolutionMessage!: string;
  nextReminderDate!: Date;
  reminderInterval: number = 0;
  assignees: RequestTicketAssignee[] = [];
  assignerContactID!: number;
  assignerContact?: Contact;
  repeatCount: number = 0;
  attachments: RequestTicketAttachment[] = [];
  projectID?: number;
  isReadonly: boolean = false;
  parentID?: number;
  isRepeatRequired: boolean = false;
  isDraft: boolean = false;
  stageTitle?:string;
  stageID?: number;
  revision?:number;
  authority?: string;

  constructor(init?: Partial<RequestTicket>) {
    super(init);
    Object.assign(this, init);
  }
}

export class RequestTicketAttachment extends BaseBlobEntity {
  requestTicketID!: number;

  constructor(init?: Partial<RequestTicketAttachment>) {
    super(init);
    Object.assign(this, init);
  }
}
