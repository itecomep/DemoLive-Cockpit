using AutoMapper;
using MyCockpitView.WebApi.WFTaskModule.Entities;
using MyCockpitView.WebApi.WFTaskModule.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.ActivityModule;
using MyCockpitView.WebApi.Responses;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.Utility.Common;

using MyCockpitView.WebApi.ContactModule.Services;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AssessmentMasterController : ControllerBase
    {

        ILogger<AssessmentMasterController> logger;
        private readonly IAssessmentMasterService service;
        private readonly IMapper mapper;
        private readonly IActivityService activityService;
        private readonly ICurrentUserService _currentUserService;
        private readonly IContactService contactService;
        private readonly EntitiesContext db;
        public AssessmentMasterController(
            ILogger<AssessmentMasterController> logger,
            EntitiesContext entitiesContext,
            IAssessmentMasterService service,
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
              ;
                  

                var results = await query.ToListAsync();


                return Ok(results);
      
        }


        // GET: api/Contacts/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByID(int id)
        {

            var results = await service.GetById(id);

            if (results == null) throw new NotFoundException($"{nameof(AssessmentMaster)} not found!");


            return Ok(results);

        }

        [HttpGet("uid/{id:guid}")]
        public async Task<IActionResult> GetByGUID(Guid id)
        {

            var results = await service.GetById(id);

            if (results == null) throw new NotFoundException($"{nameof(AssessmentMaster)} not found!");


            return Ok(results);

        }


        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] AssessmentMaster Dto)
        {
           
            var results = await service.GetById(await service.Create(mapper.Map<AssessmentMaster>(Dto)));
                if (results == null) throw new BadRequestException($"{nameof(AssessmentMaster)} could not be created!");


            var username = _currentUserService.GetCurrentUsername();
            var currentContact = await contactService.Get()
                .FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
                {
                    await activityService.LogUserActivity(currentContact, nameof(AssessmentMaster), results.ID,
                                                                            $"{results.Category}",
                                                                            $"{nameof(AssessmentMaster)} | {results.Category}",
                                                                            "Created"
                                                                            );
                }
            

                return Ok(results);
            
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] AssessmentMaster Dto)
        {
          
            await service.Update(Dto);

                var results = await service.GetById(id);
                if (results == null) throw new NotFoundException($"{nameof(AssessmentMaster)} not found!");

            var username = _currentUserService.GetCurrentUsername();
            var currentContact = await contactService.Get()
                .FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
                {
                    await activityService.LogUserActivity(currentContact, nameof(AssessmentMaster), results.ID,
                                                                            $"{results.Category}",
                                                                            $"{nameof(AssessmentMaster)} | {results.Category}",
                                                                        "Updated"
                                                                        );
                }
            

                return Ok(results);
           
        }


        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
           

            var results = await service.GetById(id);
            if (results == null) throw new NotFoundException($"{nameof(AssessmentMaster)} not found!");

            await service.Delete(id);

            var username = _currentUserService.GetCurrentUsername();
            var currentContact = await contactService.Get()
                .FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
                {
                    await activityService.LogUserActivity(currentContact, nameof(AssessmentMaster), results.ID,
                                                                             $"{results.Category}",
                                                                            $"{nameof(AssessmentMaster)} | {results.Category}",
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