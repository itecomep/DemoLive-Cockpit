

using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.Utility.Common;
using MyCockpitView.Utility.RDLCClient;
using MyCockpitView.WebApi.ContactModule.Services;
using MyCockpitView.WebApi.Entities;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.WebApi.Models;
using MyCockpitView.WebApi.ProjectModule.Services;
using MyCockpitView.WebApi.Services;
using MyCockpitView.WebApi.SiteVisitModule.Entities;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace MyCockpitView.WebApi.SiteVisitModule.Services;

public interface ISiteVisitService : IBaseEntityService<SiteVisit>
{
    Task ScaffoldPendingAttendees(int SiteVisitID);
    Task ScaffoldPendingAgenda(int SiteVisitID, string Subject, int? ProjectID = null, int? typeFlag = null);
    Task<bool> IsDelayed(int ID);
    Task<bool> IsSiteVisitEditable(int ID, int ContactID);
    Task SendMinutes(int ID);
    Task<ReportDefinition> GetMinutesReport(string reportSize, Guid uid, string sort = null);
}

public class SiteVisitService : BaseEntityService<SiteVisit>, ISiteVisitService
{

    public SiteVisitService(EntitiesContext db) : base(db)
    {
    }


    public IQueryable<SiteVisit> Get(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null)
    {

        IQueryable<SiteVisit> _query = base.Get(Filters);

        //Apply filters
        if (Filters != null)
        {


            if (Filters.Where(x => x.Key.Equals("ProjectID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<SiteVisit>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("ProjectID", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(x => x.ProjectID != null && x.ProjectID == isNumeric);
                }
                _query = _query.Where(predicate);
            }

            if (Filters.Where(x => x.Key.Equals("contactID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<SiteVisit>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("contactID", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(x => x.ContactID == isNumeric);
                }
                _query = _query.Where(predicate);
            }

            if (Filters.Where(x => x.Key.Equals("attendeeContactID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<SiteVisit>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("attendeeContactID", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(x => x.Attendees.Any(c => c.ContactID == isNumeric));
                }
                _query = _query.Include(x => x.Attendees).Where(predicate);
            }

            if (Filters.Where(x => x.Key.Equals("startDate", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _item = Filters.First(x => x.Key.Equals("startDate", StringComparison.OrdinalIgnoreCase));
                DateTime result = Convert.ToDateTime(_item.Value);
                _query = _query.Where(x => x.StartDate.Date == result.Date);
            }

            if (Filters.Where(x => x.Key.Equals("endDate", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _item = Filters.First(x => x.Key.Equals("endDate", StringComparison.OrdinalIgnoreCase));

                DateTime result = Convert.ToDateTime(_item.Value);
                _query = _query.Where(x => x.EndDate.Date == result.Date);
            }

            if (Filters.Where(x => x.Key.Equals("sentDate", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _item = Filters.First(x => x.Key.Equals("sentDate", StringComparison.OrdinalIgnoreCase));

                DateTime result = Convert.ToDateTime(_item.Value);
                _query = _query.Where(x => x.FinalizedOn != null && x.FinalizedOn.Value.Date == result.Date);
            }

            if (Filters.Where(x => x.Key.Equals("rangestart", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _item = Filters.First(x => x.Key.Equals("rangestart", StringComparison.OrdinalIgnoreCase));

                DateTime result = Convert.ToDateTime(_item.Value);
                _query = _query.Where(x => x.StartDate >= result || x.EndDate >= result);
            }

            if (Filters.Where(x => x.Key.Equals("rangeend", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _item = Filters.First(x => x.Key.Equals("rangeend", StringComparison.OrdinalIgnoreCase));

                DateTime result = Convert.ToDateTime(_item.Value);
                var end = result.AddDays(1);
                _query = _query.Where(x => x.StartDate < end || x.EndDate < end);

            }

            if (Filters.Where(x => x.Key.Equals("isReadOnly", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<SiteVisit>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("isReadOnly", StringComparison.OrdinalIgnoreCase)))
                {
                    var isReadOnly = Convert.ToBoolean(_item.Value);

                    predicate = predicate.Or(x => x.IsReadOnly == isReadOnly);
                }
                _query = _query.Where(predicate);
            }

            if (Filters.Where(x => x.Key.Equals("parentID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<SiteVisit>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("parentID", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(x => x.ParentID != null && x.ParentID == isNumeric);
                }
                _query = _query.Where(predicate);
            }

            if (Filters.Where(x => x.Key.Equals("TeamID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<SiteVisit>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("TeamID", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(x =>
                    x.Contact.TeamMemberships.Any(t => t.ContactTeamID == isNumeric));
                    //||
                    //(x.AssignerContactID != null && x.Assigner.TeamMemberships.Any(t => t.ContactTeamID == isNumeric)));
                }
                _query = _query.Include(x => x.Contact).ThenInclude(x => x.TeamMemberships)
                    .Include(x => x.Contact).ThenInclude(x => x.TeamMemberships).Where(predicate);
            }

        }


        if (Search != null && Search != string.Empty)
        {
            var _keywords = Search.Split(' ');

            foreach (var _key in _keywords)
            {
                _query = _query.Include(x => x.Contact)
                     .Where(x => x.Title.ToLower().Contains(_key.ToLower())
                                   || x.Contact.FullName.ToLower().Contains(_key.ToLower())
                                        );
            }
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

                else if (key.Trim().Equals("StartDate", StringComparison.OrdinalIgnoreCase))
                    _orderedQuery = _orderedQuery
                            .ThenBy(x => x.StartDate);

                else if (key.Trim().Equals("StartDate desc", StringComparison.OrdinalIgnoreCase))
                    _orderedQuery = _orderedQuery
                            .ThenByDescending(x => x.StartDate);

                else if (key.Trim().Equals("sentdate", StringComparison.OrdinalIgnoreCase))
                    _orderedQuery = _orderedQuery
                            .ThenBy(x => x.FinalizedOn);

                else if (key.Trim().Equals("sentdate desc", StringComparison.OrdinalIgnoreCase))
                    _orderedQuery = _orderedQuery
                            .ThenByDescending(x => x.FinalizedOn);

            }

            return _orderedQuery.OrderByDescending(x => x.StartDate);
        }

        return _query
                      .OrderByDescending(x => x.StartDate);


    }

    public async Task<SiteVisit> GetById(int Id)
    {
        var query = await Get()
          .Include(x => x.Contact)
                    .Include(x => x.Attendees)
                    .Include(x => x.Agendas).ThenInclude(x => x.Attachments)
             .SingleOrDefaultAsync(i => i.ID == Id);

        return query;

    }

    public async Task<SiteVisit> GetById(Guid Id)
    {
        var query = await Get()
          .Include(x => x.Contact)
                    .Include(x => x.Attendees)
                    .Include(x => x.Agendas).ThenInclude(x => x.Attachments)
             .SingleOrDefaultAsync(i => i.UID == Id);

        return query;

    }

    public async Task<int> Create(SiteVisit Entity)
    {

//ECOMEP need multiple meetings to be created simultaneously
        // var _lastSiteVisit = await GetLastPending(Entity);
        // if (_lastSiteVisit != null)
        // {
        //     var _typeFlagMasters = await db.TypeMasters.AsNoTracking().FirstOrDefaultAsync(x => x.Entity == nameof(SiteVisit) && x.Value == _lastSiteVisit.TypeFlag);

        //     throw new EntityServiceException($"Last {(_typeFlagMasters != null ? _typeFlagMasters.Title : nameof(SiteVisit))} for this subject {_lastSiteVisit.Code} is pending. Please close & send it before creating new!");

        // }

        Project _project = null;
        if (Entity.ProjectID != null)
        {
            _project = await db.Projects.AsNoTracking().SingleOrDefaultAsync(x => x.ID == Entity.ProjectID);
            if (_project != null)
            {
                Entity.Title = _project.Code + "-" + _project.Title;
                //Entity.CompanyID = _project.CompanyID;
            }
        }

        if (Entity.Title == null || Entity.Title == String.Empty)
            throw new EntityServiceException("Title is required. Please enter proper title and try again!");

        Entity.Code = $"{(_project != null ? _project.Code : Entity.Title.Replace(" | ", "-"))}-MOM-{ClockTools.GetIST(Entity.StartDate).ToString("yyMMddHHmmss")}{(Entity.Version > 0 ? "-R" + Entity.Version.ToString() : "")}".ToUpper().Trim();

        if (Entity.TypeFlag == McvConstant.SITE_VISIT_TYPEFLAG_SITE_VISIT)
        {
            var _lastorder = 0;
            var _annexure = 0;
            var _query = db.SiteVisits.AsNoTracking()
                .Where(x => !x.IsDeleted)
                .Where(x => !x.IsReadOnly)
                .Where(x => x.TypeFlag == Entity.TypeFlag);
            if (Entity.ProjectID != null)
            {
                _query = _query.Where(x => x.ProjectID == Entity.ProjectID);
            }
            else
            {
                _query = _query.Where(x => x.Title == Entity.Title);
            }

            if (await _query.AnyAsync())
            {
                _lastorder = await _query
                   .MaxAsync(x => x.OrderFlag);
                //_annexure = await _query
                //    .Where(x=>x.OrderFlag==_lastorder)
                //   .MaxAsync(x => x.Annexure);
            }

            _lastorder++;

            Entity.OrderFlag = _lastorder;
            Entity.Annexure = _annexure;
            Entity.Code = $"{(_project != null ? _project.Code : Entity.Title.Replace(" | ", "-"))}-SITE-VISIT-{Entity.OrderFlag}.{Entity.Annexure}".ToUpper().Trim();
        }
       
        Entity.ID = await base.Create(Entity);
        await AddAttendee(Entity.ID, Entity.ContactID, McvConstant.SITE_VISIT_ATTENDEE_TYPEFLAG_TO);


        // ECOMEP DONT NEED AGENDA FOLLOWUP
        // if (Entity.TypeFlag == McvConstant.SITE_VISIT_TYPEFLAG_SITE_VISIT || Entity.TypeFlag == McvConstant.SITE_VISIT_TYPEFLAG_INSPECTION)
        // {


        //     // Ensure Entity.Title is not null for ScaffoldPendingAgenda
        //     var subject = Entity.Title ?? string.Empty;
        //     await ScaffoldPendingAgenda(Entity.ID, subject, Entity.ProjectID, Entity.TypeFlag);
        //     await ScaffoldPendingAttendees(Entity.ID);
        // }


        return Entity.ID;

    }

    private async Task AddAttendee(int SiteVisitID, int contactID, int typeFlag, int? companyID = null)
    {

        var contactService = new ContactService(db);
        var contact = await contactService.Get()

                   .Include(x => x.AssociatedCompanies).ThenInclude(x => x.Company)
                   .Include(x => x.Appointments).ThenInclude(x => x.Company)
                   .Where(x => x.ID == contactID)
                   .FirstOrDefaultAsync();

        if (contact == null) return;

        Regex regex = new Regex(McvConstant.EMAIL_REGEX, RegexOptions.None);

        var SiteVisitAttendeeService = new SiteVisitAttendeeService(db);
        if (contact.Appointments.Where(x => x.StatusFlag == McvConstant.APPOINTMENT_STATUSFLAG_APPOINTED).Any()) //Employee
        {
            foreach (var appointment in contact.Appointments.Where(x => x.StatusFlag == McvConstant.APPOINTMENT_STATUSFLAG_APPOINTED))
            {
                if (contact.Emails != null && regex.IsMatch(contact.Emails.FirstOrDefault(x => x.IsPrimary).Email))
                {
                    var _newAttendee = new SiteVisitAttendee
                    {
                        SiteVisitID = SiteVisitID,
                        Name = contact.FullName.Trim(),
                        Email = contact.Emails.FirstOrDefault(x => x.IsPrimary).Email,
                        Company = appointment.Company.Title,
                        TypeFlag = typeFlag,
                        ContactID = contactID
                    };
                    await SiteVisitAttendeeService.Create(_newAttendee);
                }
                else if (contact.Emails != null && regex.IsMatch(contact.Emails.FirstOrDefault(x => x.IsPrimary).Email))
                {
                    var _newAttendee = new SiteVisitAttendee
                    {
                        SiteVisitID = SiteVisitID,
                        Name = contact.FullName.Trim(),
                        Email = contact.Emails.FirstOrDefault(x => x.IsPrimary).Email,
                        Company = appointment.Company.Title,
                        TypeFlag = typeFlag,
                        ContactID = contactID
                    };
                    await SiteVisitAttendeeService.Create(_newAttendee);
                }

            }
        }
        else if (contact.AssociatedCompanies.Any())
        {
            foreach (var company in contact.AssociatedCompanies)
            {
                if (contact.Emails != null && regex.IsMatch(contact.Emails.FirstOrDefault(x => x.IsPrimary).Email))
                {
                    var _newAttendee = new SiteVisitAttendee
                    {
                        SiteVisitID = SiteVisitID,
                        Name = contact.FullName.Trim(),
                        Email = contact.Emails.FirstOrDefault(x => x.IsPrimary).Email,
                        Company = company.Company.FullName,
                        TypeFlag = typeFlag,
                        ContactID = contactID
                    };
                    await SiteVisitAttendeeService.Create(_newAttendee);
                }
                else if (contact.Emails != null && regex.IsMatch(contact.Emails.FirstOrDefault(x => x.IsPrimary).Email))
                {
                    var _newAttendee = new SiteVisitAttendee
                    {
                        SiteVisitID = SiteVisitID,
                        Name = contact.FullName.Trim(),
                        Email = contact.Emails.FirstOrDefault(x => x.IsPrimary).Email,
                        Company = company.Company.FullName,
                        TypeFlag = typeFlag,
                        ContactID = contactID
                    };
                    await SiteVisitAttendeeService.Create(_newAttendee);
                }

            }
        }
        else
        {

            if (contact.Emails != null && contact.Emails.Any())
            {
                string attendeeEmail = null;
                var primaryEmail = contact.Emails.FirstOrDefault(x => x.IsPrimary)?.Email;
                if (!string.IsNullOrWhiteSpace(primaryEmail) && regex.IsMatch(primaryEmail))
                {
                    attendeeEmail = primaryEmail;
                }
                else
                {
                    // fallback to first valid email
                    attendeeEmail = contact.Emails.Select(e => e.Email).FirstOrDefault(email => !string.IsNullOrWhiteSpace(email) && regex.IsMatch(email));
                    if (attendeeEmail == null)
                    {
                        attendeeEmail = contact.Emails.FirstOrDefault()?.Email;
                    }
                }

                var _newAttendee = new SiteVisitAttendee
                {
                    SiteVisitID = SiteVisitID,
                    Name = contact.FullName?.Trim() ?? string.Empty,
                    Email = attendeeEmail ?? string.Empty,
                    Company = "",
                    TypeFlag = typeFlag,
                    ContactID = contactID
                };
                await SiteVisitAttendeeService.Create(_newAttendee);
            }
        }

    }

    public async Task Update(SiteVisit Entity)
    {
        var SiteVisit = await db.SiteVisits.AsNoTracking()
        .Include(x => x.Attendees)
        .Include(x => x.Contact)
           .SingleOrDefaultAsync(x => x.ID == Entity.ID);

        if (SiteVisit == null) throw new EntityServiceException($"{nameof(SiteVisit)} not found!");

        //var _oldStatus = _entity.StatusFlag;
        var _oldStart = SiteVisit.StartDate;
        var _oldEnd = SiteVisit.EndDate;

        if (Entity.StatusFlag >= McvConstant.SITE_VISIT_STATUSFLAG_SENT)
        {
            Entity.Version++;
        }


// ECOMEP DONT NEED AGENDA FOLLOWUP

        // if (Entity.TypeFlag == McvConstant.SITE_VISIT_TYPEFLAG_SITE_VISIT || Entity.TypeFlag == McvConstant.SITE_VISIT_TYPEFLAG_INSPECTION)
        // {

        //     await ScaffoldPendingAgenda(Entity.ID, Entity.Title, Entity.ProjectID, Entity.TypeFlag);
        //     await ScaffoldPendingAttendees(Entity.ID);
        // }

        await base.Update(Entity);


    }

    public async Task Delete(int Id)
    {
        var entity = await GetById(Id);

        var SiteVisitAttendeeService = new SiteVisitAttendeeService(db);
        foreach (var x in entity.Attendees)
        {
            await SiteVisitAttendeeService.Delete(x.ID);
        }

        var SiteVisitAgendaService = new SiteVisitAgendaService(db);
        foreach (var x in entity.Agendas)
        {
            await SiteVisitAgendaService.Delete(x.ID);
        }


        await base.Delete(Id);
    }

    private async Task<SiteVisit> GetLastPending(SiteVisit Entity)
    {
        //pending SiteVisits or C-note
        var _query = Get()
            .Where(x => x.ParentID == null)
                          .Where(x => x.Title == Entity.Title
                                   && x.StatusFlag != McvConstant.SITE_VISIT_STATUSFLAG_SENT)
                                .Where(x => x.StartDate <= Entity.StartDate)
                          .OrderByDescending(x => x.StartDate);

        // var _lastNote = await _query
        //        .Where(x => x.TypeFlag == McvConstant.SITE_VISIT_TYPEFLAG_CNOTE)
        //        .FirstOrDefaultAsync();

        var _lastMeet = await _query
             .Where(x => x.TypeFlag == McvConstant.SITE_VISIT_TYPEFLAG_SITE_VISIT)
                .FirstOrDefaultAsync();


        // if (Entity.TypeFlag == McvConstant.SITE_VISIT_TYPEFLAG_CNOTE) //C-note
        // {
        //     return _lastNote;
        // }
        // else if (Entity.TypeFlag == McvConstant.SITE_VISIT_TYPEFLAG_INSPECTION) //Inspection
        // {
        //     return await _query
        //        .Where(x => x.TypeFlag == McvConstant.SITE_VISIT_TYPEFLAG_INSPECTION)
        //        .FirstOrDefaultAsync();
        // }
        // else
        {
            // if (_lastNote != null) return _lastNote;

            return _lastMeet;
        }

    }

    public async Task<Guid> RecordReadonly(int ID)
    { //RECORD ENTITY HISTORY
        var SiteVisit = await Get()
            .Where(x => !x.IsReadOnly)
            .Where(x => !x.IsDeleted)
                    .Include(x => x.Contact)
                    .Include(x => x.Attendees)
                     .Include(x => x.Agendas)
                     .ThenInclude(a => a.Attachments)
                    .SingleOrDefaultAsync(x => x.ID == ID);

        if (SiteVisit == null) throw new EntityServiceException("SiteVisit not found!");

        var newEntity = new SiteVisit();
        // Set values from the original entity to the new entity
        db.Entry(newEntity).CurrentValues.SetValues(SiteVisit);
        // Detach the newAttendee if it's already being tracked
        if (db.Entry(newEntity).State != EntityState.Detached)
        {
            db.Entry(newEntity).State = EntityState.Detached;
        }
        newEntity.ID = default(int);
        newEntity.UID = default(Guid);
        // Create a new entity with a deep copy of the original entity's properties

        db.Entry(newEntity).State = EntityState.Added;

        // Add the new entity to the context
        db.SiteVisits.Add(newEntity);


        // Reset the ID property
        newEntity.ID = 0;
        newEntity.ParentID = SiteVisit.ID;
        newEntity.IsReadOnly = true;


        foreach (var item in SiteVisit.Attendees)
        {
            // Create a new instance and copy the values
            var newAttendee = new SiteVisitAttendee();
            db.Entry(newAttendee).CurrentValues.SetValues(item);

            // Detach the newAttendee if it's already being tracked
            if (db.Entry(newAttendee).State != EntityState.Detached)
            {
                db.Entry(newAttendee).State = EntityState.Detached;
            }

            // Set ID to default (assuming ID is an int)
            newAttendee.ID = default(int);
            newAttendee.UID = default(Guid);
            // Attach the new entity to the context
            db.Entry(newAttendee).State = EntityState.Added;

            // Add the new entity to the context
            db.SiteVisitAttendees.Add(newAttendee);

            // Add the new entity to the collection
            newEntity.Attendees.Add(newAttendee);

        }

        foreach (var item in SiteVisit.Agendas)
        {
            // Create a new instance and copy the values
            var newAgenda = new SiteVisitAgenda();
            db.Entry(newAgenda).CurrentValues.SetValues(item);

            // Detach the newAgenda if it's already being tracked
            if (db.Entry(newAgenda).State != EntityState.Detached)
            {
                db.Entry(newAgenda).State = EntityState.Detached;
            }

            // Set ID to default (assuming ID is an int)
            newAgenda.ID = default(int);
            newAgenda.UID = default(Guid);
            newAgenda.IsReadOnly = true;
            // Attach the new entity to the context
            db.Entry(newAgenda).State = EntityState.Added;


            foreach (var attachment in item.Attachments)
            {

                // Create a new instance and copy the values
                var newAttachment = new SiteVisitAgendaAttachment();
                db.Entry(newAttachment).CurrentValues.SetValues(attachment);

                // Detach the newAttachment if it's already being tracked
                if (db.Entry(newAttachment).State != EntityState.Detached)
                {
                    db.Entry(newAttachment).State = EntityState.Detached;
                }

                // Set ID to default (assuming ID is an int)
                newAttachment.ID = default(int);
                newAttachment.UID = default(Guid);
                // Attach the new entity to the context
                db.Entry(newAttachment).State = EntityState.Added;
                // Add the new entity to the context
                db.SiteVisitAgendaAttachments.Add(newAttachment);

                newAgenda.Attachments.Add(newAttachment);
            }
            // Add the new entity to the context
            db.SiteVisitAgendas.Add(newAgenda);

            // Add the new entity to the collection
            newEntity.Agendas.Add(newAgenda);
        }

        await db.SaveChangesAsync();

        return newEntity.UID;

    }

    public async Task ScaffoldPendingAgenda(int SiteVisitID, string Subject, int? ProjectID = null, int? typeFlag = null)
    {

        var _currentAgendas = await db.SiteVisitAgendas.Where(x => !x.IsDeleted)
            .Where(x => x.SiteVisitID == SiteVisitID)
            .ToListAsync();

        var _query = db.SiteVisitAgendas
            .Where(x => !x.IsDeleted)
            .Where(x => x.SiteVisitID != SiteVisitID) //not from same SiteVisit
             .Include(x => x.SiteVisit)
             .Where(x => !x.SiteVisit.IsReadOnly)
                        .Where(x => x.SiteVisit.StatusFlag == McvConstant.SITE_VISIT_STATUSFLAG_ATTENDED || x.SiteVisit.StatusFlag == McvConstant.SITE_VISIT_STATUSFLAG_SENT)
                      .Where(x => !x.IsForwarded)
                      .Where(x => !x.IsReadOnly)
                      .Where(x => x.StatusFlag == McvConstant.SITE_VISIT_AGENDA_STATUSFLAG_PENDING);


        if (typeFlag != null)
        {
            _query = _query.Where(x => x.TypeFlag == typeFlag);
        }
        // else
        // {
        //     _query = _query.Where(x => x.TypeFlag != McvConstant.SITE_VISIT_TYPEFLAG_INSPECTION);
        // }


        if (ProjectID != null)
            _query = _query
                .Where(x => x.SiteVisit.ProjectID != null && x.SiteVisit.ProjectID == ProjectID);
        else
            _query = _query.Where(x => x.SiteVisit.Title == Subject);

        var _pendingList = await _query
                      .ToListAsync();

        if (!_pendingList.Any()) return;
        var SiteVisitAgendaService = new SiteVisitAgendaService(db);
        foreach (var previousPending in _pendingList)
        {

            //check if current SiteVisit includes agenda with same Title & Subtitle

            var _currentAgenda = _currentAgendas.Where(x => x.Title == previousPending.Title && x.Subtitle == previousPending.Subtitle).FirstOrDefault();

            var _previousAgendaHistory = await SiteVisitAgendaService.GetSiteVisitAgendaHistoryString(previousPending.ID);

            if (_currentAgenda == null)
            {
                _currentAgenda = new SiteVisitAgenda
                {
                    Title = previousPending.Title,
                    Subtitle = previousPending.Subtitle,
                    SiteVisitID = SiteVisitID,
                    PreviousComment = previousPending.Comment,
                    PreviousHistory = _previousAgendaHistory,
                    PreviousDueDate = previousPending.DueDate != null ? previousPending.DueDate : previousPending.PreviousDueDate,
                    PreviousActionBy = previousPending.ActionBy != null ? previousPending.ActionBy : previousPending.PreviousActionBy,
                    PreviousProgress = previousPending.Progress,
                    PreviousAgendaID = previousPending.ID,
                    Progress = previousPending.Progress,
                    //DesignScriptEntityID = previousPending.DesignScriptEntityID,
                    ActionBy = previousPending.ActionBy,
                    DueDate = previousPending.DueDate,
                    ActionByContactID = previousPending.ActionByContactID,
                    ReminderCount = previousPending.ReminderCount,
                    TypeFlag = previousPending.TypeFlag,
                };

                await SiteVisitAgendaService.Create(_currentAgenda);
            }
            else
            {

                _currentAgenda.PreviousActionBy = previousPending.ActionBy != null ? previousPending.ActionBy : previousPending.PreviousActionBy;

                _currentAgenda.PreviousDueDate = previousPending.DueDate != null ? previousPending.DueDate : previousPending.PreviousDueDate;

                _currentAgenda.PreviousComment = previousPending.Comment;

                _currentAgenda.PreviousHistory = _previousAgendaHistory;

                _currentAgenda.PreviousAgendaID = _currentAgenda.ID != previousPending.ID ? previousPending.ID : (int?)null;
                _currentAgenda.PreviousProgress = previousPending.Progress;

                if (_currentAgenda.DueDate == null)
                    _currentAgenda.DueDate = previousPending.DueDate;

                if (_currentAgenda.ActionByContactID == null || _currentAgenda.ActionBy == null)
                {
                    _currentAgenda.ActionByContactID = previousPending.ActionByContactID;
                    _currentAgenda.ActionBy = previousPending.ActionBy;
                    _currentAgenda.ReminderCount = previousPending.ReminderCount;
                }
                _currentAgenda.TypeFlag = previousPending.TypeFlag;
                _currentAgenda.NotDiscussed = false;
                if ((_currentAgenda.Comment == null || _currentAgenda.Comment.Trim() == String.Empty))
                {
                    _currentAgenda.Comment = "Not Discussed";
                    _currentAgenda.NotDiscussed = true;
                }
            }

            //Set as Forwarded
            previousPending.IsForwarded = true;

            if (previousPending.TodoID != null)
            {

                var _todo = await db.Todos.AsNoTracking()
                    .SingleOrDefaultAsync(x => x.ID == previousPending.TodoID);

                if (_todo != null && _todo.StatusFlag == McvConstant.TODO_STATUSFLAG_PENDING)
                {


                    _currentAgenda.TodoID = previousPending.TodoID;
                    previousPending.TodoID = null;

                }

            }
            //if (previousPending.PackageID != null)
            //{

            //    var _package = await db.Packages.AsNoTracking()
            //        .SingleOrDefaultAsync(x => x.ID == previousPending.PackageID);

            //    if (_package != null && _package.StatusFlag == 0)
            //    {


            //        //_currentAgenda.IsPackageRequired = true;
            //        _currentAgenda.PackageID = previousPending.PackageID;

            //        //previousPending.IsPackageRequired = false;
            //        previousPending.PackageID = null;

            //    }

            //}

            //Check if agenda task is pending
            var _currentAgendaTasks = await db.WFTasks.Where(x => x.Entity == nameof(SiteVisitAgenda)
     && x.EntityID == previousPending.ID
     && x.StatusFlag != 1).ToListAsync();

            if (_currentAgendaTasks.Any())
            {
                foreach (var task in _currentAgendaTasks)
                {
                    task.StatusFlag = McvConstant.WFTASK_STATUSFLAG_COMPLETED;
                    task.Comment = $"SiteVisit created | {Subject}";
                    task.CompletedDate = DateTime.UtcNow;
                }
            }
        }

        await db.SaveChangesAsync();
    }

    public async Task ScaffoldPendingAttendees(int SiteVisitID)
    {

        var _SiteVisitAgendas = await db.SiteVisitAgendas.AsNoTracking()
            .Where(x => x.SiteVisitID == SiteVisitID)
            .Where(x => x.ActionByContactID != null)
            //.Where(x => x.PreviousAgendaID != null)
            .ToListAsync();

        var _attendees = await db.SiteVisitAttendees.AsNoTracking()
                        .Where(x => !x.IsDeleted)
                        .Where(x => x.SiteVisitID == SiteVisitID
                        && x.ContactID != null).ToListAsync();



        Regex regex = new Regex(McvConstant.EMAIL_REGEX, RegexOptions.None);
        var SiteVisitAttendeeService = new SiteVisitAttendeeService(db);
        foreach (var item in _SiteVisitAgendas)
        {
            if (!_attendees
                .Where(x => x.ContactID == item.ActionByContactID)
                .Any())
            {
                if (item.PreviousAgendaID != null)
                {
                    var _previousAgenda = await db.SiteVisitAgendas.AsNoTracking()
                 .Where(x => x.ID == item.PreviousAgendaID)
                 .FirstOrDefaultAsync();

                    if (_previousAgenda != null)
                    {
                        var _attendee = await db.SiteVisitAttendees.AsNoTracking()
                           .Where(x => !x.IsDeleted)
                           .Where(x => x.SiteVisitID == _previousAgenda.SiteVisitID
                           && x.ContactID != null
                           && x.ContactID == _previousAgenda.ActionByContactID)
                           .FirstOrDefaultAsync();
                        if (_attendee != null)
                        {
                            if (_attendee.Email != null && regex.IsMatch(_attendee.Email))
                            {

                                var _newAttendee = new SiteVisitAttendee
                                {
                                    SiteVisitID = SiteVisitID,
                                    Name = _attendee.Name,
                                    Company = _attendee.Company,
                                    Email = _attendee.Email,
                                    ContactID = _attendee.ContactID,
                                    TypeFlag = 1,
                                };
                                await SiteVisitAttendeeService.Create(_newAttendee);
                                _attendees.Add(_newAttendee);
                            }
                        }
                    }
                }
                else
                {
                    var _contact = await db.Contacts.AsNoTracking()

                    .Include(x => x.AssociatedContacts)
                    .Include(x => x.AssociatedCompanies)
                    .Where(x => x.ID == item.ActionByContactID)
                    .FirstOrDefaultAsync();
                    if (_contact.Emails != null && regex.IsMatch(_contact.Emails.FirstOrDefault(x => x.IsPrimary).Email))
                    {
                        var _newAttendee = new SiteVisitAttendee
                        {
                            SiteVisitID = SiteVisitID,
                            Name = _contact.FullName,
                            Company = _contact.AssociatedCompanies.Any() ? _contact.AssociatedCompanies.FirstOrDefault().Company.FullName : "",
                            Email = _contact.Emails.FirstOrDefault(x => x.IsPrimary).Email,
                            ContactID = _contact.ID,
                            TypeFlag = 1,
                        };
                        await SiteVisitAttendeeService.Create(_newAttendee);
                        _attendees.Add(_newAttendee);
                    }
                }


            }
        }


    }

    public async Task SendMinutes(int ID)
    {

        var _SiteVisit = await db.SiteVisits.AsNoTracking()
            .Include(x => x.Contact)
            .Include(x => x.Attendees)
            .Include(x => x.Agendas)
            .SingleOrDefaultAsync(x => x.ID == ID);

        if (_SiteVisit == null) throw new EntityServiceException("SiteVisit not found!");

        var _creator = _SiteVisit.Attendees.FirstOrDefault(x => x.ContactID == _SiteVisit.ContactID);
        if (_creator == null)
        {
            _creator = new SiteVisitAttendee { Name = _SiteVisit.Contact.FullName, Email = _SiteVisit.Contact.Emails.FirstOrDefault(c => c.IsPrimary).Email };
        }

        var _tos = _SiteVisit.Attendees
            .Where(x => x.TypeFlag == 0)
            .Where(x => x.Email != null)
            .Select(x => new SiteVisitEmailContact { Name = x.Name, Email = x.Email, Company = x.Company, ID = x.ContactID.Value })
            .ToList();
        var _ccs = _SiteVisit.Attendees
            .Where(x => x.TypeFlag == 1)
            .Where(x => x.Email != null)
            .Select(x => new SiteVisitEmailContact { Name = x.Name, Email = x.Email, Company = x.Company, ID = x.ContactID.Value })
            .Where(x => !_tos.Any(c => c.Email == x.Email))
            .ToList();

        var SiteVisitTitle = _SiteVisit.Title;
        if (_SiteVisit.ProjectID != null)
        {
            var projectService = new ProjectService(db);
            var project = await projectService.Get().SingleOrDefaultAsync(x => x.ID == _SiteVisit.ProjectID);
            if (project != null)
                SiteVisitTitle = project.Title;

        }

        var sharedService = new SharedService(db);


        foreach (var item in _tos)
        {
            item.PendingAgendaCount = _SiteVisit.Agendas.Where(x => x.StatusFlag == 0)
                .Where(x => x.ActionByContactID != null && x.ActionByContactID == item.ID).Count();
        }

        foreach (var item in _ccs)
        {
            item.PendingAgendaCount = _SiteVisit.Agendas.Where(x => x.StatusFlag == 0)
                .Where(x => x.ActionByContactID != null && x.ActionByContactID == item.ID).Count();
        }

        var senderSignatureName = _SiteVisit.Contact.FullName;
        var senderSignatureDesignation = "";
        var email = "";
        var mobile = "";
        var senderSignatureEmail = "";
        var senderSignatureMobile = "";
        email = _SiteVisit.Contact.Emails.Where(x => x.IsPrimary).Select(y => y.Email).FirstOrDefault();
        if (email != null)
        {
            senderSignatureEmail = email;
        }

        mobile = _SiteVisit.Contact.Phones.Where(x => x.IsPrimary).Select(y => y.Phone).FirstOrDefault();
        if (mobile != null)
        {
            senderSignatureMobile = mobile;
        }
        var appointmentService = new ContactAppointmentService(db);
        var appointments = await appointmentService.Get().Where(x => x.StatusFlag == McvConstant.APPOINTMENT_STATUSFLAG_APPOINTED)
            .Where(x => x.ContactID == _SiteVisit.ContactID)
            //.Include(x=>x.Company)
            .Select(x => x.Designation).Distinct()
            .ToListAsync();
        if (appointments.Any())
        {
            senderSignatureDesignation = string.Join(",", appointments);
        }

        var _emailHeading = "Site Visit Report";

        var _emailSubject = $"{SiteVisitTitle} | {_emailHeading} | {ClockTools.GetIST(_SiteVisit.StartDate).ToString("dd MMM yyyy HH:mm")} | #{_SiteVisit.OrderFlag.ToString("000")}" + (_SiteVisit.Version > 0 ? " | R" + _SiteVisit.Version.ToString() : "");

        // if (_SiteVisit.TypeFlag == McvConstant.SITE_VISIT_TYPEFLAG_CNOTE)
        // {
        //     _emailHeading = "COMMUNICATION NOTE";
        //     _emailSubject = $"{SiteVisitTitle} | {_emailHeading} | {ClockTools.GetIST(_SiteVisit.StartDate).ToString("dd MMM yyyy HH:mm")} | #{_SiteVisit.OrderFlag.ToString("000.0")}" + (_SiteVisit.Version > 0 ? " | R" + _SiteVisit.Version.ToString() : "");
        // }
        // else if (_SiteVisit.TypeFlag == McvConstant.SITE_VISIT_TYPEFLAG_INSPECTION)
        // {
        //     _emailHeading = "INSPECTION REPORT";
        //     _emailSubject = $"{SiteVisitTitle} | {_emailHeading} | {ClockTools.GetIST(_SiteVisit.StartDate).ToString("dd MMM yyyy HH:mm")} | #{_SiteVisit.OrderFlag.ToString("000")}" + (_SiteVisit.Version > 0 ? " | R" + _SiteVisit.Version.ToString() : "");
        // }

        var _version = $"#{_SiteVisit.OrderFlag.ToString("000")}";

        // if (_SiteVisit.TypeFlag == McvConstant.SITE_VISIT_TYPEFLAG_CNOTE)
        //     _version = $"#{_SiteVisit.OrderFlag.ToString("000")}.{_SiteVisit.Annexure.ToString()}";
        // else if (_SiteVisit.TypeFlag == McvConstant.SITE_VISIT_TYPEFLAG_INSPECTION)
        //     _version = $"#{_SiteVisit.OrderFlag.ToString("000")}";


        //var _replyParameter = $"mailto:{_SiteVisit.Contact.Email1}?cc={_defaultCCList}&subject=RE:{_emailSubject.ToUpper()}";

        var redirectUrl = await sharedService.GetPresetValue(McvConstant.SITE_VISIT_MINUTES_URL_ROOT);
        var versionUID = await RecordReadonly(ID);
        var downloadUrl = redirectUrl + versionUID.ToString();

        //Create a new StringBuilder object
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


        sb.AppendLine("        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%; border-collapse: collapse;\">");
        sb.AppendLine("            <tr>");
        sb.AppendLine("                <td valign=\"top\" width=\"80\" style=\"font-weight:bold;\">");
        sb.AppendLine("                    Date:");
        sb.AppendLine("                </td>");
        sb.AppendLine("                <td valign=\"top\" style=\"padding: 2px;\">");
        sb.Append(ClockTools.GetIST(_SiteVisit.StartDate).ToString("dd MMM yyyy HH:mm"));
        sb.AppendLine("                </td>");
        sb.AppendLine("            </tr>");
        sb.AppendLine("            <tr>");
        sb.AppendLine("                <td valign=\"top\" width=\"80\" style=\"font-weight:bold;\">");
        sb.AppendLine("                    No.");
        sb.AppendLine("                </td>");
        sb.AppendLine("                <td valign=\"top\" style=\"padding: 2px;\">");
        sb.Append(_version);
        sb.AppendLine("                </td>");
        sb.AppendLine("            </tr>");
        sb.AppendLine("            <tr>");
        sb.AppendLine("                <td valign=\"top\" width=\"80\" style=\"font-weight:bold;\">");
        sb.AppendLine("                    Title:");
        sb.AppendLine("                </td>");
        sb.AppendLine("                <td valign=\"top\" style=\"padding: 2px;\">");
        sb.Append(_SiteVisit.Title);
        sb.AppendLine("                </td>");
        sb.AppendLine("            </tr>");
        sb.AppendLine("            <tr>");
        sb.AppendLine("                <td valign=\"top\" width=\"80\" style=\"font-weight:bold;\">");
        sb.AppendLine("                    From:");
        sb.AppendLine("                </td>");
        sb.AppendLine("                <td valign=\"top\" style=\"padding: 2px;\">");
        sb.Append("<div  style=\"line-height: 1;\">" + _creator.Name + " (" + _creator.Email + ")</div>");
        sb.AppendLine("                </td>");
        sb.AppendLine("            </tr>");

        sb.AppendLine("        </table>");

        sb.AppendLine("        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%; border-collapse: collapse;\">");


        sb.AppendLine("            <tr>");
        sb.AppendLine("                <td valign=\"top\"  style=\"font-weight:bold;\">");
        sb.AppendLine(" To:");
        sb.AppendLine("                </td>");
        sb.AppendLine("            </tr>");

        sb.AppendLine("            <tr>");
        sb.AppendLine("                <td valign=\"top\" style=\"padding: 2px;\">");
        sb.AppendLine("        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%; border-collapse: collapse;\">");
        foreach (var item in _tos)
        {
            sb.AppendLine("            <tr>");
            sb.AppendLine("                <td >");
            sb.Append(item.Name + "<i> (" + item.Email + ")</i>");
            sb.AppendLine("                </td>");
            sb.AppendLine("                <td valign=\"top\" width=\"70px\">");
            sb.Append(item.PendingAgendaCount > 0 ? "Pending " + item.PendingAgendaCount.ToString("00") : "");
            sb.AppendLine("                </td>");
            sb.AppendLine("            </tr>");

        }
        sb.AppendLine("        </table>");
        sb.AppendLine("                </td>");
        sb.AppendLine("            </tr>");

        sb.AppendLine("            <tr>");
        sb.AppendLine("                <td valign=\"top\"  style=\"font-weight:bold;\">");
        sb.AppendLine("                    CC:");
        sb.AppendLine("                </td>");
        sb.AppendLine("            </tr>");

        sb.AppendLine("            <tr>");
        sb.AppendLine("                <td valign=\"top\" style=\"padding: 2px;\">");
        sb.AppendLine("        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%; border-collapse: collapse;\">");
        foreach (var item in _ccs)
        {
            sb.AppendLine("            <tr>");
            sb.AppendLine("                <td >");
            sb.Append(item.Name + "<i> (" + item.Email + ")</i>");
            sb.AppendLine("                </td>");
            sb.AppendLine("                <td valign=\"top\" width=\"70px\">");
            sb.Append(item.PendingAgendaCount > 0 ? "Pending " + item.PendingAgendaCount.ToString("00") : "");
            sb.AppendLine("                </td>");
            sb.AppendLine("            </tr>");

        }
        sb.AppendLine("        </table>");

        sb.AppendLine("                </td>");
        sb.AppendLine("            </tr>");

        sb.AppendLine("        </table>");



        sb.AppendLine("    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">");
        sb.AppendLine("        <tr>");
        sb.AppendLine("            <td class=\"actions\">");
        sb.AppendLine("                <a style=\"text-decoration: none;\" class=\"download-button\" href=\"" + downloadUrl + "\">View on MyCockpitView&copy; > </a>");
        sb.AppendLine("            </td>");
        sb.AppendLine("        </tr>");
        sb.AppendLine("            <tr>");
        sb.AppendLine("                <td style=\"color:#808080;text-align: center;\">");
        sb.AppendLine(" To view report, kindly click the above link. ");
        sb.AppendLine("                </td>");
        sb.AppendLine("            </tr>");
        sb.AppendLine("    </table>");


        //FOOTER
        sb.AppendLine("<div style=\"border-bottom: 1px solid #cccccc; margin-top: 15px; margin-bottom: 15px; \"></div>");

        sb.AppendLine("");
        sb.AppendLine("        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%; border-collapse: collapse;\">");
        sb.AppendLine("            <tr>");
        sb.AppendLine("                <td valign=\"top\" style=\"padding-top:5px;padding-bottom:5px;\">");
        sb.AppendLine("                    <pre style=\"font-family:Calibri;line-height:1.5; font-size: 14px;margin-top:0;margin-bottom:0; white-space: pre-wrap; white-space: -moz-pre-wrap;");
        sb.AppendLine("                                white-space: -pre-wrap; white-space: -o-pre-wrap; word-wrap: break-word;\">");

        sb.AppendLine("Thanks & Regards,");
        sb.AppendLine($"{senderSignatureName}");
        sb.AppendLine($"{senderSignatureDesignation}");

        if (!string.IsNullOrWhiteSpace(senderSignatureEmail))
        {
            sb.AppendLine($"{senderSignatureEmail}");
        }
        else
        {
            sb.AppendLine($"\r\n");
        }


        if (!string.IsNullOrWhiteSpace(senderSignatureMobile))
        {
            sb.AppendLine($"+91 {senderSignatureMobile} \r\n");
        }
        else
        {
            sb.AppendLine($"\r\n");
        }

        sb.AppendLine("<span style=\"font-weight:bold;font-size: 1.2rem; color: #373e68; \" ><span style=\" color: lime;\">ECO</span> MEP CONSULTANTS PVT. LTD.</span>");
        sb.AppendLine("<span style=\"font-weight:bold;font-size: 1.2rem; color: #373e68; \" ><span style=\" color: #69abff;\">POINT</span> CLOUD ENGINEERING LLP.</span> \r\n");

        sb.AppendLine("1204, DLH Park,\r\nOpp. Goregaon MTNL, SV Road,\r\nGoregaon (W), Mumbai-400062,\r\nLandline: 022-48263430,");
        sb.AppendLine("Website: <a href=\"https://www.pointcloudengg.com\" target=\"_blank\">www.pointcloudengg.com</a>,  <a href=\"https://www.ecomep.in\" target=\"_blank\"> www.ecomep.in</a> \r\n");

        sb.AppendLine("<p style=\"font-size:12pt;font-family:Times New Roman,serif;margin:0 0 12pt 0;\">");
        sb.AppendLine("<i><span style=\"color: rgb(90, 190, 71) !important; font-size: 24pt; font-family: Webdings;\" lang=\"en-US\" data-ogsc=\"green\">P</span></i><i><span style=\"color: rgb(90, 190, 71) !important; font-size: 10pt; font-weight: bold;font-family: Helvetica, sans-serif;\" lang=\"en-US\" data-ogsc=\"green\">Before printing, think about your responsibility and commitment with the Environment</span></i>");
        sb.AppendLine("</p>");

        sb.AppendLine("</pre>");
        sb.AppendLine("                </td>");
        sb.AppendLine("            </tr>");
        sb.AppendLine("            <tr>");
        sb.AppendLine("                <td valign=\"top\" style=\"padding-top:5px;padding-bottom:5px;\">");
        sb.AppendLine("                <span style=\"font-size:14px;\"><i style=\"font-weight:bold;\">DISCLAIMER:</i> </span><br>");
        sb.AppendLine("                <span style=\"font-size:14px;\">This e-mail message may contain confidential, proprietary or legally privileged information. It should not be used by anyone who is not the original intended recipient. If you have erroneously received this message, please delete it immediately and notify the sender. The recipient acknowledges that <span style=\"font-weight: 800;font-size: 15px; \"><span style=\" color: lime;\">ECO</span> MEP CONSULTANTS PVT.LTD. AND <span style=\" color: #69abff;\">POINT</span> CLOUD ENGINEERING LLP</span> or its subsidiaries and associated companies, are unable to exercise control or ensure or guarantee the integrity of/over the contents of the information contained in e-mail transmissions and further acknowledges that any views expressed in this message are those of the individual sender and no binding nature of the message shall be implied or assumed unless the sender does so expressly with due authority of ECO MEP CONSULTANTS PVT.LTD. AND POINT CLOUD ENGINEERING LLP. Before opening any attachments please check them for viruses and defects.</span>");
        sb.AppendLine("                </td>");
        sb.AppendLine("            </tr>");
        //sb.AppendLine("            <tr>");
        //sb.AppendLine("                <td valign=\"top\" style=\"padding-top:5px;padding-bottom:5px;\">");
        //sb.AppendLine("                <span >Please print this email if absolutely necessary, lets save paper.</span>");
        //sb.AppendLine("                </td>");
        //sb.AppendLine("            </tr>");
        sb.AppendLine("        </table>");
        sb.AppendLine("");
        sb.AppendLine("    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"margin:5px 0;\">");
        sb.AppendLine("        <tr>");
        sb.AppendLine("            <td class=\"footer\">");
        sb.AppendLine("    <table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\">");
        sb.AppendLine("        <tr>");
        sb.AppendLine("            <td style=\"text-align:left; font-size:11px;\">");
        sb.AppendLine(" <div style=\"font-weight: 800;font-size: 15px; \">EMCPL | PCELLP </span>");
        sb.AppendLine(" <div style=\"font-weight: 800;font-size: 15px; \">Pilot View </span>");
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

        var _senderName = await sharedService.GetPresetValue(McvConstant.SITE_VISIT_EMAIL_SENDER_NAME);
        var _senderEmail = await sharedService.GetPresetValue(McvConstant.SITE_VISIT_EMAIL_SENDER_ID);

        var emailTo = new List<(string name, string email)>();
        foreach (var obj in _tos)
            emailTo.Add((obj.Name, obj.Email));

        var emailCC = new List<(string name, string email)>();
        foreach (var obj in _ccs)
            emailCC.Add((obj.Name, obj.Email));

        //default CC
        var _defaultCCList = await sharedService.GetPresetValue(McvConstant.SITE_VISIT_EMAIL_CC);

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

        _SiteVisit.FinalizedOn = DateTime.UtcNow;
        _SiteVisit.StatusFlag = McvConstant.SITE_VISIT_STATUSFLAG_SENT;

        await base.Update(_SiteVisit);


    }

    public async Task<bool> IsSiteVisitEditable(int ID, int ContactID)
    {

        var _SiteVisit = await db.SiteVisits.AsNoTracking().Where(x => !x.IsDeleted)
            .Where(x => x.ID == ID)
            .SingleOrDefaultAsync();

        if (_SiteVisit == null) throw new EntityServiceException("SiteVisit not found!");

        if (_SiteVisit.IsReadOnly) return false;

        if (_SiteVisit.ContactID != ContactID) return false;

        if (_SiteVisit.StatusFlag != McvConstant.SITE_VISIT_STATUSFLAG_SENT) return true;


        if (_SiteVisit.StatusFlag == McvConstant.SITE_VISIT_STATUSFLAG_SENT)
        {
            if (_SiteVisit.TypeFlag == McvConstant.SITE_VISIT_TYPEFLAG_SITE_VISIT
                // || _SiteVisit.TypeFlag == McvConstant.SITE_VISIT_TYPEFLAG_CNOTE
                )
            {
                var _nextSiteVisit = await Get()
                    .Where(x => x.ID != _SiteVisit.ID)
                    .Where(x => !x.IsReadOnly)
                    .Where(x => x.Title == _SiteVisit.Title)
                    .Where(x => x.StartDate > _SiteVisit.StartDate)
                    .Where(x => x.TypeFlag == McvConstant.SITE_VISIT_TYPEFLAG_SITE_VISIT
                    // || x.TypeFlag == McvConstant.SITE_VISIT_TYPEFLAG_CNOTE
                    )
                    .OrderByDescending(x => x.StartDate)
                    .FirstOrDefaultAsync();

                if (_nextSiteVisit == null)
                {
                    var sharedService = new SharedService(db);
                    var SiteVisit_UPDATE_LIMIT = Convert.ToInt32((await sharedService.GetPresetValue(McvConstant.SITE_VISIT_UPDATE_ALLOW_DURATION)));

                    return ClockTools.GetDaysDifference(_SiteVisit.FinalizedOn != null ? _SiteVisit.FinalizedOn.Value : _SiteVisit.Modified, DateTime.UtcNow) < SiteVisit_UPDATE_LIMIT;
                }
            }
            else
            {
                var _nextSiteVisit = await db.SiteVisits.AsNoTracking().Where(x => !x.IsDeleted)
                      .Where(x => x.ID != _SiteVisit.ID)
                      .Where(x => !x.IsReadOnly)
                       .Where(x => x.Title == _SiteVisit.Title)
                    .Where(x => x.StartDate > _SiteVisit.StartDate)
                   .OrderByDescending(x => x.StartDate).FirstOrDefaultAsync();

                if (_nextSiteVisit == null)
                {
                    var sharedService = new SharedService(db); ;
                    var SiteVisit_UPDATE_LIMIT = Convert.ToInt32((await sharedService.GetPresetValue(McvConstant.SITE_VISIT_UPDATE_ALLOW_DURATION)));

                    return ClockTools.GetDaysDifference(_SiteVisit.FinalizedOn != null ? _SiteVisit.FinalizedOn.Value : _SiteVisit.Modified, DateTime.UtcNow) <= SiteVisit_UPDATE_LIMIT;
                }
            }
        }

        return false;

    }

    public async Task<bool> IsDelayed(int ID)
    {

        var _SiteVisit = await Get()
            .Where(x => x.ParentID == null)
            .Where(x => x.ID == ID)
            .SingleOrDefaultAsync();

        if (_SiteVisit == null) return false;

        var _task = await db.WFTasks.AsNoTracking()
            .Where(x => x.Entity != null && x.Entity == nameof(SiteVisit)
            && x.EntityID == _SiteVisit.ID && x.StatusFlag == McvConstant.WFTASK_STATUSFLAG_PENDING)
            .OrderBy(x => x.DueDate)
            .FirstOrDefaultAsync();

        if (_task != null)
        {
            return (_task.DueDate < DateTime.UtcNow);
        }

        return false;

    }

    public async Task<ReportDefinition> GetMinutesReport(string reportSize, Guid uid, string sort = null)
    {

        var _SiteVisit = await Get()
                    .Include(x => x.Contact)
                    .Include(x => x.Attendees)
                     .Include(x => x.Agendas).ThenInclude(a => a.Attachments)
                     .Where(x => x.UID == uid)
                     .SingleOrDefaultAsync();

        if (_SiteVisit == null) throw new EntityServiceException("SiteVisit not Found!");

        //var _dsEntities = new List<DesignScriptEntity>();

        //if (_SiteVisit.ProjectID != null)
        //{
        //    var designScriptEntityService = new DesignScriptEntityService(db, username);

        //    _dsEntities = await designScriptEntityService.Get()
        //                        .Where(x => x.ProjectID == _SiteVisit.ProjectID)
        //                        .ToListAsync();
        //}


        var reportTitle = "Site Visit Report";

        if (!_SiteVisit.IsReadOnly && _SiteVisit.StatusFlag != McvConstant.SITE_VISIT_STATUSFLAG_SENT)
            reportTitle = "Agenda List";


        var _SiteVisitDate = ClockTools.GetIST(_SiteVisit.StartDate).ToString("dd MMM yyyy HH:mm");
        var _reportProperties = new List<ReportProperties>
                {
                    new ReportProperties() { PropertyName = "ReportTitle", PropertyValue = reportTitle.ToString() },
                    new ReportProperties() { PropertyName = "Title", PropertyValue =_SiteVisit.Title.ToString() },
                    new ReportProperties() { PropertyName = "Number", PropertyValue = $"#{_SiteVisit.OrderFlag.ToString("000")}" },
                    new ReportProperties() { PropertyName = "StartDate", PropertyValue = ClockTools.GetIST(_SiteVisit.StartDate).ToString("dd MMM yyyy HH:mm") },
                                        new ReportProperties() { PropertyName = "EndDate", PropertyValue = ClockTools.GetIST(_SiteVisit.EndDate).ToString("HH:mm") },
                                         new ReportProperties() { PropertyName = "Code", PropertyValue = _SiteVisit.Code },
                    new ReportProperties() { PropertyName = "PreparedBy", PropertyValue = _SiteVisit.Contact.FullName.ToString() },
                     new ReportProperties() { PropertyName = "PreparedOn", PropertyValue = ClockTools.GetISTNow().ToString("dd MMM yyyy HH:mm") },
                    new ReportProperties() { PropertyName = "Location", PropertyValue = _SiteVisit.Location },

                };

        var today = DateTime.UtcNow;
        var agendas = _SiteVisit.Agendas.Where(x => !x.IsDeleted);
        if (sort != null)
        {
            if (sort.ToLower() == "duedate")
                agendas = agendas.OrderBy(x => x.DueDate);
            else if (sort.ToLower() == "actionby")
                agendas = agendas.OrderBy(x => x.ActionBy);
            else if (sort.ToLower() == "agenda")
                agendas = agendas.OrderBy(x => x.Title).ThenBy(x => x.Subtitle);
        }
        var _minutesAgendas = agendas.Select(x => new
        {
            x.ID,
            Title = x.Title,
            Subtitle = x.Subtitle,
            Reminder = x.ReminderCount,
            Comment = x.Comment,
            DueDate = x.DueDate != null ? ClockTools.GetIST(x.DueDate.Value).ToString("dd MMM yyyy") : "",
            ActionBy = x.ActionBy,
            History = x.PreviousHistory,
            Status = x.StatusFlag == McvConstant.SITE_VISIT_AGENDA_STATUSFLAG_RESOLVED ? "RESOLVED" : "PENDING",
            Breadcrumb = "", //x.DesignScriptEntityID != null ? getDSBreadcrumb(_dsEntities, x.DesignScriptEntityID.Value) : string.Empty,
            IsDelayed = x.StatusFlag == McvConstant.SITE_VISIT_AGENDA_STATUSFLAG_PENDING && x.DueDate != null && x.DueDate.Value < today
        });

        var attendees = _SiteVisit.Attendees.Select(x => new
        {
            Name = x.Name,
            Email = x.Email,
            Company = x.Company,
            TypeFlag = x.TypeFlag,
            AgendaCount = _SiteVisit.Agendas.Where(m => m.ActionByContactID != null && m.ActionByContactID == x.ContactID).Count(),
        });


        var _images = _SiteVisit.Agendas
            .Where(x => !x.IsDeleted)
            .Where(x => x.Attachments.Where(a => !a.IsDeleted)
                                    .Where(a => a.ThumbUrl != null).Any())
            .SelectMany(join => join.Attachments, (x, y) => new
            {
                Url = y.ThumbUrl,
                ParentID = y.SiteVisitAgendaID
            });


        var sharedService = new SharedService(db);
        var _reportContainerUrl = await sharedService.GetPresetValue(McvConstant.RDLC_REPORT_CONTAINER_URL);
        var reportServiceApi = await sharedService.GetPresetValue(McvConstant.RDLC_PROCESSOR_API);
        var DEVMODE = Convert.ToBoolean((await sharedService.GetPresetValue(McvConstant.DEVMODE)));

        var _reportPath = $"SiteVisitMinutes-{reportSize}.rdlc";

        var _reportDef = new ReportDefinition()
        {
            ReportName = "SiteVisitMinutes",
            ReportPath = DEVMODE ? $"{_reportContainerUrl}DEV/{_reportPath}" : $"{_reportContainerUrl}{_reportPath}",
            ReportDataSet = DataTools.ToDataTable(_minutesAgendas),
            ReportProperties = _reportProperties,
            Filename = $"SiteVisitMinutes-{_SiteVisit.Code}-{ClockTools.GetISTNow().ToString("yyMMddHHmm")}",
            RenderType = "PDF"
        };

        _reportDef.SubReports.Add(new ReportDefinition()
        {
            ReportName = "SiteVisitMinutesAttendee",
            ReportPath = DEVMODE ? $"{_reportContainerUrl}DEV/SiteVisitMinutesAttendee.rdlc" : $"{_reportContainerUrl}SiteVisitMinutesAttendee.rdlc",
            ReportDataSet = DataTools.ToDataTable(attendees),
        });

        _reportDef.SubReports.Add(new ReportDefinition()
        {
            ReportName = "SiteVisitMinutesImages",
            ReportPath = DEVMODE ? $"{_reportContainerUrl}DEV/SiteVisitMinutesImages.rdlc" : $"{_reportContainerUrl}SiteVisitMinutesImages.rdlc",
            ReportDataSet = DataTools.ToDataTable(_images),
        });

        return await ReportClient.GenerateReport(_reportDef, reportServiceApi);

    }
}