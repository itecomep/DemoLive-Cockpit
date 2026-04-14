import { Contact } from "src/app/contact/models/contact";
import { BaseEntity } from "src/app/shared/models/base-entity.model";

export class AssessmentDto extends BaseEntity
{
  contactID: number = 0;
  contact: Contact = new Contact();
  taskTitle!: string;
  category!: string;
  points: number = 0;
  scoredPoints: number = 4;
  wfTaskID: number = 0;
}
