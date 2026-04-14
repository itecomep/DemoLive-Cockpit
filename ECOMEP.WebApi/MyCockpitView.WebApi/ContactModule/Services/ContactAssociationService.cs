

using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.ContactModule.Entities;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.ContactModule.Services;

public interface IContactAssociationService : IBaseEntityService<ContactAssociation>
{
}

public class ContactAssociationService : BaseEntityService<ContactAssociation>, IContactAssociationService
{
   
    public ContactAssociationService(EntitiesContext db) : base(db)
    {
    }
}