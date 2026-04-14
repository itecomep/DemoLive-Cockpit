using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.ActivityModule;


using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.MeetingModule.Dtos;
using MyCockpitView.WebApi.MeetingModule.Entities;
using MyCockpitView.WebApi.MeetingModule.Services;
using MyCockpitView.WebApi.WFTaskModule.Services;
using MyCockpitView.WebApi.TodoModule.Services;
using MyCockpitView.WebApi.ContactModule.Services;
using MyCockpitView.WebApi.Responses;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.MeetingModule.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class MeetingAgendaController : ControllerBase
    {

        ILogger<MeetingAgendaController> logger;
        private readonly IMeetingAgendaService service;
        private readonly IMapper mapper;
        private readonly IActivityService activityService;
        private readonly ITodoService todoService;
        private readonly IWFTaskService wFTaskService;
        private readonly IContactService contactService;
        private readonly EntitiesContext db;
        private readonly ICurrentUserService _currentUserService;

        public MeetingAgendaController(
            ILogger<MeetingAgendaController> logger,
            EntitiesContext entitiesContext,
            IMeetingAgendaService service,
            IMapper mapper,
            IActivityService activityService,
            ITodoService todoService,
            IWFTaskService wFTaskService,
            IContactService contactService,
            ICurrentUserService currentUserService
            )
        {
            this.logger = logger;
            db = entitiesContext;
            this.service = service;
            this.mapper = mapper;
            this.activityService = activityService;
            this.todoService = todoService;
            this.wFTaskService = wFTaskService;
            this.contactService = contactService;
            _currentUserService = currentUserService;
        }

        [Authorize]
        [HttpGet]

        public async Task<IActionResult> Get(string? Filters = null, string? Search = null, string? Sort = null)
        {

            var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort)
                .Include(x=>x.Attachments)
              ;


            var results = mapper.Map<IEnumerable<MeetingAgendaDto>>(await query.ToListAsync());


            return Ok(results);

        }


        // GET: api/Contacts/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByID(int id)
        {

            var obj = mapper.Map<MeetingAgendaDto>(await service.GetById(id));
            if (obj == null) return NotFound();
            if (obj == null) throw new NotFoundException($"{nameof(MeetingAgenda)} not found!");


            return Ok(obj);

        }

        [HttpGet("uid/{id:guid}")]
        public async Task<IActionResult> GetByGUID(Guid id)
        {

            var obj = mapper.Map<MeetingAgendaDto>(await service.GetById(id));
            if (obj == null) return NotFound();
            if (obj == null) throw new NotFoundException($"{nameof(MeetingAgenda)} not found!");


            return Ok(obj);

        }


        [Authorize]
        [HttpGet("Pages")]
        public async Task<IActionResult> GetPages(int page = 0, int pageSize = 10, string? Filters = null, string? Search = null, string? Sort = null)
        {

            var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort)
                    .Include(x => x.Attachments);
            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((decimal)totalCount / pageSize);

            var results = mapper.Map<IEnumerable<MeetingAgendaDto>>(await query
                .Skip(pageSize * page)
                .Take(pageSize).ToListAsync());

            return Ok(new PagedResponse<MeetingAgendaDto>(results, totalCount, totalPages));

        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] MeetingAgendaDto Dto)
        {
            var meeting = await db.Meetings.AsNoTracking().SingleOrDefaultAsync(x => x.ID == Dto.MeetingID);
            if (meeting == null) throw new BadRequestException("Meeting not found");

            var results = mapper.Map<MeetingAgendaDto>(await service.GetById(await service.Create(mapper.Map<MeetingAgenda>(Dto))));
            if (results == null) throw new BadRequestException($"{nameof(MeetingAgenda)} could not be created!");


            var username = _currentUserService.GetCurrentUsername();
            if (!string.IsNullOrEmpty(username))
            {
                var currentContact = await contactService.Get().FirstOrDefaultAsync(x => x.Username == username);
                if (currentContact != null)
                {
                    await activityService.LogUserActivity(currentContact, nameof(Meeting), meeting.ID,
                                                                        meeting.Code,
                                                                        $"{nameof(MeetingAgenda)} | {meeting.Code}",
                                                                        "Created"
                                                                        );
                }
            }

            return Ok(results);

        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] MeetingAgendaDto Dto)
        {
            var meeting = await db.Meetings.AsNoTracking().SingleOrDefaultAsync(x => x.ID == Dto.MeetingID);
            if (meeting == null) throw new BadRequestException("Meeting not found");

            await service.Update(mapper.Map<MeetingAgenda>(Dto));

            var results = mapper.Map<MeetingAgendaDto>(await service.GetById(id));
            if (results == null) throw new NotFoundException($"{nameof(MeetingAgenda)} not found!");


            var username = _currentUserService.GetCurrentUsername();
            if (!string.IsNullOrEmpty(username))
            {
                var currentContact = await contactService.Get().FirstOrDefaultAsync(x => x.Username == username);
                if (currentContact != null)
                {
                    await activityService.LogUserActivity(currentContact, nameof(Meeting), meeting.ID,
                                                                        meeting.Code,
                                                                        $"{nameof(MeetingAgenda)} | {meeting.Code}",
                                                                        "Updated"
                                                                        );
                }
            }


            if (results.TodoID != null && results.StatusFlag == McvConstant.MEETING_AGENDA_STATUSFLAG_PENDING && results.DueDate != null)
            {
                var _todo = await todoService.Get().SingleOrDefaultAsync(x => x.ID == results.TodoID);
                if (_todo != null && _todo.StatusFlag == 0 && results.DueDate != null)
                {
                    _todo.DueDate = results.DueDate.Value;
                    await todoService.Update(_todo);

                }

                //Check if agenda task is pending
                var _currentAgendaTasks = await wFTaskService.Get().Where(x => x.Entity == nameof(MeetingAgenda)
         && x.EntityID == results.ID
         && x.StatusFlag != McvConstant.WFTASK_STATUSFLAG_COMPLETED)
                    .ToListAsync();

                if (_currentAgendaTasks.Any())
                {
                    foreach (var task in _currentAgendaTasks)
                    {
                        task.StatusFlag = McvConstant.WFTASK_STATUSFLAG_COMPLETED;
                        task.Comment = $"TODO CREATED | {_todo.Title}-{_todo.SubTitle}";
                        task.CompletedDate = DateTime.UtcNow;
                        await wFTaskService.Update(task);
                    }
                }
            }
            else if (results.StatusFlag == McvConstant.MEETING_AGENDA_STATUSFLAG_RESOLVED)
            {

                //Check if agenda task is pending
                var _currentAgendaTasks = await wFTaskService.Get().Where(x => x.Entity == nameof(MeetingAgenda)
         && x.EntityID == results.ID
         && x.StatusFlag != McvConstant.WFTASK_STATUSFLAG_COMPLETED)
                    .ToListAsync();

                if (_currentAgendaTasks.Any())
                {
                    foreach (var task in _currentAgendaTasks)
                    {
                        task.StatusFlag = McvConstant.WFTASK_STATUSFLAG_COMPLETED;
                        task.Comment = $"Agenda Resolved";
                        task.CompletedDate = DateTime.UtcNow;
                        await wFTaskService.Update(task);
                    }
                }

            }



            return Ok(results);

        }


        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {


            var results = mapper.Map<MeetingAgendaDto>(await service.GetById(id));
            if (results == null) throw new NotFoundException($"{nameof(MeetingAgenda)} not found!");

            var meeting = await db.Meetings.AsNoTracking().SingleOrDefaultAsync(x => x.ID == results.MeetingID);
            if (meeting == null) throw new BadRequestException("Meeting not found");

            await service.Delete(id);

            var username = _currentUserService.GetCurrentUsername();
            if (!string.IsNullOrEmpty(username))
            {
                var currentContact = await contactService.Get().FirstOrDefaultAsync(x => x.Username == username);
                if (currentContact != null)
                {
                    await activityService.LogUserActivity(currentContact, nameof(Meeting), meeting.ID,
                                                                          meeting.Code,
                                                                          $"{nameof(MeetingAgenda)} | {meeting.Code}",
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

        [HttpGet("SendAgendaFollowUpEmails")]
        public async Task<IActionResult> SendAgendaFollowUpEmails()
        {
            await service.SendAgendaFollowUpEmails();
            return Ok();
        }
    }
}