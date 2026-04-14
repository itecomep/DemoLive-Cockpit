

using MyCockpitView.WebApi.WFTaskModule.Entities;
using Microsoft.EntityFrameworkCore;

using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.TodoModule.Entities;
using System.Linq;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.WFTaskModule.Services
{
    public interface IAssessmentService : IBaseEntityService<Assessment>
    {
    }

    public class AssessmentService : BaseEntityService<Assessment>, IAssessmentService
    {
        public AssessmentService(EntitiesContext db) : base(db) { }
        public IQueryable<Assessment> Get(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null)
        {
            try
            {
                IQueryable<Assessment> _query = base.Get(Filters);
                //Apply filters
                if (Filters != null)
                {



                    if (Filters.Where(x => x.Key.Equals("entity", StringComparison.OrdinalIgnoreCase)).Any())
                    {
                        var predicate = PredicateBuilder.False<Assessment>();
                        foreach (var _item in Filters.Where(x => x.Key.Equals("entity", StringComparison.OrdinalIgnoreCase)))
                        {
                            predicate = predicate.Or(x => x.Entity != null && x.Entity.Equals(_item.Value, StringComparison.OrdinalIgnoreCase));
                        }
                        _query = _query.Where(predicate);
                    }

                    if (Filters.Where(x => x.Key.Equals("EntityID", StringComparison.OrdinalIgnoreCase)).Any())
                    {
                        var predicate = PredicateBuilder.False<Assessment>();
                        foreach (var _item in Filters.Where(x => x.Key.Equals("EntityID", StringComparison.OrdinalIgnoreCase)))
                        {
                            predicate = predicate.Or(x => x.EntityID != null && x.EntityID.ToString().Equals(_item.Value, StringComparison.OrdinalIgnoreCase));
                        }
                        _query = _query.Where(predicate);
                    }

                    if (Filters.Where(x => x.Key.Equals("ContactID", StringComparison.OrdinalIgnoreCase)).Any())
                    {
                        var predicate = PredicateBuilder.False<Assessment>();
                        foreach (var _item in Filters.Where(x => x.Key.Equals("ContactID", StringComparison.OrdinalIgnoreCase)))
                        {
                            var isNumeric = Convert.ToInt32(_item.Value);

                            predicate = predicate.Or(x => x.ContactID == isNumeric);
                        }
                        _query = _query.Where(predicate);
                    }

                    if (Filters.Where(x => x.Key.Equals("WftaskID", StringComparison.OrdinalIgnoreCase)).Any())
                    {
                        var predicate = PredicateBuilder.False<Assessment>();
                        foreach (var _item in Filters.Where(x => x.Key.Equals("WFtaskID", StringComparison.OrdinalIgnoreCase)))
                        {
                            var isNumeric = Convert.ToInt32(_item.Value);

                            predicate = predicate.Or(x => x.WFTaskID != null && x.WFTaskID == isNumeric);
                        }
                        _query = _query.Where(predicate);
                    }

                }
                if (Search != null && Search != string.Empty)
                {
                    var _key = Search.Trim();
                    _query = _query.Include(x => x.Contact).Where(x => x._searchTags.ToLower().Contains(_key)
                        || x.TaskTitle.ToLower().Contains(Search.ToLower())
                                            || x.Entity.ToLower().Contains(Search.ToLower())
                                            || x.EntityTitle.ToLower().Contains(Search.ToLower())
                                                   || (x.Contact.FirstName + " " + x.Contact.LastName).ToLower().Contains(Search.ToLower())
                               || x.Description.ToLower().Contains(_key.ToLower())
                            );
                    
                }

                if (Sort != null && Sort != string.Empty)
                {
                    switch (Sort.ToLower())
                    {
                        case "createddate":
                            return _query
                                    .OrderByDescending(x => x.Created);

                        case "modifieddate":
                            return _query
                                    .OrderByDescending(x => x.Modified);

                    }
                }

                return _query
                  .OrderByDescending(x => x.Created);
            }
            catch (Exception e)
            {
                throw;
            }
        }

        public async Task<Assessment> GetById(int Id)
        {
            try
            {
                return
                    await Get()
                    .Include(x => x.Contact)
                    .SingleOrDefaultAsync(x => x.ID == Id);

            }
            catch (Exception e)
            {
                throw;
            }
        }

        public async Task<int> Create(Assessment Entity)
        {
            try
            {

                var _exists = await Get()
                    .Where(x => x.WFTaskID == Entity.WFTaskID
                        && x.ContactID == Entity.ContactID
                        && x.Category == Entity.Category)
                    .SingleOrDefaultAsync();
                if (_exists != null)
                {
                    _exists.Points = Entity.Points;
                    _exists.ScoredPoints=Entity.ScoredPoints;
                    db.Entry(_exists).State=EntityState.Modified;
                    await db.SaveChangesAsync();
                    return _exists.ID;
                }
                db.Assessments.Add(Entity);
                await db.SaveChangesAsync();

                return Entity.ID;
            }
            catch (Exception e)
            {
                throw;
            }
        }


        public async Task<bool> Delete(int Id)
        {
            try
            {
                var _entity = await Get()
                     .SingleOrDefaultAsync(i => i.ID == Id);
                if (_entity == null)
                {
                    return false;
                }

                if (_entity.WFTaskID != null)
                {

                    var wfTask = await db.WFTasks.AsNoTracking()
                    .Include(x => x.Assessments)
                        .Where(x => x.ID == _entity.WFTaskID)
                        .SingleOrDefaultAsync();
                    if (wfTask != null)
                    {

                        wfTask.AssessmentPoints = wfTask.Assessments.Where(x => x.ID != Id).Any() ? wfTask.Assessments.Where(x => x.ID != Id).Select(x => x.ScoredPoints).Sum() : 0;

                        wfTask.MHrAssessed = Math.Round(wfTask.IsAssessmentRequired ? wfTask.IsPreAssignedTimeTask ?
                                                wfTask.MHrAssigned * wfTask.AssessmentPoints / 10.0m :
                                                wfTask.MHrConsumed * wfTask.AssessmentPoints / 10.0m :
                                                wfTask.MHrConsumed, 2);


                        wfTask.VHrAssessed = Math.Round(wfTask.MHrAssessed * wfTask.ManValue, 2);
                        wfTask.VHrAssessedCost = Math.Round(wfTask.VHrAssessed * wfTask.VHrRate, 2);

                        db.Entry(wfTask).State = EntityState.Modified;
                    }
                }
                db.Entry(_entity).State = EntityState.Deleted;
                await db.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                throw;
            }
        }

    }
}