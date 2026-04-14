using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.ActivityModule;
using MyCockpitView.WebApi.ContactModule.Services;
using MyCockpitView.Utility.Common;

using MyCockpitView.WebApi.ProjectModule.Dtos;
using MyCockpitView.WebApi.ProjectModule.Services;
using MyCockpitView.WebApi.ProjectModule.Entities;
using MyCockpitView.WebApi.Responses;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Exceptions;


namespace MyCockpitView.WebApi.ProjectModule.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ProjectStageDeliveryController : ControllerBase
    {
        ILogger<ProjectStageDeliveryController> logger;
        private readonly IProjectStageDeliveryService service;
        private readonly IMapper mapper;
        private readonly IActivityService activityService;
        private readonly IContactService contactService;
        private readonly EntitiesContext db;

        public ProjectStageDeliveryController(
            ILogger<ProjectStageDeliveryController> logger,
            EntitiesContext entitiesContext,
            IProjectStageDeliveryService service,
            IMapper mapper,
            IActivityService activityService,
            IContactService contactService
            )
        {
            this.logger = logger;
            db = entitiesContext;
            this.service = service;
            this.mapper = mapper;
            this.activityService = activityService;
            this.contactService = contactService;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> Get(string? Filters = null, string? Search = null, string? Sort = null)
        {

            var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort)
              ;


            var results = mapper.Map<IEnumerable<ProjectStageDeliveryDto>>(await query.ToListAsync());


            return Ok(results);

        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByID(int id)
        {

            var results = mapper.Map<ProjectStageDeliveryDto>(await service.GetById(id));

            if (results == null) throw new NotFoundException($"{nameof(ProjectStageDelivery)} not found!");


            return Ok(results);

        }

        [HttpGet("uid/{id:guid}")]
        public async Task<IActionResult> GetByGUID(Guid id)
        {

            var results = mapper.Map<ProjectStageDeliveryDto>(await service.GetById(id));

            if (results == null) throw new NotFoundException($"{nameof(ProjectStageDelivery)} not found!");


            return Ok(results);

        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] ProjectStageDeliveryDto Dto)
        {
            var results = mapper.Map<ProjectStageDeliveryDto>(await service.GetById(await service.Create(mapper.Map<ProjectStageDelivery>(Dto))));
            if (results == null) throw new BadRequestException($"{nameof(ProjectStageDelivery)} could not be created!");

            return Ok(results);

        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ProjectStageDeliveryDto Dto)
        {
            await service.Update(mapper.Map<ProjectStageDelivery>(Dto));

            var results = mapper.Map<ProjectStageDeliveryDto>(await service.GetById(id));
            if (results == null) throw new NotFoundException($"{nameof(ProjectStageDelivery)} not found!");

            return Ok(results);

        }


        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {


            var results = mapper.Map<ProjectStageDeliveryDto>(await service.GetById(id));
            if (results == null) throw new NotFoundException($"{nameof(ProjectStageDelivery)} not found!");


            await service.Delete(id);

            return Ok();

        }
    }
}
