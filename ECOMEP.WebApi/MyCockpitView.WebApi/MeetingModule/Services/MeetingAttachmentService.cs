using MyCockpitView.WebApi.MeetingModule.Entities;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.MeetingModule.Services;
public interface IMeetingAttachmentService : IBaseAttachmentService<MeetingAttachment>
{
}

public class MeetingAttachmentService : BaseAttachmentService<MeetingAttachment>, IMeetingAttachmentService
{

    public MeetingAttachmentService(EntitiesContext db) : base(db)
    {
    }


}