using AutoMapper;
using MyCockpitView.WebApi.ProjectModule.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.ActivityModule;


using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.Dtos;
using MyCockpitView.WebApi.Entities;

using MyCockpitView.WebApi.ContactModule.Services;
using MyCockpitView.WebApi.Responses;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ProjectAreaController : ControllerBase
    {

        ILogger<ProjectAreaController> logger;
        private readonly IProjectAreaService service;
        private readonly IMapper mapper;
        private readonly IActivityService activityService;
        private readonly IContactService contactService;
        private readonly IProjectService projectService;
        private readonly ICurrentUserService _currentUserService;
        private readonly EntitiesContext db;
        //private readonly IMediator _mediator;
        public ProjectAreaController(
            ILogger<ProjectAreaController> logger,
            EntitiesContext entitiesContext,
            IProjectAreaService service,
            IMapper mapper,
            //IMediator mediator,
            IActivityService activityService,
            IContactService contactService,
            IProjectService projectService,
            ICurrentUserService currentUserService
            )
        {
            this.logger = logger;
            db = entitiesContext;
            this.service = service;
            this.mapper = mapper;
            this.activityService = activityService;
            this.contactService = contactService;
            this.projectService = projectService;
            _currentUserService = currentUserService;
            //this._mediator = mediator;
        }

        [Authorize]
        [HttpGet]
        
        public async Task<IActionResult> Get(string? Filters = null, string? Search = null, string? Sort = null)
        {

            var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort)
                .Include(x => x.Stages).ThenInclude(x => x.Deliveries) //for parent
                .Include(x => x.Children).ThenInclude(x => x.Stages).ThenInclude(x => x.Deliveries); // children
              
                  

                var results = mapper.Map<IEnumerable<ProjectAreaDto>>(await query.ToListAsync());


                return Ok(results);
      
        }


        // GET: api/Contacts/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByID(int id)
        {

            var results = mapper.Map<ProjectAreaDto>(await service.Get()
                .Include(x => x.Children)
                .ThenInclude(x => x.Stages)
                .Include(i => i.Stages)
                .ThenInclude(x => x.Deliveries)
            .SingleOrDefaultAsync(x => x.ID == id));

            if (results == null) throw new NotFoundException($"{nameof(ProjectArea)} not found!");


            return Ok(results);

        }

        [HttpGet("uid/{id:guid}")]
        public async Task<IActionResult> GetByGUID(Guid id)
        {

            var results = mapper.Map<ProjectAreaDto>(await service.Get()
                .Include(x => x.Children)
                .ThenInclude(x => x.Stages)
                .Include(i => i.Stages)
                .ThenInclude(x => x.Deliveries)
            .SingleOrDefaultAsync(x => x.UID == id));

            if (results == null) throw new NotFoundException($"{nameof(ProjectArea)} not found!");


            return Ok(results);

        }


        [Authorize]
        [HttpGet("Pages")]
        public async Task<IActionResult> GetPages(int page = 0, int pageSize = 10, string? Filters = null, string? Search = null, string? Sort = null)
        {
           
                var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null,Search, Sort);
                var totalCount = await query.CountAsync();
                var totalPages = (int)Math.Ceiling((decimal)totalCount / pageSize);

                var results = mapper.Map<IEnumerable<ProjectAreaDto>>(await query
                    .Skip(pageSize * page)
                    .Take(pageSize).ToListAsync());

                return Ok(new PagedResponse<ProjectAreaDto>(results, totalCount, totalPages));

        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create(  [FromBody] ProjectAreaDto Dto)
        {
            var project = await projectService.Get().SingleOrDefaultAsync(x => x.ID == Dto.ProjectID);
            if (project == null) throw new BadRequestException("Project not found");

            var id = await service.Create(mapper.Map<ProjectArea>(Dto));
          
            var entity = await service.Get()
                .Include(x => x.Children)
                .ThenInclude(x => x.Stages)
                .Include(i => i.Stages)
                .ThenInclude(x => x.Deliveries)
            .SingleOrDefaultAsync(x => x.ID == id);

            if (entity == null) throw new BadRequestException($"{nameof(ProjectArea)} could not be created!");

                //await _mediator.Publish(new ProjectAreaCreated { ProjectArea = entity });
            

            var result = mapper.Map<ProjectAreaDto>(entity);
            var username = _currentUserService.GetCurrentUsername();
            var currentContact = await contactService.Get()
                .FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
            {
                await activityService.LogUserActivity(currentContact, nameof(Project), project.ID,project.Code + "-" + project.Title, $"{nameof(ProjectArea)} | {result.Title}","Created");
            }

           
            return Ok(result);
            

        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ProjectAreaDto Dto)
        {
            var project = await projectService.Get().SingleOrDefaultAsync(x => x.ID == Dto.ProjectID);
            if (project == null) throw new BadRequestException("Project not found");

            await service.Update(mapper.Map<ProjectArea>(Dto));

            var entity = await service.Get()
                .Include(x => x.Children)
                .ThenInclude(x => x.Stages)
                .Include(i => i.Stages)
                .ThenInclude(x => x.Deliveries)
            .SingleOrDefaultAsync(x => x.ID == id);
            if (entity == null) throw new NotFoundException($"{nameof(ProjectArea)} not found!");

                //await _mediator.Publish(new ProjectAreaUpdated { ProjectArea = entity });
            

            var results = mapper.Map<ProjectAreaDto>(entity);
            var username = _currentUserService.GetCurrentUsername();
            var currentContact = await contactService.Get()
                .FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
            {
                await activityService.LogUserActivity(currentContact, nameof(Project), project.ID,project.Code + "-" + project.Title, $"{nameof(ProjectArea)} | {results.Title}","Updated");
            }

           
            return Ok(results);

        }


        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {


            var entity = await service.Get()
            .SingleOrDefaultAsync(x => x.ID == id);
            if (entity == null) throw new NotFoundException($"{nameof(ProjectArea)} not found!");

           
            var project = await projectService.Get().SingleOrDefaultAsync(x => x.ID == entity.ProjectID);
            if (project == null) throw new BadRequestException("Project not found");

            await service.Delete(id);

            //await _mediator.Publish(new ProjectAreaDeleted { ProjectArea = entity });

            var username = _currentUserService.GetCurrentUsername();
            var currentContact = await contactService.Get()
                .FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
            {
                await activityService.LogUserActivity(currentContact, nameof(Project), project.ID,project.Code + "-" + project.Title,$"{nameof(ProjectArea)} | {entity.Title}","Deleted");
            }

           
              
            
            return Ok();

        }


        [Authorize]
        [HttpGet("SearchTagOptions")]
        public async Task<IActionResult> GetSearchTagOptions()
        {
            var results = await service.GetSearchTagOptions();
            return Ok(results);
        }


    }
}