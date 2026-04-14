using MyCockpitView.WebApi.ContactModule.Entities;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.ContactModule.Services;
public interface IContactAttachmentService : IBaseAttachmentService<ContactAttachment>
{
}

public class ContactAttachmentService : BaseAttachmentService<ContactAttachment>, IContactAttachmentService
{

    public ContactAttachmentService(EntitiesContext db) : base(db)
    {
    }

}