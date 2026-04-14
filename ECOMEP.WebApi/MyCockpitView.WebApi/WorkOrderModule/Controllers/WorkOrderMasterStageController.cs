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

namespace MyCockpitView.WebApi.WorkOrderModule.Controllers;

[Route("[controller]")]
[ApiController]
public class WorkOrderMasterStageController : ControllerBase
{
    ILogger<WorkOrderMasterStageController> logger;
    private readonly IWorkOrderMasterStageService service;
    private readonly IMapper mapper;
    private readonly IActivityService activityService;
    private readonly EntitiesContext db;
    public WorkOrderMasterStageController(
        ILogger<WorkOrderMasterStageController> logger,
        EntitiesContext db,
        IWorkOrderMasterStageService service,
        IMapper mapper,
        IActivityService activityService
        )
    {
        this.logger = logger;
        this.db = db;
        this.service = service;
        this.mapper = mapper;
        this.activityService = activityService;
    }


    [Authorize]
    [HttpGet]
    public async Task<IActionResult> Get(string? Filters = null, string? Search = null, string? Sort = null)
    {

        var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort);

        var results = mapper.Map<IEnumerable<WorkOrderMasterStageDto>>(await query.ToListAsync());

        return Ok(results);

    }

    // GET: api/Teams/
    [Authorize]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetByID(int id)
    {
        var results = mapper.Map<WorkOrderMasterStageDto>(await service.Get()
            .SingleOrDefaultAsync(x => x.ID == id));

        if (results == null) throw new NotFoundException($"{nameof(WorkOrder)} not found!");

        return Ok(results);
    }

    [HttpGet("uid/{id:guid}")]
    public async Task<IActionResult> GetByGUID(Guid id)
    {

        var results = mapper.Map<WorkOrderMasterStageDto>(await service.Get()
            .SingleOrDefaultAsync(x => x.UID == id));

        if (results == null) throw new NotFoundException($"{nameof(WorkOrderMasterStage)} not found!");

        return Ok(results);
    }


    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Post([FromBody] WorkOrderMasterStageDto Dto)
    {
        var id = await service.Create(mapper.Map<WorkOrderMasterStage>(Dto));
        var results = mapper.Map<WorkOrderMasterStageDto>(await service.Get().SingleOrDefaultAsync(x => x.ID == id));

        if (results == null) throw new BadRequestException($"{nameof(WorkOrderMasterStage)} could not be created!");

        return Ok(results);

    }


    [HttpPut("{id}")]
    [Authorize]
    //[ResponseType(typeof(int))]
    public async Task<IActionResult> Put(int id, [FromBody] WorkOrderMasterStageDto Dto)
    {

        await service.Update(mapper.Map<WorkOrderMasterStage>(Dto));

        var results = mapper.Map<WorkOrderMasterStageDto>(await service.Get().SingleOrDefaultAsync(x => x.ID == id));
        if (results == null) throw new NotFoundException($"{nameof(WorkOrderMasterStage)} not found!");

        return Ok(results);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var results = mapper.Map<WorkOrderMasterStageDto>(await service.Get().SingleOrDefaultAsync(x => x.ID == id));
        if (results == null) throw new NotFoundException($"{nameof(WorkOrderMasterStage)} not found!");

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

}
