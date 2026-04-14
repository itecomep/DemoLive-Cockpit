import { Contact } from "src/app/contact/models/contact";
import { BaseEntity } from "src/app/shared/models/base-entity.model";

export class TimeEntryDto extends BaseEntity
{
  contactID: number = 0;
  contact: Contact = new Contact();
  taskTitle!: string;
  manHours: number = 0;
  wFTaskID?: number = 0;
  isPaused: boolean = false;
  projectID?: number = 0;
  companyID: number = 0;
  manValue: number = 0;
  valueHourRate: number = 0;
  valueHourCost: number = 0;
  startDate: Date = new Date();
  endDate?: Date;
  wfTaskID: number = 0;
  mHr: number = 0;
  vHr: number = 0;

  constructor(init?: Partial<BaseEntity>)
  {
    super(init);
    Object.assign(this, init);

  }
}
