import { BaseEntity, BaseBlobEntity } from "src/app/shared/models/base-entity.model";

export class SitevisitAgenda extends BaseEntity
{
  sitevisitID!: number;
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
  attachments: SitevisitAgendaAttachment[] = [];
  isDelayed: boolean = false;
  // packageID!: number;
  reminderCount: number = 0;
  updateFrom?: string;
  projectID?: number;
  designScriptEntityID!: number;
  isSitevist: boolean = false;
  sitevisitTitle?: string;
  sitevisitDate?: Date;
  progress: number = 0;
  previousProgress: number = 0;
  todoID?: number;
  notDiscussed: boolean = false;
  sendUpdate: boolean = false;
  isForwarded: boolean = false;
  constructor(init?: Partial<SitevisitAgenda>)
  {
    super(init);
    Object.assign(this, init);
  }
}

export class SitevisitAgendaAttachment extends BaseBlobEntity
{
  sitevisitAgendaID!: number;

  constructor(init?: Partial<SitevisitAgenda>)
  {
    super(init);
    Object.assign(this, init);
  }
}
