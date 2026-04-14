using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.Utility.Common;
using MyCockpitView.Utility.Excel;
using MyCockpitView.WebApi.ActivityModule.Entities;
using MyCockpitView.WebApi.ContactModule.Entities;
using MyCockpitView.WebApi.ContactModule.Services;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.WebApi.LeaveModule.Entities;
using MyCockpitView.WebApi.MeetingModule.Dtos;
using MyCockpitView.WebApi.MeetingModule.Entities;
using MyCockpitView.WebApi.MeetingModule.Services;
using MyCockpitView.WebApi.RequestTicketModule.Entities;
using MyCockpitView.WebApi.RequestTicketModule.Services;
using MyCockpitView.WebApi.Services;
using MyCockpitView.WebApi.SiteVisitModule.Entities;
using MyCockpitView.WebApi.SiteVisitModule.Services;
using MyCockpitView.WebApi.TodoModule.Entities;
using MyCockpitView.WebApi.WFTaskModule.Dtos;
using MyCockpitView.WebApi.WFTaskModule.Entities;
using System.Data;
namespace MyCockpitView.WebApi.WFTaskModule.Services;

public interface IWFTaskService : IBaseEntityService<WFTask>
{
    Task<int> Create(WFTask Entity, bool UseTime = false, bool AllowMultiple = false, bool AllowPreviousRevision = false, string PreviousStageCode = null, int? PreviousStageRevision = null, int? PreviousTaskID = null);

    Task AutoPauseTasks();
    Task<WFTask> GetActiveStage(string Entity, int EntityID);
    Task<IEnumerable<WFTaskAnalysisDto>> GetAnalysisData(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null);
    Task<byte[]> GetAnalysisExcel(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null);
    Task<int> GetNextRevision(int ContactID, string Entity, int EntityID, int StageIndex, string? WFStageCode = null);
    Task HandleParallelTasks(int CurrentTaskID);
    Task<bool> IsAllApproved(WFTask obj, int RequiredCount = 0);
    Task<bool> IsAllTasksCompleted(WFTask obj, int RequiredCount = 0);
    Task PauseOtherActiveTasks(int TaskID, int ContactID);
    Task PurgePendingTasks(string Entity, int EntityID);
    Task RecalculateVHrData(WFTask wfTask);
    Task StartFlow(string Entity, int EntityTypeFlag, int EntityID, WFStage? Stage = null, int? ProjectID = null, MeetingAttendeeDto? Attendee = null);
    Task Update(WFTask UpdatedTask, IEnumerable<Assessment>? Assessments = null);
    Task UpdateTaskDue(string Entity, int EntityID);
    Task Validate(WFTask Entity, bool isUpdate = false, bool AllowPreviousRevision = false, bool AllowMultiple = false);
    Task ValidateTaskFlow(string Entity, int EntityTypeFlag, int EntityID);
    Task AssignAgendaTasks(int agendaID);
}

public class WFTaskService : BaseEntityService<WFTask>, IWFTaskService
{
    public WFTaskService(EntitiesContext db) : base(db)
    {
    }
    private readonly ICurrentUserService _currentUserService;


    public WFTaskService(
        EntitiesContext db,
        ICurrentUserService currentUserService
     ) : base(db)
    {
        _currentUserService = currentUserService;
    }

