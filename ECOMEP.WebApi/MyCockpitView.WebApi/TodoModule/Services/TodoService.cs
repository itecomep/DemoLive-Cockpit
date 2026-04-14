using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.ActivityModule;
using MyCockpitView.WebApi.Entities;
using MyCockpitView.WebApi.ProjectModule.Services;
using MyCockpitView.WebApi.Services;
using MyCockpitView.WebApi.TodoModule.Dtos;
using MyCockpitView.WebApi.TodoModule.Entities;
using MyCockpitView.WebApi.WFTaskModule.Services;
using System;

namespace MyCockpitView.WebApi.TodoModule.Services;

public interface ITodoService : IBaseEntityService<Todo>
{
    Task<IEnumerable<TodoAnalysisDto>> GetAnalysis(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null);

}

public class TodoService : BaseEntityService<Todo>, ITodoService
{

    public TodoService(EntitiesContext db) : base(db)
    {
    }

    public IQueryable<Todo> Get(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null)
    {

        IQueryable<Todo> _query = base.Get(Filters);

        //Apply filters
        if (Filters != null)
        {

            if (Filters.Where(x => x.Key.Equals("assignerContactID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<Todo>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("assignerContactID", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(x => x.AssignerContactID == isNumeric);
                }
                _query = _query.Where(predicate);
            }
            if (Filters.Where(x => x.Key.Equals("assigneeContactID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<Todo>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("assigneeContactID", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(x => x.AssigneeContactID == isNumeric);
                }
                _query = _query.Where(predicate);
            }


            if (Filters.Where(x => x.Key.Equals("projectid", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<Todo>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("projectid", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(x => x.ProjectID != null && x.ProjectID == isNumeric);
                }
                _query = _query.Where(predicate);
            }

            if (Filters.Where(x => x.Key.Equals("parentID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<Todo>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("parentID", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(x => x.ParentID != null && x.ParentID == isNumeric);
                }
                _query = _query.Where(predicate);
            }

            if (Filters.Where(x => x.Key.Equals("rangestart", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _item = Filters.First(x => x.Key.Equals("rangestart", StringComparison.OrdinalIgnoreCase));

                DateTime result = Convert.ToDateTime(_item.Value);
                _query = _query.Where(x => x.DueDate >= result);
            }

            if (Filters.Where(x => x.Key.Equals("rangeend", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _item = Filters.First(x => x.Key.Equals("rangeend", StringComparison.OrdinalIgnoreCase));

                DateTime result = Convert.ToDateTime(_item.Value);
                var end = result.AddDays(1);
                _query = _query.Where(x => x.DueDate < end);

            }

            //_query = _query.Include(x => x.Assignee).ThenInclude(x => x.TeamMemberships)
            //  .Include(x => x.Assigner).ThenInclude(x => x.TeamMemberships);

            if (Filters.Where(x => x.Key.Equals("TeamID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var teamIds = Filters
                    .Where(f => f.Key.Equals("TeamID", StringComparison.OrdinalIgnoreCase))
                    .Select(f => Convert.ToInt32(f.Value))
                    .ToList();

                _query = _query
                .Where(x =>
                    (x.Assignee != null &&
                     x.Assignee.TeamMemberships.Any(tm => teamIds.Contains(tm.ContactTeamID))) ||
                    (x.Assigner != null &&
                     x.Assigner.TeamMemberships.Any(tm => teamIds.Contains(tm.ContactTeamID)))
                 );
            }
        }
        if (Search != null && Search != string.Empty)
        {
            var _key = Search.Trim();
            _query = _query.Include(x => x.Assignee).Include(x=>x.Assigner)
                .Where(x => x._searchTags.ToLower().Contains(_key)
                    || x.Title.ToLower().Contains(_key.ToLower())
                     || x.SubTitle.ToLower().Contains(_key.ToLower())
                                                || (x.Assignee.FirstName + " " + x.Assignee.LastName).ToLower().Contains(_key.ToLower())
                                                 || (x.Assigner.FirstName + " " + x.Assigner.LastName).ToLower().Contains(_key.ToLower())
                           || x.Description.ToLower().Contains(_key.ToLower())
                        );

        }


        if (Sort != null && Sort != String.Empty)
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

                case "duedate":
                    return _query
                            .OrderBy(x => x.DueDate);

                case "duedate desc":
                    return _query
                            .OrderByDescending(x => x.DueDate);
            }
        }

        return _query.OrderBy(x => x.DueDate);

    }


    public async Task<Todo> GetById(int Id)
    {

        var query = await Get()
          .Include(x => x.Assignee)
                    .Include(x => x.Assigner)
                    .Include(x => x.Agendas)
                    .Include(x => x.Attachments)
             .SingleOrDefaultAsync(i => i.ID == Id);

        return query;

    }

    public async Task<int> Create(Todo Entity)
    {

        if (Entity.ProjectID != null)
        {
            var _project = await db.Projects.AsNoTracking().SingleOrDefaultAsync(x => x.ID == Entity.ProjectID);
            if (_project != null)
            {
                Entity.Title = _project.Code + "-" + _project.Title;
            }
        }

        Entity.StartDate = DateTime.UtcNow;
        return await base.Create(Entity);

    }

    public async Task<IEnumerable<TodoAnalysisDto>> GetAnalysis(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null)
    {
        var _todos =await Get(Filters).
            Include(x => x.Agendas).
            Include(x => x.Assigner).
            Include(x => x.Assignee)
            .Select(x => new
            {
                x.ID,
                x.Title,
                x.StartDate,
                x.StatusFlag,
                x.ProjectID,
                x.DueDate,
                x.Modified,
                x.Assignee,
                x.Assigner,
                x.AssigneeContactID,
                x.AssignerContactID,
                x.MHrAssigned,
                x.Priority,
                Agendas = x.Agendas.Select(a=> new
                {
                    a.ID,
                    a.OrderFlag,
                    a.StatusFlag,
                    a.Title
                })
            })
            .ToListAsync();

        var _filteredTodoIDs=_todos.Select(x=>x.ID).ToList();

        var _filteredProjectIDs= _todos.Where(x=>x.ProjectID!=null).Select(x=>x.ProjectID)
            .Distinct()
            .ToList();

        var _wfTask = await db.WFTasks.AsNoTracking()
                .Where(x => x.Entity == nameof(Todo)
                && x.EntityID != null
                && _filteredTodoIDs.Contains(x.EntityID.Value))
            .ToListAsync();

        var _projects = await db.Projects.AsNoTracking().
            Include(x => x.Teams).ThenInclude(x=>x.ContactTeam)
            .Where(x=> _filteredProjectIDs.Contains(x.ID))
            .ToListAsync();

        var _activities = await db.Activities.AsNoTracking()
            .Include(x => x.Attachments)
            .Where(x => x.Entity == nameof(Todo)
                && x.EntityID != null
                && _filteredTodoIDs.Contains(x.EntityID.Value))
            .ToListAsync();

        var _query = _todos.Select(x => new TodoAnalysisDto
        {
            StartDate = x.StartDate,
            DueDate = x.DueDate,
            CompletedDate = x.StatusFlag == McvConstant.TODO_STATUSFLAG_COMPLETED ? (DateTime?)x.Modified : null,
            Assignee = x.Assignee,
            Assigner = x.Assigner,
            AssigneeName = x.Assignee.Name,
            AssignerName = x.Assigner.Name,
            AssigneeContactID = x.AssigneeContactID,
            AssignerContactID = x.AssignerContactID,
            MHrAssigned = x.MHrAssigned,
            MHrConsumed = _wfTask.Where(y => y.EntityID == x.ID && y.WFStageCode == McvConstant.TODO_WORK_STAGE).Sum(z => (decimal?)z.MHrConsumed) ?? 0,
            Priority = x.Priority,
            Title = x.Title,
            StatusFlag = x.StatusFlag,
            StatusValue = x.StatusFlag == McvConstant.TODO_STATUSFLAG_COMPLETED ? "COMPLETED" : "ACTIVE",
            Revision = _wfTask.Where(y => y.EntityID == x.ID && y.WFStageCode == McvConstant.TODO_WORK_STAGE).Count(),
            Activity = _activities
                .Where(a => a.EntityID == x.ID)
                .OrderByDescending(a => a.Created)
                .Select(a => new TodoAnalysisActivity
                {
                    Action = a.Action,
                    ContactName = a.ContactName,
                    ContactPhotoUrl = a.ContactPhotoUrl,
                    EntityTitle = a.EntityTitle,
                    Status = a.Status,
                    Comments = a.Comments,
                    Created = a.Created,
                    StatusFlag = a.StatusFlag,
                    Attachments = a.Attachments.Select(b => new TodoAnalysisActvityAttachment
                    {
                        Filename = b.Filename,
                        ContentType = b.ContentType,
                        Url = b.Url,
                        Size = b.Size,
                        ThumbUrl = b.ThumbUrl
                    }).ToList()
                })
                .ToList(),
            Agendas = x.Agendas.Select(a=> new TodoAnalysisAgenda
            {
                Title=a.Title,
                OrderFlag=a.OrderFlag,
                StatusFlag=a.StatusFlag
            }).ToList(),
            CompletedAgendas = x.Agendas.Where(a => a.StatusFlag == 1).Select(a => new TodoAnalysisAgenda
            {
                Title = a.Title,
                OrderFlag = a.OrderFlag,
                StatusFlag = a.StatusFlag
            }).ToList(),
            PendingAgendas = x.Agendas.Where(a => a.StatusFlag == 0).Select(a => new TodoAnalysisAgenda
            {
                Title = a.Title,
                OrderFlag = a.OrderFlag,
                StatusFlag = a.StatusFlag
            }).ToList(),

            Teams = x.ProjectID != null
                      ? _projects.Where(p => p.ID == x.ProjectID && p.Teams.Any())
                                .SelectMany(p => p.Teams.Select(t=> new TodoAnalysisTeam
                                {
                                   ID= t.ContactTeamID,
                                   Title= t.ContactTeam.Title
                                }))
                      .ToList()
                      : new List<TodoAnalysisTeam>()
        });


            if (Sort != null && Sort != String.Empty)
        {
            switch (Sort.ToLower())
            {
                case "duedate":
                    return _query
                            .OrderBy(x => x.DueDate);

                case "duedate desc":
                    return _query
                            .OrderByDescending(x => x.DueDate);
            }
        }

        return _query.ToList();
    }
}