export class ContactAnalysis
{
    ID!: number;
    isCompany: boolean = false;
    type?: string;
    name: string | undefined;
    category: string | undefined;
    phone: string | undefined;
    email: string | undefined;
    area: string | undefined;
    city: string | undefined;
    state: string | undefined;
    country: string | undefined;
    source: string | undefined;
    grade: string | undefined;
    employeeCount: number = 0;
    relationshipManager: string | undefined;
    note: string | undefined;
    actionOn: Date | undefined;
    actionBy: string | undefined;
}