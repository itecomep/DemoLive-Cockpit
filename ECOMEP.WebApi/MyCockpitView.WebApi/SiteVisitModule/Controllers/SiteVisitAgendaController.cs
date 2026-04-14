using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.ActivityModule;


using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.SiteVisitModule.Dtos;
using MyCockpitView.WebApi.SiteVisitModule.Entities;
using MyCockpitView.WebApi.SiteVisitModule.Services;
using MyCockpitView.WebApi.WFTaskModule.Services;
using MyCockpitView.WebApi.TodoModule.Services;
using MyCockpitView.WebApi.ContactModule.Services;
using MyCockpitView.WebApi.Responses;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.SiteVisitModule.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class SiteVisitAgendaController : ControllerBase
    {

        ILogger<SiteVisitAgendaController> logger;
        private readonly ISiteVisitAgendaService service;
        private readonly IMapper mapper;
        private readonly IActivityService activityService;
        private readonly ITodoService todoService;
        private readonly IWFTaskService wFTaskService;
        private readonly IContactService contactService;
        private readonly EntitiesContext db;
        private readonly ICurrentUserService _currentUserService;

        public SiteVisitAgendaController(
            ILogger<SiteVisitAgendaController> logger,
            EntitiesContext entitiesContext,
            ISiteVisitAgendaService service,
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
                .Include(x => x.Attachments)
              ;


            var results = mapper.Map<IEnumerable<SiteVisitAgendaDto>>(await query.ToListAsync());


            return Ok(results);

        }


        // GET: api/Contacts/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByID(int id)
        {

            var obj = mapper.Map<SiteVisitAgendaDto>(await service.GetById(id));
            if (obj == null) return NotFound();
            if (obj == null) throw new NotFoundException($"{nameof(SiteVisitAgenda)} not found!");


            return Ok(obj);

        }

        [HttpGet("uid/{id:guid}")]
        public async Task<IActionResult> GetByGUID(Guid id)
        {

            var obj = mapper.Map<SiteVisitAgendaDto>(await service.GetById(id));
            if (obj == null) return NotFound();
            if (obj == null) throw new NotFoundException($"{nameof(SiteVisitAgenda)} not found!");


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

            var results = mapper.Map<IEnumerable<SiteVisitAgendaDto>>(await query
                .Skip(pageSize * page)
                .Take(pageSize).ToListAsync());

            return Ok(new PagedResponse<SiteVisitAgendaDto>(results, totalCount, totalPages));

        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] SiteVisitAgendaDto Dto)
        {
            var SiteVisit = await db.SiteVisits.AsNoTracking().SingleOrDefaultAsync(x => x.ID == Dto.SiteVisitID);
            if (SiteVisit == null) throw new BadRequestException("SiteVisit not found");

            var results = mapper.Map<SiteVisitAgendaDto>(await service.GetById(await service.Create(mapper.Map<SiteVisitAgenda>(Dto))));
            if (results == null) throw new BadRequestException($"{nameof(SiteVisitAgenda)} could not be created!");


            var username = _currentUserService.GetCurrentUsername();
            if (!string.IsNullOrEmpty(username))
            {
                var currentContact = await contactService.Get().FirstOrDefaultAsync(x => x.Username == username);
                if (currentContact != null)
                {
                    await activityService.LogUserActivity(currentContact, nameof(SiteVisit), SiteVisit.ID,
                                                                        SiteVisit.Code,
                                                                        $"{nameof(SiteVisitAgenda)} | {SiteVisit.Code}",
                                                                        "Created"
                                                                        );
                }
            }

            return Ok(results);

        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] SiteVisitAgendaDto Dto)
        {
            var SiteVisit = await db.SiteVisits.AsNoTracking().SingleOrDefaultAsync(x => x.ID == Dto.SiteVisitID);
            if (SiteVisit == null) throw new BadRequestException("SiteVisit not found");

            await service.Update(mapper.Map<SiteVisitAgenda>(Dto));

            var results = mapper.Map<SiteVisitAgendaDto>(await service.GetById(id));
            if (results == null) throw new NotFoundException($"{nameof(SiteVisitAgenda)} not found!");


            var username = _currentUserService.GetCurrentUsername();
            if (!string.IsNullOrEmpty(username))
            {
                var currentContact = await contactService.Get().FirstOrDefaultAsync(x => x.Username == username);
                if (currentContact != null)
                {
                    await activityService.LogUserActivity(currentContact, nameof(SiteVisit), SiteVisit.ID,
                                                                        SiteVisit.Code,
                                                                        $"{nameof(SiteVisitAgenda)} | {SiteVisit.Code}",
                                                                        "Updated"
                                                                        );
                }
            }


            if (results.TodoID != null && results.StatusFlag == McvConstant.SITE_VISIT_AGENDA_STATUSFLAG_PENDING && results.DueDate != null)
            {
                var _todo = await todoService.Get().SingleOrDefaultAsync(x => x.ID == results.TodoID);
                if (_todo != null && _todo.StatusFlag == 0 && results.DueDate != null)
                {
                    _todo.DueDate = results.DueDate.Value;
                    await todoService.Update(_todo);

                }

                //Check if agenda task is pending
                var _currentAgendaTasks = await wFTaskService.Get().Where(x => x.Entity == nameof(SiteVisitAgenda)
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
            else if (results.StatusFlag == McvConstant.SITE_VISIT_AGENDA_STATUSFLAG_RESOLVED)
            {

                //Check if agenda task is pending
                var _currentAgendaTasks = await wFTaskService.Get().Where(x => x.Entity == nameof(SiteVisitAgenda)
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


            var results = mapper.Map<SiteVisitAgendaDto>(await service.GetById(id));
            if (results == null) throw new NotFoundException($"{nameof(SiteVisitAgenda)} not found!");

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
                                                                          $"{nameof(SiteVisitAgenda)} | {SiteVisit.Code}",
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