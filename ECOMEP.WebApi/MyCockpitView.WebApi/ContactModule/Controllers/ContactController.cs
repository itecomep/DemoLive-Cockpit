using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.ActivityModule;
using MyCockpitView.WebApi.AuthModule.Entities;
using MyCockpitView.WebApi.ContactModule.Dtos;
using MyCockpitView.WebApi.ContactModule.Entities;
using MyCockpitView.WebApi.ContactModule.Services;


using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Responses;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.ContactModule.Controllers;

[Route("[controller]")]
[ApiController]
public class ContactController : ControllerBase
{
    ILogger<ContactController> logger;
    private readonly IContactService service;
    private readonly IMapper mapper;
    private readonly IActivityService activityService;
    private readonly UserManager<User> userManager;
    private readonly EntitiesContext db;
    private readonly ICurrentUserService _currentUserService;

    public ContactController(
        ILogger<ContactController> logger,
        EntitiesContext entitiesContext,
        IContactService contactService,
        IMapper mapper,
        IActivityService activityService,
        UserManager<User> userManager,
        ICurrentUserService currentUserService)

    {
        this.logger = logger;
        db = entitiesContext;
        this.service = contactService;
        this.mapper = mapper;
        this.activityService = activityService;
        this.userManager = userManager;
        _currentUserService = currentUserService;
    }


    [Authorize]
    [HttpGet]
    public async Task<IActionResult> Get(string? Filters = null, string? Search = null, string? Sort = null)
    {

        var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort);

        var results = mapper.Map<IEnumerable<ContactListDto>>(await query
            .ToListAsync());

        foreach (var obj in results.Where(x => x.TypeFlag == McvConstant.CONTACT_TYPEFLAG_APPOINTED))
        {
            var _activeAppointments = await db.ContactAppointments.AsNoTracking()
            .Where(x => !x.IsDeleted)
            .Where(x => x.StatusFlag == McvConstant.APPOINTMENT_STATUSFLAG_APPOINTED)
            .Where(x => x.ContactID == obj.ID)
                                .OrderByDescending(x => x.JoiningDate)
                                .ToListAsync();

            obj.Appointments = mapper.Map<IEnumerable<ContactAppointmentDto>>(_activeAppointments);


        }

