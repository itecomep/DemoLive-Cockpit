using AutoMapper;
using Microsoft.AspNetCore.Mvc;

using MyCockpitView.WebApi.MeetingModule.Entities;
using MyCockpitView.WebApi.MeetingModule.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;


using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.Responses;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.WebApi.Models;
using MyCockpitView.WebApi.Services;
using MyCockpitView.WebApi.MeetingModule.Services;

namespace MyCockpitView.WebApi.MeetingModule.Controllers;

[Route("[controller]")]
[ApiController]
public class MeetingAttachmentController : ControllerBase
{
    private readonly ILogger<Meeting> logger; // Logs info, warnings, and errors for Meeting operations
    private readonly EntitiesContext db; // Entity Framework database context for data access
    private readonly IMeetingAttachmentService service; // Service for managing meeting agenda attachments
    private readonly IMapper mapper; // AutoMapper for mapping between entities and DTOs

    // Constructor that injects logger, database context, service, and mapper via dependency injection
    public MeetingAttachmentController(
       ILogger<Meeting> logger,
        EntitiesContext db,
        IMeetingAttachmentService service,
        IMapper mapper)
    {
        this.logger = logger;
        this.db = db;
        this.service = service;
        this.mapper = mapper;
    }

    // GET /Entity
    [Authorize]
    [HttpGet]
    public async Task<IActionResult> Get(string? Filters = null, string? Search = null, string? Sort = null)
    {
        var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort);
        var results = mapper.Map<IEnumerable<MeetingAttachmentDto>>(await query.ToListAsync());
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
        var results = mapper.Map<IEnumerable<MeetingAttachmentDto>>(await query
            .Skip(pageSize * page)
            .Take(pageSize)
            .ToListAsync());


        return Ok(new PagedResponse<MeetingAttachmentDto>(results, totalCount, totalPages));
    }

    // GET /Entity/{id}
    [Authorize]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var obj = mapper.Map<MeetingAttachmentDto>(await service.GetById(id));
        if (obj == null) return NotFound();
        if (obj == null) throw new NotFoundException($"{nameof(MeetingAttachment)} not found!");
        return Ok(obj);
    }

    // GET /Entity/uid/{id:guid}
    [HttpGet("uid/{id:guid}")]
    public async Task<IActionResult> GetByGuid(Guid id)
    {
        var obj = mapper.Map<MeetingAttachmentDto>(await service.GetById(id));
        if (obj == null) return NotFound();
        if (obj == null) throw new NotFoundException($"{nameof(MeetingAttachment)} not found!");
        return Ok(obj);
    }

    // POST /Entity
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Post([FromBody] MeetingAttachmentDto dto)
    {
        var entity = mapper.Map<MeetingAttachment>(dto);
        var createdEntityID = await service.Create(entity);
        var results = mapper.Map<MeetingAttachmentDto>(await service.GetById(createdEntityID));
        if (results == null) throw new BadRequestException($"{nameof(MeetingAttachment)} could not be created!");
        return Ok(results);
    }

    // PUT /Entity/{id}
    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> Put(int id, [FromBody] MeetingAttachmentDto dto)
    {
        await service.Update(mapper.Map<MeetingAttachment>(dto));
        var results = mapper.Map<MeetingAttachmentDto>(await service.GetById(id));
        if (results == null) throw new NotFoundException($"{nameof(MeetingAttachment)} not found!");
        return Ok(results);
    }

    // DELETE /Entity/{id}
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var results = mapper.Map<MeetingAttachmentDto>(await service.GetById(id));
        if (results == null) throw new NotFoundException($"{nameof(MeetingAttachment)} not found!");

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
    [HttpPost("excel")]
    public IActionResult ConvertToExcel([FromBody] ExcelDefinition excelDefinition)
    {
        try
        {
            return new FileContentResult(excelDefinition.GetExcel(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
            {
                FileDownloadName = excelDefinition.Filename + ".xlsx"
            };
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred: {ex.Message}");
        }
    }
}

