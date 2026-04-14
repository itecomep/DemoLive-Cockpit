using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Entities;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.ContactModule.Services;
public interface IContactWorkOrderAttachmentService : IBaseAttachmentService<ContactWorkOrderAttachment>
{
}

public class ContactWorkOrderAttachmentService : BaseAttachmentService<ContactWorkOrderAttachment>, IContactWorkOrderAttachmentService
{

    public ContactWorkOrderAttachmentService(EntitiesContext db) : base(db)
    {
    }

    public IQueryable<ContactWorkOrderAttachment> Get(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null)
    {

        IQueryable<ContactWorkOrderAttachment> _query = base.Get(Filters);

        //Apply filters
        if (Filters != null)
        {


            if (Filters.Where(x => x.Key.Equals("ContactID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<ContactWorkOrderAttachment>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("ContactID", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(x => x.ContactWorkOrderID == isNumeric);
                }
                _query = _query.Where(predicate);
            }

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
}