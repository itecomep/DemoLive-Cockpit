
using Microsoft.EntityFrameworkCore;
using System.Data;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Services;
using MyCockpitView.WebApi.PackageModule.Entities;

namespace MyCockpitView.WebApi.PackageModule.Services;

public interface IPackageContactService : IBaseEntityService<PackageContact>
{
}

public class PackageContactService : BaseEntityService<PackageContact>, IPackageContactService
{
    public PackageContactService(EntitiesContext db) : base(db) { }

    public IQueryable<PackageContact> Get(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null)
    {
       
            IQueryable<PackageContact> _query = base.Get(Filters);

            //Apply filters
            if (Filters != null)
            {


               
                if (Filters.Where(x => x.Key.Equals("ContactID", StringComparison.OrdinalIgnoreCase)).Any())
                {
                    var predicate = PredicateBuilder.False<PackageContact>();
                    foreach (var _item in Filters.Where(x => x.Key.Equals("ContactID", StringComparison.OrdinalIgnoreCase)))
                    {
                        var isNumeric = Convert.ToInt32(_item.Value);

                        predicate = predicate.Or(x => x.ContactID == isNumeric);
                    }
                    _query = _query.Where(predicate);
                }

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

            return _query;

    }

}
