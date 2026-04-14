import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable()
export class AppConfig {
  public readonly origin = environment.origin;
  public readonly angularPath = environment.angularPath;
  public readonly apiEndpoint = environment.apiPath;

  public readonly client_id = 'angular';


  public readonly apiAppSettings = this.apiEndpoint + '/AppSettingMaster';
  public readonly apiAuth = this.apiEndpoint + '/Auth';
  public readonly apiCompany = this.apiEndpoint + '/Company';
  public readonly apiStatusMasters = this.apiEndpoint + '/StatusMaster';
  public readonly apiTypeMasters = this.apiEndpoint + '/TypeMaster';
  public readonly apiAzureBlobsUtility = this.apiEndpoint + '/AzureBlobsUtility';
  public readonly apiUserSessions = this.apiEndpoint + '/LoginSession';

  //ASSET
  public readonly apiAsset = this.apiEndpoint + '/Asset';
  public readonly apiAssetVendor = this.apiEndpoint + '/AssetVendor';
  public readonly apiAssetAttachment = this.apiEndpoint + '/AssetAttachment';
  public readonly apiAssetAttribute = this.apiEndpoint + '/AssetAttribute';
  public readonly apiAssetAttributeMaster = this.apiEndpoint + '/AssetAttributeMaster';
  public readonly apiAssetLink = this.apiEndpoint + '/AssetLink';
  public readonly apiAssetSchedule = this.apiEndpoint + '/AssetSchedule';
  public readonly apiAssetScheduleAttachment = this.apiEndpoint + '/AssetScheduleAttachment';
  public readonly apiAssetScheduleComponent = this.apiEndpoint + '/AssetScheduleComponent';

  //CONTACT
  public readonly apiContacts = this.apiEndpoint + '/Contact';
  public readonly apiContactAssociations = this.apiEndpoint + '/ContactAssociation';
  public readonly apiContactAttachments = this.apiEndpoint + '/ContactAttachment';
  public readonly apiContactAppointments = this.apiEndpoint + '/ContactAppointment';
  public readonly apiContactAppointmentAttachments = this.apiEndpoint + '/ContactAppointmentAttachment';
  public readonly apiContactTeam = this.apiEndpoint + '/ContactTeam';
  public readonly apiContactTeamMember = this.apiEndpoint + '/ContactTeamMember';
  public readonly apiContactWorkOrder = this.apiEndpoint + '/ContactWorkOrder';
  public readonly apiContactWorkOrderAttachment = this.apiEndpoint + '/ContactWorkOrderAttachment';
  public readonly apiContactWorkOrderPayment = this.apiEndpoint + '/ContactWorkOrderPayment';
  public readonly apiContactWorkOrderPaymentAttachment = this.apiEndpoint + '/ContactWorkOrderPaymentAttachment';

  //ACTIVITY
  public readonly apiContactActivities = this.apiEndpoint + '/Activity';

  //APPOINTMENT
  public readonly apiAppointments = this.apiEndpoint + '/Appointment';

  //TODO
  public readonly apiTodoes = this.apiEndpoint + '/Todo';
  public readonly apiTodoAgendas = this.apiEndpoint + '/TodoAgenda';
  public readonly apiTodoAttachments = this.apiEndpoint + '/TodoAttachment';

  //TASK
  public readonly apiWFTasks = this.apiEndpoint + '/WFTask';
  public readonly apiWFStages = this.apiEndpoint + '/WFStage';
  public readonly apiWFTaskAttachments = this.apiEndpoint + '/WFTaskAttachment';
  public readonly apiTimeEntries = this.apiEndpoint + '/TimeEntry';
  public readonly apiAssessmentMasters = this.apiEndpoint + '/AssessmentMaster';
  public readonly apiAssessments = this.apiEndpoint + '/Assessment';
  public readonly apiWorkflow = this.apiEndpoint + '/workflow';

  //PERMISSION
  public readonly apiPermissionGroup = this.apiEndpoint + '/PermissionGroup';
  public readonly apiUserPermissionGroupMap = this.apiEndpoint + '/UserPermissionGroupMap';

