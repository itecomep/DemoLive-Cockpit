using MyCockpitView.WebApi.TodoModule.Entities;

using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.TodoModule.Services
{
    public interface ITodoAgendaService : IBaseEntityService<TodoAgenda>
    {
    }
    public class TodoAgendaService : BaseEntityService<TodoAgenda>, ITodoAgendaService
    {
        public TodoAgendaService(EntitiesContext db) : base(db) { }

        public IQueryable<TodoAgenda> Get(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null)
        {
            try
            {
                IQueryable<TodoAgenda> _query = base.Get(Filters);

                //Apply filters
                if (Filters != null)
                {


                    if (Filters.Where(x => x.Key.Equals("TodoID", StringComparison.OrdinalIgnoreCase)).Any())
                    {
                        var predicate = PredicateBuilder.False<TodoAgenda>();
                        foreach (var _item in Filters.Where(x => x.Key.Equals("TodoID", StringComparison.OrdinalIgnoreCase)))
                        {
                            var isNumeric = Convert.ToInt32(_item.Value);

                            predicate = predicate.Or(x => x.TodoID == isNumeric);
                        }
                        _query = _query.Where(predicate);
                    }

                }

                if (Search != null && Search != string.Empty)
                {
                    var _key = Search.Trim();
                    _query = _query.Where(x => x._searchTags.ToLower().Contains(_key)
                        || x.Title.ToLower().Contains(_key.ToLower())
                               || x.Description.ToLower().Contains(_key.ToLower())
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
                              .OrderBy(x => x.Created);

            }
            catch (Exception e)
            {
                throw;
            }
        }
    }
}