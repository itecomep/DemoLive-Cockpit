import { BaseEntity } from "src/app/shared/models/base-entity.model";

export class SiteVisitAttendee extends BaseEntity
{
  name!: string;
  company!: string;
  email!: string;
  contactID!: number;
  sitevisitID!: number;
  pendingAgendaCount!: number;

  constructor(init?: Partial<SiteVisitAttendee>)
  {
    super(init);
    Object.assign(this, init);
  }
}