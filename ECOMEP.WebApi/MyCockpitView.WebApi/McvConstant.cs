namespace MyCockpitView.WebApi;

public class McvConstant
{
    public static readonly string EMAIL_REGEX = @"(\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*)";
    public static readonly string PERMISSION_MASTER = "MASTER";
    public static readonly string PERMISSION_LEAVE_SPECIAL_EDIT = "LEAVE_SPECIAL_EDIT";
    public static readonly string PERMISSION_LEAVE_MASTER = "LEAVE_MASTER";
    public static readonly string VIDEO_FILE_EXTENSIONS = ".mp4,.webm,.avi,.mov,.mkv,.wmv,.flv";
    public static readonly string IMAGE_FILE_EXTENSIONS = ".png,.jpg,.jpeg,.webp";


    //public static readonly string BLOB_CONTAINER_MEETING_ATTACHMENTS = "meetingattachments";
    //public static readonly string BLOB_CONTAINER_SUBMISSIONS = "submissions";
    //public static readonly string BLOB_CONTAINER_SUBMISSION_ATTACHMENTS = "submissionattachments";


    public static readonly string LEAVE_HOLIDAY = "LEAVE_HOLIDAY";
    public static readonly string BLOB_CONTAINER_ATTACHMENTS = "BLOB_CONTAINER_ATTACHMENTS";
    public static readonly string AZURE_STORAGE_KEY = "AZURE_STORAGE_KEY";
    public static readonly string AZURE_STORAGE_ACCOUNT = "AZURE_STORAGE_ACCOUNT";
    public static readonly string COMPANY_ADDRESS = "COMPANY_ADDRESS";
    public static readonly string COMPANY_PAN = "COMPANY_PAN";
    public static readonly string DATE_FORMAT = "DATE_FORMAT";
    public static readonly string DATE_FORMAT_WITH_TIME = "DATE_FORMAT_WITH_TIME";
    public static readonly string DEVMODE = "DEVMODE";
    public static readonly string DEVMODE_EMAIL_TO = "DEVMODE_EMAIL_TO";
    public static readonly string OFFICE_CLOSE_TIME = "OFFICE_CLOSE_TIME";
    //public static readonly string OFFICE_END_MINUTES_UTC = "OFFICE_END_MINUTES_UTC";
    public static readonly string OFFICE_OPEN_TIME = "OFFICE_OPEN_TIME";
    //public static readonly string OFFICE_START_MINUTES_UTC = "OFFICE_START_MINUTES_UTC";
    public static readonly string SENDGRID_KEY = "SENDGRID_KEY";
    public static readonly string TAX_CGST = "TAX_CGST";
    public static readonly string TAX_GST = "TAX_GST";
    public static readonly string TAX_IGST = "TAX_IGST";
    public static readonly string TAX_PROFESSIONALTAX = "TAX_PROFESSIONALTAX";
    public static readonly string TAX_PROFESSIONALTAX_LASTMONTH = "TAX_PROFESSIONALTAX_LASTMONTH";
    //public static readonly string TAX_SERVICETAX = "TAX_SERVICETAX";
    public static readonly string TAX_SGST = "TAX_SGST";
    public static readonly string TAX_TDS = "TAX_TDS";
    public static readonly string WFTASK_DUEDATE_EXTEND_DURATION = "WFTASK_DUEDATE_EXTEND_DURATION";
    public static readonly string WFTASK_FOLLOWUP_DURATION = "WFTASK_FOLLOWUP_DURATION";
    public static readonly string RDLC_PROCESSOR_API = "RDLC_PROCESSOR_API";
    //public static readonly string SMTP_SERVER = "SMTP_SERVER";
    //public static readonly string SMTP_PORT = "SMTP_PORT";
    //public static readonly string SMTP_USERNAME = "SMTP_USERNAME";
    //public static readonly string SMTP_PASSWORD = "SMTP_PASSWORD";
    //public static readonly string MICRO_MAILKIT_API = "MICRO_MAILKIT_API";
    //public static readonly string MICRO_MAILKIT_API_KEY = "MICRO_MAILKIT_API_KEY";
    //public static readonly string COMPANY_MSME_NO = "COMPANY_MSME_NO";
    //public static readonly string COMPANY_HSN_NO = "COMPANY_HSN_NO";
    //public static readonly string COMPANY_GST_NO = "COMPANY_GST_NO";
    public static readonly string APP_LOGO_URL = "APP_LOGO_URL";
    public static readonly string IMAGE_PROCESSOR_RESIZE_API = "IMAGE_PROCESSOR_RESIZE_API";

