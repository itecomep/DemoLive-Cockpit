using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.MeetingModule.Entities;
using MyCockpitView.WebApi.WFTaskModule.Entities;
using System.Text.RegularExpressions;
using MyCockpitView.WebApi.Services;
using MyCockpitView.WebApi.Exceptions;

namespace MyCockpitView.WebApi.MeetingModule.Services
{
    public interface IMeetingAttendeeService : IBaseEntityService<MeetingAttendee>
    {
    }

    public class MeetingAttendeeService : BaseEntityService<MeetingAttendee>, IMeetingAttendeeService
    {


        public MeetingAttendeeService(EntitiesContext db) : base(db)
        {
        }

        public IQueryable<MeetingAttendee> Get(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null)
        {
           
                IQueryable<MeetingAttendee> _query = base.Get(Filters);

                //Apply filter0

                if (Filters != null)
                {


                    if (Filters.Where(x => x.Key.Equals("MeetingID", StringComparison.OrdinalIgnoreCase)).Any())
                    {
                        var predicate = PredicateBuilder.False<MeetingAttendee>();
                        foreach (var _item in Filters.Where(x => x.Key.Equals("MeetingID", StringComparison.OrdinalIgnoreCase)))
                        {
                            var isNumeric = Convert.ToInt32(_item.Value);

                            predicate = predicate.Or(x => x.MeetingID == isNumeric);
                        }
                        _query = _query.Where(predicate);
                    }

                }

                if (Search != null && Search != string.Empty)
                {
                var _key = Search.Trim();
                _query = _query.Where(x => x._searchTags.ToLower().Contains(_key)
                        || x.Name.ToLower().Contains(_key)
                               || x.Email.ToLower().Contains(_key)
                                      || x.Company.ToLower().Contains(_key)
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

                    }

                    return _orderedQuery;
                }

                return _query
                              .OrderByDescending(x => x.Created);

          
        }

        public async Task<int> Create(MeetingAttendee Entity)
        {

            Regex regex = new Regex(McvConstant.EMAIL_REGEX, RegexOptions.None);
            if (Entity.Email == null || !regex.IsMatch(Entity.Email))
                throw new EntityServiceException("Email Id is invalid.");

            Entity.ID = await base.Create(Entity);

            var _meeting = await db.Meetings.AsNoTracking()
                .Where(x => x.ID == Entity.MeetingID).SingleOrDefaultAsync();
            if (_meeting.StatusFlag != McvConstant.MEETING_STATUSFLAG_SCHEDULED && Entity.TypeFlag == McvConstant.MEETING_ATTENDEE_TYPEFLAG_TO)//
            {
                await LogAttendeeTime(Entity.ContactID.Value, _meeting.ID, _meeting.StartDate, _meeting.EndDate, "MEETING");
            }

            return Entity.ID;

        }

        public async Task Update(MeetingAttendee Entity)
        {

           await base.Update(Entity);

            var _meeting = await db.Meetings.AsNoTracking()
                .Where(x => x.ID == Entity.MeetingID).SingleOrDefaultAsync();
            if (_meeting.StatusFlag != McvConstant.MEETING_STATUSFLAG_SCHEDULED && Entity.TypeFlag == McvConstant.MEETING_ATTENDEE_TYPEFLAG_TO)//
            {
                await LogAttendeeTime(Entity.ContactID.Value, _meeting.ID, _meeting.StartDate, _meeting.EndDate, "MEETING");
            }


        }

