export class WFStageAction
{
  id: number = 0;
  wFStageID: number = 0;
  taskOutcomeFlag: number = 0;
  taskStatusFlag: number = 0;
  actionByCondition!: string;
  actionByCount: number = 0;
  nextStageID?: number = 0;
  showOnStatusFlag!: string;
  activityText!: string;
  buttonClass!: string;
  buttonText!: string;
  buttonTooltip!: string;
  description!: string;
  triggerEntityFormSubmit: boolean = false;
  nextStageCode?:string;
}
