import { BaseBlobEntity, BaseEntity } from "src/app/shared/models/base-entity.model";


export class ProjectBill extends BaseEntity
{
  isPreDated: boolean = false;
  projectID!: number;
  projectCode!:string;
  projectTitle!:string;
  projectLocation?:string;
  projectFee:number=0;
  companyID?:number;
  clientContactID?:number;
  proformaInvoiceNo?: string;
  taxInvoiceNo?: string;
  sequenceNo?: string;
  isLumpSump: boolean = false;
  billPercentage: number = 0;
  workPercentage: number = 0;
  billDate!: Date;
  proformaDate!: Date;
  billAmount: number = 0;
  previousBillAmount: number = 0;
  dueAmount: number = 0;
  isIGSTApplicable:boolean=false;
  igstShare: number = 0;
  igstAmount: number = 0;
  cgstShare: number = 0;
  cgstAmount: number = 0;
  sgstShare: number = 0;
  sgstAmount: number = 0;
  tdsAmount: number = 0;
  amountAfterTDS: number = 0;
  payableAmount: number = 0;
  reverseTaxCharges?: string;
  workOrderID?: number;
  amountInWords?: string;
  hsn?: string;
  clientName?: string;
  clientAddress?: string;
  clientGSTIN?: string;
  clientGSTStateCode?: string;
  clientTAN?:string;
  clientPAN?:string;
  // totalAreaOfConstructon: number = 0;
  // totalAreaFees: number = 0;

  companyName?:string;
  companyAddress?:string;
  companyGSTIN?:string;
  companyGSTStateCode?:string;
  companyTAN?:string;
  companyPAN?:string;
  companyUDHYAM?:string;
  companyLogoUrl?: string;
  companyBank?: string;
  companyBankBranch?: string;
  companyBankIFSCCode?: string;
  companySwiftCode?: string;
  companyBankAccount?: string;
  companySignStampUrl?: string;

  payments: ProjectBillPayment[] = [];
  followUps: ProjectBillFollowUp[] = [];
  proformaInvoiceUrl?: string;
  taxInvoiceUrl?: string;
  projectWorkOrderID?: number;
  workOrderDate?: Date;
  workOrderNo?: string;

  stages: BillStage[] = [];
  constructor(init?: Partial<ProjectBill>)
  {
    super(init);
    Object.assign(this, init);
  }
}

export class ProjectBillFollowUp extends BaseEntity
{
  billID!: number;
  dueDate?: Date;
  comment?: string;
}

export class ProjectBillPayment extends BaseEntity
{
  projectBillID!: number;
  mode?: string;
  amount: number = 0;
  tdsAmount: number = 0;
  isTDSPaid: boolean = false;
  tdsShare: number = 0;
  netAmount: number = 0;
  adjustmentAmount: number = 0;
  exchangeRate: number = 0;
  currency: string = 'INR';
  comment?: string;
  transactionNo?: string;
  transactionDate?: Date;
  bankDetail?: string;
  refUrl?: string;
  refGuid?: string;
  attachments: ProjectBillPaymentAttachment[] = [];
  followUps: ProjectBillFollowUp[] = [];
  constructor(init?: Partial<ProjectBillPayment>)
  {
    super(init);
    Object.assign(this, init);
  }
}

export class ProjectBillPaymentAttachment extends BaseBlobEntity
{
  projectBillPaymentID!: number;
  constructor(init?: Partial<ProjectBillPaymentAttachment>)
  {
    super(init);
    Object.assign(this, init);
  }
}

export class BillStage 
{
  id!:number;
  title!: string;
  abbreviation?: string;
  percentage: number = 0;
  amount: number = 0;
  orderFlag: number = 0;
  statusFlag: number = 0;

  constructor(init?: Partial<BillStage>)
  {
    Object.assign(this, init);
  }
}

export class BillSummary
{
  id!: number;
  typeFlag: number = 0;
  billDate!: Date;
  billNo?: string;
  project!: string;
  projectCode!: string;
  developer?: string;
  developerTAN?: string;
  percentage: number = 0;
  totalAreaFees: number = 0;
  amount: number = 0;
  tds: number = 0;
  gstShare: number = 0;
  gstAmount: number = 0;
  igstAmount: number = 0;
  igstShare: number = 0;
  cgstShare: number = 0;
  cgstAmount: number = 0;
  sgstShare: number = 0;
  sgstAmount: number = 0;
  total: number = 0;
  payable: number = 0;
  dueDate?: Date;
  comment?: string;
  pendingPayment: number = 0;
  isTDSPaid: boolean = false;
  tdsPaid: number = 0;
  tdsBalance: number = 0;
}

export class BillTotal
{
  totalBillAmount: number = 0;
  totalTaxAdded: number = 0;
  totalPayableAmount: number = 0;
  totalReceivedAmout: number = 0;
}

export class ProjectBillAnalysis
{
    id!: number;
    typeFlag!: number;

    projectID!: number;
    projectCode!:string;
    projectTitle!:string;
    projectLocation?:string;
    projectFee:number=0;
    companyID?:number;
    clientContactID?:number;
    proformaInvoiceNo?: string;
    taxInvoiceNo?: string;
    sequenceNo?: string;
    isLumpSump: boolean = false;
    billPercentage: number = 0;
    workPercentage: number = 0;
    billDate!: Date;
    billAmount: number = 0;
    previousBillAmount: number = 0;
    dueAmount: number = 0;
    isIGSTApplicable:boolean=false;
    igstShare: number = 0;
    igstAmount: number = 0;
    cgstShare: number = 0;
    cgstAmount: number = 0;
    sgstShare: number = 0;
    sgstAmount: number = 0;
    payableAmount: number = 0;
    // reverseTaxCharges?: string;
    // amountInWords?: string;
    // hsn?: string;
    clientName?: string;
    // clientAddress?: string;
    // clientGSTIN?: string;
    // clientGSTStateCode?: string;
    // clientTAN?:string;
    // clientPAN?:string;
    companyName?:string;
    // companyAddress?:string;
    // companyGSTIN?:string;
    // companyGSTStateCode?:string;
    // companyTAN?:string;
    // companyPAN?:string;
    // companyUDHYAM?:string;
    // companyLogoUrl?: string;
    // companyBank?: string;
    // companyBankBranch?: string;
    // companyBankIFSCCode?: string;
    // companySwiftCode?: string;
    // companyBankAccount?: string;
    // companySignStampUrl?: string;
  
    payments: ProjectBillPayment[] = [];
    // followUps: ProjectBillFollowUp[] = [];
    proformaInvoiceUrl?: string;
    taxInvoiceUrl?: string;
    projectWorkOrderID?: number;
    workOrderDate?: Date;
    workOrderNo?: string;

    pendingPayment: number = 0;
    receivedPayment: number = 0;
    tdsAmount: number = 0;
    
}