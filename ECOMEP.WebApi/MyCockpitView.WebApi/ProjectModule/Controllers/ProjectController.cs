using AutoMapper;
using MyCockpitView.WebApi.ProjectModule.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.ActivityModule;


using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.Dtos;
using MyCockpitView.WebApi.Entities;
using MyCockpitView.WebApi.ContactModule.Services;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.WebApi.Responses;
using MyCockpitView.WebApi.Services;
using System.Text;
using MyCockpitView.WebApi.StatusMasterModule;
using MyCockpitView.WebApi.ContactModule.Entities;

namespace MyCockpitView.WebApi.Controllers;

[Route("[controller]")]
[ApiController]
public class ProjectController : ControllerBase
{

    ILogger<ProjectController> logger;
    private readonly IProjectService service;
    private readonly IMapper mapper;
    private readonly IActivityService activityService;
    private readonly IContactService contactService;
    private readonly IProjectAttachmentService projectAttachmentService;
    private readonly ISharedService sharedService;
    private readonly EntitiesContext db;
    private readonly ICurrentUserService _currentUserService;

    public ProjectController(
        ILogger<ProjectController> logger,
        EntitiesContext entitiesContext,
        IProjectService projectService,
        IMapper mapper,
        IActivityService activityService,
        IContactService contactService,
        IProjectAttachmentService projectAttachmentService,
        ISharedService sharedService,
        ICurrentUserService currentUserService
        )
    {
        this.logger = logger;
        db = entitiesContext;
        service = projectService;
        this.mapper = mapper;
        this.activityService = activityService;
        this.contactService = contactService;
        this.projectAttachmentService = projectAttachmentService;
        this.sharedService = sharedService;
        _currentUserService = currentUserService;
    }

    [Authorize]
    [HttpGet]

    public async Task<IActionResult> Get(string? Filters = null, string? Search = null, string? Sort = null)
    {

        var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort)
            .Include(x => x.Company);


        var results = mapper.Map<IEnumerable<ProjectListDto>>(await query.ToListAsync());

        var _statusMasters = await db.StatusMasters.AsNoTracking()
           .Where(x => x.Entity == nameof(Project))
           .ToListAsync();

        foreach (var obj in results)
        {
            obj.StatusValue = _statusMasters.Any(x => x.Value == obj.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == obj.StatusFlag).Title : "";

        }

