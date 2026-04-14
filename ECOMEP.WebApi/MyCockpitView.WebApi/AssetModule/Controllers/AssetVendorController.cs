using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.Utility.Common;
using MyCockpitView.Utility.RDLCClient;
using MyCockpitView.WebApi.AssetModule.Dtos;
using MyCockpitView.WebApi.AssetModule.Entities;
using MyCockpitView.WebApi.AssetModule.Services;
using MyCockpitView.WebApi.ContactModule.Dtos;
using MyCockpitView.WebApi.ContactModule.Services;
using MyCockpitView.WebApi.Responses;
using MyCockpitView.WebApi.Services;
using Newtonsoft.Json;
using System.Net.Http.Headers;

namespace MyCockpitView.WebApi.AssetModule.Controllers;

[Route("[controller]")]
[ApiController]
public class AssetVendorController : ControllerBase
{
    private readonly IBaseEntityService<AssetVendor> service;
    private readonly EntitiesContext db;
    private readonly IContactService contactService;
    private readonly IMapper mapper;
    private readonly ILogger<AssetVendorController> logger;

    public AssetVendorController(
         ILogger<AssetVendorController> logger,
         EntitiesContext entitiesContext,
         IBaseEntityService<AssetVendor> baseEntityService,
         IContactService contactService,
         IMapper mapper)
    {
        this.logger = logger;
        this.db = entitiesContext;
        this.service = baseEntityService;
        this.contactService = contactService;
        this.mapper = mapper;
    }


    // Remove Dispose method entirely - .NET 8 handles DbContext disposal automatically through DI

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> Get(string? Filters = null, string? Search = null, string? Sort = null)
    {
        try
        {
            var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort);
            var results = mapper.Map<IEnumerable<AssetVendorDto>>(await query.ToListAsync());
            return Ok(results);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred while fetching asset vendors");
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                Message = "An unexpected error occurred while fetching asset vendors.",
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
            var query = await service.GetById(id);
            if (query == null)
            {
                return NotFound(new { Message = $"Asset vendor with ID {id} not found." });
            }

            var result = mapper.Map<AssetVendorDto>(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred while fetching asset vendor by ID {Id}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                Message = "An unexpected error occurred while fetching the asset vendor.",
                Details = ex.Message
            });
        }
    }

    [HttpGet("uid/{id:guid}")]
    public async Task<IActionResult> GetByGUID(Guid id)
    {
        try
        {
            var entity = await service.GetById(id);
            if (entity == null)
            {
                return NotFound(new { Message = $"Asset vendor with UID {id} not found." });
            }

            var result = mapper.Map<AssetVendorDto>(entity);
            return Ok(result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred while fetching asset vendor by GUID {Id}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                Message = "An unexpected error occurred while fetching the asset vendor.",
                Details = ex.Message
            });
        }
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Post([FromBody] AssetVendorDto dto)
    {
        try
        {
            var entity = mapper.Map<AssetVendor>(dto);
            var id = await service.Create(entity);
            var created = await service.GetById(id);

            if (created == null)
            {
                return BadRequest("Asset vendor was not created.");
            }

            var result = mapper.Map<AssetVendorDto>(created);
            return Ok(result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred while creating asset vendor");
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                Message = "An unexpected error occurred while creating the asset vendor.",
                Details = ex.Message
            });
        }
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] AssetVendorDto dto)
    {
        try
        {
            var entity = mapper.Map<AssetVendor>(dto);
            await service.Update(entity);

            var result = mapper.Map<AssetVendorDto>(await service.GetById(id));
            if (result == null)
            {
                return BadRequest("Asset vendor was not modified.");
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred while updating asset vendor {Id}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                Message = "An unexpected error occurred while updating the asset vendor.",
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
                return NotFound(new { Message = $"Asset vendor with ID {id} not found." });
            }

            await service.Delete(id);
            logger.LogInformation("Asset vendor {Id} deleted successfully", id);
            return Ok(new { Message = "Asset vendor deleted successfully." });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred while deleting asset vendor {Id}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                Message = "An unexpected error occurred while deleting the asset vendor.",
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
                Message = "An unexpected error occurred while fetching field options.",
                Details = ex.Message
            });
        }
    }

}