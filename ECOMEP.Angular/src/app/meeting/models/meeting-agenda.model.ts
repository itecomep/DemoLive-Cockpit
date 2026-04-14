import { BaseEntity, BaseBlobEntity } from "src/app/shared/models/base-entity.model";

export class MeetingAgenda extends BaseEntity
{
  meetingID!: number;
  title!: string;
  subtitle!: string;
  comment!: string;
  dueDate?: Date;
  actionBy?: string;
  actionByContactID?: number;
  previousComment?: string;
  previousDueDate?: Date;
  previousActionBy?: string;
  previousHistory?: string;
  previousAgendaID?: number;
  // isPackageRequired: boolean = false;
  attachments: MeetingAgendaAttachment[] = [];
  isDelayed: boolean = false;
  // packageID!: number;
  reminderCount: number = 0;
  updateFrom?: string;
  projectID?: number;
  designScriptEntityID!: number;
  isInspection: boolean = false;
  meetingTitle?: string;
  meetingDate?: Date;
  progress: number = 0;
  previousProgress: number = 0;
  todoID?: number;
  notDiscussed: boolean = false;
  sendUpdate: boolean = false;
  isForwarded: boolean = false;
  constructor(init?: Partial<MeetingAgenda>)
  {
    super(init);
    Object.assign(this, init);
  }
}

export class MeetingAgendaAttachment extends BaseBlobEntity
{
  meetingAgendaID!: number;

  constructor(init?: Partial<MeetingAgendaAttachment>)
  {
    super(init);
    Object.assign(this, init);
  }
}
