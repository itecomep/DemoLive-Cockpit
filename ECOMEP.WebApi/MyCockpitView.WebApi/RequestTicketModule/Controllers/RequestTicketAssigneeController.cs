using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.ActivityModule;


using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.Entities;
using MyCockpitView.WebApi.Responses;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.WebApi.RequestTicketModule.Dtos;
using MyCockpitView.WebApi.RequestTicketModule.Entities;
using MyCockpitView.WebApi.RequestTicketModule.Services;
using MyCockpitView.WebApi.ContactModule.Services;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.RequestTicketModule.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class RequestTicketAssigneeController : ControllerBase
    {

        ILogger<RequestTicketAssigneeController> logger;
        private readonly IRequestTicketAssigneeService service;
        private readonly IMapper mapper;
        private readonly IActivityService activityService;
        private readonly IContactService contactService;
        private readonly EntitiesContext db;
        private readonly ICurrentUserService _currentUserService;

        public RequestTicketAssigneeController(
            ILogger<RequestTicketAssigneeController> logger,
            EntitiesContext entitiesContext,
            IRequestTicketAssigneeService service,
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
              ;


            var results = mapper.Map<IEnumerable<RequestTicketAssigneeDto>>(await query.ToListAsync());


            return Ok(results);

        }


        // GET: api/Contacts/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByID(int id)
        {

            var obj = mapper.Map<RequestTicketAssigneeDto>(await service.GetById(id));
            if (obj == null) return NotFound();
            if (obj == null) throw new NotFoundException($"{nameof(RequestTicketAssignee)} not found!");


            return Ok(obj);

        }

        [HttpGet("uid/{id:guid}")]
        public async Task<IActionResult> GetByGUID(Guid id)
        {

            var obj = mapper.Map<RequestTicketAssigneeDto>(await service.GetById(id));
            if (obj == null) return NotFound();
            if (obj == null) throw new NotFoundException($"{nameof(RequestTicketAssignee)} not found!");


            return Ok(obj);

        }


        [Authorize]
        [HttpGet("Pages")]
        public async Task<IActionResult> GetPages(int page = 0, int pageSize = 10, string? Filters = null, string? Search = null, string? Sort = null)
        {

            var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort);
            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((decimal)totalCount / pageSize);

            var results = mapper.Map<IEnumerable<RequestTicketAssigneeDto>>(await query
                .Skip(pageSize * page)
                .Take(pageSize).ToListAsync());

            return Ok(new PagedResponse<RequestTicketAssigneeDto>(results, totalCount, totalPages));

        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] RequestTicketAssigneeDto Dto)
        {
            var RequestTicket = await db.RequestTickets.AsNoTracking().SingleOrDefaultAsync(x => x.ID == Dto.RequestTicketID);
            if (RequestTicket == null) throw new BadRequestException("RequestTicket not found");

            var results = mapper.Map<RequestTicketAssigneeDto>(await service.GetById(await service.Create(mapper.Map<RequestTicketAssignee>(Dto))));
            if (results == null) throw new BadRequestException($"{nameof(RequestTicketAssignee)} could not be created!");

            var username = _currentUserService.GetCurrentUsername();
            var currentContact = await contactService.Get()
                .FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
            {
                await activityService.LogUserActivity(currentContact, nameof(RequestTicket), RequestTicket.ID,
                                                                    RequestTicket.Code + "-" + RequestTicket.Title,
                                                                    $"{nameof(RequestTicketAssignee)} | {RequestTicket.Code}",
                                                                    "Created"
                                                                    );
            }

            return Ok(results);

        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] RequestTicketAssigneeDto Dto)
        {
            var RequestTicket = await db.RequestTickets.AsNoTracking().SingleOrDefaultAsync(x => x.ID == Dto.RequestTicketID);
            if (RequestTicket == null) throw new BadRequestException("RequestTicket not found");

            await service.Update(mapper.Map<RequestTicketAssignee>(Dto));

            var results = mapper.Map<RequestTicketAssigneeDto>(await service.GetById(id));
            if (results == null) throw new NotFoundException($"{nameof(RequestTicketAssignee)} not found!");
            var username = _currentUserService.GetCurrentUsername();
            var currentContact = await contactService.Get()
                .FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
            {
                await activityService.LogUserActivity(currentContact, nameof(RequestTicket), RequestTicket.ID,
                                                                RequestTicket.Code,
                                                                $"{nameof(RequestTicketAssignee)} | {RequestTicket.Code}",
                                                                "Updated"
                                                                );
            }

            return Ok(results);

        }


        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {


            var results = mapper.Map<RequestTicketAssigneeDto>(await service.GetById(id));
            if (results == null) throw new NotFoundException($"{nameof(RequestTicketAssignee)} not found!");

            var RequestTicket = await db.RequestTickets.AsNoTracking().SingleOrDefaultAsync(x => x.ID == results.RequestTicketID);
            if (RequestTicket == null) throw new BadRequestException("RequestTicket not found");

            await service.Delete(id);
            var username = _currentUserService.GetCurrentUsername();
            var currentContact = await contactService.Get()
                .FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
            {
                await activityService.LogUserActivity(currentContact, nameof(RequestTicket), RequestTicket.ID,
                                                              RequestTicket.Code,
                                                              $"{nameof(RequestTicketAssignee)} | {RequestTicket.Code}",
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