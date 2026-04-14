export class ProjectAnalysis
{
    id!: number;
    uid!: string;
    company!: string;
    title!: string;
    code!: string;
    location!: string;
    city!: string;
    state!: string;
    country!: string;
    status!: string;
    segment!: string;
    client!: string;
    referredBy!: string;
    created!: Date;
    modified!: Date;
    expectedCompletionDate!: Date | null;
    fee!: number;
    expectedMHr!: number;
    assignedMHr!: number;
    consumedMHr!: number;
    assessedMHr!: number;
    availableMHr!: number;
    averageAssessmentPoints!: number;
    landscapeArea!: number;
    facadeArea!: number;
    interiorArea!: number;
    statusFlag!: number;
    burnedMHr!: number;

}
