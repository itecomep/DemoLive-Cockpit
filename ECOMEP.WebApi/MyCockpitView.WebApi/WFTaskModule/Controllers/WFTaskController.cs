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
using DocumentFormat.OpenXml.Office2010.Excel;

namespace MyCockpitView.WebApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class WFTaskController : ControllerBase
    {

        ILogger<WFTaskController> logger;
        private readonly IWFTaskService service;
        private readonly IMapper mapper;
        private readonly IActivityService activityService;
        private readonly IContactService contactService;
        private readonly ISharedService sharedService;
        private readonly EntitiesContext db;
        private readonly ICurrentUserService _currentUserService;

        public WFTaskController(
            ILogger<WFTaskController> logger,
            EntitiesContext entitiesContext,
            IWFTaskService service,
            IMapper mapper,
            IActivityService activityService,
            IContactService contactService,
            ISharedService sharedService,
            ICurrentUserService currentUserService
            )
        {
            this.logger = logger;
            db = entitiesContext;
            this.service = service;
            this.mapper = mapper;
            this.activityService = activityService;
            this.contactService = contactService;
            this.sharedService = sharedService;
            _currentUserService = currentUserService;
        }

        [Authorize]
        [HttpGet]

        public async Task<IActionResult> Get(string? Filters = null, string? Search = null, string? Sort = null)
        {

            var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort)
                .Include(x=>x.Contact)
                .Include(x => x.Attachments)
              ;


                var results = mapper.Map<IEnumerable<WFTaskDto>>(await query.ToListAsync());


                return Ok(results);

        }


        [Authorize]
        [HttpGet("Pages")]
        public async Task<IActionResult> GetPages(int page = 0, int pageSize = 10, string? Filters = null, string? Search = null, string? Sort = null)
        {

            var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort)
                 .Include(x => x.Contact)
                 .Include(x => x.Attachments);
            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((decimal)totalCount / pageSize);

            var results = mapper.Map<IEnumerable<WFTaskDto>>(await query
                .Skip(pageSize * page)
                .Take(pageSize).ToListAsync());

            return Ok(new PagedResponse<WFTaskDto>(results, totalCount, totalPages));

        }


        // GET: api/Contacts/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByID(int id)
        {

            var results = mapper.Map<WFTaskDto>(await service.Get()
                 .Include(x => x.Contact)
                  .Include(x => x.Assigner)
                   .Include(x => x.Attachments)
                    .Include(x => x.TimeEntries)
                    .ThenInclude(t => t.Contact)
                    .Include(x => x.Assessments)
                 .SingleOrDefaultAsync(i => i.ID == id));

            if (results == null) throw new NotFoundException($"{nameof(WFTask)} not found!");


            return Ok(results);

        }

        [HttpGet("uid/{id:guid}")]
        public async Task<IActionResult> GetByGUID(Guid id)
        {

            var results = mapper.Map<WFTaskDto>(await service.Get()
                 .Include(x => x.Contact)
                  .Include(x => x.Assigner)
                   .Include(x => x.Attachments)
                    .Include(x => x.TimeEntries)
                    .ThenInclude(t => t.Contact)
                    .Include(x => x.Assessments)
                 .SingleOrDefaultAsync(i => i.UID == id));

            if (results == null) throw new NotFoundException($"{nameof(WFTask)} not found!");


            return Ok(results);

        }


        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] WFTaskDto Dto)
        {

            var id = await service.Create(mapper.Map<WFTask>(Dto));

            var results = mapper.Map<WFTaskDto>(await service.Get()
     .Include(x => x.Contact)
      .Include(x => x.Assigner)
       .Include(x => x.Attachments)
        .Include(x => x.TimeEntries)
        .ThenInclude(t => t.Contact)
        .Include(x => x.Assessments)
     .SingleOrDefaultAsync(i => i.ID == id));

            if (results == null) throw new NotFoundException($"{nameof(WFTask)} not found!");

            var username = _currentUserService.GetCurrentUsername();
            var currentContact = await contactService.Get()
                .FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
            {
                await activityService.LogUserActivity(currentContact, nameof(WFTask), results.ID,
                                                                        $"{results.Entity}-{results.Title}-{results.Subtitle}",
                                                                        $"{nameof(WFTask)} | {results.Entity}-{results.Title}-{results.Subtitle}",
                                                                        "Created"
                                                                        );
            }

                return Ok(results);

        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] WFTaskDto Dto)
        {
            var username = _currentUserService.GetCurrentUsername();
            var currentContact = await contactService.Get()
                .FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
            {
                var flag = false;
                if (currentContact.ID != Dto.ContactID)
                {
                    if (Dto.AssignerContactID == null)
                    {
                        flag = true;
                    }
                    else if (currentContact.ID != Dto.AssignerContactID)
                    {
                        flag = true;
                    }
                }

                if(flag)
                {
                    return BadRequest($"This action is not allowed for user {username}");
                }
            }


            await service.Update(mapper.Map<WFTask>(Dto));

            var results = mapper.Map<WFTaskDto>(await service.Get()
                             .Include(x => x.Contact)
                              .Include(x => x.Assigner)
                               .Include(x => x.Attachments)
                                .Include(x => x.TimeEntries)
                                .ThenInclude(t => t.Contact)
                                .Include(x => x.Assessments)
                             .SingleOrDefaultAsync(i => i.ID == id));

            if (results == null) throw new NotFoundException($"{nameof(WFTask)} not found!");

            //if (!string.IsNullOrEmpty())
            //{
            //    var currentContact = await contactService.Get().FirstOrDefaultAsync(x => x.Username == );
            //    if (currentContact != null)
            //    {
            //        await activityService.LogUserActivity(currentContact, nameof(WFTask), results.ID,
            //                                                                $"{results.Entity}-{results.Title}-{results.Subtitle}",
            //                                                                $"{nameof(WFTask)} | {results.Entity}-{results.Title}-{results.Subtitle}",
            //                                                            "Updated"
            //                                                            );
            //    }
            //}
                return Ok(results);

        }


        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {


            var results = mapper.Map<WFTaskDto>(await service.Get()
                .Include(x => x.Contact)
                 .Include(x => x.Assigner)
                  .Include(x => x.Attachments)
                   .Include(x => x.TimeEntries)
                   .ThenInclude(t => t.Contact)
                   .Include(x => x.Assessments)
                .SingleOrDefaultAsync(i => i.ID == id));

            if (results == null) throw new NotFoundException($"{nameof(WFTask)} not found!");

            await service.Delete(id);

            var username = _currentUserService.GetCurrentUsername();
            var currentContact = await contactService.Get()
                .FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
            {
                await activityService.LogUserActivity(currentContact, nameof(WFTask), results.ID,
                                                                        $"{results.Entity}-{results.Title}-{results.Subtitle}",
                                                                        $"{nameof(WFTask)} | {results.Entity}-{results.Title}-{results.Subtitle}",
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

        [Authorize]
        [HttpGet("FieldOptions")]
        public async Task<IActionResult> GetFieldOptions(string field)
        {
            return Ok(await service.GetFieldOptions(field));
        }

        [Authorize]
        [HttpGet("Analysis/{dataType}")]
        public async Task<IActionResult> GetAnalysis(string dataType, string? Filters = null, string? Search = null, string? Sort = null)
        {

            //if (dataType.Equals("lastbite", StringComparison.OrdinalIgnoreCase))
            //    return Ok(await service.GetLastBiteData(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null,, Search, Sort));
            //else if (dataType.Equals("cashflow", StringComparison.OrdinalIgnoreCase))
            //    return Ok(await service.GetCashflowData(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null,, Search, Sort));
            //else if (dataType.Equals("crm", StringComparison.OrdinalIgnoreCase))
            //    return Ok(await service.GetCRMData(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null,, Search, Sort));
            //else
            if (dataType.Equals("full", StringComparison.OrdinalIgnoreCase))
                return Ok(await service.GetAnalysisData(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort));
            else
                return BadRequest();

        }

        [HttpGet]
        [Route("Analysis/{dataType}/excel")]
        public async Task<IActionResult> GetAnalysisExcel(string dataType, string? Filters = null, string? Search = null, string? Sort = null)
        {


            var _report = await service.GetAnalysisExcel(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort);

            var _filename = $"TaskAnalysis-{dataType.ToUpper()}-{ClockTools.GetISTNow().ToString("yyMMddHHmm")}.xlsx";

            if (_report == null) throw new BadRequestException("File not generated!");

            return new FileContentResult(_report, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
            {
                FileDownloadName = _filename
            };

        }


        [HttpGet("NotifyForActiveTask")]
        public async Task<IActionResult> NotifyForActiveTask()
        {
            var activeTasks = await service.Get().Where(x => x.StatusFlag == McvConstant.WFTASK_STATUSFLAG_STARTED)
                .ToListAsync();

            foreach(var task in activeTasks)
            {
                var contact = await db.Contacts.AsNoTracking().FirstOrDefaultAsync(x => x.ID == task.ContactID);
                if (contact != null && contact.Username != null)
                {

                    if (task.DueDate < DateTime.UtcNow)
                    {
                        await sharedService.PushNotification(contact.Username, $"{task.Entity} Task Delayed", $"{task.Title} | {task.Subtitle} | {ClockTools.GetIST(task.DueDate).ToString("dd MMM yyyy HH:mm")}", nameof(WFTask), task.ID.ToString());
                    }
                    else if ((task.DueDate - DateTime.UtcNow).TotalMinutes < 30)
                    {
                        await sharedService.PushNotification(contact.Username, $"{task.Entity} Task will get delayed in {(task.DueDate - DateTime.UtcNow).Minutes} minutes", $"{task.Title} | {task.Subtitle} | {ClockTools.GetIST(task.DueDate).ToString("dd MMM yyyy HH:mm")}", nameof(WFTask), task.ID.ToString());

                    }
                    else
                    {
                        //NO action
                    }
                }

            }

            return Ok();
        }

        [HttpGet("AutoPause")]
        public async Task<IActionResult> AutoPauseTasks()
        {
                await service.AutoPauseTasks();
                return Ok();
        }
    }
}