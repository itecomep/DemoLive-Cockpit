import { AssessmentDto } from "../../shared/models/assessment-dto";

export class WFTaskAnalysis {
  project!: string;
  person!: string;
  assignedBy!: string;
  entity!: string;
  entityTitle!: string;
  taskTitle!: string;
  revision!: number;
  workDescription!: string;
  status!: string;
  startDate!: Date;
  dueDate!: Date;
  completedDate!: Date;
  delay: number = 0
  commentOnCompletion!: string;
  isTimeBoundTask!: boolean;
  manValue: number = 0
  vHrRate: number = 0
  mHrAssigned: number = 0
  vHrAssigned: number = 0
  vHrAssignedCost: number = 0
  mHrConsumed: number = 0
  vHrConsumed: number = 0;
  vHrConsumedCost: number = 0
  mHrAssessed: number = 0
  vHrAssessed: number = 0
  vHrAssessedCost: number = 0;
  isAssessmentApplicable!: boolean;
  assessmentPoints: number = 0;
  assessmentRemark!: string;
  assessmentSummary!: string;
  assessments: AssessmentDto[] = [];
  wFTaskID!: number;
  entityID!: number | null;
  contactID!: number;
  projectID!: number;
  companyID!: number;

  mHrBurned: number = 0;
}

export class WFTaskAnalysisGroup {
  contactID!: number;
  taskAnalysis: WFTaskAnalysis[] = [];

  constructor(contactID: number, taskAnalysis: WFTaskAnalysis[]) {
    this.contactID = contactID;
    this.taskAnalysis = taskAnalysis;
  }

  get assignedMHr(): number { return this.taskAnalysis.map(x => x.mHrAssigned).reduce((a, b) => a + b, 0); };
  get assessedMHr(): number { return this.taskAnalysis.map(x => x.mHrAssessed).reduce((a, b) => a + b, 0); };
  get consumedMHr(): number { return this.taskAnalysis.map(x => x.mHrConsumed).reduce((a, b) => a + b, 0); };
  get burnedMHr(): number { return this.consumedMHr > this.assessedMHr ? this.consumedMHr - this.assessedMHr : 0; };
}