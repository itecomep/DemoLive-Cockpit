using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.WorkOrderModule.Entities;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.WorkOrderModule.Services;
public interface IWorkOrderMasterService : IBaseEntityService<WorkOrderMaster>
{
}

public class WorkOrderMasterService : BaseEntityService<WorkOrderMaster>, IWorkOrderMasterService
{

    public WorkOrderMasterService(EntitiesContext db) : base(db)
    {
    }

    public IQueryable<WorkOrderMaster> Get(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null)
    {

        IQueryable<WorkOrderMaster> _query = base.Get(Filters);

        //Apply filters
        if (Filters != null)
        {
            //if (Filters.Where(x => x.Key.Equals("title", StringComparison.OrdinalIgnoreCase)).Any())
            //{
            //    var predicate = PredicateBuilder.False<WorkOrderMaster>();
            //    foreach (var _item in Filters.Where(x => x.Key.Equals("title", StringComparison.OrdinalIgnoreCase)))
            //    {
            //        predicate = predicate.Or(x => x.Title == _item.Value);
            //    }
            //    _query = _query.Where(predicate);
            //}
        }

        if (Search != null && Search != string.Empty)
        {
            var _key = Search.Trim();
            _query = _query.Where(x => x.TypologyTitle.ToLower().Contains(_key)

                            || x._searchTags.ToLower().Contains(_key)
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
                      .OrderBy(x => x.TypologyTitle);

    }

}