using AutoMapper;
using MyCockpitView.WebApi.WFTaskModule.Dtos;
using MyCockpitView.WebApi.WFTaskModule.Entities;
using MyCockpitView.WebApi.WFTaskModule.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.ActivityModule;


using MyCockpitView.Utility.Common;

using MyCockpitView.WebApi.ContactModule.Services;
using MyCockpitView.WebApi.Responses;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AssessmentController : ControllerBase
    {

        ILogger<AssessmentController> logger;
        private readonly IAssessmentService service;
        private readonly IMapper mapper;
        private readonly IActivityService activityService;
        private readonly ICurrentUserService _currentUserService;
        private readonly IContactService contactService;
        private readonly EntitiesContext db;
        public AssessmentController(
            ILogger<AssessmentController> logger,
            EntitiesContext entitiesContext,
            IAssessmentService service,
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

            var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort)
              .Include(x=>x.Contact);
                  

                var results = mapper.Map<IEnumerable<AssessmentDto>>(await query.ToListAsync());


                return Ok(results);
      
        }


        [Authorize]
        [HttpGet("Pages")]
        public async Task<IActionResult> GetPages(int page = 0, int pageSize = 10, string? Filters = null, string? Search = null, string? Sort = null)
        {

            var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort)
                  .Include(x => x.Contact);
            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((decimal)totalCount / pageSize);

            var results = mapper.Map<IEnumerable<AssessmentDto>>(await query
                .Skip(pageSize * page)
                .Take(pageSize).ToListAsync());

            return Ok(new PagedResponse<AssessmentDto>(results, totalCount, totalPages));

        }


        // GET: api/Contacts/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByID(int id)
        {

            var results = mapper.Map<AssessmentDto>(await service.GetById(id));

            if (results == null) throw new NotFoundException($"{nameof(Assessment)} not found!");


            return Ok(results);

        }

        [HttpGet("uid/{id:guid}")]
        public async Task<IActionResult> GetByGUID(Guid id)
        {

            var results = mapper.Map<AssessmentDto>(await service.GetById(id));

            if (results == null) throw new NotFoundException($"{nameof(Assessment)} not found!");


            return Ok(results);

        }


        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] AssessmentDto Dto)
        {
           
            var results = mapper.Map<AssessmentDto>(await service.GetById(await service.Create(mapper.Map<Assessment>(Dto))));
                if (results == null) throw new BadRequestException($"{nameof(Assessment)} could not be created!");

            var username = _currentUserService.GetCurrentUsername();
            var currentContact = await contactService.Get()
                .FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
                {
                    await activityService.LogUserActivity(currentContact, nameof(Assessment), results.ID,
                                                                            $"{results.Entity}-{results.TaskTitle}-{results.Category}-{results.ScoredPoints}",
                                                                            $"{nameof(Assessment)} | {results.Entity}-{results.TaskTitle}-{results.Category}-{results.ScoredPoints}",
                                                                            "Created"
                                                                            );
                }
            

                return Ok(results);
            
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] AssessmentDto Dto)
        {
          
            await service.Update(mapper.Map<Assessment>(Dto));

                var results = mapper.Map<AssessmentDto>(await service.GetById(id));
                if (results == null) throw new NotFoundException($"{nameof(Assessment)} not found!");

            var username = _currentUserService.GetCurrentUsername();
            var currentContact = await contactService.Get()
                .FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
                {
                    await activityService.LogUserActivity(currentContact, nameof(Assessment), results.ID,
                                                                             $"{results.Entity}-{results.TaskTitle}-{results.Category}-{results.ScoredPoints}",
                                                                            $"{nameof(Assessment)} | {results.Entity}-{results.TaskTitle}-{results.Category}-{results.ScoredPoints}",
                                                                        "Updated"
                                                                        );
                }
            

                return Ok(results);
           
        }


        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
           

            var results = mapper.Map<AssessmentDto>(await service.GetById(id));
            if (results == null) throw new NotFoundException($"{nameof(Assessment)} not found!");

            await service.Delete(id);
            var username = _currentUserService.GetCurrentUsername();
            var currentContact = await contactService.Get()
                .FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
                {
                    await activityService.LogUserActivity(currentContact, nameof(Assessment), results.ID,
                                                                             $"{results.Entity}-{results.TaskTitle}-{results.Category}-{results.ScoredPoints}",
                                                                            $"{nameof(Assessment)} | {results.Entity}-{results.TaskTitle}-{results.Category}-{results.ScoredPoints}",
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