import { WFStage } from '../../shared/models/wf-stage';
import { AssessmentDto } from '../../shared/models/assessment-dto';
import { TimeEntryDto } from '../../shared/models/time-entry-dto';
import { BaseBlobEntity, BaseEntity } from 'src/app/shared/models/base-entity.model';
import { Contact } from 'src/app/contact/models/contact';

export class WFTask extends BaseEntity
{

  contactID!: number;
  contact!: Contact;
  assignerContactID!: number;
  assigner!: Contact;
  title!: string;
  subtitle!: string;
  wfStageCode!: string;
  startDate: Date = new Date();
  completedDate: Date = new Date();
  dueDate: Date = new Date();
  followUpDate: Date | null = new Date();
  comment!: string;
  outcomeFlag!: number;
  stageIndex!: number;
  stageRevision!: number;
  history!: string;
  timeEntries: TimeEntryDto[] = [];
  assessments: AssessmentDto[] = [];
  assessmentRemark!: string;
  attachments: WFTaskAttachment[] = [];
  mHrAssigned!: number;
  mHrConsumed!: number;
  assessmentPoints!: number;
  mHrAssessed!: number;
  vHrAssigned!: number;
  vHrAssessed!: number;
  vHrAssignedCost!: number;
  vHrAssessedCost!: number;
  vHrConsumed!: number;
  vHrConsumedCost!: number;
  isDelayed: boolean = false;
  isPreAssignedTimeTask: boolean = false;
  isAssessmentRequired: boolean = false;
  previousStageCode!: string;
  previousStageRevision: number = 0;
  previousTaskID: number = 0;
  isShowAlert: boolean = false;
  alertMessage!: string;
  wfStage: WFStage = new WFStage();
  projectID!: number;
  priority!:string;

  constructor(entity: string, entityID: number, startdate?: Date)
  {
    super();
    this.timeEntries = [];
    this.assessments = [];
    this.attachments = [];
    this.startDate = new Date();
    this.entity = entity;
    this.entityID = entityID;
    if (startdate)
    {
      this.startDate = startdate
    }
  }
}

export class WFTaskAttachment extends BaseBlobEntity
{
  wfTaskID: number = 0;

  constructor(options?: {
    wfTaskID: number,
    filename: string,
    uid: string,
    url: string,
    size: number,
    guidname: string,
    id: number,
    searchTags: string[],
    description: string,
    orderFlag: number,
    typeFlag: number,
    statusFlag: number,
    entity: string,
    entityID: number,
    entityTitle: string,
    isDeleted: boolean,
    attributes: any[],
    categories: string[],
    blobPath: string,
    thumbUrl: string,
    originalUrl: string
  })
  {
    super(options);
    if (options)
    {
      this.wfTaskID = options.wfTaskID;
    }
  }
}


export class TaskAction
{
  taskID!: number;
  outcomeFlag: number = 0;
  comment?: string;
  statusFlag: number = 0;
  action?: string;
  followUpDate?: Date;
}