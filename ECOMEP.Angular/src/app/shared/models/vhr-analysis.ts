
export class VHr
{
  contactID: number = 0;
  person!: string;
  currentManValue: number = 1;
  currentVHrRate: number = 1;
  expectedMHr: number = 0;
  expectedVHr: number = 0;
  expectedRemuneration: number = 0;
  vHrDifferencePercentage: number = 0;
  earnedInSelfPackages!: WFTaskVHr;
  recordedInOthersPackages!: WFTaskVHr;
  recordedForMeetings!: WFTaskVHr;
  recordedInProjectTodo!: WFTaskVHr;
  recordedInTodo!: WFTaskVHr;
  recordedForInquiries!: WFTaskVHr;
  recordedForHabits!: WFTaskVHr;
  mHr: number = 0;
  vHr: number = 0;
  remuneration: number = 0;

}

export class WFTaskVHr
{
  contactID!: number;
  person!: string;
  entity!: string;
  mHrAssessed: number = 0;
  vHrAssessed: number = 0;
  vHrAssessedCost: number = 0;
}
