
using System.Data;
using System.Linq;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Entities;
using MyCockpitView.WebApi.ImageLibraryModule.Entities;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.ImageLibraryModule.Services;

public interface IImageLibraryEntityService : IBaseAttachmentService<ImageLibraryEntity>
{
}

public class ImageLibraryEntityService : BaseAttachmentService<ImageLibraryEntity>, IImageLibraryEntityService
{
    public ImageLibraryEntityService(EntitiesContext db) : base(db)
    {
    }

    public IQueryable<ImageLibraryEntity> Get(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null)
    {

        IQueryable<ImageLibraryEntity> _query = base.Get(Filters, Search, Sort);


        //Apply filters
        if (Filters != null)
        {


            if (Filters.Where(x => x.Key.Equals("Category", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<ImageLibraryEntity>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("Category", StringComparison.OrdinalIgnoreCase)))
                {
                    predicate = predicate.Or(x => x.Category.Contains(_item.Value));
                }
                _query = _query.Where(predicate);
            }
        }

        if (Search != null && Search != string.Empty)
        {
            var _key = Search.Trim();
            _query = _query.Where(x => x.Category.ToLower().Contains(_key)
                            || x._searchTags.ToLower().Contains(_key)
                    );
            
        }

        return _query.OrderByDescending(x => x.Created);

    }

}
