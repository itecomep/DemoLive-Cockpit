
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.AssetModule.Services;
using MyCockpitView.WebApi.Exceptions;

namespace MyCockpitView.WebApi.AppSettingMasterModule;

[Route("[controller]")]
[ApiController]
public class AppSettingMasterController : ControllerBase
{
    ILogger<AppSettingMasterController> _logger;
    private readonly IAppSettingMasterService _service;
    private readonly IAssetService _assetService;
    private readonly IAssetAttributeMasterService _assetAttributeMasterService;
    // private readonly IMapper _mapper;
    private readonly EntitiesContext _entitiesContext;
    public AppSettingMasterController(
        ILogger<AppSettingMasterController> logger,
        EntitiesContext entitiesContext,
        IAppSettingMasterService AppSettingMasterService,
        IAssetService AssetService,
        IAssetAttributeMasterService AssetAttributeMasterService
        // IMapper mapper
        )
    {
        _logger = logger;
        _entitiesContext = entitiesContext;
        _service = AppSettingMasterService;
        _assetService = AssetService;
        _assetAttributeMasterService = AssetAttributeMasterService;
        // _mapper = mapper;
    }


    [Authorize]
    [HttpGet]
    public async Task<IActionResult> Get(string? Filters = null, string? Search = null, string? Sort = null)
    {

        var query = _service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort);

        var results = await query
            .ToListAsync();

        return Ok(results);

    }

    // GET: api/AppSettingMasters/5
    [Authorize]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetByID(int id)
    {

        var results = await _service.GetById(id);

        if (results == null) throw new NotFoundException($"{nameof(AppSettingMaster)} not found!");

        return Ok(results);

    }

    [HttpGet("uid/{id:guid}")]
    public async Task<IActionResult> GetByGUID(Guid id)
    {

        var results = await _service.GetById(id);

        if (results == null) throw new NotFoundException($"{nameof(AppSettingMaster)} not found!");

        return Ok(results);

    }


    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Post([FromBody] AppSettingMaster Dto)
    {

        var results = await _service.GetById(await _service.Create(Dto));

        if (results == null) throw new BadRequestException($"{nameof(AppSettingMaster)} could not be created!");

        return Ok(results);

    }


    [HttpPut("{id}")]
    [Authorize]
    //[ResponseType(typeof(int))]
    public async Task<IActionResult> Put(int id, [FromBody] AppSettingMaster Dto)
    {
        var _existing = await _service.GetById(id);
        if (_existing == null) throw new NotFoundException($"{nameof(AppSettingMaster)} not found!");

        if (_existing.PresetKey == "ASSET_CATEGORY_OPTIONS")
        {
            // Parse old and new category options
            var oldCategories = _existing.PresetValue?.Split(',').Select(x => x.Trim()).ToList();
            var newCategories = Dto.PresetValue?.Split(',').Select(x => x.Trim()).ToList();

            // Find categories that were renamed or removed
            if (oldCategories != null && newCategories != null)
            {
                for (int i = 0; i < Math.Min(oldCategories.Count, newCategories.Count); i++)
                {
                    if (oldCategories[i] != newCategories[i])
                    {
                        // Update assets with old category to new category
                        await _assetService.UpdateAssetCategory(oldCategories[i], newCategories[i]);

                        // Update asset attribute masters
                        var attributeMasters = await _assetAttributeMasterService.Get()
                            .Where(x => x.Category == oldCategories[i])
                            .ToListAsync();

                        foreach (var master in attributeMasters)
                        {
                            master.Category = newCategories[i];
                            await _assetAttributeMasterService.Update(master);
                        }
                    }
                }
            }
        }

        await _service.Update(Dto);
        var results = await _service.GetById(id);
        if (results == null) throw new NotFoundException($"{nameof(AppSettingMaster)} not found!");
        return Ok(results);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.Delete(id);
        return Ok();

    }
}
