using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;

using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.Entities;
using MyCockpitView.WebApi.Services;
using MyCockpitView.Utility.RDLCClient;
using MyCockpitView.WebApi.Exceptions;

namespace MyCockpitView.WebApi.ProjectModule.Services;

public interface IProjectInwardService : IBaseEntityService<ProjectInward>
{
    Task<ReportDefinition?> GetSummaryPDF(Guid uid, string? reportSize = "a4", string? reportType = "PDF", IEnumerable<QueryFilter>? filters = null);
}

public class ProjectInwardService : BaseEntityService<ProjectInward>, IProjectInwardService
{
    private readonly ISharedService sharedService;

    public ProjectInwardService(EntitiesContext db,ISharedService sharedService) : base(db)
    {
        this.sharedService = sharedService;
    }

    public IQueryable<ProjectInward> Get(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null)
    {
      
            IQueryable<ProjectInward> _query = base.Get(Filters);

            //Apply filters
            if (Filters != null)
            {

                if (Filters.Where(x => x.Key.Equals("ProjectID", StringComparison.OrdinalIgnoreCase)).Any())
                {
                    var predicate = PredicateBuilder.False<ProjectInward>();
                    foreach (var _item in Filters.Where(x => x.Key.Equals("ProjectID", StringComparison.OrdinalIgnoreCase)))
                    {
                        var isNumeric = Convert.ToInt32(_item.Value);

                        predicate = predicate.Or(x => x.ProjectID == isNumeric);
                    }
                    _query = _query.Where(predicate);
                }

            }

            if (Search != null && Search != string.Empty)
            {
            var _key = Search.Trim();
            _query = _query.Where(x => x._searchTags.ToLower().Contains(_key)
                    || x.Title.ToLower().Contains(_key)
                        );
                
            }

            if (Sort != null && Sort != string.Empty)
            {
                var _orderedQuery = _query.OrderBy(l => 0);
                var keywords = Sort.Replace("asc", "").Split(',');

                foreach (var key in keywords)
                {
                    if (key.Trim().Equals("created", StringComparison.OrdinalIgnoreCase))
                        _orderedQuery = _orderedQuery
                                .ThenBy(x => x.Created);

                    else if (key.Trim().Equals("created desc", StringComparison.OrdinalIgnoreCase))
                        _orderedQuery = _orderedQuery
                                .ThenByDescending(x => x.Created);

                    else if (key.Trim().Equals("modified", StringComparison.OrdinalIgnoreCase))
                        _orderedQuery = _orderedQuery
                                .ThenBy(x => x.Modified);

                    else if (key.Trim().Equals("modified desc", StringComparison.OrdinalIgnoreCase))
                        _orderedQuery = _orderedQuery
                                .ThenByDescending(x => x.Modified);

                }

                return _orderedQuery;
            }

            return _query
                          .OrderByDescending(x => x.ReceivedDate);

    }

    public async Task<ProjectInward> GetById(int Id)
    {
       
            var query = await Get()
                .Include(x => x.Attachments)
                .Include(x => x.Contact)
                 .SingleOrDefaultAsync(i => i.ID == Id);


            return query;
      
    }

    public async Task<ReportDefinition?> GetSummaryPDF(Guid uid, string? reportSize = "a4", string? reportType = "PDF", IEnumerable<QueryFilter>? filters = null)
    {
        var project = await db.Projects.AsNoTracking()
      .Where(x => x.UID == uid)
      .SingleOrDefaultAsync();

        if (project == null) throw new EntityServiceException("Project not found!");


        var _inwards = await Get(filters)
        .Include(x => x.Attachments)
        .Include(x=>x.Contact)
         .Where(x => x.ProjectID == project.ID)
         .Where(x=>x.Attachments.Where(x=>!x.IsDeleted).Any())
         .Where(x=>x.TypeFlag==McvConstant.PROJECT_INWARD_TYPEFLAG_IN)
        .SelectMany(x => x.Attachments.Where(x => !x.IsDeleted).Select(a=> new 
        {
           
           x.ReceivedDate,
           x.Title,
           x.Message,
           ReceivedFromName= x.Contact.FullName,
           ReceivedFromEmail=x.Contact.Emails.FirstOrDefault(c=>c.IsPrimary).Email,
           a.Filename,

        }))
        .OrderBy(x=>x.ReceivedDate)
        .ToListAsync();

        var _reportContainerUrl = await sharedService.GetPresetValue(McvConstant.RDLC_REPORT_CONTAINER_URL);
        var DEVMODE = Convert.ToBoolean((await sharedService.GetPresetValue(McvConstant.DEVMODE)));
        var reportServiceApi = await sharedService.GetPresetValue(McvConstant.RDLC_PROCESSOR_API);

        var _reportPath = $"ProjectInwardSummary-{reportSize}.rdlc";

        var _reportProperties = new HashSet<ReportProperties>
            {
                new ReportProperties() { PropertyName = "ProjectName", PropertyValue = $"{project.Title}" },
                new ReportProperties() { PropertyName = "ProjectCode", PropertyValue = $"{project.Code}" },
            };
        var _reportDef = new ReportDefinition()
        {
            ReportName = "ProjectInwardSummary",
            ReportPath = DEVMODE ? $"{_reportContainerUrl}DEV/{_reportPath}" : $"{_reportContainerUrl}{_reportPath}",
            ReportDataSet = DataTools.ToDataTable(_inwards.Select(a => new
            {

                a.ReceivedDate,
                a.Title,
                a.Message,
                a.ReceivedFromName,
                a.ReceivedFromEmail,
                a.Filename,
                FileType=DataTools.GetFileExtension(a.Filename)
            })),
            ReportProperties = _reportProperties,
            Filename = $"{project.Code}-INSM-{ClockTools.GetISTNow().ToString("yyMMddHHmm")}",
            RenderType = reportType, //"EXCELOPENXML",

        };

        return await ReportClient.GenerateReport(_reportDef, reportServiceApi);

    }

}