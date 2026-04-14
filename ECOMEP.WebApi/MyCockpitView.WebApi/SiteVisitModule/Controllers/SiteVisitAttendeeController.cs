using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.ActivityModule;


using MyCockpitView.Utility.Common;

using MyCockpitView.WebApi.SiteVisitModule.Dtos;
using MyCockpitView.WebApi.SiteVisitModule.Entities;
using MyCockpitView.WebApi.SiteVisitModule.Services;
using MyCockpitView.WebApi.ContactModule.Services;
using MyCockpitView.WebApi.Responses;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.SiteVisitModule.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class SiteVisitAttendeeController : ControllerBase
    {

        ILogger<SiteVisitAttendeeController> logger;
        private readonly ISiteVisitAttendeeService service;
        private readonly IMapper mapper;
        private readonly IActivityService activityService;
        private readonly IContactService contactService;
        private readonly EntitiesContext db;
        private readonly ICurrentUserService _currentUserService;

        public SiteVisitAttendeeController(
            ILogger<SiteVisitAttendeeController> logger,
            EntitiesContext entitiesContext,
            ISiteVisitAttendeeService service,
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


            var results = mapper.Map<IEnumerable<SiteVisitAttendeeDto>>(await query.ToListAsync());


            return Ok(results);

        }


        // GET: api/Contacts/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByID(int id)
        {

            var obj = mapper.Map<SiteVisitAttendeeDto>(await service.GetById(id));
            if (obj == null) return NotFound();
            if (obj == null) throw new NotFoundException($"{nameof(SiteVisitAttendee)} not found!");


            return Ok(obj);

        }

        [HttpGet("uid/{id:guid}")]
        public async Task<IActionResult> GetByGUID(Guid id)
        {

            var obj = mapper.Map<SiteVisitAttendeeDto>(await service.GetById(id));
            if (obj == null) return NotFound();
            if (obj == null) throw new NotFoundException($"{nameof(SiteVisitAttendee)} not found!");


            return Ok(obj);

        }


        [Authorize]
        [HttpGet("Pages")]
        public async Task<IActionResult> GetPages(int page = 0, int pageSize = 10, string? Filters = null, string? Search = null, string? Sort = null)
        {

            var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort);
            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((decimal)totalCount / pageSize);

            var results = mapper.Map<IEnumerable<SiteVisitAttendeeDto>>(await query
                .Skip(pageSize * page)
                .Take(pageSize).ToListAsync());

            return Ok(new PagedResponse<SiteVisitAttendeeDto>(results, totalCount, totalPages));

        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] SiteVisitAttendeeDto Dto)
        {
            var SiteVisit = await db.SiteVisits.AsNoTracking().SingleOrDefaultAsync(x => x.ID == Dto.SiteVisitID);
            if (SiteVisit == null) throw new BadRequestException("SiteVisit not found");

            var results = mapper.Map<SiteVisitAttendeeDto>(await service.GetById(await service.Create(mapper.Map<SiteVisitAttendee>(Dto))));
            if (results == null) throw new BadRequestException($"{nameof(SiteVisitAttendee)} could not be created!");


            var username = _currentUserService.GetCurrentUsername();
            if (!string.IsNullOrEmpty(username))
            {
                var currentContact = await contactService.Get().FirstOrDefaultAsync(x => x.Username == username);
                if (currentContact != null)
                {
                    await activityService.LogUserActivity(currentContact, nameof(SiteVisit), SiteVisit.ID,
                                                                        SiteVisit.Code + "-" + SiteVisit.Title,
                                                                        $"{nameof(SiteVisitAttendee)} | {SiteVisit.Code}",
                                                                        "Created"
                                                                        );
                }
            }

            return Ok(results);

        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] SiteVisitAttendeeDto Dto)
        {
            var SiteVisit = await db.SiteVisits.AsNoTracking().SingleOrDefaultAsync(x => x.ID == Dto.SiteVisitID);
            if (SiteVisit == null) throw new BadRequestException("SiteVisit not found");

            await service.Update(mapper.Map<SiteVisitAttendee>(Dto));

            var results = mapper.Map<SiteVisitAttendeeDto>(await service.GetById(id));
            if (results == null) throw new NotFoundException($"{nameof(SiteVisitAttendee)} not found!");


            var username = _currentUserService.GetCurrentUsername();
            if (!string.IsNullOrEmpty(username))
            {
                var currentContact = await contactService.Get().FirstOrDefaultAsync(x => x.Username == username);
                if (currentContact != null)
                {
                    await activityService.LogUserActivity(currentContact, nameof(SiteVisit), SiteVisit.ID,
                                                                        SiteVisit.Code,
                                                                        $"{nameof(SiteVisitAttendee)} | {SiteVisit.Code}",
                                                                        "Updated"
                                                                        );
                }
            }

            return Ok(results);

        }


        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {


            var results = mapper.Map<SiteVisitAttendeeDto>(await service.GetById(id));
            if (results == null) throw new NotFoundException($"{nameof(SiteVisitAttendee)} not found!");

            var SiteVisit = await db.SiteVisits.AsNoTracking().SingleOrDefaultAsync(x => x.ID == results.SiteVisitID);
            if (SiteVisit == null) throw new BadRequestException("SiteVisit not found");

            await service.Delete(id);

            var username = _currentUserService.GetCurrentUsername();
            if (!string.IsNullOrEmpty(username))
            {
                var currentContact = await contactService.Get().FirstOrDefaultAsync(x => x.Username == username);
                if (currentContact != null)
                {
                    await activityService.LogUserActivity(currentContact, nameof(SiteVisit), SiteVisit.ID,
                                                                          SiteVisit.Code,
                                                                          $"{nameof(SiteVisitAttendee)} | {SiteVisit.Code}",
                                                                          "Deleted"
                                                                          );
                }
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