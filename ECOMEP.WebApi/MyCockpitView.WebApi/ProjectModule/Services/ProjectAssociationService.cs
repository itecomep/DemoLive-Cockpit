using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;

using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.Entities;
using System.Linq;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.ProjectModule.Services
{
    public interface IProjectAssociationService : IBaseEntityService<ProjectAssociation>
    {
    }

    public class ProjectAssociationService : BaseEntityService<ProjectAssociation>, IProjectAssociationService
    {
        public ProjectAssociationService(EntitiesContext db) : base(db) { }

        public IQueryable<ProjectAssociation> Get(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null)
        {
            try
            {
                IQueryable<ProjectAssociation> _query = base.Get(Filters);

                //Apply filters
                if (Filters != null)
                {

                    if (Filters.Where(x => x.Key.Equals("ProjectID", StringComparison.OrdinalIgnoreCase)).Any())
                    {
                        var predicate = PredicateBuilder.False<ProjectAssociation>();
                        foreach (var _item in Filters.Where(x => x.Key.Equals("ProjectID", StringComparison.OrdinalIgnoreCase)))
                        {
                            var isNumeric = Convert.ToInt32(_item.Value);

                            predicate = predicate.Or(x => x.ProjectID == isNumeric);
                        }
                        _query = _query.Where(predicate);
                    }

                }
                if (Search != null && Search != string.Empty)
                {
                    var _key = Search.Trim();
                    _query = _query.Where(x => x._searchTags.ToLower().Contains(_key)
                        || x.Title.ToLower().Contains(_key)
                            );
                    
                }
              

                return _query;

            }
            catch (Exception e)
            {
                throw;
            }
        }

        public async Task<ProjectAssociation> GetById(int Id)
        {
            try
            {
                var query = await Get()
                    .Include(x => x.Contact)
                     .SingleOrDefaultAsync(i => i.ID == Id);


                return query;
            }
            catch (Exception e)
            {
                throw;
            }
        }
    }
}