        return Ok(results);

    }

    [HttpGet("GetRTProject")]
    public async Task<IActionResult> GetRTProjects()
    {
        var projects = await service.GetRTProject();
        if (projects == null) throw new NotFoundException(" No projects not found!");
        return Ok(projects);
    }

    // GET: api/Contacts/5
    [Authorize]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetByID(int id)
    {

        var results = mapper.Map<ProjectDto>(await service.GetById(id));

        if (results == null) throw new NotFoundException($"{nameof(Project)} not found!");

        var _statusMasters = await db.StatusMasters.AsNoTracking()
            .Where(x => x.Entity == nameof(Project))
            .ToListAsync();
        results.StatusValue = _statusMasters.Any(x => x.Value == results.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == results.StatusFlag).Title : "";

        return Ok(results);

    }

    [HttpGet("uid/{id:guid}")]
    public async Task<IActionResult> GetByGUID(Guid id)
    {

        var results = mapper.Map<ProjectDto>(await service.GetById(id));

        if (results == null) throw new NotFoundException($"{nameof(Project)} not found!");

        var _statusMasters = await db.StatusMasters.AsNoTracking()
                      .Where(x => x.Entity == nameof(Project))
                      .ToListAsync();
        results.StatusValue = _statusMasters.Any(x => x.Value == results.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == results.StatusFlag).Title : "";

        return Ok(results);

    }


    [Authorize]
    [HttpGet("Pages")]
    public async Task<IActionResult> GetPages(int page = 0, int pageSize = 10, string? Filters = null, string? Search = null, string? Sort = null)
    {

        var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort);
        var totalCount = await query.CountAsync();
        var totalPages = (int)Math.Ceiling((decimal)totalCount / pageSize);

        var results = mapper.Map<IEnumerable<ProjectListDto>>(await query
            .Skip(pageSize * page)
            .Take(pageSize).ToListAsync());

        var _statusMasters = await db.StatusMasters.AsNoTracking()
            .Where(x => x.Entity == nameof(Project))
            .ToListAsync();
        foreach (var obj in results)
        {
            obj.StatusValue = _statusMasters.Any(x => x.Value == obj.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == obj.StatusFlag).Title : "";


        }


        return Ok(new PagedResponse<ProjectListDto>(results, totalCount, totalPages));

    }

    [Authorize]
    [HttpGet("Options")]
    public async Task<IActionResult> GetOptions(string? Filters = null, string? Search = null, string? Sort = null)
    {
        var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort)
            ;

        var results = mapper.Map<IEnumerable<ProjectListDto>>(await query.ToListAsync());

        return Ok(results);
    }

    [Authorize]
    [HttpGet("Exists")]
    public async Task<IActionResult> Exists(string title)
    {

        var query = await service.Exist(title);

        return Ok(query);

    }

    [Authorize]
    [HttpGet("NewCode/{companyID}")]
    public async Task<IActionResult> GetNewCode(int companyID)
    {

        var query = await service.GetNewCode(companyID);

        return Ok(query);

    }


    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] ProjectDto Dto)
    {

        var results = mapper.Map<ProjectDto>(await service.GetById(await service.Create(mapper.Map<Project>(Dto))));
        if (results == null) throw new BadRequestException($"{nameof(Project)} could not be created!");

        var username = _currentUserService.GetCurrentUsername();
        var currentContact = await contactService.Get()
            .FirstOrDefaultAsync(x => x.Username == username);
        if (currentContact != null)
        {
            await activityService.LogUserActivity(currentContact, nameof(Project), results.ID,
                                                                results.Code + "-" + results.Title,
                                                                $"{nameof(Project)} | {results.Code}-{results.Title}",
                                                                "Created"
                                                                );
        }

        var _statusMasters = await db.StatusMasters.AsNoTracking()
               .Where(x => x.Entity == nameof(Project))
               .ToListAsync();
        results.StatusValue = _statusMasters.Any(x => x.Value == results.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == results.StatusFlag).Title : "";


        await projectAttachmentService.CreateProjectRootFolders(results.ID);

        await db.SaveChangesAsync();

        return Ok(results);

    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] ProjectDto Dto)
    {
        var _currentEntityValue = await service.GetById(Dto.ID);
        await service.Update(mapper.Map<Project>(Dto));

        var _statusMasters = await db.StatusMasters.AsNoTracking()
            .Where(x => x.Entity == nameof(Project))
            .ToListAsync();

        if (_currentEntityValue == null) return BadRequest("Project Not Found!!");

        //If Team Leader is assigned
        if (_currentEntityValue.ProjectManagerContactID == null && Dto.ProjectManagerContactID != null)
        {

            var _user = await db.Contacts.AsNoTracking()
                .SingleOrDefaultAsync(x => x.ID == Dto.ProjectManagerContactID);

            if (_user != null && _user.Username != null)
            {
                await sharedService.PushNotification(_user.Username, "Team Leader", $"You have been appointed as Team Leader for {_currentEntityValue.Title} project.", nameof(Project), _currentEntityValue.ID.ToString());
                var _emailTo = new List<(string name, string email)>();
                var currentUserMail = _user.Emails.Where(x => x.IsPrimary).FirstOrDefault();
                var _emailHeading = $"Team Leader Updated | {_currentEntityValue.Title}";
                var _emailMessage = $"You have been appointed as <span style=\"font-weight:bold; \" >Team Leader</span> for <span style=\"font-weight:bold; \" >{_currentEntityValue.Title}</span> project.";

                if (currentUserMail != null && currentUserMail.Email.EndsWith("@ecomep.in", StringComparison.OrdinalIgnoreCase))
                {
                    _emailTo.Add((_user.FullName, currentUserMail.Email));

                    await ProjectTeamLeader(_user,Dto,_emailHeading, _emailMessage, _emailTo);
                }
                else
                {
                    throw new Exception("Email Not Valid!!");
                }
            }
            else
            {
                throw new Exception("Username not found");
            }
        }
        else if (_currentEntityValue.ProjectManagerContactID != null && Dto.ProjectManagerContactID == null)
        {
            var _user = await db.Contacts.AsNoTracking()
                .SingleOrDefaultAsync(x => x.ID == _currentEntityValue.ProjectManagerContactID);

            if (_user != null && _user.Username != null)
            {
                await sharedService.PushNotification(_user.Username, "Team Leader", $"You have been removed as Team Leader from {_currentEntityValue.Title} project.", nameof(Project), _currentEntityValue.ID.ToString());

                var _emailTo = new List<(string name, string email)>();
                var currentUserMail = _user.Emails.Where(x => x.IsPrimary).FirstOrDefault();
                var _emailHeading = $"Team Leader Updated | {_currentEntityValue.Title}";
                var _emailMessage = $"You have been removed as <span style=\"font-weight:bold; \" >Team Leader</span> from <span style=\"font-weight:bold; \" >{_currentEntityValue.Title}</span> project.";

                if (currentUserMail != null && currentUserMail.Email.EndsWith("@ecomep.in", StringComparison.OrdinalIgnoreCase))
                {
                    _emailTo.Add((_user.FullName, currentUserMail.Email));

                    await ProjectTeamLeader(_user, Dto, _emailHeading, _emailMessage, _emailTo);
                }
                else
                {
                    throw new Exception("Email Not Valid!!");
                }
            }
            else
            {
                throw new Exception("Username not found");
            }
        }

        //If Junior Team Leader is assigned
        if (_currentEntityValue.AssistantProjectManagerContactID == null && Dto.AssistantProjectManagerContactID != null)
        {
            var _user = await db.Contacts.AsNoTracking()
                .SingleOrDefaultAsync(x => x.ID == Dto.AssistantProjectManagerContactID);

            if (_user != null && _user.Username != null)
            {
                await sharedService.PushNotification(_user.Username, "Junior Team Leader", $"You have been appointed as Junior Team Leader for {_currentEntityValue.Title} project.", nameof(Project), _currentEntityValue.ID.ToString());

                var _emailTo = new List<(string name, string email)>();
                var currentUserMail = _user.Emails.Where(x => x.IsPrimary).FirstOrDefault();
                var _emailHeading = $"Junior Team Leader Updated | {_currentEntityValue.Title}";
                var _emailMessage = $"You have been appointed as <span style=\"font-weight:bold; \">Junior Team Leader</span> for <span style=\"font-weight:bold; \" >{_currentEntityValue.Title}</span> project.";

                if (currentUserMail != null && currentUserMail.Email.EndsWith("@ecomep.in", StringComparison.OrdinalIgnoreCase))
                {
                    _emailTo.Add((_user.FullName, currentUserMail.Email));

                    await ProjectTeamLeader(_user, Dto, _emailHeading, _emailMessage, _emailTo);
                }
                else
                {
                    throw new Exception("Email Not Valid!!");
                }
            }
            else
            {
                throw new Exception("Username not found");
            }
        }
        else if (_currentEntityValue.AssistantProjectManagerContactID != null && Dto.AssistantProjectManagerContactID == null)
        {
            var _user = await db.Contacts.AsNoTracking()
                .SingleOrDefaultAsync(x => x.ID == _currentEntityValue.AssistantProjectManagerContactID);

            if (_user != null && _user.Username != null)
            {
                await sharedService.PushNotification(_user.Username, "Junior Team Leader", $"You have been removed as Junior Team Leader from {_currentEntityValue.Title} project.", nameof(Project), _currentEntityValue.ID.ToString());

                var _emailTo = new List<(string name, string email)>();
                var currentUserMail = _user.Emails.Where(x => x.IsPrimary).FirstOrDefault();
                var _emailHeading = $"Junior Team Leader Updated | {_currentEntityValue.Title}";
                var _emailMessage = $"You have been removed as <span style=\"font-weight:bold; \">Junior Team Leader</span> from <span style=\"font-weight:bold; \">{_currentEntityValue.Title}</span> project.";

                if (currentUserMail != null && currentUserMail.Email.EndsWith("@ecomep.in", StringComparison.OrdinalIgnoreCase))
                {
                    _emailTo.Add((_user.FullName, currentUserMail.Email));

                    await ProjectTeamLeader(_user, Dto, _emailHeading, _emailMessage, _emailTo);
                }
                else
                {
                    throw new Exception("Email Not Valid!!");
                }
            }
            else
            {
                throw new Exception("Username not found");
            }
        }

        if (_currentEntityValue.StatusFlag != Dto.StatusFlag)
        {
            if (Dto.ProjectManagerContactID != null)
            {
                var _user = await db.Contacts.AsNoTracking()
                    .SingleOrDefaultAsync(x => x.ID == Dto.ProjectManagerContactID);

                if (_user != null && _user.Username != null)
                {
                    var _status = _statusMasters.FirstOrDefault(x => x.Value == Dto.StatusFlag);

                    //Sends Notification to Project Manager/ Team Leader when status is changed
                    await sharedService.PushNotification(_user.Username, "Project Status Updated", $"{Dto.Title} status updated to {_status.Title} | {Dto.Comment}.", nameof(Project), _currentEntityValue.ID.ToString());

                    var emailTo = new List<(string name, string email)>();
                    var currentUserMail = _user.Emails.Where(x => x.IsPrimary).FirstOrDefault();

                    if (currentUserMail != null && currentUserMail.Email.EndsWith("@ecomep.in", StringComparison.OrdinalIgnoreCase))
                    {
                        emailTo.Add((_user.FullName, currentUserMail.Email));
                        //Sends Email to Project Manager / Team Leader when status is changed
                        await StatusChangeMail(Dto, _status, emailTo);
                    }
                }
                else
                {
                    throw new Exception("Username not found");
                }
            }

            if (Dto.AssistantProjectManagerContactID != null)
            {
                var _user = await db.Contacts.AsNoTracking()
                    .SingleOrDefaultAsync(x => x.ID == Dto.AssistantProjectManagerContactID);

                if (_user != null && _user.Username != null)
                {
                    var _status = _statusMasters.FirstOrDefault(x => x.Value == Dto.StatusFlag);

                    //Sends Notification to Assistant Project Manager/ Junior Team Leader when status is changed
                    await sharedService.PushNotification(_user.Username, "Project Status Updated", $"{Dto.Title} status updated to {_status.Title} | {Dto.Comment}.", nameof(Project), _currentEntityValue.ID.ToString());
                    //await sharedService.SendMail("Project Status Updated",)
                    var emailTo = new List<(string name, string email)>();
                    var currentUserMail = _user.Emails.Where(x => x.IsPrimary).FirstOrDefault();

                    if (currentUserMail != null && currentUserMail.Email.EndsWith("@ecomep.in", StringComparison.OrdinalIgnoreCase))
                    {
                        emailTo.Add((_user.FullName, currentUserMail.Email));
                        //Sends Email to Assistant Project Manager / Junior Team Leader when status is changed
                        await StatusChangeMail(Dto, _status, emailTo);
                    }
                }
                else
                {
                    throw new Exception("Username not found");
                }
            }
        }

        var results = mapper.Map<ProjectDto>(await service.GetById(id));
        if (results == null) throw new NotFoundException($"{nameof(Project)} not found!");

        var username = _currentUserService.GetCurrentUsername();
        var currentContact = await contactService.Get()
            .FirstOrDefaultAsync(x => x.Username == username);
        if (currentContact != null)
        {
            await activityService.LogUserActivity(currentContact, nameof(Project), results.ID,
                                                                results.Code + "-" + results.Title,
                                                                $"{nameof(Project)} | {results.Code}-{results.Title} | {results.Comment}", "Updated");
        }

        results.StatusValue = _statusMasters.Any(x => x.Value == results.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == results.StatusFlag).Title : "";
        return Ok(results);
    }

    [Authorize]
    [HttpGet("StageAnalysis")]
    public async Task<IActionResult> GetProjectStageAnalysis(string? Filters = null, string? Search = null, string? Sort = null)
    {
        var _results = await service.GetProjectStageAnalysis(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort);
        return Ok(_results);
    }

    //Here we are using private because asp.net core allows only one parameter to be bound from the request body
    private async Task StatusChangeMail(ProjectDto project, StatusMaster status, List<(string name, string email)>? toAddresses = null)
    {
        var _emailHeading = $"Project Status Updated | {project.Title}";
        var _emailMessage = "";
        var _senderName = await sharedService.GetPresetValue(McvConstant.REQUEST_TICKET_EMAIL_SENDER_NAME);
        var _senderEmail = await sharedService.GetPresetValue(McvConstant.REQUEST_TICKET_EMAIL_SENDER_ID);

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
        sb.AppendLine("            font-size: 21px;");
        sb.AppendLine("            padding: 5px 10px;");
        sb.AppendLine("            margin: 5px 0;");
        sb.AppendLine("            text-align: center;");
        sb.AppendLine("            font-weight: 600;");
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
        //sb.AppendLine("<div style=\"border-bottom: 1px solid #cccccc; margin-top: 15px; margin-bottom: 15px; \"></div>");

        //sb.AppendLine("        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%; border-collapse: collapse;\">");
        //if (_requestTicket.Entity != null)
        //{
        //    sb.AppendLine("            <tr>");
        //    sb.AppendLine("                <td valign=\"top\" width=\"150\" style=\"padding-bottom:5px;font-weight:bold;\">");
        //    sb.AppendLine(_requestTicket.Entity + ":");
        //    sb.AppendLine("                </td>");
        //    sb.AppendLine("                <td valign=\"top\" style=\"padding-bottom:5px;\">");
        //    sb.AppendLine(_requestTicket.EntityTitle);
        //    sb.AppendLine("                </td>");
        //    sb.AppendLine("            </tr>");
        //}

        //sb.AppendLine("            <tr>");
        //sb.AppendLine("                <td valign=\"top\" width=\"150\" style=\"padding-bottom:5px;font-weight:bold;\">");
        //sb.AppendLine("                    Subject:");
        //sb.AppendLine("                </td>");
        //sb.AppendLine("                <td valign=\"top\" style=\"padding-bottom:5px;\">");
        //sb.AppendLine($"Project Status Changed/Updated | {project.Title}");
        //sb.AppendLine("                </td>");
        //sb.AppendLine("            </tr>");

        //sb.AppendLine("            <tr>");
        //sb.AppendLine("                <td valign=\"top\" width=\"150\" style=\"padding-bottom:5px;font-weight:bold;\">");
        //sb.AppendLine("                    Date:");
        //sb.AppendLine("                </td>");
        //sb.AppendLine("                <td valign=\"top\" style=\"padding-bottom:5px;\">");
        //sb.AppendLine(ClockTools.GetIST(project.Modified).ToString("dd MMM yyyy"));
        //sb.AppendLine("                </td>");
        //sb.AppendLine("            </tr>");
        //sb.AppendLine("            <tr>");
        //sb.AppendLine("                <td valign=\"top\" width=\"150\" style=\"padding-bottom:5px;font-weight:bold;\">");
        //sb.AppendLine("                   Code:");
        //sb.AppendLine("                </td>");
        //sb.AppendLine("                <td valign=\"top\" style=\"padding-bottom:5px;\">");
        //sb.AppendLine(project.Code);
        //sb.AppendLine("                </td>");
        //sb.AppendLine("            </tr>");
        //sb.AppendLine("            <tr>");
        //sb.AppendLine("                <td valign=\"top\" width=\"150\" style=\"padding-bottom:5px;font-weight:bold;\">");
        //sb.AppendLine("                    Sent By:");
        //sb.AppendLine("                </td>");
        //sb.AppendLine("                <td valign=\"top\" style=\"padding-bottom:5px;\">");
        //sb.AppendLine($"{_senderName} ({_senderEmail})");

        //sb.AppendLine("                </td>");
        //sb.AppendLine("            </tr>");
        //if (_requestTicket.StatusFlag != McvConstant.REQUEST_TICKET_STATUSFLAG_COMPLETED)
        //{
        //    sb.AppendLine("            <tr>");
        //    sb.AppendLine("                <td valign=\"top\" width=\"150\" style=\"padding-bottom:5px;font-weight:bold;\">");
        //    sb.AppendLine("                    Next Reminder on:");
        //    sb.AppendLine("                </td>");
        //    sb.AppendLine("                <td valign=\"top\" style=\"padding-bottom:5px;\">");
        //    sb.AppendLine(ClockTools.GetIST(_requestTicket.NextReminderDate).ToString("dd MMM yyyy"));
        //    sb.AppendLine("                </td>");
        //    sb.AppendLine("            </tr>");
        //}
        //sb.AppendLine("        </table>");
        //sb.AppendLine("");
        //sb.AppendLine("        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%; border-collapse: collapse;\">");
        //sb.AppendLine("            <tr>");
        //sb.AppendLine("                <td valign=\"top\" style=\"font-weight:bold;\">");
        //sb.AppendLine("                    To:");
        //sb.AppendLine("                </td>");
        //sb.AppendLine("            </tr>");
        //sb.AppendLine("            <tr>");
        //sb.AppendLine("                <td valign=\"top\" style=\"padding-bottom:5px;\">");
        //sb.AppendLine("                    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%; border-collapse: collapse;\">");

        //foreach (var obj in toAddresses)
        //{
        //    sb.AppendLine("                        <tr>");
        //    sb.AppendLine("                            <td >");
        //    sb.AppendLine(obj.name + " <i> (" + obj.email + ")</i>");
        //    sb.AppendLine("                            </td>");
        //    sb.AppendLine("                        </tr>");
        //}

        //sb.AppendLine("                    </table>");
        //sb.AppendLine("                </td>");
        //sb.AppendLine("            </tr>");
        //sb.AppendLine("            <tr>");
        //sb.AppendLine("                <td valign=\"top\" style=\"font-weight:bold;\">");
        //sb.AppendLine("                    CC:");
        //sb.AppendLine("                </td>");
        //sb.AppendLine("            </tr>");
        //sb.AppendLine("            <tr>");
        //sb.AppendLine("                <td valign=\"top\" style=\"padding-bottom:5px;\">");
        //sb.AppendLine("                    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%; border-collapse: collapse;\">");
        //foreach (var obj in _requestTicket.Assignees.Where(x => x.TypeFlag == 1))
        //{
        //    sb.AppendLine("                        <tr>");
        //    sb.AppendLine("                            <td >");
        //    sb.AppendLine(obj.Name + " <i> (" + obj.Email + ")</i>");
        //    sb.AppendLine("                            </td>");
        //    sb.AppendLine("                        </tr>");
        //}
        //sb.AppendLine("                    </table>");
        //sb.AppendLine("                </td>");
        //sb.AppendLine("            </tr>");


        //sb.AppendLine("        </table>");
        sb.AppendLine("<div style=\"border-bottom: 1px solid #cccccc; margin-top: 15px; margin-bottom: 15px; \"></div>");

        sb.AppendLine("");
        sb.AppendLine("        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%; border-collapse: collapse;\">");
        sb.AppendLine("            <tr>");
        sb.AppendLine("                <td valign=\"top\" style=\"padding-top:5px;padding-bottom:5px;\">");
        sb.AppendLine("                    <pre style=\"font-family:Calibri;line-height:1.5; font-size: 14px;margin-top:0;margin-bottom:0; white-space: pre-wrap; white-space: -moz-pre-wrap;");
        sb.AppendLine("                                white-space: -pre-wrap; white-space: -o-pre-wrap; word-wrap: break-word;\">");

        //sb.AppendLine(_emailMessage);
        sb.AppendLine($"Dear {toAddresses[0].name},");
        sb.AppendLine($"We would like to inform you that the status of the project <span style=\"font-weight:bold; \" >{project.Title}</span> has been updated to <span style=\"font-weight:bold; \" >{status.Title}.</span>");
        sb.AppendLine("</pre>");
        sb.AppendLine($"<div style=\"padding-top:1rem;display:flex;align-items:center; justify-content:space-between; \">" +
            $"<div>Modified By:<span style=\"font-weight:bold; \" > {project.ModifiedBy}</span></div>  <div>Modified On:<span style=\"font-weight:bold; \" > {ClockTools.GetIST(project.Modified).ToString("dd MMM yyyy")}</span> </div> </div>");
        sb.AppendLine("<pre style=\"margin:0; \">");
        sb.AppendLine($"<div style=\"margin:0; padding:0;\">\"{project.Comment}\"</div>");
        sb.AppendLine("</pre>");
        sb.AppendLine("                </td>");
        sb.AppendLine("            </tr>");
        sb.AppendLine("        </table>");
        sb.AppendLine("");

        //FOOTER
        sb.AppendLine("<div style=\"border-bottom: 1px solid #cccccc; margin-top: 15px; margin-bottom: 15px; \"></div>");

        sb.AppendLine("");
        sb.AppendLine("        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%; border-collapse: collapse;\">");
        sb.AppendLine("            <tr>");
        sb.AppendLine("                <td valign=\"top\" style=\"padding-top:5px;padding-bottom:5px;\">");
        sb.AppendLine("                    <pre style=\"font-family:Calibri;line-height:1.5; font-size: 14px;margin-top:0;margin-bottom:0; white-space: pre-wrap; white-space: -moz-pre-wrap;");
        sb.AppendLine("                                white-space: -pre-wrap; white-space: -o-pre-wrap; word-wrap: break-word;\">");

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
        sb.AppendLine("        </table>");
        sb.AppendLine("");
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
        await sharedService.SendMail(
                    _emailHeading,
                    _senderName,
                    _senderEmail,
                    _emailBody,
                    toAddresses
                );
    }

    //Below method is used to send mail to Team Leader and Junior Team Leader
    private async Task ProjectTeamLeader(Contact user,ProjectDto project,string _emailHeading, string _emailMessage ,List<(string name, string email)>? toAddresses = null)
    {
        var _senderName = await sharedService.GetPresetValue(McvConstant.REQUEST_TICKET_EMAIL_SENDER_NAME);
        var _senderEmail = await sharedService.GetPresetValue(McvConstant.REQUEST_TICKET_EMAIL_SENDER_ID);

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
        sb.AppendLine("            font-size: 21px;");
        sb.AppendLine("            padding: 5px 10px;");
        sb.AppendLine("            margin: 5px 0;");
        sb.AppendLine("            text-align: center;");
        sb.AppendLine("            font-weight: 600;");
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

        sb.AppendLine("");
        sb.AppendLine("        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%; border-collapse: collapse;\">");
        sb.AppendLine("            <tr>");
        sb.AppendLine("                <td valign=\"top\" style=\"padding-top:5px;padding-bottom:5px;\">");
        sb.AppendLine("                    <pre style=\"font-family:Calibri;line-height:1.5; font-size: 14px;margin-top:0;margin-bottom:0; white-space: pre-wrap; white-space: -moz-pre-wrap;");
        sb.AppendLine("                                white-space: -pre-wrap; white-space: -o-pre-wrap; word-wrap: break-word;\">");

        //sb.AppendLine(_emailMessage);
        sb.AppendLine($"Dear {user.FullName},");
        //sb.AppendLine($"We would like to inform you that the status of the project <span style=\"font-weight:bold; \" >{project.Title}</span> has been updated to <span style=\"font-weight:bold; \" >{status.Title}.</span>");
        sb.AppendLine($"{_emailMessage}");
        sb.AppendLine("</pre>");
        sb.AppendLine($"<div style=\"padding-top:1rem;display:flex;align-items:center; justify-content:space-between; \">" +
            $"<div>Modified By:<span style=\"font-weight:bold; \" > {project.ModifiedBy}</span></div>  <div>Modified On:<span style=\"font-weight:bold; \" > {ClockTools.GetIST(project.Modified).ToString("dd MMM yyyy")}</span> </div> </div>");
        sb.AppendLine("<pre style=\"margin:0; \">");
        sb.AppendLine("</pre>");
        sb.AppendLine("                </td>");
        sb.AppendLine("            </tr>");
        sb.AppendLine("        </table>");
        sb.AppendLine("");

        //FOOTER
        sb.AppendLine("<div style=\"border-bottom: 1px solid #cccccc; margin-top: 15px; margin-bottom: 15px; \"></div>");

        sb.AppendLine("");
        sb.AppendLine("        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%; border-collapse: collapse;\">");
        sb.AppendLine("            <tr>");
        sb.AppendLine("                <td valign=\"top\" style=\"padding-top:5px;padding-bottom:5px;\">");
        sb.AppendLine("                    <pre style=\"font-family:Calibri;line-height:1.5; font-size: 14px;margin-top:0;margin-bottom:0; white-space: pre-wrap; white-space: -moz-pre-wrap;");
        sb.AppendLine("                                white-space: -pre-wrap; white-space: -o-pre-wrap; word-wrap: break-word;\">");

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
        sb.AppendLine("        </table>");
        sb.AppendLine("");
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
        await sharedService.SendMail(
                    _emailHeading,
                    _senderName,
                    _senderEmail,
                    _emailBody,
                    toAddresses
                );
    }


    [Authorize]
    [HttpGet("SearchTagOptions")]
    public async Task<IActionResult> GetSearchTagOptions()
    {
        var results = await service.GetSearchTagOptions();
        return Ok(results);
    }

    [Authorize]
    [HttpGet("FieldOptions")]
    public async Task<IActionResult> GetFieldOptions(string field)
    {
        return Ok(await service.GetFieldOptions(field));
    }


    [Authorize]
    [HttpGet("Analysis/{dataType}")]
    public async Task<IActionResult> GetAnalysis(string dataType, string? Filters = null, string? Search = null, string? Sort = null)
    {

        //if (dataType.Equals("lastbite", StringComparison.OrdinalIgnoreCase))
        //    return Ok(await service.GetLastBiteData(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null,, Search, Sort));
        //else if (dataType.Equals("cashflow", StringComparison.OrdinalIgnoreCase))
        //    return Ok(await service.GetCashflowData(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null,, Search, Sort));
        //else if (dataType.Equals("crm", StringComparison.OrdinalIgnoreCase))
        //    return Ok(await service.GetCRMData(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null,, Search, Sort));
        //else
        if (dataType.Equals("full", StringComparison.OrdinalIgnoreCase))
            return Ok(await service.GetAnalysisData(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort));
        else
            return BadRequest();

    }

    [HttpGet]
    [Route("Analysis/{dataType}/excel")]
    public async Task<IActionResult> GetAnalysisExcel(string dataType, string? Filters = null, string? Search = null, string? Sort = null)
    {


        var _report = await service.GetAnalysisExcel(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort);

        var _filename = $"ProjectAnalysis-{dataType.ToUpper()}-{ClockTools.GetISTNow().ToString("yyMMddHHmm")}.xlsx";

        if (_report == null) throw new BadRequestException("File not generated!");

        return new FileContentResult(_report, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        {
            FileDownloadName = _filename
        };

    }




}

