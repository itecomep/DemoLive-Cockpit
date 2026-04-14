import { Contact } from "src/app/contact/models/contact";
import { MeetingAttendee } from "./meeting-attendee.model";
import { BaseEntity } from "src/app/shared/models/base-entity.model";
import { MeetingAgenda } from "src/app/meeting/models/meeting-agenda.model";
import { MeetingAttachment } from "./meeting-attachments.model";
import { MeetingVoucher } from "./meeting-voucher.model";

export class Meeting extends BaseEntity {
  code!: string;
  startDate!: Date;
  endDate!: Date;
  venue!: string;
  version: number = 0;
  contactID!: number;
  contact!: Contact;
  closedOn!: Date;
  finalizedOn!: Date;
  isSent!: boolean;
  attendees: MeetingAttendee[] = [];
  agendas: MeetingAgenda[] = [];
  isEditable!: boolean;
  projectID?: number;
  location!: string;
  isDelayed!: boolean;
  parentID!: number;
  title!: string;
  attachments: MeetingAttachment[] = [];
  vouchers: MeetingVoucher[] = [];
  gmaps: MeetingGmap[] = [];
  documentsCarried: MeetingDocumentsCarried[] = [];
  purpose!: string;
  remark!: string;
  isFollowUp!: boolean;
  followUpRemark!: string;

  constructor(init?: Partial<Meeting>) {
    super(init);
    Object.assign(this, init);
  }
}


export class MeetingGmap {
  title!: string;
  url!: string;

  constructor(init?: Partial<MeetingGmap>) {
    Object.assign(this, init);
  }
}

export class MeetingDocumentsCarried {
  title!: string;

  constructor(init?: Partial<MeetingDocumentsCarried>) {
    Object.assign(this, init);
  }
}