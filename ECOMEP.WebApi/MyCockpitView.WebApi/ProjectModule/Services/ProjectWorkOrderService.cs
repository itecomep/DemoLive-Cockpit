using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.AzureBlobsModule;
using MyCockpitView.WebApi.Entities;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.ProjectModule.Services;

public interface IProjectWorkOrderService : IBaseEntityService<ProjectWorkOrder>
{
    Task<ProjectWorkOrder> GetDraft(Project project);
    Task<int> Create(ProjectWorkOrder entity, Project project);
}

public class ProjectWorkOrderService : BaseEntityService<ProjectWorkOrder>, IProjectWorkOrderService
{
    private readonly IAzureBlobService azureBlobService;

    public ProjectWorkOrderService(EntitiesContext db, IAzureBlobService azureBlobService) : base(db)
    {
        this.azureBlobService = azureBlobService;
    }

    public IQueryable<ProjectWorkOrder> Get(IEnumerable<QueryFilter> Filters = null, string Search = null, string Sort = null)
    {

        IQueryable<ProjectWorkOrder> _query = base.Get(Filters);
        //Apply filters
        if (Filters != null)
        {


            if (Filters.Where(x => x.Key.Equals("projectid", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<ProjectWorkOrder>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("projectid", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = int.TryParse(_item.Value, out int n);
                    if (isNumeric)
                        predicate = predicate.Or(x => x.ProjectID == n);
                }
                _query = _query.Where(predicate);
            }
            if (Filters.Where(x => x.Key.Equals("WorkOrderDate", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _item = Filters.Where(x => x.Key.Equals("WorkOrderDate", StringComparison.OrdinalIgnoreCase)).First();

                var isDateTime = DateTime.TryParse(_item.Value, out DateTime n);
                if (isDateTime)
                    _query = _query.Where(x => x.WorkOrderDate.Date == n.Date);
            }

            if (Filters.Where(x => x.Key.Equals("rangestart", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _item = Filters.First(x => x.Key.Equals("rangestart", StringComparison.OrdinalIgnoreCase));

                var isDateTime = DateTime.TryParse(_item.Value, out DateTime result);
                if (isDateTime)
                    _query = _query.Where(x => x.WorkOrderDate >= result);
            }

            if (Filters.Where(x => x.Key.Equals("rangeend", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _item = Filters.First(x => x.Key.Equals("rangeend", StringComparison.OrdinalIgnoreCase));

                var isDateTime = DateTime.TryParse(_item.Value, out DateTime result);

                if (isDateTime)
                {
                    var end = result.AddDays(1);
                    _query = _query.Where(x => x.WorkOrderDate < end);
                }
            }
        }

        if (Search != null && Search != String.Empty)
        {
            var _keyword = Search.Trim();

            _query = _query
          .Where(x => x.WorkOrderNo.ToLower().Contains(_keyword.ToLower())
           || x.AreaTitle.ToLower().Contains(_keyword.ToLower())
            );

        }

        if (Sort != null && Sort != String.Empty)
        {
            switch (Sort.ToLower())
            {
                case "createddate":
                    return _query
                            .OrderBy(x => x.Created);

                case "modifieddate":
                    return _query
                            .OrderBy(x => x.Modified);

                case "createddate desc":
                    return _query
                            .OrderByDescending(x => x.Created);

                case "modifieddate desc":
                    return _query
                            .OrderByDescending(x => x.Modified);

                case "workorderdate":
                    return _query
                            .OrderBy(x => x.WorkOrderDate);

                case "workorderdate desc":
                    return _query
                            .OrderByDescending(x => x.WorkOrderDate);

            }
        }




        return _query
          .OrderByDescending(x => x.WorkOrderDate);

    }

    public async Task<ProjectWorkOrder> GetDraft(Project project)
    {


        var entity = new ProjectWorkOrder()
        {
            WorkOrderDate = DateTime.UtcNow,
            ProjectID = project.ID,
        };

        entity.CompanyID = project.CompanyID;
        entity.ClientContactID = project.ClientContactID;

        if ((entity.WorkOrderNo == null || entity.WorkOrderNo == String.Empty))
        {
            entity.OrderFlag = await GetNextFinancialYearIndex(entity.WorkOrderDate, entity.TypeFlag, 3);
            entity.WorkOrderNo = $"{project.Company.Initials}/WO/{ClockTools.GetFinancialYearMid(ClockTools.GetIST(entity.WorkOrderDate))}/{entity.OrderFlag.ToString("000")}";
            //entity.SequenceNo = await GetProjectSequenceCode(entity.ProjectID, entity.TypeFlag);
        }

        return entity;
    }
    public async Task<int> Create(ProjectWorkOrder entity, Project project)
    {
        entity.CompanyID = project.CompanyID;
        entity.ClientContactID = project.ClientContactID;

        if ((entity.WorkOrderNo == null || entity.WorkOrderNo == String.Empty))
        {
            entity.OrderFlag = await GetNextFinancialYearIndex(entity.WorkOrderDate, entity.TypeFlag, 3);
            entity.WorkOrderNo = $"{project.Company.Initials}/WO/{ClockTools.GetFinancialYearMid(ClockTools.GetIST(entity.WorkOrderDate))}/{entity.OrderFlag.ToString("000")}";
            //entity.SequenceNo = await GetProjectSequenceCode(entity.ProjectID, entity.TypeFlag);
        }

        return await base.Create(entity);


    }


    private async Task<int> GetNextFinancialYearIndex(DateTime documentDate, int TypeFlag, int billFragmentYearIndex = 3, int? currentEntityID = null)
    {

        var billDateIST = ClockTools.GetIST(documentDate);
        var _startDateIST = new DateTime(billDateIST.Month < 4 ? billDateIST.AddYears(-1).Year : billDateIST.Year, 4, 1);
        var _endDateIST = _startDateIST.AddYears(1);

        var _startUTC = ClockTools.GetUTC(_startDateIST);
        var _endUTC = ClockTools.GetUTC(_endDateIST);

        var _query = Get()
            .Where(x => x.TypeFlag == TypeFlag && x.WorkOrderDate >= _startUTC && x.WorkOrderDate < _endUTC);

        if (currentEntityID != null)
            _query = _query.Where(x => x.ID != currentEntityID.Value);

        var code = await _query
            .OrderByDescending(x => x.WorkOrderNo)
            .Select(x => x.WorkOrderNo)
            .FirstOrDefaultAsync();

        var _index = 1;
        if (!string.IsNullOrEmpty(code))
        {
            _index = int.TryParse((code.Split('/')[billFragmentYearIndex]), out int n) ? n + 1 : 1;
        }

        return _index;

    }

    private async Task<string> GetProjectSequenceCode(int ProjectID, int TypeFlag, int? currentEntityID = null)
    {


        var _project = await db.Projects.AsNoTracking()
            .SingleOrDefaultAsync(x => x.ID == ProjectID);
        if (_project == null) return null;

        var _query = Get().Where(x => x.TypeFlag == TypeFlag
          && x.ProjectID == _project.ID);

        if (currentEntityID != null)
            _query = _query.Where(x => x.ID != currentEntityID.Value);

        var docCount = await _query.CountAsync();

        var _index = docCount + 1;

        return _project.Code + "-" + _index.ToString("00");


    }


}