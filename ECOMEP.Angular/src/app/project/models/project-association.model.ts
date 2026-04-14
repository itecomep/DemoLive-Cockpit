import { Contact } from "src/app/contact/models/contact";
import { BaseEntity } from "src/app/shared/models/base-entity.model";
export class ProjectAssociation extends BaseEntity
{
  title!: string;
  projectID!: number;
  contactID!: number;
  contact!: ProjectAssociationListItem;
  valueHours!: number;
  valueHourRate!: number;

  constructor(init?: Partial<ProjectAssociation>) {
    super(init);
    Object.assign(this, init);
  }
}
export class ProjectAssociationListItem extends BaseEntity
{
  isCompany: boolean = false;

  associatedCompanies: ContactAssociation[] = [];
  associatedContacts: ContactAssociation[] = [];
  categories: string[] = [];
  fullName!: string;

  name!: string;
  title?: string;
  firstName!: string;
  middleName?: string;
  lastName?: string;
  gender?: string;
  birth?: Date;
  anniversary?: Date;
  website?: string;

  photoUrl?: string;
  username?: string;
  email?: string;
  phone?: string;
  appointments: any[] = [];
  attachments: any[] = [];
  workOrders: any[] = [];
  phones: any[] = [];
  emails: any[] = [];
  addresses: any[] = [];
  maritalStatus?: string;
  familyContactRelation?: string;
  familyContactPhone?: string;
  familyContactName?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  bankName?: string;
  bankAccountNo?: string;
  ifscCode?: string;

  parent?: ProjectAssociationListItem;
  parentID?: number;
  children: ProjectAssociationListItem[] = [];
  
  constructor(init?: Partial<ProjectAssociationListItem>)
  {
    super(init);
    Object.assign(this, init);
  }

  get primaryEmail()
  {
    if (!this.emails || this.emails.length == 0) return '';
    return this.emails.find(x => x.isPrimary)?.email;
  }

  get primaryPhone()
  {
    if (!this.phones || this.phones.length == 0) return '';
    return this.phones.find(x => x.isPrimary)?.phone;
  }

  get primaryAddress()
  {
    if (!this.addresses || this.addresses.length == 0) return '';
    return this.addresses.find(x => x.isPrimary);
  }
}
export class ContactAssociation extends BaseEntity
{
  personContactID!: number;
  companyContactID!: number;
  person!: Contact;
  company!: Contact;
  department?: string;
  designation?: string;

  constructor(init?: Partial<ContactAssociation>)
  {
    super(init);
    Object.assign(this, init);

  }
}


