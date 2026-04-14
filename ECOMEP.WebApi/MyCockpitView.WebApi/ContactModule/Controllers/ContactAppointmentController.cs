using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.ActivityModule;
using MyCockpitView.WebApi.ContactModule.Services;
using MyCockpitView.Utility.Common;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.WebApi.ContactModule.Dtos;
using MyCockpitView.WebApi.ContactModule.Entities;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.ContactModule.Controllers;

[Route("[controller]")]
[ApiController]
public class ContactAppointmentController : ControllerBase
{
    ILogger<ContactAppointmentController> logger;
    private readonly IContactAppointmentService service;
    private readonly IMapper mapper;
    private readonly IActivityService activityService;
    private readonly IContactService contactService;
    private readonly IContactTeamMemberService contactTeamMemberService;
    private readonly ICurrentUserService _currentUserService;
    private readonly EntitiesContext db;
    public ContactAppointmentController(
        ILogger<ContactAppointmentController> logger,
        EntitiesContext db,
        IContactAppointmentService AppointmentService,
        IMapper mapper,
        IActivityService activityService,
        IContactService contactService,
        IContactTeamMemberService contactTeamMemberService,
        ICurrentUserService currentUserService
        )
    {
        this.logger = logger;
        this.db = db;
        service = AppointmentService;
        this.mapper = mapper;
        this.activityService = activityService;
        this.contactService = contactService;
        this.contactTeamMemberService = contactTeamMemberService;
        _currentUserService = currentUserService;
    }


    [Authorize]
    [HttpGet]
    public async Task<IActionResult> Get(string? Filters = null, string? Search = null, string? Sort = null)
    {

        var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort)
            .Include(x => x.Company)
            .Include(x=>x.ManagerContact)
            .Include(x=>x.Attachments)
            ;

        var results = mapper.Map<IEnumerable<ContactAppointmentDto>>(await query
            .ToListAsync());

        var _typeMasters = await db.TypeMasters.AsNoTracking()
             .Where(x => x.Entity == nameof(ContactAppointment))
             .ToListAsync();

        var _statusMasters = await db.StatusMasters.AsNoTracking()
          .Where(x => x.Entity == nameof(ContactAppointment))
          .ToListAsync();


        foreach (var obj in results)
        {
            obj.TypeValue = _typeMasters.Any(x => x.Value == obj.TypeFlag) ? _typeMasters.FirstOrDefault(x => x.Value == obj.TypeFlag)?.Title : "";
            obj.StatusValue = _statusMasters.Any(x => x.Value == obj.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == obj.StatusFlag)?.Title : "";
        }

