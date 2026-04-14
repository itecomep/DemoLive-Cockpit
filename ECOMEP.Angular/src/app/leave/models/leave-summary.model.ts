export class LeaveSummary {
    month: number = 0;
    year: number = 0;
    leaveCycle!: string;
    label!: string;
    approvedLeave: number = 0;
    emergencyLeave: number = 0;
    late: number = 0;
    penalty: number = 0;
    approvedBreak: number = 0;
    approvedHalfDay: number = 0;
    approvedWFH: number = 0;
    emergencyBreak: number = 0;
    emergencyHalfDay: number = 0;
    emergencyWFH: number = 0;
    total: number = 0;
    allowed: number = 0;
    balance: number = 0;
    allowedEmergency: number = 0;
    emergencyBalance: number = 0;
    leaveEligible: number = 1;
    leavePending: number = 1;
    approvedFirstHalf: number = 0;
    approvedSecondHalf: number = 0;
    emergencyFirstHalf: number = 0;
    emergencySecondHalf: number = 0;

}