        return Ok(results);

    }

    [Authorize]
    [HttpGet("Pages")]
    public async Task<IActionResult> Get(int page = 0, int pageSize = 50, string? Filters = null, string? Search = null, string? Sort = null)
    {

        var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort);
        var totalCount = await query.CountAsync();
        var totalPages = (int)Math.Ceiling((decimal)totalCount / pageSize);
        var results = mapper.Map<IEnumerable<ContactListDto>>(await query
            .Skip(pageSize * page)
            .Take(pageSize)
            .ToListAsync());

        foreach (var obj in results.Where(x => x.TypeFlag == McvConstant.CONTACT_TYPEFLAG_APPOINTED))
        {
            var _activeAppointments = await db.ContactAppointments.AsNoTracking()
            .Where(x => !x.IsDeleted)
            .Where(x => x.StatusFlag == McvConstant.APPOINTMENT_STATUSFLAG_APPOINTED)
            .Where(x => x.ContactID == obj.ID)
                                .OrderByDescending(x => x.JoiningDate)
                                .ToListAsync();

            obj.Appointments = mapper.Map<IEnumerable<ContactAppointmentDto>>(_activeAppointments);


        }


        return Ok(new PagedResponse<ContactListDto>(results, totalCount, totalPages));
    }

    // GET: api/Contacts/5
    [Authorize]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetByID(int id)
    {

        var results = mapper.Map<ContactDto>(await service.Get()
                     .Include(x => x.AssociatedCompanies).ThenInclude(x => x.Company)
                              .Include(x => x.AssociatedContacts).ThenInclude(c => c.Person)
                               .Include(x => x.Attachments)
                               .Include(x => x.Appointments)
                 .SingleOrDefaultAsync(i => i.ID == id));

        if (results == null) throw new NotFoundException($"{nameof(Contact)} not found!");

        var _typeMasters = await db.TypeMasters.AsNoTracking()
            .Where(x => x.Entity == nameof(Contact))
            .ToListAsync();
        results.TypeValue = _typeMasters.Any(x => x.Value == results.TypeFlag) ? _typeMasters.FirstOrDefault(x => x.Value == results.TypeFlag)?.Title : "";

        return Ok(results);

    }

    [HttpGet("uid/{id:guid}")]
    public async Task<IActionResult> GetByGUID(Guid id)
    {

        var results = mapper.Map<ContactDto>(await service.Get()
                     .Include(x => x.AssociatedCompanies).ThenInclude(x => x.Company)
                              .Include(x => x.AssociatedContacts).ThenInclude(c => c.Person)
                               .Include(x => x.Attachments)
                               .Include(x => x.Appointments)

                 .SingleOrDefaultAsync(i => i.UID == id));

        if (results == null) throw new NotFoundException($"{nameof(Contact)} not found!");

        var _typeMasters = await db.TypeMasters.AsNoTracking()
           .Where(x => x.Entity == nameof(Contact))
           .ToListAsync();
        results.TypeValue = _typeMasters.Any(x => x.Value == results.TypeFlag) ? _typeMasters.FirstOrDefault(x => x.Value == results.TypeFlag).Title : "";

        return Ok(results);

    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Post([FromBody] ContactDto Dto)
    {

        var id = await service.Create(mapper.Map<Contact>(Dto));

        var results = mapper.Map<ContactDto>(await service.Get()
                     .Include(x => x.AssociatedCompanies).ThenInclude(x => x.Company)
                              .Include(x => x.AssociatedContacts).ThenInclude(c => c.Person)
                               .Include(x => x.Attachments)
                               .Include(x => x.Appointments)
                 .SingleOrDefaultAsync(i => i.ID == id));

        if (results == null) throw new BadRequestException($"{nameof(Contact)} could not be created!");

        var username = _currentUserService.GetCurrentUsername();
        var currentContact = await service.Get()
            .FirstOrDefaultAsync(x => x.Username == username);
        if (currentContact != null)
        {
            await activityService.LogUserActivity(currentContact, nameof(Contact), results.ID, $"{results.FullName}", $"{nameof(Contact)} | {results.FullName}", "Created");
        }
        var _typeMasters = await db.TypeMasters.AsNoTracking()
           .Where(x => x.Entity == nameof(Contact))
           .ToListAsync();
        results.TypeValue = _typeMasters.Any(x => x.Value == results.TypeFlag) ? _typeMasters.FirstOrDefault(x => x.Value == results.TypeFlag)?.Title : "";


        return Ok(results);

    }


    [HttpPut("{id}")]
    [Authorize]
    //[ResponseType(typeof(int))]
    public async Task<IActionResult> Put(int id, [FromBody] ContactDto Dto)
    {

        await service.Update(mapper.Map<Contact>(Dto));

        var results = mapper.Map<ContactDto>(await service.Get()
                     .Include(x => x.AssociatedCompanies).ThenInclude(x => x.Company)
                              .Include(x => x.AssociatedContacts).ThenInclude(c => c.Person)
                               .Include(x => x.Attachments)
                               .Include(x => x.Appointments)
                 .SingleOrDefaultAsync(i => i.ID == id));

        if (results == null) throw new NotFoundException($"{nameof(Contact)} not found!");

        var username = _currentUserService.GetCurrentUsername();
        var currentContact = await service.Get()
            .FirstOrDefaultAsync(x => x.Username == username);
        if (currentContact != null)
        {
            await activityService.LogUserActivity(currentContact, nameof(Contact), results.ID, $"{results.FullName}", $"{nameof(Contact)} | {results.FullName}", "Updated");
        }

        var _typeMasters = await db.TypeMasters.AsNoTracking()
           .Where(x => x.Entity == nameof(Contact))
           .ToListAsync();
        results.TypeValue = _typeMasters.Any(x => x.Value == results.TypeFlag) ? _typeMasters.FirstOrDefault(x => x.Value == results.TypeFlag)?.Title : "";

        return Ok(results);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var results = mapper.Map<ContactDto>(await service.Get()


                   .SingleOrDefaultAsync(i => i.ID == id));

        if (results == null) throw new NotFoundException($"{nameof(Contact)} not found!");

        await service.Delete(id);

        if (results.Username != null)
        {
            var appUser = await userManager.FindByNameAsync(results.Username);

            IdentityResult result = await userManager.DeleteAsync(appUser);
        }
        var username = _currentUserService.GetCurrentUsername();
        var currentContact = await service.Get()
            .FirstOrDefaultAsync(x => x.Username == username);
        if (currentContact != null)
        {
            await activityService.LogUserActivity(currentContact, nameof(Contact), results.ID, $"{results.FullName}", $"{nameof(Contact)} | {results.FullName}", "Deleted");
        }
        return Ok();

    }

    [Authorize]
    [HttpGet("EmailOptions")]
    public async Task<IActionResult> GetEmailOptions(string? Search = null, string? Sort = null, string? Filters = null)
    {

        var results = await service.GetEmailContacts(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort);
        var _typeMasters = await db.TypeMasters.AsNoTracking()
          .Where(x => x.Entity == nameof(Contact))
          .ToListAsync();
        foreach (var obj in results)
        {
            obj.TypeValue = _typeMasters.Any(x => x.Value == obj.TypeFlag) ? _typeMasters.FirstOrDefault(x => x.Value == obj.TypeFlag)?.Title : "";
        }

        return Ok(results);

    }

    [Authorize]
    [HttpGet("SearchTagOptions")]
    public async Task<IActionResult> GetSearchTagOptions()
    {
        var results = await service.GetSearchTagOptions();
        return Ok(results);
    }


    [HttpGet("EXCEL")]
    public async Task<IActionResult> GetExcel(string? Filters = null, string? Search = null, string? Sort = null)
    {

        var _report = await service.GetExcel(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort);

        if (_report == null) throw new BadRequestException("File not generated!");

        return new FileContentResult(_report, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        {
            FileDownloadName = "ContactList.xlsx"
        };

    }

    [Authorize]
    [HttpPost]
    [Route("merge")]
    public async Task<IActionResult> MergeContacts(List<int> contactIds)
    {


        var entityID = await service.MergeContacts(contactIds);
        var results = mapper.Map<ContactDto>(await service.GetById(entityID));

        if (results == null) throw new BadRequestException($"{nameof(Contact)} could not be created!");

        // Log activity
        var username = _currentUserService.GetCurrentUsername();
        var currentContact = await service.Get()
            .FirstOrDefaultAsync(x => x.Username == username);
        if (currentContact != null)
        {
            await activityService.LogUserActivity(currentContact, nameof(Contact), results.ID, $"{results.FullName}", $"{nameof(Contact)} | {results.FullName}", "Merged");
        }

        return Ok(results);

    }

    [Authorize]
    [HttpGet("Options")]
    public async Task<IActionResult> GetOptions(string? Filters = null, string? Search = null, string? Sort = null)
    {
        var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort)
            .Include(x => x.Appointments);

        var results = mapper.Map<IEnumerable<ContactListDto>>(await query.ToListAsync());

        return Ok(results);
    }

    [HttpGet("resetPrimary")]
    public async Task<IActionResult> resetPrimary()
    {
        var query = await service.Get().ToListAsync();

        foreach (var item in query)
        {
            await service.Update(item);
        }

        return Ok();
    }
}