    public static readonly string RDLC_REPORT_CONTAINER_URL = "RDLC_REPORT_CONTAINER_URL";
    public static readonly string TEAM_MONTHLY_EXPECTED_MHR = "TEAM_MONTHLY_EXPECTED_MHR";
    public static readonly string MHR_PER_DAY = "MHR_PER_DAY";

    public static readonly string PDF_COMBINE_API = "PDF_COMBINE_API";
    public static readonly string PDF_COMBINE_BLOB_API = "PDF_COMBINE_BLOB_API";
    public static readonly string LOGIN_SESSION_EXPIRY_MINUTES = "LOGIN_SESSION_EXPIRY_MINUTES";
    public static readonly string LOGIN_OTP_EXPIRY_MINUTES = "LOGIN_OTP_EXPIRY_MINUTES";
    public static readonly string LOGIN_ALLOWED_COUNT = "LOGIN_ALLOWED_COUNT";
    public static readonly string LOGIN_OTP_ENABLED = "LOGIN_OTP_ENABLED";
    public static readonly string LOGIN_OTP_SENDER_ADDRESS = "LOGIN_OTP_SENDER_ADDRESS";
    public static readonly string LOGIN_OTP_SENDER_NAME = "LOGIN_OTP_SENDER_NAME";
    public static readonly string ZOHO_MAIL_API_KEY = "ZOHO_MAIL_API_KEY";
    public static readonly string ZOHO_MAIL_API = "ZOHO_MAIL_API";


    public static readonly string AGENDA_FOLLOW_UP_EMAIL_SENDER_ID = "AGENDA_FOLLOWUP_EMAIL_SENDER_ID";
    public static readonly string AGENDA_FOLLOW_UP_EMAIL_SENDER_NAME = "AGENDA_FOLLOWUP_EMAIL_SENDER_NAME";
    public static readonly string AGENDA_FOLLOW_UP_EMAIL_CC = "AGENDA_FOLLOWUP_EMAIL_CC";
    public static readonly string AGENDA_MAX_REMINDER_COUNT_FOR_ESCALATION = "AGENDA_MAX_REMINDER_COUNT_FOR_ESCALATION";
    public static readonly string AGENDA_MAX_REMINDER_COUNT_FOR_DISCARD = "AGENDA_MAX_REMINDER_COUNT_FOR_DISCARD";

    public static readonly string AGENDA_REPORT_MESSAGE = "AGENDA_REPORT_MESSAGE";
    public static readonly string AGENDA_REPORT_EMAIL_SENDER_ID = "AGENDA_REPORT_EMAIL_SENDER_ID";
    public static readonly string AGENDA_REPORT_EMAIL_SENDER_NAME = "AGENDA_REPORT_EMAIL_SENDER_NAME";

    public static readonly string MEETING_EMAIL_SENDER_ID = "MEETING_EMAIL_SENDER_ID";
    public static readonly string MEETING_EMAIL_SENDER_NAME = "MEETING_EMAIL_SENDER_NAME";
    public static readonly string MEETING_EMAIL_CC = "MEETING_EMAIL_CC";
    public static readonly string MEETING_MINUTES_URL_ROOT = "MEETING_MINUTES_URL_ROOT";
    public static readonly string MEETING_UPDATE_ALLOW_DURATION = "MEETING_UPDATE_ALLOW_DURATION";

    public static readonly string SITE_VISIT_EMAIL_SENDER_ID = "SITE_VISIT_EMAIL_SENDER_ID";
    public static readonly string SITE_VISIT_EMAIL_SENDER_NAME = "SITE_VISIT_EMAIL_SENDER_NAME";
    public static readonly string SITE_VISIT_EMAIL_CC = "SITE_VISIT_EMAIL_CC";
    public static readonly string SITE_VISIT_MINUTES_URL_ROOT = "SITE_VISIT_MINUTES_URL_ROOT";
    public static readonly string SITE_VISIT_UPDATE_ALLOW_DURATION = "SITE_VISIT_UPDATE_ALLOW_DURATION";

