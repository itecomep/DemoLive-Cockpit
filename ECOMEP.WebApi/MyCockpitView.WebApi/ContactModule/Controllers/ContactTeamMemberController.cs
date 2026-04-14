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

namespace MyCockpitView.WebApi.ContactModule.Controllers;

[Route("[controller]")]
[ApiController]
public class ContactTeamMemberController : ControllerBase
{
    ILogger<ContactTeamMemberController> logger;
    private readonly IContactTeamMemberService service;
    private readonly IMapper mapper;
    private readonly IActivityService activityService;
    private readonly IContactService contactService;
    private readonly EntitiesContext db;
    public ContactTeamMemberController(
        ILogger<ContactTeamMemberController> logger,
        EntitiesContext db,
        IContactTeamMemberService TeamService,
        IMapper mapper,
        IActivityService activityService,
        IContactService contactService
        )
    {
        this.logger = logger;
        this.db = db;
        service = TeamService;
        this.mapper = mapper;
        this.activityService = activityService;
        this.contactService = contactService;
    }


    [Authorize]
    [HttpGet]
    public async Task<IActionResult> Get(string? Filters = null, string? Search = null, string? Sort = null)
    {

        var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort).Include(x => x.Contact)
            ;

        var results = mapper.Map<IEnumerable<ContactTeamMemberDto>>(await query
            .ToListAsync());

        //var _typeMasters = await db.TypeMasters.AsNoTracking()
        //     .Where(x => x.Entity == nameof(ContactTeamMember))
        //     .ToListAsync();

        //var _statusMasters = await db.StatusMasters.AsNoTracking()
        //  .Where(x => x.Entity == nameof(ContactTeamMember))
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

        var results = mapper.Map<ContactTeamMemberDto>(await service.Get().Include(x => x.Contact).SingleOrDefaultAsync(x=>x.ID==id));

        if (results == null) throw new NotFoundException($"{nameof(ContactTeamMember)} not found!");

        //var _typeMasters = await db.TypeMasters.AsNoTracking()
        //    .Where(x => x.Entity == nameof(ContactTeamMember))
        //    .ToListAsync();
        //results.TypeValue = _typeMasters.Any(x => x.Value == results.TypeFlag) ? _typeMasters.FirstOrDefault(x => x.Value == results.TypeFlag)?.Title : "";

        //var _statusMasters = await db.StatusMasters.AsNoTracking()
        //  .Where(x => x.Entity == nameof(ContactTeamMember))
        //  .ToListAsync();
        //results.StatusValue = _statusMasters.Any(x => x.Value == results.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == results.StatusFlag)?.Title : "";

        return Ok(results);

    }

    [HttpGet("uid/{id:guid}")]
    public async Task<IActionResult> GetByGUID(Guid id)
    {

        var results = mapper.Map<ContactTeamMemberDto>(await service.Get().Include(x => x.Contact).SingleOrDefaultAsync(x => x.UID == id));

        if (results == null) throw new NotFoundException($"{nameof(ContactTeamMember)} not found!");

        //var _typeMasters = await db.TypeMasters.AsNoTracking()
        //   .Where(x => x.Entity == nameof(ContactTeamMember))
        //   .ToListAsync();
        //results.TypeValue = _typeMasters.Any(x => x.Value == results.TypeFlag) ? _typeMasters.FirstOrDefault(x => x.Value == results.TypeFlag).Title : "";

        //var _statusMasters = await db.StatusMasters.AsNoTracking()
        //  .Where(x => x.Entity == nameof(ContactTeamMember))
        //  .ToListAsync();
        //results.StatusValue = _statusMasters.Any(x => x.Value == results.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == results.StatusFlag).Title : "";

        return Ok(results);

    }


    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Post([FromBody] ContactTeamMemberDto Dto)
    {
        var id = await service.Create(mapper.Map<ContactTeamMember>(Dto));
        var results = mapper.Map<ContactTeamMemberDto>(await service.Get().Include(x => x.Contact).SingleOrDefaultAsync(x => x.ID == id));

        if (results == null) throw new BadRequestException($"{nameof(ContactTeamMember)} could not be created!");

   
        //if (!string.IsNullOrEmpty())
        //{
        //    var currentContact = await contactService.Get().FirstOrDefaultAsync(x => x.Username == );
        //    if (currentContact != null)
        //    {
        //        await activityService.LogUserActivity(currentContact, nameof(ContactTeamMember), results.ID, $"{results.Contact.FullName}", $"", "Created");
        //    }
        //}


        //var _typeMasters = await db.TypeMasters.AsNoTracking()
        //.Where(x => x.Entity == nameof(ContactTeamMember))
        //.ToListAsync();
        //results.TypeValue = _typeMasters.Any(x => x.Value == results.TypeFlag) ? _typeMasters.FirstOrDefault(x => x.Value == results.TypeFlag)?.Title : "";
        //var _statusMasters = await db.StatusMasters.AsNoTracking()
        //.Where(x => x.Entity == nameof(ContactTeamMember))
        //  .ToListAsync();
        //results.StatusValue = _statusMasters.Any(x => x.Value == results.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == results.StatusFlag)?.Title : "";

        return Ok(results);

    }


    [HttpPut("{id}")]
    [Authorize]
    //[ResponseType(typeof(int))]
    public async Task<IActionResult> Put(int id, [FromBody] ContactTeamMemberDto Dto)
    {

        await service.Update(mapper.Map<ContactTeamMember>(Dto));

        var results = mapper.Map<ContactTeamMemberDto>(await service.Get().Include(x => x.Contact).SingleOrDefaultAsync(x => x.ID == id));
        if (results == null) throw new NotFoundException($"{nameof(ContactTeamMember)} not found!");

        //var currentContact = await contactService.Get().FirstOrDefaultAsync(x => x.Username == );
        //if (currentContact != null)
        //{
        //    await activityService.LogUserActivity(currentContact, nameof(ContactTeamMember), results.ID, $"{results.Contact.FullName}", $"", "Updated");
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
        var results = mapper.Map<ContactTeamMemberDto>(await service.Get().Include(x => x.Contact).SingleOrDefaultAsync(x => x.ID == id));
        if (results == null) throw new NotFoundException($"{nameof(ContactTeamMember)} not found!");

        await service.Delete(id);

      
        //var currentContact = await contactService.Get().FirstOrDefaultAsync(x => x.Username == );
        //if (currentContact != null)
        //{
        //    await activityService.LogUserActivity(currentContact, nameof(ContactTeamMember), results.ID, $"{results.Contact.FullName}", $"", "Deleted");
        //}


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