        public async Task LogAttendeeTime(int ContactID, int MeetingID, DateTime Start, DateTime End, string StageCode)
        {

            var _meeting = await db.Meetings.AsNoTracking()
                             .SingleOrDefaultAsync(x => x.ID == MeetingID);

            var _contact = await db.Contacts.AsNoTracking()
                            .SingleOrDefaultAsync(x => x.ID == ContactID);

            if (_meeting == null || _meeting.StatusFlag == McvConstant.MEETING_STATUSFLAG_SCHEDULED
                || _contact == null || _contact.Username == null) return;

            var _manValue = 1.0m;
            var _companyID = 1;
            var sharedService = new SharedService(db);
            var _appointment = await sharedService.GetLastAppointment(_contact.ID);
            if (_appointment != null)
            {
                _manValue = _appointment.ManValue;
                _companyID = _appointment.CompanyID;
            }


            var _valueHourRate = 0;//Convert.ToDecimal(await sharedService.GetPresetValue(McvConstant.COMPANY_VHR_COST));


            var _task = await db.WFTasks
            .Where(x => x.Entity != null
               && x.Entity==nameof(Meeting)
               && x.EntityID == MeetingID
               && x.ContactID == ContactID
               && x.WFStageCode==StageCode).FirstOrDefaultAsync();
            if (_task != null)
            {
                _task.ManValue = _manValue;
                _task.VHrRate = _valueHourRate;
                _task.CompanyID = _companyID;
                _task.StartDate = Start;
                _task.CompletedDate = End;
                _task.DueDate = End;
                _task.MHrAssessed = Convert.ToDecimal((End - Start).TotalHours);
                _task.MHrConsumed = Convert.ToDecimal((End - Start).TotalHours);
                _task.VHrConsumed = Math.Round(_task.MHrConsumed * _task.ManValue, 2);
                _task.VHrAssessed = Math.Round(_task.MHrAssessed * _task.ManValue, 2);
                _task.VHrConsumedCost = Math.Round(_task.VHrConsumed * _task.VHrRate, 2);
                _task.VHrAssessedCost = Math.Round(_task.VHrAssessed * _task.VHrRate, 2);
                await db.SaveChangesAsync();
            }
            else
            {

                _task = new WFTask
                {
                    Title = nameof(Meeting),
                    Entity = nameof(Meeting),
                    EntityID = _meeting.ProjectID,
                    WFStageCode = StageCode,
                    ProjectID = _meeting.ProjectID
                };
                _task.StartDate = DateTime.UtcNow;
                _task.Subtitle = $"{_meeting.Title} | {ClockTools.GetIST(_meeting.StartDate).ToString("dd MMM yyyy")}";
                _task.StartDate = _meeting.StartDate;
                _task.DueDate = _meeting.EndDate;
                _task.CompletedDate = _meeting.EndDate;
                _task.MHrAssigned = 0;
                _task.IsPreAssignedTimeTask = false;
                _task.ContactID = ContactID;
                _task.ManValue = _manValue;
                _task.VHrRate = _valueHourRate;
                _task.CompanyID = _companyID;
                _task.MHrAssessed = Convert.ToDecimal((End - Start).TotalHours);
                _task.MHrConsumed = Convert.ToDecimal((End - Start).TotalHours);
                _task.VHrConsumed = Math.Round(_task.MHrConsumed * _task.ManValue, 2);
                _task.VHrAssessed = Math.Round(_task.MHrAssessed * _task.ManValue, 2);
                _task.VHrConsumedCost = Math.Round(_task.VHrConsumed * _task.VHrRate, 2);
                _task.VHrAssessedCost = Math.Round(_task.VHrAssessed * _task.VHrRate, 2);
                _task.StatusFlag = McvConstant.WFTASK_STATUSFLAG_COMPLETED;
                _task.Comment = "On behalf by " + _meeting.CreatedBy;
                db.WFTasks.Add(_task);
                await db.SaveChangesAsync();

            }

            var _timeEntries = await db.TimeEntries
            .Where(x => x.WFTaskID == _task.ID)
            .ToListAsync();

            if (_timeEntries.Any())
            {
                db.TimeEntries.RemoveRange(_timeEntries);

                await db.SaveChangesAsync();
            }



            if (_task != null)
            {
                db.TimeEntries.Add(new TimeEntry
                {
                    ContactID = ContactID,
                    Entity = nameof(Meeting),
                    EntityID = MeetingID,
                    EntityTitle = _meeting.Code,
                    StartDate = Start,
                    EndDate = End,
                    ManHours = Convert.ToDecimal((End - Start).TotalHours),
                    WFTaskID = _task.ID,
                    StatusFlag = 1,
                    TaskTitle = (_task.Title + " " + _task.Subtitle).Trim(),
                });
                await db.SaveChangesAsync();
            }

        }

    }
}