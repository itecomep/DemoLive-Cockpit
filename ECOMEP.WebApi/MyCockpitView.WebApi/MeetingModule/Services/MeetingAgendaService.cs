using DocumentFormat.OpenXml.Vml.Office;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.ContactModule.Services;
using MyCockpitView.WebApi.Entities;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.WebApi.MeetingModule.Entities;
using MyCockpitView.WebApi.Models;
using MyCockpitView.WebApi.Services;
using MyCockpitView.WebApi.TodoModule.Entities;
using MyCockpitView.WebApi.WFTaskModule.Services;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace MyCockpitView.WebApi.MeetingModule.Services;

public interface IMeetingAgendaService : IBaseEntityService<MeetingAgenda>
{
    Task<string> GetMeetingAgendaHistoryString(int AgendaID);
    Task SendAgendaFollowUpEmails();
}

public class MeetingAgendaService : BaseEntityService<MeetingAgenda>, IMeetingAgendaService
{

    public MeetingAgendaService(EntitiesContext db) : base(db)
    {
    }

    public IQueryable<MeetingAgenda> Get(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null)
    {
       
            IQueryable<MeetingAgenda> _query = base.Get(Filters).Include(x => x.Attachments);

            //Apply filters
            if (Filters != null)
            {


                if (Filters.Where(x => x.Key.Equals("MeetingID", StringComparison.OrdinalIgnoreCase)).Any())
                {
                    var predicate = PredicateBuilder.False<MeetingAgenda>();
                    foreach (var _item in Filters.Where(x => x.Key.Equals("MeetingID", StringComparison.OrdinalIgnoreCase)))
                    {
                        var isNumeric = Convert.ToInt32(_item.Value);

                        predicate = predicate.Or(x => x.MeetingID == isNumeric);
                    }
                    _query = _query.Where(predicate);
                }

            if (Filters.Where(x => x.Key.Equals("ProjectID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<MeetingAgenda>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("ProjectID", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(x => x.ProjectID == isNumeric);
                }
                _query = _query.Where(predicate);
            }

            if (Filters.Where(x => x.Key.Equals("TodoID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<MeetingAgenda>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("TodoID", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(x => x.TodoID == isNumeric);
                }
                _query = _query.Where(predicate);
            }

            if (Filters.Where(x => x.Key.Equals("isReadOnly", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<MeetingAgenda>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("isReadOnly", StringComparison.OrdinalIgnoreCase)))
                {
                    var isReadOnly = Convert.ToBoolean(_item.Value);

                    predicate = predicate.Or(x => x.IsReadOnly == isReadOnly);
                }
                _query = _query.Where(predicate);
            }

            if (Filters.Where(x => x.Key.Equals("isForwarded", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _item = Filters.First(x => x.Key.Equals("isForwarded", StringComparison.OrdinalIgnoreCase));

                var isBoolean = Boolean.TryParse(_item.Value, out bool result);

                if (isBoolean && result)
                    _query = _query.Where(x => x.IsForwarded);
                else
                    _query = _query.Where(x => !x.IsForwarded);
            }


            if (Filters.Where(x => x.Key.Equals("isDelayed", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _today = ClockTools.GetISTNow();
                var _item = Convert.ToBoolean(Filters.First(x => x.Key.Equals("isDelayed", StringComparison.OrdinalIgnoreCase)).Value);

                var predicate = PredicateBuilder.False<MeetingAgenda>();

                if (_item)
                {
                    predicate = predicate.Or(x => x.DueDate.Value.Date <= _today);
                }
                else
                {
                    predicate = predicate.Or(x => x.DueDate.Value.Date > _today);
                }

                _query = _query.Where(x => !x.IsForwarded).Where(predicate);
            }

            if (Filters.Where(x => x.Key.Equals("entity", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<MeetingAgenda>();
                if (Filters.Where(x => x.Key.Equals("Entity", StringComparison.OrdinalIgnoreCase)
                    && x.Value.Equals(nameof(Project), StringComparison.OrdinalIgnoreCase)).Any())
                {
                    var _activeProjects = db.Projects.AsNoTracking()
                                          .Where(x =>
               x.StatusFlag == 0 //Inquiry
            || x.StatusFlag == 1 //pre-proposal
            || x.StatusFlag == 2 //inprogress
                                 || x.StatusFlag == 6 //locked
            );

                    if (Filters.Where(x => x.Key.Equals("projectPartnerContactID", StringComparison.OrdinalIgnoreCase)).Any())
                    {
                        var predicate2 = PredicateBuilder.False<Project>();
                        foreach (var _item in Filters.Where(x => x.Key.Equals("projectPartnerContactID", StringComparison.OrdinalIgnoreCase)))
                        {
                            int _value = Convert.ToInt32(_item.Value);
                            predicate2 = predicate2.Or(x => x.Associations
                            .Where(a => a.TypeFlag == 0
                            && a.ContactID == _value)
                            .Any()
                            );
                        }
                        _activeProjects = _activeProjects.Include(x => x.Associations).Where(predicate2);
                    }
                    if (Filters.Where(x => x.Key.Equals("projectAssociateContactID", StringComparison.OrdinalIgnoreCase)).Any())
                    {
                        var predicate2 = PredicateBuilder.False<Project>();
                        foreach (var _item in Filters.Where(x => x.Key.Equals("projectAssociateContactID", StringComparison.OrdinalIgnoreCase)))
                        {
                            int _value = Convert.ToInt32(_item.Value);
                            predicate2 = predicate2.Or(x => x.Associations
                            .Where(a => a.TypeFlag == 1
                            && a.ContactID == _value)
                            .Any()
                            );
                        }
                        _activeProjects = _activeProjects.Include(x => x.Associations).Where(predicate2);
                    }
                    if (Filters.Where(x => x.Key.Equals("projectPartnerOrAssociateContactID", StringComparison.OrdinalIgnoreCase)).Any())
                    {
                        var predicate2 = PredicateBuilder.False<Project>();
                        foreach (var _item in Filters.Where(x => x.Key.Equals("projectPartnerOrAssociateContactID", StringComparison.OrdinalIgnoreCase)))
                        {
                            int _value = Convert.ToInt32(_item.Value);
                            predicate2 = predicate2.Or(x => x.Associations
                            .Where(a => a.ContactID == _value)
                            .Any()
                            );
                        }
                        _activeProjects = _activeProjects.Include(x => x.Associations).Where(predicate2);
                    }

                    predicate = predicate.Or(x => x.ProjectID != null
                        && _activeProjects.Select(p => p.ID).Where(p => p == x.ProjectID.Value).Any());
                }

                if (Filters.Where(x => x.Key.Equals("Entity", StringComparison.OrdinalIgnoreCase)
                    && x.Value.Equals("NO-ENTITY", StringComparison.OrdinalIgnoreCase)).Any())
                {
                    predicate = predicate.Or(x => x.ProjectID == null);
                }
                _query = _query.Where(predicate);
            }

            if (Filters.Where(x => x.Key.Equals("ActionBy", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<MeetingAgenda>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("ActionBy", StringComparison.OrdinalIgnoreCase)))
                {
                    predicate = predicate.Or(x => x.ActionBy != null && x.ActionBy.Equals(_item.Value, StringComparison.OrdinalIgnoreCase));
                }
                _query = _query.Where(predicate);
            }

            if (Filters.Where(x => x.Key.Equals("actionByContactID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<MeetingAgenda>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("actionByContactID", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(x => x.ActionByContactID != null && x.ActionByContactID == isNumeric);
                }
                _query = _query.Where(predicate);
            }

            if (Filters.Where(x => x.Key.Equals("ProjectID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<MeetingAgenda>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("ProjectID", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(x => x.ProjectID != null && x.ProjectID == isNumeric);
                }
                _query = _query.Where(predicate);
            }

            if (Filters.Where(x => x.Key.Equals("meetingContactID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<MeetingAgenda>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("meetingContactID", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(x => x.Meeting.ContactID == isNumeric);
                }
                _query = _query.Include(x => x.Meeting).Where(predicate);
            }
            if (Filters.Where(x => x.Key.Equals("projectPartnerContactID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _activeProjects = db.Projects.AsNoTracking()
                       .Where(x => x.StatusFlag != 4 //completed
                       && x.StatusFlag != -1); //discarded

                var predicate2 = PredicateBuilder.False<Project>();

                foreach (var _item in Filters.Where(x => x.Key.Equals("projectPartnerContactID", StringComparison.OrdinalIgnoreCase)))
                {
                    int _value = Convert.ToInt32(_item.Value);
                    predicate2 = predicate2.Or(x => x.Associations
                    .Where(a => a.TypeFlag == 0
                    && a.ContactID == _value).Any());
                }

                _activeProjects = _activeProjects.Include(x => x.Associations).Where(predicate2);

                var predicate = PredicateBuilder.False<MeetingAgenda>();
                predicate = predicate.Or(x => x.ProjectID != null
                            && _activeProjects.Where(p => p.ID == x.ProjectID.Value).Any());
                _query = _query.Include(x => x.Meeting).Where(predicate);
            }
            if (Filters.Where(x => x.Key.Equals("projectAssociateContactID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _activeProjects = db.Projects.AsNoTracking()
                       .Where(x => x.StatusFlag != 4 //completed
                       && x.StatusFlag != -1); //discarded

                var predicate2 = PredicateBuilder.False<Project>();

                foreach (var _item in Filters.Where(x => x.Key.Equals("projectAssociateContactID", StringComparison.OrdinalIgnoreCase)))
                {
                    int _value = Convert.ToInt32(_item.Value);
                    predicate2 = predicate2.Or(x => x.Associations
                    .Where(a => a.TypeFlag == 1
                    && a.ContactID == _value).Any());
                }

                _activeProjects = _activeProjects.Include(x => x.Associations).Where(predicate2);

                var predicate = PredicateBuilder.False<MeetingAgenda>();
                predicate = predicate.Or(x => x.ProjectID != null
                            && _activeProjects.Where(p => p.ID == x.ProjectID.Value).Any());
                _query = _query.Include(x => x.Meeting).Where(predicate);
            }
            if (Filters.Where(x => x.Key.Equals("contactID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _associatedProjectsForContact = db.Projects.AsNoTracking()
                      .Where(x => x.StatusFlag != 4 //completed
                      && x.StatusFlag != -1); //discarded

                var predicate2 = PredicateBuilder.False<Project>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("contactID", StringComparison.OrdinalIgnoreCase)))
                {
                    int _value = Convert.ToInt32(_item.Value);
                    predicate2 = predicate2.Or(x => x.Associations
                    .Where(a => a.ContactID == _value).Any());
                }

                _associatedProjectsForContact = _associatedProjectsForContact.Include(x => x.Associations).Where(predicate2);

                var predicate = PredicateBuilder.False<MeetingAgenda>();

                foreach (var _item in Filters.Where(x => x.Key.Equals("contactID", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(x => (x.ActionByContactID != null && x.ActionByContactID == isNumeric)
                     || (x.Meeting.ContactID == isNumeric)
                     || (x.ProjectID != null
                            && _associatedProjectsForContact.Where(p => p.ID == x.ProjectID.Value).Any())
                    );
                }
                _query = _query.Include(x => x.Meeting).Where(predicate);
            }

            if (Filters.Where(x => x.Key.Equals("dueDate", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _item = Filters.First(x => x.Key.Equals("dueDate", StringComparison.OrdinalIgnoreCase));
                DateTime result = Convert.ToDateTime(_item.Value);
                _query = _query.Where(x => x.DueDate != null && x.DueDate.Value.Date == result.Date);
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

            if (Filters.Where(x => x.Key.Equals("meetingTitle", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<MeetingAgenda>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("meetingTitle", StringComparison.OrdinalIgnoreCase)))
                {
                    predicate = predicate.Or(x => x.Meeting.Title.Equals(_item.Value, StringComparison.OrdinalIgnoreCase));
                }
                _query = _query.Include(x => x.Meeting).Where(predicate);
            }
            if (Filters.Where(x => x.Key.Equals("meetingstatusFlag", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<MeetingAgenda>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("meetingstatusFlag", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(x => x.Meeting.StatusFlag == isNumeric);
                }
                _query = _query.Include(x => x.Meeting).Where(predicate);
            }

            if (Filters.Where(x => x.Key.Equals("usersOnly", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _activeUserContactIDs = db.Contacts.AsNoTracking()
                   .Where(x => x.Username != null)
                    .Select(x => x.ID).ToList();

                var predicate = PredicateBuilder.False<MeetingAgenda>();
                predicate = predicate.Or(x => (x.ActionByContactID != null
                && _activeUserContactIDs.Any(c => c == x.ActionByContactID))
                //|| (_activeUserContactIDs.Any(c => c == x.Meeting.ContactID))
                );

                _query = _query.Include(x => x.Meeting).Where(predicate);
            }

        }

            if (Search != null && Search != string.Empty)
            {
            var _key = Search.Trim();
            _query = _query.Where(x => x._searchTags.ToLower().Contains(_key)
                    || x.Title.ToLower().Contains(_key)
                           || x.Subtitle.ToLower().Contains(_key)
                                  || x.Comment.ToLower().Contains(_key)
                                     || x.ActionBy.ToLower().Contains(_key)
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

                else if (key.Trim().Equals("DueDate", StringComparison.OrdinalIgnoreCase))
                    _orderedQuery = _orderedQuery
                            .ThenBy(x => x.DueDate);

                else if (key.Trim().Equals("DueDate desc", StringComparison.OrdinalIgnoreCase))
                    _orderedQuery = _orderedQuery
                            .ThenByDescending(x => x.DueDate);

            }

                return _orderedQuery;
            }

            return _query
                          .OrderBy(x => x.DueDate);

      
    }

    public async Task<MeetingAgenda> GetById(int Id)
    {
        var query = await Get()
                    .Include(x => x.Attachments)
             .SingleOrDefaultAsync(i => i.ID == Id);

        return query;

    }

    public async Task<MeetingAgenda> GetById(Guid Id)
    {
        var query = await Get()
          .Include(x => x.Attachments)
             .SingleOrDefaultAsync(i => i.UID == Id);

        return query;

    }


   

    public async Task<string> GetMeetingAgendaHistoryString(int AgendaID)
    {

        var _agenda = await db.MeetingAgendas.AsNoTracking().Where(x => !x.IsDeleted)
            .Include(x => x.Meeting.Contact)
            .Where(x => x.ID == AgendaID)
            .SingleOrDefaultAsync();
        if (_agenda == null) throw new EntityServiceException("Agenda not found for getting Comment History!");
        var _commentHistory = new StringBuilder();

        //Line 1
        if (_agenda.UpdateFrom != null)
        {
            //if (_agenda.UpdateFrom.ToUpper() == "SUBMISSION" && _agenda.PackageID != null)
            //{
            //    var _package = await db.Packages.AsNoTracking().SingleOrDefaultAsync(x => x.ID == _agenda.PackageID);
            //    if (_package.SubmissionDate != null)
            //        _commentHistory.AppendLine($"[{ClockTools.GetIST(_package != null ? _package.SubmissionDate.Value : _agenda.Modified).ToString("dd MMM yyyy HH:mm")} {(_package != null ? _package.CreatedBy : _agenda.ModifiedBy)} {_agenda.UpdateFrom.ToUpper()}] ");
            //}
            //else
            {
                _commentHistory.AppendLine("[" + ClockTools.GetIST(_agenda.Modified).ToString("dd MMM yyyy HH:mm")
                  + " "
                  + _agenda.ModifiedBy
                  + " "
                  + _agenda.UpdateFrom.ToUpper() + "] ");
            }
        }
        else
        {
            _commentHistory.AppendLine("[" + ClockTools.GetIST(_agenda.Meeting.StartDate).ToString("dd MMM yyyy HH:mm")
              + " "
              + _agenda.Meeting.Contact.FullName
              + " "
              + (_agenda.Meeting.TypeFlag == 1 ? " C-NOTE " :
              (_agenda.Meeting.TypeFlag == 2 ? " INSPECTION " : " MEETING")) + "] ");
        }


        //line 2                   
        _commentHistory.AppendLine((_agenda.Comment != null ? _agenda.Comment.Trim() : (_agenda.PreviousComment != null ? _agenda.PreviousComment.Trim() : "NOT DISCUSSED")));


        //line 3
        if (_agenda.ActionBy != null)
            _commentHistory.Append(" Action By: " + _agenda.ActionBy);

        if (_agenda.DueDate != null)
            _commentHistory.AppendLine(" Due: " + ClockTools.GetIST(_agenda.DueDate.Value).ToString("dd MMM yyyy"));

        //if (_agenda.Meeting.TypeFlag == 1)
        //{
        //    if (_agenda.Comment == null || _agenda.Comment == String.Empty)
        //    {
        //        _commentHistory = new StringBuilder();

        //    }
        //}

        //line 4
        if (_agenda.PreviousHistory != null)
        {
            _commentHistory.AppendLine("  ");//blank line
            _commentHistory.AppendLine(_agenda.PreviousHistory);
        }

        return _commentHistory.ToString().Trim();


    }

    public async Task<int> Create(MeetingAgenda Entity)
    {
        var meeting = await db.Meetings.AsNoTracking()
            .SingleOrDefaultAsync(x => x.ID == Entity.MeetingID);

        if (meeting == null) throw new EntityServiceException($"{nameof(Meeting)} not found!");

        Entity.MeetingDate = meeting.StartDate;
        Entity.MeetingTitle = meeting.Title;
        Entity.ProjectID = meeting.ProjectID;

        return await base.Create(Entity);
    }

    public async Task Update(MeetingAgenda UpdatedEntity)
    {

        var _originalEntity = await db.MeetingAgendas.AsNoTracking().SingleOrDefaultAsync(x => x.ID == UpdatedEntity.ID);

        if (_originalEntity == null) throw new EntityServiceException("Meeting agenda not found!");

        if (UpdatedEntity.Title == null || UpdatedEntity.Title == String.Empty) throw new EntityServiceException("Agenda title cannot be empty!");

        if (_originalEntity.TypeFlag != McvConstant.MEETING_TYPEFLAG_INSPECTION)
        {
            if (UpdatedEntity.Subtitle == null || UpdatedEntity.Subtitle == String.Empty) throw new EntityServiceException("Agenda subtitle cannot be empty!");
        }
        else
        {
            UpdatedEntity.Subtitle = "Inspection";
        }

        var _meeting = await db.Meetings.AsNoTracking().Where(x => x.ID == UpdatedEntity.MeetingID).SingleOrDefaultAsync();
        if (_meeting == null) throw new EntityServiceException("Meeting not found for this agenda!");
        UpdatedEntity.ProjectID = _meeting.ProjectID;
        UpdatedEntity.MeetingDate = _meeting.StartDate;
        UpdatedEntity.MeetingTitle = _meeting.Title;
        UpdatedEntity.TypeFlag = _meeting.TypeFlag;
        //await RecordVersion(Entity.ID);
        UpdatedEntity.NotDiscussed = false;
        if (_meeting.TypeFlag == McvConstant.MEETING_TYPEFLAG_MEETING && (UpdatedEntity.Comment == null || UpdatedEntity.Comment.Trim() == String.Empty))
        {
            UpdatedEntity.Comment = "Not Discussed";
            UpdatedEntity.NotDiscussed = true;
        }
        var sharedService = new SharedService(db);
        if (UpdatedEntity.DueDate != null)
            UpdatedEntity.DueDate = ClockTools.GetUTC(ClockTools.GetIST(UpdatedEntity.DueDate.Value).Date.AddMinutes(await sharedService.GetBusinessEndMinutesIST()));

        if (UpdatedEntity.ActionByContactID == null)
        {
            UpdatedEntity.ActionBy = null;
        }

        if (UpdatedEntity.StatusFlag == McvConstant.MEETING_AGENDA_STATUSFLAG_RESOLVED)
        {
            UpdatedEntity.DueDate = null;
            UpdatedEntity.ActionBy = null;
            UpdatedEntity.ActionByContactID = null;
        }

        if (_meeting.TypeFlag == McvConstant.MEETING_TYPEFLAG_MEETING
            && _meeting.StatusFlag >= McvConstant.MEETING_STATUSFLAG_SENT) //after Sent
        {
            if (UpdatedEntity.Comment != _originalEntity.Comment
              || UpdatedEntity.StatusFlag != _originalEntity.StatusFlag
              || UpdatedEntity.ActionBy != _originalEntity.ActionBy
              || UpdatedEntity.DueDate != _originalEntity.DueDate
              || UpdatedEntity.Progress != _originalEntity.Progress
              )  //Any change after Minutes sent
            {
                UpdatedEntity.ReminderCount = 0;
                UpdatedEntity.UpdateFrom = "POST-MEETING";
                if (!UpdatedEntity.SendUpdate)
                {
                    UpdatedEntity.PreviousActionBy = _originalEntity.ActionBy;
                    UpdatedEntity.PreviousDueDate = _originalEntity.DueDate;
                    UpdatedEntity.PreviousComment = _originalEntity.Comment;
                    UpdatedEntity.PreviousProgress = _originalEntity.PreviousProgress;

                    UpdatedEntity.PreviousHistory = await GetMeetingAgendaHistoryString(UpdatedEntity.ID);
                }

                //UpdatedEntity.SendUpdate = true;
            }
        }

        await base.Update(UpdatedEntity);


    }


    public async Task Delete(int Id)
    {
        var entity = await GetById(Id);

        if (entity.PreviousAgendaID != null)
        {
            var _previousAgenda = await Get()
                                    .Where(x => !x.IsReadOnly)
                                    .Where(x => x.ID == entity.PreviousAgendaID.Value)
                                    .SingleOrDefaultAsync();

            if (_previousAgenda != null)
            {
                _previousAgenda.IsForwarded = false;
                //_previousAgenda.PackageID = _entity.PackageID;
                _previousAgenda.TodoID = entity.TodoID;

                //if (_previousAgenda.StatusFlag == McvConstant.MEETING_AGENDA_STATUSFLAG_PENDING)
                //    await AssignAgendaTasks(_previousAgenda.ID);

                await Update(_previousAgenda);
            }
        }
        var attachmentService = new BaseAttachmentService<MeetingAgendaAttachment>(db);

        foreach (var x in entity.Attachments)
        {
            await attachmentService.Delete(x.ID);
        }

        await base.Delete(Id);
    }

    public async Task SendAgendaFollowUpEmails()
    {
        var _reportDate = ClockTools.GetISTNow();
        var sharedService = new SharedService(db);
        var _senderEmail = await sharedService.GetPresetValue(McvConstant.AGENDA_FOLLOW_UP_EMAIL_SENDER_ID);
        var _senderName = await sharedService.GetPresetValue(McvConstant.AGENDA_FOLLOW_UP_EMAIL_SENDER_NAME);

        var _maxReminderCountForEscalation = Convert.ToInt32(await sharedService.GetPresetValue(McvConstant.AGENDA_MAX_REMINDER_COUNT_FOR_ESCALATION));
        var _maxReminderCountForDiscard = Convert.ToInt32(await sharedService.GetPresetValue(McvConstant.AGENDA_MAX_REMINDER_COUNT_FOR_DISCARD));

        var _defaultCCList = await sharedService.GetPresetValue(McvConstant.AGENDA_FOLLOW_UP_EMAIL_CC);
      

        var _filters = new List<QueryFilter>
                {
                    new QueryFilter { Key = "statusFlag", Value = McvConstant.MEETING_AGENDA_STATUSFLAG_PENDING.ToString() },
                    new QueryFilter { Key = "isForwarded", Value = "false" },
                    //new QueryFilter { Key = "entity", Value = nameof(Project) },
                    new QueryFilter { Key = "isDelayed", Value = "true" },
                    new QueryFilter { Key = "typeFlag", Value = McvConstant.MEETING_TYPEFLAG_MEETING.ToString() },
                                  new QueryFilter { Key = "typeFlag", Value = McvConstant.MEETING_TYPEFLAG_CNOTE.ToString() },
                };

        //var _activeProjectIDs = db.Projects
        //    .Where(x =>
        //       x.StatusFlag == McvConstant.PROJECT_STATUSFLAG_INQUIRY //Inquiry
        //    || x.StatusFlag == McvConstant.PROJECT_STATUSFLAG_PREPOPOSAL //pre-proposal
        //    || x.StatusFlag == McvConstant.PROJECT_STATUSFLAG_INPROGRESS //inprogress
        //                                                                 //|| x.StatusFlag == 6 //locked
        //    )
        //    .Select(x => x.ID);

        var _activeUserContactIDs = db.Contacts.AsNoTracking()
                  .Where(x => x.Username != null)
                   .Select(x => x.ID);

        //var _contactProjectGroup = await Get(_filters)
        var _contactGroup = await Get()
            .Where(x => !x.IsReadOnly)
                .Where(x => x.StatusFlag == McvConstant.MEETING_AGENDA_STATUSFLAG_PENDING && !x.IsForwarded)
                  .Where(x =>  x.TodoID == null)
            .Where(x => x.DueDate.Value.Date < _reportDate)
         .Where(x => x.ActionByContactID != null)
         //.Where(x => _activeProjectIDs.Any(p => p == x.ProjectID))
          .Where(x => !_activeUserContactIDs.Any(p => p == x.ActionByContactID.Value))
         .Select(x => new { 
             ContactID = x.ActionByContactID,
             MeetingTitle = x.MeetingTitle
         })
         .Distinct()
         .ToListAsync();

        //var associationTypeMasters = await db.TypeMasters.AsNoTracking()
        //                    .Where(x => x.Entity == nameof(ProjectAssociation)).ToListAsync();

        foreach (var group in _contactGroup)
        {
            try
            {
                var _contact = await db.Contacts.AsNoTracking().Where(x => x.ID == group.ContactID).SingleOrDefaultAsync();
                if (_contact != null)
                {
                    //var _project = await db.Projects
                    //    .Where(x => x.ID == group.ProjectID)
                    //    .Include(x => x.Associations.Select(c => c.Contact))
                    //    .SingleOrDefaultAsync();

                    var _groupAgendas = await Get(_filters)
                         .Where(x => x.DueDate.Value.Date < _reportDate)
                          .Where(x => x.ActionByContactID != null)
                        .Where(x => 
                        x.MeetingTitle==group.MeetingTitle &&
                        x.ActionByContactID == group.ContactID)
                           .Where(x => !x.IsReadOnly)
                        .OrderBy(x => x.DueDate)
                        .ToListAsync();

                    if (_groupAgendas.Any())
                    {
                        try
                        {
                            var _meetingID = _groupAgendas.FirstOrDefault().MeetingID;
                            var _meeting = await db.Meetings.AsNoTracking()
                                .Include(x => x.Contact)
                                .Include(x=>x.Attendees)
                                .Where(x => !x.IsReadOnly)
                                .Where(x => x.ID == _meetingID)
                                .SingleOrDefaultAsync();

                            var _creator=_meeting.Attendees.FirstOrDefault(x=>x.ContactID==_meeting.ContactID);
                            if (_creator == null)
                            {
                                _creator = new MeetingAttendee { Name = _meeting.Contact.FullName, Email = _meeting.Contact.Emails.FirstOrDefault(c=>c.IsPrimary)?.Email };
                            }

                            var _receiver = _meeting.Attendees.FirstOrDefault(x => x.ContactID == group.ContactID);
                            if (_receiver == null)
                            {
                                _receiver = new MeetingAttendee { Name = _contact.FullName, Email = _contact.Emails.FirstOrDefault(c => c.IsPrimary)?.Email };
                            }

                            if (_meeting != null && _meeting.StatusFlag == McvConstant.MEETING_STATUSFLAG_SENT)
                            {
                                var toList = new List<EmailContact>() {
                                                      new EmailContact {
                                                          Name = _contact.FullName,
                                                          Email = _contact.Emails.FirstOrDefault(c=>c.IsPrimary)?.Email
                                                      }
                                                    };

                                var ccList = new List<EmailContact>() {
                                                        //new EmailContact {
                                                        //    ID=339,
                                                        //    Name = "Newarch Landscapes LLP",
                                                        //    Email = "backup@newarchllp.com"
                                                        //}
                                                    };


                                var _maxReminderCount = _groupAgendas.Max(x => x.ReminderCount);

                                //foreach (var association in _project.Associations)
                                //{
                                //    var _typeMaster = associationTypeMasters.FirstOrDefault(x => x.Value == association.TypeFlag);

                                //    if (_typeMaster != null && _typeMaster.Description != null)
                                //    {
                                //        JObject jsonObject = JObject.Parse(_typeMaster.Description);
                                //        var includeInAgendaFollowUp = (bool)jsonObject["includeInAgendaFollowUp"];
                                //        var includeInAgendaFollowUpCC = (bool)jsonObject["includeInAgendaFollowUpCC"];
                                //        var agendaFollowupMinReminderCount = (int)jsonObject["agendaFollowupMinReminderCount"];


                                //        //var data = JsonConvert.DeserializeObject<dynamic>(_typeMaster.Description);

                                //        //var includeInAgendaFollowUp = Convert.ToBoolean(data.GetType().GetProperty("includeInAgendaFollowUp").GetValue(data, null));
                                //        //var includeInAgendaFollowUpCC = Convert.ToBoolean(data.GetType().GetProperty("includeInAgendaFollowUpCC").GetValue(data, null));
                                //        //var agendaFollowupMinReminderCount = Convert.ToInt32(data.GetType().GetProperty("agendaFollowupMinReminderCount").GetValue(data, null));

                                //        if (_maxReminderCount >= agendaFollowupMinReminderCount)
                                //        {
                                //            if (includeInAgendaFollowUp)
                                //            {
                                //                if (!toList.Any(x => x.Email == association.Contact.Email1) && !ccList.Any(x => x.Email == association.Contact.Email1))
                                //                    toList.Add(new EmailContact
                                //                    {
                                //                        ID = association.Contact.ID,
                                //                        Name = association.Contact.FullName,
                                //                        Email = association.Contact.Email1
                                //                    });
                                //            }
                                //            else if (includeInAgendaFollowUpCC)
                                //            {
                                //                if (!toList.Any(x => x.Email == association.Contact.Email1) && !ccList.Any(x => x.Email == association.Contact.Email1))
                                //                    ccList.Add(new EmailContact
                                //                    {
                                //                        ID = association.Contact.ID,
                                //                        Name = association.Contact.FullName,
                                //                        Email = association.Contact.Email1
                                //                    });
                                //            }
                                //        }
                                //    }


                                //}

                                var senderSignatureName = _meeting.Contact.FullName;
                                var senderSignatureDesignation = "";
                                var appointmentService = new ContactAppointmentService(db);
                                var appointments = await appointmentService.Get().Where(x => x.StatusFlag == McvConstant.APPOINTMENT_STATUSFLAG_APPOINTED)
                                    .Where(x => x.ContactID == _meeting.ContactID)
                                    //.Include(x=>x.Company)
                                    .Select(x => x.Designation).Distinct()
                                    .ToListAsync();
                                if (appointments.Any())
                                {
                                    senderSignatureDesignation = string.Join(",", appointments);
                                }

                                var _emailHeading = "REQUEST FOR ACTION";

                                var _emailSubject = $"{group.MeetingTitle} | {_emailHeading} | {_contact.FullName} | {_reportDate.ToString("dd MMM yyyy")}";
                                var _replyParameter = $"mailto:{_creator.Email}?cc={_defaultCCList}&subject=RE:{_emailSubject.ToUpper()}";


                                StringBuilder sb = new StringBuilder();
                                sb.AppendLine("<!DOCTYPE html>");
                                sb.AppendLine("<html>");
                                sb.AppendLine("<head>");
                                sb.AppendLine("    <meta charset=\"UTF-8\" />");
                                sb.AppendLine("    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />");
                                sb.AppendLine("    <title>Email Design</title>");
                                sb.AppendLine("    <style>");
                                sb.AppendLine("        /* Reset styles for better compatibility */");
                                sb.AppendLine("        body {");
                                sb.AppendLine("            margin: 0;");
                                sb.AppendLine("            padding: 0;");
                                sb.AppendLine("            font-family: Calibri, sans-serif;");
                                sb.AppendLine("            font-size: 14px;");
                                sb.AppendLine("            line-height: 1.6;");
                                sb.AppendLine("            max-width: 500px;");
                                sb.AppendLine("            margin: 0 auto;");
                                sb.AppendLine("        }");
                                sb.AppendLine("");
                                sb.AppendLine("        table {");
                                sb.AppendLine("            border-collapse: collapse;");
                                sb.AppendLine("            width: 100%;");
                                sb.AppendLine("        }");
                                sb.AppendLine("");
                                sb.AppendLine("            table td {");
                                sb.AppendLine("                border-collapse: collapse;");
                                //sb.AppendLine("                padding: 10px;");
                                sb.AppendLine("            }");
                                sb.AppendLine("");
                                sb.AppendLine("        .header {");
                                //sb.AppendLine("            background-color: #ffc145;");
                                sb.AppendLine("            color: #000;");
                                //sb.AppendLine("            font-weight: bold;");
                                sb.AppendLine("            font-size: 30px;");
                                sb.AppendLine("            padding: 5px 10px;");
                                sb.AppendLine("            margin: 5px 0;");
                                sb.AppendLine("            text-align: center;");
                                //sb.AppendLine("            border-radius: 4px;");
                                sb.AppendLine("        }");
                                sb.AppendLine("");
                                sb.AppendLine("        .content {");
                                sb.AppendLine("            background-color: #fff;");
                                sb.AppendLine("            padding: 10px 10px;");
                                sb.AppendLine("            margin: 5px 0;");
                                sb.AppendLine("            border-radius: 4px;");
                                sb.AppendLine("        }");
                                sb.AppendLine("");
                                sb.AppendLine("        .footer {");
                                sb.AppendLine("            background-color: #ebebeb;");
                                sb.AppendLine("            padding: 5px 10px;");
                                sb.AppendLine("            margin: 5px 0;");
                                //sb.AppendLine("            border-radius: 4px;");
                                sb.AppendLine("        }");
                                sb.AppendLine("");
                                sb.AppendLine("        .message {");
                                sb.AppendLine("            padding: 15px;");
                                sb.AppendLine("            border-radius: 5px;");
                                sb.AppendLine("            text-align: justify;");
                                sb.AppendLine("        }");
                                sb.AppendLine("");
                                sb.AppendLine("        .download-button {");
                                sb.AppendLine("            background-color: #3498db;");
                                sb.AppendLine("            color: #fff;");
                                sb.AppendLine("            text-decoration: none;");
                                sb.AppendLine("            padding: 10px 20px;");
                                sb.AppendLine("            border-radius: 5px;");
                                sb.AppendLine("        }");
                                sb.AppendLine("");
                                sb.AppendLine("            .download-button:hover {");
                                sb.AppendLine("                background-color: #1e6bb8;");
                                sb.AppendLine("            }");
                                sb.AppendLine("");
                                sb.AppendLine("        .actions {");
                                sb.AppendLine("            padding: 15px;");
                                sb.AppendLine("            border-radius: 5px;");
                                sb.AppendLine("            text-align: center");
                                sb.AppendLine("        }");
                                sb.AppendLine("");
                                sb.AppendLine("        .signature {");
                                sb.AppendLine("            text-align: center;");
                                sb.AppendLine("            margin-top: 15px;");
                                sb.AppendLine("            font-size: 11px;");
                                //sb.AppendLine("            color: #003558;");
                                sb.AppendLine("        }");
                                sb.AppendLine("    </style>");
                                sb.AppendLine("</head>");

                                //BODY
                                sb.AppendLine("<body>");
                                sb.AppendLine("    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"margin:5px 0;\">");
                                sb.AppendLine("        <tr>");
                                sb.AppendLine("            <td class=\"header\">");
                                sb.AppendLine(_emailHeading);
                                sb.AppendLine("            </td>");
                                sb.AppendLine("        </tr>");
                                sb.AppendLine("    </table>");

                               
                                sb.AppendLine("        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width: 100%; border-collapse: collapse\">");
                                sb.AppendLine("            <tr>");
                                sb.AppendLine("                <td valign=\"top\" width=\"120\" style=\"font-weight:bold;padding-bottom:5px;\">");
                                sb.AppendLine("                    FollowUp Date:");
                                sb.AppendLine("                </td>");
                                sb.AppendLine("                <td valign=\"top\" style=\"padding-bottom: 5px\">");
                                sb.AppendLine(ClockTools.GetISTNow().ToString("dd MMM yyyy"));
                                sb.AppendLine("                </td>");
                                sb.AppendLine("            </tr>");
                                sb.AppendLine("            <tr>");
                                sb.AppendLine("                <td valign=\"top\" width=\"120\" style=\"font-weight:bold;padding-bottom:5px;\">");
                                sb.AppendLine("                    Project/Subject:");
                                sb.AppendLine("                </td>");
                                sb.AppendLine("                <td valign=\"top\" style=\"padding-bottom: 5px\">");
                                sb.AppendLine(group.MeetingTitle);
                                sb.AppendLine("                </td>");
                                sb.AppendLine("            </tr>");
                                sb.AppendLine("            <tr>");
                                sb.AppendLine("                <td valign=\"top\" width=\"120\" style=\"font-weight:bold;padding-bottom:5px;\">");
                                sb.AppendLine("                    Action By:");
                                sb.AppendLine("                </td>");
                                sb.AppendLine("                <td valign=\"top\" style=\"padding-bottom: 5px\">");
                                sb.AppendLine(_contact.FullName);
                                sb.AppendLine("                </td>");
                                sb.AppendLine("            </tr>");
                                sb.AppendLine("            <tr>");
                                sb.AppendLine("                <td valign=\"top\" width=\"120\" style=\"font-weight:bold;padding-bottom:5px;\">");
                                sb.AppendLine("                    Recorded By:");
                                sb.AppendLine("                </td>");
                                sb.AppendLine("                <td valign=\"top\" style=\"padding-bottom: 5px\">");
                                sb.AppendLine(_creator.Name);
                                sb.AppendLine("                </td>");
                                sb.AppendLine("            </tr>");
                                sb.AppendLine("            <tr>");
                                sb.AppendLine("                <td valign=\"top\" width=\"120\" style=\"font-weight:bold;padding-bottom:5px;\">");
                                sb.AppendLine("                    Meeting Date:");
                                sb.AppendLine("                </td>");
                                sb.AppendLine("                <td valign=\"top\" style=\"padding-bottom: 5px\">");
                                sb.AppendLine(ClockTools.GetIST(_meeting.StartDate).ToString("dd MMM yyyy HH:mm"));
                                sb.AppendLine("                </td>");
                                sb.AppendLine("            </tr>");

                                sb.AppendLine("        </table>");
                                sb.AppendLine("");
                                sb.AppendLine("        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width: 100%; border-collapse: collapse\">");
                                sb.AppendLine("            <tr>");
                                sb.AppendLine("                <td valign=\"top\"  style=\"font-weight:bold;\">");
                                sb.AppendLine("                    To:");
                                sb.AppendLine("                </td>");
                                sb.AppendLine("            </tr>");
                                sb.AppendLine("            <tr>");
                                sb.AppendLine("                <td valign=\"top\" style=\"padding-bottom: 5px;\">");
                                sb.AppendLine("                    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width: 100%; border-collapse: collapse\">");
                                foreach (var obj in toList)
                                {
                                    sb.AppendLine("                        <tr>");
                                    sb.AppendLine("                            <td>");
                                    sb.AppendLine(obj.Name + " <i> (" + obj.Email + ")</i>");
                                    sb.AppendLine("                            </td>");
                                    sb.AppendLine("                        </tr>");
                                }
                                sb.AppendLine("                    </table>");
                                sb.AppendLine("                </td>");
                                sb.AppendLine("            </tr>");
                                sb.AppendLine("            <tr>");
                                sb.AppendLine("                <td valign=\"top\"  style=\"font-weight:bold;\">");
                                sb.AppendLine("                    CC:");
                                sb.AppendLine("                </td>");
                                sb.AppendLine("            </tr>");
                                sb.AppendLine("            <tr>");
                                sb.AppendLine("                <td valign=\"top\" style=\"padding-bottom: 5px;\">");
                                sb.AppendLine("                    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width: 100%; border-collapse: collapse\">");
                                foreach (var obj in ccList)
                                {
                                    sb.AppendLine("                        <tr>");
                                    sb.AppendLine("                            <td>");
                                    sb.AppendLine(obj.Name + " <i> (" + obj.Email + ")</i>");
                                    sb.AppendLine("                            </td>");
                                    sb.AppendLine("                        </tr>");
                                }
                                sb.AppendLine("                    </table>");
                                sb.AppendLine("                </td>");
                                sb.AppendLine("            </tr>");

                                sb.AppendLine("        </table>");
                                sb.AppendLine("<div style=\"border-bottom: 1px solid #cccccc; margin-top: 15px; margin-bottom: 15px; \"></div>");

                                sb.AppendLine("        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width: 100%; border-collapse: collapse\">");
                                sb.AppendLine("            <tr>");
                                sb.AppendLine("                <td valign=\"top\" style=\"padding-top: 5px; padding-bottom: 5px;\">");
                                sb.AppendLine("                    <pre style=\"font-family: Calibri;font-size: 14px;margin-top: 0;margin-bottom: 0;white-space: pre-wrap;white-space: -moz-pre-wrap;white-space: -pre-wrap;white-space: -o-pre-wrap;word-wrap: break-word;\">");
                                sb.AppendLine($"Dear Sir/Madam,");
                                sb.AppendLine($"    Please review the agenda below and provide the requested details or action at your earliest convenience. If you have any questions or require clarification on any of the agenda items, feel free to reach out to {_creator.Name} at {_creator.Email}.");


                                sb.AppendLine("</pre>");
                                sb.AppendLine("                </td>");
                                sb.AppendLine("            </tr>");
                                sb.AppendLine("        </table>");

                                sb.AppendLine("<div style=\"border-bottom: 1px solid #cccccc; margin-top: 15px; margin-bottom: 15px; \"></div>");
 

                                var _index = 1;
                                foreach (var obj in _groupAgendas)
                                {
                                    sb.AppendLine("        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width: 100%; border-collapse: collapse;\">");

                                    sb.AppendLine("                        <tr>");

                                    sb.AppendLine("                            <td colspan=\"2\" valign=\"top\" style=\"padding-bottom:5px; \">");
                                    sb.AppendLine($"<small>Agenda: </small><strong>{obj.Title + " " + obj.Subtitle}</strong>");
                                    sb.AppendLine("                            </td>");

                                    sb.AppendLine("                        </tr>");

                                    sb.AppendLine("                        <tr>");
                                    sb.AppendLine("                            <td valign=\"top\" style=\"padding-bottom:5px; \">");
                                    sb.AppendLine($"<small>Due: </small><strong>{ClockTools.GetIST(obj.DueDate.Value).ToString("dd MMM yyyy")}</strong>");
                                    sb.AppendLine("                            </td>");
                                    if ((obj.ReminderCount + 1) > 5)
                                    {
                                        sb.AppendLine("                       <td valign=\"top\" style=\"padding-bottom:5px;text-align:right;font-weight:bold;color:red; \">");
                                    }
                                    else
                                    {
                                        sb.AppendLine("                            <td valign=\"top\" style=\"padding-bottom:5px;text-align:right;\">");
                                    }
                                    sb.AppendLine($"<small>Reminder: </small><strong>{(obj.ReminderCount + 1).ToString("00")}</strong>");
                                    sb.AppendLine("                            </td>");
                           
                                    sb.AppendLine("                        </tr>");

                                    sb.AppendLine("                        <tr>");
                                    sb.AppendLine("                            <td colspan=\"2\" valign=\"top\" style=\"padding-bottom:5px; font-weight: bold;font-size: 14px; \">");
                                    sb.AppendLine("                    <pre style=\"font-family: Calibri;font-size: 14px;margin-top: 0;margin-bottom: 0;white-space: pre-wrap;white-space: -moz-pre-wrap;white-space: -pre-wrap;white-space: -o-pre-wrap;word-wrap: break-word;\">");
                                    sb.AppendLine(obj.Comment);
                                    sb.AppendLine("</pre>");
                                    sb.AppendLine("                            </td>");
                                    sb.AppendLine("                        </tr>");


                                    if (obj.NotDiscussed)
                                    {
                                        sb.AppendLine("                        <tr>");
                                        sb.AppendLine("                            <td colspan=\"2\" valign=\"top\" style=\"padding-bottom:5px; \">");
                                        sb.AppendLine($"<small>Previous Comment:</small>");
                                        sb.AppendLine("                    <pre style=\"font-family: Calibri;font-size: 12px;margin-top: 0;margin-bottom: 0;white-space: pre-wrap;white-space: -moz-pre-wrap;white-space: -pre-wrap;white-space: -o-pre-wrap;word-wrap: break-word;font-style: italic;\">");
                                        sb.AppendLine(obj.PreviousComment);
                                        sb.AppendLine("</pre>");
                                        sb.AppendLine("                            </td>");
                                        sb.AppendLine("                        </tr>");
                                    }


                                    sb.AppendLine("        </table>");
                                    _index++;

                                    if (_index <= _groupAgendas.Count)
                                    {
                                        sb.AppendLine("<div style=\"border-bottom: 1px solid #cccccc; margin-bottom: 10px; \"></div>");
                                    }
                                }


                                //FOOTER
                                sb.AppendLine("<div style=\"border-bottom: 1px solid #cccccc; margin-top: 15px; margin-bottom: 15px; \"></div>");

                                sb.AppendLine("");
                                sb.AppendLine("        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%; border-collapse: collapse;\">");
                                sb.AppendLine("            <tr>");
                                sb.AppendLine("                <td valign=\"top\" style=\"padding-top:5px;padding-bottom:5px;\">");
                                sb.AppendLine("                    <pre style=\"font-family:Calibri;line-height:1.5; font-size: 14px;margin-top:0;margin-bottom:0; white-space: pre-wrap; white-space: -moz-pre-wrap;");
                                sb.AppendLine("                                white-space: -pre-wrap; white-space: -o-pre-wrap; word-wrap: break-word;\">");
                                sb.AppendLine("Thanking You,\r\n");

                                sb.AppendLine("Lighting Creatively");
                                sb.AppendLine($"{senderSignatureName}");
                                sb.AppendLine($"{senderSignatureDesignation},\r\n");

                                sb.AppendLine("Company\r\n8 Midas Touch,\r\n94 Lullanagar,\r\nPune - 411040. \r\nMaharashtra INDIA. \r\n+91 88888 42741 / 43\r\n");

                                sb.AppendLine("</pre>");
                                sb.AppendLine("                </td>");
                                sb.AppendLine("            </tr>");

                                sb.AppendLine("            <tr>");
                                sb.AppendLine("                <td valign=\"top\" style=\"padding-top:5px;padding-bottom:5px;\">");
                                sb.AppendLine("                <span style=\"font-size:10px;\">DISCLAIMER:  This e-mail message and any files attached with it contain confidential, proprietary or legally privileged information. It should not be used by anyone who is not the original intended recipient. If you have erroneously received this message, please delete it immediately and notify the sender. The recipient acknowledges that “Company”  is unable to exercise control or ensure or guarantee the integrity of/over the contents of the information contained in e-mail transmissions and further acknowledges that any views expressed in this message are those of the individual sender and no binding nature of the message shall be implied or assumed unless the sender does so expressly with due authority of “Company”. Before opening any attachments please check them for viruses and defects.</span>");
                                sb.AppendLine("                </td>");
                                sb.AppendLine("            </tr>");
                                sb.AppendLine("            <tr>");
                                sb.AppendLine("                <td valign=\"top\" style=\"padding-top:5px;padding-bottom:5px;\">");
                                sb.AppendLine("                <span >Please print this email if absolutely necessary, lets save paper.</span>");
                                sb.AppendLine("                </td>");
                                sb.AppendLine("            </tr>");
                                sb.AppendLine("        </table>");
                                sb.AppendLine("");



                                sb.AppendLine("    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"margin:5px 0;\">");
                                sb.AppendLine("        <tr>");
                                sb.AppendLine("            <td class=\"footer\">");
                                sb.AppendLine("    <table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\">");
                                sb.AppendLine("        <tr>");
                                sb.AppendLine("            <td style=\"text-align:left; font-size:11px;\">");
                                sb.AppendLine(" This is a auto generated email. Please do not reply here.");
                                sb.AppendLine("            </td>");
                                sb.AppendLine("            <td style=\"text-align:right; font-size:11px;\">");
                                sb.AppendLine("               <div>MyCocpitView&copy;</div>");
                                sb.AppendLine("               <small> Powered by Newarch&reg; Infotech LLP </small>");
                                sb.AppendLine("            </td>");
                                sb.AppendLine("        </tr>");
                                sb.AppendLine("    </table>");


                                sb.AppendLine("            </td>");
                                sb.AppendLine("        </tr>");
                                sb.AppendLine("    </table>");


                                sb.AppendLine("</body>");
                                sb.AppendLine("");
                                sb.AppendLine("</html>");
                                //end


                                var _emailBody = sb.ToString();

                                var emailTo = new List<(string name, string email)>
                                {
                                    ( _receiver.Name, _receiver.Email )
                                };

                                var emailCC = new List<(string name, string email)>
                                {
                                    ( _creator.Name, _creator.Email )
                                };
                    
                                //default CC
                                if (_defaultCCList != null)
                                {
                                    Regex myRegex = new Regex(McvConstant.EMAIL_REGEX, RegexOptions.None);
                                    foreach (Match myMatch in myRegex.Matches(_defaultCCList))
                                    {
                                        if (!emailTo.Any(a => a.email.Equals(myMatch.Value.Trim())) && !emailCC.Any(a => a.email.Equals(myMatch.Value.Trim())))
                                            emailCC.Add(("Company", myMatch.Value.Trim()));

                                    }
                                }


                                await sharedService.SendMail(_emailSubject.ToUpper().Trim(),
                                _senderName,
                                  _senderEmail,
                                  _emailBody, emailTo, emailCC, replyAddress: _creator.Email, replyName: _creator.Name);


                                foreach (var item in _groupAgendas)
                                {
                                   
                                    try
                                    {
                                        item.ReminderCount++;
                                        db.Entry(item).State = EntityState.Modified;
                                        await db.SaveChangesAsync();
                                    }
                                    catch (Exception)
                                    {

                                    }
                                }

                            }
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine(ex.Message);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

    }

}