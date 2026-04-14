using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.ContactModule.Entities;
using MyCockpitView.WebApi.Entities;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.ContactModule.Services;
public interface IContactTeamService : IBaseEntityService<ContactTeam>
{
}

public class ContactTeamService : BaseEntityService<ContactTeam>, IContactTeamService
{

    public ContactTeamService(EntitiesContext db) : base(db)
    {
    }

    public IQueryable<ContactTeam> Get(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null)
    {

        IQueryable<ContactTeam> _query = base.Get(Filters);

        //Apply filters
        if (Filters != null)
        {
            if (Filters.Where(x => x.Key.Equals("title", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<ContactTeam>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("title", StringComparison.OrdinalIgnoreCase)))
                {
                    predicate = predicate.Or(x => x.Title == _item.Value);
                }
                _query = _query.Where(predicate);
            }

          
            if (Filters.Where(x => x.Key.Equals("contactID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<ContactTeam>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("contactID", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(x => x.Members.Where(a =>a.ContactID == isNumeric).Any());
                }
                _query = _query.Include(x => x.Members).Where(predicate);
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

        return _query
                      .OrderBy(x => x.Title);

    }

}