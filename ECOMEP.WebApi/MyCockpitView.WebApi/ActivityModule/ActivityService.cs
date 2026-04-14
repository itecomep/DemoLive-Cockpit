
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.ActivityModule.Entities;
using MyCockpitView.WebApi.ContactModule.Entities;

using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.ActivityModule;

public interface IActivityService : IBaseEntityService<Activity>
{

    Task LogUserActivity(Contact contact,
                                      string entity,
                                      int entityID,
                                      string entityTitle,
                                      string action,
                                      string status = "Created",
                                      string comments = "",
                                      int? wfTaskID = null,
                                       IEnumerable<ActivityAttachment>? attachments = null

        );
}

public class ActivityService : BaseEntityService<Activity>, IActivityService
{

    public ActivityService(EntitiesContext db) : base(db)
    {

    }

    public IQueryable<Activity> Get(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null)
    {
        IQueryable<Activity> _query = base.Get(Filters);

        //Apply filters
        if (Filters != null)
        {
            if (Filters.Where(x => x.Key.Equals("ContactID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<Activity>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("ContactID", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(x => x.ContactID == isNumeric);
                }
                _query = _query.Where(predicate);
            }

            if (Filters.Where(x => x.Key.Equals("entity", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<Activity>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("entity", StringComparison.OrdinalIgnoreCase)))
                {
                    predicate = predicate.Or(x => x.Entity != null && x.Entity == _item.Value);
                }
                _query = _query.Where(predicate);
            }

            if (Filters.Where(x => x.Key.Equals("entityID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<Activity>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("entityID", StringComparison.OrdinalIgnoreCase)))
                {
                    predicate = predicate.Or(x => x.EntityID != null && x.EntityID.ToString() == _item.Value);
                }
                _query = _query.Where(predicate);
            }
        }


        if (Search != null && Search != string.Empty)
        {
            var _key = Search.Trim();
            _query = _query.Where(x => x.Entity.ToLower().Contains(_key)
                            || x.Action.Contains(_key)
                            || (x.ContactName).ToLower().Contains(_key.ToLower())
                            || x._searchTags.ToLower().Contains(_key)
                    );

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
            }
        }

        return _query.OrderByDescending(x => x.Created);

    }

    public async Task LogUserActivity(Contact contact,
                                      string entity,
                                      int entityID,
                                      string entityTitle,
                                      string action,
                                      string status = "Created",
                                      string comments = "",
                                      int? taskID = null,
                                       IEnumerable<ActivityAttachment>? attachments = null

        )
    {
        var _entity = new Activity
        {
            ContactID = contact.ID,
            ContactName = contact.Name,
            ContactPhotoUrl = contact.PhotoUrl,
            ContactUID = contact.UID,
            Entity = entity,
            EntityID = entityID,
            EntityTitle = entityTitle,
            Action = action,
            Status = status,
            Comments = comments,
            WFTaskID = taskID
        };

        if (attachments != null && attachments.Any())
        {
            _entity.Attachments = attachments.ToList();
        }

        await base.Create(_entity);

    }

}