  //PROJECT
  public readonly apiProjects = this.apiEndpoint + '/Project';
  public readonly apiProjectAssociations = this.apiEndpoint + '/ProjectAssociation';
  public readonly apiProjectAttachments = this.apiEndpoint + '/ProjectAttachment';
  public readonly apiProjectInwards = this.apiEndpoint + '/ProjectInward';
  public readonly apiProjectInwardAttachments = this.apiEndpoint + '/ProjectInwardAttachment';
  public readonly apiProjectNotes = this.apiEndpoint + '/ProjectNote';
  public readonly apiProjectStage = this.apiEndpoint + '/ProjectStage';
  public readonly apiProjectStageMaster = this.apiEndpoint + '/ProjectStageMaster';
  public readonly apiProjectBill = this.apiEndpoint + '/ProjectBill';
  public readonly apiProjectBillPayment = this.apiEndpoint + '/ProjectBillPayment';
  public readonly apiProjectBillFollowUp = this.apiEndpoint + '/ProjectBillFollowUp';
  public readonly apiProjectBillPaymentAttachment = this.apiEndpoint + '/ProjectBillPaymentAttachment';
  public readonly apiProjectWorkOrder = this.apiEndpoint + '/ProjectWorkOrder';
  public readonly apiProjectWorkOrderServiceAmount = this.apiEndpoint + '/ProjectWorkOrderServiceAmount';
  public readonly apiProjectWorkOrderAttachment = this.apiEndpoint + '/ProjectWorkOrderAttachment';
  public readonly apiProjectTeam = this.apiEndpoint + '/ProjectTeam';

  //Meeting
  public readonly apiMeeting = this.apiEndpoint + '/Meeting';
  public readonly apiMeetingAgenda = this.apiEndpoint + '/MeetingAgenda';
  public readonly apiMeetingVoucher = this.apiEndpoint + '/MeetingVoucher';
  public readonly apiMeetingVoucherAttachment = this.apiEndpoint + '/MeetingVoucherAttachment';
  public readonly apiMeetingAttendee = this.apiEndpoint + '/MeetingAttendee';
  public readonly apiMeetingAttachment = this.apiEndpoint + '/MeetingAttachment';
  public readonly apiMeetingAgendaAttachment = this.apiEndpoint + '/MeetingAgendaAttachment';

  //SiteVisit
  public readonly apiSitevisit = this.apiEndpoint + '/Sitevisit';
  public readonly apiSitevisitAgenda = this.apiEndpoint + '/SitevisitAgenda';
  public readonly apiSitevisitAttendee = this.apiEndpoint + '/SitevisitAttendee';
  public readonly apiSitevisitAgendaAttachment = this.apiEndpoint + '/SitevisitAgendaAttachment';

  //RequestTicket
  public readonly apiRequestTicket = this.apiEndpoint + '/RequestTicket';
  public readonly apiRequestTicketAssignee = this.apiEndpoint + '/RequestTicketAssignee';
  public readonly apiRequestTicketAttachment = this.apiEndpoint + '/RequestTicketAttachment';

  //Leave
  public readonly apiLeave = this.apiEndpoint + '/Leave';
  public readonly apiHolidayMaster = this.apiEndpoint + '/HolidayMaster';
  public readonly apiLeaveAttachments = this.apiEndpoint + '/LeaveAttachment';

  //WorkOrder
  public readonly apiWorkOrder = this.apiEndpoint + '/WorkOrder';
  public readonly apiWorkOrderMaster = this.apiEndpoint + '/WorkOrderMaster';
  public readonly apiWorkOrderMasterStage = this.apiEndpoint + '/WorkOrderMasterStage';
  public readonly apiWorkOrderAttachment = this.apiEndpoint + '/WorkOrderAttachment';
  public readonly apiWorkOrderStage = this.apiEndpoint + '/WorkOrderStage';

  //WebPushSubscription
  public readonly apiWebPushSubscription = this.apiEndpoint + '/WebPushSubscription';

  public readonly IMAGE_LIBRARY_ENTITY_TYPEFLAG_REFERENCE = 0;
  public readonly IMAGE_LIBRARY_ENTITY_TYPEFLAG_PHOTOSHOP = 1;

  public readonly companyCountry = 'India';
  public readonly companyState = 'Maharashtra';
  public readonly gstStartDate = '07/01/2017';
  public readonly DATE_FORMAT = 'dd MMM y';
  public readonly DATETIME_FORMAT = 'dd MMM y HH:mm';

  public readonly WFTASK_STATUS_0 = 'PENDING';
  public readonly WFTASK_STATUS_1 = 'COMPLETED';
  public readonly WFTASK_STATUS_2 = 'INPROGRESS';
  public readonly WFTASK_STATUS_3 = 'PAUSED';

