using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MyCockpitView.WebApi.Dtos;
using MyCockpitView.WebApi.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;


using MyCockpitView.Utility.Common;

using MyCockpitView.WebApi.Models;
using MyCockpitView.WebApi.Services;
using MyCockpitView.WebApi.Responses;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.WebApi.ProjectModule.Services;


namespace MyCockpitView.WebApi.ProjectModule.Controllers;

[Route("[controller]")]
[ApiController]
public class ProjectAttachmentController : ControllerBase
{
    private readonly ILogger<Project> logger;
    private readonly EntitiesContext db;
    private readonly IProjectAttachmentService service;
    private readonly IMapper mapper;

    public ProjectAttachmentController(
       ILogger<Project> logger,
        EntitiesContext db,
        IProjectAttachmentService service,
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
        var results = mapper.Map<IEnumerable<ProjectAttachmentDto>>(await query.ToListAsync());
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
        var results = mapper.Map<IEnumerable<ProjectAttachmentDto>>(await query
            .Skip(pageSize * page)
            .Take(pageSize)
            .ToListAsync());


        return Ok(new PagedResponse<ProjectAttachmentDto>(results, totalCount, totalPages));
    }

    // GET /Entity/{id}
    [Authorize]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var obj = mapper.Map<ProjectAttachmentDto>(await service.GetById(id));
        if (obj == null) return NotFound();
        if (obj == null) throw new NotFoundException($"{nameof(ProjectAttachment)} not found!");
        return Ok(obj);
    }

    // GET /Entity/uid/{id:guid}
    [HttpGet("uid/{id:guid}")]
    public async Task<IActionResult> GetByGuid(Guid id)
    {
        var obj = mapper.Map<ProjectAttachmentDto>(await service.GetById(id));
        if (obj == null) return NotFound();
        if (obj == null) throw new NotFoundException($"{nameof(ProjectAttachment)} not found!");
        return Ok(obj);
    }

    // POST /Entity
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Post([FromBody] ProjectAttachmentDto dto)
    {
        var entity = mapper.Map<ProjectAttachment>(dto);
        var createdEntityID = await service.Create(entity);
        var results = mapper.Map<ProjectAttachmentDto>(await service.GetById(createdEntityID));
        if (results == null) throw new BadRequestException($"{nameof(ProjectAttachment)} could not be created!");
        return Ok(results);
    }

    // PUT /Entity/{id}
    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> Put(int id, [FromBody] ProjectAttachmentDto dto)
    {
        await service.Update(mapper.Map<ProjectAttachment>(dto));
        var results = mapper.Map<ProjectAttachmentDto>(await service.GetById(id));
        if (results == null) throw new NotFoundException($"{nameof(ProjectAttachment)} not found!");
        return Ok(results);
    }

    // DELETE /Entity/{id}
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var results = mapper.Map<ProjectAttachmentDto>(await service.GetById(id));
        if (results == null) throw new NotFoundException($"{nameof(ProjectAttachment)} not found!");

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

    [HttpGet("GenerateFolders")]
    public async Task<IActionResult> GenerateFolders()
    {
        var projects=await db.Projects.AsNoTracking().Select(x=>x.ID).ToListAsync();

        foreach (var id in projects) { 
            await service.CreateProjectRootFolders(id);
        }
        await db.SaveChangesAsync();

        //var attachments = await service.Get().ToListAsync();

        //var folders=    attachments.Where(x=>x.IsFolder);
        //var files = attachments.Where(x => !x.IsFolder);
        //Console.WriteLine($"{folders.Count()} folders found!");

        //Console.WriteLine($"{files.Count()} files found!");

        //foreach (var item in files.Where(x => !x.IsFolder && x.ParentID==null))
        //{
        //    var folder = folders.FirstOrDefault(x => x.ProjectID == item.ProjectID && x.Filename == item.Title);

        //    if (folder == null)
        //    {
        //        //folder = new ProjectAttachment
        //        //{
        //        //    ProjectID = item.ProjectID,
        //        //    Filename = item.Title,
        //        //    IsFolder = true,
        //        //    Created = item.Created,
        //        //    Modified = item.Modified,
        //        //    CreatedBy = item.CreatedBy,
        //        //    ModifiedBy = item.ModifiedBy,
        //        //    CreatedByContactID = item.CreatedByContactID,
        //        //    ModifiedByContactID = item.ModifiedByContactID,
        //        //};

        //        //Console.WriteLine($"Creating folder {folder.Filename}!");
        //        //await service.Create(folder);
        //    }
        //    else
        //    {
        //        Console.WriteLine($"Folder exists {folder.Filename}!");
        //    }

        //    Console.WriteLine($"Adding file to folder!");
        //    item.ParentID = folder.ID;
        //    item.FolderPath = folder.Filename;
        //    await service.Update(item);

        //    Console.WriteLine($"=========================");
        //}

        return Ok();
    }
}

