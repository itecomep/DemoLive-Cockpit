using Microsoft.EntityFrameworkCore;


using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.RequestTicketModule.Entities;
using System.Text;

using System.Text.RegularExpressions;
using MyCockpitView.WebApi.ProjectModule.Services;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Services;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.WebApi.ContactModule.Services;
using System;

namespace MyCockpitView.WebApi.RequestTicketModule.Services;

public interface IRequestTicketService : IBaseEntityService<RequestTicket>
{
    Task SendRequestTicket(int ID,int StatusFlag=0, string? ResolutionMessage = null);
    Task RequestTicketFollowUp();
}
public class RequestTicketService : BaseEntityService<RequestTicket>, IRequestTicketService
{
    public RequestTicketService(EntitiesContext db) : base(db) { }

    public IQueryable<RequestTicket> Get(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null)
    {
        IQueryable<RequestTicket> _query = base.Get(Filters);

        //Apply filters
        if (Filters != null)
        {

            if (Filters.Where(x => x.Key.Equals("assignerContactID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<RequestTicket>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("assignerContactID", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(x => x.AssignerContactID == isNumeric);
                }
                _query = _query.Where(predicate);
            }

            if (Filters.Where(x => x.Key.Equals("entity", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<RequestTicket>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("entity", StringComparison.OrdinalIgnoreCase)))
                {
                    predicate = predicate.Or(x => x.Entity != null && x.Entity == _item.Value);
                }
                _query = _query.Where(predicate);
            }

            if (Filters.Where(x => x.Key.Equals("entityID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<RequestTicket>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("entityID", StringComparison.OrdinalIgnoreCase)))
                {
                    predicate = predicate.Or(x => x.EntityID != null && x.EntityID.ToString() == _item.Value);
                }
                _query = _query.Where(predicate);
            }

            if (Filters.Where(x => x.Key.Equals("projectid", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<RequestTicket>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("projectid", StringComparison.OrdinalIgnoreCase)))
                {
                    predicate = predicate.Or(x => x.ProjectID != null && x.ProjectID.ToString() == _item.Value);
                }
                _query = _query.Where(predicate);
            }

            if (Filters.Where(x => x.Key.Equals("isReadOnly", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<RequestTicket>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("isReadOnly", StringComparison.OrdinalIgnoreCase)))
                {
                    var isReadOnly = Convert.ToBoolean(_item.Value);

                    predicate = predicate.Or(x => x.IsReadOnly == isReadOnly);
                }
                _query = _query.Where(predicate);
            }

            if (Filters.Where(x => x.Key.Equals("parentID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<RequestTicket>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("parentID", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(x => x.ParentID != null && x.ParentID == isNumeric);
                }
                _query = _query.Where(predicate);
            }

            if (Filters.Where(x => x.Key.Equals("isRepeatRequired", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<RequestTicket>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("isRepeatRequired", StringComparison.OrdinalIgnoreCase)))
                {
                    var isRepeatRequired = Convert.ToBoolean(_item.Value);

                    predicate = predicate.Or(x => x.IsRepeatRequired == isRepeatRequired);
                }
                _query = _query.Where(predicate);
            }
            
                        if (Filters.Where(x => x.Key.Equals("AssigneeContactID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<RequestTicket>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("AssigneeContactID", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(x => x.Assignees.Any(c => c.ContactID == isNumeric));
                }
                _query = _query.Include(x => x.Assignees).Where(predicate);
            }
        }

        if (Search != null && Search != String.Empty)
        {
            _query = _query
                 .Where(x => x.Title.ToLower().Contains(Search.ToLower())
                 || x.Code.ToLower().Contains(Search.ToLower())
                                            || (x.AssignerContact.FirstName + " " + x.AssignerContact.LastName).ToLower().Contains(Search.ToLower())
                                            || x._searchTags.ToLower().Contains(Search.ToLower())
                                           );

        }

        if (Sort != null && Sort != String.Empty)
        {
            switch (Sort.ToLower())
            {
                case "createddate":
                    return _query
                            .OrderBy(x => x.Created);

                case "modifieddate":
                    return _query
                            .OrderBy(x => x.Modified);

                case "createddate desc":
                    return _query
                            .OrderByDescending(x => x.Created);

                case "modifieddate desc":
                    return _query
                            .OrderByDescending(x => x.Modified);

                case "nextReminderDate":
                    return _query
                            .OrderBy(x => x.NextReminderDate);

                case "nextReminderDate desc":
                    return _query
                            .OrderByDescending(x => x.NextReminderDate);
            }
        }

        return _query.OrderBy(x => x.NextReminderDate);

    }

    public async Task<RequestTicket> GetById(int Id)
    {
        var query = await Get()
            .Include(x => x.Assignees)
                      .Include(x => x.AssignerContact)
                       .Include(x => x.Attachments)
               .SingleOrDefaultAsync(i => i.ID == Id);

        return query;

    }

    public async Task<RequestTicket> GetById(Guid Id)
    {
        var query = await Get()
            .Include(x => x.Assignees)
                      .Include(x => x.AssignerContact)
                       .Include(x => x.Attachments)
               .SingleOrDefaultAsync(i => i.UID == Id);

        return query;

    }


    public async Task<int> Create(RequestTicket Entity)
    { 
        if (Entity.ProjectID != null)
        {
            var _project = await db.Projects.AsNoTracking().SingleOrDefaultAsync(x => x.ID == Entity.ProjectID);
            if (_project != null)
            {
                Entity.Title = _project.Code + "-" + _project.Title;
            }
        }

        if (Entity.Title == null || Entity.Title == string.Empty)
            throw new EntityServiceException("Title is required. Please enter proper title!");


        var _lastOrder = await Get().AnyAsync() ? (await Get().OrderByDescending(x => x.OrderFlag).FirstOrDefaultAsync()).OrderFlag : 0;

        Entity.OrderFlag = _lastOrder + 1;
        Entity.Code =$"{DateTime.UtcNow.ToString("yy")}{Entity.OrderFlag.ToString("000")}";

if (!Entity.IsRepeatRequired && !Entity.IsDraft)
        {
            Entity.StatusFlag = McvConstant.REQUEST_TICKET_STATUSFLAG_COMPLETED;
        }

       return await base.Create(Entity);

    }


    public async Task Delete(int Id)
    {
        var entity = await GetById(Id);

        var assigneeService = new RequestTicketAssigneeService(db);
        foreach (var x in entity.Assignees)
        {
            await assigneeService.Delete(x.ID);
        }

        var attachmentService = new BaseAttachmentService<RequestTicketAttachment>(db);
        foreach (var x in entity.Attachments)
        {
            await attachmentService.Delete(x.ID);
        }


        await base.Delete(Id);
    }


    public async Task RequestTicketFollowUp()
    {


        var _today = DateTime.UtcNow.Date;
        var _EOD = DateTime.UtcNow.AddDays(1).Date;
        var _openRequests = await Get()
                .Where(x => !x.IsReadOnly)
            .Where(x => x.StatusFlag == McvConstant.REQUEST_TICKET_STATUSFLAG_ACTIVE)
            .Where(x => x.Created < _today)
            .Where(x => x.NextReminderDate < _EOD)
            .Where(x => x.IsRepeatRequired)
            .OrderBy(x => x.NextReminderDate)
            .ToListAsync();

        //var sharedService = new SharedService(db);
        //var _endTimeSpan = TimeSpan.Parse(await sharedService.GetPresetValue(McvConstant.OFFICE_CLOSE_TIME));

        foreach (var obj in _openRequests)
        {
            try
            {
                //Console.WriteLine($"RT | {obj.Title}");
                //Console.WriteLine($"RepeatCount | {obj.RepeatCount}");
                //Console.WriteLine($"Interval | {obj.ReminderInterval}");
                //Console.WriteLine($"Reminder | {ClockTools.GetIST(obj.NextReminderDate).ToString("dd MMM yyyy ")}");

                await SendRequestTicket(obj.ID);
                //var _pendingTasks = await db.WFTasks
                //            .Where(x => x.Entity == nameof(RequestTicket)
                //                       && x.EntityID == obj.ID)
                //            .Where(x => x.StatusFlag == McvConstant.WFTASK_STATUSFLAG_PENDING || x.StatusFlag == McvConstant.WFTASK_STATUSFLAG_STARTED || x.StatusFlag == McvConstant.WFTASK_STATUSFLAG_PAUSED)
                //            .ToListAsync();
                
                //var _nextDue = ClockTools.GetUTC(ClockTools.GetIST(obj.NextReminderDate).Date.AddMinutes(_endTimeSpan.TotalMinutes));

                //foreach (var _task in _pendingTasks)
                //{
                //    _task.DueDate = _nextDue;
                //}

                Console.WriteLine("----------------------------------------------");
            }
            catch (Exception e)
            {
                Console.WriteLine($"Failed | {e.Message}");
               
            }

        }

    }

    public async Task SendRequestTicket(int ID,int StatusFlag=0,string? ResolutionMessage=null)
    {

        var _requestTicket = await db.RequestTickets
                .Where(x => !x.IsDeleted)
                        .AsNoTracking()
                                         .Where(x => !x.IsReadOnly)
            .Include(x => x.Assignees)
            .Include(x => x.AssignerContact)
            .Include(x => x.Attachments)
            .SingleOrDefaultAsync(x => x.ID == ID);

        if (_requestTicket == null) throw new EntityServiceException("Request Ticket not Found!");

        if (_requestTicket.IsRepeatRequired)
        {
            _requestTicket.StatusFlag = StatusFlag;
        }
        else
        {
            _requestTicket.StatusFlag = McvConstant.REQUEST_TICKET_STATUSFLAG_COMPLETED;
        }

        var _nextRepeatCount = _requestTicket.RepeatCount;
        var _nextReminderDate = _requestTicket.NextReminderDate;
        if (_requestTicket.StatusFlag == McvConstant.REQUEST_TICKET_STATUSFLAG_ACTIVE)
        {
            _nextRepeatCount = _requestTicket.RepeatCount + 1;
            _nextReminderDate = _requestTicket.NextReminderDate.AddDays(Convert.ToDouble(_requestTicket.ReminderInterval));
            //while (_nextReminderDate < DateTime.UtcNow)
            //{
            //    _nextReminderDate = _nextReminderDate.AddDays(Convert.ToDouble(_requestTicket.ReminderInterval));
            //}

        }
        //if (_requestTicket.StatusFlag == McvConstant.REQUEST_TICKET_STATUSFLAG_ACTIVE)
        //{
        //    _nextRepeatCount = _requestTicket.RepeatCount + 1;

        //    if (_requestTicket.ReminderInterval > 0)
        //    {
        //        var interval = TimeSpan.FromDays(Convert.ToDouble(_requestTicket.ReminderInterval));

        //        // Calculate how many intervals have been missed
        //        var missedIntervals = (int)Math.Ceiling(
        //            (DateTime.UtcNow - _requestTicket.NextReminderDate).TotalDays / interval.TotalDays
        //        );

        //        if (missedIntervals < 1) missedIntervals = 1; // always push forward

        //        _nextReminderDate = _requestTicket.NextReminderDate.AddDays(
        //            (double)(missedIntervals * _requestTicket.ReminderInterval)
        //        );
        //    }
        //    // else: skip updating _nextReminderDate
        //}



        if (!string.IsNullOrEmpty(ResolutionMessage))
        {
            _requestTicket.ResolutionMessage = ResolutionMessage;
           
        }

        var senderSignatureName = _requestTicket.AssignerContact.FullName;
        var senderSignatureDesignation = "";
        var email = "";
        var mobile = "";
        var senderSignatureEmail = "";
        var senderSignatureMobile = "";
        email = _requestTicket.AssignerContact.Emails.Where(x => x.IsPrimary).Select(y => y.Email).FirstOrDefault();
        if (email != null)
        {
            senderSignatureEmail = email;
        }

        mobile = _requestTicket.AssignerContact.Phones.Where(x => x.IsPrimary).Select(y => y.Phone).FirstOrDefault();
        if (mobile != null)
        {
            senderSignatureMobile = mobile;
        }
        var appointmentService = new ContactAppointmentService(db);
        var appointments = await appointmentService.Get().Where(x => x.StatusFlag == McvConstant.APPOINTMENT_STATUSFLAG_APPOINTED)
            .Where(x => x.ContactID == _requestTicket.AssignerContactID)
            //.Include(x=>x.Company)
            .Select(x=> x.Designation).Distinct()
            .ToListAsync();
        if (appointments.Any())
        {
            senderSignatureDesignation = string.Join(",", appointments);
        }

        var sharedService = new SharedService(db);
        //var _emailSenderName = await sharedService.GetPresetValue(McvConstant.REQUEST_TICKET_EMAIL_SENDER_NAME);
        //var _emailSenderAddress = await sharedService.GetPresetValue(McvConstant.REQUEST_TICKET_EMAIL_SENDER_ID);
        var _defaultCCList = await sharedService.GetPresetValue(McvConstant.REQUEST_TICKET_EMAIL_CC);

        var _requestTitle = _requestTicket.Title;

        if (_requestTicket.ProjectID != null)
        {
            var projectService = new ProjectService(db);
            var project = await projectService.Get().SingleOrDefaultAsync(x => x.ID == _requestTicket.ProjectID);
            if (project != null)
                _requestTitle = project.Title;
        }

        var _emailHeading = $"{_requestTicket.Purpose.ToUpper()}";

        var _emailSubject = $"{(!string.IsNullOrEmpty(_requestTicket.Subtitle) ? _requestTicket.Subtitle+" | " : "")}{_requestTitle} | {_emailHeading}";


        if (_requestTicket.StatusFlag == McvConstant.REQUEST_TICKET_STATUSFLAG_ACTIVE && _requestTicket.RepeatCount > 0)
        {
            _emailSubject = _emailSubject + $" | Gentle Reminder {_requestTicket.RepeatCount.ToString("00")}";
        }
        else if (_requestTicket.IsRepeatRequired && _requestTicket.StatusFlag == McvConstant.REQUEST_TICKET_STATUSFLAG_COMPLETED)
        {
            _emailSubject = _emailSubject+ $" | Resolved & Closed";
        }

        var _emailMessage = _requestTicket.RequestMessage
        .Replace("’", "'")
        .Replace("“", "\"")
        .Replace("”", "\"")
        .Replace("\u00A0", " ") // non-breaking space
        .Replace("&nbsp;", " ")
        .Replace("–", "-") // en dash
        .Replace("—", "-") // em dash
        .Replace("\r\n", "<br>")
        .Replace("\n", "<br>")
        .Replace("\r", "<br>");

        if (_requestTicket.IsRepeatRequired && _requestTicket.StatusFlag == McvConstant.REQUEST_TICKET_STATUSFLAG_COMPLETED)
        {
            _emailMessage = !string.IsNullOrEmpty(_requestTicket.ResolutionMessage) ? @"Dear Sir/Madam,
                            Thank you for completing the request." :
                            _requestTicket.ResolutionMessage;
        }

        var historyList = await db.RequestTickets
              .Where(x => !x.IsDeleted)
                      .AsNoTracking()
                      .Where(x => x.IsReadOnly)
          .Include(x => x.Assignees)
          .Include(x => x.AssignerContact)
          .Include(x => x.Attachments)
          .Where(x => x.ParentID == ID)
               .OrderByDescending(x => x.Created)
            .Take(5)
            .ToListAsync();

       
        //_replyParameter = _replyParameter + $"&subject=RE:{_emailSubject.ToUpper()}";

        var uid =  await RecordReadonly(ID);

        var sb = new StringBuilder();

        sb.AppendLine("<!DOCTYPE html>");
        sb.AppendLine("<html>");
        sb.AppendLine("<head>");
        sb.AppendLine("    <meta charset=\"UTF-8\" />");
        sb.AppendLine("    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />");
        sb.AppendLine("    <title>Email Design</title>");
        sb.AppendLine("    <style>");
        sb.AppendLine("        /* Reset styles for better compatibility */");
        sb.AppendLine("        body {");
        sb.AppendLine("            margin: 0;");
        sb.AppendLine("            padding: 0;");
        sb.AppendLine("            font-family: Calibri, sans-serif;");
        sb.AppendLine("            font-size: 14px;");
        sb.AppendLine("            line-height: 1.6;");
        sb.AppendLine("            max-width: 500px;");
        sb.AppendLine("            margin: 0 auto;");
        sb.AppendLine("        }");
        sb.AppendLine("");
        sb.AppendLine("        table {");
        sb.AppendLine("            border-collapse: collapse;");
        sb.AppendLine("            width: 100%;");
        sb.AppendLine("        }");
        sb.AppendLine("");
        sb.AppendLine("            table td {");
        sb.AppendLine("                border-collapse: collapse;");
        //sb.AppendLine("                padding: 10px;");
        sb.AppendLine("            }");
        sb.AppendLine("");
        sb.AppendLine("        .header {");
        //sb.AppendLine("            background-color: #ffc145;");
        sb.AppendLine("            color: #000;");
        //sb.AppendLine("            font-weight: bold;");
        sb.AppendLine("            font-size: 30px;");
        sb.AppendLine("            padding: 5px 10px;");
        sb.AppendLine("            margin: 5px 0;");
        sb.AppendLine("            text-align: center;");
        //sb.AppendLine("            border-radius: 4px;");
        sb.AppendLine("        }");
        sb.AppendLine("");
        sb.AppendLine("        .content {");
        sb.AppendLine("            background-color: #fff;");
        sb.AppendLine("            padding: 10px 10px;");
        sb.AppendLine("            margin: 5px 0;");
        sb.AppendLine("            border-radius: 4px;");
        sb.AppendLine("        }");
        sb.AppendLine("");
        sb.AppendLine("        .footer {");
        sb.AppendLine("            background-color: #ebebeb;");
        sb.AppendLine("            padding: 5px 10px;");
        sb.AppendLine("            margin: 5px 0;");
        //sb.AppendLine("            border-radius: 4px;");
        sb.AppendLine("        }");
        sb.AppendLine("");
        sb.AppendLine("        .message {");
        sb.AppendLine("            padding: 15px;");
        sb.AppendLine("            border-radius: 5px;");
        sb.AppendLine("            text-align: justify;");
        sb.AppendLine("        }");
        sb.AppendLine("");
        sb.AppendLine("        .download-button {");
        sb.AppendLine("            background-color: #3498db;");
        sb.AppendLine("            color: #fff;");
        sb.AppendLine("            text-decoration: none;");
        sb.AppendLine("            padding: 10px 20px;");
        sb.AppendLine("            border-radius: 5px;");
        sb.AppendLine("        }");
        sb.AppendLine("");
        sb.AppendLine("            .download-button:hover {");
        sb.AppendLine("                background-color: #1e6bb8;");
        sb.AppendLine("            }");
        sb.AppendLine("");
        sb.AppendLine("        .actions {");
        sb.AppendLine("            padding: 15px;");
        sb.AppendLine("            border-radius: 5px;");
        sb.AppendLine("            text-align: center");
        sb.AppendLine("        }");
        sb.AppendLine("");
        sb.AppendLine("        .signature {");
        sb.AppendLine("            text-align: center;");
        sb.AppendLine("            margin-top: 15px;");
        sb.AppendLine("            font-size: 11px;");
        //sb.AppendLine("            color: #003558;");
        sb.AppendLine("        }");
        sb.AppendLine("    </style>");
        sb.AppendLine("</head>");

        //BODY
        sb.AppendLine("<body>");
        sb.AppendLine("    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"margin:5px 0;\">");
        sb.AppendLine("        <tr>");
        sb.AppendLine("            <td class=\"header\">");
        sb.AppendLine(_emailHeading);
        sb.AppendLine("            </td>");
        sb.AppendLine("        </tr>");
        sb.AppendLine("    </table>");

        sb.AppendLine("");
        sb.AppendLine("<div style=\"border-bottom: 1px solid #cccccc; margin-top: 15px; margin-bottom: 15px; \"></div>");

        sb.AppendLine("        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%; border-collapse: collapse;\">");
        if (_requestTicket.Entity != null)
        {
            sb.AppendLine("            <tr>");
            sb.AppendLine("                <td valign=\"top\" width=\"150\" style=\"padding-bottom:5px;font-weight:bold;\">");
            sb.AppendLine(_requestTicket.Entity + ":");
            sb.AppendLine("                </td>");
            sb.AppendLine("                <td valign=\"top\" style=\"padding-bottom:5px;\">");
            sb.AppendLine(_requestTicket.EntityTitle);
            sb.AppendLine("                </td>");
            sb.AppendLine("            </tr>");
        }

        sb.AppendLine("            <tr>");
        sb.AppendLine("                <td valign=\"top\" width=\"150\" style=\"padding-bottom:5px;font-weight:bold;\">");
        sb.AppendLine("                    Subject:");
        sb.AppendLine("                </td>");
        sb.AppendLine("                <td valign=\"top\" style=\"padding-bottom:5px;\">");
        sb.AppendLine($"{(!string.IsNullOrEmpty(_requestTicket.Subtitle) ? _requestTicket.Subtitle+" | " : "")}{_requestTicket.Title}");
        sb.AppendLine("                </td>");
        sb.AppendLine("            </tr>");

        sb.AppendLine("            <tr>");
        sb.AppendLine("                <td valign=\"top\" width=\"150\" style=\"padding-bottom:5px;font-weight:bold;\">");
        sb.AppendLine("                    Date:");
        sb.AppendLine("                </td>");
        sb.AppendLine("                <td valign=\"top\" style=\"padding-bottom:5px;\">");
        sb.AppendLine(ClockTools.GetIST(_requestTicket.Created).ToString("dd MMM yyyy"));
        sb.AppendLine("                </td>");
        sb.AppendLine("            </tr>");
        sb.AppendLine("            <tr>");
        sb.AppendLine("                <td valign=\"top\" width=\"150\" style=\"padding-bottom:5px;font-weight:bold;\">");
        sb.AppendLine("                   Code:");
        sb.AppendLine("                </td>");
        sb.AppendLine("                <td valign=\"top\" style=\"padding-bottom:5px;\">");
        sb.AppendLine(_requestTicket.Code);
        sb.AppendLine("                </td>");
        sb.AppendLine("            </tr>");
        sb.AppendLine("            <tr>");
        sb.AppendLine("                <td valign=\"top\" width=\"150\" style=\"padding-bottom:5px;font-weight:bold;\">");
        sb.AppendLine("                    Sent By:");
        sb.AppendLine("                </td>");
        sb.AppendLine("                <td valign=\"top\" style=\"padding-bottom:5px;\">");
        sb.AppendLine(_requestTicket.AssignerContact.FullName + " (" + _requestTicket.AssignerContact.Emails.FirstOrDefault(c=>c.IsPrimary)?.Email + ")");

        sb.AppendLine("                </td>");
        sb.AppendLine("            </tr>");
        if (_requestTicket.StatusFlag != McvConstant.REQUEST_TICKET_STATUSFLAG_COMPLETED)
        {
            sb.AppendLine("            <tr>");
            sb.AppendLine("                <td valign=\"top\" width=\"150\" style=\"padding-bottom:5px;font-weight:bold;\">");
            sb.AppendLine("                    Next Reminder on:");
            sb.AppendLine("                </td>");
            sb.AppendLine("                <td valign=\"top\" style=\"padding-bottom:5px;\">");
            sb.AppendLine(ClockTools.GetIST(_requestTicket.NextReminderDate).ToString("dd MMM yyyy"));
            sb.AppendLine("                </td>");
            sb.AppendLine("            </tr>");
        }
        sb.AppendLine("        </table>");
        sb.AppendLine("");
        sb.AppendLine("        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%; border-collapse: collapse;\">");
        sb.AppendLine("            <tr>");
        sb.AppendLine("                <td valign=\"top\" style=\"font-weight:bold;\">");
        sb.AppendLine("                    To:");
        sb.AppendLine("                </td>");
        sb.AppendLine("            </tr>");
        sb.AppendLine("            <tr>");
        sb.AppendLine("                <td valign=\"top\" style=\"padding-bottom:5px;\">");
        sb.AppendLine("                    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%; border-collapse: collapse;\">");

        foreach (var obj in _requestTicket.Assignees.Where(x => x.TypeFlag == 0))
        {
            sb.AppendLine("                        <tr>");
            sb.AppendLine("                            <td >");
            sb.AppendLine(obj.Name + " <i> (" + obj.Email + ")</i>");
            sb.AppendLine("                            </td>");
            sb.AppendLine("                        </tr>");
        }

        sb.AppendLine("                    </table>");
        sb.AppendLine("                </td>");
        sb.AppendLine("            </tr>");
        sb.AppendLine("            <tr>");
        sb.AppendLine("                <td valign=\"top\" style=\"font-weight:bold;\">");
        sb.AppendLine("                    CC:");
        sb.AppendLine("                </td>");
        sb.AppendLine("            </tr>");
        sb.AppendLine("            <tr>");
        sb.AppendLine("                <td valign=\"top\" style=\"padding-bottom:5px;\">");
        sb.AppendLine("                    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%; border-collapse: collapse;\">");
        foreach (var obj in _requestTicket.Assignees.Where(x => x.TypeFlag == 1))
        {
            sb.AppendLine("                        <tr>");
            sb.AppendLine("                            <td >");
            sb.AppendLine(obj.Name + " <i> (" + obj.Email + ")</i>");
            sb.AppendLine("                            </td>");
            sb.AppendLine("                        </tr>");
        }
        sb.AppendLine("                    </table>");
        sb.AppendLine("                </td>");
        sb.AppendLine("            </tr>");


        sb.AppendLine("        </table>");
        sb.AppendLine("<div style=\"border-bottom: 1px solid #cccccc; margin-top: 15px; margin-bottom: 15px; \"></div>");

        sb.AppendLine("");
        sb.AppendLine("        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%; border-collapse: collapse;\">");
        sb.AppendLine("            <tr>");
        sb.AppendLine("                <td valign=\"top\" style=\"padding-top:5px;padding-bottom:5px;\">");
        sb.AppendLine("                    <pre style=\"font-family:Calibri;line-height:1.5; font-size: 14px;margin-top:0;margin-bottom:0; white-space: pre-wrap; white-space: -moz-pre-wrap;");
        sb.AppendLine("                                white-space: -pre-wrap; white-space: -o-pre-wrap; word-wrap: break-word;\">");

        sb.AppendLine(_emailMessage);

        sb.AppendLine("</pre>");
        sb.AppendLine("                </td>");
        sb.AppendLine("            </tr>");
        sb.AppendLine("        </table>");
        sb.AppendLine("");

        if (historyList != null && historyList.Any())
        {
            sb.AppendLine(" <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%; border-collapse: collapse;\">");
            sb.AppendLine("            <tr>");
            sb.AppendLine("                <td valign=\"top\" style=\"font-weight:bold;\">");
            sb.AppendLine("                    History:");
            sb.AppendLine("                </td>");
            sb.AppendLine("            </tr>");
            sb.AppendLine("        </table>");
        }
        
        var _count = 0;
        foreach (var obj in historyList)
        {
            sb.AppendLine(" <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%;font-size: 11px; border-collapse: collapse;\">");
            sb.AppendLine("            <tr>");
            sb.AppendLine("                <td valign=\"top\" style=\"padding-bottom:5px;\">");
            sb.AppendLine($"{ClockTools.GetIST(obj.Created).ToString("dd MMM yyyy HH:mm")}");
            sb.AppendLine("                </td>");
            sb.AppendLine("                <td valign=\"top\" style=\"padding-bottom:5px;\" align=\"right\">");
            sb.AppendLine(obj.RepeatCount != 0 ? "Reminder " + obj.RepeatCount.ToString("00") : "Requested");
            sb.AppendLine("                </td>");
            sb.AppendLine("            </tr>");
            sb.AppendLine("            <tr>");
            //sb.AppendLine("                <td width=\"25%\" valign=\"top\" style=\"padding-bottom:5px;\">");
            //sb.AppendLine(obj.RepeatCount.ToString("00"));
            //sb.AppendLine("                </td>");
            sb.AppendLine("                <td colspan=\"2\" valign=\"top\" style=\"padding-bottom:5px;\">");
            sb.AppendLine("                    <pre style=\"font-family:Calibri;line-height:1.1; font-size: 12px;margin-top:0;margin-bottom:0; white-space: pre-wrap; white-space: -moz-pre-wrap;font-style: italic;");
            sb.AppendLine("                                white-space: -pre-wrap; white-space: -o-pre-wrap; word-wrap: break-word;\">");

            sb.AppendLine(obj.RequestMessage);

            sb.AppendLine("</pre>");
            sb.AppendLine("                </td>");
            sb.AppendLine("            </tr>");
            sb.AppendLine("        </table>");
            _count++;

            if (_count < historyList.Count())
            {
                sb.AppendLine("<div style=\"border-bottom: 1px solid #cccccc; margin-bottom: 10px; \"></div>");
            }
        }


        if (_requestTicket.Attachments.Any())
        {
            sb.AppendLine("<div style=\"border-bottom: 1px solid #cccccc; margin-top: 15px; margin-bottom: 15px; \"></div>");

            sb.AppendLine("");
            sb.AppendLine("        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%; border-collapse: collapse;\">");
            sb.AppendLine("            <tr>");
            sb.AppendLine("                 <td valign=\"top\" style=\"font-weight:bold;\">");
            sb.AppendLine(" Kindly click the below links to download: ");
            sb.AppendLine("                </td>");
            sb.AppendLine("            </tr>");

            var _index = 1;
            foreach (var attachment in _requestTicket.Attachments)
            {
                sb.AppendLine("            <tr>");
                sb.AppendLine("                <td valign=\"top\" style=\"padding-bottom:5px;\">");
                sb.AppendLine("              " +
                    "      <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%; border-collapse: collapse;\">");

                sb.AppendLine("            <tr  style=\" display:flex;\">");
                sb.AppendLine("                <td >");
                sb.AppendLine(_index.ToString("D2"));
                sb.AppendLine("                </td>");
                sb.AppendLine("                <td style=\"padding-left: 0.5rem;\">");
                sb.AppendLine($"                    <a href=\"{attachment.Url}\">{attachment.Filename}</a>");

                sb.AppendLine("                </td>");
                sb.AppendLine("            </tr>");
                sb.AppendLine("                    </table>");
                sb.AppendLine("                </td>");
                sb.AppendLine("            </tr>");
                _index++;
            }

            sb.AppendLine("        </table>");
            sb.AppendLine("");
        }

        //FOOTER
        sb.AppendLine("<div style=\"border-bottom: 1px solid #cccccc; margin-top: 15px; margin-bottom: 15px; \"></div>");

        sb.AppendLine("");
        sb.AppendLine("        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%; border-collapse: collapse;\">");
        sb.AppendLine("            <tr>");
        sb.AppendLine("                <td valign=\"top\" style=\"padding-top:5px;padding-bottom:5px;\">");
        sb.AppendLine("                    <pre style=\"font-family:Calibri;line-height:1.5; font-size: 14px;margin-top:0;margin-bottom:0; white-space: pre-wrap; white-space: -moz-pre-wrap;");
        sb.AppendLine("                                white-space: -pre-wrap; white-space: -o-pre-wrap; word-wrap: break-word;\">");
        
        sb.AppendLine("Thanks & Regards,");
        sb.AppendLine($"{senderSignatureName}");
        sb.AppendLine($"{senderSignatureDesignation}");

        if (!string.IsNullOrWhiteSpace(senderSignatureEmail))
        {
            sb.AppendLine($"{senderSignatureEmail}");
        }
        else
        {
            sb.AppendLine($"\r\n");
        }


        if (!string.IsNullOrWhiteSpace(senderSignatureMobile))
        {
            sb.AppendLine($"+91 {senderSignatureMobile} \r\n");
        }
        else
        {
            sb.AppendLine($"\r\n");
        }

        sb.AppendLine("<span style=\"font-weight:bold;font-size: 1.2rem; color: #373e68; \" ><span style=\" color: lime;\">ECO</span> MEP CONSULTANTS PVT. LTD.</span>");
        sb.AppendLine("<span style=\"font-weight:bold;font-size: 1.2rem; color: #373e68; \" ><span style=\" color: #69abff;\">POINT</span> CLOUD ENGINEERING LLP.</span> \r\n");

        sb.AppendLine("1204, DLH Park,\r\nOpp. Goregaon MTNL, SV Road,\r\nGoregaon (W), Mumbai-400062,\r\nLandline: 022-48263430,");
        sb.AppendLine("Website: <a href=\"https://www.pointcloudengg.com\" target=\"_blank\">www.pointcloudengg.com</a>,  <a href=\"https://www.ecomep.in\" target=\"_blank\"> www.ecomep.in</a> \r\n");

        sb.AppendLine("<p style=\"font-size:12pt;font-family:Times New Roman,serif;margin:0 0 12pt 0;\">");
        sb.AppendLine("<i><span style=\"color: rgb(90, 190, 71) !important; font-size: 24pt; font-family: Webdings;\" lang=\"en-US\" data-ogsc=\"green\">P</span></i><i><span style=\"color: rgb(90, 190, 71) !important; font-size: 10pt; font-weight: bold;font-family: Helvetica, sans-serif;\" lang=\"en-US\" data-ogsc=\"green\">Before printing, think about your responsibility and commitment with the Environment</span></i>");
        sb.AppendLine("</p>");

        sb.AppendLine("</pre>");
        sb.AppendLine("                </td>");
        sb.AppendLine("            </tr>");
        sb.AppendLine("            <tr>");
        sb.AppendLine("                <td valign=\"top\" style=\"padding-top:5px;padding-bottom:5px;\">");
        sb.AppendLine("                <span style=\"font-size:14px;\"><i style=\"font-weight:bold;\">DISCLAIMER:</i> </span><br>");
        sb.AppendLine("                <span style=\"font-size:14px;\">This e-mail message may contain confidential, proprietary or legally privileged information. It should not be used by anyone who is not the original intended recipient. If you have erroneously received this message, please delete it immediately and notify the sender. The recipient acknowledges that <span style=\"font-weight: 800;font-size: 15px; \"><span style=\" color: lime;\">ECO</span> MEP CONSULTANTS PVT.LTD. AND <span style=\" color: #69abff;\">POINT</span> CLOUD ENGINEERING LLP</span> or its subsidiaries and associated companies, are unable to exercise control or ensure or guarantee the integrity of/over the contents of the information contained in e-mail transmissions and further acknowledges that any views expressed in this message are those of the individual sender and no binding nature of the message shall be implied or assumed unless the sender does so expressly with due authority of ECO MEP CONSULTANTS PVT.LTD. AND POINT CLOUD ENGINEERING LLP. Before opening any attachments please check them for viruses and defects.</span>");
        sb.AppendLine("                </td>");
        sb.AppendLine("            </tr>");
        //sb.AppendLine("            <tr>");
        //sb.AppendLine("                <td valign=\"top\" style=\"padding-top:5px;padding-bottom:5px;\">");
        //sb.AppendLine("                <span >Please print this email if absolutely necessary, lets save paper.</span>");
        //sb.AppendLine("                </td>");
        //sb.AppendLine("            </tr>");
        sb.AppendLine("        </table>");
        sb.AppendLine("");
        if (_requestTicket.Attachments.Any())
        {
            sb.AppendLine("<div style=\"border-bottom: 1px solid #cccccc; margin-top: 15px; margin-bottom: 15px; \"></div>");

            sb.AppendLine("");
            sb.AppendLine("        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%; border-collapse: collapse;\">");
            sb.AppendLine("            <tr>");
            sb.AppendLine("                 <td valign=\"top\" style=\"font-weight:bold;\">");
            sb.AppendLine(" Kindly click the below links to download: ");
            sb.AppendLine("                </td>");
            sb.AppendLine("            </tr>");

            var _index = 1;
            foreach (var attachment in _requestTicket.Attachments)
            {
                sb.AppendLine("            <tr>");
                sb.AppendLine("                <td valign=\"top\" style=\"padding-bottom:5px;\">");
                sb.AppendLine("              " +
                    "      <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%; border-collapse: collapse;\">");

                sb.AppendLine("            <tr  style=\" display:flex;\">");
                sb.AppendLine("                <td >");
                sb.AppendLine(_index.ToString("D2"));
                sb.AppendLine("                </td>");
                sb.AppendLine("                <td style=\"padding-left: 0.5rem;\">");
                sb.AppendLine($"                    <a href=\"{attachment.Url}\">{attachment.Filename}</a>");

                sb.AppendLine("                </td>");
                sb.AppendLine("            </tr>");
                sb.AppendLine("                    </table>");
                sb.AppendLine("                </td>");
                sb.AppendLine("            </tr>");
                _index++;
            }

            sb.AppendLine("        </table>");
            sb.AppendLine("");
        }
        sb.AppendLine("    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"margin:5px 0;\">");
        sb.AppendLine("        <tr>");
        sb.AppendLine("            <td class=\"footer\">");
        sb.AppendLine("    <table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\">");
        sb.AppendLine("        <tr>");
        sb.AppendLine("            <td style=\"text-align:left; font-size:11px;\">");
        sb.AppendLine(" <div style=\"font-weight: 800;font-size: 15px; \">EMCPL | PCELLP </span>");
        sb.AppendLine(" <div style=\"font-weight: 800;font-size: 15px; \">Pilot View </span>");
        sb.AppendLine("            </td>");
        sb.AppendLine("            <td style=\"text-align:right; font-size:11px;\">");
        sb.AppendLine("               <div>MyCocpitView&copy;</div>");
        sb.AppendLine("               <small> Powered by Newarch&reg; Infotech LLP </small>");
        sb.AppendLine("            </td>");
        sb.AppendLine("        </tr>");
        sb.AppendLine("    </table>");
        sb.AppendLine("            </td>");
        sb.AppendLine("        </tr>");
        sb.AppendLine("    </table>");
        sb.AppendLine("</body>");
        sb.AppendLine("");
        sb.AppendLine("</html>");
        //end

        var _emailBody = sb.ToString();


        var currentUser = _requestTicket.AssignerContact;
        var _senderName = "";
        var _senderEmail = "";
        var currentUserMail = "";
        var currentUserName = "";
        if (currentUser != null)
        {
            currentUserMail = _requestTicket.AssignerContact.Emails.Where(x => x.IsPrimary).Select(y => y.Email).FirstOrDefault();
            if (currentUserMail != null && currentUserMail.EndsWith("@ecomep.in", StringComparison.OrdinalIgnoreCase))
            {
                _senderEmail = currentUserMail;
            }
            else
            {
                _senderEmail = await sharedService.GetPresetValue(McvConstant.REQUEST_TICKET_EMAIL_SENDER_ID);
            }

            currentUserName = _requestTicket.AssignerContact.FullName;
            if (currentUserName != null)
            {
                _senderName = currentUserName;
            }
            else
            {
                _senderName = await sharedService.GetPresetValue(McvConstant.REQUEST_TICKET_EMAIL_SENDER_NAME);
            }
        }

         
        
        var emailTo = new List<(string name, string email)>();
        foreach (var obj in _requestTicket.Assignees.Where(x => x.TypeFlag == McvConstant.REQUEST_TICKET_ASSIGNEE_TO))
            emailTo.Add((obj.Name, obj.Email));

        var emailCC = new List<(string name, string email)>();
        foreach (var obj in _requestTicket.Assignees.Where(x => x.TypeFlag == McvConstant.REQUEST_TICKET_ASSIGNEE_CC))
            emailCC.Add((obj.Name, obj.Email));

        var emailBCC = new List<(string name, string email)>();
        foreach (var obj in _requestTicket.Assignees.Where(x => x.TypeFlag == McvConstant.REQUEST_TICKET_ASSIGNEE_BCC))
            emailBCC.Add((obj.Name, obj.Email));

        if (_requestTicket.AssignerContact != null)
        {
            var assignerEmail = _requestTicket.AssignerContact.Emails.FirstOrDefault(x => x.IsPrimary)?.Email;
            if (assignerEmail != null && !emailTo.Any(a => a.email.Equals(assignerEmail)) && !emailCC.Any(a => a.email.Equals(assignerEmail)))
                emailCC.Add((_requestTicket.AssignerContact.FullName, assignerEmail));
        }
        //default CC
        if (_defaultCCList != null)
        {
            Regex myRegex = new Regex(McvConstant.EMAIL_REGEX, RegexOptions.None);
            foreach (Match myMatch in myRegex.Matches(_defaultCCList))
            {
                if (!emailTo.Any(a => a.email.Equals(myMatch.Value.Trim())) && !emailCC.Any(a => a.email.Equals(myMatch.Value.Trim())))
                    emailCC.Add(("Company", myMatch.Value.Trim()));

            }
        }

        var _creator = _requestTicket.AssignerContact;

        if (_requestTicket.IsRepeatRequired && _requestTicket.StatusFlag == McvConstant.REQUEST_TICKET_STATUSFLAG_COMPLETED)
        {
            var _sendResolutionMessage = Convert.ToBoolean(await sharedService.GetPresetValue(McvConstant.REQUEST_TICKET_SEND_RESOLUTION_MESSAGE));
            if (_sendResolutionMessage)
            {
                await sharedService.SendMail(
                    _emailSubject.ToUpper().Trim(),
                    _senderName,
                    _senderEmail,
                    _emailBody,
                    emailTo,
                    emailCC,
                    emailBCC
                    , replyAddress: _creator.Emails.FirstOrDefault(x => x.IsPrimary).Email
                , replyName: _creator.FullName
                );
            }
        }
        else
        {
            await sharedService.SendMail(
                  _emailSubject.ToUpper().Trim(),
                  _senderName,
                  _senderEmail,
                  _emailBody,
                  emailTo,
                  emailCC,
                  emailBCC
                  , replyAddress: _creator.Emails.FirstOrDefault(x => x.IsPrimary)?.Email ?? null
              , replyName: _creator.FullName
              );
        }

        _requestTicket.NextReminderDate = _nextReminderDate;
        _requestTicket.RepeatCount = _nextRepeatCount;
        await Update(_requestTicket);
        var _pendingTasks = await db.WFTasks
        .Where(x => x.Entity == nameof(RequestTicket)
        && x.EntityID == _requestTicket.ID)
        .Where(x => x.StatusFlag == McvConstant.WFTASK_STATUSFLAG_PENDING || x.StatusFlag == McvConstant.WFTASK_STATUSFLAG_STARTED || x.StatusFlag == McvConstant.WFTASK_STATUSFLAG_PAUSED)
        .ToListAsync();
        var _endTimeSpan = TimeSpan.Parse(await sharedService.GetPresetValue(McvConstant.OFFICE_CLOSE_TIME));
        var _nextDue = ClockTools.GetUTC(ClockTools.GetIST(_requestTicket.NextReminderDate).Date.AddMinutes(_endTimeSpan.TotalMinutes));
        foreach (var _task in _pendingTasks)
        {
            _task.DueDate = _nextDue;
        }
        await db.SaveChangesAsync();
    }
    public async Task<Guid> RecordReadonly(int ID)
    {

        //RECORD ENTITY HISTORY
        var entity = await Get()
        .Where(x => !x.IsReadOnly)
        .Include(x => x.AssignerContact)
        .Include(x => x.Assignees)
        .Include(x => x.Attachments)
        .SingleOrDefaultAsync(x => x.ID == ID);
        if (entity == null) throw new EntityServiceException("RequestTicket not found!");
        var newEntity = new RequestTicket();
        // Set values from the original entity to the new entity
        db.Entry(newEntity).CurrentValues.SetValues(entity);
        // Detach the newAttendee if it's already being tracked
        if (db.Entry(newEntity).State != EntityState.Detached)
        {
            db.Entry(newEntity).State = EntityState.Detached;
        }
        newEntity.ID = default(int);
        newEntity.UID = default(Guid);
        newEntity.Created = DateTime.UtcNow;
        newEntity.Modified = DateTime.UtcNow;
        // Create a new entity with a deep copy of the original entity's properties

        db.Entry(newEntity).State = EntityState.Added;

        // Add the new entity to the context
        db.RequestTickets.Add(newEntity);


        // Reset the ID property
        newEntity.ID = 0;
        newEntity.ParentID = entity.ID;
        newEntity.IsReadOnly = true;


        foreach (var item in entity.Assignees)
        {
            // Create a new instance and copy the values
            var newAttendee = new RequestTicketAssignee();
            db.Entry(newAttendee).CurrentValues.SetValues(item);

            // Detach the newAttendee if it's already being tracked
            if (db.Entry(newAttendee).State != EntityState.Detached)
            {
                db.Entry(newAttendee).State = EntityState.Detached;
            }

            // Set ID to default (assuming ID is an int)
            newAttendee.ID = default(int);
            newAttendee.UID = default(Guid);
            // Attach the new entity to the context
            db.Entry(newAttendee).State = EntityState.Added;

            // Add the new entity to the context
            db.RequestTicketAssignees.Add(newAttendee);

            // Add the new entity to the collection
            newEntity.Assignees.Add(newAttendee);

        }

        foreach (var item in entity.Attachments)
        {
                // Create a new instance and copy the values
                var newAttachment = new RequestTicketAttachment();
                db.Entry(newAttachment).CurrentValues.SetValues(item);

                // Detach the newAttachment if it's already being tracked
                if (db.Entry(newAttachment).State != EntityState.Detached)
                {
                    db.Entry(newAttachment).State = EntityState.Detached;
                }

                // Set ID to default (assuming ID is an int)
                newAttachment.ID = default(int);
                newAttachment.UID = default(Guid);
                // Attach the new entity to the context
                db.Entry(newAttachment).State = EntityState.Added;
                // Add the new entity to the context
                db.RequestTicketAttachments.Add(newAttachment);

                newEntity.Attachments.Add(newAttachment);
        }

        await db.SaveChangesAsync();
        return newEntity.UID;

    }

}
