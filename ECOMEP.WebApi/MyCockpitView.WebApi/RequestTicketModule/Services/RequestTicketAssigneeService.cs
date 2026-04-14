using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;

using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.RequestTicketModule.Entities;
using System.Text.RegularExpressions;
using MyCockpitView.WebApi.Services;
using MyCockpitView.WebApi.Exceptions;

namespace MyCockpitView.WebApi.RequestTicketModule.Services
{
    public interface IRequestTicketAssigneeService : IBaseEntityService<RequestTicketAssignee>
    {
    }

    public class RequestTicketAssigneeService : BaseEntityService<RequestTicketAssignee>, IRequestTicketAssigneeService
    {
        public RequestTicketAssigneeService(EntitiesContext db) : base(db)
        {
        }

        public IQueryable<RequestTicketAssignee> Get(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null)
        {

            IQueryable<RequestTicketAssignee> _query = base.Get(Filters);

            //Apply filter0

            if (Filters != null)
            {


                if (Filters.Where(x => x.Key.Equals("RequestTicketID", StringComparison.OrdinalIgnoreCase)).Any())
                {
                    var predicate = PredicateBuilder.False<RequestTicketAssignee>();
                    foreach (var _item in Filters.Where(x => x.Key.Equals("RequestTicketID", StringComparison.OrdinalIgnoreCase)))
                    {
                        var isNumeric = Convert.ToInt32(_item.Value);

                        predicate = predicate.Or(x => x.RequestTicketID == isNumeric);
                    }
                    _query = _query.Where(predicate);
                }

            }

            if (Search != null && Search != string.Empty)
            {
                var _key = Search.Trim();
                _query = _query.Where(x => x._searchTags.ToLower().Contains(_key)
                    || x.Name.ToLower().Contains(_key)
                           || x.Email.ToLower().Contains(_key)
                                  || x.Company.ToLower().Contains(_key)
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
                          .OrderByDescending(x => x.Created);


        }

        public async Task<int> Create(RequestTicketAssignee Entity)
        {

            Regex regex = new Regex(McvConstant.EMAIL_REGEX, RegexOptions.None);
            if (Entity.Email == null || !regex.IsMatch(Entity.Email))
                throw new EntityServiceException("Email Id is invalid.");

          return await base.Create(Entity);


        }

    }
}