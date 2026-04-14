import { BaseEntity } from "src/app/shared/models/base-entity.model";
import { ProjectAttachment } from "./project.model";


export class WorkOrder extends BaseEntity {
  Date: Date = new Date();
  completionDate: Date = new Date();
  amount: number = 0;
  projectID: number = 0;
  attachments: ProjectAttachment[] = [];

  constructor(init?: Partial<WorkOrder>) {
    super(init);
    Object.assign(this, init);

  }
}
