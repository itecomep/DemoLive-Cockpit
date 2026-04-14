

using MyCockpitView.WebApi.WFTaskModule.Entities;
using Microsoft.EntityFrameworkCore;

using MyCockpitView.WebApi.AppSettingMasterModule;

using MyCockpitView.Utility.Common;

using MyCockpitView.WebApi.Entities;
using MyCockpitView.WebApi.TodoModule.Entities;
using System.Linq;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Services;
using MyCockpitView.WebApi.Responses;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.WebApi.ContactModule.Services;
namespace MyCockpitView.WebApi.WFTaskModule.Services;

public interface ITimeEntryService : IBaseEntityService<TimeEntry>
{
    Task<int> Create(TimeEntry Entity, bool AllowOverlapp = false);
    Task EndTimeLog(int WFTaskID, bool IsPaused = false);
    Task StartTimeLog(TimeEntry Entity);
    Task Validate(TimeEntry Entity, bool isUpdate = false, bool allowOverlapp = false);
}

public class TimeEntryService : BaseEntityService<TimeEntry>, ITimeEntryService
{

    public TimeEntryService(EntitiesContext db) : base(db)
    {
    }

    public IQueryable<TimeEntry> Get(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null)
    {
        try
        {
            IQueryable<TimeEntry> _query = base.Get(Filters);

           
            //Apply filters
            if (Filters != null)
            {


                if (Filters.Where(x => x.Key.Equals("entity", StringComparison.OrdinalIgnoreCase)).Any())
                {
                    var predicate = PredicateBuilder.False<TimeEntry>();
                    foreach (var _item in Filters.Where(x => x.Key.Equals("entity", StringComparison.OrdinalIgnoreCase)))
                    {
                        predicate = predicate.Or(x => x.Entity != null && x.Entity.Equals(_item.Value, StringComparison.OrdinalIgnoreCase));
                    }
                    _query = _query.Where(predicate);
                }

                if (Filters.Where(x => x.Key.Equals("entityID", StringComparison.OrdinalIgnoreCase)).Any())
                {
                    var predicate = PredicateBuilder.False<TimeEntry>();
                    foreach (var _item in Filters.Where(x => x.Key.Equals("entityID", StringComparison.OrdinalIgnoreCase)))
                    {
                        predicate = predicate.Or(x => x.EntityID != null && x.EntityID.ToString().Equals(_item.Value, StringComparison.OrdinalIgnoreCase));
                    }
                    _query = _query.Where(predicate);
                }

                if (Filters.Where(x => x.Key.Equals("contactID", StringComparison.OrdinalIgnoreCase)).Any())
                {
                    var predicate = PredicateBuilder.False<TimeEntry>();
                    foreach (var _item in Filters.Where(x => x.Key.Equals("contactID", StringComparison.OrdinalIgnoreCase)))
                    {
                        var isNumeric = Convert.ToInt32(_item.Value);

                        predicate = predicate.Or(x => x.ContactID == isNumeric);
                    }
                    _query = _query.Where(predicate);
                }

                if (Filters.Where(x => x.Key.Equals("WftaskID", StringComparison.OrdinalIgnoreCase)).Any())
                {
                    var predicate = PredicateBuilder.False<TimeEntry>();
                    foreach (var _item in Filters.Where(x => x.Key.Equals("WFtaskID", StringComparison.OrdinalIgnoreCase)))
                    {
                        var isNumeric = Convert.ToInt32(_item.Value);

                        predicate = predicate.Or(x => x.WFTaskID != null && x.WFTaskID == isNumeric);
                    }
                    _query = _query.Where(predicate);
                }

                if (Filters.Where(x => x.Key.Equals("paused", StringComparison.OrdinalIgnoreCase)).Any())
                {
                    _query = _query.Where(x => x.IsPaused == true);
                }

                if (Filters.Where(x => x.Key.Equals("startDate", StringComparison.OrdinalIgnoreCase)).Any())
                {
                    var _item = Filters.Where(x => x.Key.Equals("startDate", StringComparison.OrdinalIgnoreCase)).First();

                    DateTime result = Convert.ToDateTime(_item.Value);
                    _query = _query.Where(x => x.StartDate != null
                                && x.StartDate.Date == result.Date);
                }
                if (Filters.Where(x => x.Key.Equals("endDate", StringComparison.OrdinalIgnoreCase)).Any())
                {
                    var _item = Filters.Where(x => x.Key.Equals("endDate", StringComparison.OrdinalIgnoreCase)).First();

                    DateTime result = Convert.ToDateTime(_item.Value);
                    _query = _query.Where(x => x.EndDate != null
                                && x.EndDate.Value.Date == result.Date);
                }

                if (Filters.Where(x => x.Key.Equals("rangestart", StringComparison.OrdinalIgnoreCase)).Any())
                {
                    var _item = Filters.First(x => x.Key.Equals("rangestart", StringComparison.OrdinalIgnoreCase));
                    DateTime result = Convert.ToDateTime(_item.Value);
                    _query = _query.Where(x => x.StartDate >= result || x.EndDate != null && x.EndDate >= result);
                }

                if (Filters.Where(x => x.Key.Equals("rangeend", StringComparison.OrdinalIgnoreCase)).Any())
                {
                    var _item = Filters.First(x => x.Key.Equals("rangeend", StringComparison.OrdinalIgnoreCase));

                    DateTime result = Convert.ToDateTime(_item.Value);
                    var end = result.AddDays(1);
                    _query = _query.Where(x => x.StartDate < end || x.EndDate != null && x.EndDate < end);

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
                var _orderedQuery = _query.OrderBy(l => 0);
                var keywords = Sort.Replace("asc", "").Split(',');

                foreach (var key in keywords)
                {
                    if (key.Trim().Equals("created", StringComparison.OrdinalIgnoreCase))
                        _orderedQuery = _orderedQuery
                                .ThenBy(x => x.Created);

                    else if (key.Trim().Equals("created desc", StringComparison.OrdinalIgnoreCase))
                        _orderedQuery = _orderedQuery
                                .ThenByDescending(x => x.Created);

                    else if (key.Trim().Equals("modified", StringComparison.OrdinalIgnoreCase))
                        _orderedQuery = _orderedQuery
                                .ThenBy(x => x.Modified);

                    else if (key.Trim().Equals("modified desc", StringComparison.OrdinalIgnoreCase))
                        _orderedQuery = _orderedQuery
                                .ThenByDescending(x => x.Modified);

                    else if (key.Trim().Equals("startdate", StringComparison.OrdinalIgnoreCase))
                        _orderedQuery = _orderedQuery
                                .ThenBy(x => x.StartDate);

                    else if (key.Trim().Equals("startdate desc", StringComparison.OrdinalIgnoreCase))
                        _orderedQuery = _orderedQuery
                                .ThenByDescending(x => x.StartDate);

                    else if (key.Trim().Equals("enddate", StringComparison.OrdinalIgnoreCase))
                        _orderedQuery = _orderedQuery
                                .ThenBy(x => x.EndDate);

                    else if (key.Trim().Equals("enddate desc", StringComparison.OrdinalIgnoreCase))
                        _orderedQuery = _orderedQuery
                                .ThenByDescending(x => x.EndDate);


                }

                return _orderedQuery;
            }

            return _query
              .OrderByDescending(x => x.StartDate);
        }
        catch (Exception e)
        {
            throw;
        }
    }

    public async Task<TimeEntry> GetById(int Id)
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



    public async Task<int> Create(TimeEntry Entity, bool AllowOverlapp = false)
    {
        try
        {
            if (Entity.StartDate > Entity.EndDate) throw new EntityServiceException("Inavlid time slot!");

            var appointmentService = new ContactAppointmentService(db);
            var _appointment = await appointmentService.GetLastAppointment(Entity.ContactID);
            if (_appointment != null)
            {
                Entity.ManValue = _appointment.ManValue;
                Entity.CompanyID = _appointment.CompanyID;
            }


            //try
            //{
            //    Entity.ValueHourRate = Convert.ToDecimal(await appSettingMasterService.GetPresetValue(McvConstant.COMPANY_VHR_COST));
            //}
            //catch (Exception e)
            //{
            //    Entity.ValueHourRate = 0;
            //}

            await Validate(Entity, false, AllowOverlapp);

            if (Entity.WFTaskID != null)
            {
              
                var _task = await db.WFTasks.AsNoTracking()
                   .Where(x => x.ID == Entity.WFTaskID)
                   .SingleOrDefaultAsync();

                if (_task != null)
                {
                    Entity.Entity = _task.Entity;
                    Entity.EntityID = _task.EntityID;
                    Entity.EntityTitle = _task.Subtitle;
                    Entity.TaskTitle = (_task.Title + " " + _task.Subtitle).Trim();
                }
                else
                {
                    Entity.TaskTitle = "MANUAL TIME LOG";
                }

            }

            if (Entity.EndDate != null)
            {
                Entity.StatusFlag = 1;
            }

            if (Entity.Entity.Equals(nameof(Project), StringComparison.OrdinalIgnoreCase))
            {
                Entity.ProjectID = Entity.EntityID;
            }

            //else if (Entity.Entity.Equals(nameof(Meeting), StringComparison.OrdinalIgnoreCase))
            //{
            //    var _meetingSerive = new MeetingService(_db);

            //        var _meeting = await _meetingSerive.Get().Where(x => x.ID == Entity.EntityID && x.ProjectID!=null).SingleOrDefaultAsync();
            //        if (_meeting != null) Entity.ProjectID = _meeting.ProjectID;

            //}



            Entity.StartDate = new DateTime(Entity.StartDate.Year, Entity.StartDate.Month, Entity.StartDate.Day, Entity.StartDate.Hour, Entity.StartDate.Minute, 0);

            if (Entity.EndDate != null)
                Entity.EndDate = new DateTime(Entity.EndDate.Value.Year, Entity.EndDate.Value.Month, Entity.EndDate.Value.Day, Entity.EndDate.Value.Hour, Entity.EndDate.Value.Minute, 0);

            Entity.ManHours = Convert.ToDecimal(Entity.EndDate != null && Entity.EndDate > Entity.StartDate ? (Entity.EndDate.Value - Entity.StartDate).TotalHours : 0);

            db.TimeEntries.Add(Entity);
            await db.SaveChangesAsync();

            return Entity.ID;
        }
        catch (Exception e)
        {
            throw;
        }
    }


    public async Task<bool> Update(TimeEntry Entity)
    {
        try
        {
            if (Entity.StartDate > Entity.EndDate) throw new EntityServiceException("Inavlid time slot!");
            await Validate(Entity, true, true);
            if (Entity.EndDate != null) Entity.StatusFlag = 1;

            Entity.StartDate = new DateTime(Entity.StartDate.Year, Entity.StartDate.Month, Entity.StartDate.Day, Entity.StartDate.Hour, Entity.StartDate.Minute, 0);

            if (Entity.EndDate != null)
                Entity.EndDate = new DateTime(Entity.EndDate.Value.Year, Entity.EndDate.Value.Month, Entity.EndDate.Value.Day, Entity.EndDate.Value.Hour, Entity.EndDate.Value.Minute, 0);

            Entity.ManHours = Convert.ToDecimal(Entity.EndDate != null && Entity.EndDate > Entity.StartDate ? (Entity.EndDate.Value - Entity.StartDate).TotalHours : 0);


            db.Entry(Entity).State = EntityState.Modified;

            await db.SaveChangesAsync();

            return true;
        }
        catch (Exception e)
        {
            throw;
        }
    }


    public async Task Validate(TimeEntry Entity, bool isUpdate = false, bool allowOverlapp = false)
    {
        try
        {
            if (Entity.StartDate > DateTime.UtcNow)
                throw new EntityServiceException("Time entry start is beyond current time " + ClockTools.GetISTNow().ToString("HH:mm") + "!");

            if (Entity.EndDate != null && Entity.EndDate > DateTime.UtcNow)
                throw new EntityServiceException("Time entry end is beyond current time " + ClockTools.GetISTNow().ToString("HH:mm") + "!");

            var _start = Entity.StartDate.AddSeconds(1);
            var _end = (Entity.EndDate != null ? Entity.EndDate.Value : DateTime.UtcNow).AddSeconds(-1);

            var _query = Get()
                        .Where(x => x.ContactID == Entity.ContactID);

            if (isUpdate)
                _query = _query.Where(x => x.ID != Entity.ID);

            TimeEntry _overlapp = null;

            _overlapp = await _query
                        .Where(x => x.StartDate == _start //equal_start
                         ).FirstOrDefaultAsync();
            if (_overlapp == null)
                _overlapp = await _query
                           .Where(x => x.EndDate == _end //equal_end

                           ).FirstOrDefaultAsync();

            if (_overlapp == null)
                _overlapp = await _query
                           .Where(x => x.StartDate < _start && x.EndDate > _end //inside

                            ).FirstOrDefaultAsync();

            if (_overlapp == null)
                _overlapp = await _query
                           .Where(x => x.StartDate > _start && x.EndDate < _end //outside

                             ).FirstOrDefaultAsync();

            if (_overlapp == null)
                _overlapp = await _query
                           .Where(x => x.StartDate < _start && x.EndDate > _start //start_overlapp

                          ).FirstOrDefaultAsync();

            if (_overlapp == null)
                _overlapp = await _query
                           .Where(x => x.StartDate > _start && x.StartDate < _end //end_overlapp
                           ).FirstOrDefaultAsync();


            if (_overlapp != null && !allowOverlapp)
            {
                var _existEnd = _overlapp.EndDate != null ? _overlapp.EndDate.Value : DateTime.UtcNow;

                throw new EntityServiceException("Time entry already exists! \n "
                    + _overlapp.TaskTitle + " " + ClockTools.GetIST(_overlapp.StartDate).ToString("dd MMM yyyy HH:mm")
                    + " - " + ClockTools.GetIST(_existEnd).ToString("HH:mm"));
            }
        }
        catch (Exception e)
        {
            throw;
        }
    }

    public async Task StartTimeLog(TimeEntry Entity)
    {
        try
        {
            var _query = Get()
                    .Where(x => x.ContactID == Entity.ContactID);

            if (Entity.WFTaskID != null)
                _query = _query.Where(x => x.WFTaskID != null && x.WFTaskID == Entity.WFTaskID);

            if (await _query.Where(x => x.EndDate == null).AnyAsync()) return;

            Entity.StartDate = DateTime.UtcNow;
            Entity.TypeFlag = 1;
            await Create(Entity);
        }
        catch (Exception e)
        {
            throw;
        }
    }

    public async Task EndTimeLog(int WFTaskID, bool IsPaused = false)
    {
        try
        {
            var _timeEntry = await Get()
                .Where(x => x.WFTaskID != null && x.WFTaskID == WFTaskID)
                     .Where(x => x.StatusFlag == 0 && x.EndDate == null)
                     .SingleOrDefaultAsync();

            if (_timeEntry == null)
            {
                return;
            }

            _timeEntry.EndDate = DateTime.UtcNow;
            _timeEntry.IsPaused = IsPaused;
            _timeEntry.StatusFlag = 1;

            await Update(_timeEntry);

        }
        catch (Exception e)
        {
            throw;
        }
    }


}