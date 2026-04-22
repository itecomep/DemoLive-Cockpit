using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.ActivityModule;
using MyCockpitView.WebApi.ContactModule.Services;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.WebApi.LeaveModule.Dtos;
using MyCockpitView.WebApi.LeaveModule.Entities;
using MyCockpitView.WebApi.LeaveModule.Services;
using MyCockpitView.WebApi.NotificationModule;
using MyCockpitView.WebApi.NotificationModule.Entities;
using MyCockpitView.WebApi.Responses;
using MyCockpitView.WebApi.Services;
using MyCockpitView.WebApi.WFTaskModule.Services;

namespace MyCockpitView.WebApi.LeaveModule.Controllers;

[Authorize]
[ApiController]
[Route("[controller]")]
public class LeaveController : ControllerBase
{
    ILogger<LeaveController> logger;
    private readonly ILeaveService service;
    private readonly IMapper mapper;
    private readonly IActivityService activityService;
    private readonly IWFTaskService wFTaskService;
    private readonly IContactService contactService;
    private readonly ISharedService sharedService;
    private readonly EntitiesContext db;
    private readonly ICurrentUserService _currentUserService;
    private readonly IHubContext<NotificationHub> _hub;
    public LeaveController(
         ILogger<LeaveController> logger,
         EntitiesContext entitiesContext,
         ILeaveService service,
         IMapper mapper,
         IActivityService activityService,
         IWFTaskService wFTaskService,
         ISharedService sharedService,
         IContactService contactService,
         ICurrentUserService currentUserService,
         IHubContext<NotificationHub> hub
         )
    {
        this.logger = logger;
        db = entitiesContext;
        this.service = service;
        this.mapper = mapper;
        this.activityService = activityService;
        this.wFTaskService = wFTaskService;
        this.sharedService = sharedService;
        this.contactService = contactService;
        _currentUserService = currentUserService;
        _hub = hub;
    }


    [Authorize]
    [HttpGet]

    public async Task<IActionResult> Get(string Filters = null, string Search = null, string Sort = null)
    {

        var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort)
            .Include(x => x.Contact);

        var results = mapper.Map<IEnumerable<LeaveDto>>(await query.ToListAsync());

        var _statusMasters = await db.StatusMasters.AsNoTracking()
             .Where(x => x.Entity == nameof(Leave))
             .ToListAsync();
        var _typeMasters = await db.TypeMasters.AsNoTracking()
           .Where(x => x.Entity == nameof(Leave))
           .ToListAsync();
        foreach (var obj in results)
        {
            obj.Title = _typeMasters.Where(x => x.Value == obj.TypeFlag).Any() ? _typeMasters.Where(x => x.Value == obj.TypeFlag).FirstOrDefault().Title : null;
            obj.TypeValue = _typeMasters.Where(x => x.Value == obj.TypeFlag).Any() ? _typeMasters.Where(x => x.Value == obj.TypeFlag).FirstOrDefault().Title : null;
            obj.StatusValue = _statusMasters.Where(x => x.Value == obj.StatusFlag).Any() ? _statusMasters.Where(x => x.Value == obj.StatusFlag).FirstOrDefault().Title : null;
        }



