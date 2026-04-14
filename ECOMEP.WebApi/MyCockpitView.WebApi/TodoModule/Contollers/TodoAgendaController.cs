using AutoMapper;
using MyCockpitView.WebApi.TodoModule.Dtos;
using MyCockpitView.WebApi.TodoModule.Entities;
using MyCockpitView.WebApi.TodoModule.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.ActivityModule;


using MyCockpitView.Utility.Common;

using MyCockpitView.WebApi.ContactModule.Services;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Responses;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.TodoModule.Contollers
{
    [Route("[controller]")]
    [ApiController]
    public class TodoAgendaController : ControllerBase
    {

        ILogger<TodoAgendaController> logger;
        private readonly ITodoAgendaService service;
        private readonly IMapper mapper;
        private readonly IActivityService activityService;
        private readonly IContactService contactService;
        private readonly EntitiesContext db;
        private readonly ICurrentUserService _currentUserService;

        public TodoAgendaController(
            ILogger<TodoAgendaController> logger,
            EntitiesContext entitiesContext,
            ITodoAgendaService service,
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


            var results = mapper.Map<IEnumerable<TodoAgendaDto>>(await query.ToListAsync());


            return Ok(results);

        }


        [Authorize]
        [HttpGet("Pages")]
        public async Task<IActionResult> GetPages(int page = 0, int pageSize = 10, string? Filters = null, string? Search = null, string? Sort = null)
        {

            var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort);
            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((decimal)totalCount / pageSize);

            var results = mapper.Map<IEnumerable<TodoAgendaDto>>(await query
                .Skip(pageSize * page)
                .Take(pageSize).ToListAsync());

            return Ok(new PagedResponse<TodoAgendaDto>(results, totalCount, totalPages));

        }


        // GET: api/Contacts/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByID(int id)
        {

            var results = mapper.Map<TodoAgendaDto>(await service.GetById(id));

            if (results == null) throw new NotFoundException($"{nameof(TodoAgenda)} not found!");


            return Ok(results);

        }

        [HttpGet("uid/{id:guid}")]
        public async Task<IActionResult> GetByGUID(Guid id)
        {

            var results = mapper.Map<TodoAgendaDto>(await service.GetById(id));

            if (results == null) throw new NotFoundException($"{nameof(TodoAgenda)} not found!");


            return Ok(results);

        }


        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] TodoAgendaDto Dto)
        {
            var todo = await db.Todos.AsNoTracking().SingleOrDefaultAsync(x => x.ID == Dto.TodoID);
            if (todo == null) throw new BadRequestException($"{nameof(Todo)} not found");

            var results = mapper.Map<TodoAgendaDto>(await service.GetById(await service.Create(mapper.Map<TodoAgenda>(Dto))));
            if (results == null) throw new BadRequestException($"{nameof(TodoAgenda)} could not be created!");

            var username = _currentUserService.GetCurrentUsername();
            if (!string.IsNullOrEmpty(username))
            {
                var currentContact = await contactService.Get().FirstOrDefaultAsync(x => x.Username == username);
                if (currentContact != null)
                {
                    await activityService.LogUserActivity(currentContact, nameof(Todo), todo.ID,
                                                                        $"{todo.Title}-{todo.SubTitle}",
                                                                        $"{nameof(TodoAgenda)} | {results.Title}",
                                                                        "Created"
                                                                        );
                }
            }

            return Ok(results);

        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] TodoAgendaDto Dto)
        {
            var todo = await db.Todos.AsNoTracking().SingleOrDefaultAsync(x => x.ID == Dto.TodoID);
            if (todo == null) throw new BadRequestException($"{nameof(Todo)} not found");

            await service.Update(mapper.Map<TodoAgenda>(Dto));

            var results = mapper.Map<TodoAgendaDto>(await service.GetById(id));
            if (results == null) throw new NotFoundException($"{nameof(TodoAgenda)} not found!");

            var username = _currentUserService.GetCurrentUsername();
            if (!string.IsNullOrEmpty(username))
            {
                var currentContact = await contactService.Get().FirstOrDefaultAsync(x => x.Username == username);
                if (currentContact != null)
                {
                    await activityService.LogUserActivity(currentContact, nameof(Todo), todo.ID,
                                                                            $"{todo.Title}-{todo.SubTitle}",
                                                                            $"{nameof(TodoAgenda)} | {results.Title}",
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


            var results = mapper.Map<TodoAgendaDto>(await service.GetById(id));
            if (results == null) throw new NotFoundException($"{nameof(TodoAgenda)} not found!");

            var todo = await db.Todos.AsNoTracking().SingleOrDefaultAsync(x => x.ID == results.TodoID);
            if (todo == null) throw new BadRequestException($"{nameof(Todo)} not found");


            await service.Delete(id);
            var username = _currentUserService.GetCurrentUsername();
            if (!string.IsNullOrEmpty(username))
            {
                var currentContact = await contactService.Get().FirstOrDefaultAsync(x => x.Username == username);
                if (currentContact != null)
                {
                    await activityService.LogUserActivity(currentContact, nameof(Todo), todo.ID,
                                                                            $"{todo.Title}-{todo.SubTitle}",
                                                                            $"{nameof(TodoAgenda)} | {results.Title}",
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