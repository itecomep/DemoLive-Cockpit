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
public class AssetLinkController : ControllerBase
{
    private readonly IBaseEntityService<AssetLink> service;
    private readonly EntitiesContext db;
 
    private readonly IMapper mapper;

    public AssetLinkController(
         ILogger<AssetScheduleController> logger,
         EntitiesContext entitiesContext,
         IBaseEntityService<AssetLink> baseEntityService,
         IMapper mapper
        )
    {
        db = entitiesContext;
        this.service = baseEntityService;
        this.mapper = mapper;
    }
    [HttpGet]
    [Authorize]
    public async Task<ActionResult<IEnumerable<AssetLinkDto>>> Get(
    [FromQuery] string? Filters = null,
    [FromQuery] string? Search = null,
    [FromQuery] string? Sort = null)
    {
        try
        {
            var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort);

            var flagValues = await db.TypeMasters
                .Where(x => x.Entity.Equals(nameof(AssetLink), StringComparison.OrdinalIgnoreCase))
                .ToListAsync();

            var results = mapper.Map<IEnumerable<AssetLinkDto>>(await query.ToListAsync());

            foreach (var obj in results)
            {
                var matchingFlag = flagValues.FirstOrDefault(x => x.Value == obj.TypeFlag);
                obj.TypeValue = matchingFlag?.Title ?? "";
            }

            return Ok(results);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpGet("pages")]
    [Authorize]
    public async Task<ActionResult<PagedResponse<AssetLinkDto>>> GetPages(
        [FromQuery] int page = 0,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? Filters = null,
        [FromQuery] string? Search = null,
        [FromQuery] string? Sort = null)
    {
        try
        {
            var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort);

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((decimal)totalCount / pageSize);

            var results = mapper.Map<IEnumerable<AssetLinkDto>>(
                await query
                    .Skip(pageSize * page)
                    .Take(pageSize)
                    .ToListAsync());

            var flagValues = await db.TypeMasters
                .Where(x => x.Entity.Equals(nameof(AssetLink), StringComparison.OrdinalIgnoreCase))
                .ToListAsync();

            foreach (var obj in results)
            {
                var matchingFlag = flagValues.FirstOrDefault(x => x.Value == obj.TypeFlag);
                obj.TypeValue = matchingFlag?.Title ?? "";
            }

            return Ok(new PagedResponse<AssetLinkDto>(results, totalCount, totalPages));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpGet("{id:int}")]
    [Authorize]
    public async Task<ActionResult<AssetLinkDto>> GetById(int id)
    {
        try
        {
            var query = await service.GetById(id);

            if (query == null)
            {
                return NotFound($"{nameof(AssetLinkDto)} with ID {id} not found.");
            }

            var result = mapper.Map<AssetLinkDto>(query);
            return Ok(result);
        }
        
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    //[HttpPost]
    //[Authorize]
    //public async Task<ActionResult<AssetLinkDto>> Post([FromBody] AssetLinkDto dto)
    //{
    //    try
    //    {
    //        var createdId = await service.Create(mapper.Map<AssetLink>(dto));
    //        var result = mapper.Map<AssetLinkDto>(await service.GetById(createdId));

    //        if (result == null)
    //            return BadRequest("Not Created");

    //        return CreatedAtAction(nameof(GetById), new { id = createdId }, result);
    //    }
    //    catch (Exception ex)
    //    {
    //        return StatusCode(500, ex.Message);
    //    }
    //}
    [HttpPost]
    [Authorize]
    public async Task<ActionResult<AssetLinkDto>> Post([FromBody] AssetLinkDto dto)
    {
       
            var createdId = await service.Create(mapper.Map<AssetLink>(dto));

            // Get the created link
            var assetLink = await service.GetById(createdId);
            if (assetLink == null)
                return BadRequest("Not Created");

            var result = mapper.Map<AssetLinkDto>(assetLink);

            // Get PrimaryAsset (full object)
            //var primaryAsset = await db.Assets
            //    .AsNoTracking()
            //    .Where(a => a.ID == assetLink.PrimaryAssetID && !a.IsDeleted)
            //    .FirstOrDefaultAsync();

            //if (primaryAsset != null)
            //{
            //    var primaryAssetDto = mapper.Map<AssetDto>(primaryAsset);

            //    // Get attributes for primary asset
            //    var primaryAttributes = await db.AssetAttributes
            //        .AsNoTracking()
            //        .Where(x => x.AssetID == primaryAsset.ID && !x.IsDeleted)
            //        .ToListAsync();

            //    primaryAssetDto.Attributes = primaryAttributes.Select(x =>
            //    {
            //        var attrDto = mapper.Map<AssetAttributeDto>(x);
            //        attrDto.Asset = null;
            //        return attrDto;
            //    }).ToList();

            //    // Set empty arrays to prevent circular dependencies
            //    primaryAssetDto.PrimaryAssets = new List<AssetLinkDto>();
            //    primaryAssetDto.SecondaryAssets = new List<AssetLinkDto>();
            //    primaryAssetDto.Attachments = new List<AssetAttachmentDto>();
            //    primaryAssetDto.Vendors = new List<AssetVendorDto>();
            //    primaryAssetDto.Schedules = new List<AssetScheduleDto>();

            //    result.PrimaryAsset = primaryAssetDto;
            //}

            //// Get SecondaryAsset (full object)
            var secondaryAsset = await db.Assets
                .AsNoTracking()
                .Where(a => a.ID == assetLink.SecondaryAssetID && !a.IsDeleted)
                .FirstOrDefaultAsync();

            if (secondaryAsset != null)
            {
                var secondaryAssetDto = mapper.Map<AssetDto>(secondaryAsset);

                // Get attributes for secondary asset
                var secondaryAttributes = await db.AssetAttributes
                    .AsNoTracking()
                    .Where(x => x.AssetID == secondaryAsset.ID && !x.IsDeleted)
                    .ToListAsync();

                secondaryAssetDto.Attributes = secondaryAttributes.Select(x =>
                {
                    var attrDto = mapper.Map<AssetAttributeDto>(x);
                    attrDto.Asset = null;
                    return attrDto;
                }).ToList();

                // Set empty arrays to prevent circular dependencies
                secondaryAssetDto.PrimaryAssets = new List<AssetLinkDto>();
                secondaryAssetDto.SecondaryAssets = new List<AssetLinkDto>();
                secondaryAssetDto.Attachments = new List<AssetAttachmentDto>();
                secondaryAssetDto.Vendors = new List<AssetVendorDto>();
                secondaryAssetDto.Schedules = new List<AssetScheduleDto>();

                result.SecondaryAsset = secondaryAssetDto;
            }

            return CreatedAtAction(nameof(GetById), new { id = createdId }, result);
       
       
    }

    [HttpPut("{id:int}")]
    [Authorize]
    public async Task<ActionResult<AssetLinkDto>> Put(int id, [FromBody] AssetLinkDto dto)
    {
        try
        {
            await service.Update(mapper.Map<AssetLink>(dto));
            var result = mapper.Map<AssetLinkDto>(await service.GetById(id));

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
            var result = mapper.Map<AssetLinkDto>(await service.GetById(id));

            if (result == null)
                return NotFound("Asset link not found");

            await service.Delete(id);

            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }
}