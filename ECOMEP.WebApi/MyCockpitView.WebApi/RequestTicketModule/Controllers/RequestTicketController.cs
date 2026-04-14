using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.ActivityModule;


using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.RequestTicketModule.Dtos;
using MyCockpitView.WebApi.RequestTicketModule.Entities;
using MyCockpitView.WebApi.RequestTicketModule.Services;
using MyCockpitView.WebApi.WFTaskModule.Services;
using MyCockpitView.WebApi.StatusMasterModule;
using Microsoft.AspNetCore.Http;
using MyCockpitView.WebApi.ContactModule.Services;
using MyCockpitView.WebApi.Services;
using MyCockpitView.WebApi.Responses;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Exceptions;

namespace MyCockpitView.WebApi.RequestTicketModule.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class RequestTicketController : ControllerBase
    {

        ILogger<RequestTicketController> _logger;
        private readonly IRequestTicketService _service;
        private readonly IMapper _mapper;
        private readonly IActivityService _activityService;
        private readonly IStatusMasterService statusMasterService;
        private readonly ISharedService _sharedService;
        private readonly IWFTaskService wFTaskService;
        private readonly IContactService contactService;
        private readonly EntitiesContext _db;
        private readonly ICurrentUserService _currentUserService;

        public RequestTicketController(
            ILogger<RequestTicketController> logger,
            EntitiesContext entitiesContext,
            IRequestTicketService service,
            IMapper mapper,
            IActivityService activityService,
            IStatusMasterService statusMasterService,
            ISharedService sharedService,
            IWFTaskService wFTaskService,
            IContactService contactService,
            ICurrentUserService currentUserService
            )
        {
            this._logger = logger;
            _db = entitiesContext;
            this._service = service;
            this._mapper = mapper;
            this._activityService = activityService;
            this.statusMasterService = statusMasterService;
            this._sharedService = sharedService;
            this.wFTaskService = wFTaskService;
            this.contactService = contactService;
            _currentUserService = currentUserService;
        }

        [Authorize]
        [HttpGet]

        public async Task<IActionResult> Get(string? Filters = null, string? Search = null, string? Sort = null)
        {

            var query = _service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort)
                 .Include(x => x.Assignees)
            .Include(x => x.AssignerContact)
            .Include(x => x.Attachments);

            var results = _mapper.Map<IEnumerable<RequestTicketDto>>(await query.ToListAsync());
            var _statusMasters = await statusMasterService.Get()
                                .Where(x => x.Entity == nameof(RequestTicket))
                                .ToListAsync();

            foreach (var obj in results)
            {
                obj.StatusValue = _statusMasters.Any(x => x.Value == obj.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == obj.StatusFlag).Title : "";
            }

            return Ok(results);

        }

        [Authorize]
        [HttpGet("Pages")]
        public async Task<IActionResult> GetPages(int page = 0, int pageSize = 10, string? Filters = null, string? Search = null, string? Sort = null)
        {

            var query = _service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort)
                .Include(x => x.AssignerContact);

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((decimal)totalCount / pageSize);

            var results = _mapper.Map<IEnumerable<RequestTicketDto>>(await query
                .Skip(pageSize * page)
                .Take(pageSize).ToListAsync());

            var _statusMasters = await statusMasterService.Get()
                                .Where(x => x.Entity == nameof(RequestTicket))
                                .ToListAsync();

            foreach (var obj in results)
            {
                obj.StatusValue = _statusMasters.Any(x => x.Value == obj.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == obj.StatusFlag).Title : "";
            }

            return Ok(new PagedResponse<RequestTicketDto>(results, totalCount, totalPages));

        }


        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByID(int id)
        {

            var obj = _mapper.Map<RequestTicketDto>(await _service.GetById(id));
                if(obj==null) return NotFound();

            var _statusMasters = await statusMasterService.Get()
                    .Where(x => x.Entity == nameof(RequestTicket))
                    .ToListAsync();

                obj.StatusValue = _statusMasters.Any(x => x.Value == obj.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == obj.StatusFlag).Title : "";

            if (obj == null) throw new NotFoundException($"{nameof(RequestTicket)} not found!");


            return Ok(obj);

        }

        [HttpGet("uid/{id:guid}")]
        public async Task<IActionResult> GetByGUID(Guid id)
        {

            var obj = _mapper.Map<RequestTicketDto>(await _service.GetById(id));
            if (obj == null) return NotFound();

            var _statusMasters = await statusMasterService.Get()
                   .Where(x => x.Entity == nameof(RequestTicket))
                   .ToListAsync();

            obj.StatusValue = _statusMasters.Any(x => x.Value == obj.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == obj.StatusFlag).Title : "";

            if (obj == null) throw new NotFoundException($"{nameof(RequestTicket)} not found!");

            return Ok(obj);

        }


        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] RequestTicketDto Dto)
        {

            var obj = _mapper.Map<RequestTicketDto>(await _service.GetById(await _service.Create(_mapper.Map<RequestTicket>(Dto))));

            if (obj == null) throw new BadRequestException($"{nameof(RequestTicket)} could not be created!");

            var _statusMasters = await statusMasterService.Get()
                   .Where(x => x.Entity == nameof(RequestTicket))
                   .ToListAsync();


            obj.StatusValue = _statusMasters.Any(x => x.Value == obj.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == obj.StatusFlag).Title : "";
            var username = _currentUserService.GetCurrentUsername();
            var currentContact = await contactService.Get()
                .FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
            {
                await _activityService.LogUserActivity(currentContact, nameof(RequestTicket), obj.ID,
                                                                        obj.Code,
                                                                        $"{nameof(RequestTicket)} | {obj.Code}",
                                                                        "Created"
                                                                        );
            }

            if (obj.IsRepeatRequired)
            {
                await wFTaskService.StartFlow(nameof(RequestTicket), obj.TypeFlag, obj.ID, ProjectID: obj.ProjectID);
            }

            return Ok(obj);

        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] RequestTicketDto Dto)
        {

            await _service.Update(_mapper.Map<RequestTicket>(Dto));

            var obj = _mapper.Map<RequestTicketDto>(await _service.GetById(id));
            if (obj == null) throw new NotFoundException($"{nameof(RequestTicket)} not found!");

            var _statusMasters = await statusMasterService.Get()
                   .Where(x => x.Entity == nameof(RequestTicket))
                   .ToListAsync();


            obj.StatusValue = _statusMasters.Any(x => x.Value == obj.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == obj.StatusFlag).Title : "";
            var username = _currentUserService.GetCurrentUsername();
            var currentContact = await contactService.Get()
                .FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
            {
                await _activityService.LogUserActivity(currentContact, nameof(RequestTicket), obj.ID,
                                                                    obj.Code,
                                                                    $"{nameof(RequestTicket)} | {obj.Code}",
                                                                    "Updated"
                                                                    );
            }

             if (obj.StatusFlag != McvConstant.REQUEST_TICKET_STATUSFLAG_COMPLETED)
            {
                if (obj.IsRepeatRequired)
                    await wFTaskService.UpdateTaskDue(nameof(RequestTicket), obj.ID);
                else
                    await wFTaskService.PurgePendingTasks(nameof(RequestTicket), obj.ID);

            }

            return Ok(obj);
        }
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var result = _mapper.Map<RequestTicketDto>(await _service.GetById(id));
            if (result == null) throw new NotFoundException($"{nameof(RequestTicket)} not found!");
            await _service.Delete(id);

            var username = _currentUserService.GetCurrentUsername();
            var currentContact = await contactService.Get()
                .FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
            {
                await _activityService.LogUserActivity(currentContact, nameof(RequestTicket), result.ID,
                                                                result.Code,
                                                                $"{nameof(RequestTicket)} | {result.Code}",
                                                                "Deleted"
                                                                );
            }

            await wFTaskService.PurgePendingTasks(nameof(RequestTicket), id);

            return Ok();

        }
        [Authorize]
        [HttpGet("FieldOptions")]
        public async Task<IActionResult> GetFieldOptions(string field)
        {
            return Ok(await _service.GetFieldOptions(field));
        }

        [Authorize]
        [HttpGet("SearchTagOptions")]
        public async Task<IActionResult> GetSearchTagOptions()
        {
            var results = await _service.GetSearchTagOptions();
            return Ok(results);
        }

        [Authorize]
        [HttpPut("Send/{id}")]
        public async Task<IActionResult> Send(int id)
        {

            await _service.SendRequestTicket(id);

            var obj = _mapper.Map<RequestTicketDto>(await _service.GetById(id));

            var username = _currentUserService.GetCurrentUsername();
            var currentContact = await contactService.Get()
                .FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
            {
                await _activityService.LogUserActivity(currentContact, nameof(RequestTicket), obj.ID,
                                                                  obj.Code,
                                                                  $"{nameof(RequestTicket)} | {obj.Code}",
                                                                  "Sent"
                                                                  );
            }
            var _statusMasters = await statusMasterService.Get()
                  .Where(x => x.Entity == nameof(RequestTicket))
                  .ToListAsync();


            obj.StatusValue = _statusMasters.Any(x => x.Value == obj.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == obj.StatusFlag).Title : "";

            return Ok(obj);
        }

        [HttpGet("RequestTicketFollowUp")]
        public async Task<IActionResult> RequestTicketFollowUp()
        {

                //"0 0/35 * ? * * *"
                await _service.RequestTicketFollowUp();
                return Ok("REQUEST FOLLOW-UP COMPLETED!");

        }
    }
}