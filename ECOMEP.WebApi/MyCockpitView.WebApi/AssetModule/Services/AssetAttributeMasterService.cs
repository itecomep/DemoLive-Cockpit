using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.AssetModule.Entities;
using MyCockpitView.WebApi.AuthModule.Dtos;
using MyCockpitView.WebApi.AuthModule.Entities;
using MyCockpitView.WebApi.AuthModule.Services;

//using MyCockpitView.WebApi.DTO;
using MyCockpitView.WebApi.Exceptions;
//using MyCockpitView.WebApi.Filters;
using MyCockpitView.WebApi.Services;
//using MyCockpitView.WebApi.Utilities;

namespace MyCockpitView.WebApi.AssetModule.Services
{

    public interface IAssetAttributeMasterService : IBaseEntityService<AssetAttributeMaster>
    {
        public Task<int> Create(AssetAttributeMaster Entity);
        public IQueryable<AssetAttributeMaster> Get(IEnumerable<QueryFilter> Filters = null, string Search = null, string Sort = null);

    }
    public class AssetAttributeMasterService : BaseEntityService<AssetAttributeMaster>, IAssetAttributeMasterService                                                          
    {
        private readonly string username;

        public AssetAttributeMasterService(EntitiesContext db) : base(db) { }

        public async Task<int> Create(AssetAttributeMaster Entity)
        {

            var lastOrderFlag = await Get().Where(x => x.Category == Entity.Category)
                .OrderByDescending(x => x.OrderFlag).Select(x => x.OrderFlag).FirstOrDefaultAsync();

            Entity.OrderFlag = lastOrderFlag != null ? lastOrderFlag + 1 : 0;

            return await base.Create(Entity);

        }

        public IQueryable<AssetAttributeMaster> Get(IEnumerable<QueryFilter> Filters = null, string Search = null, string Sort = null)
        {

            IQueryable<AssetAttributeMaster> _query = base.Get(Filters);

            //Apply filters
            if (Filters != null)
            {

                if (Filters.Where(x => x.Key.Equals("Category", StringComparison.OrdinalIgnoreCase)).Any())
                {
                    var predicate = PredicateBuilder.False<AssetAttributeMaster>();
                    foreach (var _item in Filters.Where(x => x.Key.Equals("Category", StringComparison.OrdinalIgnoreCase)))
                    {
                        predicate = predicate.Or(x => x.Category.Equals(_item.Value, StringComparison.OrdinalIgnoreCase));
                    }
                    _query = _query.Where(predicate);
                }
            }

            if (Search != null && Search != String.Empty)
            {
                _query = _query
                    .Where(x => x.Category.ToLower().Contains(Search.ToLower())
                    || x.Attribute.ToLower().Contains(Search.ToLower()));

            }

            return _query
              .OrderBy(x => x.Category).ThenBy(x => x.Attribute);

        }

    }

}