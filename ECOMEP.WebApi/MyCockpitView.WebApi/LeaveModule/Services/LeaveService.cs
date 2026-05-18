using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.ContactModule.Services;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.WebApi.LeaveModule.Entities;
using MyCockpitView.WebApi.Services;
using MyCockpitView.WebApi.WFTaskModule.Entities;
using MyCockpitView.WebApi.WFTaskModule.Services;

namespace MyCockpitView.WebApi.LeaveModule.Services;

public interface ILeaveService : IBaseEntityService<Leave>
{
    Task<IEnumerable<Leave>> GetSplitLeave(Leave Entity);
    Task ValidateOverlapp(Leave Entity);
    Task<decimal> GetTotalLeaveDurationIST(DateTime StartIST, DateTime EndIST);
    Task ValidateApplication(Leave Entity, bool IsSelfApplied);
    Task<IEnumerable<LeaveSummary>> GetPerMonthSummary(int contactID, int index = 0);
    Task<LeaveSummary> GetTotalSummary(int contactID, int index = 0);
    Task<LeaveSummary> GetMonthSummary(int contactID, int year, int month);
}

public class LeaveService : BaseEntityService<Leave>, ILeaveService
{
    public LeaveService(EntitiesContext db) : base(db)
    { }

    public IQueryable<Leave> Get(IEnumerable<QueryFilter> Filters = null, string Search = null, string Sort = null)
    {

        IQueryable<Leave> _query = base.Get(Filters);


        //Apply filters
        if (Filters != null)
        {


            if (Filters.Where(x => x.Key.Equals("contactID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<Leave>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("contactID", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(x => x.ContactID == isNumeric);
                }
                _query = _query.Where(predicate);
            }

            if (Filters.Where(x => x.Key.Equals("CreatedDate", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _item = Filters.First(x => x.Key.Equals("CreatedDate", StringComparison.OrdinalIgnoreCase));
                DateTime result = Convert.ToDateTime(_item.Value);
                //_query = _query.here(x => DbFunctions.TruncateTime(x.Created) == DbFunctions.TruncateTime(result));

            }

            if (Filters.Where(x => x.Key.Equals("rangestart", StringComparison.OrdinalIgnoreCase)).Any())
            {

                var _item = Filters.First(x => x.Key.Equals("rangestart", StringComparison.OrdinalIgnoreCase));

                DateTime result = Convert.ToDateTime(_item.Value);
                _query = _query.Where(x => x.Start >= result || x.End >= result);

            }

            if (Filters.Where(x => x.Key.Equals("rangeend", StringComparison.OrdinalIgnoreCase)).Any())
            {

                var _item = Filters.First(x => x.Key.Equals("rangeend", StringComparison.OrdinalIgnoreCase));

                DateTime result = Convert.ToDateTime(_item.Value);
                var end = result.AddDays(1);
                _query = _query.Where(x => x.Start < end || x.End < end);

            }

            if (Filters.Where(x => x.Key.Equals("timelineRangeStart", StringComparison.OrdinalIgnoreCase)).Any()
                && Filters.Where(x => x.Key.Equals("timelineRangeEnd", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var start = Convert.ToDateTime(Filters.First(x => x.Key.Equals("timelineRangeStart", StringComparison.OrdinalIgnoreCase)).Value);

                var end = Convert.ToDateTime(Filters.First(x => x.Key.Equals("timelineRangeEnd", StringComparison.OrdinalIgnoreCase)).Value);

                _query = _query.Where(x =>
                (x.Start >= start && x.Start < end) //start is within range
                || (x.End > start && x.End <= end) //end is within range
                || (x.Start <= start && x.End >= end) // range contains the entire period
                );
            }

            if (Filters.Where(x => x.Key.Equals("TeamID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var teamIds = Filters
                    .Where(f => f.Key.Equals("TeamID", StringComparison.OrdinalIgnoreCase))
                    .Select(f => Convert.ToInt32(f.Value))
                    .ToList();

                _query = _query
                .Where(x =>
                    (x.Contact != null &&
                     x.Contact.TeamMemberships.Any(tm => teamIds.Contains(tm.ContactTeamID)))
                 );
            }
        }

        if (Search != null && Search != String.Empty)
        {
            _query = _query.Include(x => x.Contact)
          .Where(x => (x.Contact.FirstName + " " + x.Contact.LastName).ToLower().Contains(Search.ToLower()));

        }

        return _query
          .OrderByDescending(x => x.Start);

    }

    public async Task<Leave?> GetById(int Id)
    {

        return await db.Leaves.AsNoTracking()
             .Include(x => x.Contact)
             .Include(x => x.Attachments)
             .SingleOrDefaultAsync(i => i.ID == Id);

    }



    public async Task<LeaveSummary> GetMonthSummary(int contactID, int year, int month)
    {

        var _employeeAppointment = await db.ContactAppointments.AsNoTracking()
          .Where(x => !x.IsDeleted)
          //.Where(x=>x.StatusFlag==McvConstant.APPOINTMENT_STATUSFLAG_APPOINTED)
          .Where(x => x.ContactID == contactID)
          .OrderBy(x => x.JoiningDate)
          .FirstOrDefaultAsync();

        var sharedService = new SharedService(db); ;
        //var _leavesPermissible = Convert.ToDecimal((await sharedService.GetPresetValue(McvConstant.LEAVE_PERMISSIBLE_TOTAL)));
        //var _emergencyPermissible = Convert.ToDecimal((await sharedService.GetPresetValue(McvConstant.LEAVE_PERMISSIBLE_EMERGENCY)));


        //var _joiningDate = ClockTools.GetIST(_employeeAppointment.JoiningDate);
        //var _joiningMonth = new DateTime(_joiningDate.Year, _joiningDate.Month, 1);
        var _joiningDate = new DateTime(2025, 4, 1);
        var _joiningMonth = new DateTime(_joiningDate.Year, _joiningDate.Month, 1);

        var _start = new DateTime(year, _joiningDate.Month, 1);

        var _end = _start.AddYears(1);
        var _currentMonth = new DateTime(year, month, 1);

        if (_currentMonth < _start) //cycle start from previous year
        {
            _start = _start.AddYears(-1);
            _end = _start.AddYears(1);
        }

        if (_start.Year < 2023)
        { //old cycle
            _start = new DateTime(2023, 1, 1);
            _end = (new DateTime(2023, _joiningDate.Month, 1));//.AddDays(-1)
                                                               //_leavesPermissible = (_end.Month - 1) * (_leavesPermissible / 12);
                                                               //_emergencyPermissible = (_end.Month - 1) * (_emergencyPermissible / 12);
        }

        var _query = await db.Leaves.AsNoTracking()
                            .Where(x => !x.IsDeleted)
                          .Where(x => x.Start.Year == _currentMonth.Year
                                        && x.Start.Month == _currentMonth.Month)
                           .Where(x => x.ContactID == contactID && x.StatusFlag == 1)
                           .ToListAsync();



        return new LeaveSummary
        {
            Month = _currentMonth.Month,
            Year = _currentMonth.Year,
            LeaveEligible = 1,
            Label = _currentMonth.ToString("MMM"), //(ClockTools.GetMonthName(_OfficeStart.Month)).Substring(0, 3),
            LeaveCycle = $"{_start.ToString("MMM")} {_start.Year} - {_end.AddDays(-1).ToString("MMM")} {_end.AddDays(-1).Year}",
            //Allowed = _leavesPermissible,
            //AllowedEmergency = _emergencyPermissible,
            ApprovedLeave = _query
                    .Where(x => x.TypeFlag == McvConstant.LEAVE_TYPEFLAG_APPROVED)
                    .Sum(x => x.Total),
            EmergencyLeave = _query
                    .Where(x => x.TypeFlag == McvConstant.LEAVE_TYPEFLAG_EMERGENCY)
                    .Sum(x => x.Total),
            ApprovedFirstHalf = _query
                .Where(x => x.TypeFlag == McvConstant.LEAVE_TYPEFLAG_CASUAL_FIRST_HALF)
                .Sum(x => x.Total),
            ApprovedSecondHalf = _query
                .Where(x => x.TypeFlag == McvConstant.LEAVE_TYPEFLAG_CASUAL_SECOND_HALF)
                .Sum(x => x.Total),
            EmergencyFirstHalf = _query
                .Where(x => x.TypeFlag == McvConstant.LEAVE_TYPEFLAG_EMERGENCY_FIRST_HALF)
                .Sum(x => x.Total),
            EmergencySecondHalf = _query
                .Where(x => x.TypeFlag == McvConstant.LEAVE_TYPEFLAG_EMERGENCY_SECOND_HALF)
                .Sum(x => x.Total),
            Total = _query
                    .Where(x => x.TypeFlag == McvConstant.LEAVE_TYPEFLAG_APPROVED
                    || x.TypeFlag == McvConstant.LEAVE_TYPEFLAG_EMERGENCY
                    || x.TypeFlag == McvConstant.LEAVE_TYPEFLAG_CASUAL_FIRST_HALF
                    || x.TypeFlag == McvConstant.LEAVE_TYPEFLAG_CASUAL_SECOND_HALF
                    || x.TypeFlag == McvConstant.LEAVE_TYPEFLAG_EMERGENCY_FIRST_HALF
                    || x.TypeFlag == McvConstant.LEAVE_TYPEFLAG_EMERGENCY_SECOND_HALF)
                    .Sum(x => x.Total),
        };
    }

    public async Task<IEnumerable<LeaveSummary>> GetPerMonthSummary(int contactID, int index = 0)
    {

        var _result = new List<LeaveSummary>();

        var _employeeAppointment = await db.ContactAppointments.AsNoTracking()
             .Where(x => !x.IsDeleted)
             //.Where(x => x.StatusFlag == McvConstant.APPOINTMENT_STATUSFLAG_APPOINTED)
             .Where(x => x.ContactID == contactID)
             .OrderBy(x => x.JoiningDate)
             .FirstOrDefaultAsync();
        var sharedService = new SharedService(db);
        var _leavesPermissible = Convert.ToDecimal((await sharedService.GetPresetValue(McvConstant.LEAVE_PERMISSIBLE_TOTAL)));
        //var _emergencyPermissible = Convert.ToDecimal((await sharedService.GetPresetValue(McvConstant.LEAVE_PERMISSIBLE_EMERGENCY)));
        //var _joiningDate = ClockTools.GetIST(_employeeAppointment.JoiningDate);
        //var _joiningMonth = new DateTime(_joiningDate.Year, _joiningDate.Month, 1);
        var _joiningDate = new DateTime(2025, 4, 1);
        var _joiningMonth = new DateTime(_joiningDate.Year, _joiningDate.Month, 1);


        var _start = new DateTime(DateTime.UtcNow.Year, _joiningDate.Month, 1);
        _start = _start.AddYears(index);
        var _end = _start.AddYears(1);
        var _currentMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);


        if (_currentMonth < _start) //cycle start from previous year
        {
            _start = _start.AddYears(-1);
            _end = _start.AddYears(1);

        }

        if (_start.Year < 2023)
        { //old cycle
            _start = new DateTime(2023, 1, 1);
            _end = (new DateTime(2023, _joiningDate.Month, 1));//.AddDays(-1);

            _leavesPermissible = (_end.Month - 1) * (_leavesPermissible / 12);
            //_emergencyPermissible = (_end.Month - 1) * (_emergencyPermissible / 12);
        }

        var _month = _start;
        decimal carryForward = 0;
        while (_month < _end)
        {
            var _summary = await GetMonthSummary(contactID, _month.Year, _month.Month);
            _summary.Allowed = _leavesPermissible;
            //_summary.AllowedEmergency = _emergencyPermissible;
            _summary.LeaveCycle = $"{_start.ToString("MMM")} {_start.Year} - {_end.AddDays(-1).ToString("MMM")} {_end.AddDays(-1).Year}";
            _summary.LeaveEligible = 1;

            carryForward += 1; 
            carryForward -= _summary.Total;

            if (carryForward < 0)
                carryForward = 0;
             
            _summary.LeavePending = carryForward;

            _result.Add(_summary);

            _month = _month.AddMonths(1);
        }

        return _result;

    }

    public async Task<LeaveSummary> GetTotalSummary(int contactID, int index = 0)
    {

        var _employeeAppointment = await db.ContactAppointments.AsNoTracking()

          // .Where(x => x.StatusFlag == McvConstant.APPOINTMENT_STATUSFLAG_APPOINTED)
          .Where(x => x.ContactID == contactID)
          .OrderBy(x => x.JoiningDate)
          .FirstOrDefaultAsync();
        var sharedService = new SharedService(db); ;
        var _leavesPermissible = Convert.ToDecimal((await sharedService.GetPresetValue(McvConstant.LEAVE_PERMISSIBLE_TOTAL)));
        //var _emergencyPermissible = Convert.ToDecimal((await sharedService.GetPresetValue(McvConstant.LEAVE_PERMISSIBLE_EMERGENCY)));
        //var _joiningDate = ClockTools.GetIST(_employeeAppointment.JoiningDate);
        //var _joiningMonth = new DateTime(_joiningDate.Year, _joiningDate.Month, 1);
        var _joiningDate = new DateTime(2025, 4, 1);
        var _joiningMonth = new DateTime(_joiningDate.Year, _joiningDate.Month, 1);

        var _start = new DateTime(DateTime.UtcNow.Year, _joiningDate.Month, 1);
        _start = _start.AddYears(index);
        var _end = _start.AddYears(1);
        var _currentMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);


        if (_currentMonth < _start) //cycle start from previous year
        {
            _start = _start.AddYears(-1);
            _end = _start.AddYears(1);

        }

        if (_start.Year < 2023)
        { //old cycle
            _start = new DateTime(2023, 1, 1);
            _end = (new DateTime(2023, _joiningDate.Month, 1));//.AddDays(-1);

            _leavesPermissible = (_end.Month - 1) * (_leavesPermissible / 12);
            //_emergencyPermissible = (_end.Month - 1) * (_emergencyPermissible / 12);
        }

        var _query = await db.Leaves.AsNoTracking()
                            .Where(x => x.Start >= _start && x.End < _end)
                            .Where(x => x.ContactID == contactID && x.StatusFlag == 1)
                            .ToListAsync();


        return new LeaveSummary
        {
            Year = _start.Year,
            Label = _start.Year.ToString(),
            LeaveEligible = 1,
            LeaveCycle = $"{_start.ToString("MMM")} {_start.Year} - {_end.AddDays(-1).ToString("MMM")} {_end.AddDays(-1).Year}",
            ApprovedLeave = _query
                .Where(x => x.TypeFlag == McvConstant.LEAVE_TYPEFLAG_APPROVED)
                .Sum(x => x.Total),
            EmergencyLeave = _query
                .Where(x => x.TypeFlag == McvConstant.LEAVE_TYPEFLAG_EMERGENCY)
                .Sum(x => x.Total),
            ApprovedFirstHalf = _query
                .Where(x => x.TypeFlag == McvConstant.LEAVE_TYPEFLAG_CASUAL_FIRST_HALF)
                .Sum(x => x.Total),
            ApprovedSecondHalf = _query
                .Where(x => x.TypeFlag == McvConstant.LEAVE_TYPEFLAG_CASUAL_SECOND_HALF)
                .Sum(x => x.Total),
            EmergencyFirstHalf = _query
                .Where(x => x.TypeFlag == McvConstant.LEAVE_TYPEFLAG_EMERGENCY_FIRST_HALF)
                .Sum(x => x.Total),
            EmergencySecondHalf = _query
                .Where(x => x.TypeFlag == McvConstant.LEAVE_TYPEFLAG_EMERGENCY_SECOND_HALF)
                .Sum(x => x.Total),
            Total = _query
                .Where(x => x.TypeFlag == McvConstant.LEAVE_TYPEFLAG_APPROVED 
                || x.TypeFlag == McvConstant.LEAVE_TYPEFLAG_EMERGENCY 
                || x.TypeFlag == McvConstant.LEAVE_TYPEFLAG_CASUAL_FIRST_HALF 
                || x.TypeFlag == McvConstant.LEAVE_TYPEFLAG_CASUAL_SECOND_HALF 
                || x.TypeFlag == McvConstant.LEAVE_TYPEFLAG_EMERGENCY_FIRST_HALF 
                || x.TypeFlag == McvConstant.LEAVE_TYPEFLAG_EMERGENCY_SECOND_HALF)
                .Sum(x => x.Total),
            Allowed = _leavesPermissible,
            //AllowedEmergency = _emergencyPermissible,
        };
    }



    public async Task<IEnumerable<Leave>> GetSplitLeave(Leave Entity)
    {

        var sharedService = new SharedService(db); ;

        var _startTimespanIST = TimeSpan.Parse(await sharedService.GetPresetValue(McvConstant.OFFICE_OPEN_TIME));
        var _endTimeSpanIST = TimeSpan.Parse(await sharedService.GetPresetValue(McvConstant.OFFICE_CLOSE_TIME));

        var _leaveStartIST = ClockTools.GetIST(Entity.Start).Date.AddMilliseconds(_startTimespanIST.TotalMilliseconds);
        var _leaveEndIST = ClockTools.GetIST(Entity.End).Date.AddMilliseconds(_endTimeSpanIST.TotalMilliseconds);

        var results = new List<Leave>();

        if (Entity.TypeFlag == McvConstant.LEAVE_TYPEFLAG_APPROVED)// normal
        {

            //split leave
            if (Entity.Start.Month != Entity.End.Month)
            {
                var _monthEnd = (new DateTime(_leaveStartIST.Year, _leaveStartIST.Month, 1)).AddMonths(1).AddDays(-1);

                var _partA = new Leave();
                _partA.ContactID = Entity.ContactID;
                _partA.TypeFlag = Entity.TypeFlag;
                _partA.Start = ClockTools.GetUTC(_leaveStartIST);
                _partA.Reason = Entity.Reason;
                _partA.End = ClockTools.GetUTC(ClockTools.GetIST(_monthEnd).Date.AddMilliseconds(_endTimeSpanIST.TotalMilliseconds));


                _partA.Total = await GetTotalLeaveDurationIST(ClockTools.GetIST(_partA.Start), ClockTools.GetIST(_partA.End));
                results.Add(_partA);

                var _partB = new Leave();
                _partB.ContactID = Entity.ContactID;
                _partB.TypeFlag = Entity.TypeFlag;
                _partB.Start = ClockTools.GetUTC(ClockTools.GetIST(_monthEnd.AddDays(1)).Date.AddMilliseconds(_startTimespanIST.TotalMilliseconds));
                _partB.End = ClockTools.GetUTC(_leaveEndIST);
                _partB.Reason = Entity.Reason;

                _partB.Total = await GetTotalLeaveDurationIST(ClockTools.GetIST(_partB.Start), ClockTools.GetIST(_partB.End));
                results.Add(_partB);
            }
            else
            {
                Entity.Start = ClockTools.GetUTC(_leaveStartIST);
                Entity.End = ClockTools.GetUTC(_leaveEndIST);
                Entity.TypeFlag = Entity.TypeFlag;

                Entity.Total = await GetTotalLeaveDurationIST(ClockTools.GetIST(Entity.Start), ClockTools.GetIST(Entity.End));
                results.Add(Entity);
            }
        }
        else if (Entity.TypeFlag == McvConstant.LEAVE_TYPEFLAG_EMERGENCY)//EmergencyLeave
        {


            var _emergency = new Leave();
            _emergency.ContactID = Entity.ContactID;
            _emergency.TypeFlag = McvConstant.LEAVE_TYPEFLAG_EMERGENCY;
            _emergency.Start = ClockTools.GetUTC(_leaveStartIST);
            _emergency.End = ClockTools.GetUTC(ClockTools.GetIST(Entity.Start).Date.AddMilliseconds(_endTimeSpanIST.TotalMilliseconds)); // only one day emergency
            _emergency.Reason = Entity.Reason;
            _emergency.StatusFlag = McvConstant.LEAVE_STATUSFLAG_APPROVED;
            _emergency.Total = 1;
            results.Add(_emergency);

            if (ClockTools.GetUTC(_leaveEndIST) > _emergency.End)
            {
                Entity.Start = Entity.Start.AddDays(1);
                Entity.TypeFlag = McvConstant.LEAVE_TYPEFLAG_APPROVED;
                Entity.StatusFlag = McvConstant.LEAVE_STATUSFLAG_APPROVED;

                if (Entity.Start.Month != Entity.End.Month)
                {
                    var _monthEnd = (new DateTime(_leaveStartIST.Year, _leaveStartIST.Month, 1)).AddMonths(1).AddDays(-1);


                    var _partA = new Leave();
                    _partA.ContactID = Entity.ContactID;
                    _partA.TypeFlag = Entity.TypeFlag;
                    _partA.Start = Entity.Start;
                    _partA.Reason = Entity.Reason;
                    _partA.End = ClockTools.GetUTC(ClockTools.GetIST(_monthEnd).Date.AddMilliseconds(_endTimeSpanIST.TotalMilliseconds));
                    ;
                    _partA.StatusFlag = Entity.StatusFlag;
                    _partA.Total = await GetTotalLeaveDurationIST(ClockTools.GetIST(_partA.Start), ClockTools.GetIST(_partA.End));
                    results.Add(_partA);

                    var _partB = new Leave();
                    _partB.ContactID = Entity.ContactID;
                    _partB.TypeFlag = Entity.TypeFlag;
                    _partB.Start = ClockTools.GetUTC(ClockTools.GetIST(_monthEnd.AddDays(1)).Date.AddMilliseconds(_startTimespanIST.TotalMilliseconds));
                    _partB.End = ClockTools.GetUTC(_leaveEndIST);
                    _partB.Reason = Entity.Reason;
                    _partB.StatusFlag = Entity.StatusFlag;
                    _partB.Total = await GetTotalLeaveDurationIST(ClockTools.GetIST(_partB.Start), ClockTools.GetIST(_partB.End));
                    results.Add(_partB);
                }
                else
                {
                    Entity.StatusFlag = McvConstant.LEAVE_STATUSFLAG_APPROVED;
                    Entity.Start = ClockTools.GetUTC(_leaveStartIST);
                    Entity.End = ClockTools.GetUTC(_leaveEndIST);
                    Entity.TypeFlag = Entity.TypeFlag;

                    Entity.Total = await GetTotalLeaveDurationIST(ClockTools.GetIST(Entity.Start), ClockTools.GetIST(Entity.End));
                    results.Add(Entity);

                }
            }
        }
        //else if (Entity.TypeFlag == McvConstant.LEAVE_TYPEFLAG_LATE || Entity.TypeFlag == McvConstant.LEAVE_TYPEFLAG_PENELTY)
        //{


        //    Entity.Start = ClockTools.GetUTC(_leaveStartIST);
        //    Entity.End = ClockTools.GetUTC(_leaveEndIST);
        //    Entity.StatusFlag = McvConstant.LEAVE_STATUSFLAG_APPROVED;

        //    Entity.Total = await GetTotalLeaveDurationIST(ClockTools.GetIST(Entity.Start), ClockTools.GetIST(Entity.End));
        //    results.Add(Entity);
        //}
        //else if (Entity.TypeFlag == McvConstant.LEAVE_TYPEFLAG_APPROVED_BREAK || Entity.TypeFlag == McvConstant.LEAVE_TYPEFLAG_EMERGENCY_BREAK) //break
        //{
        //    Entity.Total = 0m;//REQUIRED FOR COUNT
        //    if (Entity.TypeFlag == McvConstant.LEAVE_TYPEFLAG_EMERGENCY_BREAK)
        //    {
        //        Entity.StatusFlag = McvConstant.LEAVE_STATUSFLAG_APPROVED;

        //    }
        //    results.Add(Entity);
        //}
        //else if (Entity.TypeFlag == McvConstant.LEAVE_TYPEFLAG_APPROVED_HALFDAY || Entity.TypeFlag == McvConstant.LEAVE_TYPEFLAG_EMERGENCY_HALFDAY) //ApprovedHalfDay
        //{
        //    Entity.Total = 0.5m;
        //    if (Entity.TypeFlag == McvConstant.LEAVE_TYPEFLAG_EMERGENCY_HALFDAY)
        //    {
        //        Entity.StatusFlag = McvConstant.LEAVE_STATUSFLAG_APPROVED;
        //    }
        //    results.Add(Entity);
        //}
        //else if (Entity.TypeFlag == McvConstant.LEAVE_TYPEFLAG_APPROVED_WFH ||
        //    Entity.TypeFlag == McvConstant.LEAVE_TYPEFLAG_EMERGENCY_WFH) //ApprovedWFH
        //{


        //    Entity.Start = ClockTools.GetUTC(_leaveStartIST);
        //    Entity.End = ClockTools.GetUTC(_leaveEndIST);
        //    Entity.Total = (Entity.End - Entity.Start).Days > 0 ? (Entity.End - Entity.Start).Days : 1;
        //    if (Entity.TypeFlag == McvConstant.LEAVE_TYPEFLAG_EMERGENCY_WFH)
        //    {

        //        Entity.StatusFlag = McvConstant.LEAVE_STATUSFLAG_APPROVED;
        //    }
        //    results.Add(Entity);
        //}


        return results;

    }

    public async Task<int> Create(Leave Entity)
    {
        var _exist = await db.Leaves.AsNoTracking()
            .AnyAsync(x => x.ContactID == Entity.ContactID && x.Start == Entity.Start
            && x.End == Entity.End && (x.StatusFlag == McvConstant.LEAVE_STATUSFLAG_APPROVED 
            || x.StatusFlag == McvConstant.LEAVE_STATUSFLAG_PENDING));
        if (_exist) throw new Exception("Application already exists!");

        var sharedService = new SharedService(db);
        var _leaveMaster = await sharedService.GetContactIDByRoleAsync(McvConstant.PERMISSION_LEAVE_MASTER);
        var _applicationPriorDays = Convert.ToInt32(await sharedService.GetPresetValue(McvConstant.HALFDAY_APPLICATION_PRIOR_DAYS));
        bool isCreatedByLeaveMaster = Entity.CreatedByContactID.HasValue
        && _leaveMaster.Contains(Entity.CreatedByContactID.Value);

        if (Entity.TypeFlag == McvConstant.LEAVE_TYPEFLAG_CASUAL_FIRST_HALF || Entity.TypeFlag == McvConstant.LEAVE_TYPEFLAG_CASUAL_SECOND_HALF) //ApprovedHalfDay
        {
            //TimeSpan duration = Entity.End - Entity.Start;

            //if (duration.TotalHours > 4)
            //{
            //    throw new Exception("Half-Day can't exceed 4 hours");
            //}
            //else if (Entity.End < Entity.Start)
            //{
            //    throw new EntityServiceException("Invalid Dates! Start should be less than End!");
            //}
            //else 
            if ((ClockTools.GetIST(Entity.Start) - ClockTools.GetISTNow()).Days < (_applicationPriorDays - 1) && !isCreatedByLeaveMaster)
            {
                throw new EntityServiceException($"Half-day can only be applied {_applicationPriorDays} days prior!");
            }

            Entity.Total = 0.5m;
        }
        else if (Entity.TypeFlag == McvConstant.LEAVE_TYPEFLAG_EMERGENCY_FIRST_HALF || Entity.TypeFlag == McvConstant.LEAVE_TYPEFLAG_EMERGENCY_SECOND_HALF)
        {
            //TimeSpan duration = Entity.End - Entity.Start;

            //if (duration.TotalHours > 4)
            //{
            //    throw new Exception("Half-Day can't exceed 4 hours");
            //}
            //else if (Entity.End < Entity.Start)
            //{
            //    throw new EntityServiceException("Invalid Dates! Start should be less than End!");
            //}
            Entity.Total = 0.5m;
        }
        else if(Entity.TypeFlag == McvConstant.LEAVE_TYPEFLAG_APPROVED)
        {
            DateTime startDate = ClockTools.GetIST(Entity.Start);
            DateTime endDate = ClockTools.GetIST(Entity.End);
            Entity.Total = await GetTotalLeaveDurationIST(ClockTools.GetIST(Entity.Start), ClockTools.GetIST(Entity.End));

            DateTime today = ClockTools.GetIST(DateTime.Now);

            int noticeRequired = 0;

            if (Entity.Total == 1)
            {
                noticeRequired = 4;
            }
            else if (Entity.Total == 2)
            {
                noticeRequired = 6;
            }
            else if (Entity.Total == 3)
            {
                noticeRequired = 10;
            }
            else if (Entity.Total == 4)
            {
                noticeRequired = 15;
            }
            else if (Entity.Total == 5)
            {
                noticeRequired = 25;
            }
            else if (Entity.Total == 6)
            {
                noticeRequired = 30;
            }
            else if (Entity.Total >= 7 && Entity.Total <= 10)
            {
                noticeRequired = 45;
            }
            else if (Entity.Total >= 11 && Entity.Total <= 15)
            {
                noticeRequired = 50;
            }
            else if (Entity.Total >= 15 && Entity.Total <= 30)
            {
                noticeRequired = 60;
            }

            int daysBeforeStart = (startDate.Date - today.Date).Days;

            if (daysBeforeStart < noticeRequired && !isCreatedByLeaveMaster)
            {
                throw new Exception($"You must apply at least {noticeRequired} days in advance for a {Entity.Total} day leave.");
            }
        }else if (Entity.TypeFlag == McvConstant.LEAVE_TYPEFLAG_EMERGENCY)
        {
            DateTime startDate = ClockTools.GetIST(Entity.Start);
            DateTime endDate = ClockTools.GetIST(Entity.End);
            Entity.Total = await GetTotalLeaveDurationIST(ClockTools.GetIST(Entity.Start), ClockTools.GetIST(Entity.End));
            if (Entity.Total > 1  && !isCreatedByLeaveMaster)
            {
                throw new Exception($"Emergency Leave Can be applied for 1 day only");
            }
        }
        else
        {
            if (Entity.End < Entity.Start)
            {
                throw new EntityServiceException("Invalid Dates! Start should be less than End!");
            }
        }

        db.Leaves.Add(Entity);
        await db.SaveChangesAsync();

        if (Entity.StatusFlag == McvConstant.LEAVE_STATUSFLAG_PENDING)
        {
            await AssignTasks(Entity);
        }

        return Entity.ID;
    }

    public async Task ValidateOverlapp(Leave Entity)
    {

        var _query = await db.Leaves.AsNoTracking()
            .Where(x => x.StatusFlag != McvConstant.LEAVE_STATUSFLAG_REJECTED)
            .Where(x => x.ID != Entity.ID)
                          .Where(x => x.ContactID == Entity.ContactID)
                 .Where(x => (x.Start == Entity.Start) //equal start
                            || (x.End == Entity.End) //equal end
                            || (x.Start < Entity.Start && x.End > Entity.End) //inside
                            || (x.Start > Entity.Start && x.End < Entity.End) //outside
                            || (x.Start < Entity.Start && x.End > Entity.Start) //start overlapp
                            || (x.Start > Entity.Start && x.Start < Entity.End) //end overlapp
                 ).FirstOrDefaultAsync();
        if (_query != null)
        {
            var _typeMaster = await db.TypeMasters.AsNoTracking().FirstOrDefaultAsync(x => x.Entity == nameof(Leave)
            && x.Value == _query.TypeFlag);

            throw new EntityServiceException($"Application overlaps another {(_typeMaster != null ? _typeMaster.Title : "leave")} on {ClockTools.GetIST(_query.Start).ToString("dd MMM yyyy HH:mm")}-{ClockTools.GetIST(_query.End).ToString("dd MMM yyyy HH:mm")}");
        }

    }

    public async Task<decimal> GetTotalLeaveDurationIST(DateTime StartIST, DateTime EndIST)
    {

        var sharedService = new SharedService(db);
        bool isIncludeSundays = false;
        //bool isOddSaturdayOff = await sharedService.IsOddSaturdayOff();
        //bool isEvenSaturdayOff = await sharedService.IsEvenSaturdayOff();
        bool isOddSaturdayOff = false;
        bool isEvenSaturdayOff = false;
        //var _holidayDates = await sharedService.GetHolidays();

        var days = 0.0m;

        var holidays = await db.HolidayMasters
                            .AsNoTracking()
                            .Select(x => x.HolidayDate)
                            .ToListAsync();

        //var workingDays = await db.HolidayMasters
        //                    .AsNoTracking()
        //                    .Where(x => x.TypeFlag == McvConstant.HOLIDAY_MASTER_TYPEFLAG_WORKING)
        //                                    .Select(x => x.HolidayDate)
        //                    .ToListAsync();

        var start = StartIST;
        var stop = EndIST;

        while (start <= stop)
        {
            if (start.DayOfWeek == DayOfWeek.Saturday)
            {

                int index = 0;
                if (start.Day <= 7)
                {
                    index = 1;
                }
                else if (start.Day <= 14)
                {
                    index = 2;
                }
                else if (start.Day <= 21)
                {
                    index = 3;
                }
                else if (start.Day <= 28)
                {
                    index = 4;
                }
                else if (start.Day > 28)
                {
                    index = 5;
                }

                if (index % 2 == 0)
                {
                    if (!isEvenSaturdayOff)
                        ++days;
                    //else if (workingDays.Any(x => x.Date == start.Date))
                    //    ++days;
                }
                else
                {

                    if (!isOddSaturdayOff)
                        ++days;
                    //else if (workingDays.Any(x => x.Date == start.Date))
                    //    ++days;
                }

            }
            else if (start.DayOfWeek == DayOfWeek.Sunday)
            {
                if (isIncludeSundays)
                    ++days;
                //else if (workingDays.Any(x => x.Date == start.Date))
                //    ++days;
            }
            else
            {
                if (!holidays.Any(x => x.Date == start.Date))
                    ++days;
            }
            start = start.AddDays(1);
        }

        return days;

    }

    private bool IsNonWorkingSaturday(int Index, DateTime Date, int[] Allowed)
    {

        var MonthFirstDay = new DateTime(Date.Year, Date.Month, 1, 0, 0, 0);

        var _result = false;

        int firstDay = 0;

        if (MonthFirstDay.DayOfWeek == DayOfWeek.Sunday)
        {
            firstDay = 0;
        }
        else if (MonthFirstDay.DayOfWeek == DayOfWeek.Monday)
        {
            firstDay = 1;
        }
        else if (MonthFirstDay.DayOfWeek == DayOfWeek.Tuesday)
        {
            firstDay = 2;
        }
        else if (MonthFirstDay.DayOfWeek == DayOfWeek.Wednesday)
        {
            firstDay = 3;
        }
        else if (MonthFirstDay.DayOfWeek == DayOfWeek.Thursday)
        {
            firstDay = 4;
        }
        else if (MonthFirstDay.DayOfWeek == DayOfWeek.Friday)
        {
            firstDay = 5;
        }
        else if (MonthFirstDay.DayOfWeek == DayOfWeek.Saturday)
        {
            firstDay = 6;
        }

        int day = 0;
        if (Index == 1)
        {
            day = 7 - firstDay;
        }
        else if (Index == 2)
        {
            day = 14 - firstDay;

            if (day == Date.Day)
            {
                _result = true;
            }
        }
        else if (Index == 3)
        {
            day = 21 - firstDay;
        }
        else if (Index == 4)
        {
            day = 28 - firstDay;

            if (day == Date.Day)
            {
                _result = true;
            }
        }
        else if (Index == 5)
        {
            day = 35 - firstDay;
        }

        return _result;

    }

    private async Task AssignTasks(Leave _leave)
    {


        var _applicant = await db.Contacts.AsNoTracking()
        .Include(x => x.Appointments)
                        .SingleOrDefaultAsync(x => x.ID == _leave.ContactID);

        var _type = await db.TypeMasters.AsNoTracking()
            .Where(x => x.Entity == nameof(Leave) && x.Value == _leave.TypeFlag).AnyAsync() ? (await db.TypeMasters.AsNoTracking()
            .Where(x => x.Entity == nameof(Leave) && x.Value == _leave.TypeFlag)
            .FirstOrDefaultAsync()).Title : "Leave";

        var _subtitle = _applicant.FullName + " | " + ClockTools.GetIST(_leave.Start).ToString("dd MMM yyyy") + " - " + ClockTools.GetIST(_leave.End).ToString("dd MMM yyyy");
        if (_leave.TypeFlag == McvConstant.LEAVE_TYPEFLAG_CASUAL_FIRST_HALF 
            || _leave.TypeFlag == McvConstant.LEAVE_TYPEFLAG_CASUAL_SECOND_HALF 
            || _leave.TypeFlag == McvConstant.LEAVE_TYPEFLAG_EMERGENCY_FIRST_HALF
            || _leave.TypeFlag == McvConstant.LEAVE_TYPEFLAG_EMERGENCY_SECOND_HALF)
        {
            _subtitle = _applicant.FullName + " | " + ClockTools.GetIST(_leave.Start).ToString("dd MMM yyyy HH:mm") + " - " + ClockTools.GetIST(_leave.End).ToString("HH:mm");
        }
        var sharedService = new SharedService(db); ;
        var _dueDate = DateTime.UtcNow.AddDays(1).Date
                    .AddMinutes(await sharedService.GetBusinessEndMinutesIST()) < _leave.End ? DateTime.UtcNow.AddDays(1).Date
                    .AddMinutes(await sharedService.GetBusinessEndMinutesIST()) :
                    _leave.End;


        //var activeAppointmentManagers = _applicant.Appointments.Where(x => !x.IsDeleted && x.StatusFlag == McvConstant.APPOINTMENT_STATUSFLAG_APPOINTED && x.ManagerContactID != null)
        //    .Select(x => x.ManagerContactID.Value).ToList();


        var hrManagers = await sharedService.GetContactIDByRoleAsync(McvConstant.PERMISSION_LEAVE_SPECIAL_EDIT);
        var leaderIds = await db.ContactTeams
                        .AsNoTracking()
                        .Where(team => team.Members.Any(m => m.ContactID == _applicant.ID))
                        .Select(team => team.LeaderID)
                        .Distinct()
                        .ToListAsync();

        bool isLeader = leaderIds.Contains(_applicant.ID);
        bool isNotLeader = !isLeader;

        var _leaveMaster = await sharedService.GetContactIDByRoleAsync(McvConstant.PERMISSION_LEAVE_MASTER);
        var contactService = new ContactService(db);
        var _user = await contactService.Get()
            .FirstOrDefaultAsync(x => x.Username == "Kamlesh.R@ecomep.com");

        //Task will go to Leave Master 
        var taskService = new WFTaskService(db);
        foreach (var _emp in _leaveMaster)
        {
            var _TLTask = new WFTask
            {
                ContactID = _emp,
                Title = _type + " Application",
                Subtitle = _subtitle,
                StageIndex = 1,

                OutcomeFlag = 0,
                Entity = nameof(Leave),
                EntityID = _leave.ID,
                StartDate = DateTime.UtcNow,
                DueDate = _dueDate,
                WFStageCode = "LEAVE_APPROVAL"
            };

            var _result = await taskService.Create(_TLTask);
        }

        //Task will go to team leaders also
        if (!isLeader)
        {
            foreach (var _emp in leaderIds)
            {
                var _TLTask = new WFTask
                {
                    ContactID = _emp.Value,
                    Title = _type + " Application",
                    Subtitle = _subtitle,
                    StageIndex = 1,

                    OutcomeFlag = 0,
                    Entity = nameof(Leave),
                    EntityID = _leave.ID,
                    StartDate = DateTime.UtcNow,
                    DueDate = _dueDate,
                    WFStageCode = "LEAVE_APPROVAL"
                };

                var _result = await taskService.Create(_TLTask);
            }
        }
        else
        {
            if(_user != null)
            {
                var _TLTask = new WFTask
                {
                    ContactID = _user.ID,
                    Title = _type + " Application",
                    Subtitle = _subtitle,
                    StageIndex = 1,

                    OutcomeFlag = 0,
                    Entity = nameof(Leave),
                    EntityID = _leave.ID,
                    StartDate = DateTime.UtcNow,
                    DueDate = _dueDate,
                    WFStageCode = "LEAVE_APPROVAL"
                };

                var _result = await taskService.Create(_TLTask);
            }
        }
    }

    public async Task Update(Leave Entity)
    {
        await ValidateOverlapp(Entity);


        if (Entity.TypeFlag == McvConstant.LEAVE_TYPEFLAG_CASUAL_FIRST_HALF 
            || Entity.TypeFlag == McvConstant.LEAVE_TYPEFLAG_CASUAL_SECOND_HALF
            || Entity.TypeFlag == McvConstant.LEAVE_TYPEFLAG_EMERGENCY_FIRST_HALF
            || Entity.TypeFlag == McvConstant.LEAVE_TYPEFLAG_EMERGENCY_SECOND_HALF
            ) //ApprovedHalfDay
        {
            //TimeSpan duration = Entity.End - Entity.Start;

            //if (duration.TotalHours > 4)
            //{
            //    throw new Exception("Half-Day can't exceed 4 hours");
            //}
            Entity.Total = 0.5m;

        }
        else
        {
            Entity.Total = await GetTotalLeaveDurationIST(ClockTools.GetIST(Entity.Start), ClockTools.GetIST(Entity.End));
        }
        await base.Update(Entity);


    }

    public async Task ValidateApplication(Leave Entity, bool IsSelfApplied)
    {

        var sharedService = new SharedService(db); ;
        var _startTimespan = TimeSpan.Parse(await sharedService.GetPresetValue(McvConstant.OFFICE_OPEN_TIME));
        var _endTimeSpan = TimeSpan.Parse(await sharedService.GetPresetValue(McvConstant.OFFICE_CLOSE_TIME));
        var _startIST = ClockTools.GetIST(Entity.Start).Date.AddMilliseconds(_startTimespan.TotalMilliseconds);
        var _endIST = ClockTools.GetIST(Entity.End).Date.AddMilliseconds(_endTimeSpan.TotalMilliseconds);
        //bool _presetOddSaturdayOff = await sharedService.IsOddSaturdayOff();
        //bool _presetEvenSaturdayOff = await sharedService.IsEvenSaturdayOff();
        bool _presetOddSaturdayOff = false;
        bool _presetEvenSaturdayOff = false;

        if (Entity.TypeFlag == McvConstant.LEAVE_TYPEFLAG_CASUAL_FIRST_HALF || Entity.TypeFlag == McvConstant.LEAVE_TYPEFLAG_CASUAL_FIRST_HALF) //ApprovedHalfDay
        {
            if (Entity.End < Entity.Start)
                throw new EntityServiceException("Invalid Dates! Start should be less than End!");


            if (IsSelfApplied)
            {
                if (Entity.Start < DateTime.UtcNow)
                    throw new EntityServiceException("Only post date/time can be selected for Halfday!");

                var _applicationPriorDays = Convert.ToInt32(await sharedService.GetPresetValue(McvConstant.HALFDAY_APPLICATION_PRIOR_DAYS));
                if ((ClockTools.GetIST(Entity.Start) - ClockTools.GetISTNow()).Days < (_applicationPriorDays - 1))
                    throw new EntityServiceException($"Half-day can only be applied {_applicationPriorDays} days prior!");
            }

            var _applicationDurationHours = Convert.ToDouble(await sharedService.GetPresetValue(McvConstant.HALFDAY_APPLICATION_DURATION_HOURS_PER_MONTH)) + 0.1;
            if ((Entity.End - Entity.Start).TotalHours > _applicationDurationHours)
                throw new EntityServiceException($"Half-day duration cannot exceed beyond {_applicationDurationHours} hours!");


            //var _applicationAlowedPerMonth = Convert.ToInt32(await sharedService.GetPresetValue(McvConstant.HALFDAY_APPLICATION_ALLOWED_PER_MONTH));

            //var _currentMonthBreaks = await db.Leaves.AsNoTracking().Where(x => !x.IsDeleted)
            //     .Where(x => x.ContactID == Entity.ContactID)
            //     .Where(x => x.TypeFlag == Entity.TypeFlag)
            //     .Where(x => x.Start.Month == Entity.Start.Month && x.Start.Year == Entity.Start.Year).ToListAsync();
            //if (_currentMonthBreaks.Count > _applicationAlowedPerMonth)
            //{
            //    throw new EntityServiceException($"Only {_applicationAlowedPerMonth} {(_applicationAlowedPerMonth > 1 ? "half-days are" : "half-day is")} allowed in a month. You have already taken last on {ClockTools.GetIST(_currentMonthBreaks.OrderByDescending(x => x.Start).FirstOrDefault().Start).ToString("dd MMM yyyy HH:mm")}-{ClockTools.GetIST(_currentMonthBreaks.OrderByDescending(x => x.Start).FirstOrDefault().End).ToString("HH:mm")}");
            //}


            if (Entity.Start < ClockTools.GetUTC(_startIST) || Entity.End > ClockTools.GetUTC(_endIST))
                throw new EntityServiceException("Date/Time selected should be between " + _startTimespan.ToString(@"hh\:mm") + " - " + _endTimeSpan.ToString(@"hh\:mm") + " on same Date!");



            await ValidateOverlapp(Entity);
        }
        else if (Entity.TypeFlag == McvConstant.LEAVE_TYPEFLAG_EMERGENCY_FIRST_HALF || Entity.TypeFlag == McvConstant.LEAVE_TYPEFLAG_EMERGENCY_SECOND_HALF) //ApprovedHalfDay
        {
            if (Entity.End < Entity.Start)
                throw new EntityServiceException("Invalid Dates! Start should be less than End!");


            //var _applicationDurationHours = Convert.ToInt32(await sharedService.GetPresetValue(McvConstant.HALFDAY_APPLICATION_DURATION_HOURS_PER_MONTH));
            //if ((Entity.End - Entity.Start).TotalHours > _applicationDurationHours)
            //    throw new EntityServiceException($"Half-day duration cannot exceed beyond {_applicationDurationHours} hours!");



            if (Entity.Start < ClockTools.GetUTC(_startIST) || Entity.End > ClockTools.GetUTC(_endIST))
                throw new EntityServiceException("Date/Time selected should be between " + _startTimespan.ToString(@"hh\:mm") + " - " + _endTimeSpan.ToString(@"hh\:mm") + " on same Date!");



            await ValidateOverlapp(Entity);
        }
        else if (Entity.TypeFlag == McvConstant.LEAVE_TYPEFLAG_APPROVED) //ApprovedLeave
        {

            //var _holidayDates = await sharedService.GetHolidays();
            var _holidayDates = await sharedService.GetPresetValue("LEAVE_HOLIDAY");

            if (_holidayDates != null)
            {
                var _leaveStart = Entity.Start;
                var _leaveEnd = Entity.End;

                //var _presetApplicationDuration = Convert.ToInt32(await sharedService.GetPresetValue(McvConstant.LEAVE_APPLICATION_DURATION));

                //var _currentAppicationDuration = ClockTools.GetValidWorkingDays(DateTime.UtcNow,
                //    _leaveStart,
                //    _presetEvenSaturdayOff,
                //    _presetOddSaturdayOff,
                //    []
                //    );

                var _currentAppicationDuration = ClockTools.GetDaysDifference(Entity.Start, Entity.End);


                if (IsSelfApplied)
                {
                    if (_currentAppicationDuration <= 1)
                    {
                        throw new EntityServiceException("Leave must be applied " + 4 + " days prior!");
                    }
                    else if (_currentAppicationDuration <= 2)
                    {
                        throw new EntityServiceException("Leave must be applied " + 6 + " days prior!");
                    }
                    else if (_currentAppicationDuration <= 3)
                    {
                        throw new EntityServiceException("Leave must be applied " + 10 + " days prior!");
                    }
                    else if (_currentAppicationDuration <= 4)
                    {
                        throw new EntityServiceException("Leave must be applied " + 15 + " days prior!");
                    }
                    else if (_currentAppicationDuration <= 5)
                    {
                        throw new EntityServiceException("Leave must be applied " + 25 + " days prior!");
                    }
                    else if (_currentAppicationDuration <= 6)
                    {
                        throw new EntityServiceException("Leave must be applied " + 30 + " days prior!");
                    }
                    else if (_currentAppicationDuration > 7 && _currentAppicationDuration < 10)
                    {
                        throw new EntityServiceException("Leave must be applied " + 45 + " days prior!");
                    }
                    else if (_currentAppicationDuration > 11 && _currentAppicationDuration < 15)
                    {
                        throw new EntityServiceException("Leave must be applied " + 50 + " days prior!");
                    }
                    else if (_currentAppicationDuration > 16 && _currentAppicationDuration < 30)
                    {
                        throw new EntityServiceException("Leave must be applied " + 60 + " days prior!");
                    }

                }


                await ValidateOverlapp(Entity);
            }


        }
        else
        {
            Entity.Total = await GetTotalLeaveDurationIST(_startIST, _endIST);

            if (Entity.Total == 0) throw new EntityServiceException("Select date for Leave is non-working day!");


            await ValidateOverlapp(Entity);
        }


    }

    //public async Task LeaveStage2(WFTask task, string Username)
    //{


    //    var _leave = await Get().Include(x => x.Contact).SingleOrDefaultAsync(x => x.ID == task.EntityID);
    //    if (_leave == null) return;

    //    _leave.StatusFlag = task.OutcomeFlag;
    //    db.Entry(_leave).State = EntityState.Modified;
    //    await db.SaveChangesAsync();

    //    var _emp = await db.Contacts.AsNoTracking()
    //        .SingleOrDefaultAsync(x => x.ID == _leave.ContactID);
    //    var activityService = new ActivityService(db);
    //    var currentContact = await _currentUserService.GetCurrentContactAsync();
    //    if (currentContact != null)
    //    {
    //        await activityService.LogUserActivity(currentContact, nameof(Leave),
    //                _leave.ID,
    //                (_leave.TypeFlag == 0 ? "Leave | " : "EmergencyLeave Leave | ") + _emp.FullName + " | " + _leave.Total + " Days",
    //                (_leave.TypeFlag == 0 ? "Leave | " : "EmergencyLeave Leave | ") + _emp.FullName + " | " + _leave.Total + " Days",
    //                _leave.StatusFlag == 1 ? "ApprovedLeave" : "Rejected",
    //           "From: " + ClockTools.GetIST(_leave.Start).ToString("dd MMM yyyy") + " -To: " + ClockTools.GetIST(_leave.End).ToString("dd MMM yyyy") + ". Commment: " + task.Comment,
    //    task.ID
    //    );
    //    }

    //    await sharedService.PushNotification(_leave.ContactID, $"Leave {(_leave.StatusFlag == 1 ? "Approved" : "Rejected")}", $"{"From: " + ClockTools.GetIST(_leave.Start).ToString("dd MMM yyyy") + " -To: " + ClockTools.GetIST(_leave.End).ToString("dd MMM yyyy")} ", nameof(Leave), _leave.ID.ToString());

    //}
}

public class LeaveSummary
{
    public int Month { get; set; }

    public int Year { get; set; }
    public int LeaveEligible { get; set; }
    public decimal LeavePending { get; set; }

    public string LeaveCycle { get; set; }

    public string Label { get; set; }

    public decimal ApprovedLeave { get; set; }

    public decimal EmergencyLeave { get; set; }

    public decimal Late { get; set; }

    public decimal Penalty { get; set; }

    public decimal ApprovedBreak { get; set; }

    public decimal ApprovedHalfDay { get; set; }
    public decimal ApprovedFirstHalf { get; set; }
    public decimal ApprovedSecondHalf { get; set; }

    public decimal ApprovedWFH { get; set; }


    public decimal EmergencyBreak { get; set; }

    public decimal EmergencyHalfDay { get; set; }
    public decimal EmergencyFirstHalf { get; set; }
    public decimal EmergencySecondHalf { get; set; }


    public decimal EmergencyWFH { get; set; }


    public decimal Total { get; set; }

    public decimal Allowed { get; set; }

    public decimal Balance
    {
        get
        {
            return Allowed - Total;
        }
    }

    public decimal AllowedEmergency { get; set; }

    public decimal EmergencyBalance
    {
        get
        {
            return AllowedEmergency - (EmergencyLeave + EmergencyHalfDay);
            // return AllowedEmergency > (EmergencyLeave+EmergencyHalfDay) ? AllowedEmergency - (EmergencyLeave + EmergencyHalfDay) : 0;
        }
    }
}