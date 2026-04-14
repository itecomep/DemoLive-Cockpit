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
using MyCockpitView.WebApi.ProjectModule.Services;

namespace MyCockpitView.WebApi.ContactModule.Controllers;

[Route("[controller]")]
[ApiController]
public class ContactTeamController : ControllerBase
{
    ILogger<ContactTeamController> logger;
    private readonly IContactTeamService service;
    private readonly IMapper mapper;
    private readonly IActivityService activityService;
    private readonly IContactService contactService;
    private readonly IProjectTeamService projectTeamService;
    private readonly EntitiesContext db;
    public ContactTeamController(
        ILogger<ContactTeamController> logger,
        EntitiesContext db,
        IContactTeamService TeamService,
        IMapper mapper,
        IActivityService activityService,
        IContactService contactService,
        IProjectTeamService projectTeamService
        )
    {
        this.logger = logger;
        this.db = db;
        service = TeamService;
        this.mapper = mapper;
        this.activityService = activityService;
        this.contactService = contactService;
        this.projectTeamService = projectTeamService;
    }


    [Authorize]
    [HttpGet]
    public async Task<IActionResult> Get(string? Filters = null, string? Search = null, string? Sort = null)
    {

        var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort).Include(x => x.Members).ThenInclude(x=>x.Contact)
            ;

        var results = mapper.Map<IEnumerable<ContactTeamDto>>(await query

            .Include(x=>x.Members).ThenInclude(x => x.Contact)

            .ToListAsync());

        //var _typeMasters = await db.TypeMasters.AsNoTracking()
        //     .Where(x => x.Entity == nameof(ContactTeam))
        //     .ToListAsync();

        //var _statusMasters = await db.StatusMasters.AsNoTracking()
        //  .Where(x => x.Entity == nameof(ContactTeam))
        //  .ToListAsync();


        //foreach (var obj in results)
        //{
        //    obj.TypeValue = _typeMasters.Any(x => x.Value == obj.TypeFlag) ? _typeMasters.FirstOrDefault(x => x.Value == obj.TypeFlag)?.Title : "";
        //    obj.StatusValue = _statusMasters.Any(x => x.Value == obj.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == obj.StatusFlag)?.Title : "";
        //}

