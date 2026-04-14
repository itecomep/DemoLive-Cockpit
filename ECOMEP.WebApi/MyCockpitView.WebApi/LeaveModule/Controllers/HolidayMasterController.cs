using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.ActivityModule;
using MyCockpitView.WebApi.ContactModule.Controllers;
using MyCockpitView.WebApi.ContactModule.Services;
using MyCockpitView.WebApi.LeaveModule.Dtos;
using MyCockpitView.WebApi.LeaveModule.Entities;
using MyCockpitView.WebApi.LeaveModule.Services;
using MyCockpitView.WebApi.Responses;

namespace MyCockpitView.WebApi.LeaveModule.Controllers;

[Route("[controller]")]
[ApiController]
public class HolidayMasterController : ControllerBase
{
    ILogger<HolidayMasterController> logger;
    private readonly IHolidayMasterService service;
    private readonly EntitiesContext db;
    private readonly IMapper mapper;

    public HolidayMasterController(
        ILogger<HolidayMasterController> logger,
        EntitiesContext db,
        IHolidayMasterService HolidaMasterService,
        IMapper mapper,
        IActivityService activityService,
        IContactService contactService
        )
    {
        this.logger = logger;
        this.db = db;
        this.service = HolidaMasterService;
        this.mapper = mapper;
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> Get(string? Filters = null, string? Search = null, string? Sort = null)
    {

        var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort);

        var results = mapper.Map<IEnumerable<HolidayMaster>>(await query
            .ToListAsync());

        //var typeMasters = await db.TypeMasters
        //    .AsNoTracking()
        //    .Where(x => x.Entity == nameof(HolidayMaster))
        //    .ToListAsync();

        //foreach (var obj in results)
        //{
        //    obj.TypeValue = typeMasters.FirstOrDefault(x => x.Value == obj.TypeFlag)?.Title ?? "";
        //}

        //var statusMasters = await db.StatusMasters
        //  .AsNoTracking()
        //  .Where(x => x.Entity == nameof(HolidayMaster))
        //  .ToListAsync();

        //foreach (var obj in results)
        //{
        //    obj.StatusValue = statusMasters.FirstOrDefault(x => x.Value == obj.StatusFlag)?.Title ?? "";
        //}

        return Ok(results);
    }

    [Authorize]
    [HttpGet("Pages")]
    public async Task<IActionResult> GetPages(int page = 0, int pageSize = 50, string Filters = null, string Search = null, string Sort = null)
    {
        var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort);

        var totalCount = await query.CountAsync();
        var totalPages = (int)Math.Ceiling((decimal)totalCount / pageSize);
        var results = mapper.Map<IEnumerable<HolidayMasterDto>>(await query
            .Skip(pageSize * page)
            .Take(pageSize)
            .ToListAsync());

        var typeMasters = await db.TypeMasters
            .AsNoTracking()
            .Where(x => x.Entity == nameof(HolidayMaster))
            .ToListAsync();

        foreach (var obj in results)
        {
            obj.TypeValue = typeMasters.FirstOrDefault(x => x.Value == obj.TypeFlag)?.Title ?? "";
        }

        var statusMasters = await db.StatusMasters
           .AsNoTracking()
           .Where(x => x.Entity == nameof(HolidayMaster))
           .ToListAsync();

        foreach (var obj in results)
        {
            obj.StatusValue = statusMasters.FirstOrDefault(x => x.Value == obj.StatusFlag)?.Title ?? "";
        }

