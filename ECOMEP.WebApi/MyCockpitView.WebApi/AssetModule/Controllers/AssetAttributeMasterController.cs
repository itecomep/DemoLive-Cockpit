using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using MyCockpitView.CoreModule;
using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.AssetModule.Entities;
using MyCockpitView.WebApi.AssetModule.Services;
using MyCockpitView.WebApi.ContactModule.Services;

namespace MyCockpitView.WebApi.AssetModule.Controllers;

[Route("[controller]")]
[ApiController]
public class AssetAttributeMasterController : ControllerBase
{
    private readonly IAssetAttributeMasterService service;
    private readonly EntitiesContext db;
    private readonly ContactService contactService;
    private readonly IAssetService assetService;
    private readonly ILogger<AssetAttributeMasterController> logger;
    public AssetAttributeMasterController(
               EntitiesContext entitiesContext,
                ILogger<AssetAttributeMasterController> logger,
                IAssetAttributeMasterService assetAtttributeMasterService,
                IAssetService assetService
           
        )
    {

        db = entitiesContext;
        this.service = assetAtttributeMasterService;
        this.assetService = assetService;
        this.logger = logger;

    }

    //[Authorize]
    [HttpGet]

    public async Task<IActionResult> Get(string Filters = null, string Search = null, string Sort = null)
    {

        var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort);
        var results = await query.ToListAsync();

        return Ok(results);

    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Post([FromBody] AssetAttributeMaster dto)
    {
        try
        {
            var id = await service.Create(dto);
            var model = await service.GetById(id);

            if (model == null)
            {
                return BadRequest("Failed to create asset attribute master.");
            }

            await assetService.CreateByMaster(
                model.Category,
                dto.Attribute,
                dto.InputType,
                dto.InputOptions,
                dto.IsRequired);

            return Ok(model);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred while creating asset attribute master");
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                Message = "An unexpected error occurred while creating the asset attribute master.",
                Details = ex.Message
            });
        }
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] AssetAttributeMaster dto)
    {
        try
        {
            var existing = await service.GetById(id);
            if (existing == null)
            {
                return NotFound(new { Message = $"Asset attribute master with ID {id} not found." });
            }

            await service.Update(dto);

            await assetService.UpdateByMaster(
                existing.Category,
                existing.Attribute,
                dto.Attribute,
                dto.InputType,
                dto.InputOptions,
                dto.IsRequired);

            var result = await service.GetById(id);
            if (result == null)
            {
                return BadRequest("Not modified.");
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred while updating asset attribute master {Id}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                Message = "An unexpected error occurred while updating the asset attribute master.",
                Details = ex.Message
            });
        }
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var existing = await service.GetById(id);
            if (existing == null)
            {
                return NotFound(new { Message = $"Asset attribute master with ID {id} not found." });
            }

            await service.Delete(id);
            await assetService.DeleteByMaster(existing.Category, existing.Attribute);

            logger.LogInformation("Asset attribute master {Id} deleted successfully", id);
            return Ok(new { Message = "Asset attribute master deleted successfully." });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred while deleting asset attribute master {Id}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                Message = "An unexpected error occurred while deleting the asset attribute master.",
                Details = ex.Message
            });
        }
    }
}
   
