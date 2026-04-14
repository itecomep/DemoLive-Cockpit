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
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.WebApi.Responses;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ProjectAreaStageController : ControllerBase
    {

        ILogger<ProjectAreaStageController> logger;
        private readonly IProjectAreaStageService service;
        private readonly IMapper mapper;
        private readonly IActivityService activityService;
        private readonly ICurrentUserService _currentUserService;
        private readonly IContactService contactService;
        private readonly EntitiesContext db;
        public ProjectAreaStageController(
            ILogger<ProjectAreaStageController> logger,
            EntitiesContext entitiesContext,
            IProjectAreaStageService service,
            IMapper mapper,
            IActivityService activityService,
            ICurrentUserService currentUserService,
            IContactService contactService)
        {
            this.logger = logger;
            db = entitiesContext;
            this.service = service;
            this.mapper = mapper;
            this.activityService = activityService;
            _currentUserService = currentUserService;
            this.contactService = contactService;
        }

        [Authorize]
        [HttpGet]
        
        public async Task<IActionResult> Get(string? Filters = null, string? Search = null, string? Sort = null)
        {

            var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort).Include(x => x.Deliveries)
              ;
                  

                var results = mapper.Map<IEnumerable<ProjectAreaStageDto>>(await query.ToListAsync());


                return Ok(results);
      
        }


        // GET: api/Contacts/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByID(int id)
        {

            var results = mapper.Map<ProjectAreaStageDto>(await service.GetById(id));

            if (results == null) throw new NotFoundException($"{nameof(ProjectAreaStage)} not found!");


            return Ok(results);

        }

        [HttpGet("uid/{id:guid}")]
        public async Task<IActionResult> GetByGUID(Guid id)
        {

            var results = mapper.Map<ProjectAreaStageDto>(await service.GetById(id));

            if (results == null) throw new NotFoundException($"{nameof(ProjectAreaStage)} not found!");


            return Ok(results);

        }


        [Authorize]
        [HttpGet("Pages")]
        public async Task<IActionResult> GetPages(int page = 0, int pageSize = 10, string? Filters = null, string? Search = null, string? Sort = null)
        {
           
                var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null,Search, Sort);
                var totalCount = await query.CountAsync();
                var totalPages = (int)Math.Ceiling((decimal)totalCount / pageSize);

                var results = mapper.Map<IEnumerable<ProjectAreaStageDto>>(await query
                    .Skip(pageSize * page)
                    .Take(pageSize).ToListAsync());

                return Ok(new PagedResponse<ProjectAreaStageDto>(results, totalCount, totalPages));

        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] ProjectAreaStageDto Dto)
        {
            var project = await db.Projects.AsNoTracking().SingleOrDefaultAsync(x => x.ID == Dto.ProjectID);
            if (project == null) throw new BadRequestException("Project not found");

            var projectArea = await db.ProjectAreas.AsNoTracking().SingleOrDefaultAsync(x => x.ID == Dto.ProjectAreaID);
            if (projectArea == null) throw new BadRequestException("Project Area not found");

            var results = mapper.Map<ProjectAreaStageDto>(await service.GetById(await service.Create(mapper.Map<ProjectAreaStage>(Dto))));
                if (results == null) throw new BadRequestException($"{nameof(ProjectAreaStage)} could not be created!");


            var username = _currentUserService.GetCurrentUsername();
            var currentContact = await contactService.Get()
                .FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
            {
                await activityService.LogUserActivity(currentContact, nameof(Project), project.ID,
                                                                        project.Code + "-" + project.Title,
                                                                        $"{nameof(ProjectAreaStage)} | {projectArea.Title} | {results.Title}({results.Abbreviation})",
                                                                        "Created"
                                                                        );
            }

                return Ok(results);
            
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ProjectAreaStageDto Dto)
        {
            var project = await db.Projects.AsNoTracking().SingleOrDefaultAsync(x => x.ID == Dto.ProjectID);
            if (project == null) throw new BadRequestException("Project not found");

            var projectArea = await db.ProjectAreas.AsNoTracking().SingleOrDefaultAsync(x => x.ID == Dto.ProjectAreaID);
            if (projectArea == null) throw new BadRequestException("Project Area not found");

            await service.Update(mapper.Map<ProjectAreaStage>(Dto));

                var results = mapper.Map<ProjectAreaStageDto>(await service.GetById(id));
                if (results == null) throw new NotFoundException($"{nameof(ProjectAreaStage)} not found!");


            var username = _currentUserService.GetCurrentUsername();
            var currentContact = await contactService.Get()
                .FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
            {
                await activityService.LogUserActivity(currentContact, nameof(Project), project.ID,
                                                                    project.Code + "-" + project.Title,
                                                                       $"{nameof(ProjectAreaStage)} | {projectArea.Title} | {results.Title}({results.Abbreviation})",
                                                                    "Updated"
                                                                    );
            }

                return Ok(results);
           
        }


        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
           

            var results = mapper.Map<ProjectAreaStageDto>(await service.GetById(id));
            if (results == null) throw new NotFoundException($"{nameof(ProjectAreaStage)} not found!");

            var project = await db.Projects.AsNoTracking().SingleOrDefaultAsync(x => x.ID == results.ProjectID);
            if (project == null) throw new BadRequestException("Project not found");

            var projectArea = await db.ProjectAreas.AsNoTracking().SingleOrDefaultAsync(x => x.ID == results.ProjectAreaID);
            if (projectArea == null) throw new BadRequestException("Project Area not found");


            await service.Delete(id);

            var username = _currentUserService.GetCurrentUsername();
            var currentContact = await contactService.Get()
                .FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
            {
                await activityService.LogUserActivity(currentContact, nameof(Project), project.ID,
                                                                      project.Code + "-" + project.Title,
                                                                     $"{nameof(ProjectAreaStage)} | {projectArea.Title} | {results.Title}({results.Abbreviation})",
                                                                      "Deleted"
                                                                      );
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