  public readonly TASK_STAGE_TODO_ASSIGNMENT = 'TODO_ACCEPT';
  public readonly TASK_STAGE_TODO_WORK = 'TODO_WORK';
  public readonly TASK_STAGE_TODO_REVIEW = 'TODO_REVIEW';
  public readonly TASK_STAGE_TODO_RE_ASSIGN = 'TODO_RE_ASSIGN';

  public readonly MOBILE_BREAKPOINT_SCREEN_WIDTH = 768;

  public readonly WFTASK_STATUS_FLAG_COMPLETED = 1;
  public readonly WFTASK_STATUS_FLAG_PAUSED = 3;
  public readonly WFTASK_STATUS_FLAG_PENDING = 0;
  public readonly WFTASK_STATUS_FLAG_STARTED = 2;
  public readonly WFTASK_STATUS_FLAG_UNATTENDED = -1;
  public readonly WFTASK_DISABLE_PAUSE_TIMER = 15; //Minutes

  public readonly TODO_STATUS_FLAG_ACTIVE = 0;
  public readonly TODO_STATUS_FLAG_COMPLETED = 1;
  public readonly TODO_STATUS_FLAG_DROPPED = 2;
  public readonly TODO_PRIORITY_HIGH = 'HIGH';
  public readonly TODO_PRIORITY_NORMAL = 'NORMAL';
  public readonly TODO_PRIORITY_LOW = 'LOW';
  public readonly CONTACT_TYPE_FLAG_GENERAL = 0;
  public readonly CONTACT_TYPE_FLAG_EMPLOYEE = 1;
  public readonly TODO_AGENDA_STATUS_FLAG_PENDING = 0;
  public readonly TODO_AGENDA_STATUS_FLAG_COMPLETED = 1;

  public readonly PROJECT_ATTACHMENTS_TYPE_FLAG_PHOTOS = 0;

  public readonly PROJECT_INWARDS_TYPE_FLAG_INWARDS = 0;
  public readonly PROJECT_INWARDS_TYPE_FLAG_PHOTOS = 1;
  public readonly PROJECT_INWARDS_TYPE_FLAG_REPORTS = 2;

  public readonly PROJECT_STATUS_FLAG_LOST = -2;
  public readonly PROJECT_STATUS_FLAG_DISCARD = -1;
  public readonly PROJECT_STATUS_FLAG_INQUIRY = 0;
  public readonly PROJECT_STATUS_FLAG_PREPROPOSAL = 1;
  public readonly PROJECT_STATUS_FLAG_INPROGRESS = 2;
  public readonly PROJECT_STATUS_FLAG_ONHOLD = 3;
  public readonly PROJECT_STATUS_FLAG_COMPLETED = 4;
  public readonly PROJECT_STATUS_FLAG_DUE = 5;
  public readonly PROJECT_STATUS_FLAG_LOCKED = 6;

  public readonly PROJECT_STAGE_TYPE_FLAG_WORK = 0;
  public readonly PROJECT_STAGE_TYPE_FLAG_PAYMENT = 1;

  public readonly PROJECT_STAGE_STATUS_FLAG_PENDING = 0;
  public readonly PROJECT_STAGE_STATUS_FLAG_COMPLETED = 1;
  public readonly PROJECT_STAGE_STATUS_FLAG_BILLED = 2;
  public readonly PROJECT_STAGE_STATUS_FLAG_PAYMENT_RECEIVED = 3;
  public readonly PROJECT_STAGE_STATUS_FLAG_UNDER_BILLING = 4;

  public readonly PROJECT_STAGE_UPDATE_LIMIT = 5

  public readonly PROJECT_DOCUMENT_TYPEFLAG = 0;
  public readonly PROJECT_DRAWING_TYPEFLAG = 1;

  public readonly PROJECT_BILL_TYPEFLAG_PROFORMA_INVOICE = 0;
  public readonly PROJECT_BILL_TYPEFLAG_TAX_INVOICE = 1;

  public readonly PROJECT_DMS_MAX_LEVEL = 4;

  public readonly TEAM_APPOINTMENT_STATUS_APPOINTED = 0;
  public readonly TEAM_APPOINTMENT_STATUS_RESIGNED = 1;
  public readonly TEAM_APPOINTMENT_STATUS_ONBREAK = 2;
  public readonly TEAM_APPOINTMENT_STATUS_LEFT_WIHOUT_INFORMING = 3;

