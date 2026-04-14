using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.AssetModule.Dtos;
using MyCockpitView.WebApi.AssetModule.Entities;
using MyCockpitView.WebApi.AssetModule.Services;
using MyCockpitView.WebApi.Responses;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.AssetModule.Controllers;

[Route("[controller]")]
[ApiController]
public class AssetScheduleAttachmentController : ControllerBase
{
    private readonly IBaseAttachmentService<AssetScheduleAttachment> service;
    private readonly EntitiesContext db;
    private readonly ILogger<AssetScheduleAttachmentController> logger;  // FIXED: Changed from AssetScheduleController
    private readonly IMapper mapper;

    public AssetScheduleAttachmentController(
         ILogger<AssetScheduleAttachmentController> logger,  // FIXED: Correct logger type
         EntitiesContext entitiesContext,
         IBaseAttachmentService<AssetScheduleAttachment> baseAttachmentService,
         IMapper mapper)
    {
        this.logger = logger;
        this.db = entitiesContext;
        this.service = baseAttachmentService;
        this.mapper = mapper;
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Post([FromBody] AssetScheduleAttachmentDto dto)
    {
        try
        {
            var id = await service.Create(mapper.Map<AssetScheduleAttachment>(dto));
            var entity = await service.GetById(id);

            if (entity == null)
            {
                return BadRequest(new { Message = "Not Created" });
            }

            var result = mapper.Map<AssetScheduleAttachmentDto>(entity);
            return Ok(result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred while creating asset schedule attachment");
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                Message = "An unexpected error occurred while creating the asset schedule attachment.",
                Details = ex.Message
            });
        }
    }

    [Authorize]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Put(int id, [FromBody] AssetScheduleAttachmentDto dto)
    {
        try
        {
            await service.Update(mapper.Map<AssetScheduleAttachment>(dto));

            var entity = await service.GetById(id);
            if (entity == null)
            {
                return BadRequest(new { Message = "Not Modified" });
            }

            var result = mapper.Map<AssetScheduleAttachmentDto>(entity);
            return Ok(result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred while updating asset schedule attachment {Id}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                Message = "An unexpected error occurred while updating the asset schedule attachment.",
                Details = ex.Message
            });
        }
    }

    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await service.Delete(id);
            logger.LogInformation("Asset schedule attachment {Id} deleted successfully", id);
            return Ok();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred while deleting asset schedule attachment {Id}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                Message = "An unexpected error occurred while deleting the asset schedule attachment.",
                Details = ex.Message
            });
        }
    }

    [Authorize]
    [HttpGet("SearchTagOptions")]
    public async Task<IActionResult> GetSearchTagOptions()
    {
        try
        {
            return Ok(await service.GetSearchTagOptions());
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred while fetching search tag options");
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                Message = "An unexpected error occurred while fetching search tag options.",
                Details = ex.Message
            });
        }
    }
}