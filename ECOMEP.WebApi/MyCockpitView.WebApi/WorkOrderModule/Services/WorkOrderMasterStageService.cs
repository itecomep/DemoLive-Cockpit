using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Services;
using MyCockpitView.WebApi.WorkOrderModule.Entities;

namespace MyCockpitView.WebApi.WorkOrderModule.Services;
public interface IWorkOrderMasterStageService : IBaseEntityService<WorkOrderMasterStage>
{
}

public class WorkOrderMasterStageService : BaseEntityService<WorkOrderMasterStage>, IWorkOrderMasterStageService
{

    public WorkOrderMasterStageService(EntitiesContext db) : base(db)
    {
    }

    public IQueryable<WorkOrderMasterStage> Get(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null)
    {

        IQueryable<WorkOrderMasterStage> _query = base.Get(Filters);

        //Apply filters
        if (Filters != null)
        {
            //if (Filters.Where(x => x.Key.Equals("title", StringComparison.OrdinalIgnoreCase)).Any())
            //{
            //    var predicate = PredicateBuilder.False<WorkOrderMasterStage>();
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
            _query = _query.Where(x => x.Title.ToLower().Contains(_key)

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
                      .OrderBy(x => x.Title);

    }
}