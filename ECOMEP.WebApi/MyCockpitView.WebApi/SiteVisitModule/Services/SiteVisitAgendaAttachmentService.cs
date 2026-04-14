using MyCockpitView.WebApi.SiteVisitModule.Entities;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.SiteVisitModule.Services;
public interface ISiteVisitAgendaAttachmentService : IBaseAttachmentService<SiteVisitAgendaAttachment>
{
}

public class SiteVisitAgendaAttachmentService : BaseAttachmentService<SiteVisitAgendaAttachment>, ISiteVisitAgendaAttachmentService
{

    public SiteVisitAgendaAttachmentService(EntitiesContext db) : base(db)
    {
    }


}