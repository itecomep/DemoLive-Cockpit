
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.Exceptions;

namespace MyCockpitView.WebApi.StatusMasterModule;

[Route("[controller]")]
[ApiController]
public class StatusMasterController : ControllerBase
{
    ILogger<StatusMasterController> _logger;
    private readonly IStatusMasterService _service;
    // private readonly IMapper _mapper;
    private readonly EntitiesContext _entitiesContext;
    public StatusMasterController(
        ILogger<StatusMasterController> logger,
        EntitiesContext entitiesContext,
        IStatusMasterService StatusMasterService
        // IMapper mapper
        )
    {
        _logger = logger;
        _entitiesContext = entitiesContext;
        _service = StatusMasterService;
        // _mapper = mapper;
    }


    [Authorize]
    [HttpGet]
    public async Task<IActionResult> Get(string? Filters = null, string? Search = null, string? Sort = null)
    {

        var query = _service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort);

        var results = await query
            .ToListAsync();

        return Ok(results);

    }

    // GET: api/StatusMasters/5
    [Authorize]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetByID(int id)
    {

        var results = await _service.GetById(id);

        if (results == null) throw new NotFoundException($"{nameof(StatusMaster)} not found!");

        return Ok(results);

    }

    [HttpGet("uid/{id:guid}")]
    public async Task<IActionResult> GetByGUID(Guid id)
    {

        var results = await _service.GetById(id);

        if (results == null) throw new NotFoundException($"{nameof(StatusMaster)} not found!");

        return Ok(results);

    }


    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Post([FromBody] StatusMaster Dto)
    {

        var results = await _service.GetById(await _service.Create(Dto));

        if (results == null) throw new BadRequestException($"{nameof(StatusMaster)} could not be created!");

        return Ok(results);

    }


    [HttpPut("{id}")]
    [Authorize]
    //[ResponseType(typeof(int))]
    public async Task<IActionResult> Put(int id, [FromBody] StatusMaster Dto)
    {

        await _service.Update(Dto);

        var results = await _service.GetById(id);
        if (results == null) throw new NotFoundException($"{nameof(StatusMaster)} not found!");

        return Ok(results);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.Delete(id);
        return Ok();

    }
}