    public static readonly string REQUEST_TICKET_EMAIL_CC = "REQUEST_TICKET_EMAIL_CC";
    public static readonly string REQUEST_TICKET_EMAIL_SENDER_ID = "REQUEST_TICKET_EMAIL_SENDER_ID";
    public static readonly string REQUEST_TICKET_EMAIL_SENDER_NAME = "REQUEST_TICKET_EMAIL_SENDER_NAME";
    public static readonly string REQUEST_TICKET_SEND_RESOLUTION_MESSAGE = "REQUEST_TICKET_SEND_RESOLUTION_MESSAGE";

    public static readonly string PUSH_NOTIFICATION_API = "PUSH_NOTIFICATION_API";
    public static readonly string PUSH_NOTIFICATION_PUBLIC_KEY = "PUSH_NOTIFICATION_PUBLIC_KEY";
    public static readonly string PUSH_NOTIFICATION_PRIVATE_KEY = "PUSH_NOTIFICATION_PRIVATE_KEY";

    public static readonly string REPORT_EMAIL_SENDER_ID = "REPORT_EMAIL_SENDER_ID";
    public static readonly string REPORT_EMAIL_SENDER_NAME = "REPORT_EMAIL_SENDER_NAME";
    public static readonly string REPORT_EMAIL_CC = "REPORT_EMAIL_CC";

    public static readonly string LEAVE_APPLICATION_DURATION = "LEAVE_APPLICATION_DURATION";
    public static readonly string LEAVE_PERMISSIBLE_EMERGENCY = "LEAVE_PERMISSIBLE_EMERGENCY";
    public static readonly string LEAVE_PERMISSIBLE_TOTAL = "LEAVE_PERMISSIBLE_TOTAL";
    public static readonly string WFH_APPLICATION_DURATION_DAYS_PER_MONTH = "WFH_APPLICATION_DURATION_DAYS_PER_MONTH";
    public static readonly string WFH_APPLICATION_PRIOR_DAYS = "WFH_APPLICATION_PRIOR_DAYS";
    public static readonly string BREAK_APPLICATION_DURATION_HOURS_PER_MONTH = "BREAK_APPLICATION_DURATION_HOURS_PER_MONTH";
    public static readonly string BREAK_APPLICATION_ALLOWED_PER_MONTH = "BREAK_APPLICATION_ALLOWED_PER_MONTH";
    public static readonly string BREAK_APPLICATION_PRIOR_DAYS = "BREAK_APPLICATION_PRIOR_DAYS";
    public static readonly string HALFDAY_APPLICATION_DURATION_HOURS_PER_MONTH = "HALFDAY_APPLICATION_DURATION_HOURS_PER_MONTH";
    public static readonly string HALFDAY_APPLICATION_ALLOWED_PER_MONTH = "HALFDAY_APPLICATION_ALLOWED_PER_MONTH";
    public static readonly string HALFDAY_APPLICATION_PRIOR_DAYS = "HALFDAY_APPLICATION_PRIOR_DAYS";
    public static readonly string REQUEST_TICKET_PROJECT_BILLING_WINDOW = "REQUEST_TICKET_PROJECT_BILLING_WINDOW";

    public static readonly string ASSET_ATTRIBUTE_INPUT_TYPE_SINGLE_LINE = "SINGLE-LINE";
    public static readonly string ASSET_ATTRIBUTE_INPUT_TYPE_MULTI_LINE = "MULTI-LINE";
    public static readonly string ASSET_ATTRIBUTE_INPUT_TYPE_DATE = "DATE";
    public static readonly string ASSET_ATTRIBUTE_INPUT_TYPE_NUMBER = "NUMBER";
    public static readonly string ASSET_ATTRIBUTE_INPUT_TYPE_CURRENCY = "CURRENCY";
    public static readonly string ASSET_ATTRIBUTE_INPUT_TYPE_SINGLE_CHOICE = "SINGLE-CHOICE";
    public static readonly string ASSET_ATTRIBUTE_INPUT_TYPE_MULTI_CHOICE = "MULTI-CHOICE";

    public static readonly int ASSET_ATTACHMENT_TYPEFLAG_IMAGE = 0;
    public static readonly int ASSET_ATTACHMENT_TYPEFLAG_OTHER = 1;

