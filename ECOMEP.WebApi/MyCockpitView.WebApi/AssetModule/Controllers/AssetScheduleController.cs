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

namespace MyCockpitView.WebApi.AssetModule.Controllers;

[Route("[controller]")]
[ApiController]
public class AssetScheduleController : ControllerBase
{
    private readonly IAssetScheduleService service;
    private readonly EntitiesContext db;
    private readonly ContactService contactService;
    private readonly IMapper mapper;

    public AssetScheduleController(
         ILogger<AssetScheduleController> logger,
         EntitiesContext entitiesContext,
         IAssetScheduleService assetScheduleService,
         IMapper mapper
        )
    {
        db = entitiesContext;
        this.service = assetScheduleService;
        this.mapper = mapper;
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> Get(string? Filters = null, string? Search = null, string? Sort = null)
    {
        try
        {
            var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort)
                    .Include(x => x.Components)
                    .Include(x => x.Attachments);

            // Fixed: Use lowercase 'mapper' (the injected instance) instead of 'Mapper' (static class)
            var results = mapper.Map<IEnumerable<AssetScheduleDto>>(await query.ToListAsync());
            return Ok(results);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }


    [Authorize]
    [HttpGet("Pages")]
    public async Task<IActionResult> GetPages(int page = 0, int pageSize = 10, string? Filters = null, string? Search = null, string? Sort = null)
    {
        try
        {
            var query = service.Get(
                Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null,
                Search,
                Sort)
                .Include(x => x.Attachments)
                .Include(x => x.Components)
                .Include(x => x.Asset);

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((decimal)totalCount / pageSize);

            var results = mapper.Map<IEnumerable<AssetScheduleDto>>(await query
                            .Skip(pageSize * page)
                            .Take(pageSize)
                            .ToListAsync());

            var flagValues = await db.TypeMasters
     .Where(x => x.Entity == nameof(AssetSchedule))
     .ToListAsync();

            foreach (var obj in results)
            {
                var matchingFlag = flagValues.FirstOrDefault(x => x.Value == obj.TypeFlag);
                obj.TypeValue = matchingFlag?.Title ?? string.Empty;
            }

            return Ok(new PagedResponse<AssetScheduleDto>(results, totalCount, totalPages));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message, stackTrace = ex.StackTrace });
        }
    }


    [HttpGet("{id:int}")]
    public async Task<ActionResult<AssetScheduleDto>> GetById(int id)
    {
        try
        {
            var query = await service.Get()
                .Include(x => x.Contact)
                .Include(x => x.Components)
                .Include(x => x.Attachments)
                .SingleOrDefaultAsync(x => x.ID == id);

            if (query == null)
                return NotFound();

            var result = mapper.Map<AssetScheduleDto>(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpGet("uid/{id:guid}")]
    public async Task<ActionResult<AssetScheduleDto>> GetByGuid(Guid id)
    {
        try
        {
            var entity = await service.Get()
                .Include(x => x.Contact)
                .Include(x => x.Components)
                .Include(x => x.Attachments)
                .SingleOrDefaultAsync(x => x.UID == id);

            if (entity == null)
                return NotFound();

            var query = mapper.Map<AssetScheduleDto>(entity);
            return Ok(query);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpPost]
    public async Task<ActionResult<AssetScheduleDto>> Post([FromBody] AssetScheduleDto dto)
    {
        try
        {
            var id = await service.Create(mapper.Map<AssetSchedule>(dto));

            var result = mapper.Map<AssetScheduleDto>(
                await service.Get()
                    .Include(x => x.Contact)
                    .Include(x => x.Attachments)
                    .SingleOrDefaultAsync(x => x.ID == id));

            if (result == null)
                return BadRequest("Not Created");

            if (result.TypeFlag == McvConstant.ASSET_SCHEDULE_TYPE_FLAG_ISSUE)
            {
               // var users = await db.Employees
                //    .AsNoTracking()
                //    .Where(x => !x.IsDeleted)
                //    .Include(x => x.Contact.AppRoles)
                //    .Where(s => s.Contact.AppRoles.Any(x => x.Code == McvConstant.ROLE_MAINTENANCE_EXECUTIVE))
                 //   .ToListAsync();

                //foreach (var employee in users)
              //  {
              //      var alertAdmin = new Alert
                //    {
                  //      Type = "Asset",
                    //    Title = $"New Asset Issue | {result.Category} | {result.Title}",
                      //  Message = $"{result.Description}",
                        //EmployeeID = Convert.ToInt32(employee.ID),
           //             Entity = nameof(Asset),
             //           EntityID = result.AssetID,
               //     };
               //
                //    await _alertService.Create(alertAdmin);
                //}
            }

            return CreatedAtAction(nameof(GetById), new { id = result.ID }, result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<AssetScheduleDto>> Put(int id, [FromBody] AssetScheduleDto dto)
    {
        try
        {
            await service.Update(mapper.Map<AssetSchedule>(dto));

            var result = mapper.Map<AssetScheduleDto>(
                await service.Get()
                    .Include(x => x.Contact)
                    .Include(x => x.Components)
                    .Include(x => x.Attachments)
                    .SingleOrDefaultAsync(x => x.ID == id));

            if (result == null)
                return BadRequest("Not Modified");

            if (result.TypeFlag == McvConstant.ASSET_SCHEDULE_TYPE_FLAG_ISSUE &&
                result.StatusFlag == McvConstant.ASSET_SCHEDULE_STATUS_FLAG_COMPLETED)
            {
                // NOTIFY CREATOR
             //   var employee = await db.Employees
              //      .AsNoTracking()
              //      .Where(x => !x.IsDeleted)
              //      .Include(x => x.Contact)
              //      .FirstOrDefaultAsync(x => x.Contact.ID == result.ContactID);

                //if (employee != null)
               // {
               //     var alertAdmin = new Alert
               //     {
               //         Type = "Asset",
               //         Title = $"Asset Issue Resolved | {result.Category} | {result.Title}",
               //         Message = $"{result.ResolutionMessage}",
                //        EmployeeID = employee.ID,
                //        Entity = nameof(Asset),
                //        EntityID = result.AssetID,
                 //   };

               //     await _alertService.Create(alertAdmin);
              //  }
            }
            else if (result.TypeFlag == McvConstant.ASSET_SCHEDULE_TYPE_FLAG_ISSUE &&
                     result.StatusFlag == McvConstant.ASSET_SCHEDULE_STATUS_FLAG_VERIFIED)
            {
                // NOTIFY CREATOR
           //     var employee = await _db.Employees
            //        .AsNoTracking()
            //        .Where(x => !x.IsDeleted)
            //        .Include(x => x.Contact)
            //        .FirstOrDefaultAsync(x => x.Contact.ID == result.ContactID);

            //    if (employee != null)
            //    {
            ///        var alertAdmin = new Alert
            //        {
            //            Type = "Asset",
            //            Title = $"Asset Issue Resolved & Verified | {result.Category} | {result.Title}",
            //            Message = $"{result.ResolutionMessage}",
             //           EmployeeID = employee.ID,
            //            Entity = nameof(Asset),
            //            EntityID = result.AssetID,
            //        };

           //         await _alertService.Create(alertAdmin);
            //    }
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpDelete("{id:int}")]
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

    [HttpGet("field-options")]
    public async Task<IActionResult> GetFieldOptions([FromQuery] string field)
    {
        try
        {
            var options = await service.GetFieldOptions(field);
            return Ok(options);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpGet("send-reminder")]
    public async Task<IActionResult> SendReminder()
    {
        try
        {
           // var users = await db.Employees
           //     .AsNoTracking()
          //      .Where(x => !x.IsDeleted)
          //      .Include(x => x.Contact.AppRoles)
          //      .Where(s => s.Contact.AppRoles.Any(x => x.Code == McvConstant.ROLE_MAINTENANCE_EXECUTIVE))
           //     .ToListAsync();

            var nextDue = await db.Assets
                .Where(x => !x.IsDeleted)
                .Include(x => x.Schedules)
                .Where(x => x.StatusFlag == McvConstant.ASSET_STATUS_FLAG_INUSE)
                .Select(x => new
                {
                    x.ID,
                    x.Code,
                    x.Title,
                    x.Subtitle,
                    x.Category,
                    NextScheduleDate = x.Schedules
                        .Where(s => !s.IsDeleted &&
                               s.TypeFlag == McvConstant.ASSET_SCHEDULE_TYPE_FLAG_MAINTENANCE &&
                               s.StatusFlag == McvConstant.ASSET_SCHEDULE_STATUS_FLAG_PENDING &&
                               s.NextScheduleDate != null)
                        .OrderByDescending(s => s.NextScheduleDate)
                        .FirstOrDefault()!.NextScheduleDate
                })
                .Where(x => x.NextScheduleDate != null && x.NextScheduleDate <= DateTime.UtcNow)
                .ToListAsync();

            foreach (var obj in nextDue)
            {
            //    foreach (var employee in users)
            //    {
            //        var alert = new Alert
            //        {
            //            Type = "Asset",
            //            Title = $"Asset Maintenance | {obj.Category} |{obj.Code}-{obj.Title}-{obj.Subtitle}",
            //            Message = $"Due on:{ClockTools.GetIST(obj.NextScheduleDate!.Value):dd MMM yyyy}",
            //            EmployeeID = Convert.ToInt32(employee.ID),
            //            Entity = nameof(Asset),
            //            EntityID = obj.ID,
            //        };

             //       await _alertService.Create(alert);
           //     }
            }

            var weekBeforeNow = DateTime.UtcNow.AddDays(-7).Date;

            var verificationDue = await db.AssetSchedules
                .Where(x => !x.IsDeleted)
                .Where(x => x.StatusFlag == McvConstant.ASSET_SCHEDULE_STATUS_FLAG_COMPLETED)
                .Where(x => x.Modified.Date == weekBeforeNow)
                .Select(x => new
                {
                    x.AssetID,
                    x.Title,
                    x.Category,
                    x.Modified,
                })
                .ToListAsync();

            foreach (var obj in verificationDue)
            {
             //   foreach (var employee in users)
             //   {
            //        var alert = new Alert
             //       {
            //            Type = "Asset",
            //            Title = $"Asset Verification | {obj.Category} |{obj.Title}",
            //            Message = $"Due on:{ClockTools.GetIST(obj.Modified.AddDays(7)):dd MMM yyyy}",
            //            EmployeeID = Convert.ToInt32(employee.ID),
             //           Entity = nameof(Asset),
             //           EntityID = obj.AssetID,
            //        };

            //        await _alertService.Create(alert);
             //   }
            }

            return Ok();
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

}