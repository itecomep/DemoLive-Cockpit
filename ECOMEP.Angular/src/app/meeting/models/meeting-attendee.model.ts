import { BaseEntity } from "src/app/shared/models/base-entity.model";

export class MeetingAttendee extends BaseEntity
{
  name!: string;
  company!: string;
  email!: string;
  contactID!: number;
  meetingID!: number;
  pendingAgendaCount!: number;
  phone!: number;
  isRecipient?:boolean;
  constructor(init?: Partial<MeetingAttendee>)
  {
    super(init);
    Object.assign(this, init);
  }
}
