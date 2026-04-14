using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Entities;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.ProjectModule.Services;

public interface IProjectTeamService : IBaseEntityService<ProjectTeam>
{
}

public class ProjectTeamService : BaseEntityService<ProjectTeam>, IProjectTeamService
{
    private readonly ISharedService sharedService;

    public ProjectTeamService(EntitiesContext db,ISharedService sharedService) : base(db)
    {
        this.sharedService = sharedService;
    }

    public IQueryable<ProjectTeam> Get(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null)
    {
      
            IQueryable<ProjectTeam> _query = base.Get(Filters);

            //Apply filters
            if (Filters != null)
            {

                if (Filters.Where(x => x.Key.Equals("ProjectID", StringComparison.OrdinalIgnoreCase)).Any())
                {
                    var predicate = PredicateBuilder.False<ProjectTeam>();
                    foreach (var _item in Filters.Where(x => x.Key.Equals("ProjectID", StringComparison.OrdinalIgnoreCase)))
                    {
                        var isNumeric = Convert.ToInt32(_item.Value);

                        predicate = predicate.Or(x => x.ProjectID == isNumeric);
                    }
                    _query = _query.Where(predicate);
                }

            }


            

            return _query.OrderBy(x=>x.Created);

    }

    public async Task<ProjectTeam?> GetById(int Id)
    {
       
          return await Get()
                .Include(x => x.ContactTeam)
                    .ThenInclude(x => x.Members)
                    .ThenInclude(x=>x.Contact)
                 .SingleOrDefaultAsync(i => i.ID == Id);
    }

   

}