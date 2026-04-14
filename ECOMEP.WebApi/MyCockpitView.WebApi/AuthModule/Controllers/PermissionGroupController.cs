using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.ActivityModule;
using MyCockpitView.WebApi.AuthModule.Dtos;
using MyCockpitView.WebApi.AuthModule.Entities;
using MyCockpitView.WebApi.AuthModule.Services;
using MyCockpitView.WebApi.ContactModule.Dtos;
using MyCockpitView.WebApi.ContactModule.Entities;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.AuthModule.Controllers;

[Route("[controller]")]
[ApiController]
public class PermissionGroupController : ControllerBase
{
    ILogger<PermissionGroupController> logger;
    private readonly IPermissionGroupService service;
    private readonly IMapper mapper;
    private readonly IActivityService activityService;
    private readonly UserManager<User> userManager;
    private readonly EntitiesContext db;
    private readonly ICurrentUserService _currentUserService;

    public PermissionGroupController(
        ILogger<PermissionGroupController> logger,
        EntitiesContext entitiesContext,
        IPermissionGroupService permissionGroupService,
        IMapper mapper,
        IActivityService activityService,
        UserManager<User> userManager,
        ICurrentUserService currentUserService)

    {
        this.logger = logger;
        db = entitiesContext;
        this.service = permissionGroupService;
        this.mapper = mapper;
        this.activityService = activityService;
        this.userManager = userManager;
        _currentUserService = currentUserService;
    }

    //[Authorize]
    [HttpGet]
    public async Task<IActionResult> Get(string? Filters = null, string? Search = null, string? Sort = null)
    {

        var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort);

        var results = mapper.Map<IEnumerable<PermissionGroupDto>>(await query
            .ToListAsync());

        return Ok(results);

    }


    [HttpPost]
    //[Authorize]
    public async Task<IActionResult> Post([FromBody] PermissionGroupDto Dto)
    {

        var id = await service.Create(mapper.Map<PermissionGroup>(Dto));

        var results = mapper.Map<PermissionGroupDto>(await service.Get().SingleOrDefaultAsync(i => i.ID == id));

        if (results == null) throw new BadRequestException($"{nameof(PermissionGroup)} could not be created!");

        return Ok(results);

    }


    [HttpDelete("{id}")]
    //[Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var results = mapper.Map<PermissionGroupDto>(await service.Get().SingleOrDefaultAsync(i => i.ID == id));

        if (results == null) throw new NotFoundException($"{nameof(PermissionGroup)} not found!");

        await service.Delete(id);

      
        return Ok();

    }

    [HttpPut("{id}")]
    [Authorize]
    //[ResponseType(typeof(int))]
    public async Task<IActionResult> Put(int id, [FromBody] PermissionGroupDto Dto)
    {

        await service.Update(mapper.Map<PermissionGroup>(Dto));

        var results = mapper.Map<PermissionGroupDto>(await service.Get().SingleOrDefaultAsync(i => i.ID == id));

        if (results == null) throw new NotFoundException($"{nameof(PermissionGroup)} not found!");

       
        return Ok(results);
    }
}
