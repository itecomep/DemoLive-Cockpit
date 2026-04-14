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
    public class ProjectAreaStageDeliveryController : ControllerBase
    {
        ILogger<ProjectAreaStageDeliveryController> logger;
        private readonly IProjectAreaStageDeliveryService service;
        private readonly IMapper mapper;
        private readonly IActivityService activityService;
        private readonly IContactService contactService;
        private readonly EntitiesContext db;

        public ProjectAreaStageDeliveryController(
            ILogger<ProjectAreaStageDeliveryController> logger,
            EntitiesContext entitiesContext,
            IProjectAreaStageDeliveryService service,
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


            var results = mapper.Map<IEnumerable<ProjectAreaStageDeliveryDto>>(await query.ToListAsync());


            return Ok(results);

        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByID(int id)
        {

            var results = mapper.Map<ProjectAreaStageDeliveryDto>(await service.GetById(id));

            if (results == null) throw new NotFoundException($"{nameof(ProjectAreaStageDelivery)} not found!");


            return Ok(results);

        }

        [HttpGet("uid/{id:guid}")]
        public async Task<IActionResult> GetByGUID(Guid id)
        {

            var results = mapper.Map<ProjectAreaStageDeliveryDto>(await service.GetById(id));

            if (results == null) throw new NotFoundException($"{nameof(ProjectAreaStageDelivery)} not found!");


            return Ok(results);

        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] ProjectAreaStageDeliveryDto Dto)
        {
            var results = mapper.Map<ProjectAreaStageDeliveryDto>(await service.GetById(await service.Create(mapper.Map<ProjectAreaStageDelivery>(Dto))));
            if (results == null) throw new BadRequestException($"{nameof(ProjectAreaStageDelivery)} could not be created!");

            return Ok(results);

        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ProjectAreaStageDeliveryDto Dto)
        {
            await service.Update(mapper.Map<ProjectAreaStageDelivery>(Dto));

            var results = mapper.Map<ProjectAreaStageDeliveryDto>(await service.GetById(id));
            if (results == null) throw new NotFoundException($"{nameof(ProjectAreaStageDelivery)} not found!");

            return Ok(results);

        }


        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {


            var results = mapper.Map<ProjectAreaStageDeliveryDto>(await service.GetById(id));
            if (results == null) throw new NotFoundException($"{nameof(ProjectAreaStageDelivery)} not found!");


            await service.Delete(id);

            return Ok();

        }
    }
}
