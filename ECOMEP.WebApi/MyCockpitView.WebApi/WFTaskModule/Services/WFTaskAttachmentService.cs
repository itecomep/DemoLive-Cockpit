using MyCockpitView.WebApi.WFTaskModule.Entities;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.WFTaskModule.Services;
public interface IWFTaskAttachmentService : IBaseAttachmentService<WFTaskAttachment>
{
}

public class WFTaskAttachmentService : BaseAttachmentService<WFTaskAttachment>, IWFTaskAttachmentService
{

    public WFTaskAttachmentService(EntitiesContext db) : base(db)
    {
    }

}