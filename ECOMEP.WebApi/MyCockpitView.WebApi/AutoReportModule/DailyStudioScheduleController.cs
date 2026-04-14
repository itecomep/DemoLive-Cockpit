

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.CompanyModule;
using MyCockpitView.WebApi.ContactModule.Services;
using MyCockpitView.WebApi.Models;
using MyCockpitView.WebApi.ProjectModule.Services;
using MyCockpitView.WebApi.Services;
using MyCockpitView.WebApi.TodoModule.Entities;
using MyCockpitView.WebApi.TodoModule.Services;
using MyCockpitView.WebApi.WFTaskModule.Services;
using System.Text;

namespace MyCockpitView.WebApi.AutoReportModule;

[Route("[controller]")]
[ApiController]
public class DailyStudioScheduleController : ControllerBase
{
    private readonly IWFTaskService wftaskService;
    private readonly IContactService contactService;
    private readonly IContactAppointmentService appointmentService;
    private readonly ISharedService sharedService;
    private readonly ICompanyService companyService;
    private readonly ITodoService todoService;
    private readonly IProjectService projectService;
    public DailyStudioScheduleController(IWFTaskService wftaskService, IContactService contactService, IContactAppointmentService appointmentService, ISharedService sharedService, ICompanyService companyService, ITodoService todoService, IProjectService projectService)
    {
        this.wftaskService = wftaskService;
        this.contactService = contactService;
        this.appointmentService = appointmentService;
        this.sharedService = sharedService;
        this.companyService = companyService;
        this.todoService = todoService;
        this.projectService = projectService;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {

        //"0 31 18 * * * *"
        var todayIST = ClockTools.GetISTNow().Date;
        var todayUTC = ClockTools.GetUTC(todayIST);
        var nextDayIST = todayIST.AddDays(1);
        var nextDayUTC = ClockTools.GetUTC(nextDayIST);

        //var previousDay= todayIST.AddDays(-1);

        var companies = await companyService.Get()
                .Where(x => !x.IsReadOnly)
           .Select(x => new
           {
               x.Title,
               x.ID,
           })
           .ToListAsync();

        var contacts = await contactService.Get()
                .Where(x => !x.IsReadOnly)
                .Include(x => x.Appointments).ThenInclude(x => x.Company)
                .Where(x => x.Username != null)
                .Where(x => x.Appointments.Any(a => a.StatusFlag == McvConstant.APPOINTMENT_STATUSFLAG_APPOINTED))
                .SelectMany(x => x.Appointments.Where(a => a.StatusFlag == McvConstant.APPOINTMENT_STATUSFLAG_APPOINTED), (x, a) => new
                {
                    ContactID = x.ID,
                    Name = x.FirstName + " " + x.LastName,
                    CompanyID = a.CompanyID,
                    Company = a.Company.Title
                })
                .ToListAsync();



        var tasks = await wftaskService.Get()
                .Where(x => !x.IsReadOnly)
          .Where(x => x.StatusFlag == McvConstant.WFTASK_STATUSFLAG_PENDING
          || x.StatusFlag == McvConstant.WFTASK_STATUSFLAG_STARTED
          || x.StatusFlag == McvConstant.WFTASK_STATUSFLAG_PAUSED
          || (x.StatusFlag == McvConstant.WFTASK_STATUSFLAG_COMPLETED && x.CompletedDate.HasValue && x.CompletedDate > todayUTC)
          )
                //.Where(x => x.Entity != null && x.Entity == nameof(Todo)) //TODO WORK
                .Select(x => new
                {
                    x.Entity,
                    x.EntityID,
                    x.ContactID,
                    x.Title,
                    x.Subtitle,
                    x.StartDate,
                    x.DueDate,
                    x.CompletedDate,
                    x.MHrAssigned,
                    //x.VHrAssigned,
                    x.MHrConsumed,
                    x.AssignerContactID,
                    x.StatusFlag
                })
                .ToListAsync();

        var tasksWithContacts = tasks
            .Join(contacts, a => a.ContactID, b => b.ContactID, (a, b) => new
            {
                a.Entity,
                a.EntityID,
                b.Company,
                b.Name,
                a.Title,
                a.Subtitle,
                a.StartDate,
                a.DueDate,
                a.CompletedDate,
                a.MHrAssigned,
                a.MHrConsumed,
                //a.VHrAssigned,
                a.AssignerContactID,
                a.StatusFlag
            }).Join(contacts, a => a.AssignerContactID, b => b.ContactID, (a, b) => new
            {
                a.Entity,
                a.EntityID,
                a.Company,
                a.Name,
                a.Title,
                a.Subtitle,
                a.StartDate,
                a.DueDate,
                a.CompletedDate,
                a.MHrAssigned,
                a.MHrConsumed,
                //a.VHrAssigned,
                Assigner = b.Name,
                a.StatusFlag
            }).ToList();

        var activeTasks = tasksWithContacts.Where(x => x.StatusFlag == McvConstant.WFTASK_STATUSFLAG_PENDING || x.StatusFlag == McvConstant.WFTASK_STATUSFLAG_STARTED || x.StatusFlag == McvConstant.WFTASK_STATUSFLAG_PAUSED).ToList();

        var completedTasks = tasksWithContacts.Where(x => x.StatusFlag == McvConstant.WFTASK_STATUSFLAG_COMPLETED).ToList();

        var todos = await todoService.Get()
            .Where(x => !x.IsReadOnly)
            .Where(x => x.StatusFlag == McvConstant.TODO_STATUSFLAG_PENDING || (x.StatusFlag == McvConstant.TODO_STATUSFLAG_COMPLETED && x.Modified > todayUTC))
              .Select(x => new
              {
                  x.ID,
                  x.AssigneeContactID,
                  x.AssignerContactID,
                  x.Title,
                  x.SubTitle,
                  x.StartDate,
                  x.DueDate,
                  x.MHrAssigned,
                  x.ProjectID,
                  x.StatusFlag,
                  x.Modified
              })
              .ToListAsync();

        var projectsFilteredByTodo = await projectService.Get()
             .Where(x => todos.Select(t => t.ProjectID).Any(t => t == x.ID))
              .Select(x => new
              {
                  x.ID,
                  x.Code,
                  x.Title,
                  x.CompanyID,
              })
              .ToListAsync();

        var projectsWithCompany = projectsFilteredByTodo
            .Join(companies, a => a.CompanyID, b => b.ID, (a, b) => new
            {
                Company = b.Title,
                Project = a.Code + "-" + a.Title,
                ProjectID = a.ID
            });

        var todosWithContactsAndProjects = todos
            .Join(contacts, a => a.AssigneeContactID, b => b.ContactID, (x, b) => new
            {
                x.ID,
                x.AssigneeContactID,
                x.AssignerContactID,
                x.Title,
                x.SubTitle,
                x.StartDate,
                x.DueDate,
                x.MHrAssigned,
                x.ProjectID,
                x.StatusFlag,
                x.Modified,
                Assignee = b.Name,

            }).Join(contacts, a => a.AssignerContactID, b => b.ContactID, (x, b) => new
            {
                x.ID,
                x.AssigneeContactID,
                x.AssignerContactID,
                x.Title,
                x.SubTitle,
                x.StartDate,
                x.DueDate,
                x.MHrAssigned,
                x.ProjectID,
                x.StatusFlag,
                x.Assignee,
                x.Modified,
                Assigner = b.Name
            }).Join(projectsWithCompany, a => a.ProjectID, b => b.ProjectID, (x, b) => new
            {
                x.ID,
                x.AssigneeContactID,
                x.AssignerContactID,
                x.Title,
                x.SubTitle,
                x.StartDate,
                x.DueDate,
                x.MHrAssigned,
                x.ProjectID,
                x.StatusFlag,
                x.Assignee,
                x.Assigner,
                CompletedDate = x.Modified,
                b.Project,
                b.Company,
                Status = x.StatusFlag == McvConstant.TODO_STATUSFLAG_COMPLETED ? "COMPLETED" : (activeTasks.Where(t => t.EntityID == x.ID).Any() ? activeTasks.Where(t => t.EntityID == x.ID).FirstOrDefault().Title : "ACTIVE")
            })
            .ToList();

        var activeTodos = todosWithContactsAndProjects.Where(x => x.StatusFlag == McvConstant.TODO_STATUSFLAG_PENDING).ToList();
        var completedTodos = todosWithContactsAndProjects.Where(x => x.StatusFlag == McvConstant.TODO_STATUSFLAG_COMPLETED).ToList();

        var groupedTasks = tasksWithContacts
                        .GroupBy(t => t.Company) // First group by Company
                        .Select(companyGroup => new
                        {
                            Company = companyGroup.Key,
                            People = companyGroup
                                    .GroupBy(t => t.Name) // Then group by Name within each Company
                                    .Select(personGroup => new
                                    {
                                        Name = personGroup.Key,
                                        CompletedTasks = personGroup.Where(x => x.StatusFlag == McvConstant.WFTASK_STATUSFLAG_COMPLETED).Count(),
                                        CompletedTask_MHrAssigned = personGroup.Where(x => x.StatusFlag == McvConstant.WFTASK_STATUSFLAG_COMPLETED).Sum(x => x.MHrAssigned),
                                        CompletedTask_MHrConsumed = personGroup.Where(x => x.StatusFlag == McvConstant.WFTASK_STATUSFLAG_COMPLETED).Sum(x => x.MHrConsumed),

                                        ActiveTasks = personGroup.Where(x => x.StatusFlag != McvConstant.WFTASK_STATUSFLAG_COMPLETED).Count(),
                                        ActiveTask_MHrAssigned = personGroup.Where(x => x.StatusFlag != McvConstant.WFTASK_STATUSFLAG_COMPLETED).Sum(x => x.MHrAssigned),
                                        ActiveTask_MHrConsumed = personGroup.Where(x => x.StatusFlag != McvConstant.WFTASK_STATUSFLAG_COMPLETED).Sum(x => x.MHrConsumed),

                                    })
                                    .ToList()
                        })
                        .ToList();

        var _logoUrl = await sharedService.GetPresetValue(McvConstant.APP_LOGO_URL);
        var _senderEmail = await sharedService.GetPresetValue(McvConstant.REPORT_EMAIL_SENDER_ID);
        var _senderName = await sharedService.GetPresetValue(McvConstant.REPORT_EMAIL_SENDER_NAME);
        var _cc = await sharedService.GetPresetValue(McvConstant.REPORT_EMAIL_CC);

        var toList = new List<(string name, string email)>() {

                                                  new  (
                                                       "Kamlesh Rajjak",
                                                      "kamlesh.rajak@ecomep.in"
                                                  )
                                                };

        var ccList = new List<(string name, string email)>()
        {
            //new EmailContact {
            //                                     Name = "Core | Newarch",
            //                                     Email = "core@newarchllp.com"
            //                                 },
            //                                   new EmailContact {
            //                                       Name = "Backup | Newarch",
            //                                       Email = "backup@newarchllp.com"
            //                                   }
        };

        var _reportTitle = $"Studio Schedule for {todayIST.ToString("dd MMM yyyy")}";


        StringBuilder sb = new StringBuilder();
        sb.AppendLine("<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">");
        sb.AppendLine("<html xmlns=\"http://www.w3.org/1999/xhtml\">");
        sb.AppendLine("<head>");
        sb.AppendLine("    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />");
        sb.AppendLine("    <title>Email Design</title>");
        sb.AppendLine("    <meta name=\"viewport\" content=\"width=device-width; initial-scale=1.0;\" />");
        sb.AppendLine("    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=9; IE=8; IE=7; IE=EDGE\" />");
        sb.AppendLine("    <meta name=\"format-detection\" content=\"telephone=no\" />");
        sb.AppendLine("    <!--[if gte mso 9]><xml>");
        sb.AppendLine("    <o:OfficeDocumentSettings>");
        sb.AppendLine("    <o:AllowPNG />");
        sb.AppendLine("    <o:PixelsPerInch>96</o:PixelsPerInch>");
        sb.AppendLine("    </o:OfficeDocumentSettings>");
        sb.AppendLine("    </xml><![endif]-->");
        sb.AppendLine("    <style type=\"text/css\">");
        sb.AppendLine("        /* Some resets and issue fixes */");
        sb.AppendLine("        #outlook a {");
        sb.AppendLine("            padding: 0;");
        sb.AppendLine("        }");
        sb.AppendLine("");
        sb.AppendLine("        body {");
        sb.AppendLine("           background-color: #d5d5d5; width: 100% !important;margin:0;");
        sb.AppendLine("            -webkit-text-size-adjust: 100%;");
        sb.AppendLine("            -ms-text-size-adjust: 100%;");
        sb.AppendLine("        }");

        sb.AppendLine("        table{");
        sb.AppendLine("            mso-table-lspace: 0px;");
        sb.AppendLine("            mso-table-rspace: 0px;");
        sb.AppendLine("        }");
        sb.AppendLine("");
        sb.AppendLine("        table td {");
        sb.AppendLine("            border-collapse: collapse;");
        sb.AppendLine("        }");
        sb.AppendLine("");
        sb.AppendLine("        .ExternalClass * {");
        sb.AppendLine("            line-height: 115%;");
        sb.AppendLine("        }");
        sb.AppendLine("        /* End reset */");

        sb.AppendLine("    </style>");
        sb.AppendLine("</head>");
        sb.AppendLine("");
        sb.AppendLine("<body>");
        sb.AppendLine("");

        sb.AppendLine("");
        sb.AppendLine("    <div style=\"background-color: #fff;margin: 0 auto;font-family:Calibri;font-size:14px;line-height:1.8;padding-left:5px;padding-right:5px;padding: 5px;max-width:500px;box-shadow: 0 3px 1px -2px #16121233,0 2px 2px #00000024,0 1px 5px #0000001f;\">");

        sb.AppendLine("<div>");
        sb.AppendLine("        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%; border-collapse: collapse;\">");
        //sb.AppendLine("            <tr>");
        //sb.AppendLine("                <td align=\"right\" style=\"padding: 10px 0;\">");
        //sb.AppendLine($"<img style=\"max-width: 80px; max-height: 80px; object-fit: contain;\" alt=\"\" src=\"{_logoUrl}\" />");
        //sb.AppendLine("                </td>");
        //sb.AppendLine("            </tr>");
        sb.AppendLine("            <tr>");
        sb.AppendLine("                <td style=\"font-size: 18px; font-weight: bold; background-color: #4c9740; color:#fff; border-radius:6px; padding: 10px; text-align: center;\">");
        sb.AppendLine(_reportTitle.ToUpper());
        sb.AppendLine("                </td>");
        sb.AppendLine("            </tr>");
        sb.AppendLine("        </table>");
        sb.AppendLine("</div>");

        sb.AppendLine("<div style=\"padding: 5px; 10px;\">");
        sb.AppendLine("        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width: 100%; border-collapse: collapse\">");
        sb.AppendLine("            <tr>");
        sb.AppendLine("                <td valign=\"top\" width=\"120\" style=\"padding-bottom:5px;\">");
        sb.AppendLine("                    Report Date:");
        sb.AppendLine("                </td>");
        sb.AppendLine("                <td valign=\"top\" style=\"padding-bottom: 5px; font-weight:bold;\">");
        sb.AppendLine(ClockTools.GetISTNow().ToString("dd MMM yyyy"));
        sb.AppendLine("                </td>");
        sb.AppendLine("            </tr>");


        sb.AppendLine("        </table>");
        sb.AppendLine("");
        sb.AppendLine("        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width: 100%; border-collapse: collapse\">");
        sb.AppendLine("            <tr>");
        sb.AppendLine("                <td valign=\"top\"  >");
        sb.AppendLine("                    To:");
        sb.AppendLine("                </td>");
        sb.AppendLine("            </tr>");
        sb.AppendLine("            <tr>");
        sb.AppendLine("                <td valign=\"top\" style=\"padding-bottom: 5px;\">");
        sb.AppendLine("                    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width: 100%; border-collapse: collapse\">");
        foreach (var obj in toList)
        {
            sb.AppendLine("                        <tr>");
            sb.AppendLine("                            <td style=\"font-weight:bold;\">");
            sb.AppendLine(obj.name + " <i> (" + obj.email + ")</i>");
            sb.AppendLine("                            </td>");
            sb.AppendLine("                        </tr>");
        }
        sb.AppendLine("                    </table>");
        sb.AppendLine("                </td>");
        sb.AppendLine("            </tr>");
        sb.AppendLine("            <tr>");
        sb.AppendLine("                <td valign=\"top\" >");
        sb.AppendLine("                    CC:");
        sb.AppendLine("                </td>");
        sb.AppendLine("            </tr>");
        sb.AppendLine("            <tr>");
        sb.AppendLine("                <td valign=\"top\" style=\"padding-bottom: 5px;\">");
        sb.AppendLine("                    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width: 100%; border-collapse: collapse\">");
        foreach (var obj in ccList)
        {
            sb.AppendLine("                        <tr>");
            sb.AppendLine("                            <td style=\"font-weight:bold;\">");
            sb.AppendLine(obj.name + " <i> (" + obj.email + ")</i>");
            sb.AppendLine("                            </td>");
            sb.AppendLine("                        </tr>");
        }
        sb.AppendLine("                    </table>");
        sb.AppendLine("                </td>");
        sb.AppendLine("            </tr>");

        sb.AppendLine("        </table>");
        sb.AppendLine("</div>");

        sb.AppendLine("<div style=\"padding: 5px; 10px;\">");
        sb.AppendLine("        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width: 100%; border-collapse: collapse\">");
        sb.AppendLine("            <tr style=\"background-color: #8f8f8f;color: #fff;\">");
        sb.AppendLine("                <td valign=\"top\" style=\"padding: 5px;\">");
        sb.AppendLine($"<h4 style=\"font-weight:bold;font-size:16px;margin:0;\">TASK SUMMARY</h4>");
        sb.AppendLine("                </td>");
        sb.AppendLine("                <td valign=\"top\" style=\"padding: 5px;text-align:end;\">");
        //sb.AppendLine($"<small>{activeTasks.Count} </small>");
        sb.AppendLine("                </td>");
        sb.AppendLine("            </tr>");
        sb.AppendLine("        </table>");
        sb.AppendLine("");
        sb.AppendLine("        <table border=\"1px solid #fff;\" cellpadding=\"0\" cellspacing=\"0\" style=\"width: 100%; border-collapse: collapse;margin-bottom:10px;\">");
        sb.AppendLine("            <tr style=\"background-color:#c1c1c1\">");
        sb.AppendLine("                <th valign=\"top\" style=\"padding: 2px 5px;\" rowspan=\"2\">");
        sb.AppendLine($"Person");
        sb.AppendLine("                </th>");
        sb.AppendLine("                <th valign=\"top\" style=\"padding: 2px 5px;\" colspan=\"2\">");
        sb.AppendLine($"Completed");
        sb.AppendLine("                <th valign=\"top\" style=\"padding: 2px 5px;\" colspan=\"2\">");
        sb.AppendLine($"Active");
        sb.AppendLine("                </th>");
        sb.AppendLine("            </tr>");

        sb.AppendLine("            <tr style=\"background-color:#c1c1c1\">");
        sb.AppendLine("                <th valign=\"top\" style=\"padding: 2px 5px;\">");
        sb.AppendLine($"Assigned");
        sb.AppendLine("                </th>");
        sb.AppendLine("                <th valign=\"top\" style=\"padding: 2px 5px;\">");
        sb.AppendLine($"Consumed");
        sb.AppendLine("                </th>");
        sb.AppendLine("                <th valign=\"top\" style=\"padding: 2px 5px;\">");
        sb.AppendLine($"Assigned");
        sb.AppendLine("                </th>");
        sb.AppendLine("                <th valign=\"top\" style=\"padding: 2px 5px;\">");
        sb.AppendLine($"Consumed");
        sb.AppendLine("                </th>");
        sb.AppendLine("            </tr>");
        foreach (var grp in groupedTasks)
        {
            sb.AppendLine("            <tr style=\"background-color:#c1c1c1\">");
            sb.AppendLine("                <td valign=\"top\" style=\"padding: 2px 5px;\" colspan=\"5\">");
            sb.AppendLine($"<h4 style=\"font-weight:bold;font-size:14px;margin:0;\">{grp.Company} </h4>");
            sb.AppendLine("                </td>");
            sb.AppendLine("            </tr>");

            foreach (var personGrp in grp.People)
            {
                sb.AppendLine("            <tr >");
                sb.AppendLine("                <td valign=\"top\" style=\"padding: 2px 5px;\" rowspan=\"2\">");
                sb.AppendLine($"{personGrp.Name}");
                sb.AppendLine("                </td>");
                sb.AppendLine("                <td valign=\"top\" align=\"center\" style=\"padding: 2px 5px;\" colspan=\"2\">");
                sb.AppendLine($"{personGrp.CompletedTasks} tasks");
                sb.AppendLine("                </td>");

                sb.AppendLine("                <td valign=\"top\" align=\"center\" style=\"padding: 2px 5px;\" colspan=\"2\">");
                sb.AppendLine($"{personGrp.ActiveTasks} tasks");
                sb.AppendLine("                </td>");

                sb.AppendLine("            </tr>");

                sb.AppendLine("            <tr >");

                sb.AppendLine("                <td valign=\"top\" align=\"center\" style=\"padding: 2px 5px;\">");
                sb.AppendLine($"{personGrp.CompletedTask_MHrAssigned} mHr");
                sb.AppendLine("                </td>");
                sb.AppendLine("                <td valign=\"top\" align=\"center\" style=\"padding: 2px 5px;\">");
                sb.AppendLine($"{personGrp.CompletedTask_MHrConsumed} mHr");
                sb.AppendLine("                </td>");

                sb.AppendLine("                <td valign=\"top\" align=\"center\" style=\"padding: 2px 5px;\">");
                sb.AppendLine($"{personGrp.ActiveTask_MHrAssigned} mHr");
                sb.AppendLine("                </td>");
                sb.AppendLine("                <td valign=\"top\" align=\"center\" style=\"padding: 2px 5px;\">");
                sb.AppendLine($"{personGrp.ActiveTask_MHrConsumed} mHr");
                sb.AppendLine("                </td>");
                sb.AppendLine("            </tr>");
            }

        }
        sb.AppendLine("        </table>");
        sb.AppendLine("</div>");

        sb.AppendLine("<div style=\"padding: 5px; 10px;\">");
        sb.AppendLine("        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width: 100%; border-collapse: collapse\">");
        sb.AppendLine("            <tr style=\"background-color: #8f8f8f;color: #fff;\">");
        sb.AppendLine("                <td valign=\"top\" style=\"padding: 5px;\">");
        sb.AppendLine($"<h4 style=\"font-weight:bold;font-size:16px;margin:0;\">ACTIVE TASKS</h4>");
        sb.AppendLine("                </td>");
        sb.AppendLine("                <td valign=\"top\" style=\"padding: 5px;text-align:end;\">");
        sb.AppendLine($"<small>{activeTasks.Count} </small>");
        sb.AppendLine("                </td>");
        sb.AppendLine("            </tr>");
        sb.AppendLine("        </table>");
        sb.AppendLine("");
        foreach (var companyGroup in activeTasks.GroupBy(x => x.Company))
        {
            sb.AppendLine("        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width: 100%; border-collapse: collapse\">");
            sb.AppendLine("            <tr style=\"background-color:#c1c1c1\">");
            sb.AppendLine("                <td valign=\"top\" style=\"padding: 2px 5px;\">");
            sb.AppendLine($"<h4 style=\"font-weight:bold;font-size:14px;margin:0;\">{companyGroup.Key} </h4>");
            sb.AppendLine("                </td>");
            sb.AppendLine("                <td valign=\"top\" style=\"padding: 2px 5px;text-align:end;\">");
            sb.AppendLine($"<small>{companyGroup.Count()} </small>");
            sb.AppendLine("                </td>");
            sb.AppendLine("            </tr>");
            sb.AppendLine("        </table>");
            sb.AppendLine("");

            sb.AppendLine("        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width: 100%; border-collapse: collapse;\">");
            foreach (var taskGrp in companyGroup.GroupBy(x => x.Title))
            {
                sb.AppendLine("            <tr style=\"background-color:#ebebeb\">");
                sb.AppendLine("                <td valign=\"top\" style=\"padding: 2px 5px;\">");
                sb.AppendLine($"<h4 style=\"font-weight:bold;font-size:14px;margin:0;\">{taskGrp.Key} </h4>");
                sb.AppendLine("                </td>");
                sb.AppendLine("                <td valign=\"top\" style=\"padding: 2px 5px;text-align:end;\">");
                sb.AppendLine($"<small>{taskGrp.Count()} </small>");
                sb.AppendLine("                </td>");
                sb.AppendLine("            </tr>");

                foreach (var obj in taskGrp)
                {
                    sb.AppendLine("                        <tr style=\"border-bottom:1px solid #cccccc;\">");

                    sb.AppendLine("                            <td style=\"width:50%;vertical-align:top;\">");
                    sb.AppendLine($"<h6 style=\"font-weight:bold;font-size:12px;margin:0;\">{obj.Name}</h6>");
                    sb.AppendLine($"<small>{obj.Title} | {obj.Subtitle}</small>");
                    sb.AppendLine("                            </td>");

                    sb.AppendLine("<td style=\"text-align:end;vertical-align:top;\">");
                    sb.AppendLine($"<h6 style=\"font-size:12px;font-weight:bold;margin:0;\">Status: {(obj.StatusFlag == McvConstant.WFTASK_STATUSFLAG_STARTED ? "STARTED" : (obj.StatusFlag == McvConstant.WFTASK_STATUSFLAG_PAUSED ? "PAUSED" : "PENDING"))}{(obj.DueDate < todayUTC ? " & DELAYED" : "")}</h6>");
                    sb.AppendLine($"<h6 style=\"font-size:12px;margin:0;\">DueDate: {ClockTools.GetIST(obj.DueDate).ToString("dd MMM yyyy HH:mm")} | Assigned: {obj.MHrAssigned} mHr </h6>");
                    sb.AppendLine($"<small>Assigned by: {obj.Assigner}</small>");
                    sb.AppendLine("                            </td>");

                    sb.AppendLine("                        </tr>");
                }

            }
            sb.AppendLine("        </table>");
        }
        sb.AppendLine("</div>");

        ///COMPLETED TASKS

        sb.AppendLine("<div style=\"padding: 5px; 10px;\">");
        sb.AppendLine("        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width: 100%; border-collapse: collapse\">");
        sb.AppendLine("            <tr style=\"background-color: #8f8f8f;color: #fff;\">");
        sb.AppendLine("                <td valign=\"top\" style=\"padding: 5px;\">");
        sb.AppendLine($"<h4 style=\"font-weight:bold;font-size:16px;margin:0;\">COMPLETED TASKS</h4>");
        sb.AppendLine("                </td>");
        sb.AppendLine("                <td valign=\"top\" style=\"padding: 5px;text-align:end;\">");
        sb.AppendLine($"<small>{completedTasks.Count} </small>");
        sb.AppendLine("                </td>");
        sb.AppendLine("            </tr>");
        sb.AppendLine("        </table>");
        sb.AppendLine("");
        foreach (var grp in completedTasks.GroupBy(x => x.Company))
        {
            sb.AppendLine("        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width: 100%; border-collapse: collapse\">");
            sb.AppendLine("            <tr style=\"background-color:#c1c1c1\">");
            sb.AppendLine("                <td valign=\"top\" style=\"padding: 2px 5px;\">");
            sb.AppendLine($"<h4 style=\"font-weight:bold;font-size:14px;margin:0;\">{grp.Key} </h4>");
            sb.AppendLine("                </td>");
            sb.AppendLine("                <td valign=\"top\" style=\"padding: 2px 5px;text-align:end;\">");
            sb.AppendLine($"<small>{grp.Count()} </small>");
            sb.AppendLine("                </td>");
            sb.AppendLine("            </tr>");
            sb.AppendLine("        </table>");
            sb.AppendLine("");
            sb.AppendLine("        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width: 100%; border-collapse: collapse;\">");
            foreach (var taskGrp in grp.GroupBy(x => x.Title))
            {
                sb.AppendLine("            <tr style=\"background-color:#ebebeb\">");
                sb.AppendLine("                <td valign=\"top\" style=\"padding: 2px 5px;\">");
                sb.AppendLine($"<h4 style=\"font-weight:bold;font-size:14px;margin:0;\">{taskGrp.Key} </h4>");
                sb.AppendLine("                </td>");
                sb.AppendLine("                <td valign=\"top\" style=\"padding: 2px 5px;text-align:end;\">");
                sb.AppendLine($"<small>{taskGrp.Count()} </small>");
                sb.AppendLine("                </td>");
                sb.AppendLine("            </tr>");
                foreach (var obj in grp)
                {

                    sb.AppendLine("                        <tr style=\"border-bottom:1px solid #cccccc;\">");

                    sb.AppendLine("                            <td style=\"width:50%;vertical-align:top;\">");
                    sb.AppendLine($"<h6 style=\"font-weight:bold;font-size:12px;margin:0;\">{obj.Name}</h6>");
                    sb.AppendLine($"<small>{obj.Title} | {obj.Subtitle}</small>");
                    sb.AppendLine("                            </td>");

                    sb.AppendLine("<td style=\"text-align:end;vertical-align:top;\">");
                    sb.AppendLine($"<h6 style=\"font-size:12px;margin:0;\">Completed Date: {ClockTools.GetIST(obj.CompletedDate.Value).ToString("dd MMM yyyy HH:mm")} | Consumed: {obj.MHrConsumed} mHr </h6>");
                    sb.AppendLine($"<h6 style=\"font-size:12px;margin:0;\">Due Date: {ClockTools.GetIST(obj.DueDate).ToString("dd MMM yyyy HH:mm")} | Assigned: {obj.MHrAssigned} mHr </h6>");
                    sb.AppendLine($"<small>Assigned by: {obj.Assigner}</small>");
                    sb.AppendLine("                            </td>");

                    sb.AppendLine("                        </tr>");


                }
            }
            sb.AppendLine("        </table>");
        }
        sb.AppendLine("</div>");

        sb.AppendLine("<div style=\"padding: 5px; 10px;\">");
        sb.AppendLine("        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width: 100%; border-collapse: collapse\">");
        sb.AppendLine("            <tr style=\"background-color: #8f8f8f;color: #fff;\">");
        sb.AppendLine("                <td valign=\"top\" style=\"padding: 5px;\">");
        sb.AppendLine($"<h4 style=\"font-weight:bold;font-size:16px;margin:0;\">ACTIVE TODO </h4>");
        sb.AppendLine("                </td>");
        sb.AppendLine("                <td valign=\"top\" style=\"padding: 5px;text-align:end;\">");
        sb.AppendLine($"<small>{activeTodos.Count} </small>");
        sb.AppendLine("                </td>");
        sb.AppendLine("            </tr>");
        sb.AppendLine("        </table>");
        sb.AppendLine("");
        foreach (var grp in activeTodos.GroupBy(x => x.Company))
        {
            sb.AppendLine("        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width: 100%; border-collapse: collapse\">");
            sb.AppendLine("            <tr style=\"background-color:#c1c1c1\">");
            sb.AppendLine("                <td valign=\"top\" style=\"padding: 2px 5px;\">");
            sb.AppendLine($"<h4 style=\"font-weight:bold;font-size:14px;margin:0;\">{grp.Key} </h4>");
            sb.AppendLine("                </td>");
            sb.AppendLine("                <td valign=\"top\" style=\"padding: 2px 5px;text-align:end;\">");
            sb.AppendLine($"<small>{grp.Count()} </small>");
            sb.AppendLine("                </td>");
            sb.AppendLine("            </tr>");
            sb.AppendLine("        </table>");
            sb.AppendLine("");
            sb.AppendLine("        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width: 100%; border-collapse: collapse;\">");

            foreach (var obj in grp)
            {



                sb.AppendLine("                        <tr style=\"border-bottom:1px solid #cccccc;\">");

                sb.AppendLine("                            <td style=\"width:50%;vertical-align:top;\">");
                sb.AppendLine($"<h6 style=\"font-weight:bold;font-size:12px;margin:0;\">{obj.Title}</h6>");
                sb.AppendLine($"<div><small >{obj.SubTitle}</small></div>");
                sb.AppendLine("                            </td>");

                sb.AppendLine("                            <td style=\"text-align:end;vertical-align:top;\">");

                sb.AppendLine($"<h6 style=\"font-size:12px;margin:0;\">DueDate: {ClockTools.GetIST(obj.DueDate).ToString("dd MMM yyyy")} | Assigned: {obj.MHrAssigned}MHr </h6>");
                sb.AppendLine($"<div><small>Assigned To: {obj.Assignee}</small></div>");
                sb.AppendLine($"<div><small>Assigned By: {obj.Assigner}</small></div>");
                sb.AppendLine($"<div><small>Active Task: {obj.Status}</small></div>");

                sb.AppendLine("                            </td>");
                sb.AppendLine("                        </tr>");


            }

            sb.AppendLine("        </table>");
        }
        sb.AppendLine("</div>");

        //COMPLETED TODO
        sb.AppendLine("<div style=\"padding: 5px; 10px;\">");
        sb.AppendLine("        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width: 100%; border-collapse: collapse\">");
        sb.AppendLine("            <tr style=\"background-color: #8f8f8f;color: #fff;\">");
        sb.AppendLine("                <td valign=\"top\" style=\"padding: 5px;\">");
        sb.AppendLine($"<h4 style=\"font-weight:bold;font-size:16px;margin:0;\">COMPLETED TODO </h4>");
        sb.AppendLine("                </td>");
        sb.AppendLine("                <td valign=\"top\" style=\"padding: 5px;text-align:end;\">");
        sb.AppendLine($"<small>{completedTodos.Count} </small>");
        sb.AppendLine("                </td>");
        sb.AppendLine("            </tr>");
        sb.AppendLine("        </table>");
        sb.AppendLine("");
        foreach (var grp in completedTodos.GroupBy(x => x.Company))
        {
            sb.AppendLine("        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width: 100%; border-collapse: collapse\">");
            sb.AppendLine("            <tr style=\"background-color:#c1c1c1\">");
            sb.AppendLine("                <td valign=\"top\" style=\"padding: 2px 5px;\">");
            sb.AppendLine($"<h4 style=\"font-weight:bold;font-size:14px;margin:0;\">{grp.Key} </h4>");
            sb.AppendLine("                </td>");
            sb.AppendLine("                <td valign=\"top\" style=\"padding: 2px 5px;text-align:end;\">");
            sb.AppendLine($"<small>{grp.Count()} </small>");
            sb.AppendLine("                </td>");
            sb.AppendLine("            </tr>");
            sb.AppendLine("        </table>");
            sb.AppendLine("");
            sb.AppendLine("        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width: 100%; border-collapse: collapse;\">");

            foreach (var obj in grp)
            {



                sb.AppendLine("                        <tr style=\"border-bottom:1px solid #cccccc;\">");

                sb.AppendLine("                            <td style=\"width:50%;vertical-align:top;\">");
                sb.AppendLine($"<h6 style=\"font-weight:bold;font-size:12px;margin:0;\">{obj.Title}</h6>");
                sb.AppendLine($"<div><small >{obj.SubTitle}</small></div>");
                sb.AppendLine("                            </td>");

                sb.AppendLine("                            <td style=\"text-align:end;vertical-align:top;\">");

                sb.AppendLine($"<h6 style=\"font-size:12px;margin:0;\">Completed: {ClockTools.GetIST(obj.CompletedDate).ToString("dd MMM yyyy")} </h6>");
                sb.AppendLine($"<h6 style=\"font-size:12px;margin:0;\">DueDate: {ClockTools.GetIST(obj.DueDate).ToString("dd MMM yyyy")} | Assigned: {obj.MHrAssigned}MHr </h6>");
                sb.AppendLine($"<div><small>Assigned To: {obj.Assignee}</small></div>");
                sb.AppendLine($"<div><small>Assigned By: {obj.Assigner}</small></div>");
                //sb.AppendLine($"<div><small>Active Task: {obj.Status}</small></div>");

                sb.AppendLine("                            </td>");
                sb.AppendLine("                        </tr>");


            }

            sb.AppendLine("        </table>");
        }
        sb.AppendLine("</div>");

        //FOOTER
        sb.AppendLine("<div style=\"border-bottom: 1px solid #cccccc; margin-top: 15px; margin-bottom: 15px; \"></div>");
        sb.AppendLine("        <table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%; border-collapse: collapse;font-size:11px;\">");

        sb.AppendLine("");
        sb.AppendLine("            <tr>");
        sb.AppendLine("");
        sb.AppendLine("                <td align=\"center\" >");
        sb.AppendLine("This is a <b>MyCockpitView<sup>&copy;</sup></b> generated e-mail.");
        sb.AppendLine("</td>");
        sb.AppendLine("            </tr>");
        sb.AppendLine("");
        sb.AppendLine("            <tr>");
        sb.AppendLine("");
        sb.AppendLine("                <td align=\"center\" >");
        sb.AppendLine("");
        sb.AppendLine("                    Powered by <b>Newarch<sup>&reg;</sup> Infotech LLP</b>");
        sb.AppendLine("");
        sb.AppendLine("                </td>");
        sb.AppendLine("            </tr>");
        sb.AppendLine("        </table>");
        sb.AppendLine("    </div>");

        sb.AppendLine("</body>");
        sb.AppendLine("");
        sb.AppendLine("</html>");

        var _emailBody = sb.ToString();

        await sharedService.SendMail(_reportTitle, _senderName, _senderEmail, _emailBody, toList, ccList);


        return Ok();
    }

}