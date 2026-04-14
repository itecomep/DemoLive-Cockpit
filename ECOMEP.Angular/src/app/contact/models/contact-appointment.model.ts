import { BaseBlobEntity, BaseEntity } from "src/app/shared/models/base-entity.model";
import { Contact } from "./contact";
import { Company } from "src/app/shared/models/company.model";

export class ContactAppointment extends BaseEntity
{
  designation!: string;
  code!: string;
  employeeCode?: string;
  joiningDate!: Date;
  resignationDate?: Date;
  manValue: number = 0;
  expectedVhr: number = 0;
  expectedRemuneration: number = 0;
  contactID!: number;
  contact?: Contact;
  companyID!: number;
  company?: Company;
  managerContactID?: number;
  managerContact?: Contact;
  location?:string;
  attachments: ContactAppointmentAttachment[] = [];
  constructor(init?: Partial<ContactAppointment>)
  {
    super(init);
    Object.assign(this, init);

  }
}

export class ContactAppointmentAttachment extends BaseBlobEntity
{
  contactAppointmentID!: number;

  constructor(init?: Partial<ContactAppointmentAttachment>)
  {
    super(init);
    Object.assign(this, init);

  }
}