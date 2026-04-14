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
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.WebApi.Responses;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ProjectAssociationController : ControllerBase
    {

        ILogger<ProjectAssociationController> logger;
        private readonly IProjectAssociationService service;
        private readonly IMapper mapper;
        private readonly IActivityService activityService;
        private readonly IContactService contactService;
        private readonly ICurrentUserService _currentUserService;
        private readonly EntitiesContext db;
        public ProjectAssociationController(
            ILogger<ProjectAssociationController> logger,
            EntitiesContext entitiesContext,
            IProjectAssociationService service,
            IMapper mapper,
            IActivityService activityService,
            IContactService contactService,
            ICurrentUserService currentUserService
            )
        {
            this.logger = logger;
            db = entitiesContext;
            this.service = service;
            this.mapper = mapper;
            this.activityService = activityService;
            this.contactService = contactService;
            _currentUserService = currentUserService;
        }

        [Authorize]
        [HttpGet]
        
        public async Task<IActionResult> Get(string? Filters = null, string? Search = null, string? Sort = null)
        {

            var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort)
              ;
                  

                var results = mapper.Map<IEnumerable<ProjectAssociationDto>>(await query.ToListAsync());

                var _statusMasters = await db.StatusMasters.AsNoTracking()
                   .Where(x => x.Entity == nameof(ProjectAssociation))
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

            var results = mapper.Map<ProjectAssociationDto>(await service.GetById(id));

            if (results == null) throw new NotFoundException($"{nameof(ProjectAssociation)} not found!");

            var _statusMasters = await db.StatusMasters.AsNoTracking()
                .Where(x => x.Entity == nameof(ProjectAssociation))
                .ToListAsync();
            results.StatusValue = _statusMasters.Any(x => x.Value == results.TypeFlag) ? _statusMasters.FirstOrDefault(x => x.Value == results.TypeFlag).Title : "";

            return Ok(results);

        }

        [HttpGet("uid/{id:guid}")]
        public async Task<IActionResult> GetByGUID(Guid id)
        {

            var results = mapper.Map<ProjectAssociationDto>(await service.GetById(id));

            if (results == null) throw new NotFoundException($"{nameof(ProjectAssociation)} not found!");

            var _statusMasters = await db.StatusMasters.AsNoTracking()
                          .Where(x => x.Entity == nameof(ProjectAssociation))
                          .ToListAsync();
            results.StatusValue = _statusMasters.Any(x => x.Value == results.TypeFlag) ? _statusMasters.FirstOrDefault(x => x.Value == results.TypeFlag).Title : "";

            return Ok(results);

        }


        [Authorize]
        [HttpGet("Pages")]
        public async Task<IActionResult> GetPages(int page = 0, int pageSize = 10, string? Filters = null, string? Search = null, string? Sort = null)
        {
           
                var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null,Search, Sort);
                var totalCount = await query.CountAsync();
                var totalPages = (int)Math.Ceiling((decimal)totalCount / pageSize);

                var results = mapper.Map<IEnumerable<ProjectAssociationDto>>(await query
                    .Skip(pageSize * page)
                    .Take(pageSize).ToListAsync());

                var _statusMasters = await db.StatusMasters.AsNoTracking()
                    .Where(x => x.Entity == nameof(ProjectAssociation))
                    .ToListAsync();
                foreach (var obj in results)
                {
                    obj.StatusValue = _statusMasters.Any(x => x.Value == obj.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == obj.StatusFlag).Title : "";

                 
                }
                

                return Ok(new PagedResponse<ProjectAssociationDto>(results, totalCount, totalPages));

        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] ProjectAssociationDto Dto)
        {
            var project = await db.Projects.AsNoTracking().SingleOrDefaultAsync(x => x.ID == Dto.ProjectID);
            if (project == null) throw new BadRequestException("Project not found");

            
            var results = mapper.Map<ProjectAssociationDto>(await service.GetById(await service.Create(mapper.Map<ProjectAssociation>(Dto))));
                if (results == null) throw new BadRequestException($"{nameof(ProjectAssociation)} could not be created!");

            var username = _currentUserService.GetCurrentUsername();
            var currentContact = await contactService.Get()
                .FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
                {
                    await activityService.LogUserActivity(currentContact, nameof(Project), project.ID,
                                                                            project.Code + "-" + project.Title,
                                                                            $"{nameof(ProjectAssociation)} | {project.Code}-{project.Title}",
                                                                            "Created"
                                                                            );
                }
            

            var _statusMasters = await db.StatusMasters.AsNoTracking()
                   .Where(x => x.Entity == nameof(ProjectAssociation))
                   .ToListAsync();
                results.StatusValue = _statusMasters.Any(x => x.Value == results.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == results.StatusFlag).Title : "";


                return Ok(results);
            
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ProjectAssociationDto Dto)
        {
            var project = await db.Projects.AsNoTracking().SingleOrDefaultAsync(x => x.ID == Dto.ProjectID);
            if (project == null) throw new BadRequestException("Project not found");

            await service.Update(mapper.Map<ProjectAssociation>(Dto));

                var results = mapper.Map<ProjectAssociationDto>(await service.GetById(id));
                if (results == null) throw new NotFoundException($"{nameof(ProjectAssociation)} not found!");

            var username = _currentUserService.GetCurrentUsername();
            var currentContact = await contactService.Get()
                .FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
                {
                    await activityService.LogUserActivity(currentContact, nameof(Project), project.ID,
                                                                        project.Code + "-" + project.Title,
                                                                        $"{nameof(ProjectAssociation)} | {project.Code}-{project.Title}",
                                                                        "Updated"
                                                                        );
                }
            

            var _statusMasters = await db.StatusMasters.AsNoTracking()
                     .Where(x => x.Entity == nameof(ProjectAssociation))
                     .ToListAsync();
                results.StatusValue = _statusMasters.Any(x => x.Value == results.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == results.StatusFlag).Title : "";

                return Ok(results);
           
        }


        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
           

            var results = mapper.Map<ProjectAssociationDto>(await service.GetById(id));
            if (results == null) throw new NotFoundException($"{nameof(ProjectAssociation)} not found!");

            var project = await db.Projects.AsNoTracking().SingleOrDefaultAsync(x => x.ID == results.ProjectID);
            if (project == null) throw new BadRequestException("Project not found");

            await service.Delete(id);

            var username = _currentUserService.GetCurrentUsername();
            var currentContact = await contactService.Get()
                .FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
                {
                    await activityService.LogUserActivity(currentContact, nameof(Project), project.ID,
                                                                          project.Code + "-" + project.Title,
                                                                          $"{nameof(ProjectAssociation)} | {project.Code}-{project.Title}",
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