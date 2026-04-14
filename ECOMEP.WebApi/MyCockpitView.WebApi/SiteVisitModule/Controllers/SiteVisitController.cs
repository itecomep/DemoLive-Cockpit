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
using MyCockpitView.WebApi.StatusMasterModule;
using MyCockpitView.WebApi.ContactModule.Services;
using Newtonsoft.Json;
using MyCockpitView.WebApi.Services;
using MyCockpitView.WebApi.Responses;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.Utility.RDLCClient;

namespace MyCockpitView.WebApi.SiteVisitModule.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class SiteVisitController : ControllerBase
    {

        ILogger<SiteVisitController> _logger;
        private readonly ISiteVisitService _service;
        private readonly IMapper _mapper;
        private readonly IActivityService activityService;
        private readonly IStatusMasterService statusMasterService;
        private readonly ISharedService _sharedService;
        private readonly IWFTaskService wFTaskService;
        private readonly IContactService contactService;
        private readonly EntitiesContext _db;
        private readonly ICurrentUserService _currentUserService;

        public SiteVisitController(
            ILogger<SiteVisitController> logger,
            EntitiesContext entitiesContext,
            ISiteVisitService service,
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
            this.activityService = activityService;
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

            var query = _service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort).Include(x => x.Contact)
              ;

            var results = _mapper.Map<IEnumerable<SiteVisitDto>>(await query.ToListAsync());
            var _statusMasters = await statusMasterService.Get()
                                .Where(x => x.Entity == nameof(SiteVisit))
                                .ToListAsync();

            foreach (var obj in results)
            {
                obj.StatusValue = _statusMasters.Any(x => x.Value == obj.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == obj.StatusFlag).Title : "";
                obj.IsDelayed = await _service.IsDelayed(obj.ID);
                //obj.IsEditable = await _service.IsEditable(obj.ID);
            }

            return Ok(results);

        }

        [Authorize]
        [HttpGet("Pages")]
        public async Task<IActionResult> GetPages(int page = 0, int pageSize = 10, string? Filters = null, string? Search = null, string? Sort = null)
        {

            var query = _service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort).Include(x => x.Contact);
            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((decimal)totalCount / pageSize);

            var results = _mapper.Map<IEnumerable<SiteVisitDto>>(await query
                .Skip(pageSize * page)
                .Take(pageSize).ToListAsync());

            var _statusMasters = await statusMasterService.Get()
                                .Where(x => x.Entity == nameof(SiteVisit))
                                .ToListAsync();

            foreach (var obj in results)
            {
                obj.StatusValue = _statusMasters.Any(x => x.Value == obj.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == obj.StatusFlag).Title : "";
                obj.IsDelayed = await _service.IsDelayed(obj.ID);
                //obj.IsEditable = await _service.IsEditable(obj.ID);
            }

            return Ok(new PagedResponse<SiteVisitDto>(results, totalCount, totalPages));

        }


        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByID(int id)
        {

            var obj = _mapper.Map<SiteVisitDto>(await _service.GetById(id));
            if (obj == null) return NotFound();
            var _statusMasters = await statusMasterService.Get()
                    .Where(x => x.Entity == nameof(SiteVisit))
                    .ToListAsync();


            obj.StatusValue = _statusMasters.Any(x => x.Value == obj.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == obj.StatusFlag).Title : "";
            obj.IsDelayed = await _service.IsDelayed(obj.ID);

            var username = _currentUserService.GetCurrentUsername();
            var currentContact = await contactService.Get()
                .FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
            {
                obj.IsEditable = await _service.IsSiteVisitEditable(obj.ID, currentContact.ID);
            }

            if (obj == null) throw new NotFoundException($"{nameof(SiteVisit)} not found!");


            return Ok(obj);

        }

        [HttpGet("uid/{id:guid}")]
        public async Task<IActionResult> GetByGUID(Guid id)
        {

            var obj = _mapper.Map<SiteVisitDto>(await _service.GetById(id));

            if (obj == null) throw new NotFoundException($"{nameof(SiteVisit)} not found!");


            return Ok(obj);

        }


        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] SiteVisitDto Dto)
        {

            var obj = _mapper.Map<SiteVisitDto>(await _service.GetById(await _service.Create(_mapper.Map<SiteVisit>(Dto))));
            if (obj == null) throw new BadRequestException($"{nameof(SiteVisit)} could not be created!");

            var _statusMasters = await statusMasterService.Get()
                   .Where(x => x.Entity == nameof(SiteVisit))
                   .ToListAsync();


            obj.StatusValue = _statusMasters.Any(x => x.Value == obj.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == obj.StatusFlag).Title : "";
            obj.IsDelayed = await _service.IsDelayed(obj.ID);
            var username = _currentUserService.GetCurrentUsername();
            var currentContact = await contactService.Get()
                .FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
            {
                obj.IsEditable = await _service.IsSiteVisitEditable(obj.ID, currentContact.ID);

                await activityService.LogUserActivity(currentContact, nameof(SiteVisit), obj.ID,
                                                                    obj.Code,
                                                                    $"{nameof(SiteVisit)} | {obj.Code}",
                                                                    "Created"
                                                                    );
            }

            await wFTaskService.StartFlow(nameof(SiteVisit), obj.TypeFlag, obj.ID, ProjectID: obj.ProjectID);


            return Ok(obj);

        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] SiteVisitDto Dto)
        {

            await _service.Update(_mapper.Map<SiteVisit>(Dto));

            var obj = _mapper.Map<SiteVisitDto>(await _service.GetById(id));
            if (obj == null) throw new NotFoundException($"{nameof(SiteVisit)} not found!");

            var _statusMasters = await statusMasterService.Get()
                   .Where(x => x.Entity == nameof(SiteVisit))
                   .ToListAsync();


            obj.StatusValue = _statusMasters.Any(x => x.Value == obj.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == obj.StatusFlag).Title : "";
            obj.IsDelayed = await _service.IsDelayed(obj.ID);

            var username = _currentUserService.GetCurrentUsername();
            var currentContact = await contactService.Get()
                .FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
            {
                obj.IsEditable = await _service.IsSiteVisitEditable(obj.ID, currentContact.ID);

                await activityService.LogUserActivity(currentContact, nameof(SiteVisit), obj.ID,
                                                                    obj.Code,
                                                                    $"{nameof(SiteVisit)} | {obj.Code}",
                                                                    "Updated"
                                                                    );
            }


            if (obj.StatusFlag != McvConstant.SITE_VISIT_STATUSFLAG_SENT)
            {

                await wFTaskService.UpdateTaskDue(nameof(SiteVisit), obj.ID);

            }

            return Ok(obj);
        }
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var result = _mapper.Map<SiteVisitDto>(await _service.GetById(id));
            if (result == null) throw new NotFoundException($"{nameof(SiteVisit)} not found!");
            await _service.Delete(id);
            var username = _currentUserService.GetCurrentUsername();
            var currentContact = await contactService.Get()
                .FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
            {
                await activityService.LogUserActivity(currentContact, nameof(SiteVisit), result.ID,
                                                                result.Code,
                                                                $"{nameof(SiteVisit)} | {result.Code}",
                                                                "Deleted"
                                                                );
            }
            await wFTaskService.PurgePendingTasks(nameof(SiteVisit), id);

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
        [HttpGet("IsEditable/{id}")]
        public async Task<IActionResult> CheckIfEditable(int id)
        {
            var username = _currentUserService.GetCurrentUsername();
            var currentContact = await contactService.Get()
                .FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
            {
                return Ok(await _service.IsSiteVisitEditable(id, currentContact.ID));
            }

            return Ok(false);

        }

        [Authorize]
        [HttpGet("IsDelayed/{id}")]
        public async Task<IActionResult> CheckIfDelayed(int id)
        {

            return Ok(await _service.IsDelayed(id));

        }

        [Authorize]
        [HttpPut("Send/{id}")]
        public async Task<IActionResult> Send(int id)
        {

            await _service.SendMinutes(id);

            var obj = _mapper.Map<SiteVisitDto>(await _service.GetById(id));

            var username = _currentUserService.GetCurrentUsername();
            var currentContact = await contactService.Get()
                .FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
            {
                await activityService.LogUserActivity(currentContact, nameof(SiteVisit), obj.ID,
                                                                  obj.Code,
                                                                  $"{nameof(SiteVisit)} | {obj.Code}",
                                                                  "Sent"
                                                                  );
            }

            var _statusMasters = await statusMasterService.Get()
                  .Where(x => x.Entity == nameof(SiteVisit))
                  .ToListAsync();


            obj.StatusValue = _statusMasters.Any(x => x.Value == obj.StatusFlag) ? _statusMasters.FirstOrDefault(x => x.Value == obj.StatusFlag).Title : "";
            obj.IsDelayed = await _service.IsDelayed(obj.ID);

            if (currentContact != null)
            {
                obj.IsEditable = await _service.IsSiteVisitEditable(obj.ID, currentContact.ID);
            }

            foreach (var agenda in obj.Agendas.Where(x => x.StatusFlag == McvConstant.SITE_VISIT_AGENDA_STATUSFLAG_PENDING && x.ActionByContactID != null && !x.IsForwarded
       //&& x.PackageID == null
       && x.TodoID == null))
            {
                await wFTaskService.AssignAgendaTasks(agenda.ID);
            }

            return Ok(obj);
        }

        //Redirecting from Email to Minutes View
        [HttpGet]
        [Route("Minutes/{id:guid}")]
        public async Task<IActionResult> GetMinutes(Guid id)
        {
            var isDevMode = Convert.ToBoolean(await _sharedService.GetPresetValue(McvConstant.DEVMODE));
            if (isDevMode)
            {
                _logger.LogInformation($"Redirecting to SiteVisit Minutes for ID: {id}");
            }
            var redirectUrl = await _sharedService.GetPresetValue(McvConstant.SITE_VISIT_MINUTES_URL_ROOT) + id;
            return Redirect(redirectUrl);

        }

        [HttpGet]
        [Route("Report/{ReportName}/{Size}/{id:guid}")]
        public async Task<IActionResult> Report(string ReportName, string size, Guid id, string Filters = null, string sort = null, string output = "PDF", bool inline = false)
        {

            ReportDefinition _reportDef = null;
            var _filters = Filters != null ? JsonConvert.DeserializeObject<APIFilter>(Filters).Filters : null;

            //var _parameters = paramaters != null ? JsonConvert.DeserializeObject(paramaters) : null;

            if (ReportName.ToLower() == "minutes")
                _reportDef = await _service.GetMinutesReport(size, id, sort);
            else
                return BadRequest("No matching reportname found!");

            if (_reportDef == null || _reportDef.FileContent == null)
            {
                return BadRequest("Report not generated!");
            }
            if (inline)
            {
                // Set the content type to indicate PDF
                Response.Headers.Add("Content-Type", _reportDef.FileContentType);

                // Optionally, you can set a content disposition to indicate inline display
                Response.Headers.Add("Content-Disposition", "inline; filename=" + _reportDef.Filename + _reportDef.FileExtension);

                return File(_reportDef.FileContent, _reportDef.FileContentType);
            }
            return new FileContentResult(_reportDef.FileContent, _reportDef.FileContentType)
            {
                FileDownloadName = _reportDef.Filename + _reportDef.FileExtension,
            };

        }
    }
}