        return Ok(results);

    }

    // GET: api/Appointments/5
    [Authorize]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetByID(int id)
    {

        var results = mapper.Map<ContactAppointmentDto>(await service.Get().Include(x => x.Company).Include(x => x.ManagerContact).Include(x => x.Attachments).SingleOrDefaultAsync(x=>x.ID==id));

        if (results == null) throw new NotFoundException($"{nameof(ContactAppointment)} not found!");

        var _typeMasters = await db.TypeMasters.AsNoTracking()
            .Where(x => x.Entity == nameof(ContactAppointment))
            .ToListAsync();
        results.TypeValue = _typeMasters.Any(x => x.Value == results.TypeFlag) ? _typeMasters.FirstOrDefault(x => x.Value == results.TypeFlag)?.Title : "";

        var _statusMasters = await db.StatusMasters.AsNoTracking()
          .Where(x => x.Entity == nameof(ContactAppointment))
          .ToListAsync();
        results.StatusValue = _statusMasters.Any(x => x.Value == results.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == results.StatusFlag)?.Title : "";

        return Ok(results);

    }

    [HttpGet("uid/{id:guid}")]
    public async Task<IActionResult> GetByGUID(Guid id)
    {

        var results = mapper.Map<ContactAppointmentDto>(await service.Get().Include(x => x.Company).Include(x => x.ManagerContact).Include(x => x.Attachments).SingleOrDefaultAsync(x => x.UID == id));

        if (results == null) throw new NotFoundException($"{nameof(ContactAppointment)} not found!");

        var _typeMasters = await db.TypeMasters.AsNoTracking()
           .Where(x => x.Entity == nameof(ContactAppointment))
           .ToListAsync();
        results.TypeValue = _typeMasters.Any(x => x.Value == results.TypeFlag) ? _typeMasters.FirstOrDefault(x => x.Value == results.TypeFlag).Title : "";

        var _statusMasters = await db.StatusMasters.AsNoTracking()
          .Where(x => x.Entity == nameof(ContactAppointment))
          .ToListAsync();
        results.StatusValue = _statusMasters.Any(x => x.Value == results.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == results.StatusFlag).Title : "";

        return Ok(results);

    }


    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Post([FromBody] ContactAppointmentDto Dto)
    {
        var id = await service.Create(mapper.Map<ContactAppointment>(Dto));
        var results = mapper.Map<ContactAppointmentDto>(await service.Get().Include(x => x.Company).Include(x => x.ManagerContact).Include(x => x.Attachments).SingleOrDefaultAsync(x => x.ID == id));

        if (results == null) throw new BadRequestException($"{nameof(ContactAppointment)} could not be created!");

        var contact = await db.Contacts.AsNoTracking().SingleOrDefaultAsync(x => x.ID == results.ContactID);
        if (contact == null) throw new BadRequestException($"Contact not found!");


        var username = _currentUserService.GetCurrentUsername();
        var currentContact = await contactService.Get()
            .FirstOrDefaultAsync(x => x.Username == username);
        if (currentContact != null)
            {
                await activityService.LogUserActivity(currentContact, nameof(ContactAppointment), contact.ID, $"{contact.FullName}", $"Appoinment | {results.Code}-{results.Designation}", "Created");
            }
        

        var _typeMasters = await db.TypeMasters.AsNoTracking()
        .Where(x => x.Entity == nameof(ContactAppointment))
        .ToListAsync();
        results.TypeValue = _typeMasters.Any(x => x.Value == results.TypeFlag) ? _typeMasters.FirstOrDefault(x => x.Value == results.TypeFlag)?.Title : "";
        var _statusMasters = await db.StatusMasters.AsNoTracking()
        .Where(x => x.Entity == nameof(ContactAppointment))
          .ToListAsync();
        results.StatusValue = _statusMasters.Any(x => x.Value == results.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == results.StatusFlag)?.Title : "";

        return Ok(results);

    }


    [HttpPut("{id}")]
    [Authorize]
    //[ResponseType(typeof(int))]
    public async Task<IActionResult> Put(int id, [FromBody] ContactAppointmentDto Dto)
    {

        await service.Update(mapper.Map<ContactAppointment>(Dto));

        var results = mapper.Map<ContactAppointmentDto>(await service.Get().Include(x => x.Company).Include(x => x.ManagerContact).Include(x => x.Attachments).SingleOrDefaultAsync(x => x.ID == id));
        if (results == null) throw new NotFoundException($"{nameof(ContactAppointment)} not found!");

        var contact = await db.Contacts.AsNoTracking().SingleOrDefaultAsync(x => x.ID == results.ContactID);
        if (contact == null) throw new BadRequestException($"Contact not found!");

        var username = _currentUserService.GetCurrentUsername();
        var currentContact = await contactService.Get()
            .FirstOrDefaultAsync(x => x.Username == username);
        if (currentContact != null)
        {
            await activityService.LogUserActivity(currentContact, nameof(ContactAppointment), contact.ID, $"{contact.FullName}", $"Appoinment | {results.Code}-{results.Designation}", "Updated");
        }

        var _typeMasters = await db.TypeMasters.AsNoTracking()
           .Where(x => x.Entity == nameof(ContactAppointment))
           .ToListAsync();
        results.TypeValue = _typeMasters.Any(x => x.Value == results.TypeFlag) ? _typeMasters.FirstOrDefault(x => x.Value == results.TypeFlag)?.Title : "";

        var _statusMasters = await db.StatusMasters.AsNoTracking()
           .Where(x => x.Entity == nameof(ContactAppointment))
           .ToListAsync();
        results.StatusValue = _statusMasters.Any(x => x.Value == results.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == results.StatusFlag)?.Title : "";
        if(results.StatusFlag != McvConstant.APPOINTMENT_STATUSFLAG_APPOINTED)
        {
            var memberShips = await contactTeamMemberService.Get().Where(x => x.ContactID == results.ContactID).Select(x => x.ID).ToListAsync();
            foreach (var memberID in memberShips)
            {
                await contactTeamMemberService.Delete(memberID);
            }
        }

        return Ok(results);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var results = mapper.Map<ContactAppointmentDto>(await service.Get().Include(x => x.Company).Include(x => x.ManagerContact).SingleOrDefaultAsync(x => x.ID == id));
        if (results == null) throw new NotFoundException($"{nameof(ContactAppointment)} not found!");

        await service.Delete(id);

        var contact = await db.Contacts.AsNoTracking().SingleOrDefaultAsync(x => x.ID == results.ContactID);
        if (contact == null) throw new BadRequestException($"Contact not found!");

        var username = _currentUserService.GetCurrentUsername();
        var currentContact = await contactService.Get()
            .FirstOrDefaultAsync(x => x.Username == username);
        if (currentContact != null)
        {
            await activityService.LogUserActivity(currentContact, nameof(ContactAppointment), contact.ID, $"{contact.FullName}", $"Appoinment | {results.Code}-{results.Designation}", "Updated");
        }

        return Ok();

    }

    [Authorize]
    [HttpGet("SearchTagOptions")]
    public async Task<IActionResult> GetSearchTagOptions()
    {
        var results = await service.GetSearchTagOptions();
        return Ok(results);
    }

}
