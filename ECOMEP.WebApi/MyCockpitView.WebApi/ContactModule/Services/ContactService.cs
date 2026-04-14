using System.Data;
using MyCockpitView.Utility.Common;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.ContactModule.Entities;
using MyCockpitView.CoreModule;
using MyCockpitView.Utility.Excel;
using MyCockpitView.WebApi.Models;
using MyCockpitView.WebApi.Services;
using MyCockpitView.WebApi.Exceptions;
using System.Reflection;

namespace MyCockpitView.WebApi.ContactModule.Services;

public interface IContactService : IBaseEntityService<Contact>
{
    Task<IEnumerable<EmailContact>> GetEmailContacts(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null);

    Task<int> MergeContacts(IEnumerable<int> Ids);
    Task<Contact> GetByUsername(string username);
    Task<byte[]> GetExcel(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null);
}

public class ContactService : BaseEntityService<Contact>, IContactService
{

    public ContactService(EntitiesContext db
        ) : base(db)
    {
    }

    public IQueryable<Contact> Get(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null)
    {
       
            IQueryable<Contact> _query = base.Get(Filters);

            //Apply filters
            if (Filters != null)
            {


                if (Filters.Where(x => x.Key.Equals("category", StringComparison.OrdinalIgnoreCase)).Any())
                {
                    var predicate = PredicateBuilder.False<Contact>();
                    foreach (var _item in Filters.Where(x => x.Key.Equals("category", StringComparison.OrdinalIgnoreCase)))
                    {
                        predicate = predicate.Or(x => x._categories.Contains(_item.Value));
                    }
                    _query = _query.Where(predicate);
                }

                if (Filters.Where(x => x.Key.Equals("searchtag", StringComparison.OrdinalIgnoreCase)).Any())
                {
                    var predicate = PredicateBuilder.False<Contact>();
                    foreach (var _item in Filters.Where(x => x.Key.Equals("searchtag", StringComparison.OrdinalIgnoreCase)))
                    {
                        predicate = predicate.Or(x => x._searchTags.Contains(_item.Value));
                    }
                    _query = _query.Where(predicate);
                }

                if (Filters.Where(x => x.Key.Equals("usersOnly", StringComparison.OrdinalIgnoreCase)).Any())
                {
                    _query = _query.Where(x => x.Username != null);
                }
            if (Filters.Where(x => x.Key.Equals("firstname", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<Contact>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("firstname", StringComparison.OrdinalIgnoreCase)))
                {
                    predicate = predicate.Or(x => x.FirstName == _item.Value);
                }
                _query = _query.Where(predicate);
            }
            if (Filters.Where(x => x.Key.Equals("lastname", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<Contact>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("lastname", StringComparison.OrdinalIgnoreCase)))
                {
                    predicate = predicate.Or(x => x.LastName == _item.Value);
                }
                _query = _query.Where(predicate);
            }
            //if (Filters.Where(x => x.Key.Equals("projectPartnersOnly", StringComparison.OrdinalIgnoreCase)).Any())
            //{

            //    var _activeProjectAssociates = db.ProjectAssociations.AsNoTracking()
            //        .Include(x => x.Project)
            //        .Where(x => x.Project.StatusFlag != 4 //completed
            //                 && x.Project.StatusFlag != -1) //discarded
            //        .Where(x => x.TypeFlag == 0)
            //        .Select(x => x.ContactID);

            //    _query = _query.Where(x => _activeProjectAssociates.Where(a => a == x.ID).Any());

            //}

            if (Filters.Where(x => x.Key.Equals("companyOnly", StringComparison.OrdinalIgnoreCase)).Any())
                {

                    _query = _query.Where(x => x.IsCompany);
                }
                if (Filters.Where(x => x.Key.Equals("username", StringComparison.OrdinalIgnoreCase)).Any())
                {
                    var predicate = PredicateBuilder.False<Contact>();
                    foreach (var _item in Filters.Where(x => x.Key.Equals("username", StringComparison.OrdinalIgnoreCase)))
                    {
                        predicate = predicate.Or(x => x.Username==_item.Value);
                    }
                    _query = _query.Where(predicate);
                }
                if (Filters.Where(x => x.Key.Equals("appointmentstatusFlag", StringComparison.OrdinalIgnoreCase)).Any())
                {
                    var predicate = PredicateBuilder.False<Contact>();
                    foreach (var _item in Filters.Where(x => x.Key.Equals("appointmentstatusFlag", StringComparison.OrdinalIgnoreCase)))
                    {
                        var isNumeric = Convert.ToInt32(_item.Value);

                        predicate = predicate.Or(c => c.Appointments.Any(x => x.StatusFlag == isNumeric));
                    }
                    _query = _query.Include(x => x.Appointments).Where(predicate);
                }

            if (Filters.Where(x => x.Key.Equals("teamID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<Contact>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("teamID", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(c => c.TeamMemberships.Any(t=>t.ContactTeamID == isNumeric));
                }
                _query = _query.Include(x => x.TeamMemberships).Where(predicate);
            }
            if (Filters.Where(x => x.Key.Equals("IsCompany", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<Contact>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("IsCompany", StringComparison.OrdinalIgnoreCase)))
                {
                    var _value = Convert.ToBoolean(_item.Value);

                    predicate = predicate.Or(c => c.IsCompany == _value);
                }
                _query = _query.Where(predicate);
            }
        }


        if (Search != null && Search != string.Empty)
        {
            var _key = Search.Trim();
            _query = _query.Where(x => x.FirstName.ToLower().Contains(_key)
                         || x.LastName.ToLower().Contains(_key)
                         || (x.FirstName + " " + x.LastName).ToLower().Contains(_key)
                         || x._searchTags.ToLower().Contains(_key)
                                                  || x.EmailsJson.Contains(Search.ToLower())

                                                || x.PhonesJson.Contains(Search.ToLower())
                                                     || x._categories.ToLower().Contains(_key));
            
           
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

                    case "fullname":
                        return _query
                                .OrderBy(x => x.FirstName).ThenBy(x => x.LastName);
                }
            }

            return _query.OrderBy(x => x.FirstName).ThenBy(x => x.LastName);
       
    }

