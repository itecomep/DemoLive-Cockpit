using AutoMapper;
using MyCockpitView.WebApi.ProjectModule.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.ActivityModule;
using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.Entities;
using MyCockpitView.WebApi.ContactModule.Services;
using MyCockpitView.WebApi.Responses;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.Utility.RDLCClient;
using Newtonsoft.Json;
using MyCockpitView.Utility.Excel;
using MyCockpitView.WebApi.Services;
using MyCockpitView.WebApi.WorkOrderModule.Services;

namespace MyCockpitView.WebApi.Controllers;

[Route("[controller]")]
[ApiController]
public class ProjectBillController : ControllerBase
{

    ILogger<ProjectBillController> logger;
    private readonly IProjectBillService service;
    private readonly IMapper mapper;
    private readonly IActivityService activityService;
    private readonly IProjectStageService projectStageService;
    private readonly IContactService contactService;
    private readonly EntitiesContext db;
    private readonly ICurrentUserService _currentUserService;
    private readonly IWorkOrderStageService workOrderStageService;

    public ProjectBillController(
        ILogger<ProjectBillController> logger,
        EntitiesContext entitiesContext,
        IProjectBillService service,
        IMapper mapper,
        IActivityService activityService,
        IProjectStageService projectStageService,
        IContactService contactService,
        ICurrentUserService currentUserService,
        IWorkOrderStageService workOrderStageService
        )
    {
        this.logger = logger;
        db = entitiesContext;
        this.service = service;
        this.mapper = mapper;
        this.activityService = activityService;
        this.projectStageService = projectStageService;
        this.contactService = contactService;
        _currentUserService = currentUserService; ;
        this.workOrderStageService = workOrderStageService;
    }

    [Authorize]
    [HttpGet]

    public async Task<IActionResult> Get(string? Filters = null, string? Search = null, string? Sort = null)
    {

        var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort)
            .Include(x=>x.Payments)
            .ThenInclude(x => x.Attachments)
          ;


            var results = mapper.Map<IEnumerable<ProjectBillDto>>(await query.ToListAsync());


