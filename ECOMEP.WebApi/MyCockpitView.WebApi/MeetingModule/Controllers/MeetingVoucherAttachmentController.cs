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
using MyCockpitView.WebApi.MeetingModule.Services;

namespace MyCockpitView.WebApi.MeetingModule.Controllers;

[Route("[controller]")]
[ApiController]
public class MeetingVoucherAttachmentController : ControllerBase
{
    private readonly ILogger<MeetingVoucher> logger; // Logs info, warnings, and errors for MeetingVoucher operations
    private readonly EntitiesContext db; // Entity Framework database context for data access
    private readonly IMeetingVoucherAttachmentService service; // Service for managing MeetingVoucher agenda attachments
    private readonly IMapper mapper; // AutoMapper for mapping between entities and DTOs

    // Constructor that injects logger, database context, service, and mapper via dependency injection
    public MeetingVoucherAttachmentController(
       ILogger<MeetingVoucher> logger,
        EntitiesContext db,
        IMeetingVoucherAttachmentService service,
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
        var results = mapper.Map<IEnumerable<MeetingVoucherAttachmentDto>>(await query.ToListAsync());
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
        var results = mapper.Map<IEnumerable<MeetingVoucherAttachmentDto>>(await query
            .Skip(pageSize * page)
            .Take(pageSize)
            .ToListAsync());


        return Ok(new PagedResponse<MeetingVoucherAttachmentDto>(results, totalCount, totalPages));
    }

    // GET /Entity/{id}
    [Authorize]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var obj = mapper.Map<MeetingVoucherAttachmentDto>(await service.GetById(id));
        if (obj == null) return NotFound();
        if (obj == null) throw new NotFoundException($"{nameof(MeetingVoucherAttachment)} not found!");
        return Ok(obj);
    }

    // GET /Entity/uid/{id:guid}
    [HttpGet("uid/{id:guid}")]
    public async Task<IActionResult> GetByGuid(Guid id)
    {
        var obj = mapper.Map<MeetingVoucherAttachmentDto>(await service.GetById(id));
        if (obj == null) return NotFound();
        if (obj == null) throw new NotFoundException($"{nameof(MeetingVoucherAttachment)} not found!");
        return Ok(obj);
    }

    // POST /Entity
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Post([FromBody] MeetingVoucherAttachmentDto dto)
    {
        var entity = mapper.Map<MeetingVoucherAttachment>(dto);
        var createdEntityID = await service.Create(entity);
        var results = mapper.Map<MeetingVoucherAttachmentDto>(await service.GetById(createdEntityID));
        if (results == null) throw new BadRequestException($"{nameof(MeetingVoucherAttachment)} could not be created!");
        return Ok(results);
    }

    // PUT /Entity/{id}
    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> Put(int id, [FromBody] MeetingVoucherAttachmentDto dto)
    {
        await service.Update(mapper.Map<MeetingVoucherAttachment>(dto));
        var results = mapper.Map<MeetingVoucherAttachmentDto>(await service.GetById(id));
        if (results == null) throw new NotFoundException($"{nameof(MeetingVoucherAttachment)} not found!");
        return Ok(results);
    }

    // DELETE /Entity/{id}
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var results = mapper.Map<MeetingVoucherAttachmentDto>(await service.GetById(id));
        if (results == null) throw new NotFoundException($"{nameof(MeetingVoucherAttachment)} not found!");

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

