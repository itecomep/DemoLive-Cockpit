import { Contact } from "src/app/contact/models/contact";
import { SiteVisitAttendee } from "./site-visit-attendee.model";
import { BaseEntity } from "src/app/shared/models/base-entity.model";
import { SitevisitAgenda } from "./site-visit-agenda.model";

export class SiteVisit extends BaseEntity
{
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
  attendees: SiteVisitAttendee[] = [];
  agendas: SitevisitAgenda[] = [];
  isEditable!: boolean;
  projectID?: number;
  location!: string;
  isDelayed!: boolean;
  parentID!: number;
  title!: string;

  constructor(init?: Partial<SiteVisit>)
  {
    super(init);
    Object.assign(this, init);
  }
}
