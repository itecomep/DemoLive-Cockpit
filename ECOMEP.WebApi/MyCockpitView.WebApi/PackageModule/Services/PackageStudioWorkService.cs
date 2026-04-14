
using Microsoft.EntityFrameworkCore;
using System.Data;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Services;
using MyCockpitView.WebApi.PackageModule.Entities;

namespace MyCockpitView.WebApi.PackageModule.Services;

public interface IPackageStudioWorkService : IBaseEntityService<PackageStudioWork>
{
}

public class PackageStudioWorkService : BaseEntityService<PackageStudioWork>, IPackageStudioWorkService
{
    public PackageStudioWorkService(EntitiesContext db) : base(db) { }

    public IQueryable<PackageStudioWork> Get(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null)
    {
       
            IQueryable<PackageStudioWork> _query = base.Get(Filters);

            //Apply filters
            if (Filters != null)
            {
            if (Filters.Where(x => x.Key.Equals("assignerContactID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<PackageStudioWork>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("assignerContactID", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(x => x.AssignerContactID == isNumeric);
                }
                _query = _query.Where(predicate);
            }
            if (Filters.Where(x => x.Key.Equals("assigneeContactID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<PackageStudioWork>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("assigneeContactID", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(x => x.AssigneeContactID == isNumeric);
                }
                _query = _query.Where(predicate);
            }


            if (Filters.Where(x => x.Key.Equals("packageID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<PackageStudioWork>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("packageID", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(x => x.PackageID == isNumeric);
                }
                _query = _query.Where(predicate);
            }

        }

            if (Search != null && Search != string.Empty)
            {
            var _key = Search.Trim();
            _query = _query.Include(x=>x.Package).Where(x => x.Package.Title.ToLower().Contains(_key)
                    
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

                    else if (key.Trim().Equals("StartDate", StringComparison.OrdinalIgnoreCase))
                        _orderedQuery = _orderedQuery
                                .ThenBy(x => x.StartDate);

                    else if (key.Trim().Equals("StartDate desc", StringComparison.OrdinalIgnoreCase))
                        _orderedQuery = _orderedQuery
                                .ThenByDescending(x => x.StartDate);

                    else if (key.Trim().Equals("StartDate", StringComparison.OrdinalIgnoreCase))
                        _orderedQuery = _orderedQuery
                                .ThenBy(x => x.StartDate);

                    else if (key.Trim().Equals("DueDate desc", StringComparison.OrdinalIgnoreCase))
                        _orderedQuery = _orderedQuery
                                .ThenByDescending(x => x.DueDate);

                    else if (key.Trim().Equals("DueDate", StringComparison.OrdinalIgnoreCase))
                        _orderedQuery = _orderedQuery
                                .ThenBy(x => x.DueDate);

                    else if (key.Trim().Equals("CompletedDate desc", StringComparison.OrdinalIgnoreCase))
                        _orderedQuery = _orderedQuery
                                .ThenByDescending(x => x.CompletedDate);

                    else if (key.Trim().Equals("CompletedDate", StringComparison.OrdinalIgnoreCase))
                        _orderedQuery = _orderedQuery
                                .ThenBy(x => x.CompletedDate);


                }

                return _orderedQuery;
            }

            return _query.OrderBy(x => x.DueDate);

    }

}