            return Ok(results);

    }


    // GET: api/Contacts/5
    [Authorize]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetByID(int id)
    {

        var results = mapper.Map<ProjectBillDto>(await service.Get().Include(x => x.Payments)
            .ThenInclude(x => x.Attachments).SingleOrDefaultAsync(x=>x.ID==id));

        if (results == null) throw new NotFoundException($"{nameof(ProjectBill)} not found!");


        return Ok(results);

    }

    [HttpGet("uid/{id:guid}")]
    public async Task<IActionResult> GetByGUID(Guid id)
    {

        var results = mapper.Map<ProjectBillDto>(await service.Get().Include(x => x.Payments)
            .ThenInclude(x => x.Attachments).SingleOrDefaultAsync(x=>x.UID==id));

        if (results == null) throw new NotFoundException($"{nameof(ProjectBill)} not found!");


        return Ok(results);

    }


    [Authorize]
    [HttpGet("Pages")]
    public async Task<IActionResult> GetPages(int page = 0, int pageSize = 10, string? Filters = null, string? Search = null, string? Sort = null)
    {

            var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null,Search, Sort)
            .Include(x => x.Payments)
            .ThenInclude(x => x.Attachments);
        ;
        var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((decimal)totalCount / pageSize);

            var results = mapper.Map<IEnumerable<ProjectBillDto>>(await query
                .Skip(pageSize * page)
                .Take(pageSize).ToListAsync());

            return Ok(new PagedResponse<ProjectBillDto>(results, totalCount, totalPages));

    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] ProjectBillDto Dto)
    {
        var project = await db.Projects.AsNoTracking().Where(x => !x.IsDeleted)
          .Include(x => x.WorkOrders)
          .Include(x => x.Stages)
          .Include(x => x.Company)
        .Include(x => x.ClientContact)
                 .SingleOrDefaultAsync(x => x.ID == Dto.ProjectID);

        if (project == null) throw new BadRequestException("Project not found");

        var id = await service.Create(mapper.Map<ProjectBill>(Dto),project);

        var results = mapper.Map<ProjectBillDto>(await service.Get()
            .Include(x => x.Payments)
            .ThenInclude(x => x.Attachments)
            .SingleOrDefaultAsync(x => x.ID == id));

        var _workOrder = await db.WorkOrders.AsNoTracking()
                         .Include(x => x.Stages)
                         .SingleOrDefaultAsync(x => x.ID == Dto.WorkOrderID);


        if (results == null) throw new BadRequestException($"{nameof(ProjectBill)} could not be created!");

        if(_workOrder != null && _workOrder.Stages != null)
        {
            foreach (var stage in results.Stages)
            {
                var workOrderStage = _workOrder.Stages.FirstOrDefault(x => x.Title == stage.Title);
                if (workOrderStage != null && workOrderStage.StatusFlag != McvConstant.PROJECT_STAGE_STATUSFLAG_BILLED)
                {
                    workOrderStage.StatusFlag = McvConstant.PROJECT_STAGE_STATUSFLAG_BILLED;
                    await workOrderStageService.Update(workOrderStage);
                }
            }
        }
        

        //foreach (var stage in results.Stages)
        //{
        //    var projectStage = project.Stages.FirstOrDefault(x => x.Title == stage.Title);
        //    if(projectStage!=null && projectStage.StatusFlag != McvConstant.PROJECT_STAGE_STATUSFLAG_BILLED)
        //    {
        //        projectStage.StatusFlag = McvConstant.PROJECT_STAGE_STATUSFLAG_BILLED;
        //        await projectStageService.Update(projectStage);
        //    }
        //}

        

        var username = _currentUserService.GetCurrentUsername();
        if (!string.IsNullOrEmpty(username))
        {
            var currentContact = await contactService.Get().FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
            {
                await activityService.LogUserActivity(currentContact, nameof(Project), project.ID,
                                                                        project.Code + "-" + project.Title,
                                                                        $"{(results.TypeFlag==McvConstant.PROJECT_BILL_TYPEFLAG_PROFORMA_INVOICE ? "PROFORMA INVOICE | "+results.ProformaInvoiceNo : "TAX INVOICE | "+results.TaxInvoiceNo )}",
                                                                        "Created"
                                                                        );
            }
        }

            return Ok(results);

    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] ProjectBillDto Dto)
    {
        var project = await db.Projects.AsNoTracking().Where(x => !x.IsDeleted)
         .Include(x => x.WorkOrders)
         .Include(x => x.Stages)
         .Include(x => x.Company)
       .Include(x => x.ClientContact)
                .SingleOrDefaultAsync(x => x.ID == Dto.ProjectID);

        if (project == null) throw new BadRequestException("Project not found");

        await service.Update(mapper.Map<ProjectBill>(Dto),project);

        var results = mapper.Map<ProjectBillDto>(await service.Get().Include(x => x.Payments)
           .ThenInclude(x => x.Attachments).SingleOrDefaultAsync(x => x.ID == id));

        if (results == null) throw new NotFoundException($"{nameof(ProjectBill)} not found!");

        var username = _currentUserService.GetCurrentUsername();
        if (!string.IsNullOrEmpty(username))
        {
            var currentContact = await contactService.Get().FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
            {
                await activityService.LogUserActivity(currentContact, nameof(Project), project.ID,
                                                                    project.Code + "-" + project.Title,
$"{(results.TypeFlag == McvConstant.PROJECT_BILL_TYPEFLAG_PROFORMA_INVOICE ? "PROFORMA INVOICE | " + results.ProformaInvoiceNo : "TAX INVOICE | " + results.TaxInvoiceNo)}",
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


        var results = mapper.Map<ProjectBillDto>(await service.Get().SingleOrDefaultAsync(x => x.ID == id));

        if (results == null) throw new NotFoundException($"{nameof(ProjectBill)} not found!");

        var project = await db.Projects.AsNoTracking()
            .Include(x=>x.Stages)
            .SingleOrDefaultAsync(x => x.ID == results.ProjectID);

        if (project == null) throw new BadRequestException("Project not found");

        foreach (var stage in results.Stages)
        {
            var projectStage = project.Stages.FirstOrDefault(x => x.Title == stage.Title);
            if (projectStage != null && projectStage.StatusFlag != McvConstant.PROJECT_STAGE_STATUSFLAG_COMPLETED)
            {
                projectStage.StatusFlag = McvConstant.PROJECT_STAGE_STATUSFLAG_COMPLETED;
                await projectStageService.Update(projectStage);
            }
        }

        await service.Delete(id);
        var username = _currentUserService.GetCurrentUsername();
        if (!string.IsNullOrEmpty(username))
        {
            var currentContact = await contactService.Get().FirstOrDefaultAsync(x => x.Username == username);
            if (currentContact != null)
            {
                await activityService.LogUserActivity(currentContact, nameof(Project), project.ID,
                                                                      project.Code + "-" + project.Title,
                                                                  $"{(results.TypeFlag == McvConstant.PROJECT_BILL_TYPEFLAG_PROFORMA_INVOICE ? "PROFORMA INVOICE | " + results.ProformaInvoiceNo : "TAX INVOICE | " + results.TaxInvoiceNo)}",
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

    [Authorize]
    [HttpGet("Draft/{id}/{typeFlag}")]
    public async Task<IActionResult> GetDraft(int id,int typeFlag,bool isPreDated=false)
    {
        var project = await db.Projects.AsNoTracking().Where(x => !x.IsDeleted)
          .Include(x => x.WorkOrders)
          .Include(x => x.Stages)
          .Include(x => x.Company)
        .Include(x => x.ClientContact)
                 .SingleOrDefaultAsync(x => x.ID == id);

        if (project == null) throw new BadRequestException("Project not found");
        var results = await service.GetDraft(project,typeFlag,isPreDated);
        return Ok(results);
    }

    [HttpGet("Report/{ReportName}/{id:guid}")]
    public async Task<IActionResult> Report(string ReportName, Guid id, string? Filters = null, string? sort = null, string? output = "PDF", bool inline = false)
    {

        ReportDefinition _reportDef = null;
        var _filters = Filters != null ? JsonConvert.DeserializeObject<APIFilter>(Filters).Filters : null;


        if (ReportName.ToLower() == "bill")
            {
            var _bill = await service.Get()
                        .SingleOrDefaultAsync(x => x.UID == id);

            if (_bill == null)
                throw new EntityServiceException("ProjectBill/Proforma not found!");

            _reportDef= await service.GeneratePdf(_bill, true);
        }
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

    [Authorize]
    [HttpGet("Analysis/{dataType}")]
    public async Task<IActionResult> GetAnalysis(string dataType, string? Filters = null, string? Search = null, string? Sort = null, int page = 0, int pageSize = 0)
    {


        if (dataType.Equals("full", StringComparison.OrdinalIgnoreCase))
        {
            var result = mapper.Map<IEnumerable<ProjectBillAnalysisDto>>(await service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort)
                 .Include(x => x.Payments)
                .ToListAsync());

            return Ok(result);
        }
        else
            return BadRequest("DataType not found!");

    }

    [HttpGet]
    [Route("Analysis/{dataType}/excel")]
    public async Task<IActionResult> GetAnalysisExcel(string dataType, string? Filters = null, string? Search = null, string? Sort = null)
    {

        byte[] filebytes = null;
        if (dataType.Equals("full", StringComparison.OrdinalIgnoreCase))
        {
            var result = mapper.Map<IEnumerable<ProjectBillAnalysisDto>>(await service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort)
                .Include(x=>x.Payments)
                 .ToListAsync());

            filebytes = ExcelUtility.ExportExcel(result.Select(x=>
            {
                var obj = x.ToExpando(); // Convert the object to ExpandoObject
                if (obj.ContainsKey("BillDate"))
                {
                    obj["BillDate"] = (x.BillDate).ToISTFormat(); // Convert BillDate to IST
                }

                return obj;
            }));
        }
        else
            return BadRequest("DataType not found!");

        if (filebytes == null) throw new BadRequestException("File not generated!");


        var _filename = $"BillingAnalysis-{dataType.ToUpper()}-{ClockTools.GetISTNow().ToString("yyMMddHHmm")}.xlsx";

        return new FileContentResult(filebytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        {
            FileDownloadName = _filename,
        };

    }

}