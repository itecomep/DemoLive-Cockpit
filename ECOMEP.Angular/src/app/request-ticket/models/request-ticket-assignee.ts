import { BaseEntity } from "src/app/shared/models/base-entity.model";
export class RequestTicketAssignee extends BaseEntity
{
  contactID!: number;
  requestTicketID!: number;
  name!: string;
  email!: string;
  company!: string;
}
