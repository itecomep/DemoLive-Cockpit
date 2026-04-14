using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.ActivityModule;
using MyCockpitView.WebApi.WorkOrderModule.Services;
using MyCockpitView.Utility.Common;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.WebApi.WorkOrderModule.Dtos;
using MyCockpitView.WebApi.WorkOrderModule.Entities;
using MyCockpitView.WebApi.ProjectModule.Services;

namespace MyCockpitView.WebApi.WorkOrderModule.Controllers;

[Route("[controller]")]
[ApiController]
public class WorkOrderMasterController : ControllerBase
{
    ILogger<WorkOrderMasterController> logger;
    private readonly IWorkOrderMasterService service;
    private readonly IMapper mapper;
    private readonly IActivityService activityService;
    private readonly IProjectTeamService projectTeamService;
    private readonly EntitiesContext db;
    public WorkOrderMasterController(
        ILogger<WorkOrderMasterController> logger,
        EntitiesContext db,
        IWorkOrderMasterService service,
        IMapper mapper,
        IActivityService activityService,
        IProjectTeamService projectTeamService
        )
    {
        this.logger = logger;
        this.db = db;
        this.service = service;
        this.mapper = mapper;
        this.activityService = activityService;
        this.projectTeamService = projectTeamService;
    }


    [Authorize]
    [HttpGet]
    public async Task<IActionResult> Get(string? Filters = null, string? Search = null, string? Sort = null)
    {

        var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort).Include(x => x.WorkOrderMasterStages);

        var results = mapper.Map<IEnumerable<WorkOrderMasterDto>>(await query.ToListAsync());

        return Ok(results);

    }

    // GET: api/Teams/
    [Authorize]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetByID(int id)
    {
        var results = mapper.Map<WorkOrderMasterDto>(await service.Get()
            .SingleOrDefaultAsync(x => x.ID == id));

        if (results == null) throw new NotFoundException($"{nameof(WorkOrder)} not found!");

        return Ok(results);
    }

    [HttpGet("uid/{id:guid}")]
    public async Task<IActionResult> GetByGUID(Guid id)
    {

        var results = mapper.Map<WorkOrderMasterDto>(await service.Get()
            .SingleOrDefaultAsync(x => x.UID == id));

        if (results == null) throw new NotFoundException($"{nameof(WorkOrderMaster)} not found!");

        return Ok(results);
    }


    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Post([FromBody] WorkOrderMasterDto Dto)
    {
        var id = await service.Create(mapper.Map<WorkOrderMaster>(Dto));
        var results = mapper.Map<WorkOrderMasterDto>(await service.Get().SingleOrDefaultAsync(x => x.ID == id));

        if (results == null) throw new BadRequestException($"{nameof(WorkOrderMaster)} could not be created!");

        return Ok(results);

    }


    [HttpPut("{id}")]
    [Authorize]
    //[ResponseType(typeof(int))]
    public async Task<IActionResult> Put(int id, [FromBody] WorkOrderMasterDto Dto)
    {

        await service.Update(mapper.Map<WorkOrderMaster>(Dto));

        var results = mapper.Map<WorkOrderMasterDto>(await service.Get().SingleOrDefaultAsync(x => x.ID == id));
        if (results == null) throw new NotFoundException($"{nameof(WorkOrderMaster)} not found!");

        return Ok(results);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var results = mapper.Map<WorkOrderMasterDto>(await service.Get().SingleOrDefaultAsync(x => x.ID == id));
        if (results == null) throw new NotFoundException($"{nameof(WorkOrderMaster)} not found!");

        await service.Delete(id);

        return Ok();

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
    public async Task<IActionResult> GetFeildOptions(string field)
    {
        var results = await service.GetFieldOptions(field);
        return Ok(results);
    }

}
