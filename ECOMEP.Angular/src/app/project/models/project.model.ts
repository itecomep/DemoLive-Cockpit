import { ProjectAssociation } from "src/app/project/models/project-association.model";
import { Contact } from "src/app/contact/models/contact";
import { Company } from "src/app/shared/models/company.model";
import { BaseBlobEntity, BaseEntity } from "src/app/shared/models/base-entity.model";
import { ProjectInward } from "./project-inward.model";
import { ProjectNote } from "./project-note.model";
import { ProjectStage } from "./project-stage.model";
import { ProjectWorkOrder } from "./project-work-order.model";

export class Project extends BaseEntity {

  code!: string;
  title!: string;
  location?: string;
  city?: string;
  state?: string;
  country?: string;
  pinCode?: string;
  contractCompletionDate: Date = new Date();
  contractStartDate: Date = new Date();
  expectedCompletionDate: Date = new Date();
  inquiryConvertionDate?: Date;
  clientContactID?: number;
  referredByContactID?: number;
  groupContactID?: number;
  projectManagerContactID?: number;
  assistantProjectManagerContactID?: number;
  fee: number = 0;
  discount: number = 0;
  billingTitle?: string;
  expectedMHr: number = 0;
  clientContact?: Contact;
  referredByContact?: Contact;
  groupContact?: Contact;
  groupCompanyContact?: Contact;
  groupCompanyContactID?: number;
  projectManagerContact?: Contact;
  assistantProjectManagerContact?: Contact;
  attachments: ProjectAttachment[] = [];
  associations: ProjectAssociation[] = [];
  inwards: ProjectInward[] = [];
  notes: ProjectNote[] = [];
  bills: any[] = [];
  companyID?: number;
  company?: Company;
  landscapeArea: number = 0;
  facadeArea: number = 0;
  interiorArea: number = 0;
  segment?: string;
  typology?: string;
  hsn?: string;
  stateCode?: string = "27";
  stages: ProjectStage[] = [];
  parentID?: number;
  teamID?: number;
  workOrders: ProjectWorkOrder[] = [];
  followUps: ProjectFollowUp[] = [];
  scopeOfWork?: string;
//   officeLocation?: string;
// siteLocation?: string;

officeLocations?: string[];
siteLocations?: string[];

  constructor(init?: Partial<Project>) {
    super(init);
    Object.assign(this, init);
  }
}

export class ProjectAttachment extends BaseBlobEntity {
  projectID!: number;
  title?: string;
  receivedFromContactName?: string;
  receivedFromContactID?: number;
  receivedDate?: Date;
  children?: ProjectAttachment[] = []; // for storing nested items
  level?: number = 0;
  constructor(init?: Partial<ProjectAttachment>) {
    super(init);
    Object.assign(this, init);
  }
}

export class ProjectFollowUp extends BaseEntity {
  projectID!: number;
  dueDate?: Date;
  comment?: string;
}

export class ProjectStagesAnalysis {
  projectID!: number;
  title!: string;
  code!: string;
  statusFlag!: number;
  statusValue?: string;
  typology?: string;
  contractStartDate!: Date;
  contractCompletionDate !: Date;
  clientContact?: string;
  fee!: number;
  workPendingPercentage!:number;
  workCompletedPercentage!:number;
  billedPercentage!:number;
  paymentReceivedPercentage!:number;
  workPendingAmount!:number;
  workCompletedAmount!:number;
  billedAmount!:number;
  paymentReceivedAmount!:number;
  stages: StageAnalysisDto[] = [];
}

export class StageAnalysisDto {
  projectID!: number;
  title!: string;
  statusFlag!: number;
  statusValue!: string;
  percentage!: number;
  targetDate!: Date;
  billingDate!: Date;
  paymentReceivedDate!: Date;
}
