

using MyCockpitView.WebApi.WFTaskModule.Entities;

using MyCockpitView.Utility.Common;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.WFTaskModule.Services;

public interface IWFStageService : IBaseEntityService<WFStage>
{
}
public class WFStageService : BaseEntityService<WFStage>, IWFStageService
{
    public WFStageService(EntitiesContext db) : base(db) { }

    public IQueryable<WFStage> Get(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null)
    {
        try
        {
            IQueryable<WFStage> _query = base.Get(Filters);

            //Apply filters
            if (Filters != null)
            {

                if (Filters.Where(x => x.Key.Equals("code", StringComparison.OrdinalIgnoreCase)).Any())
                {
                    var predicate = PredicateBuilder.False<WFStage>();
                    foreach (var _item in Filters.Where(x => x.Key.Equals("code", StringComparison.OrdinalIgnoreCase)))
                    {
                        predicate = predicate.Or(x => x.Code == _item.Value);
                    }
                    _query = _query.Where(predicate);
                }
            }

            return _query;
        }
        catch (Exception e)
        {
            throw;
        }
    }
}