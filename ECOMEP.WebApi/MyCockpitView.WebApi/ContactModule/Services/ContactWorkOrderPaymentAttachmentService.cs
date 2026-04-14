using MyCockpitView.WebApi.Entities;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.ContactModule.Services;
public interface IContactWorkOrderPaymentAttachmentService : IBaseAttachmentService<ContactWorkOrderPaymentAttachment>
{
}

public class ContactWorkOrderPaymentAttachmentService : BaseAttachmentService<ContactWorkOrderPaymentAttachment>, IContactWorkOrderPaymentAttachmentService
{

    public ContactWorkOrderPaymentAttachmentService(EntitiesContext db) : base(db)
    {
    }

}