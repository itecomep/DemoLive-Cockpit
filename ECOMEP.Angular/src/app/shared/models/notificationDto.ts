import { Contact } from "src/app/contact/models/contact";
import { BaseEntity } from "src/app/shared/models/base-entity.model";

export class NotificationDto extends BaseEntity
{
  contactID: number = 0;
  contact: Contact = new Contact();
  title!: string;
  redirectionUrl!: string;
}
