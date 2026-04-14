using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.AuthModule.Dtos;
using MyCockpitView.WebApi.AuthModule.Entities;
using MyCockpitView.WebApi.AuthModule.Services;
using MyCockpitView.WebApi.ContactModule.Services;
using MyCockpitView.WebApi.Exceptions;

namespace MyCockpitView.WebApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UserPermissionGroupMapController : ControllerBase
    {

        ILogger<UserPermissionGroupMapController> logger;
        private readonly IUserPermissionGroupMapService service;
        private readonly IMapper mapper;
        private readonly IContactService contactService;
        private readonly IPermissionGroupService permissionGroupService;
        private readonly UserManager<User> _userManager;
        private readonly EntitiesContext db;
       

        public UserPermissionGroupMapController(
            ILogger<UserPermissionGroupMapController> logger,
            EntitiesContext entitiesContext,
            IUserPermissionGroupMapService service,
            IMapper mapper,
            IContactService contactService,
            IPermissionGroupService permissionGroupService,
            UserManager<User> userManager
            )
        {
            this.logger = logger;
            db = entitiesContext;
            this.service = service;
            this.mapper = mapper;
            this.contactService = contactService;
            this.permissionGroupService = permissionGroupService;
            _userManager = userManager;
        }


        //[Authorize]
        [HttpGet]
        public async Task<IActionResult> Get(string? Filters = null, string? Search = null, string? Sort = null)
        {

            var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort);

            var results = mapper.Map<IEnumerable<UserPermissionGroupMapDto>>(await query
                .ToListAsync());

            return Ok(results);

        }



        [HttpPost]
        public async Task<IActionResult> Post([FromBody] UserPermissionGroupMapDto dto)
        {
            // Create record and assign roles in service
            var result = await service.CreatePermissionGroupMap(dto);

            if (result == null)
                throw new BadRequestException($"{nameof(UserPermissionGroupMap)} could not be created!");

            return Ok(result);
        }





        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await service.DeleteUserPermissionGroupMap(id);
            return Ok();
        }

    }
}