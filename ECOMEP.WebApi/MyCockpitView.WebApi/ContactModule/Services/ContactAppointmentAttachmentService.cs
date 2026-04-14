using MyCockpitView.WebApi.ContactModule.Entities;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.ContactModule.Services;
public interface IContactAppointmentAttachmentService : IBaseAttachmentService<ContactAppointmentAttachment>
{
}

public class ContactAppointmentAttachmentService : BaseAttachmentService<ContactAppointmentAttachment>, IContactAppointmentAttachmentService
{

    public ContactAppointmentAttachmentService(EntitiesContext db) : base(db)
    {
    }

}