    public async Task<Contact> GetByUsername(string username)
    {
       
            var query = await Get()
                 .SingleOrDefaultAsync(i => i.Username == username);

            return query;
     
    }

    public async Task<int> Create(Contact Entity)
    {
       
            if (Entity.Birth != null && Entity.Birth.Value.Date == DateTime.UtcNow.Date)
                Entity.Birth = null;

        Entity.FullName = $"{(!string.IsNullOrEmpty(Entity.Title) ? Entity.Title : "")} {Entity.FirstName} {(!string.IsNullOrEmpty(Entity.LastName) ? Entity.LastName : "")}".Trim();

        if (Entity.Phones.Count > 0 && !Entity.Phones.Any(x => x.IsPrimary))
        {
            var phones = Entity.Phones.ToList();
            phones.First().IsPrimary = true;
            Entity.Phones = phones;
        }

        if (Entity.Emails.Count > 0 && !Entity.Emails.Any(x => x.IsPrimary))
        {
            var emails = Entity.Emails.ToList();
            emails.First().IsPrimary = true;
            Entity.Emails = emails;
        }

        if (Entity.Addresses.Count > 0 && !Entity.Addresses.Any(x => x.IsPrimary))
        {
            var addresses = Entity.Addresses.ToList();
            addresses.First().IsPrimary = true;
            Entity.Addresses = addresses;
        }

        db.Contacts.Add(Entity);
            await db.SaveChangesAsync();

          

            return Entity.ID;
       
    }

    public async Task Update(Contact Entity)
    {
       
            Entity.FullName = $"{(!string.IsNullOrEmpty(Entity.Title) ? Entity.Title : "")} {Entity.FirstName} {(!string.IsNullOrEmpty(Entity.LastName) ? Entity.LastName : "")}".Trim();

        if (Entity.Phones.Count > 0 && !Entity.Phones.Any(x => x.IsPrimary))
        {
            var phones = Entity.Phones.ToList();
            phones.First().IsPrimary = true;
            Entity.Phones = phones;
        }

        if (Entity.Emails.Count > 0 && !Entity.Emails.Any(x => x.IsPrimary))
        {
            var emails=Entity.Emails.ToList();
            emails.First().IsPrimary = true;
            Entity.Emails =emails;
        }

        if (Entity.Addresses.Count > 0 && !Entity.Addresses.Any(x => x.IsPrimary))
        {
            var addresses = Entity.Addresses.ToList();
            addresses.First().IsPrimary = true;
            Entity.Addresses = addresses;
        }

        db.Entry(Entity).State = EntityState.Modified;

            await db.SaveChangesAsync();

       
    }
    public async Task Delete(int Id)
    {

        var entity = await Get()
            .Include(x => x.Attachments)
            .Include(x => x.Appointments)
            //.Include(x => x.Notes)
            .Include(x => x.AssociatedCompanies)
            .Include(x => x.AssociatedContacts)
            .SingleOrDefaultAsync(x => x.ID == Id);

        if (entity == null) throw new EntityServiceException($"{nameof(entity)} not found!");

        var attachmentService = new BaseAttachmentService<ContactAttachment>(db);
        foreach(var x in entity.Attachments)
        {
            await attachmentService.Delete(x.ID);
        }
       

        var appointmentService = new ContactAppointmentService(db);
        foreach (var x in entity.Appointments)
        {
            await appointmentService.Delete(x.ID);
        }
      

        var associationService = new ContactAssociationService(db);
        foreach (var x in entity.AssociatedCompanies)
        {
            await associationService.Delete(x.ID);
        }

        foreach (var x in entity.AssociatedContacts)
        {
            await associationService.Delete(x.ID);
        }

        await base.Delete(Id);
    }


