using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.ContactModule.Entities;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.ContactModule.Services;
public interface IContactAppointmentService : IBaseEntityService<ContactAppointment>
{
    Task<ContactAppointment> GetLastAppointment(int ContactID, int? CompanyID = null);
}

public class ContactAppointmentService : BaseEntityService<ContactAppointment>, IContactAppointmentService
{

    public ContactAppointmentService(EntitiesContext db) : base(db)
    {
    }

    public IQueryable<ContactAppointment> Get(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null)
    {

        IQueryable<ContactAppointment> _query = base.Get(Filters);

        //Apply filters
        if (Filters != null)
        {

            if (Filters.Where(x => x.Key.Equals("companyAccountID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<ContactAppointment>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("companyAccountID", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(x => x.CompanyID == isNumeric);
                }
                _query = _query.Where(predicate);
            }

            if (Filters.Where(x => x.Key.Equals("contactID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<ContactAppointment>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("contactID", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(x => x.ContactID == isNumeric);
                }
                _query = _query.Where(predicate);
            }
        }

        if (Search != null && Search != string.Empty)
        {
            var _key = Search.Trim();
            _query = _query.Include(x => x.Company).Where(x => x.Code.ToLower().Contains(_key)
                                                    || x.Company.Title.ToLower().Contains(_key)
                                                    || x.Company.Initials.ToLower().Contains(_key));
            
        }


        if (Sort != null && Sort != string.Empty)
        {
            switch (Sort.ToLower())
            {
                case "joiningdate":
                    return _query
                            .OrderByDescending(x => x.JoiningDate);
            }
        }

        return _query.OrderByDescending(x => x.JoiningDate);

    }


    public async Task<ContactAppointment> GetById(int Id)
    {

        var query = await db.ContactAppointments
            .Include(x => x.Company)
            .AsNoTracking()
             .SingleOrDefaultAsync(i => i.ID == Id);
        return query;

    }


    public async Task<int> Create(ContactAppointment Entity)
    {

        var contact = await db.Contacts.AsNoTracking()
            .SingleOrDefaultAsync(i => i.ID == Entity.ContactID);

        if (contact == null) throw new Exception("Employee not found!");

        Entity.OrderFlag = await GetNextOrder(Entity.CompanyID);

        var _type = await db.TypeMasters.AsNoTracking().Where(x => x.Entity == nameof(ContactAppointment)
          && x.Value == Entity.TypeFlag).Select(x => x.Title).SingleOrDefaultAsync();

        var _company = await db.Companies.AsNoTracking().Where(x => x.ID == Entity.CompanyID).SingleOrDefaultAsync();

        Entity.Code = _company.Initials + "-" + _type.Substring(0, 1).ToUpper() + "-" + Entity.OrderFlag.ToString("000");


        //var _vhrRate = Convert.ToInt32((await db.AppSettingMasters.AsNoTracking().SingleOrDefaultAsync(x => x.PresetKey == McvConstant.COMPANY_VHR_COST)).PresetValue);
        //var _expectedMHr = Convert.ToInt32((await db.AppSettingMasters.AsNoTracking().SingleOrDefaultAsync(x => x.PresetKey == McvConstant.TEAM_MONTHLY_EXPECTED_MHR)).PresetValue);

        //Entity.ExpectedVhr = Entity.ManValue * _expectedMHr;
        //Entity.ExpectedRemuneration = Entity.ExpectedVhr * _vhrRate;

        db.ContactAppointments.Add(Entity);


        await db.SaveChangesAsync();



        return Entity.ID;

    }


    public async Task<int> GetNextOrder(int CompanyAccountID)
    {

        if (await db.ContactAppointments.AsNoTracking()
            .Where(x => x.CompanyID == CompanyAccountID).AnyAsync())
        {
            var _last = await db.ContactAppointments.AsNoTracking()
                .Where(x => x.CompanyID == CompanyAccountID)
                .Select(x => x.OrderFlag)
                .MaxAsync();

            return _last + 1;
        }

        return 1;

    }

    public async Task Update(ContactAppointment Entity)
    {

        var contact = await db.Contacts.AsNoTracking()
                          .SingleOrDefaultAsync(i => i.ID == Entity.ContactID);

        if (contact == null) throw new EntityServiceException($"Contact not found!");

        var _company = await db.Companies.AsNoTracking().Where(x => x.ID == Entity.CompanyID).SingleOrDefaultAsync();
        var _type = await db.TypeMasters.AsNoTracking().Where(x => x.Entity == nameof(ContactAppointment)
         && x.Value == Entity.TypeFlag).Select(x => x.Title).SingleOrDefaultAsync();

        //var _vhrRate = Convert.ToInt32((await db.AppSettingMasters.AsNoTracking().SingleOrDefaultAsync(x => x.PresetKey == McvConstant.COMPANY_VHR_COST)).PresetValue);
        //var _expectedMHr = Convert.ToInt32((await db.AppSettingMasters.AsNoTracking().SingleOrDefaultAsync(x => x.PresetKey == McvConstant.TEAM_MONTHLY_EXPECTED_MHR)).PresetValue);

        Entity.Code = _company.Initials + "-" + _type.Substring(0, 1).ToUpper() + "-" + Entity.OrderFlag.ToString("000");

        //Entity.ExpectedVhr = Entity.ManValue * _expectedMHr;
        //Entity.ExpectedRemuneration = Entity.ExpectedVhr * _vhrRate;

        //if (Entity.StatusFlag == 1 )
        //{
        //    if (!await db.Appointments.AnyAsync(x => x.ContactID == contact.ID
        //    && x.ID != Entity.ID
        //    && x.StatusFlag != 1))
        //    {
        //        db.Entry(contact.User).State = EntityState.Deleted;
        //    }
        //}

        db.Entry(Entity).State = EntityState.Modified;

        await db.SaveChangesAsync();


    }

    public async Task<ContactAppointment> GetLastAppointment(int ContactID, int? CompanyID = null)
    {
        var _contact = await db.Contacts.AsNoTracking()
           .Include(x => x.Appointments)
           .ThenInclude(c => c.Company)

           .Where(x => x.ID == ContactID)
           .SingleOrDefaultAsync();

        if (_contact != null && _contact.Appointments.Where(x => x.StatusFlag == 0).Any())
        {
            if (CompanyID != null)
            {
                return _contact.Appointments
                    .Where(x => x.CompanyID == CompanyID)
                    .Where(x => x.StatusFlag == 0)
                    .OrderByDescending(x => x.JoiningDate).FirstOrDefault();

            }
            else
            {
                return _contact.Appointments
                        .Where(x => x.StatusFlag == 0)
                        .OrderByDescending(x => x.JoiningDate).FirstOrDefault();
            }


        }

        return null;

    }


}