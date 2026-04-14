using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.SiteVisitModule.Entities;
using MyCockpitView.WebApi.WFTaskModule.Entities;
using System.Text.RegularExpressions;
using MyCockpitView.WebApi.Services;
using MyCockpitView.WebApi.Exceptions;

namespace MyCockpitView.WebApi.SiteVisitModule.Services
{
    public interface ISiteVisitAttendeeService : IBaseEntityService<SiteVisitAttendee>
    {
    }

    public class SiteVisitAttendeeService : BaseEntityService<SiteVisitAttendee>, ISiteVisitAttendeeService
    {


        public SiteVisitAttendeeService(EntitiesContext db) : base(db)
        {
        }

        public IQueryable<SiteVisitAttendee> Get(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null)
        {

            IQueryable<SiteVisitAttendee> _query = base.Get(Filters);

            //Apply filter0

            if (Filters != null)
            {


                if (Filters.Where(x => x.Key.Equals("SiteVisitID", StringComparison.OrdinalIgnoreCase)).Any())
                {
                    var predicate = PredicateBuilder.False<SiteVisitAttendee>();
                    foreach (var _item in Filters.Where(x => x.Key.Equals("SiteVisitID", StringComparison.OrdinalIgnoreCase)))
                    {
                        var isNumeric = Convert.ToInt32(_item.Value);

                        predicate = predicate.Or(x => x.SiteVisitID == isNumeric);
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

        public async Task<int> Create(SiteVisitAttendee Entity)
        {

            Regex regex = new Regex(McvConstant.EMAIL_REGEX, RegexOptions.None);
            if (Entity.Email == null || !regex.IsMatch(Entity.Email))
                throw new EntityServiceException("Email Id is invalid.");

            Entity.ID = await base.Create(Entity);

            var _SiteVisit = await db.SiteVisits.AsNoTracking()
                .Where(x => x.ID == Entity.SiteVisitID).SingleOrDefaultAsync();
            if (_SiteVisit.StatusFlag != McvConstant.SITE_VISIT_STATUSFLAG_SCHEDULED && Entity.TypeFlag == McvConstant.SITE_VISIT_ATTENDEE_TYPEFLAG_TO)//
            {
                await LogAttendeeTime(Entity.ContactID.Value, _SiteVisit.ID, _SiteVisit.StartDate, _SiteVisit.EndDate, "SiteVisit");
            }

            return Entity.ID;

        }

        public async Task Update(SiteVisitAttendee Entity)
        {

            await base.Update(Entity);

            var _SiteVisit = await db.SiteVisits.AsNoTracking()
                .Where(x => x.ID == Entity.SiteVisitID).SingleOrDefaultAsync();
            if (_SiteVisit.StatusFlag != McvConstant.SITE_VISIT_STATUSFLAG_SCHEDULED && Entity.TypeFlag == McvConstant.SITE_VISIT_ATTENDEE_TYPEFLAG_TO)//
            {
                await LogAttendeeTime(Entity.ContactID.Value, _SiteVisit.ID, _SiteVisit.StartDate, _SiteVisit.EndDate, "SiteVisit");
            }


        }

        public async Task LogAttendeeTime(int ContactID, int SiteVisitID, DateTime Start, DateTime End, string StageCode)
        {

            var _SiteVisit = await db.SiteVisits.AsNoTracking()
                             .SingleOrDefaultAsync(x => x.ID == SiteVisitID);

            var _contact = await db.Contacts.AsNoTracking()
                            .SingleOrDefaultAsync(x => x.ID == ContactID);

            if (_SiteVisit == null || _SiteVisit.StatusFlag == McvConstant.SITE_VISIT_STATUSFLAG_SCHEDULED
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
               && x.Entity == nameof(SiteVisit)
               && x.EntityID == SiteVisitID
               && x.ContactID == ContactID
               && x.WFStageCode == StageCode).FirstOrDefaultAsync();
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
                    Title = nameof(SiteVisit),
                    Entity = nameof(SiteVisit),
                    EntityID = _SiteVisit.ProjectID,
                    WFStageCode = StageCode,
                    ProjectID = _SiteVisit.ProjectID
                };
                _task.StartDate = DateTime.UtcNow;
                _task.Subtitle = $"{_SiteVisit.Title} | {ClockTools.GetIST(_SiteVisit.StartDate).ToString("dd MMM yyyy")}";
                _task.StartDate = _SiteVisit.StartDate;
                _task.DueDate = _SiteVisit.EndDate;
                _task.CompletedDate = _SiteVisit.EndDate;
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
                _task.Comment = "On behalf by " + _SiteVisit.CreatedBy;
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
                    Entity = nameof(SiteVisit),
                    EntityID = SiteVisitID,
                    EntityTitle = _SiteVisit.Code,
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