    public async Task<IEnumerable<EmailContact>> GetEmailContacts(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null)
    {

        var query =await Get(Filters, Search, Sort)
                     .Include(x => x.AssociatedCompanies).ThenInclude(c => c.Company)
                     .Include(x => x.Appointments).ThenInclude(x => x.Company)
                     
                     .ToListAsync();

        var results1 =  query.Where(x => x.Emails.Any())
            .SelectMany(contact => contact.Appointments
                                    .Where(appointment => appointment.StatusFlag == McvConstant.APPOINTMENT_STATUSFLAG_APPOINTED)
                .SelectMany(appointment =>
                    contact.Emails

                        .Select(email => new
                        {
                            Name = contact.FullName.Trim(),
                            Email = email.Email.Trim(),
                            Company = appointment.Company != null ? appointment.Company.Title : "",
                            ID = contact.ID,
                            UID = contact.UID,
                            TypeFlag = contact.TypeFlag,
                            PhotoUrl = contact.PhotoUrl
                        })
                )
            ).ToList();

        var results2 =  query.Where(x => x.Emails.Any()).SelectMany(contact =>
              contact.AssociatedCompanies
                  .SelectMany(association =>
                      contact.Emails
                          .Select(email => new
                          {
                              Name = contact.FullName.Trim(),
                              Email = email.Email.Trim(),
                              Company = association.Company != null ? association.Company.FullName : "",
                              ID = contact.ID,
                              UID = contact.UID,
                              TypeFlag = contact.TypeFlag,
                              PhotoUrl = contact.PhotoUrl
                          })
                  )
              )
          .ToList();

        var results3 =  query.Where(x => x.Emails.Any()).Where(contact => !contact.Appointments.Any() && !contact.AssociatedCompanies.Any())
                         .SelectMany(contact =>
             contact.Emails
                 .Select(email => new
                 {
                     Name = contact.FullName.Trim(),
                     Email = email.Email.Trim(),
                     Company = "",
                     ID = contact.ID,
                     UID = contact.UID,
                     TypeFlag = contact.TypeFlag,
                     PhotoUrl = contact.PhotoUrl
                 })
             )

         .ToList();

        return results1.Concat(results2).Concat(results3)
                              .Where(x => DataTools.IsEmailValid(x.Email))
                              .Distinct().OrderBy(x => x.Name)
                              .Select(x=> new EmailContact
                              {
                                  Name=x.Name,
                                  Email=x.Email,
                                  Company=x.Company,
                                  ID = x.ID,
                                  UID = x.UID,
                                  TypeFlag = x.TypeFlag,
                                  PhotoUrl = x.PhotoUrl,
                              });


    }

    public async Task<byte[]> GetExcel(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null)
    {
       
            var _dataSet = new DataSet();
            var _data = await Get(Filters, Search, Sort)
                .ToListAsync();

          
            var _result = _data.Select(x => new
            {
               
                Categories = x._categories,
                Tags = x._searchTags,
                x.FullName,
              
                x.Website,
              
                x.Birth,
                x.Anniversary,
                x.PAN,
                x.TAN,
                x.GSTIN,
                //Companies= x.Companies.Any() ? string.Join(",", x.Companies.Select(t => t.Contact.FullName)) : "",
            });

            _dataSet.Tables.Add(DataTools.ToDataTable(_result));

            return ExcelUtility.ExportExcel(_dataSet);
        
    }


