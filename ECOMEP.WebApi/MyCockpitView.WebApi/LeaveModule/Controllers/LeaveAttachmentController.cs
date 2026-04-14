using AutoMapper;
using DocumentFormat.OpenXml.Drawing;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.WebApi.LeaveModule.Dtos;
using MyCockpitView.WebApi.LeaveModule.Entities;
using MyCockpitView.WebApi.LeaveModule.Services;
using MyCockpitView.WebApi.Responses;
using MyCockpitView.WebApi.TodoModule.Dtos;
using MyCockpitView.WebApi.TodoModule.Entities;

namespace MyCockpitView.WebApi.LeaveModule.Controllers;

[Route("[controller]")]
[ApiController]
public class LeaveAttachmentController : ControllerBase
{
    private readonly ILogger<LeaveAttachmentController> logger;
    private readonly EntitiesContext db;
    private readonly ILeaveAttachmentService service;
    private readonly IMapper mapper;

    public LeaveAttachmentController(
       ILogger<LeaveAttachmentController> logger,
        EntitiesContext db,
        ILeaveAttachmentService service,
        IMapper mapper)
    {
        this.logger = logger;
        this.db = db;
        this.service = service;
        this.mapper = mapper;
    }

    //Get
    [Authorize]
    [HttpGet]

    public async Task<IActionResult> Get(string? Filters = null, string? Search = null, string? Sort = null)
    {
        var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort);
        var results = mapper.Map<IEnumerable<LeaveAttachmentDto>>(await query.ToListAsync());
        return Ok(results);
    }

    // GET /Entity/Pages
    [Authorize]
    [HttpGet("Pages")]
    public async Task<IActionResult> Get(int page = 0, int pageSize = 50, string? Filters = null, string? Search = null, string? Sort = null)
    {
        var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort);
        var totalCount = await query.CountAsync();
        var totalPages = (int)Math.Ceiling((decimal)totalCount / pageSize);
        var results = mapper.Map<IEnumerable<LeaveAttachmentDto>>(await query
            .Skip(page * pageSize)
            .Take(pageSize)
            .ToListAsync());

        return Ok(new PagedResponse<LeaveAttachmentDto>(results, totalCount, totalPages));
    }

    //GET /Entity/{id}
    [Authorize]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var obj = mapper.Map<LeaveAttachmentDto>(await service.GetById(id));
        if(obj == null) return NotFound();
        if (obj == null) throw new NotFoundException($"{nameof(LeaveAttachment)} not found!");
        return Ok(obj);
    }

    // GET /Entity/uid/{id:guid}
    [HttpGet("uid/{id:guid}")]
    public async Task<IActionResult> GetByGuid(Guid id)
    {
        var obj = mapper.Map<LeaveAttachmentDto>(await service.GetById(id));
        if (obj == null) return NotFound();
        if (obj == null) throw new NotFoundException($"{nameof(LeaveAttachment)} not found!");
        return Ok(obj);
    }

    // POST /Entity
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Post([FromBody] LeaveAttachmentDto dto)
    {
        var entity = mapper.Map<LeaveAttachment>(dto);
        var createdEntityID = await service.Create(entity);
        var results = mapper.Map<LeaveAttachmentDto>(await service.GetById(createdEntityID));
        if (results == null) throw new BadRequestException($"{nameof(LeaveAttachment)} could not be created!");
        return Ok(results);
    }

    // PUT /Entity/{id}
    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> Put(int id, [FromBody] LeaveAttachmentDto dto)
    {
        await service.Update(mapper.Map<LeaveAttachment>(dto));
        var results = mapper.Map<LeaveAttachmentDto>(await service.GetById(id));
        if (results == null) throw new NotFoundException($"{nameof(LeaveAttachment)} not found!");
        return Ok(results);
    }

    // DELETE /Entity/{id}
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var results = mapper.Map<LeaveAttachmentDto>(await service.GetById(id));
        if (results == null) throw new NotFoundException($"{nameof(LeaveAttachment)} not found!");

        await service.Delete(id);
        return Ok();
    }
}
