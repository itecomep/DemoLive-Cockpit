
using Microsoft.EntityFrameworkCore;
using System.Data;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Services;
using MyCockpitView.WebApi.PackageModule.Entities;

namespace MyCockpitView.WebApi.PackageModule.Services;

public interface IPackageService : IBaseEntityService<Package>
{
}

public class PackageService : BaseEntityService<Package>, IPackageService
{
    public PackageService(EntitiesContext db) : base(db) { }

    public IQueryable<Package> Get(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null)
    {
       
            IQueryable<Package> _query = base.Get(Filters);

            //Apply filters
            if (Filters != null)
            {


               
                if (Filters.Where(x => x.Key.Equals("ContactID", StringComparison.OrdinalIgnoreCase)).Any())
                {
                    var predicate = PredicateBuilder.False<Package>();
                    foreach (var _item in Filters.Where(x => x.Key.Equals("ContactID", StringComparison.OrdinalIgnoreCase)))
                    {
                        var isNumeric = Convert.ToInt32(_item.Value);

                        predicate = predicate.Or(x => x.Contacts.Where(a => a.ContactID == isNumeric).Any());
                    }
                    _query = _query.Include(x => x.Contacts).Where(predicate);
                }

                if (Filters.Where(x => x.Key.Equals("CreatedRangeStart", StringComparison.OrdinalIgnoreCase)).Any())
                {
                    var _item = Filters.First(x => x.Key.Equals("CreatedRangeStart", StringComparison.OrdinalIgnoreCase));

                    DateTime result = Convert.ToDateTime(_item.Value);
                    _query = _query.Where(x => x.Created >= result);
                }

                if (Filters.Where(x => x.Key.Equals("CreatedRangeEnd", StringComparison.OrdinalIgnoreCase)).Any())
                {
                    var _item = Filters.First(x => x.Key.Equals("CreatedRangeEnd", StringComparison.OrdinalIgnoreCase));

                    DateTime result = Convert.ToDateTime(_item.Value);
                    var end = result.AddDays(1);
                    _query = _query.Where(x => x.Created < end);

                }


                if (Filters.Where(x => x.Key.Equals("ModifiedRangeStart", StringComparison.OrdinalIgnoreCase)).Any())
                {
                    var _item = Filters.First(x => x.Key.Equals("ModifiedRangeStart", StringComparison.OrdinalIgnoreCase));

                    DateTime result = Convert.ToDateTime(_item.Value);
                    _query = _query.Where(x => x.Modified >= result);
                }

                if (Filters.Where(x => x.Key.Equals("ModifiedRangeEnd", StringComparison.OrdinalIgnoreCase)).Any())
                {
                    var _item = Filters.First(x => x.Key.Equals("ModifiedRangeEnd", StringComparison.OrdinalIgnoreCase));

                    DateTime result = Convert.ToDateTime(_item.Value);
                    var end = result.AddDays(1);
                    _query = _query.Where(x => x.Modified < end);

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

                    else if (key.Trim().Equals("SubmissionDate desc", StringComparison.OrdinalIgnoreCase))
                        _orderedQuery = _orderedQuery
                                .ThenByDescending(x => x.SubmissionDate);

                    else if (key.Trim().Equals("SubmissionDate", StringComparison.OrdinalIgnoreCase))
                        _orderedQuery = _orderedQuery
                                .ThenBy(x => x.SubmissionDate);


                }

                return _orderedQuery;
            }

            return _query
                          .OrderByDescending(x => x.DueDate);

    }

}
