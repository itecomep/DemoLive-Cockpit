using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.AssetModule.Entities;
using MyCockpitView.WebApi.AuthModule.Dtos;
using MyCockpitView.WebApi.AuthModule.Entities;
using MyCockpitView.WebApi.AuthModule.Services;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.AssetModule.Services
{
    public interface IAssetAttributeService : IBaseEntityService<AssetAttribute>
    {
        IQueryable<AssetAttribute> Get(
            IEnumerable<QueryFilter>? filters = null,
            string? search = null,
            string? sort = null);

        Task<int> Create(AssetAttribute entity);
    }

    public class AssetAttributeService : BaseEntityService<AssetAttribute>, IAssetAttributeService
    {
        private readonly string? _username;

        public AssetAttributeService(EntitiesContext db) : base(db)
        {
        }

        public IQueryable<AssetAttribute> Get(
            IEnumerable<QueryFilter>? filters = null,
            string? search = null,
            string? sort = null)
        {
            IQueryable<AssetAttribute> query = base.Get(filters);

            // Apply filters
            if (filters != null)
            {
                var categoryFilters = filters
                    .Where(x => x.Key.Equals("Category", StringComparison.OrdinalIgnoreCase))
                    .ToList();

                if (categoryFilters.Any())
                {
                    var predicate = PredicateBuilder.False<AssetAttribute>();

                    foreach (var item in categoryFilters)
                    {
                        predicate = predicate.Or(x =>
                            x.Asset.Category.Equals(item.Value, StringComparison.OrdinalIgnoreCase));
                    }

                    //query = query.Include(x => x.Asset).Where(predicate);
                }
            }

            // Apply search
            if (!string.IsNullOrWhiteSpace(search))
            {
                var searchLower = search.ToLower();
                query = query.Where(x => x.AttributeKey.ToLower().Contains(searchLower));
            }

            // Apply default ordering
            return query.OrderBy(x => x.AttributeKey);
        }

        public async Task<int> Create(AssetAttribute entity)
        {
            var lastOrderFlag = await Get()
                .Where(x => x.AssetID == entity.AssetID)
                .OrderByDescending(x => x.OrderFlag)
                .Select(x => (int?)x.OrderFlag)
                .FirstOrDefaultAsync();

            entity.OrderFlag = lastOrderFlag.HasValue ? lastOrderFlag.Value + 1 : 0;

            return await base.Create(entity);
        }
    }
}