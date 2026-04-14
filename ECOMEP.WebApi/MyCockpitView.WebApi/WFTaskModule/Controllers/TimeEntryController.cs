using AutoMapper;
using MyCockpitView.WebApi.WFTaskModule.Dtos;
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
    public class TimeEntryController : ControllerBase
    {

        ILogger<TimeEntryController> logger;
        private readonly ITimeEntryService service;
        private readonly IMapper mapper;
        private readonly IActivityService activityService;
        private readonly IContactService contactService;
        private readonly EntitiesContext db;
        private readonly ICurrentUserService _currentUserService;

        public TimeEntryController(
            ILogger<TimeEntryController> logger,
            EntitiesContext entitiesContext,
            ITimeEntryService service,
            IMapper mapper,
            IActivityService activityService,
            IContactService contactService,
            ICurrentUserService currentUserService)
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
              .Include(x=>x.Contact);


                var results = mapper.Map<IEnumerable<TimeEntryDto>>(await query.ToListAsync());


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

            var results = mapper.Map<IEnumerable<TimeEntryDto>>(await query
                .Skip(pageSize * page)
                .Take(pageSize).ToListAsync());

            return Ok(new PagedResponse<TimeEntryDto>(results, totalCount, totalPages));

        }


        // GET: api/Contacts/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByID(int id)
        {

            var results = mapper.Map<TimeEntryDto>(await service.GetById(id));

            if (results == null) throw new NotFoundException($"{nameof(TimeEntry)} not found!");


            return Ok(results);

        }

        [HttpGet("uid/{id:guid}")]
        public async Task<IActionResult> GetByGUID(Guid id)
        {

            var results = mapper.Map<TimeEntryDto>(await service.GetById(id));

            if (results == null) throw new NotFoundException($"{nameof(TimeEntry)} not found!");


            return Ok(results);

        }


        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] TimeEntryDto Dto)
        {

            var results = mapper.Map<TimeEntryDto>(await service.GetById(await service.Create(mapper.Map<TimeEntry>(Dto))));
                if (results == null) throw new BadRequestException($"{nameof(TimeEntry)} could not be created!");

            var username = _currentUserService.GetCurrentUsername();
            var currentContact = await contactService.Get()
                .FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
            {
                await activityService.LogUserActivity(currentContact, results.Entity, results.EntityID.Value,
                                                                        $"{results.Entity}-{results.TaskTitle}-{ClockTools.GetIST(results.StartDate).ToString("dd MMM yyyy")}-{results.ManHours}mHr",
                                                                        $"{nameof(TimeEntry)} | {results.Entity}-{results.TaskTitle} | {ClockTools.GetIST(results.StartDate).ToString("dd MMM yyyy hh:mm tt")}-{ClockTools.GetIST(results.EndDate.Value).ToString("dd MMM yyyy hh:mm tt")} | {results.ManHours}mHr",
                                                                        "Created"
                                                                        );
            }

                return Ok(results);

        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] TimeEntryDto Dto)
        {

            await service.Update(mapper.Map<TimeEntry>(Dto));

                var results = mapper.Map<TimeEntryDto>(await service.GetById(id));
                if (results == null) throw new NotFoundException($"{nameof(TimeEntry)} not found!");

            var username = _currentUserService.GetCurrentUsername();
            var currentContact = await contactService.Get()
                .FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
            {
                await activityService.LogUserActivity(currentContact, nameof(TimeEntry), results.ID,
                                                                         $"{results.Entity}-{results.TaskTitle}-{ClockTools.GetIST(results.StartDate).ToString("dd MMM yyyy")}-{results.ManHours}mHr",
                                                                        $"{nameof(TimeEntry)} | {results.Entity}-{results.TaskTitle}-{ClockTools.GetIST(results.StartDate).ToString("dd MMM yyyy")}-{results.ManHours}mHr",
                                                                    "Updated"
                                                                    );
            }

                return Ok(results);

        }


        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {


            var results = mapper.Map<TimeEntryDto>(await service.GetById(id));
            if (results == null) throw new NotFoundException($"{nameof(TimeEntry)} not found!");
            await service.Delete(id);

            var username = _currentUserService.GetCurrentUsername();
            var currentContact = await contactService.Get()
                .FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
            {
                await activityService.LogUserActivity(currentContact, results.Entity, results.EntityID.Value,
                                                                        $"{results.Entity}-{results.TaskTitle}-{ClockTools.GetIST(results.StartDate).ToString("dd MMM yyyy")}-{results.ManHours}mHr",
                                                                        $"{nameof(TimeEntry)} | {results.Entity}-{results.TaskTitle}-{ClockTools.GetIST(results.StartDate).ToString("dd MMM yyyy")}-{results.ManHours}mHr",
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