  public readonly ROUTE_LOGIN = '/auth/login';
  public readonly ROUTE_CHANGE_PASSWORD = '/auth/change-password';
  public readonly ROUTE_COCKPIT = '/cockpit';
  public readonly ROUTE_CONTACT_LIST = '/contact-list';
  public readonly ROUTE_PROJECT_LIST = '/project-list';
  public readonly ROUTE_LEAVE_LIST = '/leave-list';
  public readonly ROUTE_TODO_LIST = '/todo-list';
  public readonly ROUTE_TEAM_LIST = '/team-list';
  public readonly ROUTE_WFTASK_LIST = '/wftask-list';
  public readonly ROUTE_MEETING_LIST = '/meeting-list';
  public readonly ROUTE_SITE_VISIT_LIST = '/sitevisit-list';
  public readonly ROUTE_REQUEST_TICKET_LIST = '/request-ticket-list';
  public readonly ROUTE_SESSIONS = '/auth/user-sessions';

  public readonly NAMEOF_ENTITY_WFTASK = 'WFTask';
  public readonly NAMEOF_ENTITY_CONTACT = 'Contact';
  public readonly NAMEOF_ENTITY_CONTACT_APPOINTMENT = 'ContactAppointment';
  public readonly NAMEOF_ENTITY_CONTACT_WORK_ORDER = 'ContactWorkOrder';
  public readonly NAMEOF_ENTITY_CONTACT_WORK_ORDER_PAYMENT = 'ContactWorkOrderPayment';
  public readonly NAMEOF_ENTITY_TODO = 'Todo';
  public readonly NAMEOF_ENTITY_TEAM_MEMBER = 'Employee';
  public readonly NAMEOF_ENTITY_PROJECT = 'Project';
  public readonly NAMEOF_ENTITY_PROJECTSTAGE = 'ProjectStage';
  public readonly NAMEOF_ENTITY_PROJECT_INWARD = 'ProjectInward';
  public readonly NAMEOF_ENTITY_TIMEENTRY = 'TimeEntry';
  public readonly NAMEOF_ENTITY_PROJECT_ASSOCIATION = 'ProjectAssociation';
  public readonly NAMEOF_ENTITY_PROJECT_ATTACHMENT = 'ProjectAttachment';
  public readonly NAME_OF_ENTITY_PROJECT_WORK_ORDER = 'ProjectWorkOrder';
  public readonly NAMEOF_ENTITY_MEETING = 'Meeting';
  public readonly NAMEOF_ENTITY_MEETING_AGENDA = 'MeetingAgenda';
  public readonly NAMEOF_ENTITY_MEETING_VOUCHER = 'MeetingVoucher';
  public readonly NAMEOF_ENTITY_WORKORDER = 'WorkOrder';
  public readonly NAME_OF_ENTITY_ASSET = "Asset";
  public readonly NAME_OF_ENTITY_ASSET_SCHEDULE = "AssetSchedule";

  public readonly NAMEOF_ENTITY_SITE_VISIT = 'Sitevisit';
  public readonly NAMEOF_ENTITY_SITE_VISIT_AGENDA = 'SitevisitAgenda';

  public readonly NAMEOF_ENTITY_REQUEST_TICKET = 'RequestTicket';
  public readonly NAME_OF_ENTITY_PROJECT_Bill = "ProjectBill";
  public readonly NAME_OF_ENTITY_PROJECT_Bill_PAYMMENT = "ProjectBillPayment";
  public readonly NAMEOF_ENTITY_LEAVE = 'Leave';

