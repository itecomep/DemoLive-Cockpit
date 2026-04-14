
import { BaseBlobEntity, BaseEntity } from "src/app/shared/models/base-entity.model";
import { ContactAppointment } from "./contact-appointment.model";
import { ContactWorkOrder } from "./contact-work-order.model";

export class Contact extends BaseEntity
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
  appointments: ContactAppointment[] = [];
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
  attachments: ContactAttachment[] = [];
  workOrders: ContactWorkOrder[] = [];
  phones: ContactPhone[] = [];
  emails: ContactEmail[] = [];
  addresses: ContactAddress[] = [];
  pan?: string;
  tan?: string;
  gstin?: string;
  hsn?: string;
  arn?: string;
  aadhaar?: string;
  udhyam?: string;

  parent?:Contact;
  parentID?:number;
  children:Contact[]=[];
  constructor(init?: Partial<Contact>)
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

export class EmailOption {
  name!: string;
  email!: string;
  company?: string;
  id!: number;
  uid!: string;
  typeFlag!: number;
  photoUrl?: string;
  constructor(init?: Partial<EmailOption>)  {
    Object.assign(this, init);
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


export class ContactAttachment extends BaseBlobEntity
{
  contactID!: number;
  title?:string;
  constructor(init?: Partial<ContactAttachment>)
  {
    super(init);
    Object.assign(this, init);

  }
}

export class ContactPhone 
{
  contactID!: number;
  title?: string;
  phone!: string;
  isPrimary: boolean = false;

  constructor(init?: Partial<ContactPhone>)
  {
    Object.assign(this, init);

  }
}

export class ContactEmail 
{
  contactID!: number;
  title?: string;
  email!: string;
  isPrimary: boolean = false;
  constructor(init?: Partial<ContactEmail>)
  {
    Object.assign(this, init);

  }
}

export class ContactAddress 
{
  contactID!: number;
  isPrimary: boolean = false;
  title?: string;
  street!: string;
  area?: string;
  city?: string;
  state?: string;
  country?: string;
  pinCode?: string;
  constructor(init?: Partial<ContactAddress>)
  {
    Object.assign(this, init);

  }
}

