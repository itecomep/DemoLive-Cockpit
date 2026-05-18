
import { BaseBlobEntity, BaseEntity } from "src/app/shared/models/base-entity.model";
import { TodoAgenda } from "./todo-agendaas";
import { Contact } from "src/app/contact/models/contact";
import { ActivityDto } from "src/app/shared/models/activity-dto";

export class Todo extends BaseEntity
{
  title!: string;
  subTitle!: string;
  dueDate!: Date;
  comment!: string;
  assigneeContactID: number = 0;
  assignerContactID: number = 0;
  assignee!: Contact;
  assigner!: Contact;
  agendas: TodoAgenda[] = [];
  attachments: TodoAttachment[] = [];
  mHrAssigned: number = 0;
  mHrConsumed!: number;
  projectID?: number;
  priority!:string;
  parentID?: number;
  startDate!: Date;
  constructor(init?: Partial<Todo>)
  {
    super(init);
    Object.assign(this, init);
  }

}

export class TodoAttachment extends BaseBlobEntity
{
  todoID!: number;
  constructor(init?: Partial<TodoAttachment>)
  {
    super(init);
    Object.assign(this, init);
  }
}

export class TodoAnalysis {
  assignee!: Contact;
  assigneeContactID!: number;
  assigneeName!: string;
  assigner!: Contact;
  assignerContactID!: number;
  assignerName!: string;
  completedDate?: Date;
  delay!: number;
  dueDate!: Date;
  entityID!: number;
  mHrAssigned!: number;
  mHrConsumed!: number;
  priority!: string;
  projectID?: number;
  startDate!: Date;
  statusFlag!: number;
  statusValue?: string;
  teamID: number[] = [];
  title!: string;
  revision!: number;
  activity: ActivityDto[] = [];
  agendas: TodoAnalysisAgenda[] = [];
  completedAgendas: TodoAnalysisAgenda[] = [];
  pendingAgendas: TodoAnalysisAgenda[] = [];
}
export class TodoAnalysisAgenda {
  orderFlag!: number;
  statusFlag!: number;
  title?: string
}
