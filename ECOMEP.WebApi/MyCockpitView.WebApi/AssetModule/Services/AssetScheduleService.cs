using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.AssetModule.Entities;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.AssetModule.Services
{
    public interface IAssetScheduleService : IBaseEntityService<AssetSchedule>
    {
        // Corrected: Return type should be IQueryable<AssetSchedule>, not IQueryable<Asset>
        public IQueryable<AssetSchedule> Get(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null);
    }

    public class AssetScheduleService : BaseEntityService<AssetSchedule>, IAssetScheduleService
    {
        private readonly string? username;

        public AssetScheduleService(EntitiesContext db) : base(db) { }

        public IQueryable<AssetSchedule> Get(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null)
        {
            IQueryable<AssetSchedule> query = base.Get(Filters);

            // Apply filters
            if (Filters != null)
            {
                if (Filters.Any(x => x.Key.Equals("deleted", StringComparison.OrdinalIgnoreCase)))
                {
                    query = db.AssetSchedules
                            .AsNoTracking()
                            .Where(x => !x.IsDeleted);
                }

                if (Filters.Any(x => x.Key.Equals("category", StringComparison.OrdinalIgnoreCase)))
                {
                    var predicate = PredicateBuilder.False<AssetSchedule>();
                    foreach (var item in Filters.Where(x => x.Key.Equals("category", StringComparison.OrdinalIgnoreCase)))
                    {
                        predicate = predicate.Or(x => x.Category.Contains(item.Value));
                    }
                    query = query.Where(predicate);
                }
            }

            // Apply search
            if (!string.IsNullOrWhiteSpace(Search))
            {
                var key = Search.Trim().ToLower();
                query = query.Include(x => x.Asset)
                             .Where(x => x.Title.ToLower().Contains(key)
                                      || x.Description.ToLower().Contains(key)
                                      || x.CreatedBy.ToLower().Contains(key)
                                      || x.ModifiedBy.ToLower().Contains(key)
                                      || x.ResolutionMessage.ToLower().Contains(key)
                                      || x.Components.Any(a => a.Component.ToLower().Contains(key))
                                      || (x.Asset != null && x.Asset.Title.ToLower().Contains(key))
                                      || (x.Asset != null && x.Asset.Subtitle.ToLower().Contains(key))
                                      || (x.Asset != null && x.Asset.Code.ToLower().Contains(key)));
            }

            // Apply sorting
            if (!string.IsNullOrWhiteSpace(Sort))
            {
                query = Sort.ToLower() switch
                {
                    "createddate" => query.OrderBy(x => x.Created),
                    "modifieddate" => query.OrderBy(x => x.Modified),
                    "createddate desc" => query.OrderByDescending(x => x.Created),
                    "modifieddate desc" => query.OrderByDescending(x => x.Modified),
                    _ => query.OrderByDescending(x => x.NextScheduleDate)
                };

                return query;
            }

            return query.OrderByDescending(x => x.NextScheduleDate);
        }
    }
}