  public readonly PRESET_COMPANY_VHR_COST = 'COMPANY_VHR_COST';
  public readonly PRESET_BLOB_CONTAINER_ATTACHMENTS = "BLOB_CONTAINER_ATTACHMENTS";
  public readonly PRESET_PROJECT_SEGMENT_OPTIONS = "PROJECT_SEGMENT_OPTIONS";
  public readonly PRESET_PROJECT_TYPOLOGY_OPTIONS = "PROJECT_TYPOLOGY_OPTIONS";
  public readonly PRESET_PROJECT_ASSOCIATION_GROUPS = "PROJECT_ASSOCIATION_GROUPS";
  public readonly PRESET_CONTACT_CATEGORY_OPTIONS = "CONTACT_CATEGORY_OPTIONS";
  public readonly TEAM_MONTHLY_EXPECTED_MHR = "TEAM_MONTHLY_EXPECTED_MHR";
  public readonly PRESET_REQUEST_TICKET_PURPOSE_OPTIONS = "REQUEST_TICKET_PURPOSE_OPTIONS";
  public readonly PRESET_EMPLOYEE_DOCUMENT_CATEGORY_OPTIONS = "EMPLOYEE_DOCUMENT_CATEGORY_OPTIONS";
  public readonly PRESET_PROJECT_DOCUMENT_CATEGORY_OPTIONS = "PROJECT_DOCUMENT_CATEGORY_OPTIONS";
  public readonly PRESET_PROJECT_DRAWING_CATEGORY_OPTIONS = "PROJECT_DRAWING_CATEGORY_OPTIONS";
  public readonly PRESET_PROJECT_INWARD_CATEGORY_OPTIONS = "PROJECT_INWARD_CATEGORY_OPTIONS";
  public readonly PROJECT_WORKORDER_SERVICE = "PROJECT_WORKORDER_SERVICE";
  public readonly PRESET_TDS = "TAX_TDS";
  public readonly PRESET_IGST = "TAX_IGST";
  public readonly PRESET_CGST = "TAX_CGST";
  public readonly PRESET_SGST = "TAX_SGST";
  public readonly PRESET_LEAVE_TYPE = "LEAVE_TYPE";
  public readonly PRESET_MEETING_UPDATE_ALLOW_DURATION = "MEETING_UPDATE_ALLOW_DURATION";
  public readonly PRESET_SITE_VISIT_UPDATE_ALLOW_DURATION = "SITE_VISIT_UPDATE_ALLOW_DURATION";
  public readonly PRESET_ASSET_CATEGORY_OPTIONS = "ASSET_CATEGORY_OPTIONS";

  public readonly MEETING_MINUTES_GAP = 15;
  public readonly MEETING_MIN_TIME = '00:00';
  public readonly MEETING_MAX_TIME = '24:00';

  public readonly MEETING_TYPEFLAG_MEETING = 0;
  public readonly MEETING_TYPEFLAG_INSPECTION = 2;
  public readonly MEETING_TYPEFLAG_CNOTE = 1;

  public readonly MEETING_ATTENDEE_TYPEFLAG_TO = 0;
  public readonly MEETING_ATTENDEE_TYPEFLAG_CC = 1;

  public readonly MEETING_STATUSFLAG_CANCELLED = -1;
  public readonly MEETING_STATUSFLAG_PENDING = 0;
  public readonly MEETING_STATUSFLAG_SENT = 1;
  public readonly MEETING_STATUSFLAG_POSTPONED = 2;
  public readonly MEETING_STATUSFLAG_HOLD = 3;
  public readonly MEETING_STATUSFLAG_FOLLOWUP = 4;

  public readonly MEETING_ATTENDEE_INTERNAL = 0;
  public readonly MEETING_ATTENDEE_EXTERNAL = 1;
  public readonly MEETING_ATTENDEE_CONTACT_PERSON = 2;

  public readonly MEETING_AGENDA_STATUSFLAG_PENDING = 0;
  public readonly MEETING_AGENDA_STATUSFLAG_RESOLVED = 1;

  //Sitevisit
  public readonly SITE_VISIT_MINUTES_GAP = 15;
  public readonly SITE_VISIT_MIN_TIME = '00:00';
  public readonly SITE_VISIT_MAX_TIME = '24:00';

  public readonly SITE_VISIT_TYPEFLAG_SITE_VISIT = 0;
  public readonly SITE_VISIT_TYPEFLAG_INSPECTION = 2;
  public readonly SITE_VISIT_TYPEFLAG_CNOTE = 1;

  public readonly SITE_VISIT_ATTENDEE_TYPEFLAG_TO = 0;
  public readonly SITE_VISIT_ATTENDEE_TYPEFLAG_CC = 1;

  public readonly SITE_VISIT_STATUSFLAG_SCHEDULED = 0;
  public readonly SITE_VISIT_STATUSFLAG_ATTENDED = 1;
  public readonly SITE_VISIT_STATUSFLAG_SENT = 2;

  public readonly SITE_VISIT_AGENDA_STATUSFLAG_PENDING = 0;
  public readonly SITE_VISIT_AGENDA_STATUSFLAG_RESOLVED = 1;


