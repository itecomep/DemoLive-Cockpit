import { WFTask } from "../../wf-task/models/wf-task.model";

export class McvComponentConfig
{
  entityID!: number;
  task?: WFTask;
  wfTaskID?: number;
  isCreateMode: boolean = false;
  isTaskMode: boolean = false;
  entityTypeFlag: number = 0;
  currentEntity: any;
}
