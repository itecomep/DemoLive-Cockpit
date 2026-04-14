using AutoMapper;
using DocumentFormat.OpenXml.Drawing.Charts;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.AssetModule.Dtos;
using MyCockpitView.WebApi.AssetModule.Entities;
using MyCockpitView.WebApi.AssetModule.Services;
using MyCockpitView.WebApi.ContactModule.Controllers;
using MyCockpitView.WebApi.ContactModule.Dtos;
using MyCockpitView.WebApi.ContactModule.Services;
using MyCockpitView.WebApi.Responses;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.AssetModule.Controllers;

[Route("[controller]")]
[ApiController]
public class AssetAttachmentController : ControllerBase
{
    private readonly IBaseAttachmentService<AssetAttachment> service;
    private readonly EntitiesContext db;
 
    private readonly IMapper mapper;

    public AssetAttachmentController(
         ILogger<AssetScheduleController> logger,
         EntitiesContext entitiesContext,
         IBaseAttachmentService<AssetAttachment> baseAttachmentService,
         IMapper mapper
        )
    {
        db = entitiesContext;
        this.service = baseAttachmentService;
        this.mapper = mapper;
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<AssetAttachmentDto>> Post([FromBody] AssetAttachmentDto dto)
    {
        try
        {
            var createdId = await service.Create(mapper.Map<AssetAttachment>(dto));
            var model = mapper.Map<AssetAttachmentDto>(await service.GetById(createdId));

            if (model != null)
            {
                return CreatedAtAction(nameof(Post), new { id = createdId }, model);
            }

            return BadRequest("Failed to create attachment");
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpPut("{id:int}")]
    [Authorize]
    public async Task<ActionResult<AssetAttachmentDto>> Put(int id, [FromBody] AssetAttachmentDto dto)
    {
        try
        {
            await service.Update(mapper.Map<AssetAttachment>(dto));
            var result = mapper.Map<AssetAttachmentDto>(await service.GetById(id));

            if (result == null)
                return BadRequest("Not Modified");

            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpDelete("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await service.Delete(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpGet("search-tag-options")]
    [Authorize]
    public async Task<IActionResult> GetSearchTagOptions()
    {
        try
        {
            var options = await service.GetSearchTagOptions();
            return Ok(options);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }
}