import { WFStageAction } from "./wf-stage-action";

export class WFStage
{
  id: number = 0;
  code!: string;
  taskTitle!: string;
  entity!: string;
  entityTypeFlag: number = 0;
  isSystem: boolean = false;
  isStart: boolean = false;
  dueDays: number = 0;
  isAssignByRole: boolean = false;
  showAssessment: boolean = false;
  assessmentForStage!: string;
  assignByProperty!: string;
  showComment: boolean = false;
  showFollowUpDate: boolean = false;
  showAttachment: boolean = false;
  actionType!: string;
  actions: WFStageAction[] = [];
  isCommentRequired: boolean = false;
  initialRevison: number = 0;
  isAssessmentRequired: boolean = false;
  isPreAssignedTimeTask: boolean = false;
  description!: string;
}
