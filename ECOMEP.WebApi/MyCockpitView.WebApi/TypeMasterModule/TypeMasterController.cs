
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.Exceptions;

namespace MyCockpitView.WebApi.TypeMasterModule;

[Route("[controller]")]
[ApiController]
public class TypeMasterController : ControllerBase
{
    ILogger<TypeMasterController> _logger;
    private readonly ITypeMasterService _service;
    // private readonly IMapper _mapper;
    private readonly EntitiesContext _entitiesContext;
    public TypeMasterController(
        ILogger<TypeMasterController> logger,
        EntitiesContext entitiesContext,
        ITypeMasterService TypeMasterService
        // IMapper mapper
        )
    {
        _logger = logger;
        _entitiesContext = entitiesContext;
        _service = TypeMasterService;
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

    // GET: api/TypeMasters/5
    [Authorize]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetByID(int id)
    {

        var results = await _service.GetById(id);

        if (results == null) throw new NotFoundException($"{nameof(TypeMaster)} not found!");

        return Ok(results);

    }

    [HttpGet("uid/{id:guid}")]
    public async Task<IActionResult> GetByGUID(Guid id)
    {

        var results = await _service.GetById(id);

        if (results == null) throw new NotFoundException($"{nameof(TypeMaster)} not found!");

        return Ok(results);

    }


    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Post([FromBody] TypeMaster Dto)
    {

        var results = await _service.GetById(await _service.Create(Dto));

        if (results == null) throw new BadRequestException($"{nameof(TypeMaster)} could not be created!");

        return Ok(results);

    }


    [HttpPut("{id}")]
    [Authorize]
    //[ResponseType(typeof(int))]
    public async Task<IActionResult> Put(int id, [FromBody] TypeMaster Dto)
    {

        await _service.Update(Dto);

        var results = await _service.GetById(id);
        if (results == null) throw new NotFoundException($"{nameof(TypeMaster)} not found!");

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