        return Ok(new PagedResponse<HolidayMasterDto>(results, totalCount, totalPages));
    }

    [Authorize]
    [HttpGet("{id:int}")]
    public async Task<ActionResult<HolidayMasterDto>> GetByID(int id)
    {
        var responseDto = mapper.Map<HolidayMasterDto>(await service.GetById(id));
        if (responseDto == null)
        {
            return NotFound();
        }

        var typeMasters = await db.TypeMasters
            .AsNoTracking()
            .Where(x => x.Entity == nameof(HolidayMaster))
            .ToListAsync();

        responseDto.TypeValue = typeMasters.FirstOrDefault(x => x.Value == responseDto.TypeFlag)?.Title ?? "";

        var statusMasters = await db.StatusMasters
          .AsNoTracking()
          .Where(x => x.Entity == nameof(HolidayMaster))
          .ToListAsync();

        responseDto.StatusValue = statusMasters.FirstOrDefault(x => x.Value == responseDto.TypeFlag)?.Title ?? "";

        return Ok(responseDto);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<HolidayMasterDto>> Post(HolidayMasterDto dto)
    {
        var id = await service.Create(mapper.Map<HolidayMaster>(dto));
        var responseDto = mapper.Map<HolidayMasterDto>(await service.GetById(id));

        if (responseDto == null)
            return BadRequest("Not Created");

        var typeMasters = await db.TypeMasters
            .AsNoTracking()
            .Where(x => x.Entity == nameof(HolidayMaster))
            .ToListAsync();

        responseDto.TypeValue = typeMasters.FirstOrDefault(x => x.Value == responseDto.TypeFlag)?.Title ?? "";

        var statusMasters = await db.StatusMasters
  .AsNoTracking()
  .Where(x => x.Entity == nameof(HolidayMaster))
  .ToListAsync();

        responseDto.StatusValue = statusMasters.FirstOrDefault(x => x.Value == responseDto.TypeFlag)?.Title ?? "";

        //if (!string.IsNullOrEmpty(User.Identity?.Name))
        //{
        //    var currentContact = await contactService.Get().FirstOrDefaultAsync(x => x.Username == User.Identity.Name);
        //    if (currentContact != null)
        //    {
        //        var parent = await contactService.Get().SingleOrDefaultAsync(x => x.ID == responseDto.ContactID);
        //        if (parent != null)
        //        {
        //            await activityService.LogUserActivity(currentContact, nameof(parent), parent.ID, $"{parent.Name}", $"{nameof(HolidayMaster).Replace(nameof(parent),"")} | {responseDto.Company.Title} | {responseDto.Designation} | {responseDto.ManValue}mV", "Created");
        //        }
        //    }
        //}

        return CreatedAtAction(nameof(GetByID), new { id = responseDto.ID }, responseDto);
    }

    [Authorize]
    [HttpPut("{id:int}")]
    public async Task<ActionResult<HolidayMasterDto>> Put(int id, HolidayMasterDto dto)
    {
        if (id != dto.ID)
        {
            return BadRequest();
        }

        await service.Update(mapper.Map<HolidayMaster>(dto));
        var responseDto = mapper.Map<HolidayMasterDto>(await service.GetById(id));

        var typeMasters = await db.TypeMasters
            .AsNoTracking()
            .Where(x => x.Entity == nameof(HolidayMaster))
            .ToListAsync();

        responseDto.TypeValue = typeMasters.FirstOrDefault(x => x.Value == responseDto.TypeFlag)?.Title ?? "";

        var statusMasters = await db.StatusMasters
  .AsNoTracking()
  .Where(x => x.Entity == nameof(HolidayMaster))
  .ToListAsync();

        responseDto.StatusValue = statusMasters.FirstOrDefault(x => x.Value == responseDto.TypeFlag)?.Title ?? "";

        //if (!string.IsNullOrEmpty(User.Identity?.Name))
        //{
        //    var currentContact = await contactService.Get().FirstOrDefaultAsync(x => x.Username == User.Identity.Name);
        //    if (currentContact != null)
        //    {
        //        var parent = await contactService.Get().SingleOrDefaultAsync(x => x.ID == responseDto.ContactID);
        //        if (parent != null)
        //        {
        //            await activityService.LogUserActivity(currentContact, nameof(parent), parent.ID, $"{parent.Name}", $"{nameof(HolidayMaster).Replace(nameof(parent), "")} | {responseDto.Company.Title} | {responseDto.Designation} | {responseDto.ManValue}mV", "Updated");
        //        }
        //    }
        //}

        return Ok(responseDto);
    }

    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var responseDto = mapper.Map<HolidayMasterDto>(await service.GetById(id));
        if (responseDto == null) return BadRequest($"{nameof(HolidayMaster)} not found!");

        await service.Delete(id);

        //if (!string.IsNullOrEmpty(User.Identity?.Name))
        //{
        //    var currentContact = await contactService.Get().FirstOrDefaultAsync(x => x.Username == User.Identity.Name);
        //    if (currentContact != null)
        //    {
        //        var parent = await contactService.Get().SingleOrDefaultAsync(x => x.ID == responseDto.ContactID);
        //        if (parent != null)
        //        {
        //            await activityService.LogUserActivity(currentContact, nameof(parent), parent.ID, $"{parent.Name}", $"{nameof(HolidayMaster).Replace(nameof(parent), "")} | {responseDto.Company.Title} | {responseDto.Designation} | {responseDto.ManValue}mV", "Deleted");
        //        }
        //    }
        //}

        return NoContent();
    }


    [HttpGet("uid/{id:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult<HolidayMasterDto>> GetByGUID(Guid id)
    {
        var responseDto = mapper.Map<HolidayMasterDto>(await service.GetById(id));
        if (responseDto == null)
        {
            return NotFound();
        }

        var typeMasters = await db.TypeMasters
            .AsNoTracking()
            .Where(x => x.Entity == nameof(HolidayMaster))
            .ToListAsync();

        responseDto.TypeValue = typeMasters.FirstOrDefault(x => x.Value == responseDto.TypeFlag)?.Title ?? "";

        var statusMasters = await db.StatusMasters
                        .AsNoTracking()
                        .Where(x => x.Entity == nameof(HolidayMaster))
                        .ToListAsync();

        responseDto.StatusValue = statusMasters.FirstOrDefault(x => x.Value == responseDto.TypeFlag)?.Title ?? "";

        return Ok(responseDto);
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