    public async Task<int> MergeContacts(IEnumerable<int> Ids)
    {
        var contacts = await Get()
            .Include(x => x.AssociatedCompanies)
            .Include(x => x.AssociatedContacts)
            .Include(x => x.Appointments).ThenInclude(s => s.Attachments)
            .Where(x => Ids.Any(i => i == x.ID))
            .ToListAsync();

        var oldest = contacts.OrderBy(x => x.Created).First();

        var duplicates = contacts.Where(x => x.ID != oldest.ID);

        foreach (var contact in duplicates)
        {
            oldest = CopyNonNullProperties(contact, oldest);

           
            foreach (var item in contact.Appointments)
            {
                if (!oldest.Appointments.Any(x => x.TypeFlag == item.TypeFlag && x.CompanyID == item.CompanyID && x.Designation == item.Designation && x.JoiningDate == item.JoiningDate))
                {
                   
                    // Create a new instance and copy the values
                    var newItem = new ContactAppointment();
                    db.Entry(newItem).CurrentValues.SetValues(item);

                    // Detach the newAttachment if it's already being tracked
                    if (db.Entry(newItem).State != EntityState.Detached)
                    {
                        db.Entry(newItem).State = EntityState.Detached;
                    }

                    // Set ID to default (assuming ID is an int)
                    newItem.ID = default(int);
                    newItem.UID = default(Guid);
                    // Attach the new entity to the context
                    db.Entry(newItem).State = EntityState.Added;
                    foreach (var attachment in item.Attachments)
                    {

                        // Create a new instance and copy the values
                        var newAttachment = new ContactAppointmentAttachment();
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
                        newItem.Attachments.Add(newAttachment);

                    }
                    oldest.Appointments.Add(newItem);
                }
            }


        }
        db.Entry(oldest).State = EntityState.Modified;
        await db.SaveChangesAsync();

        foreach (var contact in duplicates)
        {
            await Delete(contact.ID);
        }


        return oldest.ID;
    }

    private Contact CopyNonNullProperties(Contact source, Contact destination)
    {
        Type type = typeof(Contact);
        PropertyInfo[] properties = type.GetProperties();
        // List of property names to skip
        var propertiesToSkip = new HashSet<string>
    {
        "AssociatedCompanies",
        "AssociatedContacts"
    };
        foreach (PropertyInfo property in properties)
        {
            if (propertiesToSkip.Contains(property.Name))
                continue;

            // Special merge logic for collections
            if (property.Name == "Phones")
            {
                MergeJsonCollection<ContactPhone>(
                    source, destination, property,
                    x => x.Phone?.Trim().ToLowerInvariant()
                );
                continue;
            }

            if (property.Name == "Emails")
            {
                MergeJsonCollection<ContactEmail>(
                    source, destination, property,
                    x => x.Email?.Trim().ToLowerInvariant()
                );
                continue;
            }

            if (property.Name == "Addresses")
            {
                MergeJsonCollection<ContactAddress>(
                    source, destination, property,
                    x => $"{x.Street?.Trim().ToLowerInvariant()}|{x.City?.Trim().ToLowerInvariant()}|{x.PinCode?.Trim()}"
                );
                continue;
            }

            object sourceValue = property.GetValue(source);
            object destValue = property.GetValue(destination);

            if (sourceValue != null)
            {
                if (destValue == null || IsEmptyCollection(destValue))
                {
                    property.SetValue(destination, sourceValue);
                }
            }
        }

        return destination;
    }

    private bool IsEmptyCollection(object value)
    {
        if (value is System.Collections.IEnumerable enumerable && !(value is string))
        {
            foreach (var item in enumerable)
            {
                return false; // has at least one item
            }
            return true; // empty
        }
        return false; // not a collection
    }

    private void MergeJsonCollection<T>(
     Contact source,
     Contact destination,
     PropertyInfo property,
     Func<T, string> identifierSelector)
    {
        var sourceList = property.GetValue(source) as IEnumerable<T> ?? Enumerable.Empty<T>();
        var destinationList = property.GetValue(destination) as IEnumerable<T> ?? Enumerable.Empty<T>();

        var destinationDict = destinationList
            .Where(x => identifierSelector(x) != null)
            .ToDictionary(identifierSelector, x => x, StringComparer.OrdinalIgnoreCase);

        var mergedList = destinationList.ToList();

        foreach (var item in sourceList)
        {
            var identifier = identifierSelector(item);
            if (identifier == null) continue;

            if (destinationDict.TryGetValue(identifier, out var existingItem))
            {
                // Merge missing fields into the existing item
                CopyNonNullFields(item, existingItem);
            }
            else
            {
                mergedList.Add(item);
            }
        }

        property.SetValue(destination, mergedList);
    }

    private void CopyNonNullFields<T>(T source, T destination)
    {
        foreach (var prop in typeof(T).GetProperties())
        {
            var sourceValue = prop.GetValue(source);
            var destValue = prop.GetValue(destination);

            if (sourceValue != null && (destValue == null || IsEmptyCollection(destValue)))
            {
                prop.SetValue(destination, sourceValue);
            }
        }
    }
}