    public IQueryable<WFTask> Get(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null)
    {

        IQueryable<WFTask> _query = base.Get(Filters);

        //Apply filters
        if (Filters != null)
        {

            if (Filters.Where(x => x.Key.Equals("entity", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<WFTask>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("entity", StringComparison.OrdinalIgnoreCase)))
                {
                    predicate = predicate.Or(x => x.Entity != null && x.Entity == _item.Value);
                }
                _query = _query.Where(predicate);
            }

            if (Filters.Where(x => x.Key.Equals("entityID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<WFTask>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("entityID", StringComparison.OrdinalIgnoreCase)))
                {
                    predicate = predicate.Or(x => x.EntityID != null && x.EntityID.ToString() == _item.Value);
                }
                _query = _query.Where(predicate);
            }

            if (Filters.Where(x => x.Key.Equals("contactID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<WFTask>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("contactID", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(x => x.ContactID == isNumeric);
                }
                _query = _query.Where(predicate);
            }

            if (Filters.Where(x => x.Key.Equals("AssignerContactID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<WFTask>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("AssignerContactID", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(x => x.AssignerContactID == isNumeric);
                }
                _query = _query.Where(x => x.AssignerContactID != null).Where(predicate);
            }

            if (Filters.Where(x => x.Key.Equals("CompanyID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<WFTask>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("CompanyID", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(x => x.CompanyID == isNumeric);
                }
                _query = _query.Where(x => x.CompanyID != null).Where(predicate);
            }
            if (Filters.Where(x => x.Key.Equals("ProjectID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<WFTask>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("ProjectID", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(x => x.ProjectID == isNumeric);
                }
                _query = _query.Where(x => x.ProjectID != null).Where(predicate);
            }

            if (Filters.Where(x => x.Key.Equals("startDate", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _item = Filters.First(x => x.Key.Equals("startDate", StringComparison.OrdinalIgnoreCase));
                DateTime result = Convert.ToDateTime(_item.Value);
                _query = _query.Where(x => x.StartDate.Date == result.Date);
            }

            if (Filters.Where(x => x.Key.Equals("dueDate", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _item = Filters.First(x => x.Key.Equals("dueDate", StringComparison.OrdinalIgnoreCase));

                DateTime result = Convert.ToDateTime(_item.Value);
                _query = _query.Where(x => x.DueDate.Date == result.Date);
            }

            if (Filters.Where(x => x.Key.Equals("completedDate", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _item = Filters.First(x => x.Key.Equals("completedDate", StringComparison.OrdinalIgnoreCase));

                DateTime result = Convert.ToDateTime(_item.Value);
                _query = _query.Where(x => x.CompletedDate != null && x.CompletedDate.Value.Date == result.Date);
            }


            if (Filters.Where(x => x.Key.Equals("rangestart", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _item = Filters.First(x => x.Key.Equals("rangestart", StringComparison.OrdinalIgnoreCase));

                DateTime result = Convert.ToDateTime(_item.Value);
                _query = _query.Where(x => x.StartDate >= result || x.DueDate >= result || (x.CompletedDate != null && x.CompletedDate.Value >= result));
            }

            if (Filters.Where(x => x.Key.Equals("rangeend", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _item = Filters.First(x => x.Key.Equals("rangeend", StringComparison.OrdinalIgnoreCase));

                DateTime result = Convert.ToDateTime(_item.Value);
                var end = result.AddDays(1);
                _query = _query.Where(x => x.StartDate < end || x.DueDate < end || (x.CompletedDate != null && x.CompletedDate.Value < end));

            }
            if (Filters.Where(x => x.Key.Equals("StartDateRangeStart", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _item = Filters.First(x => x.Key.Equals("StartDateRangeStart", StringComparison.OrdinalIgnoreCase));

                DateTime result = Convert.ToDateTime(_item.Value);
                _query = _query.Where(x => x.StartDate >= result);
            }

            if (Filters.Where(x => x.Key.Equals("StartDateRangeEnd", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _item = Filters.First(x => x.Key.Equals("StartDateRangeEnd", StringComparison.OrdinalIgnoreCase));

                DateTime result = Convert.ToDateTime(_item.Value);
                var end = result.AddDays(1);
                _query = _query.Where(x => x.StartDate < end);

            }
            if (Filters.Where(x => x.Key.Equals("DueDateRangeStart", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _item = Filters.First(x => x.Key.Equals("DueDateRangeStart", StringComparison.OrdinalIgnoreCase));

                DateTime result = Convert.ToDateTime(_item.Value);
                _query = _query.Where(x => x.DueDate >= result);
            }

            if (Filters.Where(x => x.Key.Equals("DueDateRangeEnd", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _item = Filters.First(x => x.Key.Equals("DueDateRangeEnd", StringComparison.OrdinalIgnoreCase));

                DateTime result = Convert.ToDateTime(_item.Value);
                var end = result.AddDays(1);
                _query = _query.Where(x => x.DueDate < end);

            }

            if (Filters.Where(x => x.Key.Equals("completedDateRangeStart", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _item = Filters.First(x => x.Key.Equals("completedDateRangeStart", StringComparison.OrdinalIgnoreCase));

                DateTime result = Convert.ToDateTime(_item.Value);
                _query = _query.Where(x => x.CompletedDate >= result);
            }

            if (Filters.Where(x => x.Key.Equals("completedDateRangeEnd", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _item = Filters.First(x => x.Key.Equals("completedDateRangeEnd", StringComparison.OrdinalIgnoreCase));

                DateTime result = Convert.ToDateTime(_item.Value);
                var end = result.AddDays(1);
                _query = _query.Where(x => x.CompletedDate < end);

            }

            if (Filters.Where(x => x.Key.Equals("isDelayed", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _item = Convert.ToBoolean(Filters.First(x => x.Key.Equals("isDelayed", StringComparison.OrdinalIgnoreCase)).Value);

                var predicate = PredicateBuilder.False<WFTask>();

                if (_item)
                {
                    predicate = predicate.Or(x => (x.StatusFlag != 1 && x.DueDate < DateTime.UtcNow)
                        || (x.StatusFlag == 1 && x.DueDate < x.CompletedDate));
                }
                else
                {
                    predicate = predicate.Or(x => (x.StatusFlag != 1 && x.DueDate >= DateTime.UtcNow)
                        || (x.StatusFlag == 1 && x.DueDate >= x.CompletedDate));
                }

                _query = _query.Where(predicate);
            }

            if (Filters.Where(x => x.Key.Equals("IsPreAssignedTimeTask", StringComparison.OrdinalIgnoreCase)).Any())
            {
                _query = _query.Where(x => x.IsPreAssignedTimeTask);
            }

            if (Filters.Where(x => x.Key.Equals("isStarted", StringComparison.OrdinalIgnoreCase)).Any())
            {
                _query = _query.Where(x => x.StatusFlag == 2);
            }

            if (Filters.Where(x => x.Key.Equals("isPaused", StringComparison.OrdinalIgnoreCase)).Any())
            {
                _query = _query.Where(x => x.StatusFlag == 3);
            }

            if (Filters.Where(x => x.Key.Equals("wfstagecode", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _item = Filters.First(x => x.Key.Equals("wfstagecode", StringComparison.OrdinalIgnoreCase));

                _query = _query.Where(x => x.WFStageCode == _item.Value);
            }
        }

        if (Search != null && Search != string.Empty)
        {
            var _key = Search.Trim();
            _query = _query.Include(x => x.Contact).Where(x => x._searchTags.ToLower().Contains(_key)
                || x.Title.ToLower().Contains(_key.ToLower())
                       || x.Description.ToLower().Contains(_key.ToLower())
                              || x.Subtitle.ToLower().Contains(Search.ToLower())
                              || x.Entity.ToLower().Contains(Search.ToLower())
                              || (x.Contact.FirstName + " " + x.Contact.LastName).ToLower().Contains(Search.ToLower())
                    );

        }

        if (Sort != null && Sort != String.Empty)
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

                else if (key.Trim().Equals("duedate", StringComparison.OrdinalIgnoreCase))
                    _orderedQuery = _orderedQuery
                            .ThenBy(x => x.DueDate);

                else if (key.Trim().Equals("duedate desc", StringComparison.OrdinalIgnoreCase))
                    _orderedQuery = _orderedQuery
                            .ThenByDescending(x => x.DueDate);

                else if (key.Trim().Equals("completeddate", StringComparison.OrdinalIgnoreCase))
                    _orderedQuery = _orderedQuery
                            .ThenBy(x => x.CompletedDate);


                else if (key.Trim().Equals("completeddate desc", StringComparison.OrdinalIgnoreCase))
                    _orderedQuery = _orderedQuery
                            .ThenByDescending(x => x.CompletedDate);
            }

            return _orderedQuery;
        }


        return _query.OrderBy(x => x.DueDate);

    }


    public async Task Update(WFTask UpdatedTask, IEnumerable<Assessment> Assessments = null)
    {

        var _wfTask = await Get()
            .Where(x => x.ID == UpdatedTask.ID)
            .SingleOrDefaultAsync();

        if (_wfTask == null) throw new EntityServiceException("Task not found");

        //record OldValues
        var _oldStartDate = _wfTask.StartDate;
        var _oldDueDate = _wfTask.DueDate;
        var _oldStage = _wfTask.WFStageCode;
        var _oldStatusFlag = _wfTask.StatusFlag;

        //apply Update
        _wfTask = UpdatedTask;

        //re-calculate if MHrAssigned changed
        _wfTask.VHrAssigned = _wfTask.MHrAssigned * _wfTask.ManValue;
        _wfTask.VHrAssignedCost = _wfTask.VHrAssigned * _wfTask.VHrRate;

        //if StartDate or DueDate updated
        if (_wfTask.StatusFlag == 0
            && _wfTask.IsPreAssignedTimeTask
            && (_oldDueDate != _wfTask.DueDate || _oldStartDate != _wfTask.StartDate)
            )
            await Validate(_wfTask, true);

        // if Status is Started/Paused/Completed maintain StartDate
        if (_wfTask.StatusFlag != 0)
            //_wfTask.StartDate = _oldStartDate;

            //maintain stageCode
            _wfTask.WFStageCode = _oldStage;

        //if StatuFlag updated
        if (_oldStatusFlag != _wfTask.StatusFlag)
        {
            if (_wfTask.StatusFlag == 1) //completed
            {
                var _history = "Completed [" + ClockTools.GetISTNow().ToString("dd MMM yyyy HH:mm") + "]";
                _wfTask.History = _wfTask.History != null ? _wfTask.History + " " + _history : _history;

                _wfTask.CompletedDate = DateTime.UtcNow;
            }
            else if (_wfTask.StatusFlag == 2) //start
            {
                var _history = "Started [" + ClockTools.GetISTNow().ToString("dd MMM yyyy HH:mm") + "]";
                _wfTask.History = _wfTask.History != null ? _wfTask.History + " " + _history : _history;

                //check for any other tasks inprogress & pause them
                await PauseOtherActiveTasks(_wfTask.ID, _wfTask.ContactID);
            }
            else if (_wfTask.StatusFlag == 3) //Paused
            {
                var _history = "Paused [" + ClockTools.GetISTNow().ToString("dd MMM yyyy HH:mm") + "]";
                _wfTask.History = _wfTask.History != null ? _wfTask.History + " " + _history : _history;
            }
        }

        db.Entry(_wfTask).State = EntityState.Modified;
        await db.SaveChangesAsync();

        if (_oldStatusFlag != _wfTask.StatusFlag)
        {
            if (_wfTask.WFStageCode != null)
            {

                try
                {
                    await CompleteTaskStage(_wfTask.ID);


                }
                catch (Exception e)
                {
                    _wfTask.OutcomeFlag = 0;
                    _wfTask.StatusFlag = _oldStatusFlag;

                    db.Entry(_wfTask).State = EntityState.Modified;
                    await db.SaveChangesAsync();
                    throw;
                }

            }

        }

        if (Assessments != null && Assessments.Any())
        {

            var _assessments = await db.Assessments.AsNoTracking()
         .Where(x => x.WFTaskID != null && x.WFTaskID == _wfTask.ID)
         .ToListAsync();

            foreach (var _entity in _assessments)
            {
                db.Entry(_entity).State = EntityState.Deleted;
            }


            db.Assessments.AddRange(Assessments);
            await db.SaveChangesAsync();
        }

        //re-calculate VHR data
        await RecalculateVHrData(_wfTask);


    }



    public async Task RecalculateVHrData(WFTask wfTask)
    {

        var appointmentService = new ContactAppointmentService(db);
        var _appointment = await appointmentService.GetLastAppointment(wfTask.ContactID);
        if (_appointment != null)
        {
            wfTask.ManValue = _appointment.ManValue;
            wfTask.CompanyID = _appointment.CompanyID;
        }

        wfTask.MHrConsumed = Math.Round(await db.TimeEntries.AsNoTracking()
            .Where(x => x.WFTaskID != null && x.WFTaskID == wfTask.ID).AnyAsync() ?
            await db.TimeEntries.AsNoTracking()
            .Where(x => x.WFTaskID != null && x.WFTaskID == wfTask.ID).Select(x => x.ManHours).SumAsync()
            : 0, 2);

        var _assessments = await db.Assessments.AsNoTracking()
          .Where(x => x.WFTaskID != null && x.WFTaskID == wfTask.ID && x.ScoredPoints > 0)
          .ToListAsync();

        wfTask.AssessmentPoints = _assessments.Any() ?
           _assessments.Select(x => x.ScoredPoints).Sum()
           : 0;


        wfTask.MHrAssessed = Math.Round(wfTask.IsAssessmentRequired ? (wfTask.IsPreAssignedTimeTask ?
                                wfTask.MHrAssigned * wfTask.AssessmentPoints / 10.0m :
                                wfTask.MHrConsumed * wfTask.AssessmentPoints / 10.0m) :
                                wfTask.MHrConsumed, 2);

        wfTask.VHrConsumed = Math.Round(wfTask.MHrConsumed * wfTask.ManValue, 2);
        wfTask.VHrAssessed = Math.Round(wfTask.MHrAssessed * wfTask.ManValue, 2);
        wfTask.VHrConsumedCost = Math.Round(wfTask.VHrConsumed * wfTask.VHrRate, 2);
        wfTask.VHrAssessedCost = Math.Round(wfTask.VHrAssessed * wfTask.VHrRate, 2);

        db.Entry(wfTask).State = EntityState.Modified;
        await db.SaveChangesAsync();

    }

    public async Task PauseOtherActiveTasks(int TaskID, int ContactID)
    {

        var _activeTasks = await Get()
               .Where(x => x.ContactID == ContactID
               && x.ID != TaskID
               && x.StatusFlag == 2)
               .ToListAsync();

        foreach (var item in _activeTasks)
        {
            item.OutcomeFlag = 1;
            item.StatusFlag = 3;
            var _history = "Paused [" + ClockTools.GetISTNow().ToString("dd MMM yyyy HH:mm") + "]";
            item.History = item.History != null ? item.History + " " + _history : _history;
            db.Entry(item).State = EntityState.Modified;
            await db.SaveChangesAsync();

            if (item.WFStageCode != null)
            {

                try
                {
                    await CompleteTaskStage(item.ID);
                }
                catch (Exception ex)
                {
                    throw new Exception("Other active tasks could not be paused! Please try again." + "\n" + ex.Message);
                }

            }

        }

    }

    public async Task Validate(WFTask Entity, bool isUpdate = false, bool AllowPreviousRevision = false, bool AllowMultiple = false)
    {

        var _contact = await db.Contacts.AsNoTracking()
                .Where(x => x.Username != null)
               .Where(x => x.ID == Entity.ContactID).SingleOrDefaultAsync();

        if (_contact == null) throw new EntityServiceException("Assignee not found! Please try again.");

        if (!isUpdate && !AllowMultiple)
        {
            var _query = Get()
               .Where(x => x.ID != Entity.ID)
                   .Where(x => x.ContactID == Entity.ContactID && x.StatusFlag == 0);

            _query = _query
                .Where(x => x.Entity == Entity.Entity
                        && x.EntityID == Entity.EntityID
                       && x.WFStageCode == Entity.WFStageCode);

            if (AllowPreviousRevision)
            {
                _query = _query
               .Where(x => x.StageRevision == Entity.StageRevision);
            }
            else
            {
                _query = _query
              .Where(x => x.StageRevision <= Entity.StageRevision);
            }

            if (await _query.AnyAsync())
            {
                var _first = await _query.FirstOrDefaultAsync();

                throw new EntityServiceException("Task already exists!"
+ " \n" + _first.Title + " | " + _first.Subtitle
+ " \n [" + ClockTools.GetIST(_first.StartDate).ToString("dd MMM yyyy HH:mm") + "-" + ClockTools.GetIST(_first.DueDate).ToString("dd MMM yyyy HH:mm") + "]");
            }
            ;

        }

    }

    public async Task<int> Create(WFTask task,
        bool UseTime = false,
        bool AllowMultiple = false,
        bool AllowPreviousRevision = false,
        string? PreviousStageCode = null,
        int? PreviousStageRevision = null,
        int? PreviousTaskID = null
      )
    {

        if (task.StageIndex == null) task.StageIndex = 0;

        if (task.StageRevision == 0)
            task.StageRevision = await GetNextRevision(task.ContactID, task.Entity, task.EntityID.Value, task.StageIndex.Value, task.WFStageCode);

        await Validate(task, false, AllowPreviousRevision, AllowMultiple);

        if (task.Title == null)
        {
            if (task.WFStageCode != null)
            {
                var _stage = await db.WFStages.AsNoTracking()
               .SingleOrDefaultAsync(x => x.Code == task.WFStageCode);
                if (_stage != null)
                    task.Title = _stage.TaskTitle;
            }
            else
            {
                throw new EntityServiceException("Task Title not found! Please try again.");
            }

        }

        task.PreviousStageCode = PreviousStageCode;
        task.PreviousStageRevision = PreviousStageRevision;
        task.PreviousTaskID = PreviousTaskID;
        task.ManValue = 1;
        task.CompanyID = 1;

        var appointmentService = new ContactAppointmentService(db);
        var _appointment = await appointmentService.GetLastAppointment(task.ContactID);
        if (_appointment != null)
        {
            task.ManValue = _appointment.ManValue;
            task.CompanyID = _appointment.CompanyID;
        }

        task.VHrAssigned = task.MHrAssigned * task.ManValue;
        task.VHrAssignedCost = task.VHrAssigned * task.VHrRate;

        if (task.StatusFlag == McvConstant.WFTASK_STATUSFLAG_COMPLETED)
        {
            task.VHrConsumed = task.MHrConsumed * task.ManValue;
            task.VHrAssessed = task.MHrAssessed * task.ManValue;
            task.VHrConsumedCost = task.VHrConsumed * task.VHrRate;
            task.VHrAssessedCost = task.VHrAssessed * task.VHrRate;
        }

        db.WFTasks.Add(task);
        await db.SaveChangesAsync();

        if (task.StatusFlag == McvConstant.WFTASK_STATUSFLAG_PENDING)
        {
            var contact = await db.Contacts.AsNoTracking().FirstOrDefaultAsync(x => x.ID == task.ContactID);
            if (contact != null && contact.Username != null)
            {
                var sharedService = new SharedService(db);
                await sharedService.PushNotification(contact.Username,
                    $"New {task.Entity} Task Assigned",
                    $"{task.Title} | {task.Subtitle} | {ClockTools.GetIST(task.DueDate).ToString("dd MMM yyyy HH:mm")}",
                    nameof(WFTask), task.ID.ToString()
                );
            }

        }


        return task.ID;

    }

    public async Task<int> GetNextRevision(int ContactID, string Entity, int EntityID, int StageIndex, string WFStageCode = null)
    {

        var _previousTasks = Get()
               .Where(x => x.Entity == Entity
               && x.EntityID == EntityID && x.ContactID == ContactID);

        if (WFStageCode != null)
            _previousTasks = _previousTasks.Where(x => x.WFStageCode == WFStageCode);
        else
            _previousTasks = _previousTasks.Where(x => x.StageIndex == StageIndex && x.StageIndex != 3);

        var _version = await _previousTasks.AnyAsync()
            ? await _previousTasks.MaxAsync(x => x.StageRevision) + 1
            : 0;

        return _version;

    }

    public async Task Delete(int Id)
    {

        var entity = await Get()
            .Include(x => x.TimeEntries)
            .Include(x => x.Attachments)
             .SingleOrDefaultAsync(i => i.ID == Id);

        var timeentryervice = new TimeEntryService(db);
        foreach (var x in entity.TimeEntries)
        {
            await timeentryervice.Delete(x.ID);
        }

        var attachmentService = new BaseAttachmentService<WFTaskAttachment>(db);
        foreach (var x in entity.Attachments)
        {
            await attachmentService.Delete(x.ID);
        }


        await base.Delete(Id);

    }

    public async Task PurgePendingTasks(string Entity, int EntityID)
    {

        if (await db.WFTasks.AsNoTracking()
          .Where(x => x.Entity != null && x.EntityID == EntityID && x.Entity == Entity)
         .Where(x => x.StatusFlag == 2).AnyAsync())
            throw new Exception("One of the tasks is InProgress. Please complete the task and try again!");

        var _tasks = await db.WFTasks.AsNoTracking()
          .Where(x => x.Entity != null && x.EntityID == EntityID && x.Entity == Entity)
         .Where(x => x.StatusFlag != 1 && x.StatusFlag != -1)
          .ToListAsync();

        foreach (var item in _tasks)
        {
            await Delete(item.ID);
        }

    }

    public async Task<bool> IsAllTasksCompleted(WFTask obj, int RequiredCount = 0)
    {

        IQueryable<WFTask> _tasks = Get();

        if (obj.EntityID != null)
        {
            _tasks = _tasks
                            .Where(x => x.Entity == obj.Entity && x.EntityID == obj.EntityID);
        }
        else
        {
            return false;
        }

        _tasks = _tasks.Where(x => x.StageIndex == obj.StageIndex
               && x.StageRevision == obj.StageRevision);

        if (RequiredCount == 0)
        {
            RequiredCount = await _tasks
            .CountAsync();
        }

        var _count = await _tasks
            .Where(x => x.StatusFlag == 1)
            .CountAsync();

        if (_count >= RequiredCount) return true;

        return false;

    }

    public async Task<bool> IsAllApproved(WFTask obj, int RequiredCount = 0)
    {

        IQueryable<WFTask> _tasks = Get();

        if (obj.EntityID != null)
        {
            _tasks = _tasks
                            .Where(x => x.Entity == obj.Entity && x.EntityID == obj.EntityID);
        }
        else
        {
            return false;
        }

        _tasks = _tasks.Where(x => x.StageIndex == obj.StageIndex
               && x.StageRevision == obj.StageRevision);

        if (RequiredCount == 0)
        {
            RequiredCount = await _tasks
                                .CountAsync();
        }

        var _count = await _tasks
                            .Where(x => x.StatusFlag == 1 && x.OutcomeFlag == 1)
                            .CountAsync();

        if (_count >= RequiredCount) return true;

        return false;

    }

    public async Task HandleParallelTasks(int CurrentTaskID)
    {

        var _task = await Get().Where(x => x.ID == CurrentTaskID).SingleOrDefaultAsync();
        if (_task == null) return;

        var _pending = await Get()
                                   .Where(x => x.ID != CurrentTaskID
                                                           && x.StatusFlag == 0
                                                           && x.Entity == _task.Entity
                                                           && x.EntityID == _task.EntityID
                                                           && x.StageIndex == _task.StageIndex
                                                           && x.WFStageCode == x.WFStageCode)
                                                               .ToListAsync();

        foreach (var _item in _pending)
        {
            _item.Comment = "Un-attended";
            _item.StatusFlag = -1;
            db.Entry(_item).State = EntityState.Modified;
        }

        await db.SaveChangesAsync();

    }

    public async Task AutoPauseTasks()
    {

        var _tasks = await Get()
            .Where(x => x.StatusFlag == McvConstant.WFTASK_STATUSFLAG_STARTED)
            .ToListAsync();

        foreach (var item in _tasks)
        {


            var _history = "Auto Paused [" + ClockTools.GetISTNow().ToString("dd MMM yyyy HH:mm") + "]";
            item.History = item.History != null ? item.History + " " + _history : _history;
            //item.CompletedDate = DateTime.UtcNow;



            if (item.WFStageCode != null)
            {
                item.StatusFlag = McvConstant.WFTASK_STATUSFLAG_PAUSED;
                item.OutcomeFlag = McvConstant.WFTASK_OUTCOME_PAUSE;
                await base.Update(item);
                await CompleteTaskStage(item.ID);
            }
            else
            {
                item.StatusFlag = 1; //complete
                await Update(item);

                //using (var _timeEntryService = new TimeEntryServices())
                //{
                //    await _timeEntryService.EndTimeLog(item.ID);
                //}
            }
            await RecalculateVHrData(item);
        }

    }

    public async Task CheckTaskCompletedDate()
    {

        var _tasks = await Get()
            .Where(x => x.StatusFlag == 1 && x.CompletedDate == null)
            .ToListAsync();

        foreach (var item in _tasks)
        {
            item.CompletedDate = item.Modified; //completed
            await Update(item);
        }

    }

    public double GetDuration(DateTime Created, DateTime DueDate)
    {

        return ClockTools.GetDifference(Created, DueDate).TotalHours;

    }

    public async Task<WFTask> GetActiveStage(string Entity, int EntityID)
    {

        return await Get()
            .AsNoTracking()
            .OrderByDescending(x => x.Created)
            .FirstOrDefaultAsync(x => x.Entity != null && x.Entity == Entity
                                    && x.EntityID == EntityID
                                        && x.StatusFlag == 0);

    }

    public async Task<IEnumerable<String>> GetEntityOptions()
    {

        return await Get()
            .Where(x => x.Entity != null)
            .Select(x => x.Entity)
            .Distinct()
            .ToListAsync();

    }

    public async Task<IEnumerable<WFTaskAnalysisDto>> GetAnalysisData(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null)
    {

        var _tasks = Get(Filters != null ? Filters.Where(x => !x.Key.Equals("rangestart", StringComparison.OrdinalIgnoreCase)
                         && !x.Key.Equals("rangeend", StringComparison.OrdinalIgnoreCase)) : null)

           .Where(x => x.StatusFlag == McvConstant.WFTASK_STATUSFLAG_COMPLETED)
                 .Where(x => x.Entity != null && x.EntityID != null);

        if (Filters != null)
        {
            if (Filters.Where(x => x.Key.Equals("rangestart", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _item = Filters.First(x => x.Key.Equals("rangestart", StringComparison.OrdinalIgnoreCase));

                DateTime result = Convert.ToDateTime(_item.Value);
                _tasks = _tasks.Where(x => x.CompletedDate != null && x.CompletedDate.Value >= result);
            }

            if (Filters.Where(x => x.Key.Equals("rangeend", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _item = Filters.First(x => x.Key.Equals("rangeend", StringComparison.OrdinalIgnoreCase));

                DateTime result = Convert.ToDateTime(_item.Value).AddDays(1);

                _tasks = _tasks.Where(x => x.CompletedDate != null && x.CompletedDate.Value < result);

            }

            //if (Filters.Where(x => x.Key.Equals("TeamID", StringComparison.OrdinalIgnoreCase)).Any())
            //{
            //    var predicate = PredicateBuilder.False<WFTask>();
            //    foreach (var _item in Filters.Where(x => x.Key.Equals("TeamID", StringComparison.OrdinalIgnoreCase)))
            //    {
            //        var isNumeric = Convert.ToInt32(_item.Value);

            //        predicate = predicate.Or(x => x.ContactID.ToString() == _item.Value);
            //    }
            //    _tasks = _tasks.Where(predicate);
            //}

            if (Filters.Where(x => x.Key.Equals("TeamID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<WFTask>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("TeamID", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(x =>
                    x.Contact.TeamMemberships.Any(t => t.ContactTeamID == isNumeric)
                    ||
                    (x.AssignerContactID != null && x.Assigner.TeamMemberships.Any(t => t.ContactTeamID == isNumeric)));
                }
                _tasks = _tasks.Include(x => x.Contact).ThenInclude(x => x.TeamMemberships)
                    .Include(x => x.Assigner).ThenInclude(x => x.TeamMemberships).Where(predicate);
            }
        }

        var _query = _tasks
                     .Include(x => x.Contact)
                     .Include(x => x.Assigner)
                     .Include(x => x.Assessments)
                    .GroupJoin(
                                db.StatusMasters.Where(s => s.Entity == nameof(WFTask)),
                                x => x.StatusFlag,
                                s => s.Value,
                                (x, s) => new { x, Status = s }
                            )
                            .SelectMany(
                                x => x.Status.DefaultIfEmpty(),
                                (x, s) => new { x.x, Status = s }
                            )
                            .GroupJoin(
                                db.Projects,
                                x => x.x.ProjectID,
                                p => p.ID,
                                (x, p) => new { x.x, x.Status, Project = p }
                            )
                     .Select(x => new
                     {
                         WFTaskID = x.x.ID,
                         x.x.ContactID,
                         x.x.ProjectID,
                         x.x.CompanyID,
                         Person = x.x.Contact,
                         AssignedBy = x.x.Assigner,
                         TaskTitle = x.x.Title,
                         x.x.Entity,
                         x.x.EntityID,
                         EntityTitle = x.x.Subtitle,
                         Revision = x.x.StageRevision,
                         WorkDescription = x.x.Description,
                         x.x.StartDate,
                         x.x.DueDate,
                         CompletedDate = x.x.CompletedDate != null ? x.x.CompletedDate.Value : (DateTime?)null,
                         CommentOnCompletion = x.x.Comment,
                         IsTimeBoundTask = x.x.IsPreAssignedTimeTask,
                         MHrAssigned = x.x.IsPreAssignedTimeTask ? x.x.MHrAssigned : 0,
                         x.x.MHrConsumed,
                         x.x.MHrAssessed,
                         x.x.VHrRate,
                         x.x.ManValue,
                         VHrAssigned = x.x.IsPreAssignedTimeTask ? x.x.VHrAssigned : 0,
                         x.x.VHrConsumed,
                         x.x.VHrAssessed,
                         x.x.VHrAssignedCost,
                         x.x.VHrConsumedCost,
                         x.x.VHrAssessedCost,
                         //Status = db.StatusMasters
                         //    .Where(s => s.Entity != null && s.Entity == nameof(WFTask) && s.Value == x.x.StatusFlag)
                         //    .Any() ? db.StatusMasters
                         //    .Where(s => s.Entity != null && s.Entity == nameof(WFTask) && s.Value == x.x.StatusFlag)
                         //    .FirstOrDefault().Title : "UNDEFINED",
                         x.x.AssessmentRemark,
                         IsAssessmentApplicable = x.x.IsAssessmentRequired,
                         x.x.AssessmentPoints,
                         x.x.Assessments,
                         Status = x.Status != null ? x.Status.Title : "UNDEFINED",
                         Project = x.Project.FirstOrDefault() != null ? $"{x.Project.FirstOrDefault().Code}-{x.Project.FirstOrDefault().Title}" : null, // Left join to db.Projects


                     });


        if (Search != null && Search != "")
        {
            //var keywords = Search.ToLower().Split(' ');
            //foreach (var key in keywords)
            //{
            _query = _query.Where(s => s.Person.FullName.ToLower().Contains(Search.ToLower())
                                  || s.TaskTitle.ToLower().Contains(Search.ToLower())
                                  || s.Entity.ToLower().Contains(Search.ToLower())
                                  || s.EntityTitle.ToLower().Contains(Search.ToLower())
                                  //|| (s.Project!=null? s.Project.ToLower().Contains(Search):false)
                                  );
            //}
        }

        _query = _query
            .OrderByDescending(x => x.CompletedDate);

        if (Sort != null && Sort != String.Empty)
        {
            var _orderedQuery = _query.OrderBy(l => 0);
            var keywords = Sort.Replace("asc", "").Split(',');

            foreach (var key in keywords)
            {

                if (key.Trim().Equals("startdate", StringComparison.OrdinalIgnoreCase))
                    _orderedQuery = _orderedQuery
                            .ThenBy(x => x.StartDate);

                else if (key.Trim().Equals("startdate desc", StringComparison.OrdinalIgnoreCase))
                    _orderedQuery = _orderedQuery
                            .ThenByDescending(x => x.StartDate);

                else if (key.Trim().Equals("duedate", StringComparison.OrdinalIgnoreCase))
                    _orderedQuery = _orderedQuery
                            .ThenBy(x => x.DueDate);

                else if (key.Trim().Equals("duedate desc", StringComparison.OrdinalIgnoreCase))
                    _orderedQuery = _orderedQuery
                            .ThenByDescending(x => x.DueDate);

                else if (key.Trim().Equals("completeddate", StringComparison.OrdinalIgnoreCase))
                    _orderedQuery = _orderedQuery
                            .ThenBy(x => x.CompletedDate);

                else if (key.Trim().Equals("completeddate desc", StringComparison.OrdinalIgnoreCase))
                    _orderedQuery = _orderedQuery
                            .ThenByDescending(x => x.CompletedDate);
            }

        }

        var _results = await _query
           .ToListAsync();

        return _results.Select(x => new WFTaskAnalysisDto
        {
            WFTaskID = x.WFTaskID,
            ContactID = x.ContactID,
            ProjectID = x.ProjectID,
            CompanyID = x.CompanyID,
            Person = x.Person.Name,
            AssignedBy = x.AssignedBy != null ? x.AssignedBy.Name : "SYSTEM",
            Project = x.Project,
            TaskTitle = x.TaskTitle,
            Entity = x.Entity,
            EntityID = x.EntityID,
            EntityTitle = x.EntityTitle,
            Revision = x.Revision,
            WorkDescription = x.WorkDescription,

            StartDate = x.StartDate,
            DueDate = x.DueDate,
            CompletedDate = x.CompletedDate != null ?
                 x.CompletedDate.Value :
                 (DateTime?)null,
            Delay = x.CompletedDate != null ? (x.DueDate - x.CompletedDate.Value).Hours : 0,

            CommentOnCompletion = x.CommentOnCompletion,

            IsTimeBoundTask = x.IsTimeBoundTask,

            MHrAssigned = x.MHrAssigned,
            MHrConsumed = x.MHrConsumed,

            MHrAssessed = x.MHrAssessed,
            VHrRate = x.VHrRate,
            ManValue = x.ManValue,
            VHrAssigned = x.VHrAssigned,
            VHrConsumed = x.VHrConsumed,
            VHrAssessed = x.VHrAssessed,

            VHrAssignedCost = x.VHrAssignedCost,
            VHrConsumedCost = x.VHrConsumedCost,
            VHrAssessedCost = x.VHrAssessedCost,

            Status = x.Status,
            AssessmentRemark = x.AssessmentRemark,
            IsAssessmentApplicable = x.IsAssessmentApplicable,
            AssessmentPoints = x.AssessmentPoints,
            AssessmentSummary = string.Join(",", x.Assessments.Select(a => a.Category + ":" + a.ScoredPoints)),
            Assessments = x.Assessments.Select(a => new WFTaskAnalysisAssessmentDto
            {
                Category = a.Category,
                Comment = a.Comment,
                Points = a.Points,
                ScoredPoints = a.ScoredPoints,
            })
        });

    }



    public async Task<byte[]> GetAnalysisExcel(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null)
    {
        var _dataSet = new DataSet();
        var _data = await GetAnalysisData(Filters, Search, Sort);

        _dataSet.Tables.Add(DataTools.ToDataTable(_data.Select(x => new
        {
            StartDate = ClockTools.GetIST(x.StartDate),
            CompletedDate = x.CompletedDate != null ? ClockTools.GetIST(x.CompletedDate.Value) : x.CompletedDate,
            DueDate = ClockTools.GetIST(x.DueDate),
            //x.WFTaskID,
            //x.ContactID,
            x.Project,
            x.Person,
            x.AssignedBy,
            x.TaskTitle,
            x.Entity,
            x.EntityID,
            x.EntityTitle,
            x.Revision,
            x.WorkDescription,
            x.CommentOnCompletion,
            x.IsTimeBoundTask,
            x.MHrAssigned,
            x.MHrConsumed,
            x.MHrAssessed,
            x.VHrRate,
            x.ManValue,
            x.VHrAssigned,
            x.VHrConsumed,
            x.VHrAssessed,
            x.VHrAssignedCost,
            x.VHrConsumedCost,
            x.VHrAssessedCost,
            x.Status,
            x.AssessmentRemark,
            x.IsAssessmentApplicable,
            x.AssessmentPoints,
            x.AssessmentSummary,


        })));

        return ExcelUtility.ExportExcel(_dataSet);

    }


    public async Task StartFlow(string Entity, int EntityTypeFlag, int EntityID, WFStage? Stage = null, int? ProjectID = null, MeetingAttendeeDto? Attendee = null)
    {

        //code to end existing flow
        var _pendingTaskIDs = await Get()
      .Where(x => x.Entity == Entity
      && x.EntityID == EntityID
      && x.StatusFlag == 0)
      .Select(x => x.ID)
      .ToListAsync();
        foreach (var id in _pendingTaskIDs)
        {

            await Delete(id);

        }

        var _stage = Stage;
        if (_stage == null)
        {
            //start new flow
            var _query = db.WFStages.AsNoTracking()
                .Include(x => x.Actions)
               .Where(x => x.IsStart
               && x.Entity == Entity);
            var _typeValue = EntityTypeFlag.ToString();
            //check if there is a flow based on Entity.TypeFlag
            if (await _query.Where(x => x.EntityTypeFlag != null).AnyAsync())
            {
                _query = _query.Where(x => x.EntityTypeFlag.Contains(_typeValue));
            }

            _stage = await _query.FirstOrDefaultAsync();
        }

        if (_stage == null)
            return; // throw new CustomException("Workflow start stage not found for "+Entity+" with TypeFlag "+EntityTypeFlag+"!");
        var sharedService = new SharedService(db);
        IEnumerable<int> _contactIDs = Enumerable.Empty<int>();

        if (Entity == nameof(Meeting))
        {
            if (Attendee != null && Attendee.ContactID != null)
            {
                _contactIDs = new List<int> { Attendee.ContactID.Value };
            }
        }
        else
        {
            _contactIDs = _stage.IsAssignByRole ?
                await sharedService.GetContactIDByRoleAsync(_stage.Code) :
                await GetAssigneeByEntity(Entity, EntityID, _stage.Code, _stage.AssignByEntityProperty);
        }


        foreach (var _assignee in _contactIDs)
        {
            var _task = await GetTaskByStage(Entity, EntityID, _stage.Code, ProjectID: ProjectID);

            _task.ContactID = _assignee;
            _task.IsPreAssignedTimeTask = _stage.IsPreAssignedTimeTask;
            _task.IsAssessmentRequired = _stage.IsAssessmentRequired;
            try
            {

                await Create(_task, _task.IsPreAssignedTimeTask);
            }
            catch (Exception ex)
            {
            }
        }

    }

    private async Task CompleteTaskStage(int WFTaskID, bool IsSkipSystemStage = false)
    {

        var _wftask = await db.WFTasks.AsNoTracking().Include(x => x.Attachments)
           .SingleOrDefaultAsync(x => x.ID == WFTaskID);

        if (_wftask == null || _wftask.Entity == null || _wftask.WFStageCode == null)
            throw new Exception("Task not found!");

        var _currentStage = await db.WFStages.AsNoTracking()
            .Include(x => x.Actions)
          .SingleOrDefaultAsync(x => x.Code == _wftask.WFStageCode);

        if (_currentStage == null)
            return;

        DateTime? _dueDate = _currentStage.ShowFollowUpDate ? _wftask.FollowUpDate : null;

        var _allTasks = db.WFTasks.AsNoTracking()
           .Where(x => x.Entity == _wftask.Entity
           && x.EntityID == _wftask.EntityID
           && x.WFStageCode == _wftask.WFStageCode
           && x.StageRevision == _wftask.StageRevision);

        var _totalCount = await _allTasks.CountAsync();

        //foreach (var action in _currentStage.Actions)
        //{
        //    var _actionCount = _allTasks
        //   .Where(x => x.StatusFlag == _wftask.StatusFlag
        //    && x.OutcomeFlag == action.TaskOutcomeFlag)
        //   .Count(); //not to consider current task as status is not saved

        //    var _isStageCompleted = false;
        //    if (action.ActionByCondition != null
        //        && action.ActionByCondition.Equals("ALL", StringComparison.OrdinalIgnoreCase))
        //    {
        //        _isStageCompleted = _actionCount >= (action.ActionByCount > 0 ? action.ActionByCount : _allTasks.Count());
        //    }
        //    else if (action.ActionByCondition == null
        //        || action.ActionByCondition.Equals("ANY", StringComparison.OrdinalIgnoreCase))
        //    {
        //        _isStageCompleted = _actionCount >= (action.ActionByCount > 0 ? action.ActionByCount : 1);
        //    }


        //    if (_isStageCompleted)
        //    {
        //        var _otherPendingTasks = await db.WFTasks.AsNoTracking()
        //   .Where(x => x.Entity == _wftask.Entity
        //   && x.EntityID == _wftask.EntityID
        //   && x.WFStageCode == _wftask.WFStageCode
        //   && x.StatusFlag == 0)
        //   .Where(x => x.ID != _wftask.ID)
        //   .ToListAsync();

        //        foreach (var _item in _otherPendingTasks)
        //        {
        //            _item.Comment = "Un-attended";
        //            _item.StatusFlag = -1;
        //            //_item.OutcomeFlag = _task.OutcomeFlag;
        //            db.Entry(_item).State = EntityState.Modified;
        //        }

        //        await db.SaveChangesAsync();

        //        //update activity
        //        var username = _currentUserService.GetCurrentUsername();
        //        if (!string.IsNullOrEmpty(username))
        //        {
        //            var contact = await db.Contacts.AsNoTracking().FirstOrDefaultAsync(x => x.Username == username);

        //            if (contact != null)
        //            {

        //                var activity = new Activity
        //                {
        //                    ContactID = contact.ID,
        //                    ContactName = contact.Name,
        //                    ContactPhotoUrl = contact.PhotoUrl,
        //                    ContactUID = contact.UID,
        //                    Entity = _wftask.Entity,
        //                    EntityID = _wftask.EntityID.Value,
        //                    EntityTitle = _wftask.Subtitle,
        //                    Action = _wftask.Title + " | " + _wftask.Subtitle + " | " + "R" + _wftask.StageRevision.ToString(),
        //                    Status = action.ActivityText,
        //                    Comments = (_wftask.ContactID != contact.ID ? "ON BEHALF | " : "") + _wftask.Comment + (_wftask.FollowUpDate != null ? " NEXT FOLLOW-UP DATE: " + ClockTools.GetIST(_wftask.FollowUpDate.Value).ToString("dd MMM yyyy") : "").Trim(),
        //                    WFTaskID = _wftask.ID,
        //                };
        //                if (_wftask.Attachments != null && _wftask.Attachments.Any())
        //                {
        //                    activity.Attachments = _wftask.Attachments.Select(x => new ActivityAttachment
        //                    {
        //                        Filename = x.Filename,
        //                        Size = x.Size,
        //                        Url = x.Url,
        //                        ThumbUrl = x.ThumbUrl,
        //                        Container = x.Container,
        //                        ContentType = x.ContentType
        //                    }).ToList();
        //                }
        //                db.Activities.Add(activity);
        //            }
        //        }

        //        //start next stage
        //        if (action.NextStageCode != null && action.NextStageCode != string.Empty)
        //            await AssignNextStage(
        //                action.NextStageCode,
        //                _wftask.Entity,
        //                _wftask.EntityID.Value,
        //                _currentStage.Code,
        //                _wftask.StageRevision,
        //                _wftask.ID,
        //                 _dueDate,
        //                 IsSkipSystemStage, ProjectID: _wftask.ProjectID);

        //        return;
        //    }
        //}
        foreach (var action in _currentStage.Actions)
        {
            // Only process action that matches the current task's outcome  
            if (action.TaskOutcomeFlag != _wftask.OutcomeFlag)
                continue;

            int _actionCount = _allTasks
                .Where(x => x.StatusFlag == _wftask.StatusFlag
                    && x.OutcomeFlag == action.TaskOutcomeFlag)
                .Count();

            bool _isStageCompleted;

            if (action.ActionByCondition?.Equals("ALL", StringComparison.OrdinalIgnoreCase) == true)
            {
                _isStageCompleted = _actionCount >=
                    (action.ActionByCount > 0 ? action.ActionByCount : _allTasks.Count());
            }
            else
            {
                _isStageCompleted = _actionCount >=
                    (action.ActionByCount > 0 ? action.ActionByCount : 1);
            }

            // ⭐ Always log activity — completed or not
            await LogActivity(_wftask, action.ActivityText);

            // ⭐ Only when stage actually completes → run your existing blocks
            if (_isStageCompleted)
            {
                // -------- Your "Mark other tasks as Un-attended" block --------
                var _otherPendingTasks = await db.WFTasks.AsNoTracking()
                    .Where(x => x.Entity == _wftask.Entity
                        && x.EntityID == _wftask.EntityID
                        && x.WFStageCode == _wftask.WFStageCode
                        && x.StatusFlag == 0
                        && x.ID != _wftask.ID)
                    .ToListAsync();

                foreach (var _item in _otherPendingTasks)
                {
                    _item.Comment = "Un-attended";
                    _item.StatusFlag = -1;
                    db.Entry(_item).State = EntityState.Modified;
                }

                await db.SaveChangesAsync();

                // -------- Your "Start Next Stage" block --------
                if (action.NextStageCode != null && action.NextStageCode != string.Empty)
                {
                    await AssignNextStage(
                        action.NextStageCode,
                        _wftask.Entity,
                        _wftask.EntityID.Value,
                        _currentStage.Code,
                        _wftask.StageRevision,
                        _wftask.ID,
                        _dueDate,
                        IsSkipSystemStage,
                        ProjectID: _wftask.ProjectID
                    );
                }

                return;
            }
        }

    }

    private async Task LogActivity(WFTask task, string status)
    {
        var username = _currentUserService.GetCurrentUsername();
        if (string.IsNullOrEmpty(username)) return;

        var contact = await db.Contacts.AsNoTracking()
            .FirstOrDefaultAsync(x => x.Username == username);

        if (contact == null) return;

        var activity = new Activity
        {
            ContactID = contact.ID,
            ContactName = contact.Name,
            ContactPhotoUrl = contact.PhotoUrl,
            ContactUID = contact.UID,
            Entity = task.Entity,
            EntityID = task.EntityID.Value,
            EntityTitle = task.Subtitle,
            Action = $"{task.Title} | {task.Subtitle} | R{task.StageRevision}",
            Status = status,
            Comments = (task.ContactID != contact.ID ? "ON BEHALF | " : "")
                + task.Comment
                + (task.FollowUpDate != null
                    ? $" NEXT FOLLOW-UP DATE: {ClockTools.GetIST(task.FollowUpDate.Value):dd MMM yyyy}"
                    : "").Trim(),
            WFTaskID = task.ID,
            Attachments = task.Attachments?.Select(a => new ActivityAttachment
            {
                Filename = a.Filename,
                Size = a.Size,
                Url = a.Url,
                ThumbUrl = a.ThumbUrl,
                Container = a.Container,
                ContentType = a.ContentType
            }).ToList()
        };

        db.Activities.Add(activity);
        await db.SaveChangesAsync();
    }


    private async Task AssignNextStage(
       string WFStageCode,
       string Entity,
        int EntityID,
       string PreviousStageCode,
        int PreviousStageRevision,
        int PreviousTaskID,
        DateTime? PreviousFollowUpDate = null, bool IsSkipSystemStage = false, int? ProjectID = null)
    {

        var _nextStage = await db.WFStages.AsNoTracking()
            .Include(x => x.Actions)
           .SingleOrDefaultAsync(x => x.Code == WFStageCode);

        if (_nextStage == null) throw new EntityServiceException($"WFStage {WFStageCode} not found!");

        if (_nextStage.IsSystem)
        {
            if (!IsSkipSystemStage)
                await CompleteWFStage(EntityID, _nextStage.Code, PreviousTaskID);

            foreach (var action in _nextStage.Actions)
            {
                if (action.NextStageCode != null && action.NextStageCode != string.Empty)
                    await AssignNextStage(
                        action.NextStageCode,
                        Entity,
                        EntityID,
                        PreviousStageCode,
                        PreviousStageRevision,
                        PreviousTaskID,
                        PreviousFollowUpDate, ProjectID: ProjectID);

            }
        }
        else
        {
            var sharedService = new SharedService(db);
            //IEnumerable<int> _contactIDs = Enumerable.Empty<int>();

            //var _attendee = await db.Meetings
            //                .Where(x => x.ID == EntityID)
            //                .SelectMany(x => x.Attendees)
            //                .Where(a => a.OrderFlag == 0)
            //                .FirstOrDefaultAsync();


            //if (Entity == "Meeting")
            //{
            //    if (_attendee != null && _attendee.ContactID != null)
            //    {
            //        _contactIDs = new List<int> { _attendee.ContactID.Value };
            //    }
            //}
            //else
            //{
            //    _contactIDs = _nextStage.IsAssignByRole?
            var _contacts = _nextStage.IsAssignByRole ?
            await sharedService.GetContactIDByRoleAsync(_nextStage.Code) :
                               await GetAssigneeByEntity(Entity, EntityID, _nextStage.Code, _nextStage.AssignByEntityProperty);




            foreach (var _assignee in _contacts)
            {
                var _task = await GetTaskByStage(Entity, EntityID, _nextStage.Code, PreviousFollowUpDate, ProjectID: ProjectID);
                _task.ContactID = _assignee;
                _task.IsPreAssignedTimeTask = _nextStage.IsPreAssignedTimeTask;
                _task.IsAssessmentRequired = _nextStage.IsAssessmentRequired;



                await Create(
                  _task,
                  _task.IsPreAssignedTimeTask,
                  false,
                  false,
                  PreviousStageCode,
                  PreviousStageRevision,
                  PreviousTaskID);



            }
        }


    }

    private async Task CompleteWFStage(int EntityID, string StageCode, int WFTaskID)
    {


        if (StageCode.Equals("SYS_TODO_COMPLETE", StringComparison.OrdinalIgnoreCase)) //Close Todo
        {
            var _entity = await db.Todos.AsNoTracking()
                         .SingleOrDefaultAsync(x => x.ID == EntityID);

            if (_entity == null) throw new EntityServiceException($"{nameof(Todo)} not found!");
            _entity.StatusFlag = McvConstant.TODO_STATUSFLAG_COMPLETED;
            db.Entry(_entity).State = EntityState.Modified;
            await db.SaveChangesAsync();

            var _meetingAgendas = await db.MeetingAgendas.AsNoTracking()
                .Where(x => !x.IsReadOnly)
     .Include(x => x.Meeting)
     .Where(x => x.TodoID != null
     && x.TodoID == _entity.ID).ToListAsync();

            var _taskComment = string.Empty;
            var _wftask = await db.WFTasks.AsNoTracking()
      .SingleOrDefaultAsync(x => x.ID == WFTaskID);
            if (_wftask != null)
            {
                _taskComment = _wftask.Comment;
            }

            var meetingAgendaService = new MeetingAgendaService(db);
            foreach (var item in _meetingAgendas)
            {
                item.PreviousHistory = await meetingAgendaService.GetMeetingAgendaHistoryString(item.ID);
                item.Comment = ($"TODO COMPLETED | {_entity.Title}-{_entity.SubTitle} \n {_taskComment}").Trim();
                item.ReminderCount = 0;
                item.UpdateFrom = "TODO";

                db.Entry(item).State = EntityState.Modified;
                await db.SaveChangesAsync();
                await AssignAgendaTasks(item.ID);
            }

        }
        else if (StageCode.Equals("SYS_TODO_DISCARD", StringComparison.OrdinalIgnoreCase)) //discard
        {
            var _entity = await db.Todos.AsNoTracking()
                         .SingleOrDefaultAsync(x => x.ID == EntityID);

            if (_entity == null) throw new EntityServiceException($"{nameof(Todo)} not found!");
            _entity.StatusFlag = McvConstant.TODO_STATUSFLAG_DROPPED;
            db.Entry(_entity).State = EntityState.Modified;
            await db.SaveChangesAsync();

            var _meetingAgendas = await db.MeetingAgendas.AsNoTracking()
                .Where(x => !x.IsReadOnly)
                .Include(x => x.Meeting)
                .Where(x => x.TodoID != null
                 && x.TodoID == _entity.ID).ToListAsync();

            foreach (var item in _meetingAgendas)
            {
                item.TodoID = null;
                db.Entry(item).State = EntityState.Modified;
                await db.SaveChangesAsync();
                await AssignAgendaTasks(item.ID);
            }

        }
        else if (StageCode.Equals("SYS_TODO_RE_ASSIGN", StringComparison.OrdinalIgnoreCase)) //reassign
        {
            var _entity = await db.Todos.AsNoTracking()
                         .SingleOrDefaultAsync(x => x.ID == EntityID);

            if (_entity == null) throw new EntityServiceException($"{nameof(Todo)} not found!");
            await StartFlow(nameof(Todo), _entity.TypeFlag, _entity.ID);

        }
        else if (StageCode.Equals("SYS_TODO_START_TIME", StringComparison.OrdinalIgnoreCase)) //Start Time
        {


            var _task = await db.WFTasks.AsNoTracking()
                .Where(x => x.ID == WFTaskID)
                .SingleOrDefaultAsync();

            if (_task == null) throw new EntityServiceException("Task not found!");

            var timeEntryService = new TimeEntryService(db);
            await timeEntryService.StartTimeLog(new TimeEntry
            {
                ContactID = _task.ContactID,
                WFTaskID = _task.ID,
                Entity = _task.Entity,
                EntityID = _task.EntityID,
                EntityTitle = _task.Subtitle,
                TaskTitle = _task.Title,
            });




        }
        //Leave
        else if (StageCode.Equals("SYS_LEAVE_APPROVE", StringComparison.OrdinalIgnoreCase))
        {
            var _entity = await db.Leaves.AsNoTracking()
                         .SingleOrDefaultAsync(x => x.ID == EntityID);

            if (_entity == null) throw new EntityServiceException($"{nameof(Leave)} not found!");
            _entity.StatusFlag = McvConstant.LEAVE_STATUSFLAG_APPROVED;
            db.Entry(_entity).State = EntityState.Modified;
            await db.SaveChangesAsync();
        }
        else if (StageCode.Equals("SYS_LEAVE_REJECT", StringComparison.OrdinalIgnoreCase))
        {
            var _entity = await db.Leaves.AsNoTracking()
                         .SingleOrDefaultAsync(x => x.ID == EntityID);

            if (_entity == null) throw new EntityServiceException($"{nameof(Leave)} not found!");
            _entity.StatusFlag = McvConstant.LEAVE_STATUSFLAG_REJECTED;
            db.Entry(_entity).State = EntityState.Modified;
            await db.SaveChangesAsync();
        }


        else if (StageCode.Equals("SYS_TODO_PAUSE_TIME", StringComparison.OrdinalIgnoreCase)) //Pause Time
        {
            var timeEntryService = new TimeEntryService(db);
            await timeEntryService.EndTimeLog(WFTaskID, true);



        }
        else if (StageCode.Equals("SYS_TODO_STOP_TIME", StringComparison.OrdinalIgnoreCase)) //Stop Time
        {
            var timeEntryService = new TimeEntryService(db);
            await timeEntryService.EndTimeLog(WFTaskID);



        }

        else if (StageCode.Equals("SYS_MEETING_DELETE", StringComparison.OrdinalIgnoreCase))
        {
            var meetingService = new MeetingService(db);
            await meetingService.Delete(EntityID);

        }
        else if (StageCode.Equals("SYS_MEETING_SEND", StringComparison.OrdinalIgnoreCase)) //Send Minutes
        {
            var meeting = await db.Meetings.AsNoTracking()
                 .Include(x => x.Attendees)
                  .Include(x => x.Agendas)
                         .SingleOrDefaultAsync(x => x.ID == EntityID);

            if (meeting == null) throw new EntityServiceException($"{nameof(Meeting)} not found!");

            var meetingService = new MeetingService(db);
            await meetingService.SendMinutes(meeting.ID);
            //             foreach (var agenda in meeting.Agendas.Where(x => x.StatusFlag == McvConstant.MEETING_AGENDA_STATUSFLAG_PENDING && x.ActionByContactID != null && !x.IsForwarded
            // //&& x.PackageID == null
            // && x.TodoID == null))
            //             {
            //                 await AssignAgendaTasks(agenda.ID);
            //             }

        }
        else if (StageCode.Equals("SYS_MEETING_RECORD_ATTENDEE_TRAVEL_TIME", StringComparison.OrdinalIgnoreCase)) //Log Travel Time
        {

        }
        else if (StageCode.Equals("SYS_SITE_VISIT_DELETE", StringComparison.OrdinalIgnoreCase))
        {
            var siteVisitService = new SiteVisitService(db);
            await siteVisitService.Delete(EntityID);

        }
        else if (StageCode.Equals("SYS_SITE_VISIT_SEND", StringComparison.OrdinalIgnoreCase)) //Send Minutes
        {
            var siteVisit = await db.SiteVisits.AsNoTracking()
                 .Include(x => x.Attendees)
                  .Include(x => x.Agendas)
                         .SingleOrDefaultAsync(x => x.ID == EntityID);

            if (siteVisit == null) throw new EntityServiceException($"{nameof(SiteVisit)} not found!");

            var siteVisitService = new SiteVisitService(db);
            await siteVisitService.SendMinutes(siteVisit.ID);
            //             foreach (var agenda in meeting.Agendas.Where(x => x.StatusFlag == McvConstant.MEETING_AGENDA_STATUSFLAG_PENDING && x.ActionByContactID != null && !x.IsForwarded
            // //&& x.PackageID == null
            // && x.TodoID == null))
            //             {
            //                 await AssignAgendaTasks(agenda.ID);
            //             }

        }
        else if (StageCode.Equals("SYS_SITE_VISIT_RECORD_ATTENDEE_TRAVEL_TIME", StringComparison.OrdinalIgnoreCase)) //Log Travel Time
        {

        }
        else if (StageCode.Equals("SYS_AGENDA_TO_TODO", StringComparison.OrdinalIgnoreCase))
        {

        }
        else if (StageCode.Equals("SYS_AGENDA_TO_PACKAGE", StringComparison.OrdinalIgnoreCase))
        {

        }
        else if (StageCode.Equals("SYS_REQUEST_TICKET_COMPLETE", StringComparison.OrdinalIgnoreCase)) //Close RequestTicket
        {
            var _entity = await db.RequestTickets.AsNoTracking()
                .Where(x => !x.IsReadOnly)
                          .SingleOrDefaultAsync(x => x.ID == EntityID);

            if (_entity == null) throw new EntityServiceException($"{nameof(RequestTicket)} not found!");

            var _task = await db.WFTasks.AsNoTracking().Where(x => x.ID == WFTaskID).SingleOrDefaultAsync();

            var requestTicketService = new RequestTicketService(db);
            await requestTicketService.SendRequestTicket(_entity.ID, McvConstant.REQUEST_TICKET_STATUSFLAG_COMPLETED, _task.Comment); //SEND CLOSURE EMAIL
        }
        else
        {

            throw new EntityServiceException($"System stage {StageCode} not found!");
        }


    }

    private async Task<IEnumerable<int>> GetAssigneeByEntity(string Entity, int EntityID, string StageCode, string Property)
    {


        if (Entity.Equals(nameof(Todo), StringComparison.OrdinalIgnoreCase))
        {
            var todo = await db.Todos.AsNoTracking()
            .Where(x => x.ID == EntityID).SingleOrDefaultAsync();

            if (todo == null) throw new EntityServiceException($"{nameof(Todo)} not found!");

            var _list = new HashSet<int>();

            if (StageCode.Equals("TODO_BRIEF", StringComparison.OrdinalIgnoreCase) //Accept Todo
            || StageCode.Equals("TODO_WORK", StringComparison.OrdinalIgnoreCase)//Todo Work
            || StageCode.Equals("TODO_REVIEW", StringComparison.OrdinalIgnoreCase)//Acknowledge
            || StageCode.Equals("TODO_RE_ASSIGN", StringComparison.OrdinalIgnoreCase)//Reassign
            || StageCode.Equals("TODO_SUBMISSION", StringComparison.OrdinalIgnoreCase))//Submission
            {
                foreach (var prop in Property.Split(','))
                {
                    var _type = DataTools.GetPropertyType(todo, prop);
                    if (_type == typeof(int))
                    {
                        _list.Add((int)DataTools.GetPropertyValue(todo, prop));
                    }
                }
            }
            else
            {
                throw new EntityServiceException($"{nameof(Todo)} Task assignee not found for stage {StageCode}!");
            }

            return _list;
        }
        else if (Entity.Equals(nameof(Meeting), StringComparison.OrdinalIgnoreCase))
        {
            var meeting = await db.Meetings.AsNoTracking()
           .Where(x => !x.IsDeleted)

           .Where(x => x.ID == EntityID).SingleOrDefaultAsync();

            if (meeting == null) throw new EntityServiceException($"{nameof(Meeting)} not found!");

            var _list = new List<int>();

            if (StageCode.Equals("MEETING_PREPARE_MINUTES", StringComparison.OrdinalIgnoreCase))//Prepare Minutes Time
            {
                foreach (var prop in Property.Split(','))
                {
                    var _type = DataTools.GetPropertyType(meeting, prop);
                    if (_type == typeof(int))
                    {
                        _list.Add((int)DataTools.GetPropertyValue(meeting, prop));
                    }
                }

                //var _attendees = await db.MeetingAttendees.AsNoTracking()
                // .Where(x => x.MeetingID == EntityID)
                //  .Where(x => x.OrderFlag == 0)
                //  .Where(x => db.Contacts.Where(c => c.Username != null)
                //   .Select(c => c.ID).Any(c => c == x.ContactID))
                //  .Select(x => x.ContactID)
                //  .ToListAsync();

                //var _contacts = new List<int>();

                //foreach (var i in _attendees)
                //    _contacts.Add(i.Value);

                //if (!_contacts.Any(x => x == meeting.ContactID))
                //    _contacts.Add(meeting.ContactID);

                var _attendee = await db.MeetingAttendees.AsNoTracking()
                    .Where(x => x.MeetingID == EntityID)
                    .Where(x => x.TypeFlag == McvConstant.MEETING_ATTENDEE_INTERNAL)
                    .Where(x => x.OrderFlag == 0)
                    .FirstOrDefaultAsync();

                IEnumerable<int> _contactIDs = Enumerable.Empty<int>();
                if (_attendee != null && _attendee.ContactID != null)
                {
                    _contactIDs = new List<int> { _attendee.ContactID.Value };
                }


                return _contactIDs;
            }
            else if (StageCode.Equals("CNOTE_PREPARE", StringComparison.OrdinalIgnoreCase))
            {
                foreach (var prop in Property.Split(','))
                {
                    var _type = DataTools.GetPropertyType(meeting, prop);
                    if (_type == typeof(int))
                    {
                        _list.Add((int)DataTools.GetPropertyValue(meeting, prop));
                    }
                }
            }
            else if (StageCode.Equals("MEETING_TRAVEL_TIME", StringComparison.OrdinalIgnoreCase))//Log Travel time
            {
                foreach (var prop in Property.Split(','))
                {
                    var _type = DataTools.GetPropertyType(meeting, prop);
                    if (_type == typeof(int))
                    {
                        _list.Add((int)DataTools.GetPropertyValue(meeting, prop));
                    }
                }


                var _attendee = await db.MeetingAttendees.AsNoTracking()
                    .Where(x => x.MeetingID == EntityID)
                    .Where(x => x.TypeFlag == 0)
                    .Where(x => x.OrderFlag == 0)
                    .FirstOrDefaultAsync();

                IEnumerable<int> _contactIDs = Enumerable.Empty<int>();
                if (_attendee != null && _attendee.ContactID != null)
                {
                    _contactIDs = new List<int> { _attendee.ContactID.Value };
                }

                return _contactIDs;

            }
            else if (StageCode.Equals("MEETING_CLOSURE", StringComparison.OrdinalIgnoreCase))//Log Travel time
            {
                foreach (var prop in Property.Split(','))
                {
                    var _type = DataTools.GetPropertyType(meeting, prop);
                    if (_type == typeof(int))
                    {
                        _list.Add((int)DataTools.GetPropertyValue(meeting, prop));
                    }
                }

                var _contactID = await db.WFTasks
                                .Where(x => x.EntityID == EntityID && x.WFStageCode == "MEETING_TRAVEL_TIME")
                                .Select(x => x.ContactID)
                                .FirstOrDefaultAsync();


                var _leader = await db.ContactTeams.AsNoTracking()
                              .Where(x => x.Members.Any(y => y.ContactID == _contactID))
                              .Select(x => x.LeaderID)
                              .FirstOrDefaultAsync();

                IEnumerable<int> _contactIDs = Enumerable.Empty<int>();
                if (_leader != null)
                {
                    _contactIDs = new List<int> { _leader.Value };
                }

                return _contactIDs;

                //var _attendees = await db.MeetingAttendees.AsNoTracking()
                //  .Where(x => x.MeetingID == EntityID)
                //   .Where(x => x.TypeFlag == 0)
                //   .Where(x => db.Contacts.Where(c => c.Username != null)
                //    .Select(c => c.ID).Any(c => c == x.ContactID))
                //   .Select(x => x.ContactID)
                //   .ToListAsync();

                //var _contacts = new List<int>();

                //foreach (var i in _attendees)
                //    _contacts.Add(i.Value);

                //if (!_contacts.Any(x => x == meeting.ContactID))
                //    _contacts.Add(meeting.ContactID);

                //return _contacts;

            }
            else
            {
                throw new EntityServiceException($"{nameof(Meeting)} Task assignee not found for stage {StageCode}!");
            }
            return _list;

        }
        else if (Entity.Equals(nameof(MeetingAgenda), StringComparison.OrdinalIgnoreCase))
        {
            var meetingAgenda = await db.MeetingAgendas.AsNoTracking()
            .Where(x => x.ID == EntityID).SingleOrDefaultAsync();

            if (meetingAgenda == null) throw new EntityServiceException($"{nameof(Meeting)} not found!");

            var _list = new List<int>();
            if (StageCode.Equals("AGENDA_ACTION", StringComparison.OrdinalIgnoreCase))//Log Travel time
            {

                if (await db.Contacts
                .Where(c => c.Username != null)
                .Select(c => c.ID).AnyAsync(x => x == meetingAgenda.ActionByContactID))
                    _list.Add(meetingAgenda.ActionByContactID.Value);

                if (meetingAgenda.ProjectID != null)
                {
                    var _projectAssociates = await db.ProjectAssociations.AsNoTracking()
                        .Where(x => x.ProjectID == meetingAgenda.ProjectID)
                        .Where(x => x.TypeFlag == 0 || x.TypeFlag == 1)
                        .Select(x => x.ContactID)
                        .ToListAsync();

                    _list = _list.Concat(_projectAssociates).ToList();
                }
            }
            else
            {
                throw new EntityServiceException($"{nameof(MeetingAgenda)} Task assignee not found for stage {StageCode}!");
            }
            return _list;
        }
        else if (Entity.Equals(nameof(SiteVisit), StringComparison.OrdinalIgnoreCase))
        {
            var siteVisit = await db.SiteVisits.AsNoTracking()
           .Where(x => !x.IsDeleted)

           .Where(x => x.ID == EntityID).SingleOrDefaultAsync();

            if (siteVisit == null) throw new EntityServiceException($"{nameof(SiteVisit)} not found!");

            var _list = new List<int>();

            if (StageCode.Equals("SITE_VISIT_PREPARE_MINUTES", StringComparison.OrdinalIgnoreCase)//Prepare Minutes SiteVisit
            || StageCode.Equals("CNOTE_PREPARE", StringComparison.OrdinalIgnoreCase)//Prepare Minutes CNOTE
            )
            {
                foreach (var prop in Property.Split(','))
                {
                    var _type = DataTools.GetPropertyType(siteVisit, prop);
                    if (_type == typeof(int))
                    {
                        _list.Add((int)DataTools.GetPropertyValue(siteVisit, prop));
                    }
                }
            }
            else if (StageCode.Equals("SITE_VISIT_TRAVEL_TIME", StringComparison.OrdinalIgnoreCase))//Log Travel time
            {
                foreach (var prop in Property.Split(','))
                {
                    var _type = DataTools.GetPropertyType(siteVisit, prop);
                    if (_type == typeof(int))
                    {
                        _list.Add((int)DataTools.GetPropertyValue(siteVisit, prop));
                    }
                }


                var _attendees = await db.SiteVisitAttendees.AsNoTracking()
                  .Where(x => x.SiteVisitID == EntityID)
                   .Where(x => x.TypeFlag == 0)
                   .Where(x => db.Contacts.Where(c => c.Username != null)
                    .Select(c => c.ID).Any(c => c == x.ContactID))
                   .Select(x => x.ContactID)
                   .ToListAsync();

                var _contacts = new List<int>();

                foreach (var i in _attendees)
                    _contacts.Add(i.Value);

                if (!_contacts.Any(x => x == siteVisit.ContactID))
                    _contacts.Add(siteVisit.ContactID);

                return _contacts;

            }
            else
            {
                throw new EntityServiceException($"{nameof(SiteVisit)} Task assignee not found for stage {StageCode}!");
            }
            return _list;

        }
        else if (Entity.Equals(nameof(SiteVisitAgenda), StringComparison.OrdinalIgnoreCase))
        {
            var siteVisitAgenda = await db.SiteVisitAgendas.AsNoTracking()
            .Where(x => x.ID == EntityID).SingleOrDefaultAsync();

            if (siteVisitAgenda == null) throw new EntityServiceException($"{nameof(SiteVisit)} not found!");

            var _list = new List<int>();
            if (StageCode.Equals("AGENDA_ACTION", StringComparison.OrdinalIgnoreCase))//Log Travel time
            {

                if (await db.Contacts
                .Where(c => c.Username != null)
                .Select(c => c.ID).AnyAsync(x => x == siteVisitAgenda.ActionByContactID))
                    _list.Add(siteVisitAgenda.ActionByContactID.Value);

                if (siteVisitAgenda.ProjectID != null)
                {
                    var _projectAssociates = await db.ProjectAssociations.AsNoTracking()
                        .Where(x => x.ProjectID == siteVisitAgenda.ProjectID)
                        .Where(x => x.TypeFlag == 0 || x.TypeFlag == 1)
                        .Select(x => x.ContactID)
                        .ToListAsync();

                    _list = _list.Concat(_projectAssociates).ToList();
                }
            }
            else
            {
                throw new EntityServiceException($"{nameof(SiteVisitAgenda)} Task assignee not found for stage {StageCode}!");
            }
            return _list;
        }
        else if (Entity.Equals(nameof(RequestTicket), StringComparison.OrdinalIgnoreCase))
        {
            var request = await db.RequestTickets.AsNoTracking()
                .Where(x => !x.IsReadOnly)
           //.Include(x => x.Assignee)
           .Include(x => x.AssignerContact)
           .Where(x => x.ID == EntityID).SingleOrDefaultAsync();

            if (request == null) throw new EntityServiceException($"{nameof(RequestTicket)} not found!");

            var _list = new List<int>();

            if (StageCode.Equals("REQUEST_TICKET_FOLLOW_UP", StringComparison.OrdinalIgnoreCase)) //Accept RequestTicket
            {
                foreach (var prop in Property.Split(','))
                {
                    var _type = DataTools.GetPropertyType(request, prop);
                    if (_type == typeof(int))
                    {
                        _list.Add((int)DataTools.GetPropertyValue(request, prop));
                    }
                }
            }
            else
            {
                throw new EntityServiceException($"{nameof(RequestTicket)} Task assignee not found for stage {StageCode}!");
            }

            return _list;

        }
        else if (Entity.Equals(nameof(Leave), StringComparison.OrdinalIgnoreCase))
        {
            var leave = await db.Leaves.AsNoTracking()
            .Where(x => x.ID == EntityID).SingleOrDefaultAsync();
            if (leave == null) throw new EntityServiceException($"{nameof(Leave)} not found!");

            var _list = new HashSet<int>();
            if (StageCode.Equals("LEAVE_APPROVAL", StringComparison.OrdinalIgnoreCase))
            {
                foreach (var prop in Property.Split(','))
                {
                    var _type = DataTools.GetPropertyType(leave, prop);
                    if (_type == typeof(int))
                    {
                        _list.Add((int)DataTools.GetPropertyValue(leave, prop));
                    }
                }
            }
            else
            {
                throw new EntityServiceException($"{nameof(Leave)} Task assignee not found for stage {StageCode}!");
            }

            return _list;
        }

        throw new EntityServiceException($"Task assignee logic for {Entity} not found");
    }


    private async Task<WFTask> GetTaskByStage(string Entity, int EntityID, string StageCode, DateTime? FollowUpDate = null, int? ProjectID = null)
    {

        var _stage = await db.WFStages.AsNoTracking()
            .Where(x => x.Code == StageCode)
            .SingleOrDefaultAsync();
        if (_stage == null) throw new EntityServiceException($"Workflow stage not found!");

        var _task = new WFTask
        {
            Title = _stage.TaskTitle,
            Entity = Entity,
            EntityID = EntityID,
            WFStageCode = _stage.Code,
            ProjectID = ProjectID,
        };
        _task.StartDate = DateTime.UtcNow;

        if (_stage.Code == "TODO_BRIEF") //Accept
        {
            var _entity = await db.Todos.AsNoTracking()
           .SingleOrDefaultAsync(x => x.ID == EntityID);

            if (_entity == null) throw new EntityServiceException($"{nameof(Todo)} not found!");


            _task.Subtitle = $"{_entity.Title} | {_entity.SubTitle}";
            _task.DueDate = DateTime.UtcNow.AddHours(1);
            _task.AssignerContactID = _entity.AssignerContactID;
            _task.Priority = _entity.Priority;

            return _task;
        }
        else if (_stage.Code == "TODO_WORK")//Work
        {
            var _entity = await db.Todos.AsNoTracking()
           .SingleOrDefaultAsync(x => x.ID == EntityID);

            if (_entity == null) throw new EntityServiceException($"{nameof(Todo)} not found!");
            _task.Subtitle = $"{_entity.Title} | {_entity.SubTitle}";
            _task.StartDate = _entity.DueDate.AddHours(0 - Decimal.ToDouble(_entity.MHrAssigned));
            _task.DueDate = _entity.DueDate;
            _task.Priority = _entity.Priority;
            _task.MHrAssigned = _entity.MHrAssigned;
            _task.AssignerContactID = _entity.AssignerContactID;

            _task.ProjectID = ProjectID;

            return _task;
        }
        else if (_stage.Code == "TODO_REVIEW")//Review
        {
            var _entity = await db.Todos.AsNoTracking()
          .SingleOrDefaultAsync(x => x.ID == EntityID);

            if (_entity == null) throw new EntityServiceException($"{nameof(Todo)} not found!");

            var sharedService = new SharedService(db);
            //var _endTimespan = TimeSpan.Parse(await sharedService.GetPresetValue(McvConstant.OFFICE_CLOSE_TIME));
            //var _nextDayEndIST = ClockTools.GetIST(_entity.DueDate.AddDays(1)).Date.AddMilliseconds(_endTimespan.TotalMilliseconds);
            //var _nextDue = ClockTools.GetUTC(_nextDayEndIST);
            _task.Subtitle = $"{_entity.Title} | {_entity.SubTitle}";
            _task.StartDate = DateTime.UtcNow;
            _task.DueDate = _entity.DueDate;
            _task.Priority = _entity.Priority;

            _task.AssignerContactID = _entity.AssigneeContactID;

            _task.ProjectID = ProjectID;

            return _task;
        }
        else if (_stage.Code == "TODO_RE_ASSIGN")//Reassign
        {
            var _entity = await db.Todos.AsNoTracking()
        .SingleOrDefaultAsync(x => x.ID == EntityID);

            if (_entity == null) throw new EntityServiceException($"{nameof(Todo)} not found!");
            //var _endTimespan = TimeSpan.Parse(await GetPresetValue(McvConstant.OFFICE_CLOSE_TIME));

            //var _dueToday = ClockTools.GetUTC(ClockTools.GetIST(DateTime.UtcNow).Date.AddMilliseconds(_endTimespan.TotalMilliseconds));
            _task.Subtitle = $"{_entity.Title} | {_entity.SubTitle}";
            _task.StartDate = DateTime.UtcNow;
            _task.DueDate = DateTime.UtcNow.AddHours(1);
            _task.Priority = _entity.Priority;
            _task.ProjectID = ProjectID;

            return _task;
        }
        else if (_stage.Code == "TODO_SUBMISSION")
        {
            var _entity = await db.Todos.AsNoTracking()
          .SingleOrDefaultAsync(x => x.ID == EntityID);
            if (_entity == null) throw new EntityServiceException($"{nameof(Todo)} not found!");
            _task.Subtitle = $"{_entity.Title} | {_entity.SubTitle}";
            _task.StartDate = DateTime.UtcNow;
            _task.DueDate = DateTime.UtcNow.AddHours(1);
            _task.Priority = _entity.Priority;
            _task.AssignerContactID = _entity.AssignerContactID;
            _task.ProjectID = ProjectID;

            return _task;
        }
        else if (_stage.Code == "MEETING_TRAVEL_TIME") //Record Meeting travel time
        {
            var _entity = await db.Meetings.AsNoTracking().SingleOrDefaultAsync(x => x.ID == EntityID);
            if (_entity == null) throw new EntityServiceException($"{nameof(Meeting)} not found!");

            var sharedService = new SharedService(db);
            _task.Subtitle = $"{_entity.Title} | {ClockTools.GetIST(_entity.StartDate).ToString("dd MMM yyyy")}";
            _task.StartDate = DateTime.UtcNow;
            _task.DueDate = ClockTools.GetUTC(ClockTools.GetIST(_entity.EndDate.AddDays(1)).Date
                    .AddMinutes(await sharedService.GetBusinessEndMinutesIST()));
            _task.MHrAssigned = 0;
            _task.AssignerContactID = _entity.ContactID;
            _task.IsPreAssignedTimeTask = false;

            return _task;
        }
        else if (_stage.Code == "MEETING_CLOSURE")
        {
            var _entity = await db.Meetings.AsNoTracking().SingleOrDefaultAsync(x => x.ID == EntityID);
            if (_entity == null) throw new EntityServiceException($"{nameof(Meeting)} not found!");

            var sharedService = new SharedService(db);
            _task.Subtitle = $"{_entity.Title} | {ClockTools.GetIST(_entity.StartDate).ToString("dd MMM yyyy")}";
            _task.StartDate = DateTime.UtcNow;
            _task.DueDate = ClockTools.GetUTC(ClockTools.GetIST(_entity.EndDate.AddDays(1)).Date
                    .AddMinutes(await sharedService.GetBusinessEndMinutesIST()));
            _task.MHrAssigned = 0;
            _task.IsPreAssignedTimeTask = false;

            return _task;
        }
        else if (_stage.Code == "MEETING_PREPARE_MINUTES"//Prepare Minutes Meeting
            || _stage.Code == "CNOTE_PREPARE")//Prepare Minutes CNOTE
        {
            var _entity = await db.Meetings.AsNoTracking().SingleOrDefaultAsync(x => x.ID == EntityID);
            if (_entity == null) throw new EntityServiceException($"{nameof(Meeting)} not found!");

            var sharedService = new SharedService(db);
            _task.Subtitle = $"{_entity.Title} | {ClockTools.GetIST(_entity.StartDate).ToString("dd MMM yyyy")}";
            _task.StartDate = DateTime.UtcNow;
            _task.DueDate = ClockTools.GetUTC(ClockTools.GetIST(_entity.EndDate.AddDays(1)).Date
                    .AddMinutes(await sharedService.GetBusinessEndMinutesIST()));
            _task.MHrAssigned = 0;
            _task.IsPreAssignedTimeTask = false;

            return _task;
        }
        else if (_stage.Code == "AGENDA_ACTION")

        {
            var _entity = await db.MeetingAgendas.AsNoTracking()
                .Include(x => x.Meeting)
            .SingleOrDefaultAsync(x => x.ID == EntityID);

            if (_entity == null) throw new EntityServiceException($"{nameof(MeetingAgenda)} not found!");

            var sharedService = new SharedService(db);
            //var _startTimeSpan = TimeSpan.Parse(await sharedService.GetPresetValue(McvConstant.OFFICE_OPEN_TIME));
            var _endTimeSpan = TimeSpan.Parse(await sharedService.GetPresetValue(McvConstant.OFFICE_CLOSE_TIME));

            var _nextDue = ClockTools.GetUTC(ClockTools.GetIST(_entity.Meeting.StartDate.AddDays(1)).Date.AddMinutes(_endTimeSpan.TotalMinutes));

            _task.Subtitle = $"{_entity.MeetingTitle}-{_entity.Title}-{_entity.Subtitle}";
            _task.ContactID = _entity.ActionByContactID.Value;
            _task.StartDate = ClockTools.GetUTC(ClockTools.GetIST(_nextDue.AddDays(-1)).Date
                    .AddMinutes(await sharedService.GetBusinessStartMinutesIST()));
            _task.DueDate = ClockTools.GetUTC(ClockTools.GetIST(_nextDue).Date
                    .AddMinutes(await sharedService.GetBusinessEndMinutesIST()));
            _task.MHrAssigned = 0;
            _task.IsPreAssignedTimeTask = false;

            return _task;
        }
        else if (_stage.Code == "SITE_VISIT_TRAVEL_TIME") //Record SiteVisit travel time
        {
            var _entity = await db.SiteVisits.AsNoTracking().SingleOrDefaultAsync(x => x.ID == EntityID);
            if (_entity == null) throw new EntityServiceException($"{nameof(SiteVisit)} not found!");

            var sharedService = new SharedService(db);
            _task.Subtitle = $"{_entity.Title} | {ClockTools.GetIST(_entity.StartDate).ToString("dd MMM yyyy")}";
            _task.StartDate = DateTime.UtcNow;
            _task.DueDate = ClockTools.GetUTC(ClockTools.GetIST(_entity.EndDate.AddDays(1)).Date
                    .AddMinutes(await sharedService.GetBusinessEndMinutesIST()));
            _task.MHrAssigned = 0;
            _task.IsPreAssignedTimeTask = false;

            return _task;
        }
        else if (_stage.Code == "SITE_VISIT_PREPARE_MINUTES"//Prepare Minutes SiteVisit
            || _stage.Code == "CNOTE_PREPARE")//Prepare Minutes CNOTE
        {
            var _entity = await db.SiteVisits.AsNoTracking().SingleOrDefaultAsync(x => x.ID == EntityID);
            if (_entity == null) throw new EntityServiceException($"{nameof(SiteVisit)} not found!");

            var sharedService = new SharedService(db);
            _task.Subtitle = $"{_entity.Title} | {ClockTools.GetIST(_entity.StartDate).ToString("dd MMM yyyy")}";
            _task.StartDate = DateTime.UtcNow;
            _task.DueDate = ClockTools.GetUTC(ClockTools.GetIST(_entity.EndDate.AddDays(1)).Date
                    .AddMinutes(await sharedService.GetBusinessEndMinutesIST()));
            _task.MHrAssigned = 0;
            _task.IsPreAssignedTimeTask = false;

            return _task;
        }
        else if (_stage.Code == "REQUEST_TICKET_FOLLOW_UP")//RT Follow-Up
        {
            var _entity = await db.RequestTickets.AsNoTracking()
                .Where(x => !x.IsReadOnly)
           .SingleOrDefaultAsync(x => x.ID == EntityID);

            if (_entity == null) throw new EntityServiceException($"{nameof(RequestTicket)} not found!");
            var sharedService = new SharedService(db);
            //var _startTimeSpan = TimeSpan.Parse(await sharedService.GetPresetValue(McvConstant.OFFICE_OPEN_TIME));
            var _endTimeSpan = TimeSpan.Parse(await sharedService.GetPresetValue(McvConstant.OFFICE_CLOSE_TIME));

            var _nextDue = ClockTools.GetUTC(ClockTools.GetIST(_entity.NextReminderDate).Date.AddMinutes(_endTimeSpan.TotalMinutes));

            _task.Subtitle = $"{_entity.Code}-{_entity.Title}{(!string.IsNullOrEmpty(_entity.Subtitle) ? "-" + _entity.Subtitle : "")}";
            _task.ContactID = _entity.AssignerContactID;
            _task.StartDate = ClockTools.GetUTC(ClockTools.GetIST(_nextDue.AddDays(-1)).Date
                    .AddMinutes(await sharedService.GetBusinessStartMinutesIST()));
            _task.DueDate = ClockTools.GetUTC(ClockTools.GetIST(_nextDue).Date
                    .AddMinutes(await sharedService.GetBusinessEndMinutesIST()));
            _task.MHrAssigned = 0;
            _task.IsPreAssignedTimeTask = false;

            return _task;
        }
        else
        {
            throw new EntityServiceException($"Workflow stage not found!");
        }


    }

    public async Task UpdateTaskDue(string Entity, int EntityID)
    {

        var _pendingTasks = await db.WFTasks.AsNoTracking()
                         .Where(x => x.Entity == Entity
                                    && x.EntityID == EntityID)
                       .Where(x => x.StatusFlag == McvConstant.WFTASK_STATUSFLAG_PENDING || x.StatusFlag == McvConstant.WFTASK_STATUSFLAG_STARTED || x.StatusFlag == McvConstant.WFTASK_STATUSFLAG_PAUSED)
                         .ToListAsync();

        foreach (var _task in _pendingTasks)
        {
            var _referenceTask = await GetTaskByStage(Entity, EntityID, _task.WFStageCode);

            _task.MHrAssigned = _referenceTask.MHrAssigned;
            _task.StartDate = _referenceTask.StartDate;
            _task.DueDate = _referenceTask.DueDate;
            _task.Priority = _referenceTask.Priority;
            //re-calculate if MHrAssigned changed
            _task.VHrAssigned = _task.MHrAssigned * _task.ManValue;
            _task.VHrAssignedCost = _task.VHrAssigned * _task.VHrRate;

            db.Entry(_task).State = EntityState.Modified;


        }
        await db.SaveChangesAsync();

    }

    public async Task ValidateTaskFlow(string Entity, int EntityTypeFlag, int EntityID)
    {


        var _tasks = await db.WFTasks.AsNoTracking()
                     .Where(x => x.Entity == Entity
                     && x.EntityID == EntityID)
                     .ToListAsync();

        if (!_tasks.Any())
        {
            await StartFlow(Entity, EntityTypeFlag, EntityID);

        }
        else if (!_tasks.Where(x => x.StatusFlag != 1 && x.StatusFlag != -1).Any())
        {

            var _lastCompletedTask = _tasks.Where(x => x.StatusFlag == 1)
                .OrderByDescending(x => x.CompletedDate)
                .FirstOrDefault();

            if (_lastCompletedTask != null && _lastCompletedTask.WFStageCode != null)
            {

                try
                {
                    await CompleteTaskStage(_lastCompletedTask.ID);


                }
                catch (Exception e)
                {
                    _lastCompletedTask.OutcomeFlag = 0;
                    _lastCompletedTask.StatusFlag = 0;

                    db.Entry(_lastCompletedTask).State = EntityState.Modified;
                    await db.SaveChangesAsync();
                }


            }
        }


    }

    public async Task AssignAgendaTasks(int agendaID)
    {

        var _agenda = await db.MeetingAgendas
            .SingleOrDefaultAsync(x => x.ID == agendaID);
        if (_agenda == null || _agenda.IsReadOnly) return;

        // var _activeProjectIDs = await db.Projects.AsNoTracking()
        // //    .Where(x =>
        // //       x.StatusFlag == McvConstant.PROJECT_STATUSFLAG_ONGOING //Inquiry
        // //    || x.StatusFlag == McvConstant.PROJECT_STATUSFLAG_COMPLETED  //inprogress
        // //                                                                  //|| x.StatusFlag == 6 //locked
        // //    )
        //    .Select(x => x.ID).ToListAsync();

        // if (_agenda.TypeFlag == McvConstant.MEETING_TYPEFLAG_INSPECTION
        //    || _agenda.StatusFlag != 0
        //    || _agenda.ActionByContactID == null
        //    || _agenda.IsForwarded
        //    || _agenda.TodoID != null
        //    || (_agenda.ProjectID != null && !_activeProjectIDs.Any(p => p == _agenda.ProjectID))
        //    )
        // {
        //     await CompleteAgendaTasks(_agenda.ID);
        //     return;
        // }

        //if (_agenda.PackageID != null)
        //{
        //    var _package = await db.Packages.AsNoTracking().Where(x => x.ID == _agenda.PackageID).FirstOrDefaultAsync();

        //    if (_package != null && _package.StatusFlag == 0)
        //    {
        //        await CompleteAgendaTasks(_agenda.ID);
        //        return;
        //    }

        //}


        if (!await db.Contacts
            .Where(c => c.Username != null)
            .Select(c => c.ID).AnyAsync(c => c == _agenda.ActionByContactID))
        {
            await CompleteAgendaTasks(_agenda.ID); return;
        }
        //Check if current agenda task is pending


        if (_agenda.PreviousAgendaID != null)
        {
            var _previousAgenda = await db.MeetingAgendas.AsNoTracking()
                .Where(x => !x.IsReadOnly)
            .SingleOrDefaultAsync(x => x.ID == _agenda.PreviousAgendaID);
            if (_previousAgenda != null)
            {
                //Check if previous agenda task is pending
                await CompleteAgendaTasks(_previousAgenda.ID);
            }
        }

        //_agenda.PackageID = null;
        _agenda.TodoID = null;
        _agenda.IsForwarded = false;
        await db.SaveChangesAsync();

        await StartFlow(nameof(MeetingAgenda), _agenda.TypeFlag, _agenda.ID);

    }
    private async Task CompleteAgendaTasks(int agendaID)
    {

        var _currentAgendaTasks = await db.WFTasks
            .Where(x => x.Entity == nameof(MeetingAgenda)
        && x.EntityID == agendaID
        && x.StatusFlag != McvConstant.WFTASK_STATUSFLAG_COMPLETED).ToListAsync();

        if (_currentAgendaTasks.Any())
        {

            foreach (var task in _currentAgendaTasks)
            {
                task.StatusFlag = 1;
                task.Comment = "Agenda Updated";
                task.CompletedDate = DateTime.UtcNow;


                await db.SaveChangesAsync();
            }
        }

    }
}
