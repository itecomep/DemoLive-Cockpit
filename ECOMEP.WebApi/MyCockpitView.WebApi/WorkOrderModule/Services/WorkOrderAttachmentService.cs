using MyCockpitView.WebApi.WorkOrderModule.Entities;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.WorkOrderModule.Services;
public interface IWorkOrderAttachmentService : IBaseAttachmentService<WorkOrderAttachment>
{
}

public class WorkOrderAttachmentService : BaseAttachmentService<WorkOrderAttachment>, IWorkOrderAttachmentService
{

    public WorkOrderAttachmentService(EntitiesContext db) : base(db)
    {
    }


}