  public readonly REQUEST_TICKET_STATUSFLAG_ACTIVE = 0;
  public readonly REQUEST_TICKET_STATUSFLAG_CLOSED = 1;

  public readonly REQUEST_TICKET_ASSIGNEE_TYPEFLAG_TO = 0;
  public readonly REQUEST_TICKET_ASSIGNEE_TYPEFLAG_CC = 1;
  public readonly REQUEST_TICKET_ASSIGNEE_TYPEFLAG_BCC = 2;

  public readonly LEAVE_TYPEFLAG_CASUAL = 0;
  public readonly LEAVE_TYPEFLAG_SICK = 1;
  public readonly LEAVE_TYPEFLAG_EMERGENCY = 1;
  // public readonly LEAVE_TYPEFLAG_APPROVED_HALFDAY = 2;
  // public readonly LEAVE_TYPEFLAG_EMERGENCY_HALFDAY = 3;
  public readonly LEAVE_TYPEFLAG_CASUAL_FIRST_HALF = 2;
  public readonly LEAVE_TYPEFLAG_CASUAL_SECOND_HALF = 3;
  public readonly LEAVE_TYPEFLAG_EMERGENCY_FIRST_HALF = 4;
  public readonly LEAVE_TYPEFLAG_EMERGENCY_SECOND_HALF = 5;

  public readonly LEAVE_STATUSFLAG_PENDING = 0;
  public readonly LEAVE_STATUSFLAG_APPROVED = 1;
  public readonly LEAVE_STATUSFLAG_REJECTED = -1;

  public readonly TASK_STAGE_MEETING_CLOSE = 'MEETING_CLOSE';
  public readonly TASK_STAGE_MEETING_TRAVEL_TIME = 'MEETING_TRAVEL_TIME';
  public readonly TASK_STAGE_MEETING_PREPARE_MINUTES = 'MEETING_PREPARE_MINUTES';

  public readonly TASK_STAGE_SITE_VISIT_CLOSE = 'SITE_VISIT_CLOSE';
  public readonly TASK_STAGE_SITE_VISIT_TRAVEL_TIME = 'SITE_VISIT_TRAVEL_TIME';

  public readonly TIMELINE_START_TIME = '09:00';
  public readonly TIMELINE_END_TIME = '18:00';

  readonly EMAIL_REGEX: RegExp = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/g;

  public readonly INPUT_UPLOAD_FILE_LIMITER = 15;

   public readonly ASSET_STATUS_FLAG_INUSE = 0;
  public readonly ASSET_STATUS_FLAG_DISCARDED = 1;
  public readonly ASSET_STATUS_FLAG_FORREPAIRS = 2;

  public readonly ASSET_SCHEDULE_MAINTENANCE_TYPEFLAG = 0;
  public readonly ASSET_SCHEDULE_ISSUE_TYPEFLAG = 1;

  public readonly ASSET_SCHEDULE_ISSUE_PENDING = 0;
  public readonly ASSET_SCHEDULE_ISSUE_APPROVED = 1;
  public readonly ASSET_SCHEDULE_ISSUE_VERIFIED = 2;

   public readonly ASSET_INPUTTYPE_OPTIONS = [
    'SINGLE-LINE', 'MULTI-LINE', 'DATE', 'NUMBER', 'CURRENCY', 'SINGLE-CHOICE', 'MULTI-CHOICE'
  ]

  public readonly ASSET_ATTRIBUTE_INPUT_TYPE_SINGLE_LINE = "SINGLE-LINE";
  public readonly ASSET_ATTRIBUTE_INPUT_TYPE_MULTI_LINE = "MULTI-LINE";
  public readonly ASSET_ATTRIBUTE_INPUT_TYPE_DATE = "DATE";
  public readonly ASSET_ATTRIBUTE_INPUT_TYPE_NUMBER = "NUMBER";
  public readonly ASSET_ATTRIBUTE_INPUT_TYPE_CURRENCY = "CURRENCY";
  public readonly ASSET_ATTRIBUTE_INPUT_TYPE_SINGLE_CHOICE = "SINGLE-CHOICE";
  public readonly ASSET_ATTRIBUTE_INPUT_TYPE_MULTI_CHOICE = "MULTI-CHOICE";

  public readonly ASSET_ATTACHMENT_TYPEFLAG_IMAGE = 0;
  public readonly ASSET_ATTACHMENT_TYPEFLAG_OTHER = 1;
}
