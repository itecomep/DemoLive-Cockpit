using AutoMapper;
using DocumentFormat.OpenXml.Drawing.Charts;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
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
public class AssetScheduleComponentController : ControllerBase
{
    private readonly IBaseEntityService<AssetScheduleComponent> service;
    private readonly EntitiesContext db;
    private readonly ContactService contactService;
    private readonly IMapper mapper;
    private readonly ILogger<AssetScheduleComponentController> logger;

    public AssetScheduleComponentController(
         ILogger<AssetScheduleComponentController> logger,
         EntitiesContext entitiesContext,
         IBaseEntityService<AssetScheduleComponent> baseEntityService,
         IMapper mapper
        )
    {
        db = entitiesContext;
        this.service = baseEntityService;
        this.mapper = mapper;
        this.logger = logger;
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> Get(string? Filters = null, string? Search = null, string? Sort = null)
    {
        try
        {
            var query = service.Get(
                Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null,
                Search,
                Sort);

            var entities = await query.ToListAsync();
            var results = mapper.Map<IEnumerable<AssetScheduleComponentDto>>(entities);

            return Ok(results);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred while fetching asset schedule components");
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                Message = "An unexpected error occurred while fetching asset schedule components.",
                Details = ex.Message
            });
        }
    }

    [Authorize]
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var query = await service.Get()
                .SingleOrDefaultAsync(x => x.ID == id);

            if (query == null)
            {
                return NotFound(new { Message = $"Asset schedule component with ID {id} not found." });
            }

            var result = mapper.Map<AssetScheduleComponentDto>(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred while fetching asset schedule component by ID {Id}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                Message = ex.Message
            });
        }
    }

    [HttpGet("uid/{id:guid}")]
    public async Task<IActionResult> GetByGUID(Guid id)
    {
        try
        {
            var query = await service.Get()
                .SingleOrDefaultAsync(x => x.UID == id);

            if (query == null)
            {
                return NotFound(new { Message = $"Asset schedule component with UID {id} not found." });
            }

            var result = mapper.Map<AssetScheduleComponentDto>(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred while fetching asset schedule component by UID {UID}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                Message = ex.Message
            });
        }
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Post([FromBody] AssetScheduleComponentDto dto)
    {
        try
        {
            var id = await service.Create(mapper.Map<AssetScheduleComponent>(dto));

            var result = await service.Get()
                .SingleOrDefaultAsync(x => x.ID == id);

            if (result == null)
            {
                return BadRequest(new { Message = "Not Created" });
            }

            var resultDto = mapper.Map<AssetScheduleComponentDto>(result);
            return Ok(resultDto);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred while creating asset schedule component");
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                Message = "An unexpected error occurred while creating the asset schedule component.",
                Details = ex.Message
            });
        }
    }

    [Authorize]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Put(int id, [FromBody] AssetScheduleComponentDto dto)
    {
        try
        {
            await service.Update(mapper.Map<AssetScheduleComponent>(dto));

            var result = await service.Get()
                .SingleOrDefaultAsync(x => x.ID == id);

            if (result == null)
            {
                return BadRequest(new { Message = "Not Modified" });
            }

            var resultDto = mapper.Map<AssetScheduleComponentDto>(result);
            return Ok(resultDto);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred while updating asset schedule component {Id}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                Message = ex.Message
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
            logger.LogInformation("Asset schedule component {Id} deleted successfully", id);
            return Ok();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred while deleting asset schedule component {Id}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                Message = ex.Message
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
                Message = ex.Message
            });
        }
    }

    [Authorize]
    [HttpGet("FieldOptions")]
    public async Task<IActionResult> GetFieldOptions(string field)
    {
        try
        {
            return Ok(await service.GetFieldOptions(field));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred while fetching field options for {Field}", field);
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                Message = ex.Message
            });
        }
    }

    //[HttpGet("SendReminder")]
    //public async Task<IActionResult> SendReminder()
    //{
    //    try
    //    {
    //        // Get admin executives
    //        var admins = await db.Employees
    //            .AsNoTracking()
    //            .Where(x => !x.IsDeleted)
    //            .Include(x => x.Contact.AppRoles)
    //            .Where(s => s.Contact.AppRoles.Any(x =>
    //                x.Code.Equals(McvConstant.ROLE_ADMIN_EXECUTIVE, StringComparison.OrdinalIgnoreCase)))
    //            .ToListAsync();

    //        // Get assets with next due maintenance
    //        var nextDue = await db.Assets
    //            .Where(x => !x.IsDeleted)
    //            .Include(x => x.Schedules)
    //            .Where(x => x.StatusFlag == McvConstant.ASSET_STATUS_FLAG_INUSE)
    //            .Select(x => new
    //            {
    //                x.ID,
    //                x.Code,
    //                x.Title,
    //                NextScheduleDate = x.Schedules
    //                    .Where(s => !s.IsDeleted && s.NextScheduleDate != null)
    //                    .OrderByDescending(s => s.NextScheduleDate)
    //                    .FirstOrDefault()!.NextScheduleDate
    //            })
    //            .Where(x => x.NextScheduleDate != null)
    //            .ToListAsync();

    //        // Create alerts for each asset and admin
    //        //foreach (var obj in nextDue)
    //        //{
    //        //    foreach (var admin in admins)
    //        //    {
    //        //        var alertAdmin = new Alert
    //        //        {
    //        //            Type = "Asset",
    //        //            Title = $"Asset Maintenance | {obj.Code}-{obj.Title}",
    //        //            Message = $"Due on: {ClockTools.GetIST(obj.NextScheduleDate!.Value):dd MMM yyyy}",
    //        //            EmployeeID = Convert.ToInt32(admin.ID),
    //        //            Entity = nameof(Asset),
    //        //            EntityID = obj.ID,
    //        //        };

    //        //        await alertService.Create(alertAdmin);
    //        //    }
    //        //}

    //        logger.LogInformation("Asset maintenance reminders sent successfully. {Count} assets processed", nextDue.Count);
    //        return Ok(new { Message = "Reminders sent successfully", AssetsProcessed = nextDue.Count });
    //    }
    //    catch (Exception ex)
    //    {
    //        logger.LogError(ex, "Error occurred while sending reminders");
    //        return StatusCode(StatusCodes.Status500InternalServerError, new
    //        {
    //            Message = "An unexpected error occurred while sending reminders.",
    //            Details = ex.Message
    //        });
    //    }
    //}

}