    public static readonly int ASSET_STATUS_FLAG_INUSE = 0;
    public static readonly int ASSET_STATUS_FLAG_DISCARDED = 1;
    public static readonly int ASSET_STATUS_FLAG_FORREPAIRS = 2;

    public static readonly int ASSET_SCHEDULE_TYPE_FLAG_MAINTENANCE = 0;
    public static readonly int ASSET_SCHEDULE_TYPE_FLAG_ISSUE = 1;

    public static readonly int ASSET_SCHEDULE_STATUS_FLAG_PENDING = 0;
    public static readonly int ASSET_SCHEDULE_STATUS_FLAG_COMPLETED = 1;
    public static readonly int ASSET_SCHEDULE_STATUS_FLAG_VERIFIED = 2;

    public static readonly int LEAVE_STATUSFLAG_PENDING = 0;
    public static readonly int LEAVE_STATUSFLAG_APPROVED = 1;
    public static readonly int LEAVE_STATUSFLAG_REJECTED = -1;

    public static readonly int LEAVE_TYPEFLAG_APPROVED = 0;
    public static readonly int LEAVE_TYPEFLAG_EMERGENCY = 1;
    //public static readonly int LEAVE_TYPEFLAG_APPROVED_HALFDAY = 2;
    //public static readonly int LEAVE_TYPEFLAG_EMERGENCY_HALFDAY = 3;
    public static readonly int LEAVE_TYPEFLAG_CASUAL_FIRST_HALF = 2;
    public static readonly int LEAVE_TYPEFLAG_CASUAL_SECOND_HALF = 3;
    public static readonly int LEAVE_TYPEFLAG_EMERGENCY_FIRST_HALF = 4;
    public static readonly int LEAVE_TYPEFLAG_EMERGENCY_SECOND_HALF = 5;

    public static readonly string PROJECT_FOLDERS = "PROJECT_FOLDERS";

    public static readonly string NAMEOF_ENTITY_TODO = "Todo";

    public static readonly int REQUEST_TICKET_STATUSFLAG_ACTIVE = 0;
    public static readonly int REQUEST_TICKET_STATUSFLAG_COMPLETED = 1;

    public static readonly int REQUEST_TICKET_ASSIGNEE_TO = 0;
    public static readonly int REQUEST_TICKET_ASSIGNEE_CC = 1;
    public static readonly int REQUEST_TICKET_ASSIGNEE_BCC = 2;

    public static readonly int MEETING_TYPEFLAG_MEETING = 0;
    public static readonly int MEETING_TYPEFLAG_CNOTE = 1;
    public static readonly int MEETING_TYPEFLAG_INSPECTION = 2;

    public static readonly int MEETING_ATTENDEE_TYPEFLAG_TO = 0;
    public static readonly int MEETING_ATTENDEE_TYPEFLAG_CC = 1;

    public static readonly int MEETING_STATUSFLAG_SCHEDULED = 0;
    public static readonly int MEETING_STATUSFLAG_ATTENDED = 1;
    public static readonly int MEETING_STATUSFLAG_SENT = 2;

    public static readonly int MEETING_AGENDA_STATUSFLAG_PENDING = 0;
    public static readonly int MEETING_AGENDA_STATUSFLAG_RESOLVED = 1;

    public static readonly int MEETING_ATTENDEE_INTERNAL = 0;
    public static readonly int MEETING_ATTENDEE_EXTERNAL = 1;
    public static readonly int MEETING_ATTENDEE_CONTACT_PERSON = 2;

    public static readonly int SITE_VISIT_TYPEFLAG_SITE_VISIT = 0;
    // public static readonly int SITE_VISIT_TYPEFLAG_CNOTE = 1;
    // public static readonly int SITE_VISIT_TYPEFLAG_INSPECTION = 2;

    public static readonly int SITE_VISIT_ATTENDEE_TYPEFLAG_TO = 0;
    public static readonly int SITE_VISIT_ATTENDEE_TYPEFLAG_CC = 1;

    public static readonly int SITE_VISIT_STATUSFLAG_SCHEDULED = 0;
    public static readonly int SITE_VISIT_STATUSFLAG_ATTENDED = 1;
    public static readonly int SITE_VISIT_STATUSFLAG_SENT = 2;