        return Ok(results);

    }

    // GET: api/Teams/5
    [Authorize]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetByID(int id)
    {

        var results = mapper.Map<ContactTeamDto>(await service.Get()
                     .Include(x => x.Members).ThenInclude(x => x.Contact)

            .SingleOrDefaultAsync(x=>x.ID==id));

        if (results == null) throw new NotFoundException($"{nameof(ContactTeam)} not found!");

        //var _typeMasters = await db.TypeMasters.AsNoTracking()
        //    .Where(x => x.Entity == nameof(ContactTeam))
        //    .ToListAsync();
        //results.TypeValue = _typeMasters.Any(x => x.Value == results.TypeFlag) ? _typeMasters.FirstOrDefault(x => x.Value == results.TypeFlag)?.Title : "";

        //var _statusMasters = await db.StatusMasters.AsNoTracking()
        //  .Where(x => x.Entity == nameof(ContactTeam))
        //  .ToListAsync();
        //results.StatusValue = _statusMasters.Any(x => x.Value == results.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == results.StatusFlag)?.Title : "";

        return Ok(results);

    }

    [HttpGet("uid/{id:guid}")]
    public async Task<IActionResult> GetByGUID(Guid id)
    {

        var results = mapper.Map<ContactTeamDto>(await service.Get()
                      .Include(x => x.Members).ThenInclude(x => x.Contact)
         
            .SingleOrDefaultAsync(x => x.UID == id));

        if (results == null) throw new NotFoundException($"{nameof(ContactTeam)} not found!");

        //var _typeMasters = await db.TypeMasters.AsNoTracking()
        //   .Where(x => x.Entity == nameof(ContactTeam))
        //   .ToListAsync();
        //results.TypeValue = _typeMasters.Any(x => x.Value == results.TypeFlag) ? _typeMasters.FirstOrDefault(x => x.Value == results.TypeFlag).Title : "";

        //var _statusMasters = await db.StatusMasters.AsNoTracking()
        //  .Where(x => x.Entity == nameof(ContactTeam))
        //  .ToListAsync();
        //results.StatusValue = _statusMasters.Any(x => x.Value == results.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == results.StatusFlag).Title : "";

        return Ok(results);

    }


    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Post([FromBody] ContactTeamDto Dto)
    {
        var id = await service.Create(mapper.Map<ContactTeam>(Dto));
        var results = mapper.Map<ContactTeamDto>(await service.Get()
                 .Include(x => x.Members).ThenInclude(x => x.Contact)

            .SingleOrDefaultAsync(x => x.ID == id));

        if (results == null) throw new BadRequestException($"{nameof(ContactTeam)} could not be created!");

        //var contact = await db.Contacts.AsNoTracking().SingleOrDefaultAsync(x => x.ID == results.ContactID);
        //if (contact == null) throw new BadRequestException($"Contact not found!");

        //if (!string.IsNullOrEmpty())
        //{
        //    var currentContact = await contactService.Get().FirstOrDefaultAsync(x => x.Username == );
        //    if (currentContact != null)
        //    {
        //        await activityService.LogUserActivity(currentContact, nameof(ContactTeam), results.ID, $"{results.Title}", $"", "Created");
        //    }
        //}

        //var _typeMasters = await db.TypeMasters.AsNoTracking()
        //.Where(x => x.Entity == nameof(ContactTeam))
        //.ToListAsync();
        //results.TypeValue = _typeMasters.Any(x => x.Value == results.TypeFlag) ? _typeMasters.FirstOrDefault(x => x.Value == results.TypeFlag)?.Title : "";
        //var _statusMasters = await db.StatusMasters.AsNoTracking()
        //.Where(x => x.Entity == nameof(ContactTeam))
        //  .ToListAsync();
        //results.StatusValue = _statusMasters.Any(x => x.Value == results.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == results.StatusFlag)?.Title : "";

        return Ok(results);

    }


    [HttpPut("{id}")]
    [Authorize]
    //[ResponseType(typeof(int))]
    public async Task<IActionResult> Put(int id, [FromBody] ContactTeamDto Dto)
    {

        await service.Update(mapper.Map<ContactTeam>(Dto));

        var results = mapper.Map<ContactTeamDto>(await service.Get()
               .Include(x => x.Members).ThenInclude(x => x.Contact)
   
            .SingleOrDefaultAsync(x => x.ID == id));
        if (results == null) throw new NotFoundException($"{nameof(ContactTeam)} not found!");

        //var currentContact = await contactService.Get().FirstOrDefaultAsync(x => x.Username == );
        //if (currentContact != null)
        //{
        //    await activityService.LogUserActivity(currentContact, nameof(ContactTeam), results.ID, $"{results.Title}", $"", "Updated");
        //}

        //var _typeMasters = await db.TypeMasters.AsNoTracking()
        //   .Where(x => x.Entity == nameof(Team))
        //   .ToListAsync();
        //results.TypeValue = _typeMasters.Any(x => x.Value == results.TypeFlag) ? _typeMasters.FirstOrDefault(x => x.Value == results.TypeFlag)?.Title : "";

        //var _statusMasters = await db.StatusMasters.AsNoTracking()
        //   .Where(x => x.Entity == nameof(Team))
        //   .ToListAsync();
        //results.StatusValue = _statusMasters.Any(x => x.Value == results.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == results.StatusFlag)?.Title : "";

        return Ok(results);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var results = mapper.Map<ContactTeamDto>(await service.Get().SingleOrDefaultAsync(x => x.ID == id));
        if (results == null) throw new NotFoundException($"{nameof(ContactTeam)} not found!");

        await service.Delete(id);

      
        //var currentContact = await contactService.Get().FirstOrDefaultAsync(x => x.Username == );
        //if (currentContact != null)
        //{
        //    await activityService.LogUserActivity(currentContact, nameof(ContactTeam), results.ID, $"{results.Title}", $"", "Deleted");
        //}

      
        var projectTeams=await projectTeamService.Get().Where(x=>x.ContactTeamID== id).Select(x=>x.ID).ToListAsync();
        foreach (var teamID in projectTeams)
        {
            await projectTeamService.Delete(teamID);
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
