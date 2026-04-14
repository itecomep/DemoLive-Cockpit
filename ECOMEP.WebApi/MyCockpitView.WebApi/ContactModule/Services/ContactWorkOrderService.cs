using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.AzureBlobsModule;
using MyCockpitView.WebApi.Entities;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.ContactModule.Services;

public interface IContactWorkOrderService : IBaseEntityService<ContactWorkOrder>
{
}

public class ContactWorkOrderService : BaseEntityService<ContactWorkOrder>, IContactWorkOrderService
{
    private readonly IAzureBlobService azureBlobService;

    public ContactWorkOrderService(EntitiesContext db, IAzureBlobService azureBlobService) : base(db)
    {
        this.azureBlobService = azureBlobService;
    }

    public IQueryable<ContactWorkOrder> Get(IEnumerable<QueryFilter> Filters = null, string Search = null, string Sort = null)
    {

        IQueryable<ContactWorkOrder> _query = base.Get(Filters);
        //Apply filters
        if (Filters != null)
        {


            if (Filters.Where(x => x.Key.Equals("contactid", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<ContactWorkOrder>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("contactid", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = int.TryParse(_item.Value, out int n);
                    if (isNumeric)
                        predicate = predicate.Or(x => x.ContactID == n);
                }
                _query = _query.Where(predicate);
            }
            if (Filters.Where(x => x.Key.Equals("WorkOrderDate", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _item = Filters.Where(x => x.Key.Equals("WorkOrderDate", StringComparison.OrdinalIgnoreCase)).First();

                var isDateTime = DateTime.TryParse(_item.Value, out DateTime n);
                if (isDateTime)
                    _query = _query.Where(x => x.WorkOrderDate.Date == n.Date);
            }

            if (Filters.Where(x => x.Key.Equals("rangestart", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _item = Filters.First(x => x.Key.Equals("rangestart", StringComparison.OrdinalIgnoreCase));

                var isDateTime = DateTime.TryParse(_item.Value, out DateTime result);
                if (isDateTime)
                    _query = _query.Where(x => x.WorkOrderDate >= result);
            }

            if (Filters.Where(x => x.Key.Equals("rangeend", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _item = Filters.First(x => x.Key.Equals("rangeend", StringComparison.OrdinalIgnoreCase));

                var isDateTime = DateTime.TryParse(_item.Value, out DateTime result);

                if (isDateTime)
                {
                    var end = result.AddDays(1);
                    _query = _query.Where(x => x.WorkOrderDate < end);
                }
            }
        }

        if (Search != null && Search != string.Empty)
        {
            var _keyword = Search.Trim();

            _query = _query
          .Where(x => x.WorkOrderNo.ToLower().Contains(_keyword.ToLower()));
        }

        if (Sort != null && Sort != string.Empty)
        {
            switch (Sort.ToLower())
            {
                case "createddate":
                    return _query
                            .OrderBy(x => x.Created);

                case "modifieddate":
                    return _query
                            .OrderBy(x => x.Modified);

                case "createddate desc":
                    return _query
                            .OrderByDescending(x => x.Created);

                case "modifieddate desc":
                    return _query
                            .OrderByDescending(x => x.Modified);

                case "workorderdate":
                    return _query
                            .OrderBy(x => x.WorkOrderDate);

                case "workorderdate desc":
                    return _query
                            .OrderByDescending(x => x.WorkOrderDate);

            }
        }
        return _query
          .OrderByDescending(x => x.WorkOrderDate);
    }
}