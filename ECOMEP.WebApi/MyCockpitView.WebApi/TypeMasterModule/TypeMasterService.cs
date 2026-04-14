
using MyCockpitView.CoreModule;

using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.TypeMasterModule;

public interface ITypeMasterService : IBaseEntityService<TypeMaster>
{
   
}

public class TypeMasterService : BaseEntityService<TypeMaster>, ITypeMasterService
{

    public TypeMasterService(EntitiesContext db) : base(db) { }

    public IQueryable<TypeMaster> Get(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null)
    {
      
            IQueryable<TypeMaster> _query = base.Get(Filters);

            //Apply filters
            //Apply filters
            if (Filters != null)
            {
                if (Filters.Where(x => x.Key.Equals("Entity", StringComparison.OrdinalIgnoreCase)).Any())
                {
                    var predicate = PredicateBuilder.False<TypeMaster>();
                    foreach (var _item in Filters.Where(x => x.Key.Equals("Entity", StringComparison.OrdinalIgnoreCase)))
                    {
                        predicate = predicate.Or(x => x.Entity != null && x.Entity==_item.Value);
                    }
                    _query = _query.Where(predicate);
                }

            }

            if (Search != null && Search != string.Empty)
            {
                _query = _query
                 .Where(x => x.Title.ToLower().Contains(Search.ToLower())
                       );

            }

            return _query.OrderBy(x => x.Title);
      
    }

}