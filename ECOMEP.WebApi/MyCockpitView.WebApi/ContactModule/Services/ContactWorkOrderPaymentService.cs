using MyCockpitView.WebApi.Entities;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.ContactModule.Services;

public interface IContactWorkOrderPaymentService : IBaseEntityService<ContactWorkOrderPayment>
{
}

public class ContactWorkOrderPaymentService : BaseEntityService<ContactWorkOrderPayment>, IContactWorkOrderPaymentService
{
    public ContactWorkOrderPaymentService(EntitiesContext db) : base(db) { }
}