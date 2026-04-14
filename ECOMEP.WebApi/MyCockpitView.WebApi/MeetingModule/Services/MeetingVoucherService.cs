using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.MeetingModule.Entities;
using MyCockpitView.WebApi.WFTaskModule.Entities;
using System.Text.RegularExpressions;
using MyCockpitView.WebApi.Services;
using MyCockpitView.WebApi.Exceptions;

namespace MyCockpitView.WebApi.MeetingModule.Services
{
    public interface IMeetingVoucherService : IBaseEntityService<MeetingVoucher>
    {
    }

    public class MeetingVoucherService : BaseEntityService<MeetingVoucher>, IMeetingVoucherService
    {


        public MeetingVoucherService(EntitiesContext db) : base(db)
        {
        }

        public IQueryable<MeetingVoucher> Get(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null)
        {

            IQueryable<MeetingVoucher> _query = base.Get(Filters);

            //Apply filter0

            if (Filters != null)
            {


                if (Filters.Where(x => x.Key.Equals("MeetingID", StringComparison.OrdinalIgnoreCase)).Any())
                {
                    var predicate = PredicateBuilder.False<MeetingVoucher>();
                    foreach (var _item in Filters.Where(x => x.Key.Equals("MeetingID", StringComparison.OrdinalIgnoreCase)))
                    {
                        var isNumeric = Convert.ToInt32(_item.Value);

                        predicate = predicate.Or(x => x.MeetingID == isNumeric);
                    }
                    _query = _query.Where(predicate);
                }

            }

            if (Search != null && Search != string.Empty)
            {
                var _key = Search.Trim();
                _query = _query.Where(x => x._searchTags.ToLower().Contains(_key)
                        || x.Particulars.ToLower().Contains(_key)
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

        public async Task Update(MeetingVoucher Entity)
        {
            await base.Update(Entity);
        }

        public async Task<MeetingVoucher> GetById(int Id)
        {
            var query = await Get()
              .Include(x => x.Attachments)
              .SingleOrDefaultAsync(i => i.ID == Id);

            return query;

        }

    }
}