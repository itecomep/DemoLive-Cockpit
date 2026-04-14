using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.AssetModule.Dtos;
using MyCockpitView.WebApi.AssetModule.Entities;
using MyCockpitView.WebApi.AssetModule.Services;
using MyCockpitView.WebApi.ContactModule.Services;

namespace MyCockpitView.WebApi.AssetModule.Controllers;

[Route("[controller]")]
[ApiController]
public class AssetAttributeController : ControllerBase
{
    private readonly IAssetAttributeService service;
    private readonly EntitiesContext db;
    private readonly ContactService contactService;
    private readonly IMapper mapper;
    public AssetAttributeController
    (
               EntitiesContext entitiesContext,
                IAssetAttributeService assetAtttributeService,
                 IMapper mapper
     )
    {

        db = entitiesContext;
        this.service = assetAtttributeService;
        this.mapper = mapper;

    }
    [HttpPost]
    [Authorize]
    public async Task<ActionResult<AssetAttributeDto>> Post([FromBody] AssetAttributeDto dto)
    {
        try
        {
            var createdId = await service.Create(mapper.Map<AssetAttribute>(dto));
            var results = mapper.Map<AssetAttributeDto>(await service.GetById(createdId));

            if (results == null)
                return BadRequest($"{nameof(AssetAttribute)} could not be created!");

            return CreatedAtAction(nameof(Post), new { id = createdId }, results);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpPut("{id:int}")]
    [Authorize]
    public async Task<ActionResult<AssetAttributeDto>> Put(int id, [FromBody] AssetAttributeDto dto)
    {
        try
        {
            await service.Update(mapper.Map<AssetAttribute>(dto));
            var result = mapper.Map<AssetAttributeDto>(await service.GetById(id));

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

}
   