    public static readonly int SITE_VISIT_AGENDA_STATUSFLAG_PENDING = 0;
    public static readonly int SITE_VISIT_AGENDA_STATUSFLAG_RESOLVED = 1;

    public static readonly int CONTACT_TYPEFLAG_GENERAL = 0;
    public static readonly int CONTACT_TYPEFLAG_APPOINTED = 1;

    public static readonly int APPOINTMENT_STATUSFLAG_APPOINTED = 0;
    public static readonly int APPOINTMENT_STATUSFLAG_RESIGNED = 1;
    public static readonly int APPOINTMENT_STATUSFLAG_ONBREAK = 2;

    public static readonly int APPOINTMENT_TYPEFLAG_EMPLOYEE = 0;
    public static readonly int APPOINTMENT_TYPEFLAG_ASSOCIATE = 1;
    public static readonly int APPOINTMENT_TYPEFLAG_PARTNER = 2;

    public static readonly int TODO_STATUSFLAG_PENDING = 0;
    public static readonly int TODO_STATUSFLAG_COMPLETED = 1;
    public static readonly int TODO_STATUSFLAG_DROPPED = -1;

    public static readonly string TODO_WORK_STAGE = "TODO_WORK";

    public static readonly int WFTASK_STATUSFLAG_PENDING = 0;
    public static readonly int WFTASK_STATUSFLAG_COMPLETED = 1;
    public static readonly int WFTASK_STATUSFLAG_UNATTENDED = -1;
    public static readonly int WFTASK_STATUSFLAG_STARTED = 2;
    public static readonly int WFTASK_STATUSFLAG_PAUSED = 3;

    public static readonly int WFTASK_OUTCOME_START = 0;
    public static readonly int WFTASK_OUTCOME_PAUSE = 1;
    public static readonly int WFTASK_OUTCOME_STOP = 2;


    public static readonly int PROJECT_STATUSFLAG_ONGOING = 0;
    public static readonly int PROJECT_STATUSFLAG_ONHOLD = 1;
    public static readonly int PROJECT_STATUSFLAG_COMPLETED = 2;

    public static readonly int PROJECT_INWARD_TYPEFLAG_IN = 0;
    public static readonly int PROJECT_INWARD_TYPEFLAG_SITE_PHOTO = 1;

    public static readonly int PROJECT_BILL_TYPEFLAG_PROFORMA_INVOICE = 0;
    public static readonly int PROJECT_BILL_TYPEFLAG_TAX_INVOICE = 1;

    public static readonly int PROJECT_WORK_ORDER_TYPEFLAG_RATE = 0;
    public static readonly int PROJECT_WORK_ORDER_TYPEFLAG_LUMPSUM = 1;


    public static readonly int PROJECT_STAGE_STATUSFLAG_PENDING = 0;
    public static readonly int PROJECT_STAGE_STATUSFLAG_COMPLETED = 1;
    public static readonly int PROJECT_STAGE_STATUSFLAG_BILLED = 2;
    public static readonly int PROJECT_STAGE_STATUSFLAG_PAYMENT_RECEIVED = 3;

    public static readonly int PROJECT_STAGE_TYPEFLAG_WORK = 0;
    public static readonly int PROJECT_STAGE_TYPEFLAG_PAYMENT = 1;

    public static readonly int SPECIFICATION_ATTACHMENT_TYPEFLAG_GENERAL = 0;
    public static readonly int SPECIFICATION_ATTACHMENT_TYPEFLAG_VISUAL = 1;
    public static readonly int SPECIFICATION_ATTACHMENT_TYPEFLAG_ILLUSTRATIVE = 2;
    public static readonly int SPECIFICATION_ATTACHMENT_TYPEFLAG_PHOTOMETRICS = 3;

    public static readonly int SPECIFICATION_AREA_TYPEFLAG_AREA = 0;
    public static readonly int SPECIFICATION_AREA_TYPEFLAG_SUBAREA = 1;

    public static readonly int IMAGE_LIBRARY_ENTITY_TYPEFLAG_REFERENCE = 0;
    public static readonly int IMAGE_LIBRARY_ENTITY_TYPEFLAG_PHOTOSHOP = 1;

    public static readonly string ROLE_MASTER = "MASTER";
}

