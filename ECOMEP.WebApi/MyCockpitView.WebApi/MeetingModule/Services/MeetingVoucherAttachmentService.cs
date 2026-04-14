using MyCockpitView.WebApi.MeetingModule.Entities;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.MeetingModule.Services;
public interface IMeetingVoucherAttachmentService : IBaseAttachmentService<MeetingVoucherAttachment>
{
}

public class MeetingVoucherAttachmentService : BaseAttachmentService<MeetingVoucherAttachment>, IMeetingVoucherAttachmentService
{

    public MeetingVoucherAttachmentService(EntitiesContext db) : base(db)
    {
    }


}