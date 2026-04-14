
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;


using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.AppSettingMasterModule;

public interface IAppSettingMasterService : IBaseEntityService<AppSettingMaster>
{
    Task<string> GetPresetValue(string presetKey);
}

public class AppSettingMasterService : BaseEntityService<AppSettingMaster>, IAppSettingMasterService
{

    public AppSettingMasterService(EntitiesContext db) : base(db) { }

    public IQueryable<AppSettingMaster> Get(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null)
    {
      
            IQueryable<AppSettingMaster> _query = base.Get(Filters);

            //Apply filters
            //Apply filters
            if (Filters != null)
            {
                if (Filters.Where(x => x.Key.Equals("PresetKey", StringComparison.OrdinalIgnoreCase)).Any())
                {
                    var predicate = PredicateBuilder.False<AppSettingMaster>();
                    foreach (var _item in Filters.Where(x => x.Key.Equals("PresetKey", StringComparison.OrdinalIgnoreCase)))
                    {
                        predicate = predicate.Or(x => x.PresetKey != null && x.PresetKey==_item.Value);
                    }
                    _query = _query.Where(predicate);
                }

            }

        
        if (Search != null && Search != string.Empty)
        {
            var _key = Search.Trim();

            _query = _query.Where(x => x.PresetKey.ToLower().Contains(_key.ToLower()));
            
        }

        return _query.OrderBy(x => x.PresetKey);
        
    }

    public async Task<string> GetPresetValue(string presetKey)
    {
       
            var _query = await db.AppSettingMasters
                .AsNoTracking()
                .Where(x => x.PresetKey == presetKey)
                .SingleOrDefaultAsync();

            if (_query == null) throw new Exception(presetKey + " not found in AppSettings!");

            return _query.PresetValue!=null?_query.PresetValue.Trim():string.Empty;
       
    }

}