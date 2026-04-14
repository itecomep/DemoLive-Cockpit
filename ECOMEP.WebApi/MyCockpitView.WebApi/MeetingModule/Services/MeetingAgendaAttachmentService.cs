using MyCockpitView.WebApi.MeetingModule.Entities;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.MeetingModule.Services;
public interface IMeetingAgendaAttachmentService : IBaseAttachmentService<MeetingAgendaAttachment>
{
}

public class MeetingAgendaAttachmentService : BaseAttachmentService<MeetingAgendaAttachment>, IMeetingAgendaAttachmentService
{

    public MeetingAgendaAttachmentService(EntitiesContext db) : base(db)
    {
    }


}