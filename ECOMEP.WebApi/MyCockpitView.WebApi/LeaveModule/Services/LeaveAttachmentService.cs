using MyCockpitView.WebApi.LeaveModule.Entities;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.LeaveModule.Services;

public interface ILeaveAttachmentService : IBaseAttachmentService<LeaveAttachment>
{
}
public class LeaveAttachmentService : BaseAttachmentService<LeaveAttachment>, ILeaveAttachmentService
{
    public LeaveAttachmentService(EntitiesContext db) : base(db)
    {
    }
}
