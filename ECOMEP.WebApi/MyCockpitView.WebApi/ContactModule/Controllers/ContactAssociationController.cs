using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.ActivityModule;
using MyCockpitView.WebApi.ContactModule.Dtos;
using MyCockpitView.WebApi.ContactModule.Entities;
using MyCockpitView.WebApi.ContactModule.Services;
using MyCockpitView.Utility.Common;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Exceptions;
using DocumentFormat.OpenXml.Office2010.Excel;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.ContactModule.Controllers;

[Route("[controller]")]
[ApiController]
public class ContactAssociationController : ControllerBase
{
    ILogger<ContactAssociationController> logger;
    private readonly IContactAssociationService service;
    private readonly IMapper mapper;
    private readonly IActivityService activityService;
    private readonly IContactService contactService;
    private readonly EntitiesContext db;
    private readonly ICurrentUserService _currentUserService;

    public ContactAssociationController(
        ILogger<ContactAssociationController> logger,
        EntitiesContext db,
        IContactAssociationService ContactAssociationService,
        IMapper mapper,
        IActivityService activityService,
        IContactService contactService,
        ICurrentUserService currentUserService
        )
    {
        this.logger = logger;
        this.db = db;
        service = ContactAssociationService;
        this.mapper = mapper;
        this.activityService = activityService;
        this.contactService = contactService;
        _currentUserService = currentUserService;
    }


    [Authorize]
    [HttpGet]
    public async Task<IActionResult> Get(string? Filters = null, string? Search = null, string? Sort = null)
    {

        var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort).Include(x => x.Person)
                 .Include(x => x.Company);

        var results = mapper.Map<IEnumerable<ContactAssociationDto>>(await query
            .ToListAsync());

        var _typeMasters = await db.TypeMasters.AsNoTracking()
             .Where(x => x.Entity == nameof(ContactAssociation))
             .ToListAsync();

        var _statusMasters = await db.StatusMasters.AsNoTracking()
          .Where(x => x.Entity == nameof(ContactAssociation))
          .ToListAsync();


        foreach (var obj in results)
        {
            obj.TypeValue = _typeMasters.Any(x => x.Value == obj.TypeFlag) ? _typeMasters.FirstOrDefault(x => x.Value == obj.TypeFlag)?.Title : "";
            obj.StatusValue = _statusMasters.Any(x => x.Value == obj.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == obj.StatusFlag)?.Title : "";
        }

