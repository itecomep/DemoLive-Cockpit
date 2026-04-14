using AutoMapper;
using MyCockpitView.WebApi.PackageModule.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.ActivityModule;


using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.ContactModule.Services;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.WebApi.Responses;
using MyCockpitView.WebApi.PackageModule.Dtos;
using MyCockpitView.WebApi.PackageModule.Entities;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.PackageModule.Controllers;

[Route("[controller]")]
[ApiController]
public class PackageController : ControllerBase
{

    ILogger<PackageController> logger;
    private readonly IPackageService service;
    private readonly IMapper mapper;
    private readonly IActivityService activityService;
    private readonly IContactService contactService;
    private readonly EntitiesContext db;
    private readonly ICurrentUserService _currentUserService;

    public PackageController(
        ILogger<PackageController> logger,
        EntitiesContext entitiesContext,
        IPackageService PackageService,
        IMapper mapper,
        IActivityService activityService,
        IContactService contactService,
        ICurrentUserService currentUserService
        )
    {
        this.logger = logger;
        db = entitiesContext;
        service = PackageService;
        this.mapper = mapper;
        this.activityService = activityService;
        this.contactService = contactService;
        _currentUserService = currentUserService;
    }

    [Authorize]
    [HttpGet]

    public async Task<IActionResult> Get(string? Filters = null, string? Search = null, string? Sort = null)
    {

        var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort);


        var results = mapper.Map<IEnumerable<PackageDto>>(await query.ToListAsync());

        var _statusMasters = await db.StatusMasters.AsNoTracking()
           .Where(x => x.Entity == nameof(Package))
           .ToListAsync();

        foreach (var obj in results)
        {
            obj.StatusValue = _statusMasters.Any(x => x.Value == obj.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == obj.StatusFlag).Title : "";

        }

        return Ok(results);

    }


    // GET: api/Contacts/5
    [Authorize]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetByID(int id)
    {

        var results = mapper.Map<PackageDto>(await service.Get()
            .Include(x => x.Contacts)
            .Include(x => x.Attachments)
            .Include(x=>x.StudioWorks).ThenInclude(x=>x.Attachments)
            .SingleOrDefaultAsync(x => x.ID == id));

        if (results == null) throw new NotFoundException($"{nameof(Package)} not found!");

        var _statusMasters = await db.StatusMasters.AsNoTracking()
            .Where(x => x.Entity == nameof(Package))
            .ToListAsync();
        results.StatusValue = _statusMasters.Any(x => x.Value == results.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == results.StatusFlag).Title : "";

        return Ok(results);

    }

    [HttpGet("uid/{id:guid}")]
    public async Task<IActionResult> GetByGUID(Guid id)
    {

        var results = mapper.Map<PackageDto>(await service.Get()
            .Include(x => x.Contacts)
            .Include(x => x.Attachments)
              //.Include(x => x.StudioWorks).ThenInclude(x => x.Attachments)
            .SingleOrDefaultAsync(x => x.UID == id));

        if (results == null) throw new NotFoundException($"{nameof(Package)} not found!");

        var _statusMasters = await db.StatusMasters.AsNoTracking()
                      .Where(x => x.Entity == nameof(Package))
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

        var results = mapper.Map<IEnumerable<PackageDto>>(await query
            .Skip(pageSize * page)
            .Take(pageSize).ToListAsync());

        var _statusMasters = await db.StatusMasters.AsNoTracking()
            .Where(x => x.Entity == nameof(Package))
            .ToListAsync();
        foreach (var obj in results)
        {
            obj.StatusValue = _statusMasters.Any(x => x.Value == obj.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == obj.StatusFlag).Title : "";


        }


        return Ok(new PagedResponse<PackageDto>(results, totalCount, totalPages));

    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] PackageDto Dto)
    {

        var id = await service.Create(mapper.Map<Package>(Dto));

        var results = mapper.Map<PackageDto>(await service.Get()
    .Include(x => x.Contacts)
    .Include(x => x.Attachments)
      .Include(x => x.StudioWorks).ThenInclude(x => x.Attachments)
    .SingleOrDefaultAsync(x => x.ID == id));

        if (results == null) throw new BadRequestException($"{nameof(Package)} could not be created!");

        var username = _currentUserService.GetCurrentUsername();
        if (!string.IsNullOrEmpty(username))
        {
            var currentContact = await contactService.Get().FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
            {
                await activityService.LogUserActivity(currentContact, nameof(Package), results.ID,
                                                                    results.Title,
                                                                    $"{results.Title}",
                                                                    "Created"
                                                                    );
            }
        }

        var _statusMasters = await db.StatusMasters.AsNoTracking()
               .Where(x => x.Entity == nameof(Package))
               .ToListAsync();
        results.StatusValue = _statusMasters.Any(x => x.Value == results.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == results.StatusFlag).Title : "";


        return Ok(results);

    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] PackageDto Dto)
    {

        await service.Update(mapper.Map<Package>(Dto));


        var results = mapper.Map<PackageDto>(await service.Get()
            .Include(x => x.Contacts)
            .Include(x => x.Attachments)
              .Include(x => x.StudioWorks).ThenInclude(x => x.Attachments)
            .SingleOrDefaultAsync(x => x.ID == id));

        if (results == null) throw new NotFoundException($"{nameof(Package)} not found!");


        var username = _currentUserService.GetCurrentUsername();
        var currentContact = await contactService.Get()
            .FirstOrDefaultAsync(x => x.Username == username);
        if (currentContact != null)
            {
                await activityService.LogUserActivity(currentContact, nameof(Package), results.ID,
                                                                    results.Title,
                                                                    $"{results.Title}", "Updated");
            }
        
        var _statusMasters = await db.StatusMasters.AsNoTracking()
             .Where(x => x.Entity == nameof(Package))
             .ToListAsync();
        results.StatusValue = _statusMasters.Any(x => x.Value == results.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == results.StatusFlag).Title : "";

        return Ok(results);

    }


    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {



        var results = mapper.Map<PackageDto>(await service.Get()
            .SingleOrDefaultAsync(x => x.ID == id));

        if (results == null) throw new NotFoundException($"{nameof(Package)} not found!");

        await service.Delete(id);

        var username = _currentUserService.GetCurrentUsername();
        if (!string.IsNullOrEmpty(username))
        {
            var currentContact = await contactService.Get().FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
            {
                await activityService.LogUserActivity(currentContact, nameof(Package), results.ID,
                                                                    results.Title,
                                                                    $"{results.Title}",
                                                                    "Deleted"
                                                                    );
            }
        }
        var _statusMasters = await db.StatusMasters.AsNoTracking()
             .Where(x => x.Entity == nameof(PackageContact))
             .ToListAsync();
        results.StatusValue = _statusMasters.Any(x => x.Value == results.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == results.StatusFlag).Title : "";

        return Ok(results);

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

}