        return Ok(results);

    }

    [Authorize]
    [HttpGet("Count")]
    public async Task<IActionResult> GetCount(string Filters = null, string Search = null, string Sort = null)
    {

        var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort);

        return Ok(await query.CountAsync());

    }

    [Authorize]
    [HttpGet("Pages")]
    public async Task<IActionResult> GetPages(int page = 0, int pageSize = 10, string Filters = null, string Search = null, string Sort = null)
    {

        var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort)
            .Include(x => x.Contact);

        var totalCount = await query.CountAsync();
        var totalPages = (int)Math.Ceiling((decimal)totalCount / pageSize);

        var results = mapper.Map<IEnumerable<LeaveDto>>(await query
        .Skip(pageSize * page)
        .Take(pageSize).ToListAsync());

        var _statusMasters = await db.StatusMasters.AsNoTracking()
              .Where(x => x.Entity == nameof(Leave))
              .ToListAsync();
        var _typeMasters = await db.TypeMasters.AsNoTracking()
           .Where(x => x.Entity == nameof(Leave))
           .ToListAsync();
        foreach (var obj in results)
        {
            obj.Title = _typeMasters.Where(x => x.Value == obj.TypeFlag).Any() ? _typeMasters.Where(x => x.Value == obj.TypeFlag).FirstOrDefault().Title : null;
            obj.TypeValue = _typeMasters.Where(x => x.Value == obj.TypeFlag).Any() ? _typeMasters.Where(x => x.Value == obj.TypeFlag).FirstOrDefault().Title : null;
            obj.StatusValue = _statusMasters.Where(x => x.Value == obj.StatusFlag).Any() ? _statusMasters.Where(x => x.Value == obj.StatusFlag).FirstOrDefault().Title : null;
        }



        return Ok(new PagedResponse<LeaveDto>(results, totalCount, totalPages));

    }

    // GET: api/Leaves/5
    [Authorize]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetByID(int ID)
    {

        var obj = mapper.Map<LeaveDto>(await service.GetById(ID));

        var _statusMasters = await db.StatusMasters.AsNoTracking()
              .Where(x => x.Entity == nameof(Leave))
              .ToListAsync();
        var _typeMasters = await db.TypeMasters.AsNoTracking()
           .Where(x => x.Entity == nameof(Leave))
           .ToListAsync();

        obj.Title = _typeMasters.Where(x => x.Value == obj.TypeFlag).Any() ? _typeMasters.Where(x => x.Value == obj.TypeFlag).FirstOrDefault().Title : null;
        obj.TypeValue = _typeMasters.Where(x => x.Value == obj.TypeFlag).Any() ? _typeMasters.Where(x => x.Value == obj.TypeFlag).FirstOrDefault().Title : null;
        obj.StatusValue = _statusMasters.Where(x => x.Value == obj.StatusFlag).Any() ? _statusMasters.Where(x => x.Value == obj.StatusFlag).FirstOrDefault().Title : null;


        return Ok(obj);

    }

    [HttpGet("MonthSummary/{id}")]
    public async Task<IActionResult> GetMonthSummary(int id, int year, int month)
    {

        var query = await service.GetMonthSummary(id, year, month);

        return Ok(query);

    }

    [HttpGet("PerMonthSummary/{id}")]
    public async Task<IActionResult> GetPerMonthSummary(int id, int index = 0)
    {

        var query = await service.GetPerMonthSummary(id, index);

        return Ok(query);

    }

    [HttpGet("TotalSummary/{id}")]
    public async Task<IActionResult> GetTotalSummary(int id, int index = 0)
    {

        var query = await service.GetTotalSummary(id, index);

        return Ok(query);

    }

    [HttpPost("Validate")]
    [Authorize]
    public async Task<IActionResult> Validate([FromBody] LeaveDto Dto)
    {

        var contact = await contactService.Get().SingleOrDefaultAsync(x => x.Username == User.Identity.Name);


        await service.ValidateApplication(mapper.Map<Leave>(Dto), contact != null && Dto.ContactID == contact.ID);

        return Ok();

    }

    [HttpPost("Split")]
    [Authorize]
    public async Task<IActionResult> Split([FromBody] LeaveDto Dto)
    {
        var result = await service.GetSplitLeave(mapper.Map<Leave>(Dto));
        return Ok(mapper.Map<IEnumerable<LeaveDto>>(result));
    }


    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] LeaveDto Dto)
    {

        var obj = mapper.Map<LeaveDto>(await service.GetById(await service.Create(mapper.Map<Leave>(Dto))));
        if (obj == null) throw new BadRequestException($"{nameof(Leave)} could not be created!");

        var _typeMaster = await db.TypeMasters.AsNoTracking()
  .Where(x => x.Entity == nameof(Leave))
    .FirstOrDefaultAsync(x => x.Value == obj.TypeFlag);


        var username = _currentUserService.GetCurrentUsername();
        var currentContact = await contactService.Get()
            .FirstOrDefaultAsync(x => x.Username == username);
        if (currentContact != null)
        {
            await activityService.LogUserActivity(currentContact, nameof(Leave), obj.ID, $"{obj.TypeValue}", $"{obj.Start.ToString("dd MMM yyyy")} - {obj.End.ToString("dd MMM yyyy")} | {obj.Total} Days ", "Created", obj.Reason);
        }


        return Ok(mapper.Map<LeaveDto>(obj));
    }

    [Authorize]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Put(int id, [FromBody] LeaveDto Dto)
    {

        if (id != Dto.ID)
        {
            return BadRequest();
        }

        await service.Update(mapper.Map<Leave>(Dto));
        var responseDto = mapper.Map<LeaveDto>(await service.GetById(id));

        var typeMasters = await db.TypeMasters
            .AsNoTracking()
            .Where(x => x.Entity == nameof(Leave))
            .ToListAsync();

        responseDto.TypeValue = typeMasters.FirstOrDefault(x => x.Value == responseDto.TypeFlag)?.Title ?? "";

        var statusMasters = await db.StatusMasters
  .AsNoTracking()
  .Where(x => x.Entity == nameof(Leave))
  .ToListAsync();

        responseDto.StatusValue = statusMasters.FirstOrDefault(x => x.Value == responseDto.TypeFlag)?.Title ?? "";

        var username = _currentUserService.GetCurrentUsername();
        var currentContact = await contactService.Get()
            .FirstOrDefaultAsync(x => x.Username == username);
        if (currentContact != null)
        {
            await activityService.LogUserActivity(currentContact, nameof(Leave), responseDto.ID, $"{responseDto.TypeValue}", $"{responseDto.Start.ToString("dd MMM yyyy")} - {responseDto.End.ToString("dd MMM yyyy")} | {responseDto.Total} Days ", "Updated", responseDto.Reason);
        }


        return Ok(responseDto);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var responseDto = mapper.Map<LeaveDto>(await service.GetById(id));
        if (responseDto == null) return BadRequest($"{nameof(Leave)} not found!");

        await service.Delete(id);

        var username = _currentUserService.GetCurrentUsername();
        var currentContact = await contactService.Get()
            .FirstOrDefaultAsync(x => x.Username == username);
        if (currentContact != null)
        {
            await activityService.LogUserActivity(currentContact, nameof(Leave), responseDto.ID, $"{responseDto.TypeValue}", $"{responseDto.Start.ToString("dd MMM yyyy")} - {responseDto.End.ToString("dd MMM yyyy")} | {responseDto.Total} Days ", "Deleted", responseDto.Reason);
        }

        await wFTaskService.PurgePendingTasks(nameof(Leave), id);

        return NoContent();
    }

    [HttpGet("LeaveList")]
    public async Task<IActionResult> GetLeaveList()
    {
        var query = service.Get(null, null, null)
            .Include(x => x.Contact)
            .Include(x => x.Attachments);

        var leaves = await query.ToListAsync();

        var statusMasters = await db.StatusMasters
            .Where(x => x.Entity == nameof(Leave))
            .ToListAsync();

        var typeMasters = await db.TypeMasters
            .Where(x => x.Entity == nameof(Leave))
            .ToListAsync();

        var result = leaves.Select(x => new LeaveListDto
        {
            Id = x.ID,
            EmployeeName = x.Contact != null ? x.Contact.Name : "",
            ApplicationType = typeMasters
                .FirstOrDefault(t => t.Value == x.TypeFlag)?.Title,

            Reason = x.Reason,
            StartDate = x.Start,
            EndDate = x.End,
            Days = x.Total,

            Status = statusMasters
                .FirstOrDefault(s => s.Value == x.StatusFlag)?.Title,

            StatusFlag = x.StatusFlag,

            AttachmentUrl = x.Attachments != null && x.Attachments.Any()
                ? x.Attachments.First().Url
                : null
        });

        return Ok(result);
    }

    [HttpPut("update-status/{id}")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusDto body)
    {
        var leave = await service.Get()
            .Include(x => x.Contact)
            .FirstOrDefaultAsync(x => x.ID == id);

        if (leave == null) return NotFound();

        // 🔹 update status
        leave.StatusFlag = body.Status == "Approved" ? 1 : -1;

        await service.Update(leave);

        // 🔥 SEND NOTIFICATION
        var username = leave.Contact?.Username;

        if (!string.IsNullOrEmpty(username))
        {
            // 🔹 GET LEAVE TYPE FROM TYPEMASTERS
            var typeMasters = await db.TypeMasters
                .Where(x => x.Entity == nameof(Leave))
                .ToListAsync();

            var leaveType = typeMasters
                .FirstOrDefault(x => x.Value == leave.TypeFlag)?.Title ?? "Leave";

            // 🔹 FORMAT DATES
            var startDate = leave.Start.ToString("dd MMM yyyy");
            var endDate = leave.End.ToString("dd MMM yyyy");

            // 🔹 CREATE MESSAGE
            var message = leave.StatusFlag == 1
                ? $"✅ Your {leaveType} from {startDate} to {endDate} has been approved"
                : $"❌ Your {leaveType} from {startDate} to {endDate} has been rejected";

            var notification = new Notification
            {
                Username = username,
                Message = message,
                Source = "leave-status",
                CreatedAt = DateTime.UtcNow
            };

            db.Notifications.Add(notification);

            // 🔥 REALTIME PUSH
            if (NotificationHub.UserConnections.TryGetValue(username, out var connectionId))
            {
                await _hub.Clients.Client(connectionId)
                    .SendAsync("ReceiveNotification", notification);
            }

            await db.SaveChangesAsync();
        }

        return Ok();
    }
}
