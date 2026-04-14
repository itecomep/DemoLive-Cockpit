using AutoMapper;
using MyCockpitView.WebApi.ProjectModule.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.ActivityModule;


using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.Dtos;
using MyCockpitView.WebApi.Entities;
using MyCockpitView.WebApi.ContactModule.Services;
using MyCockpitView.WebApi.Responses;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ProjectBillPaymentController : ControllerBase
    {

        ILogger<ProjectBillPaymentController> logger;
        private readonly IProjectBillPaymentService service;
        private readonly IMapper mapper;
        private readonly IActivityService activityService;
        private readonly IProjectService projectService;
        private readonly IProjectStageService projectStageService;
        private readonly IProjectBillService projectBillService;
        private readonly IContactService contactService;
        private readonly EntitiesContext db;
        private readonly ICurrentUserService _currentUserService;

        public ProjectBillPaymentController(
            ILogger<ProjectBillPaymentController> logger,
            EntitiesContext entitiesContext,
            IProjectBillPaymentService service,
            IMapper mapper,
            IActivityService activityService,
            IProjectService projectService,
            IProjectStageService projectStageService,
            IProjectBillService projectBillService,
            IContactService contactService,
            ICurrentUserService currentUserService)
        {
            this.logger = logger;
            db = entitiesContext;
            this.service = service;
            this.mapper = mapper;
            this.activityService = activityService;
            this.projectService = projectService;
            this.projectStageService = projectStageService;
            this.projectBillService = projectBillService;
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


                var results = mapper.Map<IEnumerable<ProjectBillPaymentDto>>(await query.ToListAsync());


                return Ok(results);

        }


        // GET: api/Contacts/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByID(int id)
        {

            var results = mapper.Map<ProjectBillPaymentDto>(await service.Get().Include(x => x.Attachments).SingleOrDefaultAsync(x=>x.ID==id));

            if (results == null) throw new NotFoundException($"{nameof(ProjectBillPayment)} not found!");


            return Ok(results);

        }

        [HttpGet("uid/{id:guid}")]
        public async Task<IActionResult> GetByGUID(Guid id)
        {

            var results = mapper.Map<ProjectBillPaymentDto>(await service.Get().Include(x => x.Attachments).SingleOrDefaultAsync(x=>x.UID==id));

            if (results == null) throw new NotFoundException($"{nameof(ProjectBillPayment)} not found!");


            return Ok(results);

        }


        [Authorize]
        [HttpGet("Pages")]
        public async Task<IActionResult> GetPages(int page = 0, int pageSize = 10, string? Filters = null, string? Search = null, string? Sort = null)
        {

                var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null,Search, Sort);
                var totalCount = await query.CountAsync();
                var totalPages = (int)Math.Ceiling((decimal)totalCount / pageSize);

                var results = mapper.Map<IEnumerable<ProjectBillPaymentDto>>(await query
                    .Skip(pageSize * page)
                    .Take(pageSize).ToListAsync());

                return Ok(new PagedResponse<ProjectBillPaymentDto>(results, totalCount, totalPages));

        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] ProjectBillPaymentDto Dto)
        {
            var bill = await projectBillService.Get()
                .Select(x => new {
                    x.ID,
                    x.ProjectID,
                    x.TypeFlag,
                    x.Stages,
                    x.ProformaInvoiceNo,
                    x.TaxInvoiceNo,
                })
                .FirstOrDefaultAsync(x => x.ID == Dto.ProjectBillID);
            if (bill == null) throw new BadRequestException($"{nameof(ProjectBill)} could not be found!");

            var project = await projectService.Get()
                .Select(x=> new {
                    x.ID,
                    x.Code,
                    x.Title,
                })
                .FirstOrDefaultAsync(x => x.ID == bill.ProjectID);
            if(project == null) throw new BadRequestException($"{nameof(Project)} could not be found!");

            var id = await service.Create(mapper.Map<ProjectBillPayment>(Dto));

            var results = mapper.Map<ProjectBillPaymentDto>(await service.Get().Include(x => x.Attachments).SingleOrDefaultAsync(x => x.ID == id));

            if (results == null) throw new BadRequestException($"{nameof(ProjectBillPayment)} could not be created!");


            var projectStages = await projectStageService.Get().Where(x => x.ProjectID == bill.ProjectID).ToListAsync();

            foreach (var stage in bill.Stages)
            {
                var projectStage = projectStages.FirstOrDefault(x => x.Title == stage.Title);
                if (projectStage != null && projectStage.StatusFlag != McvConstant.PROJECT_STAGE_STATUSFLAG_PAYMENT_RECEIVED)
                {
                    projectStage.StatusFlag = McvConstant.PROJECT_STAGE_STATUSFLAG_PAYMENT_RECEIVED;
                    await projectStageService.Update(projectStage);
                }
            }

            var username = _currentUserService.GetCurrentUsername();
            var currentContact = await contactService.Get()
                .FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
            {
                await activityService.LogUserActivity(currentContact, nameof(Project), project.ID,
                                                                        project.Code + "-" + project.Title,
                                                                        $"{(bill.TypeFlag == McvConstant.PROJECT_BILL_TYPEFLAG_PROFORMA_INVOICE ? "PROFORMA INVOICE | " + bill.ProformaInvoiceNo : "TAX INVOICE | " + bill.TaxInvoiceNo)}",
                                                                        "Payment Created"
                                                                        );
            }

            return Ok(results);

        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ProjectBillPaymentDto Dto)
        {
            var bill = await projectBillService.Get()
                   .Select(x => new {
                       x.ID,
                       x.ProjectID,
                       x.TypeFlag,
                       x.Stages,
                       x.ProformaInvoiceNo,
                       x.TaxInvoiceNo,
                   })
                   .FirstOrDefaultAsync(x => x.ID == Dto.ProjectBillID);
            if (bill == null) throw new BadRequestException($"{nameof(ProjectBill)} could not be found!");

            var project = await projectService.Get()
                .Select(x => new {
                    x.ID,
                    x.Code,
                    x.Title,
                })
                .FirstOrDefaultAsync(x => x.ID == bill.ProjectID);
            if (project == null) throw new BadRequestException($"{nameof(Project)} could not be found!");

            await service.Update(mapper.Map<ProjectBillPayment>(Dto));

            var results = mapper.Map<ProjectBillPaymentDto>(await service.Get().Include(x => x.Attachments).SingleOrDefaultAsync(x => x.ID == id));

            if (results == null) throw new NotFoundException($"{nameof(ProjectBillPayment)} not found!");


            var username = _currentUserService.GetCurrentUsername();
            var currentContact = await contactService.Get()
                .FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
            {
                await activityService.LogUserActivity(currentContact, nameof(Project), project.ID,
                                                                        project.Code + "-" + project.Title,
                                                                        $"{(bill.TypeFlag == McvConstant.PROJECT_BILL_TYPEFLAG_PROFORMA_INVOICE ? "PROFORMA INVOICE | " + bill.ProformaInvoiceNo : "TAX INVOICE | " + bill.TaxInvoiceNo)}",
                                                                        "Payment Updated"
                                                                        );
            }

            return Ok(results);

        }


        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var results = mapper.Map<ProjectBillPaymentDto>(await service.Get().Include(x => x.Attachments).SingleOrDefaultAsync(x => x.ID == id));

            if (results == null) throw new NotFoundException($"{nameof(ProjectBillPayment)} not found!");

            var bill = await projectBillService.Get()
               .Select(x => new {
                   x.ID,
                   x.ProjectID,
                   x.TypeFlag,
                   x.Stages,
                   x.ProformaInvoiceNo,
                   x.TaxInvoiceNo,
               })
               .FirstOrDefaultAsync(x => x.ID == results.ProjectBillID);
            if (bill == null) throw new BadRequestException($"{nameof(ProjectBill)} could not be found!");

            var project = await projectService.Get()
                .Select(x => new {
                    x.ID,
                    x.Code,
                    x.Title,
                })
                .FirstOrDefaultAsync(x => x.ID == bill.ProjectID);
            if (project == null) throw new BadRequestException($"{nameof(Project)} could not be found!");


            await service.Delete(id);

            var projectStages = await projectStageService.Get().Where(x => x.ProjectID == bill.ProjectID).ToListAsync();

            foreach (var stage in bill.Stages)
            {
                var projectStage = projectStages.FirstOrDefault(x => x.Title == stage.Title);
                if (projectStage != null && projectStage.StatusFlag == McvConstant.PROJECT_STAGE_STATUSFLAG_PAYMENT_RECEIVED)
                {
                    projectStage.StatusFlag = McvConstant.PROJECT_STAGE_STATUSFLAG_BILLED;
                    await projectStageService.Update(projectStage);
                }
            }

            var username = _currentUserService.GetCurrentUsername();
            var currentContact = await contactService.Get()
                .FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
            {
                await activityService.LogUserActivity(currentContact, nameof(Project), project.ID,
                                                                        project.Code + "-" + project.Title,
                                                                        $"{(bill.TypeFlag == McvConstant.PROJECT_BILL_TYPEFLAG_PROFORMA_INVOICE ? "PROFORMA INVOICE | " + bill.ProformaInvoiceNo : "TAX INVOICE | " + bill.TaxInvoiceNo)}",
                                                                        "Payment Deleted"
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