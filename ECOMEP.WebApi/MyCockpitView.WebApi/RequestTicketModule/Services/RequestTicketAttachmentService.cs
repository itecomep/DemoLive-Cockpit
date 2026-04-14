using MyCockpitView.WebApi.RequestTicketModule.Entities;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.RequestTicketModule.Services;
public interface IRequestTicketAttachmentService : IBaseAttachmentService<RequestTicketAttachment>
{
}

public class RequestTicketAttachmentService : BaseAttachmentService<RequestTicketAttachment>, IRequestTicketAttachmentService
{

    public RequestTicketAttachmentService(EntitiesContext db) : base(db)
    {
    }


}