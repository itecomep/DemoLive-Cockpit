using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.ActivityModule;
using MyCockpitView.WebApi.Dtos;
using MyCockpitView.WebApi.Entities;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.WebApi.WorkOrderModule.Dtos;
using MyCockpitView.WebApi.WorkOrderModule.Entities;
using MyCockpitView.WebApi.WorkOrderModule.Services;

namespace MyCockpitView.WebApi.WorkOrderModule.Controllers;

[Route("[controller]")]
[ApiController]
public class WorkOrderStageController : ControllerBase
{
    ILogger<WorkOrderStageController> logger;
    private readonly IWorkOrderStageService service;
    private readonly IMapper mapper;
    private readonly IActivityService activityService;
    private readonly EntitiesContext db;

    public WorkOrderStageController(
        ILogger<WorkOrderStageController> logger,
        EntitiesContext db,
        IWorkOrderStageService service,
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

        var results = mapper.Map<IEnumerable<WorkOrderStageDto>>(await query.ToListAsync());

        return Ok(results);

    }

    // GET: api/Teams/
    [Authorize]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetByID(int id)
    {
        var results = mapper.Map<WorkOrderStageDto>(await service.Get()
            .SingleOrDefaultAsync(x => x.ID == id));

        if (results == null) throw new NotFoundException($"{nameof(WorkOrderStage)} not found!");

        return Ok(results);
    }

    [HttpGet("uid/{id:guid}")]
    public async Task<IActionResult> GetByGUID(Guid id)
    {

        var results = mapper.Map<WorkOrderStageDto>(await service.Get()
            .SingleOrDefaultAsync(x => x.UID == id));

        if (results == null) throw new NotFoundException($"{nameof(WorkOrderStage)} not found!");

        return Ok(results);
    }


    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Post([FromBody] WorkOrderStageDto Dto)
    {
        var id = await service.Create(mapper.Map<WorkOrderStage>(Dto));
        var results = mapper.Map<WorkOrderStageDto>(await service.Get().SingleOrDefaultAsync(x => x.ID == id));

        if (results == null) throw new BadRequestException($"{nameof(WorkOrderStage)} could not be created!");

        return Ok(results);

    }


    [HttpPut("{id}")]
    [Authorize]
    //[ResponseType(typeof(int))]
    public async Task<IActionResult> Put(int id, [FromBody] WorkOrderStageDto Dto)
    {

        //await service.Update(mapper.Map<WorkOrderStage>(Dto));

        //var results = mapper.Map<WorkOrderStageDto>(await service.Get().SingleOrDefaultAsync(x => x.ID == id));
        //if (results == null) throw new NotFoundException($"{nameof(WorkOrderStage)} not found!");

        //Stage History
        var _stage = await db.WorkOrderStages.AsNoTracking().SingleOrDefaultAsync(x => x.ID == Dto.ID);
        if (_stage == null) throw new EntityServiceException("Stage not found!");


        if (_stage.DueDate.HasValue && Dto.DueDate.HasValue &&
        _stage.DueDate.Value.Date != Dto.DueDate.Value.Date)
        {
            var newStageVersion = new WorkOrderStage();
            db.Entry(newStageVersion).CurrentValues.SetValues(_stage);
            newStageVersion.ID = default(int);
            newStageVersion.UID = default(Guid);
            newStageVersion.IsReadOnly = true;
            newStageVersion.ProjectID = _stage.ProjectID;
            newStageVersion.WorkOrderID = _stage.WorkOrderID;
            newStageVersion.ParentID = _stage.ID;

            db.WorkOrderStages.Add(newStageVersion);
            await db.SaveChangesAsync();
        }

        await service.Update(mapper.Map<WorkOrderStage>(Dto));

        var results = mapper.Map<WorkOrderStageDto>(await service.GetById(id));
        if (results == null) throw new NotFoundException($"{nameof(WorkOrderStage)} not found!");

        return Ok(results);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var results = mapper.Map<WorkOrderStageDto>(await service.Get().SingleOrDefaultAsync(x => x.ID == id));
        if (results == null) throw new NotFoundException($"{nameof(WorkOrderStage)} not found!");

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
