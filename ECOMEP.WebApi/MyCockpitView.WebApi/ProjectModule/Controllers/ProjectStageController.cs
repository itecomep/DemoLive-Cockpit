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
    public class ProjectStageController : ControllerBase
    {

        ILogger<ProjectStageController> logger;
        private readonly IProjectStageService service;
        private readonly IMapper mapper;
        private readonly IActivityService activityService;
        private readonly ICurrentUserService _currentUserService;
        private readonly IContactService contactService;
        private readonly EntitiesContext db;
        public ProjectStageController(
            ILogger<ProjectStageController> logger,
            EntitiesContext entitiesContext,
            IProjectStageService service,
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
                  

                var results = mapper.Map<IEnumerable<ProjectStageDto>>(await query.ToListAsync());

            var _statusMasters = await db.StatusMasters.AsNoTracking()
          .Where(x => x.Entity == nameof(ProjectStage))
          .ToListAsync();

            foreach (var obj in results)
            {
                obj.StatusValue = _statusMasters.Any(x => x.Value == obj.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == obj.StatusFlag).Title : "";

            }

            return Ok(results);
      
        }


        // GET: api/Contacts/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByID(int id)
        {

            var results = mapper.Map<ProjectStageDto>(await service.GetById(id));

            if (results == null) throw new NotFoundException($"{nameof(ProjectStage)} not found!");

            var _statusMasters = await db.StatusMasters.AsNoTracking()
          .Where(x => x.Entity == nameof(ProjectStage))
          .ToListAsync();

           
                results.StatusValue = _statusMasters.Any(x => x.Value == results.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == results.StatusFlag).Title : "";

            

            return Ok(results);

        }

        [HttpGet("uid/{id:guid}")]
        public async Task<IActionResult> GetByGUID(Guid id)
        {

            var results = mapper.Map<ProjectStageDto>(await service.GetById(id));

            if (results == null) throw new NotFoundException($"{nameof(ProjectStage)} not found!");

            var _statusMasters = await db.StatusMasters.AsNoTracking()
        .Where(x => x.Entity == nameof(ProjectStage))
        .ToListAsync();


            results.StatusValue = _statusMasters.Any(x => x.Value == results.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == results.StatusFlag).Title : "";

            return Ok(results);

        }


        [Authorize]
        [HttpGet("Pages")]
        public async Task<IActionResult> GetPages(int page = 0, int pageSize = 10, string? Filters = null, string? Search = null, string? Sort = null)
        {
           
                var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null,Search, Sort);
                var totalCount = await query.CountAsync();
                var totalPages = (int)Math.Ceiling((decimal)totalCount / pageSize);

                var results = mapper.Map<IEnumerable<ProjectStageDto>>(await query
                    .Skip(pageSize * page)
                    .Take(pageSize).ToListAsync());

            var _statusMasters = await db.StatusMasters.AsNoTracking()
       .Where(x => x.Entity == nameof(ProjectStage))
       .ToListAsync();

            foreach (var obj in results)
            {
                obj.StatusValue = _statusMasters.Any(x => x.Value == obj.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == obj.StatusFlag).Title : "";

            }

            return Ok(new PagedResponse<ProjectStageDto>(results, totalCount, totalPages));

        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] ProjectStageDto Dto)
        {
            var project = await db.Projects.AsNoTracking().SingleOrDefaultAsync(x => x.ID == Dto.ProjectID);
            if (project == null) throw new BadRequestException("Project not found");

            var Project = await db.Projects.AsNoTracking().SingleOrDefaultAsync(x => x.ID == Dto.ProjectID);
            if (Project == null) throw new BadRequestException("Project Area not found");

            var results = mapper.Map<ProjectStageDto>(await service.GetById(await service.Create(mapper.Map<ProjectStage>(Dto))));
                if (results == null) throw new BadRequestException($"{nameof(ProjectStage)} could not be created!");


            var username = _currentUserService.GetCurrentUsername();
            var currentContact = await contactService.Get()
                .FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
            {
                await activityService.LogUserActivity(currentContact, nameof(Project), project.ID,
                                                                        project.Code + "-" + project.Title,
                                                                        $"{nameof(ProjectStage)} | {Project.Title} | {results.Title}({results.Abbreviation})",
                                                                        "Created"
                                                                        );
            }

                return Ok(results);
            
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ProjectStageDto Dto)
        {
            var project = await db.Projects.AsNoTracking().SingleOrDefaultAsync(x => x.ID == Dto.ProjectID);
            if (project == null) throw new BadRequestException("Project not found");

            var Project = await db.Projects.AsNoTracking().SingleOrDefaultAsync(x => x.ID == Dto.ProjectID);
            if (Project == null) throw new BadRequestException("Project Area not found");

            //Stage History
            var _stage = await db.ProjectStages.AsNoTracking().SingleOrDefaultAsync(x => x.ID == Dto.ID);
            if (_stage == null) throw new EntityServiceException("Stage not found!");


            if (_stage.DueDate.HasValue && Dto.DueDate.HasValue &&
            _stage.DueDate.Value.Date != Dto.DueDate.Value.Date)
            {
                var newStageVersion = new ProjectStage();
                db.Entry(newStageVersion).CurrentValues.SetValues(_stage);
                newStageVersion.ID = default(int);
                newStageVersion.UID = default(Guid);
                newStageVersion.IsReadOnly = true;
                newStageVersion.ParentID = _stage.ID;

                db.ProjectStages.Add(newStageVersion);
                await db.SaveChangesAsync();
            }

            await service.Update(mapper.Map<ProjectStage>(Dto));

                var results = mapper.Map<ProjectStageDto>(await service.GetById(id));
                if (results == null) throw new NotFoundException($"{nameof(ProjectStage)} not found!");


            var username = _currentUserService.GetCurrentUsername();
            var currentContact = await contactService.Get()
                .FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
            {
                await activityService.LogUserActivity(currentContact, nameof(Project), project.ID,
                                                                    project.Code + "-" + project.Title,
                                                                       $"{nameof(ProjectStage)} | {Project.Title} | {results.Title}({results.Abbreviation})",
                                                                    "Updated"
                                                                    );
            }

                return Ok(results);
           
        }


        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
           

            var results = mapper.Map<ProjectStageDto>(await service.GetById(id));
            if (results == null) throw new NotFoundException($"{nameof(ProjectStage)} not found!");

            var project = await db.Projects.AsNoTracking().SingleOrDefaultAsync(x => x.ID == results.ProjectID);
            if (project == null) throw new BadRequestException("Project not found");

            var Project = await db.Projects.AsNoTracking().SingleOrDefaultAsync(x => x.ID == results.ProjectID);
            if (Project == null) throw new BadRequestException("Project Area not found");


            await service.Delete(id);

            var username = _currentUserService.GetCurrentUsername();
            var currentContact = await contactService.Get()
                .FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
            {
                await activityService.LogUserActivity(currentContact, nameof(Project), project.ID,
                                                                      project.Code + "-" + project.Title,
                                                                     $"{nameof(ProjectStage)} | {Project.Title} | {results.Title}({results.Abbreviation})",
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