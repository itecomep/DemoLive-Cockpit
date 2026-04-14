using AutoMapper;
using MyCockpitView.WebApi.TodoModule.Dtos;
using MyCockpitView.WebApi.TodoModule.Entities;
using MyCockpitView.WebApi.TodoModule.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.ActivityModule;


using MyCockpitView.Utility.Common;
using DocumentFormat.OpenXml.Vml.Office;
using MyCockpitView.WebApi.WFTaskModule.Services;
using DocumentFormat.OpenXml.Office2010.Excel;
using MyCockpitView.WebApi.ContactModule.Services;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Responses;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.TodoModule.Contollers
{
    [Route("[controller]")]
    [ApiController]
    public class TodoController : ControllerBase
    {

        ILogger<TodoController> logger;
        private readonly ITodoService service;
        private readonly IMapper mapper;
        private readonly IActivityService activityService;
        private readonly IWFTaskService wFTaskService;
        private readonly IContactService contactService;
        private readonly EntitiesContext db;
        private readonly ICurrentUserService _currentUserService;

        public TodoController(
            ILogger<TodoController> logger,
            EntitiesContext entitiesContext,
            ITodoService service,
            IMapper mapper,
            IActivityService activityService,
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
            this.wFTaskService = wFTaskService;
            this.contactService = contactService;
            _currentUserService = currentUserService;
        }

        [Authorize]
        [HttpGet]

        public async Task<IActionResult> Get(string? Filters = null, string? Search = null, string? Sort = null)
        {

            var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort)
                 .Include(x => x.Assignee)
                    .Include(x => x.Assigner);


            var results = mapper.Map<IEnumerable<TodoDto>>(await query.ToListAsync());

            var _statusMasters = await db.StatusMasters.AsNoTracking()
      .Where(x => x.Entity == nameof(Todo))
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

            var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort).Include(x => x.Assignee)
                    .Include(x => x.Assigner);
            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((decimal)totalCount / pageSize);

            var results = mapper.Map<IEnumerable<TodoDto>>(await query
                .Skip(pageSize * page)
                .Take(pageSize).ToListAsync());

            var _statusMasters = await db.StatusMasters.AsNoTracking()
       .Where(x => x.Entity == nameof(Todo))
       .ToListAsync();
            foreach (var obj in results)
            {
                obj.StatusValue = _statusMasters.Any(x => x.Value == obj.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == obj.StatusFlag).Title : "";
            }

            return Ok(new PagedResponse<TodoDto>(results, totalCount, totalPages));

        }


        // GET: api/Contacts/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByID(int id)
        {

            var results = mapper.Map<TodoDto>(await service.GetById(id));

            if (results == null) throw new NotFoundException($"{nameof(Todo)} not found!");
            var _statusMasters = await db.StatusMasters.AsNoTracking()
.Where(x => x.Entity == nameof(Todo))
.ToListAsync();
            results.StatusValue = _statusMasters.Any(x => x.Value == results.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == results.StatusFlag).Title : "";

            return Ok(results);

        }

        [HttpGet("uid/{id:guid}")]
        public async Task<IActionResult> GetByGUID(Guid id)
        {

            var results = mapper.Map<TodoDto>(await service.GetById(id));

            if (results == null) throw new NotFoundException($"{nameof(Todo)} not found!");
            var _statusMasters = await db.StatusMasters.AsNoTracking()
.Where(x => x.Entity == nameof(Todo))
.ToListAsync();
            results.StatusValue = _statusMasters.Any(x => x.Value == results.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == results.StatusFlag).Title : "";

            return Ok(results);

        }


        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] TodoDto Dto)
        {

            var results = mapper.Map<TodoDto>(await service.GetById(await service.Create(mapper.Map<Todo>(Dto))));
            if (results == null) throw new BadRequestException($"{nameof(Todo)} could not be created!");
            var _statusMasters = await db.StatusMasters.AsNoTracking()
.Where(x => x.Entity == nameof(Todo))
.ToListAsync();
            results.StatusValue = _statusMasters.Any(x => x.Value == results.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == results.StatusFlag).Title : "";

            var username = _currentUserService.GetCurrentUsername();
            var currentContact = await contactService.Get()
                .FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
            {
                await activityService.LogUserActivity(currentContact, nameof(Todo), results.ID,
                                                                        $"{results.Title}-{results.SubTitle}",
                                                                        $"{nameof(Todo)} | {results.Title}-{results.SubTitle} | {results.MHrAssigned}mHr",
                                                                    "Created",
                                                                    $"Due: {ClockTools.GetIST((results.DueDate)).ToString("dd MMM yyyy HH:mm")} | {results.MHrAssigned}mHr"
            );
            }
            await wFTaskService.StartFlow(nameof(Todo), results.TypeFlag, results.ID, ProjectID: results.ProjectID);

            return Ok(results);

        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] TodoDto Dto)
        {

            await service.Update(mapper.Map<Todo>(Dto));

            var results = mapper.Map<TodoDto>(await service.GetById(id));
            if (results == null) throw new NotFoundException($"{nameof(Todo)} not found!");

            var _statusMasters = await db.StatusMasters.AsNoTracking()
.Where(x => x.Entity == nameof(Todo))
.ToListAsync();
            results.StatusValue = _statusMasters.Any(x => x.Value == results.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == results.StatusFlag).Title : "";

            var username = _currentUserService.GetCurrentUsername();
            var currentContact = await contactService.Get()
                .FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
            {
                await activityService.LogUserActivity(currentContact, nameof(Todo), results.ID,
                                                                        $"{results.Title}-{results.SubTitle}",
                                                                        $"{nameof(Todo)} | {results.Title}-{results.SubTitle} | {results.MHrAssigned}mHr",
                                                                    "Updated",
                                                                    $"Due: {ClockTools.GetIST((results.DueDate)).ToString("dd MMM yyyy HH:mm")} | {results.MHrAssigned}mHr"
                                                                    );
            }

            if (results.StatusFlag == McvConstant.TODO_STATUSFLAG_PENDING)
            {
                await wFTaskService.UpdateTaskDue(nameof(Todo), results.ID);
            }

            return Ok(results);

        }


        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {


            var results = mapper.Map<TodoDto>(await service.GetById(id));
            if (results == null) throw new NotFoundException($"{nameof(Todo)} not found!");

            await service.Delete(id);
            var username = _currentUserService.GetCurrentUsername();
            var currentContact = await contactService.Get()
                .FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
            {
                await activityService.LogUserActivity(currentContact, nameof(Todo), results.ID,
                                                                        $"{results.Title}-{results.SubTitle}",
                                                                        $"{nameof(Todo)} | {results.Title}-{results.SubTitle} | {results.MHrAssigned}mHr",
                                                                      "Deleted",
                                                                      $"Due: {ClockTools.GetIST((results.DueDate)).ToString("dd MMM yyyy HH:mm")} | {results.MHrAssigned}mHr"
                                                                      );
            }

            await wFTaskService.PurgePendingTasks(nameof(Todo), id);

            return Ok();

        }

        [Authorize]
        [HttpGet("Analysis")]
        public async Task<IActionResult> GetAnalysis(string? Filters = null, string? Search = null, string? Sort = null)
        {
            var _results = await service.GetAnalysis(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort);
            //var _statusMasters = await db.StatusMasters.AsNoTracking()
            //                     .Where(x => x.Entity == nameof(Todo))
            //                     .ToListAsync();
            //foreach (var obj in _results)
            //{
            //    obj.StatusValue = _statusMasters.Any(x => x.Value == obj.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == obj.StatusFlag).Title : "";
            //}

            return Ok(_results);
        }


            [Authorize]
        [HttpGet("SearchTagOptions")]
        public async Task<IActionResult> GetSearchTagOptions()
        {
            var results = await service.GetSearchTagOptions();
            return Ok(results);
        }

        [Authorize]
        [HttpGet("FieldOptions")]
        public async Task<IActionResult> GetFieldOptions(string field)
        {
            return Ok(await service.GetFieldOptions(field));
        }

        [HttpGet("StageTree")]
        [Authorize]
        public async Task<IActionResult> GetStageTree()
        {

            var stages = await db.TodoStages
                .Where(x => !x.IsDeleted)
                .Select(stage => new TodoStageTreeDto
                {
                    ID = stage.ID,
                    Title = stage.Title,

                    Categories = db.TodoStageCategories
                        .Where(c => c.StageID == stage.ID && !c.IsDeleted)
                        .Select(category => new TodoStageCategoryDto
                        {
                            ID = category.ID,
                            Title = category.Title,

                            Checklists = db.TodoStageChecklists
                                .Where(ch => ch.CategoryID == category.ID && !ch.IsDeleted)
                                .Select(ch => new TodoStageChecklistDto
                                {
                                    ID = ch.ID,
                                    Title = ch.Title
                                }).ToList()

                        }).ToList()

                }).ToListAsync();

            return Ok(stages);
        }

    }
}