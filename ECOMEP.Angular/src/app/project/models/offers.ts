
import { ProjectAttachment } from "./project.model";
import { BaseEntity } from "src/app/shared/models/base-entity.model";

export class ProjectOffers extends BaseEntity {
  date: Date = new Date();
  dueDate: Date = new Date();
  amount: number = 0;
  projectID: number = 0;
  attachments: ProjectAttachment[] = [];

  constructor(init?: Partial<ProjectOffers>) {
    super(init);
    Object.assign(this, init);
  }
}
