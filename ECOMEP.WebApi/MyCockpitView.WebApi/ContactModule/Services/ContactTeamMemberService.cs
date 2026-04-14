using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.ContactModule.Entities;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.ContactModule.Services;
public interface IContactTeamMemberService : IBaseEntityService<ContactTeamMember>
{
}

public class ContactTeamMemberService : BaseEntityService<ContactTeamMember>, IContactTeamMemberService
{

    public ContactTeamMemberService(EntitiesContext db) : base(db)
    {
    }


}