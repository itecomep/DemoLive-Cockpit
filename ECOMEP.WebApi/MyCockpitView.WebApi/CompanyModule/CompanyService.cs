
using MyCockpitView.WebApi.AppSettingMasterModule;

using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.Services;
using MyCockpitView.CoreModule;

namespace MyCockpitView.WebApi.CompanyModule;

public interface ICompanyService : IBaseEntityService<Company>
{
}

public class CompanyService : BaseEntityService<Company>, ICompanyService
{

    public CompanyService(EntitiesContext db) : base(db)
    {
    }

    public IQueryable<Company> Get(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null)
    {
       
            IQueryable<Company> _query = base.Get(Filters);


        if (Search != null && Search != string.Empty)
        {
            var _key = Search.Trim();
            _query = _query.Where(x => x.Title.ToLower().Contains(_key.ToLower()));
            
        }

        return _query.OrderBy(x => x.Title);
       
    }

}