        return Ok(results);

    }

    // GET: api/ContactAssociations/5
    [Authorize]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetByID(int id)
    {

        var results = mapper.Map<ContactAssociationDto>(await service.Get().Include(x => x.Person).Include(x => x.Company).SingleOrDefaultAsync(x => x.ID == id));

        if (results == null) throw new NotFoundException($"{nameof(ContactAssociation)} not found!");

        var _typeMasters = await db.TypeMasters.AsNoTracking()
            .Where(x => x.Entity == nameof(ContactAssociation))
            .ToListAsync();
        results.TypeValue = _typeMasters.Any(x => x.Value == results.TypeFlag) ? _typeMasters.FirstOrDefault(x => x.Value == results.TypeFlag)?.Title : "";

        var _statusMasters = await db.StatusMasters.AsNoTracking()
          .Where(x => x.Entity == nameof(ContactAssociation))
          .ToListAsync();
        results.StatusValue = _statusMasters.Any(x => x.Value == results.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == results.StatusFlag)?.Title : "";

        return Ok(results);

    }

    [HttpGet("uid/{id:guid}")]
    public async Task<IActionResult> GetByGUID(Guid id)
    {

        var results = mapper.Map<ContactAssociationDto>(await service.Get().Include(x => x.Person).Include(x => x.Company).SingleOrDefaultAsync(x => x.UID == id));

        if (results == null) throw new NotFoundException($"{nameof(ContactAssociation)} not found!");

        var _typeMasters = await db.TypeMasters.AsNoTracking()
           .Where(x => x.Entity == nameof(ContactAssociation))
           .ToListAsync();
        results.TypeValue = _typeMasters.Any(x => x.Value == results.TypeFlag) ? _typeMasters.FirstOrDefault(x => x.Value == results.TypeFlag)?.Title : "";

        var _statusMasters = await db.StatusMasters.AsNoTracking()
          .Where(x => x.Entity == nameof(ContactAssociation))
          .ToListAsync();
        results.StatusValue = _statusMasters.Any(x => x.Value == results.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == results.StatusFlag)?.Title : "";

        return Ok(results);

    }


    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Post([FromBody] ContactAssociationDto Dto)
    {
        var id = await service.Create(mapper.Map<ContactAssociation>(Dto));
        var results = mapper.Map<ContactAssociationDto>(await service.Get()
            .Include(x => x.Person)
                 .Include(x => x.Company)
            .SingleOrDefaultAsync(x => x.ID == id));

        if (results == null) throw new BadRequestException($"{nameof(ContactAssociation)} could not be created!");

        var _typeMasters = await db.TypeMasters.AsNoTracking()
           .Where(x => x.Entity == nameof(ContactAssociation))
           .ToListAsync();
        results.TypeValue = _typeMasters.Any(x => x.Value == results.TypeFlag) ? _typeMasters.FirstOrDefault(x => x.Value == results.TypeFlag)?.Title : "";

        var _statusMasters = await db.StatusMasters.AsNoTracking()
          .Where(x => x.Entity == nameof(ContactAssociation))
          .ToListAsync();
        results.StatusValue = _statusMasters.Any(x => x.Value == results.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == results.StatusFlag)?.Title : "";

        var username = _currentUserService.GetCurrentUsername();
        var currentContact = await contactService.Get()
            .FirstOrDefaultAsync(x => x.Username == username);
        if (currentContact != null)
        {
            await activityService.LogUserActivity(currentContact, nameof(Contact), results.PersonContactID,results.Person.Name, $"Association with Company | {results.Company.FullName}", "Created");

            await activityService.LogUserActivity(currentContact, nameof(Contact), results.CompanyContactID, results.Company.Name, $"Association with Person | {results.Person.FullName}", "Created");
        }

        return Ok(results);

    }


    [HttpPut("{id}")]
    [Authorize]
    //[ResponseType(typeof(int))]
    public async Task<IActionResult> Put(int id, [FromBody] ContactAssociationDto Dto)
    {

        await service.Update(mapper.Map<ContactAssociation>(Dto));

        var results = mapper.Map<ContactAssociationDto>(await service.Get()
            .Include(x => x.Person)
                 .Include(x => x.Company)
            .SingleOrDefaultAsync(x => x.ID == id));
        if (results == null) throw new NotFoundException($"{nameof(ContactAssociation)} not found!");

        var _typeMasters = await db.TypeMasters.AsNoTracking()
           .Where(x => x.Entity == nameof(ContactAssociation))
           .ToListAsync();
        results.TypeValue = _typeMasters.Any(x => x.Value == results.TypeFlag) ? _typeMasters.FirstOrDefault(x => x.Value == results.TypeFlag)?.Title : "";

        var _statusMasters = await db.StatusMasters.AsNoTracking()
           .Where(x => x.Entity == nameof(ContactAssociation))
           .ToListAsync();
        results.StatusValue = _statusMasters.Any(x => x.Value == results.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == results.StatusFlag)?.Title : "";

        var username = _currentUserService.GetCurrentUsername();
        var currentContact = await contactService.Get()
            .FirstOrDefaultAsync(x => x.Username == username);
        if (currentContact != null)
        {
            await activityService.LogUserActivity(currentContact, nameof(Contact), results.PersonContactID, results.Person.Name, $"Association with Company | {results.Company.FullName}", "Updated");

            await activityService.LogUserActivity(currentContact, nameof(Contact), results.CompanyContactID, results.Company.Name, $"Association with Person | {results.Person.FullName}", "Updated");
        }
        return Ok(results);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var results = mapper.Map<ContactAssociationDto>(await service.Get()
            .Include(x=>x.Person)
            .Include(x=>x.Company)
            .SingleOrDefaultAsync(x => x.ID == id));
        if (results == null) throw new NotFoundException($"{nameof(ContactAssociationDto)} not found!");

        await service.Delete(id);

        var username = _currentUserService.GetCurrentUsername();
        if (!string.IsNullOrEmpty(username))
        {
            var currentContact = await contactService.Get().FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
            {
                await activityService.LogUserActivity(currentContact, nameof(Contact), results.PersonContactID, results.Person.Name, $"Association with Company | {results.Company.FullName}", "Deleted");

                await activityService.LogUserActivity(currentContact, nameof(Contact), results.CompanyContactID, results.Company.Name, $"Association with Person | {results.Person.FullName}", "Deleted");
            }
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
