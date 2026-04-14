export class TimeEntryAnalysisDto
{
  person!: string;
  taskStage!: string;
  entity!: string;
  entityTitle!: string;
  startDate!: string;
  endDate!: string;
  manHours: number = 0;
  assessedManHours: number = 0;
  assessmentPoints: number = 0;
  manValue: number = 0;
  status!: string;
  id: number = 0;
  valueHours: number = 0;
  valueHourRate: number = 0;
  valueHourCost: number = 0;
  contactID: number = 0;
}
