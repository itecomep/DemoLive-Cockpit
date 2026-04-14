import { BaseEntity } from "src/app/shared/models/base-entity.model";
import { WFTaskAttachment } from "../../wf-task/models/wf-task.model";

export interface PropertyChange {
  propertyName: string;
  oldValue: string;
  newValue: string;
}

export class ActivityDto extends BaseEntity
{
  contactID!: number;
  action!: string;
  wfTaskID?: number;
  comments?: string;
  status!: string;
  contactUID!: string;
  contactPhotoUrl?: string;
  contactName!: string;
  attachments: WFTaskAttachment[] = [];
  propertyChanges?: PropertyChange[];

}