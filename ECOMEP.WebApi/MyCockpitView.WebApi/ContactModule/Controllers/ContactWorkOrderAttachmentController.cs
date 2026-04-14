using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.ContactModule.Entities;
using MyCockpitView.WebApi.ContactModule.Services;
using MyCockpitView.WebApi.Entities;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.WebApi.Models;
using MyCockpitView.WebApi.Responses;

namespace MyCockpitView.WebApi.ContactModule.Controllers;

[Route("[controller]")]
[ApiController]
public class ContactWorkOrderAttachmentController : ControllerBase
{
    private readonly ILogger<Contact> logger;
    private readonly EntitiesContext db;
    private readonly IContactWorkOrderAttachmentService service;
    private readonly IMapper mapper;

    public ContactWorkOrderAttachmentController(
       ILogger<Contact> logger,
        EntitiesContext db,
        IContactWorkOrderAttachmentService service,
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
        var results = mapper.Map<IEnumerable<ContactWorkOrderAttachmentDto>>(await query.ToListAsync());
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
        var results = mapper.Map<IEnumerable<ContactWorkOrderAttachmentDto>>(await query
            .Skip(pageSize * page)
            .Take(pageSize)
            .ToListAsync());


        return Ok(new PagedResponse<ContactWorkOrderAttachmentDto>(results, totalCount, totalPages));
    }

    // GET /Entity/{id}
    [Authorize]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var obj = mapper.Map<ContactWorkOrderAttachmentDto>(await service.GetById(id));
        if (obj == null) return NotFound();
        if (obj == null) throw new NotFoundException($"{nameof(ContactWorkOrderAttachment)} not found!");
        return Ok(obj);
    }

    // GET /Entity/uid/{id:guid}
    [HttpGet("uid/{id:guid}")]
    public async Task<IActionResult> GetByGuid(Guid id)
    {
        var obj = mapper.Map<ContactWorkOrderAttachmentDto>(await service.GetById(id));
        if (obj == null) return NotFound();
        if (obj == null) throw new NotFoundException($"{nameof(ContactWorkOrderAttachment)} not found!");
        return Ok(obj);
    }

    // POST /Entity
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Post([FromBody] ContactWorkOrderAttachmentDto dto)
    {
        var entity = mapper.Map<ContactWorkOrderAttachment>(dto);
        var createdEntityID = await service.Create(entity);
        var results = mapper.Map<ContactWorkOrderAttachmentDto>(await service.GetById(createdEntityID));
        if (results == null) throw new BadRequestException($"{nameof(ContactWorkOrderAttachment)} could not be created!");
        return Ok(results);
    }

    // PUT /Entity/{id}
    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> Put(int id, [FromBody] ContactWorkOrderAttachmentDto dto)
    {
        await service.Update(mapper.Map<ContactWorkOrderAttachment>(dto));
        var results = mapper.Map<ContactWorkOrderAttachmentDto>(await service.GetById(id));
        if (results == null) throw new NotFoundException($"{nameof(ContactWorkOrderAttachment)} not found!");
        return Ok(results);
    }

    // DELETE /Entity/{id}
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var results = mapper.Map<ContactWorkOrderAttachmentDto>(await service.GetById(id));
        if (results == null) throw new NotFoundException($"{nameof(ContactWorkOrderAttachment)} not found!");

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